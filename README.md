# Respawn Shop

A React + TypeScript PC game storefront built with Vite and the Citrus Shift visual identity. It preserves the original catalog, artwork, and Day 3 API implementation while using React components, hooks, typed Props, and localStorage cart persistence.

The catalog contains 12 real games with illustrative USD prices. This is a non-commercial demo: no payments, downloads, game keys, or accounts are provided. Artwork credits are in [SOURCES.md](public/images/games/SOURCES.md). Design colors, typography, and responsive behavior are defined in [DESIGN.md](DESIGN.md).

## Getting started

Use Node.js 24:

```sh
npm install
npm run dev
```

Vite serves the application and the local products endpoint at `http://127.0.0.1:5173`. The port is configured with `strictPort`, so an occupied port must be freed or explicitly overridden.

| Command                | Purpose                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| `npm run dev`          | Start React and the local API adapter.                                                        |
| `npm run typecheck`    | Check the application and tooling with strict TypeScript.                                     |
| `npm run lint`         | Run Oxlint.                                                                                   |
| `npm run format:check` | Check formatting with Prettier.                                                               |
| `npm run format`       | Format the configured project files.                                                          |
| `npm test`             | Run API, HTTP, business-logic, and React interaction tests with Node's test runner and jsdom. |
| `npm run check`        | Run typechecking, linting, formatting checks, and tests.                                      |
| `npm run build`        | Explicitly generate a production build in `dist/`.                                            |
| `npm run preview`      | Preview an existing production build; this does not run the local API adapter.                |
| `npm run prepare`      | Activate Husky hooks for this Git checkout.                                                   |
| `npm run lint:staged`  | Run the configured checks and fixes on staged files.                                          |

Routine checks do not generate `dist/`. The current test setup uses Node's built-in runner and jsdom, rather than Vitest or React Testing Library. TypeScript strict mode remains enabled; `erasableSyntaxOnly` is disabled to preserve the original `ApiError` constructor's parameter property.

## Complete component tree

[src/main.tsx](src/main.tsx) mounts `App` inside React `StrictMode` and imports [global.css](src/styles/global.css). The tree below shows custom components; HTML elements and React fragments are omitted.

```text
App — src/app/App.tsx
├── When state.status === "success":
│   └── Storefront — src/app/Storefront.tsx
│       ├── Navigation — src/components/layout/Navigation.tsx
│       │   ├── Icon (home) — src/components/ui/Icon.tsx
│       │   ├── Icon (browse)
│       │   └── Icon (cart)
│       ├── PageLayout — src/components/layout/PageLayout.tsx
│       │   ├── Hero — src/features/products/components/Highlights.tsx
│       │   ├── FeaturedGame — same Highlights.tsx; only if Cyberpunk 2077 exists
│       │   │   └── AddToCart — src/components/ui/AddToCart.tsx
│       │   └── Catalog — src/features/products/components/Catalog.tsx
│       │       └── AddToCart — once per visible product
│       └── CartPanel — src/features/cart/components/CartPanel.tsx
└── When state.status is "loading", "error", or "empty":
    └── PageLayout — src/components/layout/PageLayout.tsx
        ├── Hero — receives an empty products array
        └── ProductStatus — src/features/products/components/ProductStatus.tsx
```

`PageLayout` renders the skip link, header, main content through `children`, and footer. `Hero` and `FeaturedGame` are two named components in one file. Catalog cards and cart rows are rendered directly inside `Catalog` and `CartPanel`; there are no separate `ProductCard` or `CartItem` components. `CartPanel` remains mounted in the successful storefront and synchronizes its native dialog with the `open` prop.

## Component Props

The following names and types match the component declarations. [products.types.ts](src/features/products/products.types.ts) defines `Product` and `LoadState<T>`; [cart.types.ts](src/features/cart/cart.types.ts) defines `CartItem` and `CartTotals`. `ReactNode` comes from React.

