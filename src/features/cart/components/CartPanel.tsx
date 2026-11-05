import { useEffect, useRef } from "react";
import { products } from "../../products/products.data";
import { MAX_QUANTITY } from "../cart";
import type { CartItem, CartTotals } from "../cart.types";
import { formatMoney } from "../../../shared/utils/money";
interface Props {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: CartTotals;
  onAdd: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  storageError: boolean;
  message: string;
}
export function CartPanel({
  open,
  onClose,
  items,
  totals,
  onAdd,
  onDecrease,
  onRemove,
  onClear,
  storageError,
  message,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (open) element?.showModal();
    else element?.close();
  }, [open]);
  return (
    <dialog
      id="cart-dialog"
      ref={dialog}
      aria-labelledby="cart-title"
      onCancel={onClose}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="cart-shell">
        <div className="cart-header">
          <h2 id="cart-title">
            Your cart<span className="lime-text">.</span>
          </h2>
          <button
            type="button"
            className="icon-button"
            aria-label="Close cart"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <p id="cart-summary" className="muted">
          {totals.count} {totals.count === 1 ? "item" : "items"}
        </p>
        <p className="cart-action-status" role="status">
          {message}
        </p>
        <div className="cart-items">
          {items.length === 0 && (
            <div className="empty-state">
              <h3>Your cart is empty.</h3>
              <p>Find your next adventure in the library.</p>
            </div>
          )}
          {items.map((item) => {
            const product = products.find((game) => game.id === item.id);
            if (!product) return null;
            return (
              <article className="cart-item" key={item.id}>
                <div className="cart-image">
                  <img src={product.image} alt="" width="72" height="86" />
                </div>
                <div className="cart-item-info">
                  <h3>{product.name}</h3>
                  <p>{formatMoney(Math.round(product.price * 100))} each</p>
                  <div className="quantity-control">
                    <button
                      type="button"
                      aria-label={`Decrease ${product.name} quantity`}
                      onClick={() => onDecrease(item.id)}
                    >
                      −
                    </button>
                    <span aria-label={`${product.name} quantity`}>
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase ${product.name} quantity`}
                      disabled={item.quantity >= MAX_QUANTITY}
                      onClick={() => onAdd(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="cart-item-end">
                  <strong>
                    {formatMoney(
                      Math.round(product.price * 100) * item.quantity,
                    )}
                  </strong>
                  <button
                    type="button"
                    className="text-button"
                    onClick={() => onRemove(item.id)}
                    aria-label={`Remove ${product.name}`}
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <div className="cart-footer">
          <button
            type="button"
            className="text-button"
            onClick={onClear}
            disabled={!items.length}
          >
            Clear cart
          </button>
          <div className="total-row">
            <span>Subtotal</span>
            <strong>{formatMoney(totals.totalCents)}</strong>
          </div>
          <p className="muted">
            USD · Illustrative demo prices. No purchases, downloads, or game
            keys are provided.
          </p>
          {storageError && (
            <p role="alert">
              Your browser could not save the cart. Changes will last for this
              visit only.
            </p>
          )}
          <button
            type="button"
            className="button button-lime"
            onClick={onClose}
          >
            Continue shopping ↗
          </button>
        </div>
      </div>
    </dialog>
  );
}
