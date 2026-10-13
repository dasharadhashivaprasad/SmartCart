import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { theme } from '../theme';
export function Screen({
  children,
  bottom = false,
}: React.PropsWithChildren & { bottom?: boolean }) {
  return (
    <SafeAreaView
      style={styles.safe}
      edges={
        bottom ? ['top', 'bottom', 'left', 'right'] : ['top', 'left', 'right']
      }
    >
      {children}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
});
