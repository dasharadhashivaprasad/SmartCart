import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { Screen } from '../../components/Screen';
import { theme } from '../../theme';
export default function ConfirmationScreen() {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Confirmation'>>();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Screen bottom>
      <View style={styles.content}>
        <View style={styles.icon}>
          <Check color="white" size={34} />
        </View>
        <Text style={styles.title}>Order confirmed</Text>
        <Text style={styles.subtitle}>
          Thank you for shopping with SmartCart. Your order {params.orderId} is
          saved on this device.
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.buttonText}>View order history</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Tabs')}>
          <Text style={styles.link}>Back to shopping</Text>
        </Pressable>
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 26,
  },
  icon: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: theme.colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 20,
  },
  subtitle: {
    textAlign: 'center',
    color: theme.colors.secondary,
    lineHeight: 22,
    marginTop: 9,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 14,
    marginTop: 26,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: '700' },
  link: { color: theme.colors.secondary, marginTop: 18 },
});
