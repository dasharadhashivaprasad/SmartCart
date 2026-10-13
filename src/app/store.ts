import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import wishlistReducer from '../features/wishlist/wishlistSlice';
import ordersReducer from '../features/orders/ordersSlice';
import productsReducer from '../features/products/productsSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
    products: productsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
