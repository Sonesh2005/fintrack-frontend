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

  return (
    <GlassCard className="p-6">
      <p className="text-sm text-white/50">Financial Health</p>
      <h3 className="text-lg font-semibold">Health Score</h3>

      <div className="mt-6 h-56">
        {summaryQuery.isLoading || alertsQuery.isLoading ? (
          <div className="flex h-full items-center justify-center rounded-2xl bg-white/5 text-sm text-white/50">
            Calculating...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={58}
                outerRadius={82}
                startAngle={90}
                endAngle={-270}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#22d3ee" />
                <Cell fill="rgba(255,255,255,0.10)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )}

        {!summaryQuery.isLoading && !alertsQuery.isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-none -mt-36 flex flex-col items-center justify-center"
          >
            <p className="text-4xl font-bold">{score}</p>
            <p className="text-sm text-white/50">Health Score</p>
          </motion.div>
        )}
      </div>

      <div className="mt-2 rounded-2xl bg-white/5 p-4 text-sm text-white/65">
        {summaryQuery.isLoading || alertsQuery.isLoading
          ? "Loading health insights..."
          : message}
      </div>
    </GlassCard>
  );
}