"use client";

import { useState } from "react";
import { format, addDays, startOfDay } from "date-fns";
import { Budget, CreateBudgetInput } from "@/types/models";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/constants/currencies";
import { useBudgetStore } from "@/lib/stores/budgetStore";
import { useUIStore } from "@/lib/stores/uiStore";

interface BudgetSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBudgetCreated: (budget: Budget) => void;
}

export const BudgetSetupModal: React.FC<BudgetSetupModalProps> = ({
  isOpen,
  onClose,
  onBudgetCreated,
}) => {
  const [formData, setFormData] = useState({
    totalAmount: "",
    startDate: format(startOfDay(new Date()), "yyyy-MM-dd"),
    endDate: format(addDays(startOfDay(new Date()), 30), "yyyy-MM-dd"),
    currency: DEFAULT_CURRENCY.code,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createBudget } = useBudgetStore();
  const { updateSettings } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.totalAmount || parseFloat(formData.totalAmount) <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const budgetInput: CreateBudgetInput = {
        totalAmount: parseFloat(formData.totalAmount),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        currency: formData.currency,
      };

      const budget = await createBudget(budgetInput);

      // Update settings with selected currency
      const selectedCurrency =
        CURRENCIES.find((c) => c.code === formData.currency) ||
        DEFAULT_CURRENCY;
      updateSettings({
        defaultCurrency: selectedCurrency,
        firstLaunch: false,
      });

      onBudgetCreated(budget);
      onClose();

      // Reset form
      setFormData({
        totalAmount: "",
        startDate: format(startOfDay(new Date()), "yyyy-MM-dd"),
        endDate: format(addDays(startOfDay(new Date()), 30), "yyyy-MM-dd"),
        currency: DEFAULT_CURRENCY.code,
      });
    } catch (error) {
      console.error("Failed to create budget:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCurrencyChange = (currencyCode: string) => {
    setFormData((prev) => ({ ...prev, currency: currencyCode }));
  };

  const calculateDailyBudget = (): string => {
    if (!formData.totalAmount || !formData.startDate || !formData.endDate)
      return "0";

    const totalAmount = parseFloat(formData.totalAmount);
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    );

    const daily = totalAmount / days;
    const currency =
      CURRENCIES.find((c) => c.code === formData.currency) || DEFAULT_CURRENCY;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(daily);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
            Set Up Your Budget
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Create a budget to start tracking your daily spending.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Total Budget */}
            <div>
              <label
                htmlFor="totalAmount"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Total Budget
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="totalAmount"
                  value={formData.totalAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      totalAmount: e.target.value,
                    }))
                  }
                  placeholder="0"
                  min="0"
                  step="1"
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <select
                    value={formData.currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm font-medium text-black dark:text-zinc-50"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                min={formData.startDate}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                required
              />
            </div>

            {/* Daily Budget Preview */}
            {formData.totalAmount && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  Your daily budget will be approximately{" "}
                  <span className="font-bold">{calculateDailyBudget()}</span>
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !formData.totalAmount ||
                  parseFloat(formData.totalAmount) <= 0
                }
                className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Creating..." : "Create Budget"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
