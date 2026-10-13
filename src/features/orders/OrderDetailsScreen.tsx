import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useAppSelector } from '../../app/hooks';
import { Screen } from '../../components/Screen';
import type { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
export default function OrderDetailsScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'OrderDetails'>>();
  const order = useAppSelector(state =>
    state.orders.items.find(item => item.id === params.orderId),
  );
  if (!order)
    return (
      <Screen bottom>
        <Text style={styles.title}>Order not found</Text>
      </Screen>
    );
  return (
    <Screen bottom>
      <Text style={styles.title}>Order details</Text>
      <Text style={styles.sub}>
        {order.id} · {new Date(order.createdAt).toLocaleDateString()}
      </Text>
      <ScrollView contentContainerStyle={styles.list}>
        {order.items.map(line => (
          <View key={line.product.id} style={styles.line}>
            <Image
              source={{ uri: line.product.thumbnail }}
              style={styles.image}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.name}>{line.product.title}</Text>
              <Text style={styles.sub}>
                {line.quantity} × {'$'}
                {line.product.price.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
        <Text style={styles.total}>
          Total {'$'}
          {order.total.toFixed(2)}
        </Text>
      </ScrollView>
    </Screen>
  );
}
const styles = StyleSheet.create({
  itemInfo: { flex: 1 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    margin: 20,
    marginBottom: 4,
    color: theme.colors.text,
  },
  sub: {
    color: theme.colors.secondary,
    marginHorizontal: 20,
    marginBottom: 14,
  },
  list: { padding: 20 },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'white',
    marginBottom: 9,
  },
  image: { width: 58, height: 58, borderRadius: 10 },
  name: { color: theme.colors.text, fontWeight: '600' },
  total: {
    textAlign: 'right',
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 18,
  },
});
