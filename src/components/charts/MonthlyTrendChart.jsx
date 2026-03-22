import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import GlassCard from "../ui/GlassCard";

export default function MonthlyTrendChart({ data = [], loading = false }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50">Analytics</p>
          <h3 className="text-lg font-semibold">Monthly Trend</h3>
        </div>
        <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-white/60">
          Income vs Expense
        </span>
      </div>

      <div className="mt-6 h-72">
        {loading ? (
          <div className="h-full w-full animate-pulse rounded-2xl bg-white/5" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" />
              <YAxis stroke="rgba(255,255,255,0.45)" />
              <Tooltip
                contentStyle={{
                  background: "#121a30",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  color: "white",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#22d3ee"
                fill="url(#incomeFill)"
                strokeWidth={3}
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#a78bfa"
                fill="url(#expenseFill)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </GlassCard>
  );
}