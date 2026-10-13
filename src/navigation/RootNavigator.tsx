import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProductDetailsScreen from '../features/products/ProductDetailsScreen';
import SearchScreen from '../features/search/SearchScreen';
import CategoryProductsScreen from '../features/categories/CategoryProductsScreen';
import CheckoutScreen from '../features/checkout/CheckoutScreen';
import ConfirmationScreen from '../features/orders/ConfirmationScreen';
import OrderHistoryScreen from '../features/orders/OrderHistoryScreen';
import OrderDetailsScreen from '../features/orders/OrderDetailsScreen';
import type { RootStackParamList } from './types';
import { theme } from '../theme';
const Stack = createNativeStackNavigator<RootStackParamList>();
export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Tabs" component={BottomTabNavigator} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Category" component={CategoryProductsScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
        <Stack.Screen name="Orders" component={OrderHistoryScreen} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
