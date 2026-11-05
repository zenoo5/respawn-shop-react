import type { Product } from "../products.types";
import { AddToCart } from "../../../components/ui/AddToCart";
import { formatMoney } from "../../../shared/utils/money";
export function Hero({ products }: { products: Product[] }) {
  const ids = [
    "god-of-war-2018",
    "cyberpunk-2077",
    "elden-ring",
    "hogwarts-legacy",
    "red-dead-redemption-2",
  ];
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-heading">
        <h1 id="hero-title">
          NEXT WORLD
          <span>
            LOADING<span className="heading-dot">.</span>
          </span>
        </h1>
        <a className="text-link" href="#catalog">
          Explore games ↗
        </a>
      </div>
      <div className="hero-covers" aria-label="Explore game worlds">
        {ids.map((id) => {
          const product = products.find((game) => game.id === id);
          return product ? (
            <a
              key={id}
              className="hero-card"
              href="#catalog"
              aria-label={`Browse games including ${product.name}`}
            >
              <img src={product.image} alt="" width="600" height="900" />
              <span>{product.category}</span>
              <strong>{product.name}</strong>
            </a>
          ) : null;
        })}
      </div>
    </section>
  );
}
export function FeaturedGame({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (id: string) => void;
}) {
  return (
    <section aria-labelledby="featured-heading">
      <div className="section-line">
        <h2 id="featured-heading">IN THE SPOTLIGHT</h2>
        <span aria-hidden="true">↗</span>
      </div>
      <img
        className="featured-image"
        src={product.featuredImage ?? product.image}
        alt={`${product.name} promotional artwork`}
        width="1920"
        height="620"
      />
      <div className="featured-details">
        <div>
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
        </div>
        <span className="featured-price">
          {formatMoney(Math.round(product.price * 100))}
          <small>Demo USD</small>
        </span>
        <AddToCart product={product} onAdd={onAdd} />
      </div>
    </section>
  );
}
