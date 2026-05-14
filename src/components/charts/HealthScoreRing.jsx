import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import GlassCard from "../ui/GlassCard";
import useDashboardData from "../../features/dashboard/useDashboardData";
import useBudgetData from "../../features/budget/useBudgetData";
import calculateFinancialHealth from "../../utils/calculateFinancialHealth";

export default function HealthScoreRing() {
  const { summaryQuery } = useDashboardData();
  const { alertsQuery } = useBudgetData();

  const summary = summaryQuery.data || {};
  const alerts = alertsQuery.data || {};

  const { score, message } = calculateFinancialHealth(summary, alerts);

  const chartData = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const isLoading = summaryQuery.isLoading || alertsQuery.isLoading;

  return (
    <GlassCard className="p-6">
      <p className="text-sm text-white/50">Financial Health</p>
      <h3 className="text-lg font-semibold">Health Score</h3>

      <div className="mt-6 relative h-[260px] min-w-0 flex items-center justify-center">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/5 text-sm text-white/50">
            Calculating...
          </div>
        ) : (
          <>
            <ResponsiveContainer width="99%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#22d3ee" />
                  <Cell fill="rgba(255,255,255,0.10)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Center Score Text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <p className="text-4xl font-bold text-white">{score}</p>
              <p className="text-sm text-white/50">Health Score</p>
            </motion.div>
          </>
        )}
      </div>

      <div className="mt-3 rounded-2xl bg-white/5 p-4 text-sm text-white/65">
        {isLoading ? "Loading health insights..." : message}
      </div>
    </GlassCard>
  );
}