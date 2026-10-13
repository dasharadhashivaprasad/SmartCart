jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
import AsyncStorage from '@react-native-async-storage/async-storage';
import { restoreState, persistState } from '../src/services/storage';

it('restores saved shopping data and uses empty defaults', async () => {
  await AsyncStorage.setItem(
    'smartcart:cart',
    JSON.stringify([{ quantity: 1 }]),
  );
  const state = await restoreState();
  expect(state.cart).toEqual([{ quantity: 1 }]);
  expect(state.wishlist).toEqual([]);
  expect(state.orders).toEqual([]);
});

it('surfaces storage failures to the caller for explicit handling', async () => {
  const getItem = jest
    .spyOn(AsyncStorage, 'getItem')
    .mockRejectedValueOnce(new Error('storage unavailable'));
  await expect(restoreState()).rejects.toThrow('storage unavailable');
  getItem.mockRestore();
});

it('persists each shopping collection', async () => {
  await persistState({ cart: [], wishlist: [], orders: [], products: [] });
  expect(AsyncStorage.setItem).toHaveBeenCalledWith('smartcart:orders', '[]');
});
