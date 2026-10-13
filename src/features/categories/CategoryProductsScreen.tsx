import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchCategoryProducts } from '../../api/productsApi';
import { ProductGrid } from '../../components/ProductGrid';
import { Screen } from '../../components/Screen';
import type { RootStackParamList } from '../../navigation/types';
import type { Product } from '../../types/product';
import { theme } from '../../theme';
export default function CategoryProductsScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Category'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetchCategoryProducts(params.category)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [params.category]);
  return (
    <Screen bottom>
      <Text style={styles.title}>{params.category.replaceAll('-', ' ')}</Text>
      {loading ? (
        <ActivityIndicator
          color={theme.colors.primary}
          style={styles.loading}
        />
      ) : null}
      <ProductGrid
        products={products}
        onOpen={id => navigation.navigate('ProductDetails', { productId: id })}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  loading: { margin: 24 },
  title: {
    textTransform: 'capitalize',
    fontSize: 25,
    fontWeight: '700',
    color: theme.colors.text,
    margin: 20,
  },
});
