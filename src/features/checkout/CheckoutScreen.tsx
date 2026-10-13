import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { clearCart } from '../cart/cartSlice';
import { addOrder } from '../orders/ordersSlice';
import { calculateGrandTotal } from '../../utils/cartCalculations';
import { cancelCartReminder } from '../../services/notifications';
import { Screen } from '../../components/Screen';
import { theme } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';
import { isValidDeliveryDetails } from '../../utils/validation';
export default function CheckoutScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.cart.items);
  const total = calculateGrandTotal(items);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postal, setPostal] = useState('');
  const submit = async () => {
    if (!items.length) {
      Alert.alert('Your cart is empty', 'Add an item before checkout.');
      return;
    }
    if (!isValidDeliveryDetails({ name, address, city, postal })) {
      Alert.alert(
        'Complete your details',
        'Please fill in every delivery field.',
      );
      return;
    }
    const orderId = 'SC-' + Date.now().toString().slice(-8);
    dispatch(
      addOrder({
        id: orderId,
        createdAt: new Date().toISOString(),
        items: [...items],
        total,
      }),
    );
    dispatch(clearCart());
    await cancelCartReminder().catch(() => undefined);
    navigation.replace('Confirmation', { orderId });
  };
  return (
    <Screen bottom>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Checkout</Text>
          <Text style={styles.subtitle}>Where should we send your order?</Text>
          <Text style={styles.label}>FULL NAME</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Your name"
            autoCapitalize="words"
          />
          <Text style={styles.label}>STREET ADDRESS</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            placeholder="Street and number"
          />
          <Text style={styles.label}>CITY</Text>
          <TextInput
            value={city}
            onChangeText={setCity}
            style={styles.input}
            placeholder="City"
            autoCapitalize="words"
          />
          <Text style={styles.label}>POSTAL CODE</Text>
          <TextInput
            value={postal}
            onChangeText={setPostal}
            style={styles.input}
            placeholder="Postal code"
            keyboardType="number-pad"
          />
          <Text style={styles.disclaimer}>
            This is a simulated checkout. No payment details are collected.
          </Text>
          <Text style={styles.total}>
            Order total {'$'}
            {total.toFixed(2)}
          </Text>
          <Pressable style={styles.button} onPress={submit}>
            <Text style={styles.buttonText}>Place order</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 27, fontWeight: '700', color: theme.colors.text },
  subtitle: { color: theme.colors.secondary, marginTop: 5, marginBottom: 22 },
  label: {
    color: theme.colors.secondary,
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 13,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    color: theme.colors.text,
  },
  disclaimer: { color: theme.colors.secondary, fontSize: 12, marginTop: 18 },
  total: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: 22,
    marginBottom: 14,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    alignItems: 'center',
    padding: 16,
  },
  buttonText: { color: 'white', fontWeight: '700' },
});
