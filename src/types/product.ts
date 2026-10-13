export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
};

export type ProductPage = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};
