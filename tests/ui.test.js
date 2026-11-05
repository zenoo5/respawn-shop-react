import assert from "node:assert/strict";
import { after, beforeEach, test } from "node:test";
import { JSDOM } from "jsdom";
import { createServer } from "vite";
import { act, createElement } from "react";

const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { url: "http://localhost" },
);
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLDialogElement",
  "Event",
  "KeyboardEvent",
  "MouseEvent",
  "localStorage",
]) {
  Object.defineProperty(globalThis, key, {
    value: dom.window[key],
    configurable: true,
  });
}
const { createRoot } = await import("react-dom/client");
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// jsdom has no native modal implementation. Browser focus trapping is checked separately.
dom.window.HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
dom.window.HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
});
after(async () => {
  await server.close();
  dom.window.close();
});
const { default: App } = await server.ssrLoadModule("/src/app/App.tsx");
const { Catalog } = await server.ssrLoadModule(
  "/src/features/products/components/Catalog.tsx",
);
const { default: productsHandler } =
  await server.ssrLoadModule("/api/products.ts");
beforeEach((t) => {
  t.mock.method(globalThis, "fetch", async (url) =>
    productsHandler.fetch(new Request(new URL(url, "http://localhost"))),
  );
});
const container = document.getElementById("root");
function button(name) {
  const match = [...container.querySelectorAll("button")].find(
    (element) =>
      element.getAttribute("aria-label") === name ||
      element.textContent === name,
  );
  assert.ok(match, `Button ${name} exists`);
  return match;
}
async function click(element) {
  await act(() => element.click());
}
async function input(element, value) {
  const setter = Object.getOwnPropertyDescriptor(
    dom.window.HTMLInputElement.prototype,
    "value",
  ).set;
  await act(() => {
    setter.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
test("browse, filter, cart quantities, persistence and empty states work together", async () => {
  let root = createRoot(container);
  await act(() => root.render(createElement(App)));
  assert.equal(container.querySelectorAll("h1").length, 1);
  assert.equal(container.querySelectorAll(".product-card").length, 12);
  await click(button("Filter +"));
  const genre = container.querySelector("#category");
  await act(() => {
    genre.value = "RPG";
    genre.dispatchEvent(new Event("change", { bubbles: true }));
  });
  assert.equal(container.querySelectorAll(".product-card").length, 5);
  const sort = container.querySelector("#sort");
  await act(() => {
    sort.value = "price-asc";
    sort.dispatchEvent(new Event("change", { bubbles: true }));
  });
  assert.match(
    container.querySelector(".product-card h3").textContent,
    /Witcher/,
  );
  await act(() =>
    container
      .querySelector("#filter-panel")
      .dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      ),
  );
  assert.equal(container.querySelector("#filter-panel"), null);
  await input(container.querySelector("#search"), "zzzz");
  assert.equal(container.querySelectorAll(".product-card").length, 0);
  assert.match(container.textContent, /No games found/);
  await click(button("Reset filters"));
  assert.equal(container.querySelectorAll(".product-card").length, 12);
  await click(button("Add Cyberpunk 2077 to cart"));
  await click(button("Open cart, 1 items"));
  assert.ok(container.querySelector("dialog").hasAttribute("open"));
  await click(button("Increase Cyberpunk 2077 quantity"));
  assert.equal(
    container.querySelector(".total-row strong").textContent,
    "$79.98",
  );
  await click(button("Decrease Cyberpunk 2077 quantity"));
  assert.equal(
    container.querySelector(".total-row strong").textContent,
    "$39.99",
  );
  await act(() => root.unmount());
  root = createRoot(container);
  await act(() => root.render(createElement(App)));
  assert.ok(button("Open cart, 1 items"));
  await click(button("Open cart, 1 items"));
  await click(button("Remove Cyberpunk 2077"));
  assert.match(
    container.querySelector("dialog").textContent,
    /Your cart is empty/,
  );
  await click(button("Continue shopping ↗"));
  assert.equal(container.querySelector("dialog").hasAttribute("open"), false);
  await act(() => root.unmount());
});
test("an empty local catalog has a useful empty state", async () => {
  const root = createRoot(container);
  await act(() =>
    root.render(createElement(Catalog, { products: [], onAdd() {} })),
  );
  assert.match(container.textContent, /No games available/);
  await act(() => root.unmount());
});

test("blocked storage keeps cart updates usable and reports the persistence error", async () => {
  const workingStorage = globalThis.localStorage;
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem() {
        throw new Error("Storage blocked");
      },
      setItem() {
        throw new Error("Storage blocked");
      },
    },
  });
  const root = createRoot(container);
  try {
    await act(() => root.render(createElement(App)));
    await click(button("Add Cyberpunk 2077 to cart"));
    await click(button("Open cart, 1 items"));
    assert.equal(
      container.querySelector(".total-row strong").textContent,
      "$39.99",
    );
    assert.match(
      container.querySelector('[role="alert"]').textContent,
      /could not save/,
    );
    await click(button("Clear cart"));
    assert.match(
      container.querySelector("dialog").textContent,
      /Your cart is empty/,
    );
  } finally {
    await act(() => root.unmount());
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: workingStorage,
    });
  }
});

