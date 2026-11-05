# CLAUDE.md — Respawn Shop React

Follow `AGENTS.md` and `DESIGN.md`. These instructions adapt the project rules to the current React application; they do not authorize changes outside the user's request.

## Project and architecture

Respawn Shop is a React + TypeScript digital PC game storefront using Vite, CSS, and the Citrus Shift visual identity. Preserve the existing games, artwork, prices, design, and functionality unless the user explicitly requests a change.

- `src/app`: request-state composition and the loaded storefront.
- `src/components/layout` and `src/components/ui`: reusable layout and UI components.
- `src/features/products`: product types, preserved API decoder, request hook, filtering/sorting, and product components.
- `src/features/cart`: cart types, immutable calculations, validated storage helpers, cart hook, and modal components.
- `src/shared/api`: the preserved Day 3 HTTP client.
- `src/shared/utils`: shared pure utilities.
- `src/styles`: responsive application styles.
- `api/products.ts`: the preserved Day 3 endpoint, served locally by the Vite adapter.
- `tests`: API, HTTP integration, cart, filtering/sorting, and React interaction tests.

Keep business logic separate from presentation, avoid circular dependencies, and keep `App.tsx` focused on composition. Preserve the original Day 3 API implementation; adjust imports only when moving it. Product data reaches React through the API; do not replace fetching with direct demo-data imports or add a silent local fallback.

## React and TypeScript

1. Use functional components with `.tsx`; use `.ts` for types, hooks, business logic, and utilities that contain no JSX.
2. Give component Props explicit types and keep each component focused on one responsibility.
3. Pass data and callbacks through Props. Keep state near its owner and lift it only when needed by other components.
4. Use `useState` for interactive state. Use `useEffect` only to synchronize with external systems; clean up subscriptions and ignore stale request results.
5. Never mutate React state or manually update React-controlled DOM content. Refs may manage focus and native dialog synchronization.
6. Derive totals, counts, and filtered lists from existing state instead of storing duplicate state.
7. Use stable product IDs as list keys.
8. Keep strict TypeScript enabled. Avoid `any`, unsafe `as` assertions, angle-bracket assertions, and non-null assertions.
9. Define explicit product, cart, and API response types. Validate unknown data at API and storage boundaries.
10. Handle loading, error with retry, success, empty catalog, and no-match states distinctly. Preserve saved carts during loading, errors, and empty responses.
11. Keep localStorage access inside the dedicated storage module. Calculate currency totals with integer cents.
12. Prefer simple composition over unnecessary abstractions, libraries, contexts, or complex state management.

## Design and accessibility

Use the colors and typography in `DESIGN.md`: Citrus Shift colors, Unbounded display type, and Chakra Petch UI type. Preserve responsive layouts, floating desktop navigation, mobile bottom navigation, overlapping hero covers, the featured game, and the artwork-led catalog.

Use semantic HTML, exactly one page-level `h1`, labeled inputs, accessible controls, visible focus indicators, keyboard interactions, and reduced-motion support. Avoid inline styles unless values are genuinely dynamic. Do not add fake launcher features, account systems, payment flows, or invented game information.

## Skills

Use the installed Vercel guidance when relevant:

- `.claude/skills/vercel-react-best-practices/SKILL.md`: React performance, rendering, effects, and data-fetching guidance.
- `.claude/skills/vercel-composition-patterns/SKILL.md`: component composition, Props APIs, and state ownership.

Apply React/Vite guidance to this project; Next.js-specific examples do not require migrating frameworks or adding dependencies. Keep vendored skill files unchanged when editing the application. User instructions and project constraints take precedence over general skill recommendations.

## Checks and Git tooling

Use the commands defined in `package.json`:

- `npm run dev`: start Vite and the local API adapter.
- `npm run typecheck`: check strict TypeScript.
- `npm run lint`: run Oxlint.
- `npm run format:check`: check project formatting with Prettier.
- `npm test`: run the current Node test runner and jsdom suite.
- `npm run check`: run typechecking, linting, formatting checks, and tests.
- `npm run prepare`: install Husky hooks for this Git checkout.
- `npm run lint:staged`: run Oxlint fixes and Prettier on staged source files; format staged documentation and configuration files.

Run the relevant checks before considering work complete. Test cart calculations/updates, composed filtering/sorting, API validation/mapping, request states, and meaningful component interactions. The current tests use Node's built-in runner and jsdom; do not claim Vitest or React Testing Library are installed.

Husky's pre-commit hook runs lint-staged. Keep hook files in LF format. Hooks supplement full checks; do not bypass them to conceal failures. Do not stage unrelated changes to test a hook.

Do not generate or commit `dist/` during routine development. Do not commit, push, or deploy without explicit user permission.

## Working practices

- Read the relevant code before editing; do not rewrite unrelated files.
- Explain important architectural changes before implementing them.
- Keep changes within the requested scope and preserve existing working behavior.
- Do not invent product information, reviews, ratings, discounts, or availability claims.
- Do not modify the original `D:/Coding/respawn-shop` project when working in this React project.
- Report changes, validation results, and material remaining limitations honestly.
