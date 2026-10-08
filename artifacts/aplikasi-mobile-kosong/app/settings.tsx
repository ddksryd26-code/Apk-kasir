import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SectionPage } from '@/components/SectionPage';
import { useColors } from '@/hooks/useColors';

export default function SettingsScreen() {
  const colors = useColors();

  return (
    <SectionPage
      title="Pengaturan"
      subtitle="Kelola preferensi aplikasi dan informasi usaha."
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.icon, { backgroundColor: colors.secondary }]}>
          <Ionicons name="options-outline" size={25} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Pengaturan Anda
        </Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]}>
          Preferensi dan informasi usaha akan tersedia di sini.
        </Text>
      </View>
    </SectionPage>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 26,
    paddingVertical: 34,
  },
  icon: {
    alignItems: 'center',
    borderRadius: 20,
    height: 60,
    justifyContent: 'center',
    marginBottom: 18,
    width: 60,
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 280,
    textAlign: 'center',
  },
});
