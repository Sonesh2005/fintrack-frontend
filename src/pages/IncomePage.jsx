import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, Wallet, Calendar, Filter } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useIncomeData from "../features/income/useIncomeData";
import GlassCard from "../components/ui/GlassCard";
import formatCurrency from "../utils/formatCurrency";

const COLORS = ["#22d3ee", "#34d399", "#a78bfa", "#3b82f6", "#f59e0b", "#f472b6"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function IncomePage() {
  const {
    incomesQuery,
    monthlyIncomeQuery,
    addIncomeMutation,
    updateIncomeMutation,
    deleteIncomeMutation,
    filteredIncomes,
    categories,
    sourceBreakdown,
    selectedCategory,
    setSelectedCategory,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
  } = useIncomeData();

  const [form, setForm] = useState({
    source: "",
    amount: "",
    category: "",
    date: "",
  });

  const [editingId, setEditingId] = useState(null);

  const totalCount = filteredIncomes.length;
  const totalAmount = useMemo(
    () => filteredIncomes.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [filteredIncomes]
  );

  const topSource = useMemo(() => {
    if (!sourceBreakdown.length) return "—";
    return [...sourceBreakdown].sort((a, b) => b.value - a.value)[0].name;
  }, [sourceBreakdown]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      source: form.source,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
    };

    if (editingId) {
      updateIncomeMutation.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => {
            setEditingId(null);
            setForm({ source: "", amount: "", category: "", date: "" });
          },
        }
      );
    } else {
      addIncomeMutation.mutate(payload, {
        onSuccess: () => {
          setForm({ source: "", amount: "", category: "", date: "" });
        },
      });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      source: item.source || "",
      amount: item.amount || "",
      category: item.category || "",
      date: item.date || "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm text-white/50">Financial Operations</p>
          <h1 className="text-3xl font-semibold tracking-tight">Income</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/70">
            <Filter size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-sm outline-none"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-slate-900">
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/70">
            <Calendar size={16} />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-transparent text-sm outline-none"
            >
              {monthNames.map((month, index) => (
                <option key={month} value={index + 1} className="bg-slate-900">
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/70">
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-24 bg-transparent text-sm outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <p className="text-sm text-white/50">Filtered Income</p>
            <h3 className="mt-3 text-3xl font-bold">{formatCurrency(totalAmount)}</h3>
            <p className="mt-2 text-sm text-cyan-400">For selected month/category</p>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <p className="text-sm text-white/50">Total Entries</p>
            <h3 className="mt-3 text-3xl font-bold">{totalCount}</h3>
            <p className="mt-2 text-sm text-emerald-400">Visible transactions</p>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <p className="text-sm text-white/50">Monthly Total</p>
            <h3 className="mt-3 text-3xl font-bold">
              {formatCurrency(monthlyIncomeQuery.data ?? 0)}
            </h3>
            <p className="mt-2 text-sm text-violet-400">Live from backend</p>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <p className="text-sm text-white/50">Top Source</p>
            <h3 className="mt-3 text-3xl font-bold">{topSource}</h3>
            <p className="mt-2 text-sm text-cyan-400">Highest income bucket</p>
          </GlassCard>
        </motion.div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard className="p-6 xl:col-span-1">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Plus size={18} />
            </div>
            <div>
              <p className="text-sm text-white/50">Income Form</p>
              <h3 className="text-lg font-semibold">
                {editingId ? "Update Income" : "Add Income"}
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Income source"
              value={form.source}
              onChange={(e) => setForm((prev) => ({ ...prev, source: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />

            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />

            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />

            <div className="space-y-2">
              <label className="text-sm text-white/50">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                {editingId
                  ? updateIncomeMutation.isPending
                    ? "Updating..."
                    : "Update Income"
                  : addIncomeMutation.isPending
                  ? "Adding..."
                  : "Add Income"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ source: "", amount: "", category: "", date: "" });
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </GlassCard>

        <GlassCard className="p-6 xl:col-span-2">
          <p className="text-sm text-white/50">Income Analytics</p>
          <h3 className="text-lg font-semibold">Source Breakdown</h3>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceBreakdown}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {sourceBreakdown.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      background: "#121a30",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      color: "white",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {sourceBreakdown.length === 0 ? (
                <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/50">
                  No income data for the selected filters.
                </div>
              ) : (
                sourceBreakdown.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl bg-white/5 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm text-white/80">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/8 p-3">
            <Wallet size={18} />
          </div>
          <div>
            <p className="text-sm text-white/50">Transaction Table</p>
            <h3 className="text-lg font-semibold">Income Records</h3>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-white/40">
                <th className="pb-2">Source</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {incomesQuery.isLoading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td colSpan={5}>
                      <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
                    </td>
                  </tr>
                ))
              ) : filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="rounded-2xl bg-white/5 p-6 text-center text-sm text-white/50">
                      No income records found for the selected filters.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((item) => (
                  <tr key={item.id}>
                    <td colSpan={5} className="p-0">
                      <div className="grid grid-cols-5 items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/[0.07]">
                        <div className="font-medium">{item.source}</div>
                        <div className="text-white/70">{item.category}</div>
                        <div className="text-white/70">{formatDate(item.date)}</div>
                        <div className="font-semibold text-cyan-400">
                          {formatCurrency(item.amount)}
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                          >
                            <Pencil size={16} />
                          </button>
                         <button
  onClick={() => {
    if (window.confirm(`Delete income "${item.source}"?`)) {
      deleteIncomeMutation.mutate(item.id, {
        onError: (error) => {
          console.error("Delete income failed:", error?.response?.data || error);
          alert("Delete failed. Check console/network.");
        },
      });
    }
  }}
  className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
>
  <Trash2 size={16} />
</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}