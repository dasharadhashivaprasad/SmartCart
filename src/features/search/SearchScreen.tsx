import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Search } from 'lucide-react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchProducts } from '../../api/productsApi';
import { ProductGrid } from '../../components/ProductGrid';
import { Screen } from '../../components/Screen';
import type { RootStackParamList } from '../../navigation/types';
import type { Product } from '../../types/product';
import { theme } from '../../theme';
import { debounce, sortProductsByPrice } from '../../utils/search';
export default function SearchScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'Search'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState(route.params?.query ?? '');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<'relevance' | 'price'>('relevance');
  const [error, setError] = useState('');
  const requestNumber = useRef(0);
  useEffect(() => {
    const request = ++requestNumber.current;
    return debounce(() => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      searchProducts(query.trim())
        .then(result => {
          if (request === requestNumber.current) setProducts(result);
        })
        .catch(() => {
          if (request === requestNumber.current)
            setError('Search is unavailable. Check your connection.');
        })
        .finally(() => {
          if (request === requestNumber.current) setLoading(false);
        });
    }, 350);
  }, [query]);
  const sorted = sort === 'price' ? sortProductsByPrice(products) : products;
  return (
    <Screen bottom>
      <View style={styles.search}>
        <Search color={theme.colors.secondary} size={18} />
        <TextInput
          autoFocus
          value={query}
          onChangeText={value => {
            setError('');
            setQuery(value);
          }}
          placeholder="Search products"
          style={styles.input}
        />
      </View>
      <View style={styles.tools}>
        <Text style={styles.heading}>
          {query ? 'Search results' : 'Find your next favorite'}
        </Text>
        <Pressable
          onPress={() => setSort(sort === 'price' ? 'relevance' : 'price')}
        >
          <Text style={styles.sort}>
            {sort === 'price' ? 'PRICE ↑' : 'SORT'}
          </Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loader} color={theme.colors.primary} />
      ) : null}
      {error ? <Text style={styles.note}>{error}</Text> : null}
      {!loading && query.length > 0 && products.length === 0 ? (
        <Text style={styles.note}>
          No products matched “{query}”. Try another search.
        </Text>
      ) : null}
      <ProductGrid
        products={sorted}
        onOpen={id => navigation.navigate('ProductDetails', { productId: id })}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  loader: { margin: 24 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
    margin: 20,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 14,
  },
  input: { flex: 1, color: theme.colors.text },
  tools: {
    marginHorizontal: 20,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
  sort: {
    fontSize: 10,
    letterSpacing: 1.3,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  note: {
    marginHorizontal: 20,
    marginBottom: 14,
    color: theme.colors.secondary,
  },
});
