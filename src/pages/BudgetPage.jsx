import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import {
  Wallet,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  PiggyBank,
  IndianRupee,
  Sparkles,
} from "lucide-react";

import GlassCard from "../components/ui/GlassCard";
import useBudgetData from "../features/budget/useBudgetData";
import formatCurrency from "../utils/formatCurrency";

function getStatusColor(status) {
  switch (status) {
    case "SAFE":
      return "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";

    case "WARNING":
      return "text-amber-300 bg-amber-500/10 border-amber-500/20";

    case "EXCEEDED":
      return "text-rose-300 bg-rose-500/10 border-rose-500/20";

    default:
      return "text-cyan-300 bg-cyan-500/10 border-cyan-500/20";
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
      return "bg-gradient-to-r from-cyan-400 to-purple-500";
  }
}

function getStatusMessage(
  status,
  percentageUsed,
  overspentAmount
) {
  switch (status) {
    case "SAFE":
      return `You are managing your budget well. ${percentageUsed}% used so far.`;

    case "WARNING":
      return `You are approaching your limit. ${percentageUsed}% already utilized.`;

    case "EXCEEDED":
      return `Budget exceeded by ${formatCurrency(
        overspentAmount
      )}.`;

    default:
      return "Set a monthly budget to start tracking.";
  }
}

