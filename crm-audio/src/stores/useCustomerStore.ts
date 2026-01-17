import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomerStore } from '../types';
import { sampleCustomers } from '../data/sampleData';

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set, get) => ({
      customers: sampleCustomers,
      selectedCustomer: null,

      addCustomer: (customer) => {
        set((state) => ({
          customers: [...state.customers, customer],
        }));
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
          selectedCustomer:
            state.selectedCustomer?.id === id
              ? { ...state.selectedCustomer, ...updates }
              : state.selectedCustomer,
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
          selectedCustomer:
            state.selectedCustomer?.id === id ? null : state.selectedCustomer,
        }));
      },

      selectCustomer: (id) => {
        const customer = id ? get().customers.find((c) => c.id === id) : null;
        set({ selectedCustomer: customer || null });
      },

      searchCustomers: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return get().customers.filter(
          (c) =>
            c.firstName.toLowerCase().includes(lowercaseQuery) ||
            c.lastName.toLowerCase().includes(lowercaseQuery) ||
            c.email.toLowerCase().includes(lowercaseQuery) ||
            c.phone.includes(query)
        );
      },
    }),
    {
      name: 'customer-storage',
    }
  )
);
