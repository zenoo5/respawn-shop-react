import { useEffect, useState } from "react";
import { ApiError } from "../../shared/api/client";
import { getProducts } from "./products.api";
import type { LoadState, Product } from "./products.types";
export function useProducts() {
  const [state, setState] = useState<LoadState<Product[]>>({
    status: "loading",
  });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    getProducts().then(
      (products) => {
        if (active)
          setState(
            products.length
              ? { status: "success", data: products }
              : { status: "empty" },
          );
      },
      (error: unknown) => {
        if (active)
          setState({
            status: "error",
            message:
              error instanceof ApiError
                ? error.message
                : "Unable to load games. Please try again.",
          });
      },
    );
    // The preserved API client has no AbortSignal argument. Ignore stale results.
    return () => {
      active = false;
    };
  }, [attempt]);
  function retry() {
    setState({ status: "loading" });
    setAttempt((current) => current + 1);
  }
  return { state, retry };
}
