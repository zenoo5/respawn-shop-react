# Respawn Shop — Design Direction

## 1. Concept

Respawn Shop is a digital PC game storefront designed to feel like a distinctive **game launcher with shopping functionality**, not a conventional e-commerce template.

The visual direction combines three user-selected references:

1. **Gaming dashboard:** compact floating icon navigation, layered dark surfaces, and carefully controlled accents.
2. **Bold game landing page:** oversized typography and dramatic, overlapping game-cover artwork in the hero.
3. **Game launcher/store:** a cinematic featured-game section and an artwork-led game library.

These references are inspiration for composition and interaction, not assets to copy. Use the project's own fictional games and artwork. Do not reproduce third-party characters, branding, or layouts exactly.

## 2. Design Principles

- **Distinctive, not generic:** avoid a standard marketing hero followed by a plain product grid.
- **Artwork first:** game covers and the featured image create visual interest; interface decoration stays restrained.
- **Minimal copy:** show only information that helps users browse or buy. Avoid filler slogans, repeated eyebrow labels, long descriptions, and decorative statistics.
- **Functional honesty:** do not introduce fake launcher features such as friends, downloads, accounts, streaming, or libraries of owned games.
- **Accessible and responsive:** experimental visuals must not compromise keyboard use, contrast, readability, or mobile shopping.

## 3. Color System — Citrus Shift

| Token | Hex | Use |
| --- | --- | --- |
| `--color-background` | `#11170F` | Main page background |
| `--color-surface` | `#263222` | Cards, navigation, filter panel |
| `--color-accent` | `#D7EF68` | Primary actions, active states, key highlights |
| `--color-accent-muted` | `#8AA548` | Secondary accents and subtle details |
| `--color-text` | `#F4F7E7` | Main text and headings |

Use lime sparingly so important interactions stand out. Game artwork may introduce other colors. Derive additional hover, border, muted-text, and overlay colors from this palette while preserving readable contrast. Never rely on color alone to indicate state.

## 4. Typography

- **Unbounded:** brand wordmark, major hero headline, and selected section headings.
- **Chakra Petch:** navigation, game names, prices, controls, labels, and general interface text.
- Keep typography expressive but legible. Use sensible fallbacks, avoid excessively small text, and maintain a clear hierarchy.
- Limit oversized display typography to a few deliberate moments; do not apply it to all UI elements.

## 5. Desktop Layout

### Floating Sidebar

- A narrow, vertically oriented sidebar that appears detached from the page edge.
- Icon-led navigation with clear active states and accessible names/tooltips.
- Include only destinations that actually work, such as Home, Browse/Search, and Cart. A decorative settings button or fake account area must not be added.
- Sidebar must not cover content or trap keyboard focus.

### Hero — Overlapping Game Covers

- A dramatic composition built from **overlapping game covers**, with the center cover largest and visually in front.
- Use subtle rotation, offset, depth, and controlled shadows rather than a conventional rectangular banner.
- Pair with one short, strong headline and at most one meaningful primary action.
- Use existing fictional game artwork from the project; do not insert unrelated placeholder art in the finished site.
- Maintain a stable composition at smaller widths; overlapping artwork must never obscure essential controls.

### Featured Game

- A wide, cinematic image for one actual product from the catalog.
- Show the game name, genre, price, and Add to Cart control **below the image**, not overlaid on it.
- Avoid invented reviews, ratings, discounts, availability claims, or lengthy promotional copy.
- The Add to Cart control must use the existing cart logic.

### Library / Catalog

- Artwork-led portrait game cards; avoid heavy boxed product-card styling.
- Show game title and price persistently, plus an obvious Add to Cart action.
- Hover can add subtle motion or emphasis, but must not hide essential shopping information.
- Prefer **three columns on standard desktop widths**, adapting to available space rather than forcing tiny cards.
- The catalog heading is concise: e.g., `LIBRARY`, optionally with a genuine item count.

### Search and Filter Toolbar

- Place a **compact search field beside a Filter button** in the same toolbar.
- Do not put a full-width search bar above a separate row of genre chips.
- The Filter control opens a compact panel/popover containing:
  - **Genre:** All Games and categories derived from actual catalog data.
  - **Sort:** Default, Price: Low to High, Price: High to Low.
  - Reset control if useful.
- Search, genre, and sorting must work together, preserving the existing case-insensitive search and price-sort behavior.
- Every input has an accessible label, including when a visual placeholder is used.

## 6. Mobile Behavior

- Treat mobile as a purposeful game-app layout, not a scaled-down desktop screenshot.
- Replace the desktop floating sidebar with a compact **bottom navigation bar** for working destinations.
- Keep shopping actions reachable and ensure the bottom bar does not cover content or checkout/cart controls.
- Recompose the overlapping hero covers for narrow screens; reduce the number visible or their overlap when needed, without horizontal overflow.
- Show game cards in approximately two columns when space allows, falling back to one column on very narrow screens.
- Keep search and Filter compact and adjacent where usable; allow a clean wrap/stack only when necessary for accessibility.
- The filter panel must be touch-friendly, keyboard-accessible, and easy to dismiss.
- Avoid interactions that depend exclusively on hover.

## 7. Motion and Visual Details

- Use restrained hover lifts, card emphasis, and short transitions to create depth.
- Preserve a distinctive layered look through spacing, scale, overlap, and contrast—not excessive glow or visual noise.
- Respect `prefers-reduced-motion`.
- Avoid heavy animations that distract from browsing or cause layout shifts.

## 8. Content and Functionality Constraints

- Preserve the existing fictional game catalog and local game-cover assets.
- Preserve functional search, genre filtering, price sorting, cart actions, correct totals, and localStorage persistence.
- Do not add a backend, payment flow, account system, or features outside the homework scope.
- Use semantic HTML, exactly one page-level `h1`, accessible input labels, visible focus styles, and usable keyboard interactions.
- Keep TypeScript strict, avoid `any` and unsafe assertions, and maintain the project's existing feature-module architecture.

## 9. Implementation Guardrails

1. **Design before code:** this document defines direction; no UI code should be changed until the design is reviewed.
2. **Do not improvise new sections or marketing copy.** Ask before adding features or substantial visual elements not covered here.
3. **Implement incrementally:** foundation (colors/fonts/layout), navigation and hero, featured game, catalog and filters, then mobile polish.
4. **Reuse existing state and business logic.** UI changes should not silently rewrite catalog/cart behavior.
5. **Verify each stage:** inspect desktop and mobile, test keyboard interactions, and run `npm run check`.
6. **Review before committing:** understand the changed files and verify the visual result before committing or pushing.

## 10. Open Design Details

The following can be refined during implementation without changing the approved direction:

- Exact spacing, radii, shadow strengths, and responsive breakpoints.
- Which existing game is featured and which covers form the hero composition.
- Precise sidebar iconography and accessible text labels.
- Final visual styling of the filter popover and cart panel.

These choices should follow the principles above and should not turn the interface into a conventional storefront.
