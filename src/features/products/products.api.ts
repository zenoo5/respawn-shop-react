// Validate API game records and map them into the storefront's existing Product type.
import { fetchJson, isRecord } from '../../shared/api/client.js';
import { CENTS_PER_DOLLAR } from '../cart/cart.js';
import type { Product, ProductCategory } from './products.types.js';

export interface ApiProduct {
  id: string;
  title: string;
  category_name: ProductCategory;
  developer: string;
  price_cents: number;
  image: string;
  description: string;
  featured_image?: string;
  badge?: string;
  color?: string;
}

export interface ApiProductsResponse {
  items: ApiProduct[];
  total: number;
}

// Recognize only genres supported by the existing catalog controls.
function isCategory(value: unknown): value is ProductCategory {
  return (
    value === 'RPG' ||
    value === 'Action-Adventure' ||
    value === 'Survival Horror' ||
    value === 'Metroidvania' ||
    value === 'Adventure'
  );
}

// Accept local game-image paths without protocols, queries, or path traversal.
function isGameImage(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\/images\/games\/[a-z0-9-]+\.(jpg|png|webp|svg)$/.test(value)
  );
}

// Reject missing fields and invalid prices before constructing a typed API record.
function parseApiProduct(value: unknown): ApiProduct {
  if (
    !isRecord(value) ||
    typeof value.id !== 'string' ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.id) ||
    typeof value.title !== 'string' ||
    value.title.trim() === '' ||
    !isCategory(value.category_name) ||
    typeof value.developer !== 'string' ||
    value.developer.trim() === '' ||
    typeof value.price_cents !== 'number' ||
    !Number.isSafeInteger(value.price_cents) ||
    value.price_cents < 0 ||
    !isGameImage(value.image) ||
    typeof value.description !== 'string' ||
    value.description.trim() === '' ||
    (value.featured_image !== undefined &&
      !isGameImage(value.featured_image)) ||
    (value.badge !== undefined && typeof value.badge !== 'string') ||
    (value.color !== undefined && typeof value.color !== 'string')
  ) {
    throw new Error('Invalid API product.');
  }
  return {
    id: value.id,
    title: value.title,
    category_name: value.category_name,
    developer: value.developer,
    price_cents: value.price_cents,
    image: value.image,
    description: value.description,
    ...(value.featured_image === undefined
      ? {}
      : { featured_image: value.featured_image }),
    ...(value.badge === undefined ? {} : { badge: value.badge }),
    ...(value.color === undefined ? {} : { color: value.color }),
  };
}

// Validate list shape, totals, and unique IDs at the network boundary.
function parseProductsResponse(value: unknown): ApiProductsResponse {
  if (
    !isRecord(value) ||
    !Array.isArray(value.items) ||
    typeof value.total !== 'number' ||
    !Number.isSafeInteger(value.total) ||
    value.total !== value.items.length
  )
    throw new Error('Invalid products response.');
  const items = value.items.map((item: unknown) => parseApiProduct(item));
  if (new Set(items.map((item) => item.id)).size !== items.length)
    throw new Error('Duplicate product IDs.');
  return { items, total: value.total };
}

// Convert wire-format names and integer cents while preserving optional artwork.
export function toProduct(item: ApiProduct): Product {
  const value = parseApiProduct(item);
  return {
    id: value.id,
    name: value.title,
    category: value.category_name,
    developer: value.developer,
    price: value.price_cents / CENTS_PER_DOLLAR,
    image: value.image,
    description: value.description,
    ...(value.featured_image === undefined
      ? {}
      : { featuredImage: value.featured_image }),
    ...(value.badge === undefined ? {} : { badge: value.badge }),
    ...(value.color === undefined ? {} : { color: value.color }),
  };
}

// Load games through an actual HTTP request with no local-data fallback.
export async function getProducts(): Promise<Product[]> {
  const response = await fetchJson<ApiProductsResponse>(
    '/api/products',
    parseProductsResponse,
  );
  return response.items.map(toProduct);
}
