// Select catalog results without changing the original products or control state.
import type { Product, ProductCategory } from "./products.types.js";

export type PriceSort = "default" | "price-asc" | "price-desc";

export interface CatalogState {
  search: string;
  category: ProductCategory | "all";
  sort: PriceSort;
}

// Apply name search and category selection before sorting a fresh array.
export function selectProducts(
  products: Product[],
  {
    search = "",
    category = "all",
    sort = "default",
  }: Partial<CatalogState> = {},
): Product[] {
  const query = search.trim().toLowerCase();
  const selected = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) &&
      (category === "all" || product.category === category),
  );
  if (sort === "price-asc") {
    selected.sort((first, second) => first.price - second.price);
  }
  if (sort === "price-desc") {
    selected.sort((first, second) => second.price - first.price);
  }
  return selected;
}
