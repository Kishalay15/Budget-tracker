import { create } from "zustand";
import { Budget, CreateBudgetInput } from "@/types/models";
import { budgetDao } from "@/lib/db/dao/budgetDao";

interface BudgetState {
  currentBudget: Budget | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadCurrentBudget: () => Promise<void>;
  createBudget: (data: CreateBudgetInput) => Promise<Budget>;
  updateBudget: (id: string, data: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  currentBudget: null,
  isLoading: false,
  error: null,

  /**
   * Loads the current active budget from the database.
   */
  loadCurrentBudget: async () => {
    set({ isLoading: true, error: null });
    try {
      const budget = await budgetDao.getActive();
      set({ currentBudget: budget, isLoading: false });
    } catch (error) {
      set({ error: "Failed to load current budget", isLoading: false });
      console.error("Error loading current budget:", error);
    }
  },

  /**
   * Creates a new budget in the database.
   */
  createBudget: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newBudget = await budgetDao.create(data);
      set({ currentBudget: newBudget, isLoading: false });

      return newBudget;
    } catch (error) {
      set({ error: "Failed to create budget", isLoading: false });
      console.error("Error creating budget:", error);

      throw error;
    }
  },

  /**
   * Updates an existing budget in the database.
   */
  updateBudget: async (id, data: Partial<Budget>) => {
    set({ isLoading: true, error: null });
    try {
      await budgetDao.update(id, data);

      const { currentBudget } = get();
      if (currentBudget && currentBudget.id === id) {
        const updatedBudget = await budgetDao.getById(id);
        set({ currentBudget: updatedBudget });
      }

      set({ isLoading: false });
    } catch (error) {
      set({ error: "Failed to update budget", isLoading: false });
      console.error("Error updating budget:", error);

      throw error;
    }
  },

  /**
   * Deletes an existing budget from the database.
   */
  deleteBudget: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await budgetDao.delete(id);

      const { currentBudget } = get();
      if (currentBudget && currentBudget.id === id) {
        set({ currentBudget: null });
      }

      set({ isLoading: false });
    } catch (error) {
      set({ error: "Failed to delete budget", isLoading: false });
      console.error("Error deleting budget:", error);

      throw error;
    }
  },

  /**
   * Clears any error state in the store.
   */
  clearError: () => set({ error: null }),
}));
