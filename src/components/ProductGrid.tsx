import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';
export function ProductGrid({
  products,
  onOpen,
  onEndReached,
  refreshing,
  onRefresh,
}: {
  products: Product[];
  onOpen: (id: number) => void;
  onEndReached?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  return (
    <FlatList
      data={products}
      numColumns={2}
      keyExtractor={item => String(item.id)}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <ProductCard product={item} onPress={() => onOpen(item.id)} />
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
}
const styles = StyleSheet.create({
  row: { justifyContent: 'space-between' },
  content: { paddingHorizontal: 20, paddingBottom: 28 },
});
