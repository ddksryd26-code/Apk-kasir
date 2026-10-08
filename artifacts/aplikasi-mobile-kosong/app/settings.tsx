import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
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

interface CreatedItem {
  id: string;
  name: string;
  amount: number;
  unit?: string;
}

type ManageableSectionId = 'stock' | 'menu';
type CreatedItems = Record<ManageableSectionId, CreatedItem[]>;

export default function SettingsScreen() {
  const colors = useColors();
  const [activeSection, setActiveSection] = useState<SettingsSectionId | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [itemUnit, setItemUnit] = useState('pcs');
  const [formError, setFormError] = useState('');
  const [pendingDeleteStock, setPendingDeleteStock] =
    useState<CreatedItem | null>(null);
  const [createdItems, setCreatedItems] = useState<CreatedItems>({
    stock: [],
    menu: [],
  });
  const selectedSection = settingsSections.find(
    (section) => section.id === activeSection,
  );
  const canCreateItems =
    selectedSection?.id === 'stock' || selectedSection?.id === 'menu';
  const activeItems =
    selectedSection?.id === 'stock'
      ? createdItems.stock
      : selectedSection?.id === 'menu'
        ? createdItems.menu
        : [];
  const pageTitle = isCreating
    ? editingStockId
      ? 'Ganti Nama Stok'
      : selectedSection?.id === 'stock'
        ? 'Tambah Stok'
        : 'Tambah Menu'
    : selectedSection?.title ?? 'Pengaturan';
  const pageSubtitle = isCreating
    ? editingStockId
      ? 'Ubah nama stok tanpa mengubah jumlahnya.'
      : selectedSection?.id === 'stock'
        ? 'Isi nama barang dan jumlah stok.'
        : 'Isi nama menu dan harga jual.'
    : selectedSection?.description ??
      'Kelola menu, persediaan, staff, dan laporan usaha.';

  const resetForm = () => {
    setEditingStockId(null);
    setItemName('');
    setItemAmount('');
    setItemUnit('pcs');
    setFormError('');
  };

  const handleBack = () => {
    if (isCreating) {
      setIsCreating(false);
      resetForm();
      return;
    }
    setActiveSection(null);
  };

  const handleCreate = () => {
    if (
      !selectedSection ||
      (selectedSection.id !== 'stock' && selectedSection.id !== 'menu')
    ) {
      return;
    }

    const name = itemName.trim();
    if (!name) {
      setFormError('Masukkan nama terlebih dahulu.');
      return;
    }

    if (editingStockId) {
      if (selectedSection.id !== 'stock') return;
      const stockId = editingStockId;
      setCreatedItems((current) => ({
        ...current,
        stock: current.stock.map((item) =>
          item.id === stockId ? { ...item, name } : item,
        ),
      }));
      setIsCreating(false);
      resetForm();
      return;
    }

    const amount = Number(itemAmount.trim().replace(',', '.'));
    if (!itemAmount.trim() || !Number.isFinite(amount) || amount <= 0) {
      setFormError(
        selectedSection.id === 'stock'
          ? 'Masukkan jumlah stok yang valid.'
          : 'Masukkan harga yang valid.',
      );
      return;
    }

    const item: CreatedItem = {
      id: Date.now().toString(),
      name,
      amount,
      ...(selectedSection.id === 'stock'
        ? { unit: itemUnit.trim() || 'unit' }
        : {}),
    };

    setCreatedItems((current) =>
      selectedSection.id === 'stock'
        ? { ...current, stock: [...current.stock, item] }
        : { ...current, menu: [...current.menu, item] },
    );
    setIsCreating(false);
    resetForm();
  };

  const openCreateForm = () => {
    resetForm();
    setIsCreating(true);
  };

  const beginRenameStock = (item: CreatedItem) => {
    setEditingStockId(item.id);
    setItemName(item.name);
    setItemAmount(String(item.amount));
    setItemUnit(item.unit ?? 'pcs');
    setFormError('');
    setIsCreating(true);
  };

  const adjustStock = (stockId: string, change: 1 | -1) => {
    setCreatedItems((current) => ({
      ...current,
      stock: current.stock.map((item) =>
        item.id === stockId
          ? { ...item, amount: Math.max(0, Number((item.amount + change).toFixed(2))) }
          : item,
      ),
    }));
  };

  const confirmDeleteStock = () => {
    if (!pendingDeleteStock) return;
    const stockId = pendingDeleteStock.id;
    setCreatedItems((current) => ({
      ...current,
      stock: current.stock.filter((item) => item.id !== stockId),
    }));
    setPendingDeleteStock(null);
  };

  const floatingAction =
    canCreateItems && !isCreating ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          selectedSection?.id === 'stock' ? 'Tambah stok' : 'Tambah menu'
        }
        onPress={openCreateForm}
        style={({ pressed }) => [
          styles.floatingButton,
          { backgroundColor: colors.primary },
          pressed && styles.pressed,
        ]}
        testID={`settings-create-${selectedSection?.id}`}
      >
        <Ionicons name="add" size={30} color={colors.primaryForeground} />
      </Pressable>
    ) : undefined;

  return (
    <>
    <SectionPage
      title={pageTitle}
      subtitle={pageSubtitle}
      floatingAction={floatingAction}
      keyboardAware={isCreating}
    >
      {selectedSection ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isCreating ? `Kembali ke ${selectedSection.title}` : 'Kembali ke menu pengaturan'
            }
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.pressed,
            ]}
            testID="settings-subpage-back"
          >
            <Ionicons name="arrow-back" size={18} color={colors.primary} />
            <Text style={[styles.backLabel, { color: colors.primary }]}>
              {isCreating ? selectedSection.title : 'Pengaturan'}
            </Text>
          </Pressable>

          {isCreating ? (
            <View
              style={[
                styles.formCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.fieldGroup}>
                <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
                  {editingStockId
                    ? 'Nama stok'
                    : selectedSection.id === 'stock'
                      ? 'Nama barang'
                      : 'Nama menu'}
                </Text>
                <TextInput
                  accessibilityLabel={
                    editingStockId
                      ? 'Nama stok'
                      : selectedSection.id === 'stock'
                        ? 'Nama barang'
                        : 'Nama menu'
                  }
                  autoCapitalize="sentences"
                  maxLength={60}
                  onChangeText={(value) => {
                    setItemName(value);
                    setFormError('');
                  }}
                  placeholder={
                    editingStockId
                      ? 'Masukkan nama stok'
                      : selectedSection.id === 'stock'
                        ? 'Contoh: Beras'
                        : 'Contoh: Nasi goreng'
                  }
                  placeholderTextColor={colors.mutedForeground}
                  returnKeyType="next"
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  testID="settings-item-name"
                  value={itemName}
                />
              </View>

              {!editingStockId ? (
                <>
                  <View style={styles.fieldGroup}>
                    <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
                      {selectedSection.id === 'stock' ? 'Jumlah stok' : 'Harga (Rp)'}
                    </Text>
                    <TextInput
                      accessibilityLabel={
                        selectedSection.id === 'stock'
                          ? 'Jumlah stok'
                          : 'Harga dalam rupiah'
                      }
                      keyboardType="decimal-pad"
                      maxLength={12}
                      onChangeText={(value) => {
                        setItemAmount(value);
                        setFormError('');
                      }}
                      placeholder={
                        selectedSection.id === 'stock'
                          ? 'Contoh: 20'
                          : 'Contoh: 25000'
                      }
                      placeholderTextColor={colors.mutedForeground}
                      returnKeyType={selectedSection.id === 'stock' ? 'next' : 'done'}
                      style={[
                        styles.input,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                          color: colors.foreground,
                        },
                      ]}
                      testID="settings-item-amount"
                      value={itemAmount}
                    />
                  </View>

                  {selectedSection.id === 'stock' ? (
                    <View style={styles.fieldGroup}>
                      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
                        Satuan
                      </Text>
                      <TextInput
                        accessibilityLabel="Satuan stok"
                        autoCapitalize="none"
                        maxLength={16}
                        onChangeText={setItemUnit}
                        placeholder="pcs"
                        placeholderTextColor={colors.mutedForeground}
                        style={[
                          styles.input,
                          {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.foreground,
                          },
                        ]}
                        testID="settings-item-unit"
                        value={itemUnit}
                      />
                    </View>
                  ) : null}
                </>
              ) : null}

              {formError ? (
                <Text style={[styles.formError, { color: colors.destructive }]}>
                  {formError}
                </Text>
              ) : null}

              <View style={styles.formActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleBack}
                  style={({ pressed }) => [
                    styles.formButton,
                    styles.cancelButton,
                    { backgroundColor: colors.secondary },
                    pressed && styles.pressed,
                  ]}
                  testID="settings-cancel-create"
                >
                  <Text style={[styles.cancelButtonText, { color: colors.foreground }]}>
                    Batal
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleCreate}
                  style={({ pressed }) => [
                    styles.formButton,
                    { backgroundColor: colors.primary },
                    pressed && styles.pressed,
                  ]}
                  testID={`settings-save-${selectedSection.id}`}
                >
                  <Text style={[styles.saveButtonText, { color: colors.primaryForeground }]}>
                    {editingStockId ? 'Simpan nama' : 'Simpan'}
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : canCreateItems && activeItems.length > 0 ? (
            <>
              <Text style={[styles.itemCount, { color: colors.mutedForeground }]}>
                {activeItems.length} {selectedSection.id === 'stock' ? 'stok' : 'menu'}
              </Text>
              <View
                style={[
                  styles.itemsCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                {activeItems.map((item, index) => {
                  const isStockItem = selectedSection.id === 'stock';
                  return (
                  <View
                    key={item.id}
                    style={isStockItem ? styles.stockListItem : undefined}
                  >
                    <View style={styles.createdItemRow}>
                      <View style={[styles.menuIcon, { backgroundColor: colors.secondary }]}>
                        <Ionicons
                          name={isStockItem ? 'cube-outline' : 'restaurant-outline'}
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                      <View style={styles.menuCopy}>
                        <Text style={[styles.menuTitle, { color: colors.foreground }]}>
                          {item.name}
                        </Text>
                        <Text style={[styles.menuDescription, { color: colors.mutedForeground }]}>
                          {isStockItem
                            ? `${item.amount.toLocaleString('id-ID')} ${item.unit ?? 'unit'}`
                            : `Rp ${item.amount.toLocaleString('id-ID')}`}
                        </Text>
                      </View>
                    </View>
                    {isStockItem ? (
                      <View style={styles.stockActionsRow}>
                        <View style={styles.quantityControls}>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Kurangi stok ${item.name}`}
                            disabled={item.amount <= 0}
                            onPress={() => adjustStock(item.id, -1)}
                            style={({ pressed }) => [
                              styles.quantityButton,
                              { backgroundColor: colors.secondary },
                              item.amount <= 0 && styles.disabledButton,
                              pressed && item.amount > 0 && styles.pressed,
                            ]}
                            testID={`stock-decrease-${item.id}`}
                          >
                            <Ionicons
                              name="remove"
                              size={20}
                              color={
                                item.amount <= 0
                                  ? colors.mutedForeground
                                  : colors.primary
                              }
                            />
                          </Pressable>
                          <Text
                            accessibilityLabel={`Jumlah ${item.amount.toLocaleString('id-ID')} ${item.unit ?? 'unit'}`}
                            style={[styles.quantityValue, { color: colors.foreground }]}
                          >
                            {item.amount.toLocaleString('id-ID')}
                          </Text>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Tambah stok ${item.name}`}
                            onPress={() => adjustStock(item.id, 1)}
                            style={({ pressed }) => [
                              styles.quantityButton,
                              { backgroundColor: colors.secondary },
                              pressed && styles.pressed,
                            ]}
                            testID={`stock-increase-${item.id}`}
                          >
                            <Ionicons name="add" size={20} color={colors.primary} />
                          </Pressable>
                        </View>
                        <View style={styles.stockManagementActions}>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Ganti nama stok ${item.name}`}
                            onPress={() => beginRenameStock(item)}
                            style={({ pressed }) => [
                              styles.stockManagementButton,
                              { backgroundColor: colors.secondary },
                              pressed && styles.pressed,
                            ]}
                            testID={`stock-rename-${item.id}`}
                          >
                            <Ionicons
                              name="create-outline"
                              size={18}
                              color={colors.primary}
                            />
                          </Pressable>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Hapus stok ${item.name}`}
                            onPress={() => setPendingDeleteStock(item)}
                            style={({ pressed }) => [
                              styles.stockManagementButton,
                              { backgroundColor: colors.secondary },
                              pressed && styles.pressed,
                            ]}
                            testID={`stock-delete-${item.id}`}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={18}
                              color={colors.destructive}
                            />
                          </Pressable>
                        </View>
                      </View>
                    ) : null}
                    {index < activeItems.length - 1 ? (
                      <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    ) : null}
                  </View>
                  );
                })}
              </View>
            </>
          ) : (
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
          )}
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
    <Modal
      animationType="fade"
      onRequestClose={() => setPendingDeleteStock(null)}
      transparent
      visible={pendingDeleteStock !== null}
    >
      <View style={styles.confirmOverlay}>
        <View
          accessibilityViewIsModal
          style={[
            styles.confirmCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.confirmTitle, { color: colors.foreground }]}>
            Hapus stok?
          </Text>
          <Text style={[styles.confirmDescription, { color: colors.mutedForeground }]}>
            Stok “{pendingDeleteStock?.name ?? ''}” akan dihapus. Tindakan ini tidak
            bisa dibatalkan.
          </Text>
          <View style={styles.confirmActions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setPendingDeleteStock(null)}
              style={({ pressed }) => [
                styles.formButton,
                { backgroundColor: colors.secondary },
                pressed && styles.pressed,
              ]}
              testID="stock-delete-cancel"
            >
              <Text style={[styles.cancelButtonText, { color: colors.foreground }]}>
                Batal
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={confirmDeleteStock}
              style={({ pressed }) => [
                styles.formButton,
                { backgroundColor: colors.destructive },
                pressed && styles.pressed,
              ]}
              testID="stock-delete-confirm"
            >
              <Text
                style={[
                  styles.saveButtonText,
                  { color: colors.primaryForeground },
                ]}
              >
                Hapus stok
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
    </>
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
  floatingButton: {
    alignItems: 'center',
    borderRadius: 29,
    elevation: 4,
    height: 58,
    justifyContent: 'center',
    width: 58,
  },
  formCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  fieldGroup: {
    marginBottom: 15,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    minHeight: 50,
    paddingHorizontal: 14,
  },
  formError: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: -2,
  },
  formActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  formButton: {
    alignItems: 'center',
    borderRadius: 14,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {},
  cancelButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  saveButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  itemCount: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    marginBottom: 12,
  },
  itemsCard: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  stockListItem: {
    paddingTop: 10,
  },
  createdItemRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 68,
  },
  stockActionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 14,
    paddingTop: 4,
  },
  quantityControls: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  quantityButton: {
    alignItems: 'center',
    borderRadius: 12,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  quantityValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    minWidth: 54,
    textAlign: 'center',
  },
  stockManagementActions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  stockManagementButton: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(20, 35, 27, 0.46)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  confirmCard: {
    borderRadius: 24,
    borderWidth: 1,
    maxWidth: 360,
    padding: 22,
    width: '100%',
  },
  confirmTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
  },
  confirmDescription: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
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
