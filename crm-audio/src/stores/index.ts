import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Quote,
  QuoteStore,
  DealStore,
  InstallationStore,
  ActivityStore,
  AppStore,
} from '../types';
import {
  sampleQuotes,
  sampleDeals,
  sampleInstallations,
  sampleActivities,
  sampleTasks,
} from '../data/sampleData';

// Quote Store
export const useQuoteStore = create<QuoteStore>()(
  persist(
    (set, get) => ({
      quotes: sampleQuotes,
      selectedQuote: null,

      addQuote: (quote) => {
        set((state) => ({
          quotes: [...state.quotes, quote],
        }));
      },

      updateQuote: (id, updates) => {
        set((state) => ({
          quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...updates } : q)),
          selectedQuote:
            state.selectedQuote?.id === id
              ? { ...state.selectedQuote, ...updates }
              : state.selectedQuote,
        }));
      },

      deleteQuote: (id) => {
        set((state) => ({
          quotes: state.quotes.filter((q) => q.id !== id),
          selectedQuote: state.selectedQuote?.id === id ? null : state.selectedQuote,
        }));
      },

      selectQuote: (id) => {
        const quote = id ? get().quotes.find((q) => q.id === id) : null;
        set({ selectedQuote: quote || null });
      },

      duplicateQuote: (id) => {
        const quote = get().quotes.find((q) => q.id === id);
        if (quote) {
          const newQuote: Quote = {
            ...quote,
            id: `quote-${Date.now()}`,
            quoteNumber: `Q-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            status: 'Draft',
            dateCreated: new Date().toISOString().split('T')[0],
            dateUpdated: new Date().toISOString().split('T')[0],
          };
          set((state) => ({
            quotes: [...state.quotes, newQuote],
          }));
        }
      },
    }),
    {
      name: 'quote-storage',
    }
  )
);

// Deal Store
export const useDealStore = create<DealStore>()(
  persist(
    (set, get) => ({
      deals: sampleDeals,
      selectedDeal: null,

      addDeal: (deal) => {
        set((state) => ({
          deals: [...state.deals, deal],
        }));
      },

      updateDeal: (id, updates) => {
        set((state) => ({
          deals: state.deals.map((d) => (d.id === id ? { ...d, ...updates } : d)),
          selectedDeal:
            state.selectedDeal?.id === id
              ? { ...state.selectedDeal, ...updates }
              : state.selectedDeal,
        }));
      },

      deleteDeal: (id) => {
        set((state) => ({
          deals: state.deals.filter((d) => d.id !== id),
          selectedDeal: state.selectedDeal?.id === id ? null : state.selectedDeal,
        }));
      },

      selectDeal: (id) => {
        const deal = id ? get().deals.find((d) => d.id === id) : null;
        set({ selectedDeal: deal || null });
      },

      moveDeal: (id, stage) => {
        set((state) => ({
          deals: state.deals.map((d) =>
            d.id === id ? { ...d, stage, lastActivity: new Date().toISOString() } : d
          ),
        }));
      },
    }),
    {
      name: 'deal-storage',
    }
  )
);

// Installation Store
export const useInstallationStore = create<InstallationStore>()(
  persist(
    (set, get) => ({
      installations: sampleInstallations,
      selectedInstallation: null,

      addInstallation: (installation) => {
        set((state) => ({
          installations: [...state.installations, installation],
        }));
      },

      updateInstallation: (id, updates) => {
        set((state) => ({
          installations: state.installations.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
          selectedInstallation:
            state.selectedInstallation?.id === id
              ? { ...state.selectedInstallation, ...updates }
              : state.selectedInstallation,
        }));
      },

      deleteInstallation: (id) => {
        set((state) => ({
          installations: state.installations.filter((i) => i.id !== id),
          selectedInstallation:
            state.selectedInstallation?.id === id ? null : state.selectedInstallation,
        }));
      },

      selectInstallation: (id) => {
        const installation = id
          ? get().installations.find((i) => i.id === id)
          : null;
        set({ selectedInstallation: installation || null });
      },
    }),
    {
      name: 'installation-storage',
    }
  )
);

// Activity Store
export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      activities: sampleActivities,
      tasks: sampleTasks,

      addActivity: (activity) => {
        set((state) => ({
          activities: [...state.activities, activity],
        }));
      },

      addTask: (task) => {
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      getActivitiesByCustomer: (customerId) => {
        return get().activities.filter((a) => a.customerId === customerId);
      },

      getTasksByCustomer: (customerId) => {
        return get().tasks.filter((t) => t.customerId === customerId);
      },
    }),
    {
      name: 'activity-storage',
    }
  )
);

// App Store
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarCollapsed: false,

      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },

      toggleSidebar: () => {
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        }));
      },
    }),
    {
      name: 'app-storage',
    }
  )
);

// Re-export customer and product stores
export { useCustomerStore } from './useCustomerStore';
export { useProductStore } from './useProductStore';
