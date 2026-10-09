import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export type MenuCategory = 'Makanan' | 'Minuman' | 'Lainnya';
export type DrinkSubcategory = 'Es' | 'Panas';

export interface StockOption {
  id: string;
  name: string;
  amount: number;
  unit?: string;
}

export interface RecipeIngredient {
  stockId: string;
  quantity: number;
}

interface MenuCompositionFieldsProps {
  name: string;
  category: MenuCategory;
  onCategoryChange: (category: MenuCategory) => void;
  drinkSubcategory: DrinkSubcategory | null;
  onDrinkSubcategoryChange: (subcategory: DrinkSubcategory) => void;
  stocks: StockOption[];
  selectedStockIds: string[];
  onToggleStock: (stockId: string) => void;
  stockUsages: Record<string, string>;
  onStockUsageChange: (stockId: string, value: string) => void;
  manualStock: string;
  onManualStockChange: (value: string) => void;
  estimatedStock: number | null;
}

const menuCategories: MenuCategory[] = ['Makanan', 'Minuman', 'Lainnya'];
const drinkSubcategories: DrinkSubcategory[] = ['Es', 'Panas'];

export function formatMenuDisplayName(
  name: string,
  category: MenuCategory,
  drinkSubcategory: DrinkSubcategory | null,
) {
  const formattedName = name
    .trim()
    .replace(/\b[a-z]/gi, (letter) => letter.toUpperCase());

  if (!formattedName || category !== 'Minuman' || !drinkSubcategory) {
    return formattedName;
  }

  return drinkSubcategory === 'Es'
    ? `Es ${formattedName}`
    : `${formattedName} Panas`;
}

