import react from "@vitejs/plugin-react";
// Serve the same Vercel handler locally alongside Vite without a second server.
import { defineConfig } from "vite";
import productsHandler from "./api/products.js";

const CHECKPOINT_DELAY_MS = 8000;

export default defineConfig(({ mode }) => ({
  // Same-origin requests need no CORS middleware intercepting OPTIONS before the API.
  server: { host: "127.0.0.1", port: 5173, strictPort: true, cors: false },
  plugins: [
    react(),
    {
      name: "respawn-local-api",
      apply: "serve",
      // Adapt Node HTTP requests to the function's standard Request/Response contract.
      configureServer(server) {
        let failNextRequest = mode === "checkpoint-error";
        server.middlewares.use(async (request, response, next) => {
          const url = new URL(request.url ?? "/", "http://localhost");
          if (url.pathname !== "/api/products") {
            next();
            return;
          }
          try {
            let result: Response;
            // Checkpoint scenarios exist only in this serve-only plugin, never in the deployed API.
            if (request.method === "GET" && mode === "checkpoint-empty") {
              result = Response.json({ items: [], total: 0 });
            } else if (request.method === "GET" && failNextRequest) {
              failNextRequest = false;
              result = Response.json(
                { error: "Checkpoint: the first request fails. Try again." },
                { status: 503 },
              );
            } else {
              if (request.method === "GET" && mode === "checkpoint-loading") {
                await new Promise((resolve) =>
                  setTimeout(resolve, CHECKPOINT_DELAY_MS),
                );
              }
              result = productsHandler.fetch(
                new Request(url, { method: request.method ?? "GET" }),
              );
            }
            response.statusCode = result.status;
            result.headers.forEach((value, name) =>
              response.setHeader(name, value),
            );
            response.end(await result.text());
          } catch {
            response.statusCode = 500;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ error: "Unable to load products." }));
          }
        });
      },
    },
  ],
}));
