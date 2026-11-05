import type { LoadState, Product } from "../products.types";
interface Props {
  state: Exclude<LoadState<Product[]>, { status: "success" }>;
  onRetry: () => void;
}
export function ProductStatus({ state, onRetry }: Props) {
  return (
    <section
      id="catalog"
      className="catalog-section"
      aria-labelledby="catalog-title"
      aria-busy={state.status === "loading"}
    >
      <div className="library-heading">
        <h2 id="catalog-title">
          LIBRARY<span className="heading-dot">/</span>
        </h2>
      </div>
      {state.status === "loading" ? (
        <p className="results-count" role="status">
          Loading games…
        </p>
      ) : (
        <div className="empty-state">
          {state.status === "error" ? (
            <p role="alert">{state.message}</p>
          ) : (
            <>
              <h3>No games available.</h3>
              <p>
                There are no games in the catalog right now. Please check again
                later.
              </p>
            </>
          )}
          <button
            type="button"
            className="button button-lime"
            onClick={onRetry}
          >
            {state.status === "error" ? "Try again" : "Check again"}
          </button>
        </div>
      )}
    </section>
  );
}
