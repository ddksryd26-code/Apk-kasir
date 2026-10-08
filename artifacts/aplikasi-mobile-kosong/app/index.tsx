import { StyleSheet, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();

  return (
    <View
      accessible={false}
      style={[styles.container, { backgroundColor: colors.background }]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
