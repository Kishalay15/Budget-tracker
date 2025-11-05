"use client";

import { useEffect } from "react";
import { useBudget } from "@/lib/hooks/useBudget";
import { useUIStore } from "@/lib/stores/uiStore";
import { BudgetSetupModal } from "@/components/budget/BudgetSetupModal";
import { AddTransactionModal } from "@/components/transactions/AddTransactionModal";
import { EditTransactionModal } from "@/components/transactions/EditTransactionModal";
import { TransactionHistoryModal } from "@/components/transactions/TransactionHistoryModal";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { formatCurrency, formatDate } from "@/lib/utils/date";

export default function Home() {
  const { budget, transactions, budgetStats, isLoading, error, actions } =
    useBudget();

  const {
    addTransactionState,
    editTransactionState,
    isBudgetSetupOpen,
    isHistoryOpen,
    isSettingsOpen,
    openAddTransaction,
    closeAddTransaction,
    openEditTransaction,
    closeEditTransaction,
    openBudgetSetup,
    closeBudgetSetup,
    openHistory,
    closeHistory,
    openSettings,
    closeSettings,
    settings,
  } = useUIStore();

  useEffect(() => {
    actions.reloadBudget();
  }, []);

  const handleBudgetCreated = () => {
    // Budget setup modal will close automatically
    // The useBudget hook will reload and show the dashboard
  };

  if (isLoading && !budget) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <>
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
                Finnova
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                Simple daily budget tracking to help you spend money wisely.
              </p>
            </div>

            <button
              onClick={openBudgetSetup}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
            >
              Start Tracking Your Budget
            </button>

            <p className="mt-6 text-zinc-500 dark:text-zinc-500 text-sm">
              No account needed • Your data stays on your device
            </p>
          </div>
        </div>

        <BudgetSetupModal
          isOpen={isBudgetSetupOpen}
          onClose={closeBudgetSetup}
          onBudgetCreated={handleBudgetCreated}
        />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
        <div className="max-w-md mx-auto p-4 pb-20">
          {/* Header */}
          {/* Header */}
          <header className="mb-6 pt-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
                  Coin Crush
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {formatDate(budget.startDate)} - {formatDate(budget.endDate)}
                </p>
              </div>
              <button
                onClick={openSettings}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                aria-label="Settings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </header>

          {/* Daily Budget Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 mb-6 border border-zinc-200 dark:border-zinc-800">
            <div className="text-center">
              <p className="text-zinc-600 dark:text-zinc-400 mb-2 text-sm font-medium">
                Money left today
              </p>
              <h2 className="text-4xl font-bold text-black dark:text-zinc-50 mb-3">
                {formatCurrency(budgetStats?.dailyBudget || 0, budget.currency)}
              </h2>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500 dark:text-zinc-500">Remaining</p>
                  <p className="font-semibold text-black dark:text-zinc-50">
                    {formatCurrency(
                      budgetStats?.remaining || 0,
                      budget.currency,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-500">Spent</p>
                  <p className="font-semibold text-black dark:text-zinc-50">
                    {formatCurrency(
                      budgetStats?.totalSpent || 0,
                      budget.currency,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 dark:text-zinc-500">Days left</p>
                  <p className="font-semibold text-black dark:text-zinc-50">
                    {budgetStats?.daysRemaining || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 mb-6 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold text-black dark:text-zinc-50 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => openAddTransaction()}
                className="bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                Add Expense
              </button>
              <button
                onClick={openHistory}
                className="border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 py-3 rounded-xl font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm"
              >
                View History
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm p-6 border border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-black dark:text-zinc-50">
                Recent Transactions
              </h3>
              <span className="text-sm text-zinc-500 dark:text-zinc-500">
                {transactions.length} total
              </span>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-zinc-400 dark:text-zinc-600 mb-2">💸</div>
                <p className="text-zinc-500 dark:text-zinc-500">
                  No transactions yet
                </p>
                <button
                  onClick={() => openAddTransaction()}
                  className="text-primary hover:text-primary/90 font-medium mt-2"
                >
                  Add your first expense
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-black dark:text-zinc-50">
                        {formatCurrency(transaction.amount, budget.currency)}
                      </p>
                      {transaction.comment && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-500 truncate">
                          {transaction.comment}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-500 dark:text-zinc-500">
                        {new Date(transaction.timestamp).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-600">
                        {new Date(transaction.timestamp).toLocaleDateString(
                          [],
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                ))}

                {transactions.length > 5 && (
                  <button
                    onClick={openHistory}
                    className="w-full text-center text-primary hover:text-primary/90 font-medium py-2"
                  >
                    View All Transactions
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Budget Setup Modal */}
      <BudgetSetupModal
        isOpen={isBudgetSetupOpen}
        onClose={closeBudgetSetup}
        onBudgetCreated={handleBudgetCreated}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={addTransactionState.isOpen}
        onClose={closeAddTransaction}
        initialAmount={addTransactionState.initialAmount}
        initialComment={addTransactionState.initialComment}
      />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={editTransactionState.isOpen}
        onClose={closeEditTransaction}
        transaction={editTransactionState.transaction}
      />

      {/* Transaction History Modal */}
      <TransactionHistoryModal isOpen={isHistoryOpen} onClose={closeHistory} />

      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={closeSettings} />

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md mx-auto dark:bg-red-900 dark:border-red-700 dark:text-red-100">
          <div className="flex justify-between items-center">
            <span className="text-sm">{error}</span>
            <button
              onClick={actions.clearError}
              className="text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-100 font-bold text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
