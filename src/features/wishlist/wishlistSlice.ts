import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [] as Product[] },
  reducers: {
    toggleWishlist(state, action: PayloadAction<Product>) {
      const exists = state.items.some(item => item.id === action.payload.id);
      state.items = exists
        ? state.items.filter(item => item.id !== action.payload.id)
        : [...state.items, action.payload];
    },
    restoreWishlist(_state, action: PayloadAction<Product[]>) {
      return { items: action.payload };
    },
  },
});
export const { toggleWishlist, restoreWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
