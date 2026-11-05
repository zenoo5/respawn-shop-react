// Serve the single existing catalog as a Vercel Web-standard TypeScript function.
import { products } from '../src/features/products/products.data.js';
import { CENTS_PER_DOLLAR } from '../src/features/cart/cart.js';
import type { ApiProductsResponse } from '../src/features/products/products.api.js';

export default {
  // Return JSON for GET and explicitly reject every unsupported HTTP method.
  fetch(request: Request): Response {
    if (request.method !== 'GET') {
      return Response.json(
        { error: 'Method not allowed. Use GET.' },
        {
          status: 405,
          headers: { Allow: 'GET' },
        },
      );
    }
    const body: ApiProductsResponse = {
      items: products.map((product) => ({
        id: product.id,
        title: product.name,
        category_name: product.category,
        developer: product.developer,
        price_cents: Math.round(product.price * CENTS_PER_DOLLAR),
        image: product.image,
        description: product.description,
        ...(product.featuredImage === undefined
          ? {}
          : { featured_image: product.featuredImage }),
        ...(product.badge === undefined ? {} : { badge: product.badge }),
        ...(product.color === undefined ? {} : { color: product.color }),
      })),
      total: products.length,
    };
    return Response.json(body, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  },
};
