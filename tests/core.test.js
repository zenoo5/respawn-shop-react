import assert from "node:assert/strict";
import { after, test } from "node:test";
import { createServer } from "vite";
const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
});
after(() => server.close());
const { products } = await server.ssrLoadModule(
  "/src/features/products/products.data.ts",
);
const { selectProducts } = await server.ssrLoadModule(
  "/src/features/products/catalog.ts",
);
const { addItem, decreaseItem, removeItem, getCartTotals, MAX_QUANTITY } =
  await server.ssrLoadModule("/src/features/cart/cart.ts");
const { loadCart, saveCart, CART_STORAGE_KEY } = await server.ssrLoadModule(
  "/src/features/cart/cart.storage.ts",
);
test("search, genre and sorting compose without mutating the catalog", () => {
  const original = products.map((game) => game.id);
  const results = selectProducts(products, {
    search: "  wI  ",
    category: "RPG",
    sort: "price-desc",
  });
  assert.deepEqual(
    results.map((game) => game.id),
    ["the-witcher-3-wild-hunt"],
  );
  const sorted = selectProducts(products, {
    category: "RPG",
    sort: "price-asc",
  });
  assert.ok(
    sorted.every(
      (game, index) => index === 0 || sorted[index - 1].price <= game.price,
    ),
  );
  const descending = selectProducts(products, { sort: "price-desc" });
  assert.ok(
    descending.every(
      (game, index) => index === 0 || descending[index - 1].price >= game.price,
    ),
  );
  assert.deepEqual(
    products.map((game) => game.id),
    original,
  );
  assert.deepEqual(
    selectProducts(products, { search: "no matching title" }),
    [],
  );
  assert.deepEqual(selectProducts([]), []);
});
test("cart updates are immutable, bounded and calculate exact cents", () => {
  const initial = [{ id: "cyberpunk-2077", quantity: 1 }];
  const added = addItem(initial, "cyberpunk-2077", products);
  assert.equal(initial[0].quantity, 1);
  assert.equal(added[0].quantity, 2);
  assert.deepEqual(getCartTotals(added, products), {
    count: 2,
    totalCents: 7998,
  });
  assert.deepEqual(decreaseItem(added, "cyberpunk-2077"), initial);
  assert.deepEqual(decreaseItem(initial, "cyberpunk-2077"), []);
  assert.deepEqual(removeItem(added, "cyberpunk-2077"), []);
  assert.deepEqual(addItem(initial, "unknown", products), initial);
  assert.equal(
    addItem(
      [{ id: "cyberpunk-2077", quantity: MAX_QUANTITY }],
      "cyberpunk-2077",
      products,
    )[0].quantity,
    MAX_QUANTITY,
  );
  assert.deepEqual(getCartTotals([{ id: "unknown", quantity: 2 }], products), {
    count: 0,
    totalCents: 0,
  });
});
test("storage rejects invalid data, merges duplicates and handles blocked storage", () => {
  let saved = JSON.stringify([
    { id: "stray", quantity: 2 },
    { id: "stray", quantity: 3 },
    { id: "unknown", quantity: 1 },
    { id: "elden-ring", quantity: -1 },
    null,
  ]);
  const storage = {
    getItem: () => saved,
    setItem: (key, value) => {
      assert.equal(key, CART_STORAGE_KEY);
      saved = value;
    },
  };
  assert.deepEqual(loadCart(products, storage), [{ id: "stray", quantity: 5 }]);
  assert.equal(saveCart([{ id: "stray", quantity: 1 }], storage), true);
  assert.deepEqual(loadCart(products, storage), [{ id: "stray", quantity: 1 }]);
  saved = "{broken";
  assert.deepEqual(loadCart(products, storage), []);
  saved = "{}";
  assert.deepEqual(loadCart(products, storage), []);
  const blocked = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  assert.deepEqual(loadCart(products, blocked), []);
  assert.equal(saveCart([], blocked), false);
});
test("every catalog artwork path points to a local file", async () => {
  const { access } = await import("node:fs/promises");
  for (const game of products) {
    await access(`public${game.image}`);
    if (game.featuredImage) await access(`public${game.featuredImage}`);
  }
});
