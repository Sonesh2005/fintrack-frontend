import GlassCard from "./GlassCard";
import useBudgetData from "../../features/budget/useBudgetData";
import formatCurrency from "../../utils/formatCurrency";

export default function BudgetProgress() {
  const { budgetQuery, alertsQuery } = useBudgetData();

  const rawBudget = budgetQuery.data;
  const rawAlerts = alertsQuery.data;

  const isLoading = budgetQuery.isLoading || alertsQuery.isLoading;

  const budget =
    typeof rawBudget === "number"
      ? rawBudget
      : rawBudget?.monthlyBudget ?? rawBudget?.budget ?? 0;

  const spent =
    rawAlerts?.currentSpent ??
    rawAlerts?.spent ??
    rawAlerts?.currentExpense ??
    0;

  const percent =
    budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;

  return (
    <GlassCard className="p-6">
      <p className="text-sm text-white/50">Monthly Budget</p>

      <h3 className="text-lg font-semibold">
        {isLoading
          ? "Loading..."
          : budget > 0
          ? formatCurrency(budget)
          : "No budget set"}
      </h3>

      <div className="mt-4">
        <div className="h-3 w-full rounded-full bg-white/10">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-sm text-white/60">
          <span>
            {isLoading
              ? "Loading..."
              : spent > 0
              ? `Spent ${formatCurrency(spent)}`
              : "No expenses yet"}
          </span>
          <span>{isLoading ? "..." : `${percent}% used`}</span>
        </div>
      </div>
    </GlassCard>
  );
}