| Component and source file                                                                 | Props                                                                                | How they are used                                                                                                                  |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `App` — [App.tsx](src/app/App.tsx)                                                        | None.                                                                                | Calls `useProducts()` and selects the request-state branch.                                                                        |
| `Storefront` — [Storefront.tsx](src/app/Storefront.tsx)                                   | `products: Product[]`                                                                | Receives `state.data` from `App`; shares fetched products and cart callbacks with its descendants.                                 |
| `PageLayout` — [PageLayout.tsx](src/components/layout/PageLayout.tsx)                     | `children: ReactNode`                                                                | Places the supplied components inside the common page shell.                                                                       |
| `Navigation` — [Navigation.tsx](src/components/layout/Navigation.tsx)                     | `count: number`, `cartOpen: boolean`, `onOpenCart: () => void`                       | Displays total cart quantity, indicates modal visibility, and requests that `Storefront` open the cart.                            |
| `Icon` — [Icon.tsx](src/components/ui/Icon.tsx)                                           | `name: "home"` or `"browse"` or `"cart"`                                             | Chooses the corresponding SVG paths.                                                                                               |
| `Hero` — [Highlights.tsx](src/features/products/components/Highlights.tsx)                | `products: Product[]`                                                                | Finds its five configured game IDs in the supplied products; missing games are omitted.                                            |
| `FeaturedGame` — [Highlights.tsx](src/features/products/components/Highlights.tsx)        | `product: Product`, `onAdd: (id: string) => void`                                    | Shows the selected game's artwork, category, title, and price; forwards its add action to `AddToCart`.                             |
| `Catalog` — [Catalog.tsx](src/features/products/components/Catalog.tsx)                   | `products: Product[]`, `onAdd: (id: string) => void`                                 | Filters and sorts the supplied games, renders cards, and passes the add callback to each card's button.                            |
| `AddToCart` — [AddToCart.tsx](src/components/ui/AddToCart.tsx)                            | `product: Product`, `onAdd: (id: string) => void`, `compact?: boolean`               | Calls `onAdd(product.id)`. `compact` defaults to `false`; catalog buttons pass `true`, while the featured button uses the default. |
| `ProductStatus` — [ProductStatus.tsx](src/features/products/components/ProductStatus.tsx) | `state: Exclude<LoadState<Product[]>, { status: "success" }>`, `onRetry: () => void` | Shows loading feedback, an error and retry button, or an empty catalog and recheck button.                                         |
| `CartPanel` — [CartPanel.tsx](src/features/cart/components/CartPanel.tsx)                 | Detailed below.                                                                      | Receives all cart data and actions from `Storefront`; owns no cart state.                                                          |

### CartPanel Props

| Prop           | Type                   | Value supplied by Storefront                                |
| -------------- | ---------------------- | ----------------------------------------------------------- |
| `products`     | `Product[]`            | The fetched catalog, used to resolve each saved product ID. |
| `open`         | `boolean`              | `cartOpen`.                                                 |
| `onClose`      | `() => void`           | Sets `cartOpen` to `false`.                                 |
| `items`        | `CartItem[]`           | `cart.items`, containing IDs and quantities.                |
| `totals`       | `CartTotals`           | Derived `cart.totals`, containing `count` and `totalCents`. |
| `onAdd`        | `(id: string) => void` | `cart.add`, also used to increase a quantity.               |
| `onDecrease`   | `(id: string) => void` | `cart.decrease`.                                            |
| `onRemove`     | `(id: string) => void` | `cart.remove`.                                              |
| `onClear`      | `() => void`           | `cart.clear`.                                               |
| `storageError` | `boolean`              | Whether the most recent save failed.                        |
| `message`      | `string`               | The latest cart action announcement.                        |

## State ownership

