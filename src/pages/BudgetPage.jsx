import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  PiggyBank,
  IndianRupee,
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import useBudgetData from "../features/budget/useBudgetData";
import formatCurrency from "../utils/formatCurrency";

function getStatusColor(status) {
  switch (status) {
    case "SAFE":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "WARNING":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    case "EXCEEDED":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    default:
      return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
  }
}

function getProgressBarClass(status) {
  switch (status) {
    case "SAFE":
      return "bg-gradient-to-r from-emerald-400 to-cyan-500";
    case "WARNING":
      return "bg-gradient-to-r from-amber-400 to-orange-500";
    case "EXCEEDED":
      return "bg-gradient-to-r from-rose-500 to-red-600";
    default:
      return "bg-gradient-to-r from-cyan-400 to-blue-500";
  }
}

function getStatusMessage(status, percentageUsed, overspentAmount) {
  switch (status) {
    case "SAFE":
      return `You are managing your budget well. ${percentageUsed}% used so far.`;
    case "WARNING":
      return `You are getting close to your monthly limit. ${percentageUsed}% already used.`;
    case "EXCEEDED":
      return `You have exceeded your budget by ${formatCurrency(overspentAmount)}.`;
    default:
      return "Set a monthly budget to start tracking utilization properly.";
  }
}

export default function BudgetPage() {
  const { budgetQuery, alertsQuery, saveBudgetMutation } = useBudgetData();
  const [monthlyBudget, setMonthlyBudget] = useState("");

  const rawBudget = budgetQuery.data;
  const rawAlerts = alertsQuery.data;

  const isLoading = budgetQuery.isLoading || alertsQuery.isLoading;
  const isError = budgetQuery.isError || alertsQuery.isError;

  const budget =
    typeof rawBudget === "number"
      ? rawBudget
      : rawBudget?.monthlyBudget ?? rawBudget?.budget ?? 0;

  const spent =
    rawAlerts?.currentSpent ??
    rawAlerts?.spent ??
    rawAlerts?.currentExpense ??
    0;

  const status = rawAlerts?.status ?? "NO_BUDGET";

  const percentageUsed =
    rawAlerts?.percentageUsed ??
    rawAlerts?.usedPercentage ??
    rawAlerts?.spentPercentage ??
    (budget > 0 ? Math.round((spent / budget) * 100) : 0);

  const remaining = useMemo(
    () => Math.max(Number(budget) - Number(spent), 0),
    [budget, spent]
  );

  const overspentAmount = useMemo(
    () => Math.max(Number(spent) - Number(budget), 0),
    [budget, spent]
  );

  const safeProgressWidth = Math.min(Number(percentageUsed), 100);

  const statusMessage = getStatusMessage(
    status,
    percentageUsed,
    overspentAmount
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = Number(monthlyBudget);

    if (!value || value <= 0) {
      alert("Enter a valid budget amount");
      return;
    }

    saveBudgetMutation.mutate(
      { monthlyBudget: value },
      {
        onSuccess: () => {
          setMonthlyBudget("");
        },
        onError: (error) => {
          console.error("Save budget failed:", error?.response?.data || error);
          alert("Budget save failed. Check console/network.");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Failed to load budget data.
        </div>
      )}

      <div>
        <p className="text-sm text-white/50">Financial Planning</p>
        <h1 className="text-3xl font-semibold tracking-tight">Budget</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Monthly Budget</p>
                <h3 className="mt-1 text-3xl font-bold">
                  {isLoading ? "..." : formatCurrency(budget)}
                </h3>
                <p className="mt-2 text-sm text-cyan-400">Configured budget</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
                <IndianRupee size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Spent</p>
                <h3 className="mt-1 text-3xl font-bold">
                  {isLoading ? "..." : formatCurrency(spent)}
                </h3>
                <p className="mt-2 text-sm text-amber-400">
                  Current month spending
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div
                className={`rounded-2xl p-3 ${
                  status === "EXCEEDED"
                    ? "bg-red-500/10 text-red-400"
                    : "bg-emerald-500/10 text-emerald-400"
                }`}
              >
                <PiggyBank size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">
                  {status === "EXCEEDED" ? "Overspent" : "Remaining"}
                </p>
                <h3 className="mt-1 text-3xl font-bold">
                  {isLoading
                    ? "..."
                    : status === "EXCEEDED"
                    ? formatCurrency(overspentAmount)
                    : formatCurrency(remaining)}
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    status === "EXCEEDED"
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {status === "EXCEEDED"
                    ? "Exceeded amount"
                    : "Available budget left"}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <p className="text-sm text-white/50">Status</p>
            <div
              className={`mt-3 inline-flex rounded-2xl border px-4 py-2 text-sm font-medium ${getStatusColor(
                status
              )}`}
            >
              {status}
            </div>
            <p className="mt-2 text-sm text-white/50">Live alert state</p>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard className="p-6 xl:col-span-1">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-sm text-white/50">Budget Form</p>
              <h3 className="text-lg font-semibold">Set Monthly Budget</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="number"
              placeholder="Enter monthly budget"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />

            <button
              type="submit"
              disabled={saveBudgetMutation.isPending}
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saveBudgetMutation.isPending ? "Saving..." : "Save Budget"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-white/50">Quick Note</p>
            <p className="mt-2 text-sm text-white/75">
              Set a monthly budget to track your spending discipline and avoid
              overspending.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-sm text-white/50">Usage Analytics</p>
              <h3 className="text-lg font-semibold">Budget Utilization</h3>
            </div>
          </div>

          <div className="mt-8">
            <div className="h-4 w-full rounded-full bg-white/10">
              <div
                className={`h-4 rounded-full transition-all ${getProgressBarClass(
                  status
                )}`}
                style={{ width: `${safeProgressWidth}%` }}
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-white/60">
              <span>{formatCurrency(spent)} spent</span>
              <span>{percentageUsed}% used</span>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center gap-2">
                <ShieldAlert
                  size={16}
                  className={
                    status === "EXCEEDED"
                      ? "text-red-400"
                      : status === "WARNING"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }
                />
                <span className="text-sm text-white/70">Status Insight</span>
              </div>
              <p className="mt-3 text-lg font-semibold">{status}</p>
              <p className="mt-2 text-sm text-white/60">{statusMessage}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <span className="text-sm text-white/70">
                {status === "EXCEEDED" ? "Exceeded By" : "Remaining Budget"}
              </span>
              <p className="mt-3 text-lg font-semibold">
                {status === "EXCEEDED"
                  ? formatCurrency(overspentAmount)
                  : formatCurrency(remaining)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/5 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle
                size={16}
                className={
                  status === "EXCEEDED"
                    ? "text-red-400"
                    : status === "WARNING"
                    ? "text-amber-400"
                    : "text-cyan-400"
                }
              />
              <span className="text-sm text-white/70">Budget Insight</span>
            </div>
            <p className="mt-3 text-sm text-white/75">
              {status === "EXCEEDED"
                ? "Your spending has crossed the configured budget. Consider increasing your budget or reducing discretionary expenses."
                : status === "WARNING"
                ? "You are close to your limit. Keep a close watch on non-essential spending for the rest of the month."
                : "Your current spending is within the planned budget range. Keep maintaining this pace."}
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}