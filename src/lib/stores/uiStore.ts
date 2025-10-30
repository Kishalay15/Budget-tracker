import { create } from "zustand";
import {
  AddTransactionState,
  EditTransactionState,
  AppSettings,
  Transaction,
} from "@/types/models";
import { DEFAULT_CURRENCY } from "@/lib/constants/currencies";

interface UIState {
  // Modal states
  addTransactionState: AddTransactionState;
  editTransactionState: EditTransactionState;
  isBudgetSetupOpen: boolean;

  // App settings
  settings: AppSettings;

  // Actions
  openAddTransaction: (initialAmount?: number, initialComment?: string) => void;
  closeAddTransaction: () => void;
  openEditTransaction: (transaction: Transaction) => void;
  closeEditTransaction: () => void;
  openBudgetSetup: () => void;
  closeBudgetSetup: () => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

export const useUIStore = create<UIState>((set) => ({
  /**
   * Modal states
   */
  addTransactionState: {
    isOpen: false,
  },
  editTransactionState: {
    isOpen: false,
    transaction: null,
  },
  isBudgetSetupOpen: false,

  /**
   * App settings
   */
  settings: {
    defaultCurrency: DEFAULT_CURRENCY,
    locale: "en-US",
    theme: "light",
    firstLaunch: true,
  },

  /**
   * Open add transaction modal
   */
  openAddTransaction: (initialAmount?: number, initialComment?: string) => {
    set({
      addTransactionState: {
        isOpen: true,
        initialAmount,
        initialComment,
      },
    });
  },

  /**
   * Close add transaction modal
   */
  closeAddTransaction: () => {
    set({
      addTransactionState: {
        isOpen: false,
      },
    });
  },

  /**
   * Open edit transaction modal
   */
  openEditTransaction: (transaction: Transaction) => {
    set({
      editTransactionState: {
        isOpen: true,
        transaction,
      },
    });
  },

  /**
   * Close edit transaction modal
   */
  closeEditTransaction: () => {
    set({
      editTransactionState: {
        isOpen: false,
        transaction: null,
      },
    });
  },

  /**
   * Open budget setup modal
   */
  openBudgetSetup: () => {
    set({ isBudgetSetupOpen: true });
  },

  /**
   * Close budget setup modal
   */
  closeBudgetSetup: () => {
    set({ isBudgetSetupOpen: false });
  },

  /**
   * Update app settings
   */
  updateSettings: (newSettings: Partial<AppSettings>) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },
}));
