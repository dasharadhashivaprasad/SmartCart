import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { fetchProducts } from '../../api/productsApi';
import type { Product } from '../../types/product';
export const loadProducts = createAsyncThunk(
  'products/load',
  async (skip: number) => fetchProducts(skip, 20),
);
const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [] as Product[], total: 0, loading: false, error: '' },
  reducers: {
    restoreProducts(state, action: PayloadAction<Product[]>) {
      if (!state.items.length) state.items = action.payload;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(loadProducts.pending, state => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.items = action.meta.arg
          ? [...state.items, ...action.payload.products]
          : action.payload.products;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(loadProducts.rejected, state => {
        state.loading = false;
        state.error =
          'We could not load products. Check your connection and try again.';
      }),
});
export const { restoreProducts } = productsSlice.actions;
export default productsSlice.reducer;
