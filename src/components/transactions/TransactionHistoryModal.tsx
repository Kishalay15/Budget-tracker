"use client";

import { useState, useMemo } from "react";
import { Transaction } from "@/types/models";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils/date";
import { useBudget } from "@/lib/hooks/useBudget";
import { useUIStore } from "@/lib/stores/uiStore";

interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionHistoryModal: React.FC<
  TransactionHistoryModalProps
> = ({ isOpen, onClose }) => {
  const { budget, transactions, actions } = useBudget();
  const { openEditTransaction } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.comment?.toLowerCase().includes(query) ||
          t.amount.toString().includes(query),
      );
    }

    // Sort transactions
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        const diff = a.timestamp.getTime() - b.timestamp.getTime();
        return sortOrder === "asc" ? diff : -diff;
      } else {
        const diff = a.amount - b.amount;
        return sortOrder === "asc" ? diff : -diff;
      }
    });

    return sorted;
  }, [transactions, searchQuery, sortBy, sortOrder]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await actions.deleteTransaction(id);
    }
  };

  const toggleSort = (field: "date" | "amount") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (!isOpen || !budget) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-black dark:text-zinc-50">
              Transaction History
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Search and filters */}
          <div className="space-y-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
            />

            <div className="flex gap-2">
              <button
                onClick={() => toggleSort("date")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === "date"
                    ? "bg-primary text-primary-foreground"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                Date {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
              <button
                onClick={() => toggleSort("amount")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === "amount"
                    ? "bg-primary text-primary-foreground"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                Amount{" "}
                {sortBy === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
              </button>
            </div>
          </div>
        </div>

        {/* Transaction list */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAndSortedTransactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-zinc-400 dark:text-zinc-600 mb-2 text-4xl">
                💸
              </div>
              <p className="text-zinc-500 dark:text-zinc-500">
                {searchQuery ? "No transactions found" : "No transactions yet"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAndSortedTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-black dark:text-zinc-50">
                        {formatCurrency(transaction.amount, budget.currency)}
                      </p>
                      {transaction.comment && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          {transaction.comment}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditTransaction(transaction)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                    <span>{formatDate(transaction.timestamp)}</span>
                    <span>{formatTime(transaction.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with stats */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">
              Total Transactions: {filteredAndSortedTransactions.length}
            </span>
            <span className="font-semibold text-black dark:text-zinc-50">
              Total:{" "}
              {formatCurrency(
                filteredAndSortedTransactions.reduce(
                  (sum, t) => sum + t.amount,
                  0,
                ),
                budget.currency,
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
