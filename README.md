# Respawn Shop

React + TypeScript storefront demo with the original Citrus Shift design and local catalog from `respawn-shop`. No API, backend, payments, or account system.

## Development

Use Node.js 24 and run `npm install`, then `npm run dev`.

- `npm run check`: strict typechecking, Oxlint, formatting, and tests without generating `dist/`.
- `npm test`: cart calculations, storage validation, composed filtering/sorting, and React interactions using Node's test runner and jsdom.
- `npm run format`: format application files.
- `npm run build`: explicitly create a production build when needed.

## Structure

- `src/app`: application composition.
- `src/components`: shared navigation and shopping controls.
- `src/features/products`: original typed demo catalog, pure filtering/sorting, hero, featured game, and catalog components.
- `src/features/cart`: pure cart transformations, validated localStorage helpers, state hook, and native modal cart.
- `src/shared/utils`: currency formatting.
- `src/styles`: responsive Citrus Shift styling.

The existing `respawn-shop-cart-v1` storage format is preserved. Invalid entries and unknown products are discarded; unavailable storage keeps the cart usable for the current visit and reports save failures. Quantities are capped at 999 and totals use integer cents.

Catalog data is synchronous and local, so there is no artificial request/loading state or API mapping. Empty catalog/search states and storage errors are handled. Add request-state handling and mapping tests if a future API is introduced.

The original project's current catalog uses 12 real games; their names, demo prices, and images are preserved. Artwork attribution is in `public/images/games/SOURCES.md`. Prices are illustrative and no games are sold. Fonts are loaded from Google Fonts with local fallbacks.

Registry access was unavailable during implementation, so Prettier and jsdom were reused from the adjacent project's installed packages with their original registry lock entries. Tests currently use Node's built-in runner and jsdom; Vitest and React Testing Library could not be installed in this environment.
