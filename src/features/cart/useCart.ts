import { useState } from "react";
import type { Product } from "../products/products.types";
import { addItem, decreaseItem, getCartTotals, removeItem } from "./cart";
import { loadCart, saveCart } from "./cart.storage";
import type { CartItem } from "./cart.types";
export function useCart(products: Product[]) {
  const [items, setItems] = useState(() => loadCart(products));
  const [storageError, setStorageError] = useState(false);
  const [message, setMessage] = useState("");
  // Persist the next state as part of the user action, keeping state updaters pure.
  function update(next: CartItem[], announcement: string) {
    setItems(next);
    setStorageError(!saveCart(next));
    setMessage(announcement);
  }
  function add(id: string) {
    const product = products.find((game) => game.id === id);
    if (product)
      update(addItem(items, id, products), `${product.name} added to cart.`);
  }
  return {
    items,
    totals: getCartTotals(items, products),
    storageError,
    message,
    add,
    decrease: (id: string) =>
      update(decreaseItem(items, id), "Cart quantity updated."),
    remove: (id: string) =>
      update(removeItem(items, id), "Game removed from cart."),
    clear: () => update([], "Cart cleared."),
  };
}
