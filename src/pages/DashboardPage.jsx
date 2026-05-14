import { useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Brain, Sparkles, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getInsights } from "../api/insightApi";
import CategoryDonutChart from "../components/charts/CategoryDonutChart";
import HealthScoreRing from "../components/charts/HealthScoreRing";
import BudgetProgress from "../components/ui/BudgetProgress";
import ExpenseHeatmap from "../components/charts/ExpenseHeatmap";
import useDashboardData from "../features/dashboard/useDashboardData";
import formatCurrency from "../utils/formatCurrency";
import StatCard from "../components/ui/StatCard";
import GlassCard from "../components/ui/GlassCard";
import MonthlyTrendChart from "../components/charts/MonthlyTrendChart";
import toast from "react-hot-toast";

import FinTrackAIChat from "../components/ai/FinTrackAIChat";
export default function DashboardPage() {
 
  const { summaryQuery, monthlyQuery } = useDashboardData();

  const { data: smartInsights = [], isLoading: insightsLoading } = useQuery({
    queryKey: ["insights"],
    queryFn: getInsights,
  });

  const summary = summaryQuery.data || {};
  const categoryData =
  summary?.categoryBreakdown || [];
const topCategoryData =
  categoryData.length > 0
    ? categoryData.reduce((max, item) =>
        item.value > max.value
          ? item
          : max
      )
    : null;

const topCategory =
  topCategoryData?.name || "No Data";

const topCategoryAmount =
  topCategoryData?.value || 0;
  const isSummaryLoading = summaryQuery.isLoading;
  const isSummaryError = summaryQuery.isError;
if (isSummaryError) {
  toast.error("Failed to load dashboard data");
}
  const totalIncome = summary.totalIncome ?? 0;
  const totalExpense = summary.totalExpense ?? 0;
  const savings = summary.savings ?? 0;
  const totalBalance = summary.totalBalance ?? savings;

  const monthlyRaw = monthlyQuery.data || [];

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const monthlyData = useMemo(() => {
    return monthNames.map((name, index) => {
      const monthNumber = index + 1;
      const record = monthlyRaw.find((m) => m.month === monthNumber);

      return {
        month: name,
        income: record?.income ?? 0,
        expense: record?.expense ?? 0,
      };
    });
  }, [monthlyRaw]);

  const monthsWithExpense = monthlyData.filter((item) => item.expense > 0);

  const currentMonthData =
    monthsWithExpense[monthsWithExpense.length - 1] || { income: 0, expense: 0 };

  const previousMonthData =
    monthsWithExpense[monthsWithExpense.length - 2] || { income: 0, expense: 0 };

  const currentMonthExpense = currentMonthData.expense ?? 0;
  const previousMonthExpense = previousMonthData.expense ?? 0;

  let expenseChange = 0;

  if (previousMonthExpense > 0) {
    const rawChange =
      ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100;

    if (Math.abs(rawChange) > 200) {
      expenseChange = rawChange > 0 ? 200 : -200;
    } else {
      expenseChange = rawChange.toFixed(1);
    }
  } else {
    expenseChange = 0;
  }

  const spendingRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  const riskLevel =
    spendingRatio >= 90 ? "High" : spendingRatio >= 70 ? "Medium" : "Low";

  const riskScore =
    spendingRatio >= 90 ? 85 : spendingRatio >= 70 ? 60 : 30;

  const recentExpenses = monthsWithExpense.slice(-3).map((item) => item.expense);

  const predictedExpense =
    recentExpenses.length > 0
      ? recentExpenses.reduce((sum, value) => sum + value, 0) / recentExpenses.length
      : 0;

  return (
    <div className="space-y-6">
      <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="
    relative overflow-hidden rounded-3xl
    border border-cyan-400/10
    bg-white/5
    backdrop-blur-2xl
    p-8 shadow-2xl
  "
>
  {/* Glow Effect */}
  <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />
  <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />

  <div className="relative z-10">
    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
      FinTrack AI Assistant
    </p>
<FinTrackAIChat
  totalIncome={totalIncome}
  totalExpense={totalExpense}
  savings={savings}
/>
    <h1 className="mt-3 text-4xl font-bold tracking-tight">
      Welcome Back 👋
    </h1>

    <p className="mt-4 max-w-2xl text-white/70">
      Your savings are improving steadily this month.
      AI predicts stable financial growth if current spending habits continue.
    </p>

    <div className="mt-6 flex flex-wrap gap-3">
      <div className="rounded-2xl bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 border border-emerald-400/10">
        Savings Trend: Positive
      </div>

      <div className="rounded-2xl bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 border border-cyan-400/10">
        AI Risk Level: Low
      </div>

      <div className="rounded-2xl bg-violet-500/10 px-4 py-2 text-sm text-violet-300 border border-violet-400/10">
        Forecast: Stable
      </div>
    </div>
  </div>
</motion.div>
      {isSummaryError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Failed to load dashboard summary.
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          title="Total Balance"
          value={formatCurrency(totalBalance)}
          subtitle="Live from backend"
          subtitleColor="text-emerald-400"
          loading={isSummaryLoading}
        />
        <StatCard
          title="Income"
          value={formatCurrency(totalIncome)}
          subtitle="Live from backend"
          subtitleColor="text-cyan-400"
          loading={isSummaryLoading}
        />
        <StatCard
          title="Expenses"
          value={formatCurrency(totalExpense)}
          subtitle="Live from backend"
          subtitleColor="text-amber-400"
          loading={isSummaryLoading}
        />
        <StatCard
          title="Savings"
          value={formatCurrency(savings)}
          subtitle="Live from backend"
          subtitleColor="text-violet-400"
          loading={isSummaryLoading}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.45 }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <GlassCard className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/50">Risk Analysis</p>
              <h3 className="mt-1 text-lg font-semibold">Financial Risk</h3>
            </div>
            <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-3xl font-bold">{riskScore}</p>
            <p className="mt-2 text-sm text-white/60">
              Risk level: <span className="font-medium text-white">{riskLevel}</span>
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/50">Prediction</p>
              <h3 className="mt-1 text-lg font-semibold">Next Month Expense</h3>
            </div>
            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
              <Brain className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5">
            <p className="text-3xl font-bold">
              {formatCurrency(predictedExpense)}
            </p>
            <p className="mt-2 text-sm text-white/60">
              Estimated from your recent monthly expense trend
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-white/50">Monthly Change</p>
              <h3 className="mt-1 text-lg font-semibold">Expense Momentum</h3>
            </div>
            <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-300">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5">
            <p
              className={`text-3xl font-bold ${
                Number(expenseChange) > 0 ? "text-red-400" : "text-green-400"
              }`}
            >
              {Number(expenseChange) > 0 ? "+" : ""}
              {expenseChange}%
            </p>
            <p className="mt-2 text-sm text-white/60">
              Compared with previous active month
            </p>
          </div>
        </GlassCard>
      </motion.div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MonthlyTrendChart
            data={monthlyData}
            loading={monthlyQuery.isLoading}
          />
        </div>

        <CategoryDonutChart
  data={categoryData}
  
  
/>

        <ExpenseHeatmap />

       <HealthScoreRing />
        <BudgetProgress />

        <GlassCard className="p-6 xl:col-span-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            <p className="text-sm text-white/50">Smart Insights</p>
          </div>

          <h3 className="mt-1 text-lg font-semibold">This Month</h3>

          <div className="mt-4 space-y-3">
            {insightsLoading ? (
              <div className="rounded-2xl border border-white/8 bg-white/6 p-4 text-sm text-white/75">
               <div className="rounded-2xl border border-white/8 bg-white/6 p-4 text-sm text-white/75 animate-pulse">
  Loading smart insights...
</div>
              </div>
            ) : smartInsights.length === 0 ? (
              <div className="rounded-2xl border border-white/8 bg-white/6 p-4 text-sm text-white/75">
               <div className="rounded-2xl border border-white/8 bg-white/6 p-4 text-center">
  <p className="text-white/70 text-sm">No insights yet</p>
  <p className="text-white/40 text-xs mt-1">
    Add more transactions to generate smart insights
  </p>
</div>
              </div>
            ) : (
              smartInsights.map((text, index) => (
                <motion.div
                  key={`${text}-${index}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl border border-white/8 bg-white/6 p-4 text-sm text-white/75"
                >
                  {text}
                </motion.div>
              ))
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}