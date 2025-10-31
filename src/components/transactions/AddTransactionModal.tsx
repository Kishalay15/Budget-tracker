"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CreateTransactionInput } from "@/types/models";
import { useBudget } from "@/lib/hooks/useBudget";
import { useUIStore } from "@/lib/stores/uiStore";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAmount?: number;
  initialComment?: string;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  initialAmount = 0,
  initialComment = "",
}) => {
  const [formData, setFormData] = useState({
    amount: initialAmount ? initialAmount.toString() : "",
    comment: initialComment || "",
    timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { budget, actions } = useBudget();
  const { settings } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !budget) return;

    setIsSubmitting(true);
    try {
      const transactionInput: CreateTransactionInput = {
        budgetId: budget.id,
        amount: Math.abs(parseFloat(formData.amount)), // Ensure positive amount
        comment: formData.comment.trim() || undefined,
        timestamp: new Date(formData.timestamp),
      };

      await actions.addTransaction(transactionInput);

      // Reset form and close
      setFormData({
        amount: "",
        comment: "",
        timestamp: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      });
      onClose();
    } catch (error) {
      console.error("Failed to add transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimal point
    const sanitizedValue = value.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    const parts = sanitizedValue.split(".");
    if (parts.length > 2) return;

    setFormData((prev) => ({ ...prev, amount: sanitizedValue }));
  };

  if (!isOpen || !budget) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
            Add Expense
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Record your spending to track against your budget.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Amount
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                  inputMode="decimal"
                  className="w-full pl-12 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 text-lg font-medium"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 dark:text-zinc-400 font-medium">
                  {settings.defaultCurrency.symbol}
                </div>
              </div>
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Note (optional)
              </label>
              <input
                type="text"
                id="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, comment: e.target.value }))
                }
                placeholder="What was this for?"
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                maxLength={100}
              />
            </div>

            {/* Timestamp */}
            <div>
              <label
                htmlFor="timestamp"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Date & Time
              </label>
              <input
                type="datetime-local"
                id="timestamp"
                value={formData.timestamp}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    timestamp: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                required
              />
            </div>

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
                  !formData.amount ||
                  parseFloat(formData.amount) <= 0
                }
                className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