test("loading, error/retry and success use HTTP results without overwriting saved carts", async (t) => {
  const saved = JSON.stringify([{ id: "stray", quantity: 2 }]);
  localStorage.setItem("respawn-shop-cart-v1", saved);
  let resolveRequest;
  const pending = new Promise((resolve) => {
    resolveRequest = resolve;
  });
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests += 1;
    return requests === 1
      ? pending
      : productsHandler.fetch(new Request("http://localhost/api/products"));
  });
  const root = createRoot(container);
  try {
    await act(() => root.render(createElement(App)));
    assert.match(container.textContent, /Loading games/);
    assert.equal(
      container.querySelector("#catalog").getAttribute("aria-busy"),
      "true",
    );
    assert.equal(container.querySelectorAll(".product-card").length, 0);
    assert.equal(localStorage.getItem("respawn-shop-cart-v1"), saved);
    await act(async () => {
      resolveRequest(
        Response.json({ error: "Service unavailable" }, { status: 503 }),
      );
      await pending;
    });
    assert.match(
      container.querySelector('[role="alert"]').textContent,
      /Service unavailable/,
    );
    assert.equal(localStorage.getItem("respawn-shop-cart-v1"), saved);
    await click(button("Try again"));
    assert.equal(requests, 2);
    assert.equal(container.querySelectorAll(".product-card").length, 12);
    await click(button("Open cart, 2 items"));
    assert.match(container.querySelector("dialog").textContent, /Stray/);
    assert.equal(
      container.querySelector(".total-row strong").textContent,
      "$39.98",
    );
  } finally {
    await act(() => root.unmount());
    localStorage.clear();
  }
});

test("an empty API response can be checked again and never clears persisted cart entries", async (t) => {
  const saved = JSON.stringify([{ id: "stray", quantity: 1 }]);
  localStorage.setItem("respawn-shop-cart-v1", saved);
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests += 1;
    return requests === 1
      ? Response.json({ items: [], total: 0 })
      : productsHandler.fetch(new Request("http://localhost/api/products"));
  });
  const root = createRoot(container);
  try {
    await act(() => root.render(createElement(App)));
    assert.match(container.textContent, /No games available/);
    assert.equal(container.querySelectorAll(".product-card").length, 0);
    assert.equal(localStorage.getItem("respawn-shop-cart-v1"), saved);
    await click(button("Check again"));
    assert.equal(container.querySelectorAll(".product-card").length, 12);
    assert.ok(button("Open cart, 1 items"));
  } finally {
    await act(() => root.unmount());
    localStorage.clear();
  }
});

test("unmounted requests cannot replace a newer successful request", async (t) => {
  let resolveRequest;
  const pending = new Promise((resolve) => {
    resolveRequest = resolve;
  });
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests += 1;
    return requests === 1
      ? pending
      : productsHandler.fetch(new Request("http://localhost/api/products"));
  });
  let root = createRoot(container);
  await act(() => root.render(createElement(App)));
  await act(() => root.unmount());
  root = createRoot(container);
  try {
    await act(() => root.render(createElement(App)));
    assert.equal(container.querySelectorAll(".product-card").length, 12);
    await act(async () => {
      resolveRequest(Response.json({ items: [], total: 0 }));
      await pending;
    });
    assert.equal(container.querySelectorAll(".product-card").length, 12);
  } finally {
    await act(() => root.unmount());
  }
});
