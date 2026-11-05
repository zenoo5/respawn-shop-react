// Keep cart transformations immutable and calculate currency using integer cents.
import type { Product } from "../products/products.types.js";
import type { CartItem, CartTotals } from "./cart.types.js";
export const MAX_QUANTITY = 999;
export const CENTS_PER_DOLLAR = 100;

// Add one known product, combining quantities while enforcing the per-product limit.
export function addItem(
  cart: CartItem[],
  id: string,
  products: Product[],
): CartItem[] {
  if (!products.some((product) => product.id === id)) return cart;
  const existing = cart.find((item) => item.id === id);
  if (!existing) return [...cart, { id, quantity: 1 }];
  return cart.map((item) =>
    item.id === id
      ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
      : item,
  );
}

// Decrease a quantity by one and remove the entry when its quantity reaches one.
export function decreaseItem(cart: CartItem[], id: string): CartItem[] {
  return cart.flatMap((item) => {
    if (item.id !== id) return [item];
    return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : [];
  });
}

// Remove only the entry with the supplied product ID.
export function removeItem(cart: CartItem[], id: string): CartItem[] {
  return cart.filter((item) => item.id !== id);
}

// Return an empty cart without changing any existing array.
export function clearCart(): CartItem[] {
  return [];
}

// Derive total quantity and exact cents from current cart entries and product prices.
export function getCartTotals(
  cart: CartItem[],
  products: Product[],
): CartTotals {
  return cart.reduce<CartTotals>(
    (totals, item) => {
      const product = products.find((entry) => entry.id === item.id);
      if (!product) return totals;
      return {
        count: totals.count + item.quantity,
        totalCents:
          totals.totalCents +
          Math.round(product.price * CENTS_PER_DOLLAR) * item.quantity,
      };
    },
    { count: 0, totalCents: 0 },
  );
}
