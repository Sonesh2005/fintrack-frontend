import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Pencil, Receipt, Calendar, Filter } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useExpensesData from "../features/expenses/useExpensesData";
import GlassCard from "../components/ui/GlassCard";
import formatCurrency from "../utils/formatCurrency";

const COLORS = ["#22d3ee", "#a78bfa", "#f59e0b", "#34d399", "#3b82f6", "#f472b6"];

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

export default function ExpensesPage() {
  const {
    expensesQuery,
    totalExpensesQuery,
    monthlyExpenseQuery,
    addExpenseMutation,
    updateExpenseMutation,
    deleteExpenseMutation,
    filteredExpenses,
    categories,
    categoryBreakdown,
    selectedCategory,
    setSelectedCategory,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
  } = useExpensesData();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });

  const [editingId, setEditingId] = useState(null);

  const totalCount = filteredExpenses.length;
  const totalAmount = useMemo(
    () => filteredExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [filteredExpenses]
  );

  const topCategory = useMemo(() => {
    if (!categoryBreakdown.length) return "—";
    return [...categoryBreakdown].sort((a, b) => b.value - a.value)[0].name;
  }, [categoryBreakdown]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
    };

    if (editingId) {
      updateExpenseMutation.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => {
            setEditingId(null);
            setForm({ title: "", amount: "", category: "", date: "" });
          },
        }
      );
    } else {
      addExpenseMutation.mutate(payload, {
        onSuccess: () => {
          setForm({ title: "", amount: "", category: "", date: "" });
        },
      });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
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
          <h1 className="text-3xl font-semibold tracking-tight">Expenses</h1>
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
                <option
                  key={month}
                  value={index + 1}
                  className="bg-slate-900"
                >
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
            <p className="text-sm text-white/50">Filtered Expenses</p>
            <h3 className="mt-3 text-3xl font-bold">{formatCurrency(totalAmount)}</h3>
            <p className="mt-2 text-sm text-amber-400">For selected month/category</p>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <p className="text-sm text-white/50">Total Entries</p>
            <h3 className="mt-3 text-3xl font-bold">{totalCount}</h3>
            <p className="mt-2 text-sm text-cyan-400">Visible transactions</p>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <p className="text-sm text-white/50">Monthly Total</p>
            <h3 className="mt-3 text-3xl font-bold">
              {formatCurrency(monthlyExpenseQuery.data ?? 0)}
            </h3>
            <p className="mt-2 text-sm text-violet-400">Live from backend</p>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <p className="text-sm text-white/50">Top Category</p>
            <h3 className="mt-3 text-3xl font-bold">{topCategory}</h3>
            <p className="mt-2 text-sm text-emerald-400">Highest spend bucket</p>
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
              <p className="text-sm text-white/50">Expense Form</p>
              <h3 className="text-lg font-semibold">
                {editingId ? "Update Expense" : "Add Expense"}
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Expense title"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
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

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
              required
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                {editingId
                  ? updateExpenseMutation.isPending
                    ? "Updating..."
                    : "Update Expense"
                  : addExpenseMutation.isPending
                  ? "Adding..."
                  : "Add Expense"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ title: "", amount: "", category: "", date: "" });
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
          <p className="text-sm text-white/50">Category Analytics</p>
          <h3 className="text-lg font-semibold">Expense Breakdown</h3>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
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
              {categoryBreakdown.length === 0 ? (
                <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/50">
                  No expense data for the selected filters.
                </div>
              ) : (
                categoryBreakdown.map((item, index) => (
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
            <Receipt size={18} />
          </div>
          <div>
            <p className="text-sm text-white/50">Transaction Table</p>
            <h3 className="text-lg font-semibold">Expense Records</h3>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-sm text-white/40">
                <th className="pb-2">Title</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Amount</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {expensesQuery.isLoading ? (
                [...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td colSpan={5}>
                      <div className="h-16 animate-pulse rounded-2xl bg-white/5" />
                    </td>
                  </tr>
                ))
              ) : filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="rounded-2xl bg-white/5 p-6 text-center text-sm text-white/50">
                      No expenses found for the selected filters.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((item) => (
                  <tr key={item.id}>
                    <td colSpan={5} className="p-0">
                      <div className="grid grid-cols-5 items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/[0.07]">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-white/70">{item.category}</div>
                        <div className="text-white/70">{formatDate(item.date)}</div>
                        <div className="font-semibold text-amber-400">
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
                            onClick={() => deleteExpenseMutation.mutate(item.id)}
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