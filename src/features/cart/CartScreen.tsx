import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changeQuantity, clearCart, removeFromCart } from './cartSlice';
import {
  calculateGrandTotal,
  calculateSubtotal,
} from '../../utils/cartCalculations';
import { cancelCartReminder } from '../../services/notifications';
import { Screen } from '../../components/Screen';
import { theme } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
export default function CartScreen() {
  const items = useAppSelector(state => state.cart.items);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const clear = async () => {
    dispatch(clearCart());
    await cancelCartReminder().catch(() => undefined);
  };
  return (
    <Screen>
      <Text style={styles.title}>
        Your cart{' '}
        <Text style={styles.count}>
          ({items.reduce((sum, line) => sum + line.quantity, 0)})
        </Text>
      </Text>
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.bag}>⌑</Text>
          <Text style={styles.message}>Your next favorite is out there.</Text>
          <Text style={styles.sub}>Add something lovely to get started.</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.list}>
            {items.map(line => (
              <View key={line.product.id} style={styles.line}>
                <Image
                  source={{ uri: line.product.thumbnail }}
                  style={styles.image}
                />
                <View style={styles.details}>
                  <Text numberOfLines={1} style={styles.name}>
                    {line.product.title}
                  </Text>
                  <Text style={styles.price}>
                    {'$'}
                    {line.product.price.toFixed(2)}
                  </Text>
                  <View style={styles.controls}>
                    <Pressable
                      onPress={() =>
                        dispatch(
                          changeQuantity({ id: line.product.id, amount: -1 }),
                        )
                      }
                      style={styles.qty}
                    >
                      <Minus size={14} />
                    </Pressable>
                    <Text>{line.quantity}</Text>
                    <Pressable
                      onPress={() =>
                        dispatch(
                          changeQuantity({ id: line.product.id, amount: 1 }),
                        )
                      }
                      style={styles.qty}
                    >
                      <Plus size={14} />
                    </Pressable>
                    <Pressable
                      onPress={() => dispatch(removeFromCart(line.product.id))}
                      style={styles.removeButton}
                    >
                      <Trash2 color={theme.colors.error} size={17} />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.summary}>
            <View style={styles.totalRow}>
              <Text style={styles.label}>Subtotal</Text>
              <Text style={styles.value}>
                {'$'}
                {calculateSubtotal(items).toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.label}>Delivery</Text>
              <Text style={styles.value}>
                {'$'}
                {items.length ? '5.00' : '0.00'}
              </Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.grand}>Total</Text>
              <Text style={styles.grand}>
                {'$'}
                {calculateGrandTotal(items).toFixed(2)}
              </Text>
            </View>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.buttonText}>Continue to checkout</Text>
            </Pressable>
            <Pressable onPress={clear}>
              <Text style={styles.clear}>Clear cart</Text>
            </Pressable>
          </View>
        </>
      )}
    </Screen>
  );
}
const styles = StyleSheet.create({
  removeButton: { marginLeft: 10 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: theme.colors.text,
    margin: 20,
  },
  count: { color: theme.colors.secondary, fontSize: 17, fontWeight: '400' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  bag: { fontSize: 54, color: theme.colors.primary },
  message: {
    marginTop: 12,
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  sub: { color: theme.colors.secondary, marginTop: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 12 },
  line: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: 84,
    height: 92,
    borderRadius: 12,
    backgroundColor: '#F0F0EE',
  },
  details: { flex: 1, paddingLeft: 13, justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 7,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  qty: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summary: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    backgroundColor: 'white',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: { color: theme.colors.secondary },
  value: { color: theme.colors.text },
  grand: { color: theme.colors.text, fontWeight: '700', fontSize: 17 },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  buttonText: { color: 'white', fontWeight: '700' },
  clear: {
    textAlign: 'center',
    paddingVertical: 10,
    color: theme.colors.secondary,
    fontSize: 12,
  },
});
