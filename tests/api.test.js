// Verify the HTTP contract, JSON transport, validation, and exact catalog mapping.
import test from "node:test";
import assert from "node:assert/strict";
import { after } from "node:test";
import { createServer } from "vite";
const server = await createServer({
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
});
after(() => server.close());
const { default: productsHandler } =
  await server.ssrLoadModule("/api/products.ts");
const { products } = await server.ssrLoadModule(
  "/src/features/products/products.data.ts",
);
const { toProduct, getProducts } = await server.ssrLoadModule(
  "/src/features/products/products.api.ts",
);
const { ApiError, fetchJson, isRecord } = await server.ssrLoadModule(
  "/src/shared/api/client.ts",
);

// Decode a small response without trusting the generic type parameter alone.
function decodeMessage(value) {
  if (!isRecord(value) || typeof value.message !== "string")
    throw new Error("Missing message");
  return { message: value.message };
}

// Read the actual function's payload to keep fixtures aligned with existing game values.
async function payload() {
  return productsHandler
    .fetch(new Request("http://localhost/api/products"))
    .json();
}

test("GET returns JSON, integer cents, optional artwork, and all 12 original products", async () => {
  const response = productsHandler.fetch(
    new Request("http://localhost/api/products"),
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/json/);
  const body = await response.json();
  assert.equal(body.total, 12);
  assert.deepEqual(body.items.map(toProduct), products);
  assert.ok(body.items.every((item) => Number.isSafeInteger(item.price_cents)));
});

test("unsupported methods return JSON 405 with the Allow header", async () => {
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"]) {
    const response = productsHandler.fetch(
      new Request("http://localhost/api/products", { method }),
    );
    assert.equal(response.status, 405);
    assert.equal(response.headers.get("allow"), "GET");
    assert.match((await response.json()).error, /Use GET/);
  }
});

test("toProduct maps title, genre, cents, and optional fields without mutating input", async () => {
  const raw = (await payload()).items[0];
  const input = { ...raw, price_cents: 1234, badge: "Demo", color: "mint" };
  const before = structuredClone(input);
  const mapped = toProduct(input);
  assert.equal(mapped.name, input.title);
  assert.equal(mapped.category, input.category_name);
  assert.equal(mapped.developer, input.developer);
  assert.equal(mapped.price, 12.34);
  assert.equal(mapped.image, input.image);
  assert.equal(mapped.description, input.description);
  assert.equal(mapped.featuredImage, input.featured_image);
  assert.equal(mapped.badge, "Demo");
  assert.equal(mapped.color, "mint");
  assert.deepEqual(input, before);
  assert.equal(toProduct({ ...raw, price_cents: 0 }).price, 0);
  assert.equal(toProduct({ ...raw, price_cents: 1 }).price, 0.01);
});

test("toProduct rejects invalid prices, genres, fields, and unsafe image paths", async () => {
  const raw = (await payload()).items[0];
  for (const value of [
    null,
    {},
    { ...raw, price_cents: -1 },
    { ...raw, price_cents: 1.5 },
    { ...raw, price_cents: "3999" },
    { ...raw, price_cents: Infinity },
    { ...raw, category_name: "Unknown" },
    { ...raw, title: "" },
    { ...raw, image: "javascript:alert(1)" },
    { ...raw, featured_image: "/images/games/../secret.jpg" },
  ]) {
    assert.throws(() => toProduct(value), /Invalid API product/);
  }
});

test("fetchJson performs a real-shaped GET and decodes successful JSON", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "/api/example");
    assert.equal(options.headers.get("Accept"), "application/json");
    return Response.json({ message: "ok" });
  });
  assert.deepEqual(await fetchJson("/api/example", decodeMessage), {
    message: "ok",
  });
});

test("fetchJson retains HTTP status and server errors, including non-JSON failures", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ error: "Unavailable" }, { status: 503 }),
  );
  await assert.rejects(
    fetchJson("/api/products", decodeMessage),
    (error) =>
      error instanceof ApiError &&
      error.status === 503 &&
      error.message === "Unavailable",
  );
  globalThis.fetch = async () =>
    new Response("<h1>Not found</h1>", { status: 404 });
  await assert.rejects(
    fetchJson("/missing", decodeMessage),
    (error) => error instanceof ApiError && error.status === 404,
  );
});

test("fetchJson distinguishes network failures, invalid JSON, and invalid decoded data", async (t) => {
  t.mock.method(globalThis, "fetch", async () => {
    throw new TypeError("offline");
  });
  await assert.rejects(
    fetchJson("/api/products", decodeMessage),
    (error) => error instanceof ApiError && error.status === 0,
  );
  globalThis.fetch = async () => new Response("broken JSON");
  await assert.rejects(
    fetchJson("/api/products", decodeMessage),
    (error) => error instanceof ApiError && /invalid JSON/.test(error.message),
  );
  globalThis.fetch = async () => Response.json({ unexpected: true });
  await assert.rejects(
    fetchJson("/api/products", decodeMessage),
    (error) => error instanceof ApiError && /invalid data/.test(error.message),
  );
});

test("getProducts validates response totals and duplicate IDs before mapping", async (t) => {
  const body = await payload();
  t.mock.method(globalThis, "fetch", async () => Response.json(body));
  assert.deepEqual(await getProducts(), products);
  for (const invalid of [
    { items: body.items, total: 1 },
    { items: [body.items[0], body.items[0]], total: 2 },
    { items: "not an array", total: 12 },
  ]) {
    globalThis.fetch = async () => Response.json(invalid);
    await assert.rejects(getProducts(), ApiError);
  }
});
