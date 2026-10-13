import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchCategories } from '../../api/productsApi';
import { Screen } from '../../components/Screen';
import { theme } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
const categoryNames: Record<string, string> = {
  beauty: 'Beauty',
  fragrances: 'Fragrance',
  furniture: 'Furniture',
  groceries: 'Groceries',
  'home-decoration': 'Home décor',
  'kitchen-accessories': 'Kitchen',
  laptops: 'Laptops',
  'mens-shirts': 'Menswear',
  'mens-shoes': 'Mens shoes',
  'mens-watches': 'Watches',
  'mobile-accessories': 'Mobile accessories',
  motorcycle: 'Motorcycle',
  'skin-care': 'Skin care',
  smartphones: 'Smartphones',
  'sports-accessories': 'Sports',
  sunglasses: 'Sunglasses',
  tablets: 'Tablets',
  tops: 'Women’s tops',
  vehicle: 'Vehicles',
  'womens-bags': 'Bags',
  'womens-dresses': 'Dresses',
  'womens-jewellery': 'Jewellery',
  'womens-shoes': 'Womens shoes',
  'womens-watches': 'Womens watches',
};
export default function CategoriesScreen() {
  const [categories, setCategories] = useState<string[]>([]);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);
  return (
    <Screen>
      <Text style={styles.title}>Categories</Text>
      <Text style={styles.subtitle}>
        Browse the collection by what you love.
      </Text>
      <FlatList
        data={categories}
        keyExtractor={item => item}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate('Category', { category: item })}
          >
            <View style={styles.number}>
              <Text style={styles.numberText}>
                {String(index + 1).padStart(2, '0')}
              </Text>
            </View>
            <Text style={styles.name}>
              {categoryNames[item] ?? item.replaceAll('-', ' ')}
            </Text>
            <ArrowRight color={theme.colors.secondary} size={18} />
          </Pressable>
        )}
      />
    </Screen>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    margin: 20,
    marginBottom: 5,
    color: theme.colors.text,
  },
  subtitle: {
    color: theme.colors.secondary,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  row: {
    minHeight: 64,
    backgroundColor: 'white',
    borderRadius: 14,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  number: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  numberText: { color: theme.colors.primary, fontSize: 10, fontWeight: '700' },
  name: {
    flex: 1,
    textTransform: 'capitalize',
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
});
