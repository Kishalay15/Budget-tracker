import { db } from "../schema";
import { Budget, CreateBudgetInput } from "@/types/models";
import { generateId } from "@/lib/utils/index";

export const budgetDao = {
  /**
   * Create a new budget.
   * @param budgetData - The data for the new budget.
   * @returns The created budget.
   */
  async create(budgetData: CreateBudgetInput): Promise<Budget> {
    const now = new Date();
    const budget: Budget = {
      id: generateId(),
      ...budgetData,
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    };

    // Deactivate all existing active budgets
    const activeBudgets = await db.budgets
      .where("isActive")
      .equals(1)
      .toArray();
    for (const activeBudget of activeBudgets) {
      await db.budgets.update(activeBudget.id, { isActive: 0 });
    }

    await db.budgets.add(budget);
    return budget;
  },

  /**
   * Get the active budget.
   * @returns The active budget or null if none exists.
   */
  async getActive(): Promise<Budget | null> {
    return (await db.budgets.where("isActive").equals(1).first()) || null;
  },

  /**
   * Get a budget by its ID.
   * @param id - The ID of the budget.
   * @returns The budget or null if not found.
   */
  async getById(id: string): Promise<Budget | null> {
    return (await db.budgets.get(id)) || null;
  },

  /**
   * Update a budget.
   * @param id - The ID of the budget to update.
   * @param updates - The updates to apply to the budget.
   */
  async update(
    id: string,
    updates: Partial<Omit<Budget, "id" | "createdAt">>,
  ): Promise<void> {
    await db.budgets.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  /**
   * Delete a budget.
   * @param id - The ID of the budget to delete.
   */
  async delete(id: string): Promise<void> {
    await db.budgets.delete(id);
  },

  /**
   * Get all budgets.
   * @returns An array of budgets.
   */
  async getAll(): Promise<Budget[]> {
    return await db.budgets.toArray();
  },

  /**
   * Deactivate all budgets.
   */
  async deactivateAll(): Promise<void> {
    const activeBudgets = await db.budgets
      .where("isActive")
      .equals(1)
      .toArray();
    for (const budget of activeBudgets) {
      await db.budgets.update(budget.id, { isActive: 0 });
    }
  },
};
