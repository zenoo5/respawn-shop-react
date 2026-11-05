import { useRef, useState } from "react";
import type { Product } from "../products.types";
import { selectProducts } from "../catalog";
import type { PriceSort } from "../catalog";
import { AddToCart } from "../../../components/ui/AddToCart";
import { formatMoney } from "../../../shared/utils/money";
export function Catalog({
  products,
  onAdd,
}: {
  products: Product[];
  onAdd: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Product["category"] | "all">("all");
  const [sort, setSort] = useState<PriceSort>("default");
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const selected = selectProducts(products, { search, category, sort });
  const categories = [...new Set(products.map((game) => game.category))];
  function reset() {
    setSearch("");
    setCategory("all");
    setSort("default");
  }
  function close() {
    setOpen(false);
    toggle.current?.focus();
  }
  return (
    <section
      id="catalog"
      className="catalog-section"
      aria-labelledby="catalog-title"
    >
      <div className="library-heading">
        <h2 id="catalog-title">
          LIBRARY<span className="heading-dot">/</span>
        </h2>
        <div
          className="catalog-controls"
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setOpen(false);
          }}
        >
          <div className="search-field">
            <label className="visually-hidden" htmlFor="search">
              Search games
            </label>
            <input
              id="search"
              type="search"
              placeholder="Search games"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <button
            ref={toggle}
            type="button"
            className="filter-toggle"
            aria-expanded={open}
            aria-controls="filter-panel"
            onClick={() => setOpen(!open)}
          >
            Filter {category !== "all" || sort !== "default" ? "• On" : "+"}
          </button>
          {open && (
            <div id="filter-panel" className="filter-panel">
              <div className="filter-heading">
                <strong>Refine library</strong>
                <button
                  type="button"
                  className="icon-button"
                  aria-label="Close filters"
                  onClick={close}
                >
                  ×
                </button>
              </div>
              <label htmlFor="category">Genre</label>
              <select
                id="category"
                value={category}
                onChange={(event) => {
                  const value = event.target.value;
                  if (
                    value === "all" ||
                    categories.some((item) => item === value)
                  ) {
                    const match = categories.find((item) => item === value);
                    setCategory(match ?? "all");
                  }
                }}
              >
                <option value="all">All games</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <label htmlFor="sort">Sort by price</label>
              <select
                id="sort"
                value={sort}
                onChange={(event) => {
                  const value = event.target.value;
                  if (
                    value === "default" ||
                    value === "price-asc" ||
                    value === "price-desc"
                  )
                    setSort(value);
                }}
              >
                <option value="default">Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <button type="button" className="text-button" onClick={reset}>
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="price-note">
        Illustrative demo prices in USD · No games are sold.
      </p>
      <p className="results-count" role="status">
        {selected.length} of {products.length} games
      </p>
      <div className="product-grid">
        {selected.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image">
              <img
                src={product.image}
                alt={`${product.name} cover`}
                loading="lazy"
                width="600"
                height="900"
              />
            </div>
            <div className="product-details">
              <p className="product-category">{product.category}</p>
              <div className="product-title-row">
                <h3>{product.name}</h3>
                <span>{formatMoney(Math.round(product.price * 100))}</span>
              </div>
              <AddToCart product={product} onAdd={onAdd} compact />
            </div>
          </article>
        ))}
      </div>
      {selected.length === 0 && (
        <div className="empty-state">
          <h3>{products.length ? "No games found." : "No games available."}</h3>
          <p>Try another title or reset your filters.</p>
          <button type="button" className="button button-lime" onClick={reset}>
            Reset filters
          </button>
        </div>
      )}
    </section>
  );
}
