import { useState } from "react";
import { Navigation } from "../components/layout/Navigation";
import { Hero, FeaturedGame } from "../features/products/components/Highlights";
import { Catalog } from "../features/products/components/Catalog";
import { products } from "../features/products/products.data";
import { CartPanel } from "../features/cart/components/CartPanel";
import { useCart } from "../features/cart/useCart";
export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const cart = useCart();
  const featured = products.find((game) => game.id === "cyberpunk-2077");
  return (
    <>
      <a className="skip-link" href="#catalog">
        Skip to library
      </a>
      <Navigation
        count={cart.totals.count}
        cartOpen={cartOpen}
        onOpenCart={() => setCartOpen(true)}
      />
      <div className="page-shell" id="home">
        <header className="site-header">
          <a className="brand" href="#home" aria-label="Respawn Shop home">
            respawn<span className="brand-dot">/</span>
            <span className="brand-shop">shop</span>
          </a>
          <span className="header-note">DIGITAL PC GAMES</span>
        </header>
        <main>
          <Hero products={products} />
          {featured && <FeaturedGame product={featured} onAdd={cart.add} />}
          <Catalog products={products} onAdd={cart.add} />
        </main>
        <footer className="site-footer">
          <p>
            Non-commercial demo · No official affiliation.
            <br />
            Game artwork and trademarks belong to their respective owners.
          </p>
        </footer>
      </div>
      <CartPanel
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
