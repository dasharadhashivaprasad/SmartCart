export type RootStackParamList = {
  Tabs: undefined;
  ProductDetails: { productId: number };
  Search: { query?: string } | undefined;
  Category: { category: string };
  Checkout: undefined;
  Orders: undefined;
  OrderDetails: { orderId: string };
  Confirmation: { orderId: string };
};
export type TabParamList = {
  Home: undefined;
  Categories: undefined;
  Wishlist: undefined;
  Cart: undefined;
  Profile: undefined;
};
