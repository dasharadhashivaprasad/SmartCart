import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/app/store';
import { restoreCart } from './src/features/cart/cartSlice';
import { restoreWishlist } from './src/features/wishlist/wishlistSlice';
import { restoreOrders } from './src/features/orders/ordersSlice';
import { restoreProducts } from './src/features/products/productsSlice';
import { persistState, restoreState } from './src/services/storage';
import {
  cancelCartReminder,
  scheduleCartReminder,
} from './src/services/notifications';
import RootNavigator from './src/navigation/RootNavigator';

function AppContent() {
  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    const boot = async () => {
      try {
        const saved = await restoreState();
        if (!active) return;
        store.dispatch(restoreCart(saved.cart));
        store.dispatch(restoreWishlist(saved.wishlist));
        store.dispatch(restoreOrders(saved.orders));
        store.dispatch(restoreProducts(saved.products));
        if (saved.cart.length)
          await scheduleCartReminder().catch(() => undefined);
      } catch {
        // Local storage can fail independently of the shopping experience.
      }
      let hadItems = store.getState().cart.items.length > 0;
      unsubscribe = store.subscribe(() => {
        const state = store.getState();
        persistState({
          cart: state.cart.items,
          wishlist: state.wishlist.items,
          orders: state.orders.items,
          products: state.products.items,
        }).catch(() => undefined);
        const hasItems = state.cart.items.length > 0;
        if (hasItems && !hadItems)
          scheduleCartReminder().catch(() => undefined);
        if (!hasItems && hadItems) cancelCartReminder().catch(() => undefined);
        hadItems = hasItems;
      });
    };
    boot();
    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </>
  );
}
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
