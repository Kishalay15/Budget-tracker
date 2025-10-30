/**
 * Represents the budget entity.
 */
export interface Budget {
  id: string;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the transaction entity.
 */
export interface Transaction {
  id: string;
  budgetId: string;
  amount: number;
  comment?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Analytics
 */
export interface DailyAnalytics {
  date: Date;
  totalSpent: number;
  transactionCount: number;
  averageTransaction: number;
}

/**
 * Budget creation input
 */
export interface CreateBudgetInput {
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  currency: string;
}
/**
 * Transaction creation input
 */
export interface CreateTransactionInput {
  budgetId: string;
  amount: number;
  comment?: string;
  timestamp?: Date;
}

/**
 * Calculated budget statistics
 */
export interface BudgetStats {
  budgetId: string;
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  daysTotal: number;
  daysElapsed: number;
  daysRemaining: number;
  dailyBudget: number;
  averageDaily: number;
  isOverBudget: boolean;
  projectedTotal: number;
  percentageUsed: number;
}

/**
 * Daily spendings
 */
export interface DailySpending {
  date: Date;
  amount: number;
  transactionsCount: number;
  transactions: Transaction[];
}

/**
 * Period analytics
 */
export interface PeriodAnalytics {
  budgetId: string;
  startDate: Date;
  endDate: Date;
  dailyBreakdown: DailySpending[];
  totalSpent: number;
  averageDaily: number;
  highestDay: DailySpending | null;
  lowestDay: DailySpending | null;
  daysWithoutSpending: number;
  daysWithSpending: number;
}

/**
 * UI state types
 */

export interface AddTransactionState {
  isOpen: boolean;
  initialAmount?: number;
  initialComment?: string;
}

export interface EditTransactionState {
  isOpen: boolean;
  transaction: Transaction | null;
}

/**
 * Filter and sort options
 */
export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}

export type TransactionSortField = "timestamp" | "amount" | "comment";
export type SortDirection = "asc" | "desc";

export interface TransactionSort {
  field: TransactionSortField;
  direction: SortDirection;
}

/**
 * Currency config
 */
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
}

/**
 * App Settings
 */
export interface AppSettings {
  defaultCurrency: Currency;
  locale: string;
  theme: "light" | "dark";
  firstLaunch: boolean;
}
