import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductStore } from '../types';
import { sampleProducts } from '../data/sampleData';

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: sampleProducts,
      selectedProduct: null,

      addProduct: (product) => {
        set((state) => ({
          products: [...state.products, product],
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          selectedProduct:
            state.selectedProduct?.id === id
              ? { ...state.selectedProduct, ...updates }
              : state.selectedProduct,
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
          selectedProduct:
            state.selectedProduct?.id === id ? null : state.selectedProduct,
        }));
      },

      selectProduct: (id) => {
        const product = id ? get().products.find((p) => p.id === id) : null;
        set({ selectedProduct: product || null });
      },

      searchProducts: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return get().products.filter(
          (p) =>
            p.name.toLowerCase().includes(lowercaseQuery) ||
            p.brand.toLowerCase().includes(lowercaseQuery) ||
            p.model.toLowerCase().includes(lowercaseQuery) ||
            p.sku.toLowerCase().includes(lowercaseQuery)
        );
      },

      filterByCategory: (category) => {
        return get().products.filter((p) => p.category === category);
      },
    }),
    {
      name: 'product-storage',
    }
  )
);
