import { db } from "../schema";
import {
  Transaction,
  CreateTransactionInput,
  TransactionFilters,
  TransactionSort,
} from "@/types/models";
import { generateId } from "@/lib/utils/index";

export const transactionDao = {
  /**
   * Create a new transaction.
   * @param transactionData - The data for the new transaction.
   * @returns The created transaction.
   */
  async create(transactionData: CreateTransactionInput): Promise<Transaction> {
    const now = new Date();
    const transaction: Transaction = {
      id: generateId(),
      timestamp: transactionData.timestamp || now,
      ...transactionData,
      createdAt: now,
      updatedAt: now,
    };

    await db.transactions.add(transaction);
    return transaction;
  },

  /**
   * Get transactions by budget ID.
   * @param budgetId - The ID of the budget.
   * @returns An array of transactions.
   */
  async getByBudgetId(budgetId: string): Promise<Transaction[]> {
    return await db.transactions
      .where("budgetId")
      .equals(budgetId)
      .reverse()
      .sortBy("timestamp");
  },

  /**
   * Get a transaction by ID.
   * @param id - The ID of the transaction.
   * @returns The transaction or null if not found.
   */
  async getById(id: string): Promise<Transaction | null> {
    return (await db.transactions.get(id)) || null;
  },

  /**
   * Update a transaction.
   * @param id - The ID of the transaction.
   * @param updates - The updates to apply.
   */
  async update(
    id: string,
    updates: Partial<Omit<Transaction, "id" | "createdAt">>,
  ): Promise<void> {
    await db.transactions.update(id, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  /**
   * Delete a transaction.
   * @param id - The ID of the transaction.
   */
  async delete(id: string): Promise<void> {
    await db.transactions.delete(id);
  },

  /**
   * Get recent transactions by budget ID.
   * @param budgetId - The ID of the budget.
   * @param limit - The maximum number of transactions to retrieve.
   * @returns An array of transactions.
   */
  async getRecentByBudgetId(
    budgetId: string,
    limit: number = 10,
  ): Promise<Transaction[]> {
    return await db.transactions
      .where("budgetId")
      .equals(budgetId)
      .reverse()
      .sortBy("timestamp")
      .then((transactions) => transactions.slice(0, limit));
  },

  /**
   * Get filtered transactions by budget ID.
   * @param budgetId - The ID of the budget.
   * @param filters - The filters to apply.
   * @param sort - The sorting options.
   * @returns An array of transactions.
   */
  async getFiltered(
    budgetId: string,
    filters: TransactionFilters = {},
    sort: TransactionSort = { field: "timestamp", direction: "desc" },
  ): Promise<Transaction[]> {
    let collection = db.transactions.where("budgetId").equals(budgetId);

    // Apply filters
    if (filters.startDate) {
      collection = collection.filter(
        (transaction) => transaction.timestamp >= filters.startDate!,
      );
    }

    if (filters.endDate) {
      collection = collection.filter(
        (transaction) => transaction.timestamp <= filters.endDate!,
      );
    }

    if (filters.minAmount !== undefined) {
      collection = collection.filter(
        (transaction) => transaction.amount >= filters.minAmount!,
      );
    }

    if (filters.maxAmount !== undefined) {
      collection = collection.filter(
        (transaction) => transaction.amount <= filters.maxAmount!,
      );
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      collection = collection.filter(
        (transaction) =>
          transaction.comment?.toLowerCase().includes(query) ?? false,
      );
    }

    // Apply sorting
    return await collection.sortBy(sort.field).then((transactions) => {
      if (sort.direction === "desc") {
        return transactions.reverse();
      }
      return transactions;
    });
  },
};
