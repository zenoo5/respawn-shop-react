import type { Product } from "../../features/products/products.types";
interface Props {
  product: Product;
  onAdd: (id: string) => void;
  compact?: boolean;
}
export function AddToCart({ product, onAdd, compact = false }: Props) {
  return (
    <button
      type="button"
      className={compact ? "add-button" : "button button-lime"}
      onClick={() => onAdd(product.id)}
      aria-label={`Add ${product.name} to cart`}
    >
      {compact ? "+" : "Add to cart +"}
    </button>
  );
}
