import GlassCard from "./GlassCard";

export default function BudgetProgress() {
  const budget = 25000;
  const spent = 18700;

  const percent = Math.round((spent / budget) * 100);

  return (
    <GlassCard className="p-6">
      <p className="text-sm text-white/50">Monthly Budget</p>
      <h3 className="text-lg font-semibold">₹{budget}</h3>

      <div className="mt-4">
        <div className="h-3 w-full rounded-full bg-white/10">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-3 flex justify-between text-sm text-white/60">
          <span>Spent ₹{spent}</span>
          <span>{percent}% used</span>
        </div>
      </div>
    </GlassCard>
  );
}