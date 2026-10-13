import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';

export type CartLine = { product: Product; quantity: number };
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] as CartLine[] },
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const found = state.items.find(
        line => line.product.id === action.payload.id,
      );
      if (found) found.quantity += 1;
      else state.items.push({ product: action.payload, quantity: 1 });
    },
    changeQuantity(
      state,
      action: PayloadAction<{ id: number; amount: number }>,
    ) {
      const line = state.items.find(
        item => item.product.id === action.payload.id,
      );
      if (line)
        line.quantity = Math.max(1, line.quantity + action.payload.amount);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        item => item.product.id !== action.payload,
      );
    },
    clearCart(state) {
      state.items = [];
    },
    restoreCart(_state, action: PayloadAction<CartLine[]>) {
      return { items: action.payload };
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.product.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.product.id === action.payload);
      if (!item) return;
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter(
          i => i.product.id !== action.payload,
        );
      }
    },

  },
});

export const {
  addToCart,
  changeQuantity,
  removeFromCart,
  clearCart,
  restoreCart,
  incrementQuantity,
  decrementQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
