import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Minus,
  Plus,
} from 'lucide-react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchProduct, fetchSimilarProducts } from '../../api/productsApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,

} from '../cart/cartSlice';
import { toggleWishlist } from '../wishlist/wishlistSlice';
import { ProductCard } from '../../components/ProductCard';
import { Screen } from '../../components/Screen';
import type { Product } from '../../types/product';
import type { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';

export default function ProductDetailsScreen() {
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'ProductDetails'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [similar, setSimilar] = useState<Product[]>([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const saved = useAppSelector(state =>
    state.wishlist.items.some(item => item.id === params.productId),
  );

  useEffect(() => {
    setLoading(true);
    fetchProduct(params.productId)
      .then(p => {
        setProduct(p);
        return fetchSimilarProducts(p).catch(() => []);
      })
      .then(setSimilar)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params.productId]);

  // Get the actual cart item so we can read its quantity
  const cartItem = useAppSelector(state =>
    state.cart.items.find(item => item.product.id === params.productId),
  );
  const inCart = !!cartItem;
  const quantity = cartItem?.quantity ?? 0;

  if (loading)
    return (
      <Screen bottom>
        <ActivityIndicator color={theme.colors.primary} style={styles.loader} />
      </Screen>
    );

  if (!product)
    return (
      <Screen bottom>
        <Text style={styles.error}>
          We couldn't load this product. Please go back and retry.
        </Text>
      </Screen>
    );

  const images = product.images?.length ? product.images : [product.thumbnail];

  return (
    <Screen bottom>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <Pressable onPress={() => navigation.goBack()}>
            <ArrowLeft color={theme.colors.text} />
          </Pressable>
          <Pressable onPress={() => dispatch(toggleWishlist(product))}>
            <Heart
              color={theme.colors.primary}
              fill={saved ? theme.colors.primary : 'transparent'}
            />
          </Pressable>
        </View>

        <Image source={{ uri: images[imageIndex] }} style={styles.image} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbs}
        >
          {images.slice(0, 8).map((uri, i) => (
            <Pressable key={uri + i} onPress={() => setImageIndex(i)}>
              <Image
                source={{ uri }}
                style={[styles.thumb, i === imageIndex && styles.selected]}
              />
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.info}>
          <Text style={styles.category}>{product.category.toUpperCase()}</Text>
          <Text style={styles.name}>{product.title}</Text>

          <View style={styles.row}>
            <Text style={styles.price}>
              {'$'}
              {product.price.toFixed(2)}
            </Text>
            <Text style={styles.rating}>
              <Star size={13} color="#C88B2B" /> {product.rating.toFixed(1)} ·{' '}
              {product.stock > 0 ? 'In stock' : 'Out of stock'}
            </Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {!inCart ? (
            <Pressable
              style={styles.button}
              onPress={() => dispatch(addToCart(product))}
              disabled={product.stock <= 0}
            >
              <ShoppingBag color="white" size={18} />
              <Text style={styles.buttonText}>Add to bag</Text>
            </Pressable>
          ) : (
            <View style={styles.quantityRow}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => dispatch(decrementQuantity(product.id))}
              >
                <Minus color="white" size={18} />
              </Pressable>

              <Text style={styles.qtyText}>{quantity}</Text>

              <Pressable
                style={[
                  styles.qtyBtn,
                  quantity >= product.stock && styles.disabled,
                ]}
                disabled={quantity >= product.stock}
                onPress={() => dispatch(incrementQuantity(product.id))}
              >
                <Plus color="white" size={18} />
              </Pressable>
            </View>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.similarList}
          >
            {similar.map(item => (
              <View key={item.id} style={styles.similarCard}>
                <ProductCard
                  product={item}
                  width="100%"
                  onPress={() =>
                    navigation.push('ProductDetails', { productId: item.id })
                  }
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { margin: 40 },
  content: { paddingBottom: 28 },
  similarList: { gap: 12 },
  similarCard: { width: 190 },
  top: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: { width: '100%', height: 340, backgroundColor: '#F0EFEC' },
  thumbs: { gap: 8, paddingHorizontal: 20, paddingVertical: 12 },
  thumb: {
    width: 58,
    height: 58,
    borderRadius: 10,
    backgroundColor: '#F0EFEC',
  },
  selected: { borderWidth: 2, borderColor: theme.colors.primary },
  info: { paddingHorizontal: 20 },
  category: { color: theme.colors.secondary, fontSize: 10, letterSpacing: 1.4 },
  name: {
    fontSize: 25,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 7,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  price: { fontSize: 21, fontWeight: '700', color: theme.colors.text },
  rating: { color: '#9A6A12', flexDirection: 'row' },
  description: { color: theme.colors.secondary, lineHeight: 23, marginTop: 18 },

  // Add to bag button
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    marginTop: 22,
  },
  buttonText: { color: 'white', fontWeight: '700' },

  // Quantity controls (shown when item is in cart)
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 22,
  },
  qtyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 18,
    minWidth: 40,
    textAlign: 'center',
  },
  disabled: { opacity: 0.4 },

  similarTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: theme.colors.text,
    marginVertical: 20,
  },
  error: { padding: 24, color: theme.colors.error },
});