
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Heart,
  House,
  LayoutGrid,
  ShoppingBag,
  UserRound,
} from 'lucide-react-native';

import HomeScreen from '../features/home/HomeScreen';
import CategoriesScreen from '../features/categories/CategoriesScreen';
import WishlistScreen from '../features/wishlist/WishlistScreen';
import CartScreen from '../features/cart/CartScreen';
import ProfileScreen from '../features/profile/ProfileScreen';

import { useAppSelector } from '../app/hooks';
import { theme } from '../theme';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

type IconArgs = { color: string; size: number };

const TAB_ICONS: Record<
  keyof TabParamList,
  (args: IconArgs) => React.ReactElement
> = {
  Home: ({ color, size }) => <House color={color} size={size} />,
  Categories: ({ color, size }) => <LayoutGrid color={color} size={size} />,
  Wishlist: ({ color, size }) => <Heart color={color} size={size} />,
  Cart: ({ color, size }) => <ShoppingBag color={color} size={size} />,
  Profile: ({ color, size }) => <UserRound color={color} size={size} />,
};

export default function BottomTabNavigator() {
  const insets = useSafeAreaInsets();

  const count = useAppSelector(state =>
    state.cart.items.reduce((sum, line) => sum + line.quantity, 0),
  );

  const BASE_TAB_HEIGHT = 60;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const IconComponent = TAB_ICONS[route.name as keyof TabParamList];

        return {
          headerShown: false,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.secondary,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            height: BASE_TAB_HEIGHT + insets.bottom,
            paddingTop: 8,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
            borderTopColor: theme.colors.border,
            borderTopWidth: 1,
            backgroundColor: 'white',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            marginBottom: 4,
            fontWeight: '500',
          },
          tabBarItemStyle: {
            paddingVertical: 2,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <IconComponent color={color} size={focused ? size + 2 : size} />
          ),
          tabBarBadge:
            route.name === 'Cart' && count > 0 ? count : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.colors.primary,
            color: 'white',
            fontSize: 9,
            minWidth: 16,
            height: 16,
            lineHeight: 16,
          },
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ tabBarLabel: 'Categories' }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{ tabBarLabel: 'Wishlist' }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarLabel: 'Cart' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}