// Describe digital PC games and their available genres.
export type ProductCategory =
  "RPG" | "Action-Adventure" | "Survival Horror" | "Metroidvania" | "Adventure";
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  developer: string;
  price: number; // Illustrative USD demo price, not an official store quote.
  image: string;
  featuredImage?: string; // Optional wide promotional artwork for the spotlight.
  description: string;
  badge?: string;
  color?: string;
}

export type LoadState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; message: string }
  | { status: "empty" };