| Owner and file                                                                            | State                                      | Initial value and updates                                                                                                                         |
| ----------------------------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useProducts()` — [useProducts.ts](src/features/products/useProducts.ts), called by `App` | `state: LoadState<Product[]>`              | Starts as `{ status: "loading" }`. A request produces `success` with `data`, `error` with `message`, or `empty`. `retry()` returns it to loading. |
| `useProducts()` — same file                                                               | `attempt: number`                          | Starts at `0`. `retry()` increments it to rerun the fetching effect.                                                                              |
| `Storefront` — [Storefront.tsx](src/app/Storefront.tsx)                                   | `cartOpen: boolean`                        | Starts at `false`. Navigation opens the cart; dialog dismissal and its close/continue controls close it.                                          |
| `useCart(products)` — [useCart.ts](src/features/cart/useCart.ts), called by `Storefront`  | `items: CartItem[]`                        | Lazily initialized by `loadCart(products)`. Add, decrease, remove, and clear actions replace the array.                                           |
| `useCart(products)` — same file                                                           | `storageError: boolean`                    | Starts at `false`. Each cart action replaces it with the inverse of `saveCart(next)`'s result.                                                    |
| `useCart(products)` — same file                                                           | `message: string`                          | Starts as an empty string. Each cart action sets an announcement consumed by `CartPanel` and the storefront's live status text.                   |
| `Navigation` — [Navigation.tsx](src/components/layout/Navigation.tsx)                     | `location: string`                         | Starts from `window.location.hash`, falling back to `"#home"`. A `hashchange` subscription updates it and is removed on cleanup.                  |
| `Catalog` — [Catalog.tsx](src/features/products/components/Catalog.tsx)                   | `search: string`                           | Starts as an empty string; updated by the search input. Reset clears it.                                                                          |
| `Catalog` — same file                                                                     | `category: Product["category"]` or `"all"` | Starts as `"all"`; updated by the genre selector. Reset restores `"all"`.                                                                         |
| `Catalog` — same file                                                                     | `sort: PriceSort`                          | Starts as `"default"`; may become `"price-asc"` or `"price-desc"`. Reset restores the default.                                                    |
| `Catalog` — same file                                                                     | `open: boolean`                            | Starts at `false`; controls the filter panel. The toggle changes it; Close, Escape, or focus leaving the controls dismisses the panel.            |

`App` has no direct `useState` call; its request state lives in `useProducts`. `PageLayout`, `Hero`, `FeaturedGame`, `ProductStatus`, `AddToCart`, and `Icon` have no local React state. `CartPanel` has no `useState` call: its `dialog` ref and effect synchronize `showModal()` / `close()` with the parent-owned `open` prop. `Catalog` uses a `toggle` ref to restore focus when its filter panel closes. These refs are not duplicate UI state.

The following values are derived rather than stored:

- `Catalog` calculates `selected` through `selectProducts(products, { search, category, sort })` and derives unique `categories` from the catalog. The trimmed, case-insensitive title search and genre selection run before sorting a filtered copy in [catalog.ts](src/features/products/catalog.ts).
- `useCart` calculates `totals` through `getCartTotals(items, products)` on each render.
- `Storefront` finds `featured` by the `cyberpunk-2077` ID; it renders `FeaturedGame` only when that product exists.

## Product API flow

```text
App
  → useProducts()
  → getProducts() in src/features/products/products.api.ts
  → fetchJson() in src/shared/api/client.ts
  → HTTP GET {BASE_URL}/api/products
  → api/products.ts
  → src/features/products/products.data.ts (endpoint-side demo catalog)
  → validated ApiProductsResponse
  → toProduct() maps each API item to Product
  → useProducts sets { status: "success", data: Product[] }
  → App passes data to Storefront
  → Hero, FeaturedGame, Catalog, useCart, and CartPanel receive fetched products
