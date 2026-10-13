import reducer, {
  addOrder,
  type Order,
} from '../src/features/orders/ordersSlice';
const order: Order = {
  id: 'SC-12345678',
  createdAt: '2026-01-01T00:00:00.000Z',
  items: [],
  total: 5,
};
it('stores a completed order in purchase history', () => {
  const next = reducer(undefined, addOrder(order));
  expect(next.items[0]).toEqual(order);
});
