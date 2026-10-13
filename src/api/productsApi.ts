import axios from 'axios';
import type { Product, ProductPage } from '../types/product';
import { selectSimilarProducts } from '../utils/similarProducts';

const api = axios.create({ baseURL: 'https://dummyjson.com', timeout: 12000 });

export async function fetchProducts(
  skip = 0,
  limit = 20,
): Promise<ProductPage> {
  const { data } = await api.get<ProductPage>('/products', {
    params: { skip, limit },
  });
  return data;
}

export async function fetchCategories(): Promise<string[]> {
  const { data } = await api.get<Array<{ slug: string }>>(
    '/products/categories',
  );
  return data.map(category => category.slug);
}

export async function fetchCategoryProducts(
  category: string,
): Promise<Product[]> {
  const { data } = await api.get<ProductPage>(
    `/products/category/${encodeURIComponent(category)}`,
    { params: { limit: 30 } },
  );
  return data.products;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const { data } = await api.get<ProductPage>('/products/search', {
    params: { q: query, limit: 30 },
  });
  return data.products;
}

export async function fetchProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}

export async function fetchSimilarProducts(
  product: Product,
): Promise<Product[]> {
  const products = await fetchCategoryProducts(product.category);
  return selectSimilarProducts(products, product.id);
}
