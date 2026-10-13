/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(),
    createChannel: jest.fn(),
    createTriggerNotification: jest.fn(),
    cancelNotification: jest.fn(),
  },
  AndroidImportance: { DEFAULT: 3 },
  TriggerType: { TIMESTAMP: 0 },
}));
jest.mock(
  'lucide-react-native',
  () => new Proxy({}, { get: () => () => null }),
);
jest.mock('../src/api/productsApi', () => ({
  fetchProducts: jest
    .fn()
    .mockResolvedValue({ products: [], total: 0, skip: 0, limit: 20 }),
  fetchCategories: jest.fn().mockResolvedValue([]),
  fetchCategoryProducts: jest.fn().mockResolvedValue([]),
  searchProducts: jest.fn().mockResolvedValue([]),
  fetchProduct: jest.fn(),
  fetchSimilarProducts: jest.fn().mockResolvedValue([]),
}));
import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
