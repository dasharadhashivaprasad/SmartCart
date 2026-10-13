import { selectSimilarProducts } from '../src/utils/similarProducts';
import { isValidDeliveryDetails } from '../src/utils/validation';
import type { Product } from '../src/types/product';
const product = (id: number): Product => ({
  id,
  title: 'Item ' + id,
  description: '',
  category: 'beauty',
  price: 10,
  discountPercentage: 0,
  rating: 4,
  stock: 2,
  thumbnail: '',
  images: [],
});
describe('product helpers', () => {
  it('excludes the selected product and limits similar results', () => {
    const result = selectSimilarProducts(
      Array.from({ length: 12 }, (_, index) => product(index + 1)),
      4,
    );
    expect(result).toHaveLength(8);
    expect(result.some(item => item.id === 4)).toBe(false);
  });
  it('requires every delivery field', () => {
    expect(
      isValidDeliveryDetails({
        name: 'A',
        address: 'B',
        city: 'C',
        postal: '1',
      }),
    ).toBe(true);
    expect(
      isValidDeliveryDetails({
        name: 'A',
        address: ' ',
        city: 'C',
        postal: '1',
      }),
    ).toBe(false);
  });
});
