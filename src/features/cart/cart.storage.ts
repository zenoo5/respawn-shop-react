// Persist compact cart entries and recover safely from untrusted or blocked storage.
import { MAX_QUANTITY } from "./cart.js";
import type { Product } from "../products/products.types.js";
import type { CartItem } from "./cart.types.js";

type CartStorage = Pick<Storage, "getItem" | "setItem">;

export const CART_STORAGE_KEY = "respawn-shop-cart-v1";

// Restore known products with valid quantities and merge valid duplicate entries.
export function loadCart(
  products: Product[],
  storage?: CartStorage,
): CartItem[] {
  try {
    const saved = (storage ?? globalThis.localStorage).getItem(
      CART_STORAGE_KEY,
    );
    if (saved === null) return [];
    const restored: unknown = JSON.parse(saved);
    if (!Array.isArray(restored)) return [];
    const entries: unknown[] = restored;
    const cart: CartItem[] = [];
    for (const entry of entries) {
      if (
        !isCartItem(entry) ||
        !products.some((product) => product.id === entry.id) ||
        entry.quantity > MAX_QUANTITY
      ) {
        continue;
      }
      const existing = cart.find((item) => item.id === entry.id);
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + entry.quantity,
          MAX_QUANTITY,
        );
      } else {
        cart.push({ id: entry.id, quantity: entry.quantity });
      }
    }
    return cart;
  } catch {
    return [];
  }
}

// Save only IDs and quantities and report whether persistence succeeded.
export function saveCart(cart: CartItem[], storage?: CartStorage): boolean {
  try {
    const entries = cart.map(({ id, quantity }) => ({ id, quantity }));
    (storage ?? globalThis.localStorage).setItem(
      CART_STORAGE_KEY,
      JSON.stringify(entries),
    );
    return true;
  } catch {
    return false;
  }
}

// Narrow untrusted JSON to a cart entry only after checking its fields at runtime.
function isCartItem(value: unknown): value is CartItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string" &&
    "quantity" in value &&
    typeof value.quantity === "number" &&
    Number.isInteger(value.quantity) &&
    value.quantity >= 1
  );
}
