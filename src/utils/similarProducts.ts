import type { Product } from '../types/product';
export function selectSimilarProducts(
  products: Product[],
  currentProductId: number,
): Product[] {
  return products
    .filter(product => product.id !== currentProductId)
    .slice(0, 8);
}