export function MenuCompositionFields({
  name,
  category,
  onCategoryChange,
  drinkSubcategory,
  onDrinkSubcategoryChange,
  stocks,
  selectedStockIds,
  onToggleStock,
  stockUsages,
  onStockUsageChange,
  manualStock,
  onManualStockChange,
  estimatedStock,
}: MenuCompositionFieldsProps) {
  const colors = useColors();
  const displayName = formatMenuDisplayName(name, category, drinkSubcategory);

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
        Kategori menu
      </Text>
      <View style={styles.choiceRow}>
        {menuCategories.map((option) => {
          const selected = category === option;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onCategoryChange(option)}
              style={[
                styles.choiceChip,
                {
                  backgroundColor: selected ? colors.primary : colors.secondary,
                },
              ]}
              testID={`menu-category-${option.toLowerCase()}`}
            >
              <Text
                style={[
                  styles.choiceLabel,
                  { color: selected ? colors.primaryForeground : colors.foreground },
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {category === 'Minuman' ? (
        <>
          <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
            Subkategori minuman
          </Text>
          <View style={styles.choiceRow}>
            {drinkSubcategories.map((option) => {
              const selected = drinkSubcategory === option;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => onDrinkSubcategoryChange(option)}
                  style={[
                    styles.choiceChip,
                    {
                      backgroundColor: selected ? colors.primary : colors.secondary,
                    },
                  ]}
                  testID={`menu-subcategory-${option.toLowerCase()}`}
                >
                  <Text
                    style={[
                      styles.choiceLabel,
                      {
                        color: selected
                          ? colors.primaryForeground
                          : colors.foreground,
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      <View
        style={[
          styles.namePreview,
          { backgroundColor: colors.secondary, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.previewLabel, { color: colors.mutedForeground }]}>
          Nama menu
        </Text>
        <Text style={[styles.previewName, { color: colors.foreground }]}>
          {displayName || 'Nama menu akan tampil di sini'}
        </Text>
      </View>

      <View style={styles.stockSection}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Stok penyusunan
        </Text>
        <Text style={[styles.helperText, { color: colors.mutedForeground }]}>
          Pilih satu atau beberapa bahan untuk menghitung jumlah menu dari stok
          yang tersedia.
        </Text>

        {stocks.length > 0 ? (
          <View style={styles.stockOptions}>
            {stocks.map((stock) => {
              const selected = selectedStockIds.includes(stock.id);
              return (
                <View
                  key={stock.id}
                  style={[
                    styles.stockOptionRow,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={
                      selected ? `Batalkan pilihan ${stock.name}` : `Pilih stok ${stock.name}`
                    }
                    accessibilityState={{ selected }}
                    onPress={() => onToggleStock(stock.id)}
                    style={styles.stockOptionButton}
                    testID={`menu-stock-choice-${stock.id}`}
                  >
                    <Ionicons
                      name={selected ? 'checkbox' : 'square-outline'}
                      size={21}
                      color={selected ? colors.primary : colors.mutedForeground}
                    />
                    <View style={styles.stockOptionCopy}>
                      <Text
                        numberOfLines={1}
                        style={[styles.stockName, { color: colors.foreground }]}
                      >
                        {stock.name}
                      </Text>
                      <Text style={[styles.stockAvailable, { color: colors.mutedForeground }]}>
                        Tersedia {stock.amount.toLocaleString('id-ID')} {stock.unit ?? 'unit'}
                      </Text>
                    </View>
                  </Pressable>
                  {selected ? (
                    <View style={styles.usageInputGroup}>
                      <TextInput
                        accessibilityLabel={`Takaran ${stock.name} per menu`}
                        keyboardType="decimal-pad"
                        maxLength={10}
                        onChangeText={(value) => onStockUsageChange(stock.id, value)}
                        placeholder="0"
                        placeholderTextColor={colors.mutedForeground}
                        style={[
                          styles.usageInput,
                          {
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            color: colors.foreground,
                          },
                        ]}
                        testID={`menu-stock-usage-${stock.id}`}
                        value={stockUsages[stock.id] ?? ''}
                      />
                      <Text style={[styles.usageUnit, { color: colors.mutedForeground }]}>
                        {stock.unit ?? 'unit'}
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={[styles.noStockText, { color: colors.mutedForeground }]}>
            Belum ada stok. Jumlah menu tetap bisa dimasukkan secara manual.
          </Text>
        )}

        {selectedStockIds.length > 0 ? (
          <Text style={[styles.stockEstimate, { color: colors.primary }]}>
            {estimatedStock === null
              ? 'Isi takaran setiap bahan untuk menghitung stok menu.'
              : `Perkiraan stok menu: ${estimatedStock.toLocaleString('id-ID')} menu`}
          </Text>
        ) : (
          <View style={styles.manualStockGroup}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              Jumlah stok menu
            </Text>
            <TextInput
              accessibilityLabel="Jumlah stok menu manual"
              keyboardType="number-pad"
              maxLength={8}
              onChangeText={onManualStockChange}
              placeholder="Contoh: 20"
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.manualStockInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              testID="menu-manual-stock"
              value={manualStock}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  choiceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 9,
  },
  choiceChip: {
    alignItems: 'center',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 14,
  },
  choiceLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  fieldLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    marginBottom: 7,
    marginTop: 15,
  },
  namePreview: {
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 13,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  previewLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  previewName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginTop: 3,
  },
  stockSection: {
    marginTop: 19,
  },
  helperText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  stockOptions: {
    marginTop: 6,
  },
  stockOptionRow: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 8,
    minHeight: 58,
    paddingHorizontal: 9,
  },
  stockOptionButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    minHeight: 56,
    paddingVertical: 7,
  },
  stockOptionCopy: {
    flex: 1,
    marginLeft: 8,
    paddingRight: 6,
  },
  stockName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  stockAvailable: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    marginTop: 3,
  },
  usageInputGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  usageInput: {
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    height: 38,
    paddingHorizontal: 5,
    textAlign: 'center',
    width: 62,
  },
  usageUnit: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    maxWidth: 34,
  },
  stockEstimate: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 11,
  },
  noStockText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
  },
  manualStockGroup: {
    marginTop: 2,
  },
  manualStockInput: {
    borderRadius: 14,
    borderWidth: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    minHeight: 50,
    paddingHorizontal: 14,
  },
});
