import { create } from "zustand";
import {
  Transaction,
  CreateTransactionInput,
  TransactionFilters,
  TransactionSort,
} from "@/types/models";
import { transactionDao } from "../db/dao/transactionDao";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadTransactions: (budgetId: string) => Promise<void>;
  loadFilteredTransactions: (
    budgetId: string,
    filters?: TransactionFilters,
    sort?: TransactionSort,
  ) => Promise<void>;
  addTransaction: (data: CreateTransactionInput) => Promise<Transaction>;
  updateTransaction: (id: string, data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  /**
   * Load transactions for a given budget ID.
   * @param budgetId - The ID of the budget to load transactions for.
   */
  loadTransactions: async (budgetId: string) => {
    set({ isLoading: true, error: null });

    try {
      const transactions = await transactionDao.getByBudgetId(budgetId);
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load transactions", isLoading: false });
      console.error("Error loading transactions:", error);
    }
  },

  /**
   * Load filtered transactions for a given budget ID.
   * @param budgetId - The ID of the budget to load transactions for.
   * @param filters - The filters to apply to the transactions.
   * @param sort - The sorting options for the transactions.
   */
  loadFilteredTransactions: async (
    budgetId: string,
    filters: TransactionFilters = {},
    sort: TransactionSort = { field: "timestamp", direction: "desc" },
  ) => {
    set({ isLoading: true, error: null });

    try {
      const transactions = await transactionDao.getFiltered(
        budgetId,
        filters,
        sort,
      );
      set({ transactions, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load transactions", isLoading: false });
      console.error("Error loading transactions:", error);
    }
  },

  /**
   * Add a new transaction to the budget.
   * @param data - The data for the new transaction.
   * @returns The newly created transaction.
   */
  addTransaction: async (data) => {
    set({ isLoading: true, error: null });

    try {
      const transaction = await transactionDao.create(data);
      const { transactions } = get();

      set({
        transactions: [transaction, ...transactions],
        isLoading: false,
      });

      return transaction;
    } catch (error) {
      set({ error: "Failed to add transaction", isLoading: false });
      console.error("Error adding transaction:", error);

      throw error;
    }
  },

  /**
   * Update an existing transaction in the budget.
   * @param id - The ID of the transaction to update.
   * @param data - The updated data for the transaction.
   * @returns The updated transaction.
   */
  updateTransaction: async (id: string, data: Partial<Transaction>) => {
    set({ isLoading: true, error: null });

    try {
      await transactionDao.update(id, data);

      const { transactions } = get();
      const updatedTransactions = transactions.map((t) =>
        t.id === id ? { ...t, ...data, updatedAt: new Date() } : t,
      );

      set({ transactions: updatedTransactions, isLoading: false });
    } catch (error) {
      set({ error: "Failed to update transaction", isLoading: false });
      console.error("Error updating transaction:", error);

      throw error;
    }
  },

  /**
   * Delete an existing transaction from the budget.
   * @param id - The ID of the transaction to delete.
   * @returns The deleted transaction.
   */
  deleteTransaction: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await transactionDao.delete(id);
      const { transactions } = get();

      set({
        transactions: transactions.filter((t) => t.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Failed to delete transaction", isLoading: false });
      console.error("Error deleting transaction:", error);

      throw error;
    }
  },

  /**
   * Clear the error state.
   */
  clearError: () => set({ error: null }),
}));
