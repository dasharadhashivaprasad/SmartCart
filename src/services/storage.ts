import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartLine } from '../features/cart/cartSlice';
import type { Product } from '../types/product';
import type { Order } from '../features/orders/ordersSlice';
const key = (name: string) => `smartcart:${name}`;
export async function restoreState() {
  const [cart, wishlist, orders, products] = await Promise.all(
    ['cart', 'wishlist', 'orders', 'products'].map(name =>
      AsyncStorage.getItem(key(name)),
    ),
  );
  return {
    cart: JSON.parse(cart ?? '[]') as CartLine[],
    wishlist: JSON.parse(wishlist ?? '[]') as Product[],
    orders: JSON.parse(orders ?? '[]') as Order[],
    products: JSON.parse(products ?? '[]') as Product[],
  };
}
export async function persistState(state: {
  cart: CartLine[];
  wishlist: Product[];
  orders: Order[];
  products: Product[];
}) {
  await Promise.all(
    Object.entries(state).map(([name, value]) =>
      AsyncStorage.setItem(key(name), JSON.stringify(value)),
    ),
  );
}
