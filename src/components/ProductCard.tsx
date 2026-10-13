import React, { memo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Heart } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleWishlist } from '../features/wishlist/wishlistSlice';
import type { Product } from '../types/product';
import { theme } from '../theme';

export const ProductCard = memo(
  ({
    product,
    onPress,
    width,
  }: {
    product: Product;
    onPress: () => void;
    width?: number | string;
  }) => {
    const dispatch = useAppDispatch();
    const saved = useAppSelector(state =>
      state.wishlist.items.some(item => item.id === product.id),
    );
    const [imageError, setImageError] = useState(false);
    return (
      <Pressable
        style={[styles.card, width ? { width } : null]}
        onPress={onPress}
      >
        <View style={styles.imageBox}>
          {!imageError && (
            <Image
              source={{ uri: product.thumbnail }}
              style={styles.image}
              onError={() => setImageError(true)}
            />
          )}
          {imageError && (
            <View style={styles.fallback}>
              <Text style={styles.fallbackText}>SmartCart</Text>
            </View>
          )}
          <Pressable
            accessibilityLabel={
              saved ? 'Remove from wishlist' : 'Add to wishlist'
            }
            style={styles.heart}
            onPress={event => {
              event.stopPropagation();
              dispatch(toggleWishlist(product));
            }}
          >
            <Heart
              size={18}
              color={saved ? theme.colors.primary : theme.colors.text}
              fill={saved ? theme.colors.primary : 'transparent'}
            />
          </Pressable>
        </View>
        <Text style={styles.category}>{product.category.toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>
            {'$'}
            {product.price.toFixed(2)}
          </Text>
          <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
        </View>
      </Pressable>
    );
  },
);
const styles = StyleSheet.create({
  card: { width: '48.5%', marginBottom: 18 },
  imageBox: {
    height: 170,
    borderRadius: 18,
    backgroundColor: '#F1F0ED',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  heart: {
    position: 'absolute',
    right: 10,
    top: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fallbackText: { color: theme.colors.secondary },
  category: {
    color: theme.colors.secondary,
    fontSize: 9,
    letterSpacing: 1.1,
    marginTop: 10,
  },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
  price: { color: theme.colors.text, fontSize: 14, fontWeight: '700' },
  rating: { color: '#9A6A12', fontSize: 12 },
});
