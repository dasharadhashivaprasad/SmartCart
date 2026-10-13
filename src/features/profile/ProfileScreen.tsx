import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronRight, Package, ShoppingBag } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppSelector } from '../../app/hooks';
import { Screen } from '../../components/Screen';
import type { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
export default function ProfileScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const orderCount = useAppSelector(state => state.orders.items.length);
  return (
    <Screen>
      <Text style={styles.title}>Your account</Text>
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.initial}>S</Text>
        </View>
        <View>
          <Text style={styles.name}>SmartCart shopper</Text>
          <Text style={styles.note}>Your little corner of the store</Text>
        </View>
      </View>
      <Pressable
        style={styles.row}
        onPress={() => navigation.navigate('Orders')}
      >
        <Package color={theme.colors.primary} />
        <Text style={styles.rowText}>Order history ({orderCount})</Text>
        <ChevronRight color={theme.colors.secondary} />
      </Pressable>
      <View style={styles.row}>
        <ShoppingBag color={theme.colors.primary} />
        <Text style={styles.rowText}>Demo store · DummyJSON</Text>
      </View>
      <Text style={styles.foot}>Shopping made thoughtful.</Text>
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
  profile: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: theme.colors.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { fontWeight: '700', color: theme.colors.primary, fontSize: 22 },
  name: { fontWeight: '700', color: theme.colors.text },
  note: { color: theme.colors.secondary, fontSize: 12, marginTop: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
  },
  rowText: { flex: 1, color: theme.colors.text, fontWeight: '600' },
  foot: { color: theme.colors.secondary, textAlign: 'center', marginTop: 50 },
});
