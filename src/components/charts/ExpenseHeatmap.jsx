import GlassCard from "../ui/GlassCard";

const generateMockData = () => {
  const data = [];
  for (let i = 0; i < 35; i++) {
    data.push(Math.floor(Math.random() * 5));
  }
  return data;
};

const heatmap = generateMockData();

const colors = [
  "bg-[#0b1326]",     // none
  "bg-[#1f2a44]",     // low
  "bg-[#2563eb]",     // medium
  "bg-[#06b6d4]",     // high
  "bg-[#22d3ee]",     // very high
];

export default function ExpenseHeatmap() {
  return (
    <GlassCard className="p-6">
      <p className="text-sm text-white/50">Spending Activity</p>
      <h3 className="text-lg font-semibold">Expense Heatmap</h3>

      <div className="mt-6 grid grid-cols-7 gap-2">
        {heatmap.map((value, index) => (
          <div
            key={index}
            className={`h-7 w-7 rounded-lg ${colors[value]} transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20`}
          />
        ))}
      </div>

     <div className="mt-4 flex items-center gap-2 text-xs text-white/50">
  <span>Low</span>
  <div className="h-3 w-3 bg-[#0b1326] rounded-sm" />
  <div className="h-3 w-3 bg-[#1f2a44] rounded-sm" />
  <div className="h-3 w-3 bg-[#2563eb] rounded-sm" />
  <div className="h-3 w-3 bg-[#06b6d4] rounded-sm" />
  <div className="h-3 w-3 bg-[#22d3ee] rounded-sm" />
  <span>High</span>
</div>
    </GlassCard>
  );
}