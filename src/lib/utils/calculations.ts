import { startOfDay, isWithinInterval } from "date-fns";
import {
  Budget,
  BudgetStats,
  DailySpending,
  Transaction,
} from "@/types/models";
import {
  getDailyBudget,
  getDateRange,
  getDaysElapsed,
  getDaysRemaining,
  getTotalDays,
} from "./date";

/**
 * Calculate the total amount spent across all transactions.
 * @param transactions - Array of transactions.
 * @returns Total amount spent.
 */
export const calculateTotalSpent = (transactions: Transaction[]): number => {
  return transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );
};

/**
 * Calculate the daily spending for a given date.
 * @param transactions - Array of transactions.
 * @param date - Date to calculate daily spending for.
 * @returns Daily spending information.
 */
export const calculateDailySpending = (
  transactions: Transaction[],
  date: Date,
): DailySpending => {
  const dayStart = startOfDay(date);
  const dayEnd = startOfDay(new Date(dayStart.getTime() + 24 * 60 * 60 * 1000));

  const dayTransactions = transactions.filter((transaction) =>
    isWithinInterval(transaction.timestamp, { start: dayStart, end: dayEnd }),
  );

  const amount = dayTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0,
  );

  return {
    date,
    amount,
    transactionsCount: dayTransactions.length,
    transactions: dayTransactions,
  };
};

/**
 * Calculate the budget statistics for a given budget and transactions.
 * @param budget - Budget to calculate statistics for.
 * @param transactions - Array of transactions.
 * @returns Budget statistics.
 */
export const calculateBudgetStats = (
  budget: Budget,
  transactions: Transaction[],
): BudgetStats => {
  const totalSpent = calculateTotalSpent(transactions);
  const remaining = Math.max(0, budget.totalAmount - totalSpent);
  const daysTotal = getTotalDays(budget.startDate, budget.endDate);
  const daysElapsed = getDaysElapsed(budget.startDate, budget.endDate);
  const daysRemaining = getDaysRemaining(budget.startDate, budget.endDate);
  const dailyBudget = getDailyBudget(
    budget.totalAmount,
    totalSpent,
    daysRemaining,
  );
  const averageDaily = daysElapsed > 0 ? totalSpent / daysElapsed : 0;
  const projectedTotal = averageDaily * daysTotal;
  const percentageUsed = (totalSpent / budget.totalAmount) * 100;
  const isOverBudget = totalSpent > budget.totalAmount;

  return {
    budgetId: budget.id,
    totalBudget: budget.totalAmount,
    totalSpent,
    remaining,
    daysTotal,
    daysElapsed,
    daysRemaining,
    dailyBudget,
    averageDaily,
    isOverBudget,
    projectedTotal,
    percentageUsed,
  };
};

/**
 * Calculate the period analytics for a given budget and transactions.
 * @param budget - Budget to calculate analytics for.
 * @param transactions - Array of transactions.
 * @returns Period analytics.
 */
export const calculatePeriodAnalytics = (
  budget: Budget,
  transactions: Transaction[],
) => {
  const dailyBreakdown: DailySpending[] = [];
  const dateRange = getDateRange(budget.startDate, new Date());

  let highestDay: DailySpending | null = null;
  let lowestDay: DailySpending | null = null;
  let daysWithoutSpending = 0;
  let daysWithSpending = 0;
  let totalSpent = 0;

  dateRange.forEach((date) => {
    const dailySpending = calculateDailySpending(transactions, date);
    dailyBreakdown.push(dailySpending);

    totalSpent += dailySpending.amount;

    if (dailySpending.amount > 0) {
      daysWithSpending++;

      if (!highestDay || dailySpending.amount > highestDay.amount) {
        highestDay = dailySpending;
      }

      if (!lowestDay || dailySpending.amount < lowestDay.amount) {
        lowestDay = dailySpending;
      }
    } else {
      daysWithoutSpending++;
    }
  });

  const averageDaily = daysWithSpending > 0 ? totalSpent / daysWithSpending : 0;

  return {
    budgetId: budget.id,
    startDate: budget.startDate,
    endDate: budget.endDate,
    dailyBreakdown,
    totalSpent,
    averageDaily,
    highestDay,
    lowestDay,
    daysWithoutSpending,
    daysWithSpending,
  };
};

/**
 * Calculate the remaining budget for a given budget and transactions.
 * @param budget - Budget to calculate remaining budget for.
 * @param transactions - Array of transactions.
 * @returns Remaining budget.
 */
export const calculateRemainingBudget = (
  budget: Budget,
  transactions: Transaction[],
): number => {
  const totalSpent = calculateTotalSpent(transactions);
  return Math.max(0, budget.totalAmount - totalSpent);
};
