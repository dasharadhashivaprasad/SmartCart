import reducer, {
  addToCart,
  changeQuantity,
  clearCart,
  removeFromCart,
} from '../src/features/cart/cartSlice';
import {
  calculateGrandTotal,
  calculateSubtotal,
} from '../src/utils/cartCalculations';
import type { Product } from '../src/types/product';

const product: Product = {
  id: 1,
  title: 'Lamp',
  description: 'A lamp',
  category: 'home-decoration',
  price: 20,
  discountPercentage: 0,
  rating: 4.5,
  stock: 4,
  thumbnail: 'https://example.com/lamp.jpg',
  images: [],
};
describe('cart', () => {
  it('adds, updates quantities, removes lines and clears all items', () => {
    let state = reducer(undefined, addToCart(product));
    state = reducer(state, addToCart(product));
    expect(state.items[0].quantity).toBe(2);
    state = reducer(state, changeQuantity({ id: 1, amount: -1 }));
    expect(state.items[0].quantity).toBe(1);
    state = reducer(state, removeFromCart(1));
    expect(state.items).toHaveLength(0);
    state = reducer(state, addToCart(product));
    expect(reducer(state, clearCart()).items).toHaveLength(0);
  });
  it('calculates subtotal and delivery in the grand total', () => {
    const state = reducer(undefined, addToCart(product));
    expect(calculateSubtotal(state.items)).toBe(20);
    expect(calculateGrandTotal(state.items)).toBe(25);
    expect(calculateGrandTotal([])).toBe(0);
  });
});
