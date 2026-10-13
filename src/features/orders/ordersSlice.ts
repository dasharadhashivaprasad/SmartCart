import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartLine } from '../cart/cartSlice';
export type Order = {
  id: string;
  createdAt: string;
  items: CartLine[];
  total: number;
};
const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [] as Order[] },
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.items.unshift(action.payload);
    },
    restoreOrders(_state, action: PayloadAction<Order[]>) {
      return { items: action.payload };
    },
  },
});
export const { addOrder, restoreOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
