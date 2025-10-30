import {
  format,
  differenceInDays,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
} from "date-fns";
import { start } from "node:repl";

export const formatCurrency = (
  amount: number,
  currency: string = "INR",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date): string => {
  return format(date, "MMM dd, yyyy");
};

export const formatDateTime = (date: Date): string => {
  return format(date, "MMM dd, yyyy HH:mm");
};

export const formatTime = (date: Date): string => {
  return format(date, "HH:mm");
};

export const getDaysRemaining = (startDate: Date, endDate: Date): number => {
  const today = startOfDay(new Date());
  const end = endOfDay(endDate);
  // const days = eachDayOfInterval({ today, end });
  //
  // return days.length;

  return Math.max(0, differenceInDays(end, today) + 1);
};

export const getDaysElapsed = (startDate: Date, endDate: Date): number => {
  const today = startOfDay(new Date());
  const start = startOfDay(startDate);
  return Math.min(
    differenceInDays(today, start) + 1,
    differenceInDays(endDate, startDate) + 1,
  );
};

export const getTotalDays = (startDate: Date, endDate: Date): number => {
  return differenceInDays(endDate, startDate) + 1;
};

export const getDaysInPeriod = (startDate: Date, endDate: Date): number => {
  return differenceInDays(endDate, startDate) + 1;
};

export const getDailyBudget = (
  totalBudget: number,
  totalSpent: number,
  daysRemaining: number,
): number => {
  if (daysRemaining <= 0) return 0;

  return Math.max(0, (totalBudget - totalSpent) / daysRemaining);
};

export const isToday = (date: Date): boolean => {
  const today = startOfDay(new Date());
  const targetDate = startOfDay(date);

  return today.getTime() === targetDate.getTime();
};

export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
  return eachDayOfInterval({ start: startDate, end: endDate });
};
