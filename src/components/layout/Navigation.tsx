import { useEffect, useState } from "react";
import { Icon } from "../ui/Icon";
interface Props {
  count: number;
  cartOpen: boolean;
  onOpenCart: () => void;
}
export function Navigation({ count, cartOpen, onOpenCart }: Props) {
  const [location, setLocation] = useState(
    () => window.location.hash || "#home",
  );
  useEffect(() => {
    const syncLocation = () => setLocation(window.location.hash || "#home");
    window.addEventListener("hashchange", syncLocation);
    return () => window.removeEventListener("hashchange", syncLocation);
  }, []);
  return (
    <nav className="navigation" aria-label="Main navigation">
      <a className="rail-mark" href="#home" aria-label="Respawn Shop home">
        r<span>.</span>
      </a>
      <a
        className="nav-link"
        href="#home"
        title="Home"
        aria-current={
          !cartOpen && location !== "#catalog" ? "location" : undefined
        }
      >
        <Icon name="home" />
        <span className="nav-label">Home</span>
      </a>
      <a
        className="nav-link"
        href="#catalog"
        title="Browse games"
        aria-current={
          !cartOpen && location === "#catalog" ? "location" : undefined
        }
      >
        <Icon name="browse" />
        <span className="nav-label">Browse</span>
      </a>
      <button
        className="nav-link"
        type="button"
        onClick={onOpenCart}
        aria-label={`Open cart, ${count} items`}
        aria-haspopup="dialog"
        aria-controls="cart-dialog"
        aria-expanded={cartOpen}
      >
        <Icon name="cart" />
        <span className="nav-label">Cart</span>
        <span className="cart-count">{count}</span>
      </button>
    </nav>
  );
}
