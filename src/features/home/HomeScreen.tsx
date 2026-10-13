import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Search, ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadProducts } from '../products/productsSlice';
import { fetchCategories } from '../../api/productsApi';
import { ProductCard } from '../../components/ProductCard';
import { Screen } from '../../components/Screen';
import { theme } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { items, loading, error, total } = useAppSelector(
    state => state.products,
  );
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  useEffect(() => {
    if (!items.length) dispatch(loadProducts(0));
  }, [dispatch, items.length]);
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);
  const openSearch = () => navigation.navigate('Search', { query });
  return (
    <Screen>
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>SmartCart</Text>
          <Text style={styles.tag}>DISCOVER. SHOP. ENJOY.</Text>
        </View>
        <Text style={styles.welcome}>Good things,{'\n'}picked for you.</Text>
      </View>
      <Pressable style={styles.search} onPress={openSearch}>
        <Search size={19} color={theme.colors.secondary} />
        <TextInput
          placeholder="Search products"
          placeholderTextColor={theme.colors.secondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={openSearch}
          returnKeyType="search"
          style={styles.input}
        />
      </Pressable>
      <FlatList
        data={items}
        keyExtractor={item => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.banner}>
              <View style={styles.bannerCopy}>
                <Text style={styles.eyebrow}>THE NEW SEASON</Text>
                <Text style={styles.bannerTitle}>
                  Little finds.{'\n'}Big delight.
                </Text>
                <Text style={styles.bannerSub}>
                  Thoughtful picks for everyday living.
                </Text>
              </View>
              <View style={styles.bannerMark}>
                <Text style={styles.mark}>SC</Text>
              </View>
            </View>
            <View style={styles.sectionHead}>
              <Text style={styles.section}>Shop by category</Text>
              <ArrowRight size={18} color={theme.colors.text} />
            </View>
            {categories.length ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chips}
              >
                {categories.slice(0, 10).map(category => (
                  <Pressable
                    key={category}
                    onPress={() =>
                      navigation.navigate('Category', { category })
                    }
                    style={styles.chip}
                  >
                    <Text style={styles.chipText}>
                      {category.replaceAll('-', ' ')}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}
            <View style={styles.sectionHead}>
              <Text style={styles.section}>Featured for you</Text>
              <Text style={styles.count}>CURATED</Text>
            </View>
            {loading && items.length === 0 ? (
              <ActivityIndicator
                color={theme.colors.primary}
                style={styles.loader}
              />
            ) : null}
            {error && items.length === 0 ? (
              <Pressable onPress={() => dispatch(loadProducts(0))}>
                <Text style={styles.error}>{error} Tap to retry</Text>
              </Pressable>
            ) : null}
          </>
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate('ProductDetails', { productId: item.id })
            }
          />
        )}
        onEndReached={() => {
          if (!loading && items.length < total)
            dispatch(loadProducts(items.length));
        }}
        onEndReachedThreshold={0.6}
        onRefresh={() => dispatch(loadProducts(0))}
        refreshing={loading && items.length > 0}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  bannerCopy: { flex: 1 },
  loader: { margin: 30 },
  header: { paddingHorizontal: 20, paddingTop: 9, paddingBottom: 18 },
  brand: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: '800',
    letterSpacing: -1,
  },
  tag: {
    fontSize: 9,
    color: theme.colors.secondary,
    letterSpacing: 2,
    marginTop: 2,
  },
  welcome: {
    fontSize: 27,
    color: theme.colors.text,
    fontWeight: '700',
    marginTop: 24,
    lineHeight: 32,
  },
  search: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: 'white',
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 14,
    height: 49,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 14,
    gap: 10,
  },
  input: { flex: 1, color: theme.colors.text, paddingVertical: 0 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  banner: {
    backgroundColor: '#26392F',
    borderRadius: 20,
    padding: 20,
    minHeight: 176,
    flexDirection: 'row',
    marginBottom: 24,
    overflow: 'hidden',
  },
  eyebrow: {
    color: '#D3B990',
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '700',
  },
  bannerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 29,
    marginTop: 12,
  },
  bannerSub: { color: '#D4DCD6', fontSize: 11, marginTop: 9 },
  bannerMark: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D6A863',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    transform: [{ rotate: '-12deg' }],
  },
  mark: { color: '#26392F', fontWeight: '900', fontSize: 20 },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  section: { fontSize: 18, color: theme.colors.text, fontWeight: '700' },
  chips: { gap: 9, paddingBottom: 24 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    backgroundColor: 'white',
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 99,
  },
  chipText: {
    textTransform: 'capitalize',
    color: theme.colors.text,
    fontSize: 12,
  },
  gridRow: { justifyContent: 'space-between' },
  count: { color: theme.colors.secondary, fontSize: 9, letterSpacing: 1.4 },
  error: { color: theme.colors.error, marginVertical: 20 },
});
