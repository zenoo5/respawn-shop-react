# AGENTS.md — Respawn Shop React

## Project Overview

Respawn Shop is a digital PC game storefront being rebuilt using React and TypeScript as part of a Fullstack development course.

The goal is to preserve the existing product concept and visual identity while learning React architecture, component composition, state management, and typed data handling.

## Tech Stack

- React
- TypeScript (strict mode)
- Vite
- CSS
- Oxlint
- Prettier
- Vitest and React Testing Library

## Project Structure

```text
src/
├── app/
│   └── App.tsx
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── products/
│   │   ├── components/
│   │   ├── products.types.ts
│   │   └── products.api.ts
│   └── cart/
│       ├── components/
│       ├── cart.types.ts
│       └── cart.storage.ts
├── shared/
│   ├── api/
│   └── utils/
├── styles/
└── main.tsx
```

## React Rules

1. Use functional React components with TypeScript.
2. Use `.tsx` for components and `.ts` for logic, types, and utilities.
3. Keep components focused on one responsibility.
4. Use Props to pass data between components.
5. Use `useState` for interactive state.
6. Use `useEffect` only when synchronizing with external systems.
7. Never directly manipulate the DOM to update React-controlled UI.
8. Do not mutate React state directly.
9. Derive totals and filtered lists from existing state instead of storing duplicate values.
10. Use stable IDs as keys when rendering lists.

## TypeScript Rules

- Enable strict mode.
- Avoid `any`.
- Avoid non-null assertions (`!`).
- Avoid unsafe type assertions (`as`).
- Define explicit types for products, cart items, and API responses.
- Handle loading, error, success, and empty states.

## Architecture Rules

- Keep business logic separate from presentation.
- Keep API requests in dedicated modules.
- Keep localStorage access in dedicated utilities.
- Avoid circular dependencies.
- Do not place all application logic in `App.tsx`.
- Prefer simple solutions over unnecessary abstractions.

## Styling Rules

- Preserve the Citrus Shift visual identity.
- Use the colors and typography documented in `DESIGN.md`.
- Keep the interface responsive.
- Avoid inline styles unless values are genuinely dynamic.
- Use semantic HTML and accessible controls.

## Testing Rules

- Test cart calculations and updates.
- Test product filtering and sorting.
- Test API data mapping.
- Test loading, error, and empty states.
- Test meaningful React component interactions.

## AI Coding Rules

1. Do not rewrite unrelated files when implementing a feature.
2. Do not introduce unnecessary libraries or complex state management.
3. Do not invent product data or change existing game information.
4. Do not replace working React state with manual DOM manipulation.
5. Do not run commits, pushes, or deployments without explicit permission.
6. Explain important architectural changes before implementing them.

## Development Commands

Use the commands actually defined in `package.json`.

Run typechecking, linting, formatting checks, and tests before considering a task complete.

Do not generate or commit `dist/` during routine development.