import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../../app/hooks';
import { Screen } from '../../components/Screen';
import type { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
export default function OrderHistoryScreen() {
  const orders = useAppSelector(state => state.orders.items);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen bottom>
      <Text style={styles.title}>Order history</Text>
      {orders.length ? (
        <ScrollView contentContainerStyle={styles.list}>
          {orders.map(order => (
            <Pressable
              key={order.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('OrderDetails', { orderId: order.id })
              }
            >
              <View style={styles.row}>
                <Text style={styles.id}>{order.id}</Text>
                <Text style={styles.price}>
                  {'$'}
                  {order.total.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.date}>
                {new Date(order.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.summary}>
                {order.items.length} product
                {order.items.length === 1 ? '' : 's'} · Tap for details
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Your purchases will appear here.</Text>
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
  list: { paddingHorizontal: 20 },
  card: {
    backgroundColor: 'white',
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 15,
    padding: 16,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  id: { color: theme.colors.text, fontWeight: '700' },
  price: { color: theme.colors.text, fontWeight: '700' },
  date: { color: theme.colors.secondary, fontSize: 12, marginTop: 6 },
  summary: { color: theme.colors.secondary, fontSize: 12, marginTop: 9 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: theme.colors.secondary },
});
