import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../../app/hooks';
import { ProductGrid } from '../../components/ProductGrid';
import { Screen } from '../../components/Screen';
import type { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
export default function WishlistScreen() {
  const items = useAppSelector(state => state.wishlist.items);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen>
      <Text style={styles.title}>Your wishlist</Text>
      {items.length ? (
        <ProductGrid
          products={items}
          onOpen={id =>
            navigation.navigate('ProductDetails', { productId: id })
          }
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emoji}>♡</Text>
          <Text style={styles.message}>Keep the things you love close.</Text>
          <Text style={styles.sub}>
            Tap the heart on any product to save it here.
          </Text>
        </View>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
    margin: 20,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  emoji: { fontSize: 52, color: theme.colors.primary },
  message: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 12,
  },
  sub: { textAlign: 'center', color: theme.colors.secondary, marginTop: 8 },
});