```

[api/products.ts](api/products.ts) serves `{ items, total }`, converting the existing catalog's dollar prices to integer `price_cents`. It rejects non-GET methods with HTTP 405. [vite.config.ts](vite.config.ts) adapts the same handler to the local Vite development server.

[client.ts](src/shared/api/client.ts) builds the URL from `VITE_API_BASE_URL`, defaulting to the same origin, and performs the fetch. It reports network, HTTP, JSON, and decoding failures through `ApiError`. [products.api.ts](src/features/products/products.api.ts) validates the response shape, total, unique IDs, required fields, supported categories, prices, and local image paths. `toProduct()` maps `title` to `name`, `category_name` to `category`, cents to dollar `price`, and optional `featured_image` to `featuredImage`, preserving the remaining product fields.

`useProducts` starts the request in an effect that depends on `attempt`. Its cleanup sets an effect-local `active` flag to `false`, so stale results cannot update state. This flag is not React state; cleanup ignores the result rather than aborting the network request. The preserved `getProducts()` function accepts no signal argument.

React components and hooks do not import the demo catalog directly, and there is no local-data fallback when fetching fails. Production requires a compatible API function host or `VITE_API_BASE_URL` pointing to the same API contract. A static build or `vite preview` alone does not serve the endpoint.

### Request and catalog states

| Condition                         | Rendered UI                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Request pending                   | `App` renders `PageLayout`, `Hero` with no covers, and `ProductStatus` with “Loading games…” and `aria-busy`. |
| Request fails                     | The same branch shows the error message and “Try again”, calling `useProducts.retry()`.                       |
| Request returns an empty array    | The same branch shows “No games available.” and “Check again”, also calling `retry()`.                        |
| Request returns products          | `App` mounts `Storefront`, including navigation, highlights, catalog, and cart.                               |
| Search/filter produces no matches | `Catalog` shows “No games found.” and a reset action; the loaded products and cart remain available.          |

The hero headline “NEXT WORLD LOADING.” is design copy, independent of the actual request status. Loading/error/empty branches do not mount `Storefront` or initialize its cart.

## Cart state and persistence

1. After a successful nonempty product response, `Storefront` calls `useCart(products)`. The hook lazily restores saved entries through [cart.storage.ts](src/features/cart/cart.storage.ts), validating IDs against the fetched catalog.
2. Saved entries use the `respawn-shop-cart-v1` key and contain only `{ id: string, quantity: number }`. Names, images, and prices are resolved from the current products, not copied into storage. Invalid entries, unknown IDs, and individual quantities above `999` are skipped. Valid duplicate IDs are merged with a total cap of `999`. Malformed or inaccessible storage restores an empty in-memory cart.
3. The featured and catalog `AddToCart` buttons call `cart.add(product.id)`. `CartPanel` receives `add`, `decrease`, `remove`, and `clear` callbacks through Props. [cart.ts](src/features/cart/cart.ts) supplies immutable add/decrease/remove transformations; decreasing a quantity of one removes its entry. The hook's clear action supplies an empty array.
4. Every action calls the hook's `update(next, announcement)`: it updates `items`, calls `saveCart(next)`, records any save failure in `storageError`, and sets `message`. Persistence happens during these actions, not in an effect. Restoring the cart alone does not rewrite storage.
5. `getCartTotals` derives total quantity and subtotal using `Math.round(product.price * 100) * quantity` in integer cents. [money.ts](src/shared/utils/money.ts) formats cents as USD. `Navigation` receives the total quantity, while `CartPanel` receives the complete totals object.
6. Failed saves leave the in-memory cart usable and show a warning in `CartPanel`. Loading, failed, and empty product requests never write an empty cart over previously saved entries, because the cart hook is not mounted in those branches.

`useCart` returns `items`, derived `totals`, `storageError`, `message`, and the four action callbacks. It does not own dialog visibility. `Storefront` owns `cartOpen`, while the browser's native dialog provides modal keyboard behavior. Cart items remain in memory when the dialog is closed and are restored from localStorage after a page reload. Storage is read on hook initialization; there is no cross-tab `storage` event subscription.

## Verification and project rules

Run `npm run check` before submitting changes. The suites cover:

| File                                     | Coverage                                                                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| [tests/core.test.js](tests/core.test.js) | Composed filtering/sorting, immutable cart updates, exact totals, quantity limits, storage validation, and local artwork paths. |
| [tests/api.test.js](tests/api.test.js)   | Handler responses, API validation/mapping, transport failures, response totals, and duplicate IDs.                              |
| [tests/http.test.js](tests/http.test.js) | Actual HTTP responses from the local adapter, including failure/retry, empty responses, and unsupported methods.                |
| [tests/ui.test.js](tests/ui.test.js)     | React browsing/cart interactions, saved-cart restoration, storage errors, request states, retries, and stale-result cleanup.    |

Development-only adapter modes are available through `npm run dev -- --mode checkpoint-loading`, `checkpoint-error`, and `checkpoint-empty`. They delay GET responses by eight seconds, fail the first GET only, or return an empty catalog respectively. React `StrictMode` can issue an extra development mount request, so the first-request-only error may be consumed by a discarded request; the UI tests verify error/retry deterministically.

Husky's [.husky/pre-commit](.husky/pre-commit) runs `npm run lint:staged`: Oxlint fixes staged JS/TS, then Prettier formats those files and supported staged documentation/configuration files. The [prepare script](scripts/prepare.mjs) activates hooks during installation for Git checkouts; run `npm run prepare` again if activation was blocked. Activation requires permission to update Git's `core.hooksPath`. Source archives without `.git` skip activation; CI may explicitly use `HUSKY=0`.

[AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), and [DESIGN.md](DESIGN.md) contain the project rules. The complete Vercel React best-practices and composition-patterns skills are installed under [.claude/skills](.claude/skills/README.md), with source hashes recorded alongside them. Vendored skill files are excluded from automatic formatting.
