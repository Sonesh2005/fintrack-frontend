import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import GlassCard from "../ui/GlassCard";


const COLORS = ["#22d3ee", "#a78bfa", "#f59e0b", "#34d399"];

export default function CategoryDonutChart({
  data = [],
}) {
  return (
    <GlassCard className="p-6">
      <p className="text-sm text-white/50">Category Spending</p>
      <h3 className="text-lg font-semibold">Expense Breakdown</h3>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#121a30",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                color: "white",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}