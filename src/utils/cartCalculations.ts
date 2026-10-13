import type { CartLine } from '../features/cart/cartSlice';
export const calculateSubtotal = (items: CartLine[]) =>
  items.reduce((total, item) => total + item.product.price * item.quantity, 0);
export const calculateGrandTotal = (items: CartLine[]) =>
  calculateSubtotal(items) + (items.length ? 5 : 0);
