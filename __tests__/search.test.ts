import {
  debounce,
  filterProductsByQuery,
  sortProductsByPrice,
} from '../src/utils/search';
import type { Product } from '../src/types/product';
const product = (
  id: number,
  title: string,
  category: string,
  price: number,
): Product => ({
  id,
  title,
  category,
  price,
  description: '',
  discountPercentage: 0,
  rating: 4,
  stock: 2,
  thumbnail: '',
  images: [],
});
describe('search helpers', () => {
  it('delays search work until typing pauses', () => {
    jest.useFakeTimers();
    const search = jest.fn();
    const cancel = debounce(search, 350);
    expect(search).not.toHaveBeenCalled();
    jest.advanceTimersByTime(349);
    expect(search).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(search).toHaveBeenCalledTimes(1);
    cancel();
    jest.useRealTimers();
  });
  it('filters by title or category and sorts by price', () => {
    const items = [
      product(1, 'Silver ring', 'jewellery', 25),
      product(2, 'Fresh lotion', 'beauty', 9),
      product(3, 'Gold ring', 'jewellery', 15),
    ];
    expect(filterProductsByQuery(items, 'ring').map(item => item.id)).toEqual([
      1, 3,
    ]);
    expect(filterProductsByQuery(items, 'BEAUTY').map(item => item.id)).toEqual(
      [2],
    );
    expect(sortProductsByPrice(items).map(item => item.id)).toEqual([2, 3, 1]);
  });
});