export default function BudgetPage() {
  const {
    budgetQuery,
    alertsQuery,
    saveBudgetMutation,
  } = useBudgetData();

  const [monthlyBudget, setMonthlyBudget] =
    useState("");

  const rawBudget = budgetQuery.data;
  const rawAlerts = alertsQuery.data;

  const isLoading =
    budgetQuery.isLoading || alertsQuery.isLoading;

  const isError =
    budgetQuery.isError || alertsQuery.isError;

  const budget =
    typeof rawBudget === "number"
      ? rawBudget
      : rawBudget?.monthlyBudget ??
        rawBudget?.budget ??
        0;

  const spent =
    rawAlerts?.currentSpent ??
    rawAlerts?.spent ??
    rawAlerts?.currentExpense ??
    0;

  const status =
    rawAlerts?.status ?? "NO_BUDGET";

  const percentageUsed =
    rawAlerts?.percentageUsed ??
    rawAlerts?.usedPercentage ??
    rawAlerts?.spentPercentage ??
    (budget > 0
      ? Math.round((spent / budget) * 100)
      : 0);

  const remaining = useMemo(
    () =>
      Math.max(Number(budget) - Number(spent), 0),
    [budget, spent]
  );

  const overspentAmount = useMemo(
    () =>
      Math.max(Number(spent) - Number(budget), 0),
    [budget, spent]
  );

  const safeProgressWidth = Math.min(
    Number(percentageUsed),
    100
  );

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
      }
    );
  };

  return (
    <div className="relative space-y-8 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-[140px]" />

      </div>

      {/* ERROR */}
      {isError && (

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          Failed to load budget data.
        </div>

      )}

      {/* HEADER */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <p className="text-sm text-white/50">
            Financial Planning
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white">
            Budget Planner
          </h1>

        </div>

        <button
          className="
            flex items-center gap-2
            rounded-2xl
            bg-gradient-to-r
            from-cyan-400
            to-purple-500
            px-6 py-4
            font-semibold
            text-white
            shadow-[0_0_30px_rgba(34,211,238,0.25)]
            transition-all duration-300
            hover:scale-[1.03]
          "
        >

          <Sparkles size={18} />

          AI Budget Insights

        </button>

      </div>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Monthly Budget"
          value={
            isLoading
              ? "..."
              : formatCurrency(budget)
          }
          subtitle="Configured budget"
          icon={<Wallet size={18} />}
          color="cyan"
        />

        <StatCard
          title="Spent"
          value={
            isLoading
              ? "..."
              : formatCurrency(spent)
          }
          subtitle="Current month spending"
          icon={<IndianRupee size={18} />}
          color="amber"
        />

        <StatCard
          title={
            status === "EXCEEDED"
              ? "Overspent"
              : "Remaining"
          }
          value={
            isLoading
              ? "..."
              : status === "EXCEEDED"
              ? formatCurrency(overspentAmount)
              : formatCurrency(remaining)
          }
          subtitle={
            status === "EXCEEDED"
              ? "Exceeded amount"
              : "Available balance"
          }
          icon={<PiggyBank size={18} />}
          color={
            status === "EXCEEDED"
              ? "rose"
              : "emerald"
          }
        />

        <motion.div
          whileHover={{
            y: -6,
            scale: 1.01,
          }}
        >

          <GlassCard
            className="
              border border-cyan-500/10
              bg-white/[0.03]
              p-6
              shadow-[0_0_40px_rgba(0,255,255,0.06)]
            "
          >

            <p className="text-sm text-white/50">
              Status
            </p>

            <div
              className={`
                mt-4 inline-flex
                rounded-2xl
                border
                px-4 py-2
                text-sm font-semibold
                ${getStatusColor(status)}
              `}
            >
              {status}
            </div>

            <p className="mt-3 text-sm text-white/50">
              Live budget state
            </p>

          </GlassCard>

        </motion.div>

      </div>

      {/* MAIN GRID */}
      <div className="grid gap-5 xl:grid-cols-3">

        {/* FORM */}
        <GlassCard
          className="
            border border-cyan-500/10
            bg-white/[0.03]
            p-7
            shadow-[0_0_40px_rgba(0,255,255,0.05)]
            xl:col-span-1
          "
        >

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
              <Wallet size={18} />
            </div>

            <div>

              <p className="text-sm text-white/50">
                Budget Form
              </p>

              <h3 className="text-lg font-semibold text-white">
                Set Monthly Budget
              </h3>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-4"
          >

            <input
              type="number"
              placeholder="Enter monthly budget"
              value={monthlyBudget}
              onChange={(e) =>
                setMonthlyBudget(e.target.value)
              }
              className="
                w-full rounded-2xl
                border border-cyan-500/10
                bg-white/[0.04]
                px-4 py-4
                outline-none
                placeholder:text-white/30
              "
              required
            />

            <button
              type="submit"
              disabled={
                saveBudgetMutation.isPending
              }
              className="
                w-full rounded-2xl
                bg-gradient-to-r
                from-cyan-400
                to-purple-500
                px-4 py-4
                font-semibold
                text-white
                shadow-[0_0_30px_rgba(34,211,238,0.25)]
                transition-all duration-300
                hover:scale-[1.02]
                disabled:opacity-70
              "
            >

              {saveBudgetMutation.isPending
                ? "Saving..."
                : "Save Budget"}

            </button>

          </form>

          <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.03] p-5">

            <p className="text-sm text-white/50">
              AI Suggestion
            </p>

            <p className="mt-3 text-sm leading-6 text-white/70">
              Try keeping your monthly expenses
              below 70% of your total income for
              healthier savings growth.
            </p>

          </div>

        </GlassCard>

        {/* ANALYTICS */}
        <GlassCard
          className="
            border border-cyan-500/10
            bg-white/[0.03]
            p-7
            shadow-[0_0_40px_rgba(0,255,255,0.05)]
            xl:col-span-2
          "
        >

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-300">
              <TrendingUp size={18} />
            </div>

            <div>

              <p className="text-sm text-white/50">
                Usage Analytics
              </p>

              <h3 className="text-lg font-semibold text-white">
                Budget Utilization
              </h3>

            </div>

          </div>

          {/* PROGRESS */}
          <div className="mt-10">

            <div className="h-5 w-full overflow-hidden rounded-full bg-white/10">

              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${safeProgressWidth}%`,
                }}
                transition={{
                  duration: 1,
                }}
                className={`
                  h-full rounded-full
                  ${getProgressBarClass(status)}
                `}
              />

            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-white/60">

              <span>
                {formatCurrency(spent)} spent
              </span>

              <span>
                {percentageUsed}% used
              </span>

            </div>

          </div>

          {/* INSIGHTS */}
          <div className="mt-10 grid gap-5 md:grid-cols-2">

            <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-5">

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

                <span className="text-sm text-white/70">
                  Status Insight
                </span>

              </div>

              <p className="mt-4 text-2xl font-bold text-white">
                {status}
              </p>

              <p className="mt-3 text-sm leading-6 text-white/60">
                {statusMessage}
              </p>

            </div>

            <div className="rounded-3xl border border-white/5 bg-white/[0.03] p-5">

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

                <span className="text-sm text-white/70">
                  Budget Insight
                </span>

              </div>

              <p className="mt-4 text-lg font-semibold text-white">

                {status === "EXCEEDED"
                  ? "Reduce discretionary spending."
                  : status === "WARNING"
                  ? "Monitor upcoming expenses carefully."
                  : "Your spending pattern is healthy."}

              </p>

              <p className="mt-3 text-sm leading-6 text-white/60">

                {status === "EXCEEDED"
                  ? "You crossed your configured monthly limit."
                  : status === "WARNING"
                  ? "You are nearing your planned limit."
                  : "Current spending is within safe range."}

              </p>

            </div>

          </div>

        </GlassCard>

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}) {
  const colorMap = {
    cyan: "bg-cyan-500/10 text-cyan-300",
    amber: "bg-amber-500/10 text-amber-300",
    emerald:
      "bg-emerald-500/10 text-emerald-300",
    rose: "bg-rose-500/10 text-rose-300",
  };

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
    >

      <GlassCard
        className="
          border border-cyan-500/10
          bg-white/[0.03]
          p-6
          shadow-[0_0_40px_rgba(0,255,255,0.06)]
        "
      >

        <div className="flex items-center gap-4">

          <div
            className={`rounded-2xl p-3 ${colorMap[color]}`}
          >
            {icon}
          </div>

          <div>

            <p className="text-sm text-white/50">
              {title}
            </p>

            <h3 className="mt-2 text-3xl font-black text-white">
              {value}
            </h3>

            <p className="mt-2 text-sm text-white/50">
              {subtitle}
            </p>

          </div>

        </div>

      </GlassCard>

    </motion.div>
  );
}