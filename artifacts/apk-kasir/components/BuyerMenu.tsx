import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  getMenuAvailableStock,
  useCreatedItems,
  type CreatedItem,
} from '@/contexts/CreatedItemsContext';
import { SectionPage } from '@/components/SectionPage';
import { useColors } from '@/hooks/useColors';

interface SelectedMenuLine {
  item: CreatedItem;
  quantity: number;
}

export function BuyerMenu() {
  const colors = useColors();
  const {
    createdItems,
    storageLoadStatus,
    retryLoadCreatedItems,
  } = useCreatedItems();
  const [selectedQuantities, setSelectedQuantities] =
    useState<Record<string, number>>({});

  const selectedLines: SelectedMenuLine[] = createdItems.menu.flatMap((item) => {
    const available = getMenuAvailableStock(item, createdItems.stock);
    const quantity = Math.min(selectedQuantities[item.id] ?? 0, available);
    return quantity > 0 ? [{ item, quantity }] : [];
  });
  const selectedItemCount = selectedLines.reduce(
    (total, line) => total + line.quantity,
    0,
  );
  const orderTotal = selectedLines.reduce(
    (total, line) => total + line.item.amount * line.quantity,
    0,
  );

  const changeQuantity = (item: CreatedItem, change: 1 | -1) => {
    const available = getMenuAvailableStock(item, createdItems.stock);
    setSelectedQuantities((current) => {
      const currentQuantity = Math.min(current[item.id] ?? 0, available);
      const nextQuantity = Math.max(
        0,
        Math.min(available, currentQuantity + change),
      );
      if (nextQuantity === 0) {
        const { [item.id]: _removed, ...remaining } = current;
        return remaining;
      }
      return { ...current, [item.id]: nextQuantity };
    });
  };

  return (
    <SectionPage
      title="Menu & Pesanan"
      subtitle="Pilih menu dan jumlah untuk menyusun pesanan."
    >
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <View style={[styles.heroIcon, { backgroundColor: colors.accent }]}>
          <Ionicons
            name="restaurant-outline"
            size={23}
            color={colors.accentForeground}
          />
        </View>
        <Text style={[styles.heroEyebrow, { color: colors.primaryForeground }]}>
          MENU UNTUK PEMBELI
        </Text>
        <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>
          Pilih menu untuk pesanan.
        </Text>
        <Text style={[styles.heroDescription, { color: colors.primaryForeground }]}>
          Tekan tombol tambah untuk memilih menu. Pilihan dibatasi oleh stok yang
          tersedia.
        </Text>
      </View>

      {storageLoadStatus === 'error' ? (
        <View
          style={[
            styles.storageError,
            { backgroundColor: colors.secondary },
          ]}
        >
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={colors.destructive}
          />
          <Text style={[styles.storageErrorText, { color: colors.destructive }]}>
            Menu tersimpan tidak dapat dimuat.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={retryLoadCreatedItems}
            style={styles.retryButton}
          >
            <Text style={[styles.retryText, { color: colors.primary }]}>
              Coba lagi
            </Text>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.sectionHeading}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Daftar menu
        </Text>
        {storageLoadStatus === 'ready' ? (
          <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
            {createdItems.menu.length} menu
          </Text>
        ) : null}
      </View>

      {storageLoadStatus === 'loading' ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.emptyDescription, { color: colors.mutedForeground }]}>
            Memuat menu tersimpan...
          </Text>
        </View>
      ) : storageLoadStatus === 'ready' && createdItems.menu.length === 0 ? (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}>
            <Ionicons name="book-outline" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
            Belum ada menu
          </Text>
          <Text style={[styles.emptyDescription, { color: colors.mutedForeground }]}>
            Menu yang dibuat di Pengaturan akan muncul di sini.
          </Text>
        </View>
      ) : storageLoadStatus === 'ready' ? (
        <View style={styles.menuList}>
          {createdItems.menu.map((item) => {
            const available = getMenuAvailableStock(item, createdItems.stock);
            const quantity = Math.min(
              selectedQuantities[item.id] ?? 0,
              available,
            );
            const isOutOfStock = available <= 0;

            return (
              <View
                key={item.id}
                style={[
                  styles.menuCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.menuTopRow}>
                  <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}>
                    <Ionicons
                      name="restaurant-outline"
                      size={19}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.menuCopy}>
                    <Text style={[styles.menuName, { color: colors.foreground }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.menuCategory, { color: colors.mutedForeground }]}>
                      {item.category ?? 'Lainnya'}
                      {item.drinkSubcategory
                        ? ` · ${item.drinkSubcategory}`
                        : ''}
                    </Text>
                  </View>
                  <Text style={[styles.menuPrice, { color: colors.foreground }]}>
                    Rp {item.amount.toLocaleString('id-ID')}
                  </Text>
                </View>

                <View style={[styles.menuDivider, { backgroundColor: colors.border }]} />

                <View style={styles.menuBottomRow}>
                  <Text
                    style={[
                      styles.stockLabel,
                      { color: isOutOfStock ? colors.destructive : colors.mutedForeground },
                    ]}
                  >
                    {isOutOfStock
                      ? 'Stok habis'
                      : `Stok ${available.toLocaleString('id-ID')}`}
                  </Text>
                  <View style={styles.quantityControls}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Kurangi ${item.name} dari pesanan`}
                      disabled={quantity <= 0}
                      onPress={() => changeQuantity(item, -1)}
                      style={({ pressed }) => [
                        styles.quantityButton,
                        { backgroundColor: colors.secondary },
                        quantity <= 0 && styles.disabledButton,
                        pressed && quantity > 0 && styles.pressed,
                      ]}
                      testID={`order-decrease-${item.id}`}
                    >
                      <Ionicons
                        name="remove"
                        size={18}
                        color={quantity <= 0 ? colors.mutedForeground : colors.primary}
                      />
                    </Pressable>
                    <Text
                      accessibilityLabel={`${quantity} ${item.name} dipilih`}
                      style={[styles.quantityValue, { color: colors.foreground }]}
                    >
                      {quantity}
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Tambah ${item.name} ke pesanan`}
                      disabled={isOutOfStock || quantity >= available}
                      onPress={() => changeQuantity(item, 1)}
                      style={({ pressed }) => [
                        styles.quantityButton,
                        { backgroundColor: colors.primary },
                        (isOutOfStock || quantity >= available) &&
                          styles.disabledButton,
                        pressed &&
                          !isOutOfStock &&
                          quantity < available &&
                          styles.pressed,
                      ]}
                      testID={`order-increase-${item.id}`}
                    >
                      <Ionicons
                        name="add"
                        size={18}
                        color={colors.primaryForeground}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={styles.orderSectionHeading}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Pesanan
        </Text>
        <Text style={[styles.countLabel, { color: colors.mutedForeground }]}>
          {selectedItemCount} item
        </Text>
      </View>
      <View
        style={[
          styles.orderCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {selectedLines.length === 0 ? (
          <Text style={[styles.emptyOrderText, { color: colors.mutedForeground }]}>
            Pilih menu di atas untuk mulai menyusun pesanan.
          </Text>
        ) : (
          selectedLines.map(({ item, quantity }) => (
            <View key={item.id} style={styles.orderLine}>
              <Text
                numberOfLines={1}
                style={[styles.orderLineName, { color: colors.foreground }]}
              >
                {item.name} × {quantity}
              </Text>
              <Text style={[styles.orderLinePrice, { color: colors.foreground }]}>
                Rp {(item.amount * quantity).toLocaleString('id-ID')}
              </Text>
            </View>
          ))
        )}
        <View style={[styles.orderDivider, { backgroundColor: colors.border }]} />
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: colors.foreground }]}>
            Total
          </Text>
          <Text style={[styles.totalAmount, { color: colors.primary }]}>
            Rp {orderTotal.toLocaleString('id-ID')}
          </Text>
        </View>
      </View>
    </SectionPage>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: 24,
    marginBottom: 25,
    minHeight: 202,
    overflow: 'hidden',
    padding: 20,
  },
  heroIcon: {
    alignItems: 'center',
    borderRadius: 15,
    height: 42,
    justifyContent: 'center',
    marginBottom: 17,
    width: 42,
  },
  heroEyebrow: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 1.3,
    marginBottom: 7,
    opacity: 0.75,
  },
  heroTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 21,
    letterSpacing: -0.4,
    lineHeight: 27,
  },
  heroDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
    maxWidth: 295,
    opacity: 0.84,
  },
  storageError: {
    alignItems: 'center',
    borderRadius: 13,
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  storageErrorText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  retryButton: {
    paddingVertical: 3,
  },
  retryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  sectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    letterSpacing: -0.2,
  },
  countLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  emptyCard: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 26,
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  emptyIcon: {
    alignItems: 'center',
    borderRadius: 15,
    height: 46,
    justifyContent: 'center',
    marginBottom: 13,
    width: 46,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
  },
  emptyDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
    textAlign: 'center',
  },
  menuList: {
    gap: 12,
    marginBottom: 26,
  },
  menuCard: {
    borderRadius: 19,
    borderWidth: 1,
    padding: 14,
  },
  menuTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuIcon: {
    alignItems: 'center',
    borderRadius: 13,
    height: 42,
    justifyContent: 'center',
    marginRight: 11,
    width: 42,
  },
  menuCopy: {
    flex: 1,
    minWidth: 0,
    paddingRight: 6,
  },
  menuName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  menuCategory: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 3,
  },
  menuPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 11,
  },
  menuBottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  quantityControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 11,
  },
  quantityButton: {
    alignItems: 'center',
    borderRadius: 11,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  quantityValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    minWidth: 20,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.7,
  },
  orderSectionHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderCard: {
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 22,
    padding: 16,
  },
  emptyOrderText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    paddingVertical: 3,
  },
  orderLine: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 11,
  },
  orderLineName: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginRight: 10,
  },
  orderLinePrice: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  orderDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 5,
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 7,
  },
  totalLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  totalAmount: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
});
