import type { Product } from '../types/product';
export function sortProductsByPrice(products: Product[]): Product[] {
  return [...products].sort((first, second) => first.price - second.price);
}
export function filterProductsByQuery(
  products: Product[],
  query: string,
): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;
  return products.filter(
    product =>
      product.title.toLowerCase().includes(normalized) ||
      product.category.toLowerCase().includes(normalized),
  );
}
export function debounce(callback: () => void, delay: number): () => void {
  const timer = setTimeout(callback, delay);
  return () => clearTimeout(timer);
}
