import { useState } from "react";
import { Navigation } from "../components/layout/Navigation";
import { PageLayout } from "../components/layout/PageLayout";
import { Hero, FeaturedGame } from "../features/products/components/Highlights";
import { Catalog } from "../features/products/components/Catalog";
import type { Product } from "../features/products/products.types";
import { CartPanel } from "../features/cart/components/CartPanel";
import { useCart } from "../features/cart/useCart";
export function Storefront({ products }: { products: Product[] }) {
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart(products);
  const featured = products.find((game) => game.id === "cyberpunk-2077");
  return (
    <>
      <Navigation
        count={cart.totals.count}
        cartOpen={cartOpen}
        onOpenCart={() => setCartOpen(true)}
      />
      <PageLayout>
        <Hero products={products} />
        {featured && <FeaturedGame product={featured} onAdd={cart.add} />}
        <Catalog products={products} onAdd={cart.add} />
      </PageLayout>
      <CartPanel
        products={products}
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        totals={cart.totals}
        onAdd={cart.add}
        onDecrease={cart.decrease}
        onRemove={cart.remove}
        onClear={cart.clear}
        storageError={cart.storageError}
        message={cart.message}
      />
      <p className="visually-hidden" role="status">
        {cart.message}
      </p>
    </>
  );
}
