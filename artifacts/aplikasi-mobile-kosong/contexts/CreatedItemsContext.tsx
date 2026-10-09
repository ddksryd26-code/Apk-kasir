import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type {
  DrinkSubcategory,
  MenuCategory,
  RecipeIngredient,
} from '@/components/MenuCompositionFields';

export interface CreatedItem {
  id: string;
  name: string;
  amount: number;
  unit?: string;
  category?: MenuCategory;
  drinkSubcategory?: DrinkSubcategory;
  recipe?: RecipeIngredient[];
  manualStock?: number;
}

export type ManageableSectionId = 'stock' | 'menu';
export type CreatedItems = Record<ManageableSectionId, CreatedItem[]>;
export type StorageLoadStatus = 'loading' | 'ready' | 'error';
export type StorageSaveStatus = 'saved' | 'saving' | 'error';
export type UpdateCreatedItems = (
  update: (current: CreatedItems) => CreatedItems,
) => void;

interface CreatedItemsContextValue {
  createdItems: CreatedItems;
  storageLoadStatus: StorageLoadStatus;
  storageSaveStatus: StorageSaveStatus;
  updateCreatedItems: UpdateCreatedItems;
  retryLoadCreatedItems: () => void;
  retrySaveCreatedItems: () => void;
}

const CREATED_ITEMS_STORAGE_KEY = 'ruang-usaha:created-items:v1';

const emptyCreatedItems = (): CreatedItems => ({ stock: [], menu: [] });

const CreatedItemsContext = createContext<CreatedItemsContextValue | null>(null);

const isMenuCategory = (value: unknown): value is MenuCategory =>
  value === 'Makanan' || value === 'Minuman' || value === 'Lainnya';

const isDrinkSubcategory = (value: unknown): value is DrinkSubcategory =>
  value === 'Es' || value === 'Panas';

const isCreatedItem = (value: unknown): value is CreatedItem => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const item = value as Record<string, unknown>;
  const validRecipe =
    item.recipe === undefined ||
    (Array.isArray(item.recipe) &&
      item.recipe.every((ingredient) => {
        if (
          typeof ingredient !== 'object' ||
          ingredient === null ||
          Array.isArray(ingredient)
        ) {
          return false;
        }
        const entry = ingredient as Record<string, unknown>;
        return (
          typeof entry.stockId === 'string' &&
          typeof entry.quantity === 'number' &&
          Number.isFinite(entry.quantity) &&
          entry.quantity > 0
        );
      }));
  const validManualStock =
    item.manualStock === undefined ||
    (typeof item.manualStock === 'number' &&
      Number.isInteger(item.manualStock) &&
      item.manualStock >= 0);

  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.amount === 'number' &&
    Number.isFinite(item.amount) &&
    item.amount >= 0 &&
    (item.unit === undefined || typeof item.unit === 'string') &&
    (item.category === undefined || isMenuCategory(item.category)) &&
    (item.drinkSubcategory === undefined ||
      isDrinkSubcategory(item.drinkSubcategory)) &&
    validRecipe &&
    validManualStock
  );
};

const parseCreatedItems = (serialized: string): CreatedItems => {
  const parsed: unknown = JSON.parse(serialized);
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    Array.isArray(parsed)
  ) {
    throw new Error('Format data stok dan menu tidak valid.');
  }

  const record = parsed as Record<string, unknown>;
  if (
    !Array.isArray(record.stock) ||
    !Array.isArray(record.menu) ||
    !record.stock.every(isCreatedItem) ||
    !record.menu.every(isCreatedItem)
  ) {
    throw new Error('Format data stok dan menu tidak valid.');
  }

  return {
    stock: record.stock,
    menu: record.menu,
  };
};

export function getMenuAvailableStock(
  menuItem: CreatedItem,
  stockItems: CreatedItem[],
) {
  if (!menuItem.recipe?.length) return menuItem.manualStock ?? 0;

  const productionLimits = menuItem.recipe.map((ingredient) => {
    const stockItem = stockItems.find(
      (stock) => stock.id === ingredient.stockId,
    );
    return stockItem
      ? Math.floor(stockItem.amount / ingredient.quantity)
      : 0;
  });
  return Math.max(0, Math.min(...productionLimits));
}

export function CreatedItemsProvider({ children }: { children: ReactNode }) {
  const [createdItems, setCreatedItems] =
    useState<CreatedItems>(emptyCreatedItems);
  const [storageLoadStatus, setStorageLoadStatus] =
    useState<StorageLoadStatus>('loading');
  const [storageSaveStatus, setStorageSaveStatus] =
    useState<StorageSaveStatus>('saved');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const createdItemsRef = useRef<CreatedItems>(emptyCreatedItems());
  const persistenceQueueRef = useRef<Promise<void>>(Promise.resolve());
  const saveSequenceRef = useRef(0);

  useEffect(() => {
    let isCurrent = true;

    const loadCreatedItems = async () => {
      setStorageLoadStatus('loading');
      try {
        const serialized = await AsyncStorage.getItem(
          CREATED_ITEMS_STORAGE_KEY,
        );
        const storedItems = serialized
          ? parseCreatedItems(serialized)
          : emptyCreatedItems();
        if (!isCurrent) return;

        createdItemsRef.current = storedItems;
        setCreatedItems(storedItems);
        setStorageSaveStatus('saved');
        setStorageLoadStatus('ready');
      } catch {
        if (!isCurrent) return;
        setStorageLoadStatus('error');
      }
    };

    void loadCreatedItems();
    return () => {
      isCurrent = false;
    };
  }, [loadAttempt]);

  const persistCreatedItems = useCallback((items: CreatedItems) => {
    const sequence = ++saveSequenceRef.current;
    const serialized = JSON.stringify(items);
    setStorageSaveStatus('saving');

    const nextSave = persistenceQueueRef.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(CREATED_ITEMS_STORAGE_KEY, serialized))
      .then(() => {
        if (sequence === saveSequenceRef.current) {
          setStorageSaveStatus('saved');
        }
      })
      .catch(() => {
        if (sequence === saveSequenceRef.current) {
          setStorageSaveStatus('error');
        }
      });

    persistenceQueueRef.current = nextSave;
    return nextSave;
  }, []);

  const updateCreatedItems = useCallback<UpdateCreatedItems>(
    (update) => {
      if (storageLoadStatus !== 'ready') return;

      const nextItems = update(createdItemsRef.current);
      createdItemsRef.current = nextItems;
      setCreatedItems(nextItems);
      void persistCreatedItems(nextItems);
    },
    [persistCreatedItems, storageLoadStatus],
  );

  const retryLoadCreatedItems = useCallback(() => {
    setStorageLoadStatus('loading');
    setLoadAttempt((current) => current + 1);
  }, []);

  const retrySaveCreatedItems = useCallback(() => {
    void persistCreatedItems(createdItemsRef.current);
  }, [persistCreatedItems]);

  const value = useMemo(
    () => ({
      createdItems,
      storageLoadStatus,
      storageSaveStatus,
      updateCreatedItems,
      retryLoadCreatedItems,
      retrySaveCreatedItems,
    }),
    [
      createdItems,
      storageLoadStatus,
      storageSaveStatus,
      updateCreatedItems,
      retryLoadCreatedItems,
      retrySaveCreatedItems,
    ],
  );

  return (
    <CreatedItemsContext.Provider value={value}>
      {children}
    </CreatedItemsContext.Provider>
  );
}

export function useCreatedItems() {
  const context = useContext(CreatedItemsContext);
  if (!context) {
    throw new Error(
      'useCreatedItems must be used inside CreatedItemsProvider.',
    );
  }
  return context;
}
