// "use client";

// import { useState, useEffect } from "react";
// import { format, startOfDay } from "date-fns";
// import { useBudget } from "@/lib/hooks/useBudget";
// import { useUIStore } from "@/lib/stores/uiStore";
// import { CURRENCIES } from "@/lib/constants/currencies";

// interface SettingsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const SettingsModal: React.FC<SettingsModalProps> = ({
//   isOpen,
//   onClose,
// }) => {
//   const { budget, actions } = useBudget();
//   const { updateSettings, settings } = useUIStore();

//   const [activeTab, setActiveTab] = useState<"budget" | "preferences">(
//     "budget",
//   );
//   const [formData, setFormData] = useState({
//     totalAmount: "",
//     startDate: "",
//     endDate: "",
//     currency: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     if (budget) {
//       setFormData({
//         totalAmount: budget.totalAmount.toString(),
//         startDate: format(startOfDay(budget.startDate), "yyyy-MM-dd"),
//         endDate: format(startOfDay(budget.endDate), "yyyy-MM-dd"),
//         currency: budget.currency,
//       });
//     }
//   }, [budget]);

//   const handleUpdateBudget = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (
//       !budget ||
//       !formData.totalAmount ||
//       parseFloat(formData.totalAmount) <= 0
//     ) {
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await actions.updateBudget(budget.id, {
//         totalAmount: parseFloat(formData.totalAmount),
//         startDate: new Date(formData.startDate),
//         endDate: new Date(formData.endDate),
//         currency: formData.currency,
//       });

//       // Update default currency in settings
//       const selectedCurrency = CURRENCIES.find(
//         (c) => c.code === formData.currency,
//       );
//       if (selectedCurrency) {
//         updateSettings({ defaultCurrency: selectedCurrency });
//       }

//       onClose();
//     } catch (error) {
//       console.error("Failed to update budget:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDeleteBudget = async () => {
//     if (!budget) return;

//     const confirmed = confirm(
//       "Are you sure you want to delete this budget? All transactions will be lost. This action cannot be undone.",
//     );

//     if (confirmed) {
//       try {
//         await actions.deleteBudget(budget.id);
//         onClose();
//       } catch (error) {
//         console.error("Failed to delete budget:", error);
//       }
//     }
//   };

//   const calculateDailyBudget = (): string => {
//     if (!formData.totalAmount || !formData.startDate || !formData.endDate)
//       return "0";

//     const totalAmount = parseFloat(formData.totalAmount);
//     const start = new Date(formData.startDate);
//     const end = new Date(formData.endDate);
//     const days = Math.max(
//       1,
//       Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
//     );

//     const daily = totalAmount / days;
//     const currency = CURRENCIES.find((c) => c.code === formData.currency);

//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: currency?.code || "INR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(daily);
//   };

//   if (!isOpen || !budget) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
//         {/* Header */}
//         <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
//           <div className="flex justify-between items-center">
//             <h2 className="text-2xl font-bold text-black dark:text-zinc-50">
//               Settings
//             </h2>
//             <button
//               onClick={onClose}
//               className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl leading-none"
//             >
//               ×
//             </button>
//           </div>

//           {/* Tabs */}
//           <div className="flex gap-2 mt-4">
//             <button
//               onClick={() => setActiveTab("budget")}
//               className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
//                 activeTab === "budget"
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
//               }`}
//             >
//               Budget
//             </button>
//             <button
//               onClick={() => setActiveTab("preferences")}
//               className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
//                 activeTab === "preferences"
//                   ? "bg-primary text-primary-foreground"
//                   : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
//               }`}
//             >
//               Preferences
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 overflow-y-auto p-6">
//           {activeTab === "budget" ? (
//             <form onSubmit={handleUpdateBudget} className="space-y-4">
//               {/* Total Budget */}
//               <div>
//                 <label
//                   htmlFor="settings-totalAmount"
//                   className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
//                 >
//                   Total Budget
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={formData.currency}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         currency: e.target.value,
//                       }))
//                     }
//                     className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-sm font-medium text-black dark:text-zinc-50 pr-6 py-1 focus:outline-none cursor-pointer appearance-none"
//                     style={{ width: "auto", paddingRight: "1.5rem" }}
//                   >
//                     {CURRENCIES.map((currency) => (
//                       <option key={currency.code} value={currency.code}>
//                         {currency.symbol}
//                       </option>
//                     ))}
//                   </select>
//                   <input
//                     type="number"
//                     id="settings-totalAmount"
//                     value={formData.totalAmount}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         totalAmount: e.target.value,
//                       }))
//                     }
//                     placeholder="0"
//                     min="0"
//                     step="1"
//                     className="w-full pl-16 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Start Date */}
//               <div>
//                 <label
//                   htmlFor="settings-startDate"
//                   className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
//                 >
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   id="settings-startDate"
//                   value={formData.startDate}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       startDate: e.target.value,
//                     }))
//                   }
//                   className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
//                   required
//                 />
//               </div>

//               {/* End Date */}
//               <div>
//                 <label
//                   htmlFor="settings-endDate"
//                   className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
//                 >
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   id="settings-endDate"
//                   value={formData.endDate}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       endDate: e.target.value,
//                     }))
//                   }
//                   min={formData.startDate}
//                   className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
//                   required
//                 />
//               </div>

//               {/* Daily Budget Preview */}
//               {formData.totalAmount && (
//                 <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
//                   <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
//                     New daily budget:{" "}
//                     <span className="font-bold">{calculateDailyBudget()}</span>
//                   </p>
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={onClose}
//                   className="flex-1 py-3 px-4 border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={
//                     isSubmitting ||
//                     !formData.totalAmount ||
//                     parseFloat(formData.totalAmount) <= 0
//                   }
//                   className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:bg-zinc-400 disabled:cursor-not-allowed transition-colors"
//                 >
//                   {isSubmitting ? "Saving..." : "Save Changes"}
//                 </button>
//               </div>

//               {/* Delete Budget */}
//               <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
//                 <button
//                   type="button"
//                   onClick={handleDeleteBudget}
//                   className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
//                 >
//                   Delete Budget & All Transactions
//                 </button>
//                 <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center mt-2">
//                   This action cannot be undone
//                 </p>
//               </div>
//             </form>
//           ) : (
//             <div className="space-y-4">
//               {/* Preferences Tab */}
//               <div>
//                 <h3 className="font-semibold text-black dark:text-zinc-50 mb-3">
//                   App Information
//                 </h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between py-2">
//                     <span className="text-zinc-600 dark:text-zinc-400">
//                       Version
//                     </span>
//                     <span className="text-black dark:text-zinc-50">1.0.0</span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-zinc-600 dark:text-zinc-400">
//                       Data Storage
//                     </span>
//                     <span className="text-black dark:text-zinc-50">
//                       Local Device
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
//                 <h3 className="font-semibold text-black dark:text-zinc-50 mb-3">
//                   About
//                 </h3>
//                 <p className="text-sm text-zinc-600 dark:text-zinc-400">
//                   Buckwheat is a simple budget tracking app that helps you
//                   manage your daily spending. All your data is stored locally on
//                   your device and never leaves your browser.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";

import { useState, useEffect } from "react";
import { format, startOfDay } from "date-fns";
import { useBudget } from "@/lib/hooks/useBudget";
import { useUIStore } from "@/lib/stores/uiStore";
import { CURRENCIES } from "@/lib/constants/currencies";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { budget, actions } = useBudget();
  const { updateSettings, settings } = useUIStore();

  const [formData, setFormData] = useState({
    totalAmount: "",
    startDate: "",
    endDate: "",
    currency: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (budget) {
      setFormData({
        totalAmount: budget.totalAmount.toString(),
        startDate: format(startOfDay(budget.startDate), "yyyy-MM-dd"),
        endDate: format(startOfDay(budget.endDate), "yyyy-MM-dd"),
        currency: budget.currency,
      });
    }
  }, [budget]);

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !budget ||
      !formData.totalAmount ||
      parseFloat(formData.totalAmount) <= 0
    ) {
      return;
    }

    setIsSubmitting(true);
    try {
      await actions.updateBudget(budget.id, {
        totalAmount: parseFloat(formData.totalAmount),
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        currency: formData.currency,
      });

      // Update default currency in settings
      const selectedCurrency = CURRENCIES.find(
        (c) => c.code === formData.currency,
      );
      if (selectedCurrency) {
        updateSettings({ defaultCurrency: selectedCurrency });
      }

      onClose();
    } catch (error) {
      console.error("Failed to update budget:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBudget = async () => {
    if (!budget) return;

    const confirmed = confirm(
      "Are you sure you want to delete this budget? All transactions will be lost. This action cannot be undone.",
    );

    if (confirmed) {
      try {
        await actions.deleteBudget(budget.id);
        onClose();
      } catch (error) {
        console.error("Failed to delete budget:", error);
      }
    }
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
    const currency = CURRENCIES.find((c) => c.code === formData.currency);

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency?.code || "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(daily);
  };

  if (!isOpen || !budget) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black dark:text-zinc-50">
              Settings
            </h2>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleUpdateBudget} className="space-y-4">
            {/* Total Budget */}
            <div>
              <label
                htmlFor="settings-totalAmount"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Total Budget
              </label>
              <div className="relative">
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      currency: e.target.value,
                    }))
                  }
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-sm font-medium text-black dark:text-zinc-50 pr-6 py-1 focus:outline-none cursor-pointer appearance-none"
                  style={{ width: "auto", paddingRight: "1.5rem" }}
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  id="settings-totalAmount"
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
                  className="w-full pl-16 pr-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                  required
                />
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label
                htmlFor="settings-startDate"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Start Date
              </label>
              <input
                type="date"
                id="settings-startDate"
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
                htmlFor="settings-endDate"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                End Date
              </label>
              <input
                type="date"
                id="settings-endDate"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
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
                  New daily budget:{" "}
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {/* Delete Budget */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={handleDeleteBudget}
                className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete Budget & All Transactions
              </button>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center mt-2">
                This action cannot be undone
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
