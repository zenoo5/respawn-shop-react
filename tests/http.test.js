import assert from "node:assert/strict";
import test from "node:test";
import { createServer } from "vite";

test("local API serves HTTP success, failure/retry and empty responses", async (t) => {
  for (const mode of ["development", "checkpoint-error", "checkpoint-empty"]) {
    await t.test(mode, async () => {
      const server = await createServer({
        mode,
        server: {
          host: "127.0.0.1",
          port: 0,
          strictPort: false,
          hmr: false,
          ws: false,
        },
        optimizeDeps: { noDiscovery: true, include: [] },
      });
      try {
        await server.listen();
        const address = server.httpServer.address();
        assert.equal(typeof address, "object");
        assert.ok(address);
        const endpoint = `http://127.0.0.1:${address.port}/api/products`;
        let response = await fetch(endpoint);
        if (mode === "checkpoint-error") {
          assert.equal(response.status, 503);
          assert.match((await response.json()).error, /first request fails/);
          response = await fetch(endpoint);
        }
        assert.equal(response.status, 200);
        assert.match(response.headers.get("Content-Type"), /application\/json/);
        const body = await response.json();
        assert.equal(body.total, mode === "checkpoint-empty" ? 0 : 12);
        assert.equal(body.items.length, body.total);
        const rejected = await fetch(endpoint, { method: "POST" });
        assert.equal(rejected.status, 405);
        assert.equal(rejected.headers.get("Allow"), "GET");
      } finally {
        await server.close();
      }
    });
  }
});
