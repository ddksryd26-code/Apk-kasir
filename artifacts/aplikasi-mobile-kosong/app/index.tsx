import { Ionicons } from '@expo/vector-icons';
import { Text, View, StyleSheet } from 'react-native';
import { SectionPage } from '@/components/SectionPage';
import { useColors } from '@/hooks/useColors';

export default function HomeScreen() {
  const colors = useColors();

  return (
    <SectionPage
      title="Menu & Pesanan"
      subtitle="Atur katalog dan ikuti pesanan dari satu tempat."
    >
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <View style={[styles.heroIcon, { backgroundColor: colors.accent }]}>
          <Ionicons name="restaurant-outline" size={24} color={colors.accentForeground} />
        </View>
        <Text style={[styles.heroEyebrow, { color: colors.primaryForeground }]}>
          RUANG KERJA
        </Text>
        <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>
          Mulai dari menu pertama Anda.
        </Text>
        <Text style={[styles.heroDescription, { color: colors.primaryForeground }]}>
          Menu dan pesanan yang dikelola akan ditampilkan di sini.
        </Text>
        <View style={[styles.heroDecoration, { borderColor: colors.primaryForeground }]} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        Ringkasan
      </Text>
      <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.summaryRow}>
          <View style={[styles.rowIcon, { backgroundColor: colors.secondary }]}>
            <Ionicons name="book-outline" size={19} color={colors.primary} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>Daftar menu</Text>
            <Text style={[styles.rowDescription, { color: colors.mutedForeground }]}>
              Katalog menu Anda masih kosong.
            </Text>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.summaryRow}>
          <View style={[styles.rowIcon, { backgroundColor: colors.secondary }]}>
            <Ionicons name="receipt-outline" size={19} color={colors.primary} />
          </View>
          <View style={styles.rowText}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>Pesanan masuk</Text>
            <Text style={[styles.rowDescription, { color: colors.mutedForeground }]}>
              Pesanan baru akan muncul di sini.
            </Text>
          </View>
        </View>
      </View>
    </SectionPage>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 26,
    marginBottom: 28,
    minHeight: 222,
    overflow: 'hidden',
    padding: 22,
  },
  heroIcon: {
    alignItems: 'center',
    borderRadius: 17,
    height: 46,
    justifyContent: 'center',
    marginBottom: 20,
    width: 46,
  },
  heroEyebrow: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 1.4,
    marginBottom: 8,
    opacity: 0.72,
  },
  heroTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    letterSpacing: -0.5,
    lineHeight: 28,
    maxWidth: 260,
  },
  heroDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 9,
    maxWidth: 260,
    opacity: 0.82,
  },
  heroDecoration: {
    borderRadius: 80,
    borderWidth: 1,
    height: 150,
    opacity: 0.1,
    position: 'absolute',
    right: -57,
    top: 27,
    width: 150,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: -0.2,
    marginBottom: 13,
  },
  summaryCard: {
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  summaryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 82,
  },
  rowIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 42,
    justifyContent: 'center',
    marginRight: 13,
    width: 42,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  rowDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 55,
  },
});
