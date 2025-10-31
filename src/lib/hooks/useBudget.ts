import { useBudgetStore } from "@/lib/stores/budgetStore";
import { useTransactionStore } from "@/lib/stores/transactionStore";
import { useEffect } from "react";
import {
  calculateBudgetStats,
  calculatePeriodAnalytics,
} from "@/lib/utils/calculations";
import { BudgetStats, PeriodAnalytics } from "@/types/models";

export const useBudget = () => {
  const budgetStore = useBudgetStore();
  const transactionStore = useTransactionStore();

  useEffect(() => {
    if (budgetStore.currentBudget) {
      transactionStore.loadTransactions(budgetStore.currentBudget.id);
    }
  }, [budgetStore.currentBudget?.id]);

  const budgetStats: BudgetStats | null = budgetStore.currentBudget
    ? calculateBudgetStats(
        budgetStore.currentBudget,
        transactionStore.transactions,
      )
    : null;

  const periodAnalytics: PeriodAnalytics | null = budgetStore.currentBudget
    ? calculatePeriodAnalytics(
        budgetStore.currentBudget,
        transactionStore.transactions,
      )
    : null;

  return {
    // Data
    budget: budgetStore.currentBudget,
    transactions: transactionStore.transactions,
    budgetStats,
    periodAnalytics,

    // Loading states
    isLoading: budgetStore.isLoading || transactionStore.isLoading,
    error: budgetStore.error || transactionStore.error,

    // Actions
    actions: {
      // Budget actions
      createBudget: budgetStore.createBudget,
      updateBudget: budgetStore.updateBudget,
      deleteBudget: budgetStore.deleteBudget,
      reloadBudget: budgetStore.loadCurrentBudget,

      // Transaction actions
      addTransaction: transactionStore.addTransaction,
      updateTransaction: transactionStore.updateTransaction,
      deleteTransaction: transactionStore.deleteTransaction,
      loadFilteredTransactions: transactionStore.loadFilteredTransactions,

      // Error handling
      clearError: () => {
        budgetStore.clearError();
        transactionStore.clearError();
      },
    },
  };
};
