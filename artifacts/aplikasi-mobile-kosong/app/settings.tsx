import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SectionPage } from '@/components/SectionPage';
import { useColors } from '@/hooks/useColors';

const settingsSections = [
  {
    id: 'stock',
    title: 'Stok',
    description: 'Catat dan kelola persediaan barang.',
    icon: 'cube-outline',
    emptyTitle: 'Belum ada stok',
    emptyDescription: 'Daftar stok yang Anda buat akan muncul di sini.',
  },
  {
    id: 'menu',
    title: 'Menu',
    description: 'Atur item menu dan harga yang ditawarkan.',
    icon: 'restaurant-outline',
    emptyTitle: 'Belum ada menu',
    emptyDescription: 'Menu yang Anda buat akan muncul di sini.',
  },
  {
    id: 'staff',
    title: 'Kelola Staff',
    description: 'Kelola orang yang membantu operasional.',
    icon: 'people-outline',
    emptyTitle: 'Belum ada staff',
    emptyDescription: 'Staff yang Anda tambahkan akan ditampilkan di sini.',
  },
  {
    id: 'reports',
    title: 'Laporan',
    description: 'Lihat ringkasan usaha dan aktivitas transaksi.',
    icon: 'bar-chart-outline',
    emptyTitle: 'Belum ada laporan',
    emptyDescription: 'Laporan akan tersedia setelah data usaha tercatat.',
  },
] as const;

type SettingsSectionId = (typeof settingsSections)[number]['id'];

export default function SettingsScreen() {
  const colors = useColors();
  const [activeSection, setActiveSection] = useState<SettingsSectionId | null>(null);
  const selectedSection = settingsSections.find(
    (section) => section.id === activeSection,
  );

  return (
    <SectionPage
      title={selectedSection?.title ?? 'Pengaturan'}
      subtitle={
        selectedSection?.description ??
        'Kelola menu, persediaan, staff, dan laporan usaha.'
      }
    >
      {selectedSection ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Kembali ke menu pengaturan"
            onPress={() => setActiveSection(null)}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            testID="settings-subpage-back"
          >
            <Ionicons name="arrow-back" size={18} color={colors.primary} />
            <Text style={[styles.backLabel, { color: colors.primary }]}>
              Pengaturan
            </Text>
          </Pressable>

          <View
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
              <Ionicons
                name={selectedSection.icon}
                size={25}
                color={colors.primary}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              {selectedSection.emptyTitle}
            </Text>
            <Text style={[styles.emptyDescription, { color: colors.mutedForeground }]}>
              {selectedSection.emptyDescription}
            </Text>
          </View>
        </>
      ) : (
        <View
          style={[
            styles.menuCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {settingsSections.map((section, index) => (
            <View key={section.id}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={section.title}
                onPress={() => setActiveSection(section.id)}
                style={({ pressed }) => [
                  styles.menuRow,
                  pressed && styles.pressed,
                ]}
                testID={`settings-menu-${section.id}`}
              >
                <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}>
                  <Ionicons
                    name={section.icon}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.menuCopy}>
                  <Text style={[styles.menuTitle, { color: colors.foreground }]}>
                    {section.title}
                  </Text>
                  <Text
                    style={[
                      styles.menuDescription,
                      { color: colors.mutedForeground },
                    ]}
                  >
                    {section.description}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.mutedForeground}
                />
              </Pressable>
              {index < settingsSections.length - 1 ? (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              ) : null}
            </View>
          ))}
        </View>
      )}
    </SectionPage>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 86,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  menuIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 44,
    justifyContent: 'center',
    marginRight: 13,
    width: 44,
  },
  menuCopy: {
    flex: 1,
    paddingRight: 8,
  },
  menuTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  menuDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 72,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    marginBottom: 18,
    paddingVertical: 6,
  },
  backLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.68,
  },
  emptyCard: {
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 26,
    paddingVertical: 34,
  },
  emptyIcon: {
    alignItems: 'center',
    borderRadius: 20,
    height: 60,
    justifyContent: 'center',
    marginBottom: 18,
    width: 60,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 280,
    textAlign: 'center',
  },
});
