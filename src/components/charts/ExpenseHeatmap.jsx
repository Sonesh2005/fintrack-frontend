import { useState } from "react";
import GlassCard from "../ui/GlassCard";
import useExpensesData from "../../features/expenses/useExpensesData";

const colors = [
  "bg-[#0b1326]",
  "bg-[#1f2a44]",
  "bg-[#2563eb]",
  "bg-[#06b6d4]",
  "bg-[#22d3ee]",
];

export default function ExpenseHeatmap() {
  const { expensesQuery } = useExpensesData();

  const expenses = expensesQuery.data || [];

  const [tooltip, setTooltip] = useState(null);

  const daysInMonth = new Date(2026, 5, 0).getDate();

  const dailyTotals = {};

  expenses.forEach((item) => {
    const date = new Date(item.date);
    const day = date.getDate();

    dailyTotals[day] = (dailyTotals[day] || 0) + Number(item.amount);
  });

  const maxSpend = Math.max(...Object.values(dailyTotals), 1);

  const heatmap = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const amount = dailyTotals[day] || 0;

    let level = 0;

    if (amount > 0) {
      const ratio = amount / maxSpend;

      if (ratio <= 0.25) level = 1;
      else if (ratio <= 0.5) level = 2;
      else if (ratio <= 0.75) level = 3;
      else level = 4;
    }

    heatmap.push({
      day,
      amount,
      level,
    });
  }

  return (
    <GlassCard className="p-6 relative">
      <p className="text-sm text-white/50">Spending Activity</p>
      <h3 className="text-lg font-semibold">Expense Heatmap</h3>

      <div className="mt-6 grid grid-cols-7 gap-2">
        {heatmap.map((item, index) => (
          <div
            key={index}
            onMouseEnter={() => setTooltip(item)}
            onMouseLeave={() => setTooltip(null)}
            className={`h-7 w-7 rounded-lg ${colors[item.level]} transition-all duration-200 hover:scale-110 cursor-pointer`}
          />
        ))}
      </div>

      {tooltip && (
        <div className="absolute top-4 right-4 rounded-xl bg-[#111827] border border-cyan-400/20 px-4 py-3 shadow-xl text-sm z-50">
          <p className="text-cyan-400 font-semibold">
            {tooltip.day} May 2026
          </p>
          <p className="text-white/70 mt-1">
            ₹{tooltip.amount.toLocaleString()}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
        <span>Low</span>

        {colors.map((color, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-sm ${color}`}
          />
        ))}

        <span>High</span>
      </div>
    </GlassCard>
  );
}