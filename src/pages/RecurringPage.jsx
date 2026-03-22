import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Repeat,
  Plus,
  Pencil,
  Trash2,
  BadgeIndianRupee,
  CalendarDays,
  TrendingUp,
  BellRing,
  Wallet,
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import formatCurrency from "../utils/formatCurrency";
import useRecurringData from "../features/recurring/useRecurringData";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getTypeBadge(type) {
  if (type === "INCOME") {
    return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
  }
  return "bg-amber-500/10 text-amber-400 border-amber-500/20";
}

function getFrequencyBadge(frequency) {
  switch (frequency) {
    case "WEEKLY":
      return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    case "YEARLY":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    default:
      return "bg-white/5 text-white/70 border-white/10";
  }
}

function resetRecurringForm() {
  return {
    title: "",
    amount: "",
    type: "EXPENSE",
    frequency: "MONTHLY",
    nextDueDate: "",
  };
}

export default function RecurringPage() {
  const {
    recurringQuery,
    createRecurringMutation,
    updateRecurringMutation,
    deleteRecurringMutation,
  } = useRecurringData();

  const items = recurringQuery.data || [];
  const isLoading = recurringQuery.isLoading;
  const isError = recurringQuery.isError;

  const [form, setForm] = useState(resetRecurringForm());
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      amount: Number(form.amount),
      category: form.type,
      frequency: form.frequency,
      startDate: form.nextDueDate,
    };

    if (!payload.title || payload.amount <= 0 || !payload.startDate) {
      alert("Please fill all fields correctly");
      return;
    }

    if (editingId) {
      updateRecurringMutation.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => {
            setEditingId(null);
            setForm(resetRecurringForm());
          },
          onError: (error) => {
            console.error("Update recurring failed:", error?.response?.data || error);
            alert("Update failed. Check console/network.");
          },
        }
      );
    } else {
      createRecurringMutation.mutate(payload, {
        onSuccess: () => {
          setForm(resetRecurringForm());
        },
        onError: (error) => {
          console.error("Create recurring failed:", error?.response?.data || error);
          alert("Create failed. Check console/network.");
        },
      });
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      amount: item.amount || "",
      type: item.category || "EXPENSE",
      frequency: item.frequency || "MONTHLY",
      nextDueDate: item.startDate || "",
    });
  };

  const handleDelete = (item) => {
    if (!window.confirm(`Delete recurring rule "${item.title || "this rule"}"?`)) {
      return;
    }

    deleteRecurringMutation.mutate(item.id, {
      onError: (error) => {
        console.error("Delete recurring failed:", error?.response?.data || error);
        alert("Delete failed. Check console/network.");
      },
    });
  };

  const incomeCount = items.filter((item) => item.category === "INCOME").length;
  const expenseCount = items.filter((item) => item.category !== "INCOME").length;

  const totalRecurringAmount = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [items]
  );

  const nextDueRule = useMemo(() => {
    const validItems = items
      .filter((item) => item.startDate)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

    return validItems.length > 0 ? validItems[0] : null;
  }, [items]);

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Failed to load recurring rules.
        </div>
      )}

      <div>
        <p className="text-sm text-white/50">Automation</p>
        <h1 className="text-3xl font-semibold tracking-tight">Recurring</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
                <Repeat size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Recurring Items</p>
                <h3 className="mt-1 text-3xl font-bold">{items.length}</h3>
                <p className="mt-2 text-sm text-cyan-400">Automation rules</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Configured</p>
                <h3 className="mt-1 text-3xl font-bold">{items.length}</h3>
                <p className="mt-2 text-sm text-emerald-400">Saved in backend</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400">
                <TrendingUp size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Income Rules</p>
                <h3 className="mt-1 text-3xl font-bold">{incomeCount}</h3>
                <p className="mt-2 text-sm text-cyan-400">Recurring income</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
                <BadgeIndianRupee size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Expense Rules</p>
                <h3 className="mt-1 text-3xl font-bold">{expenseCount}</h3>
                <p className="mt-2 text-sm text-amber-400">Recurring expenses</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-400">
                <BellRing size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Total Amount</p>
                <h3 className="mt-1 text-3xl font-bold">
                  {formatCurrency(totalRecurringAmount)}
                </h3>
                <p className="mt-2 text-sm text-violet-400">Rule total value</p>
              </div>
            </div>
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
              <p className="text-sm text-white/50">Recurring Form</p>
              <h3 className="text-lg font-semibold">
                {editingId ? "Update Rule" : "Create Rule"}
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />

            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, amount: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            >
              <option value="EXPENSE" className="bg-slate-900">
                EXPENSE
              </option>
              <option value="INCOME" className="bg-slate-900">
                INCOME
              </option>
            </select>

            <select
              value={form.frequency}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, frequency: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            >
              <option value="MONTHLY" className="bg-slate-900">
                MONTHLY
              </option>
              <option value="WEEKLY" className="bg-slate-900">
                WEEKLY
              </option>
              <option value="YEARLY" className="bg-slate-900">
                YEARLY
              </option>
            </select>

            <div className="space-y-2">
              <label className="text-sm text-white/50">Start Date</label>
              <input
                type="date"
                value={form.nextDueDate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, nextDueDate: e.target.value }))
                }
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
                  ? updateRecurringMutation.isPending
                    ? "Updating..."
                    : "Update Rule"
                  : createRecurringMutation.isPending
                  ? "Creating..."
                  : "Create Rule"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(resetRecurringForm());
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-white/50">Next Due Rule</p>
            <p className="mt-2 text-lg font-semibold">
              {nextDueRule ? nextDueRule.title : "No upcoming rule"}
            </p>
            <p className="mt-1 text-sm text-white/60">
              {nextDueRule ? formatDate(nextDueRule.startDate) : "—"}
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Repeat size={18} />
            </div>
            <div>
              <p className="text-sm text-white/50">Automation Table</p>
              <h3 className="text-lg font-semibold">Recurring Rules</h3>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-2xl bg-white/5"
                />
              ))
            ) : items.length === 0 ? (
              <div className="rounded-2xl bg-white/5 p-6 text-center text-sm text-white/50">
                No recurring rules created yet.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="grid items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1.4fr_0.8fr_0.9fr_1fr_0.7fr_auto]"
                >
                  <div>
                    <p className="font-medium">
                      {item.title || "Untitled Rule"}
                    </p>
                    <p className="mt-1 text-sm text-white/50">
                      {formatCurrency(item.amount)}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-2xl border px-3 py-1 text-xs font-medium ${getTypeBadge(
                        item.category || "EXPENSE"
                      )}`}
                    >
                      {item.category || "EXPENSE"}
                    </span>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-2xl border px-3 py-1 text-xs font-medium ${getFrequencyBadge(
                        item.frequency || "MONTHLY"
                      )}`}
                    >
                      {item.frequency || "MONTHLY"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <CalendarDays size={14} />
                    {formatDate(item.startDate)}
                  </div>

                  <div>
                    <span className="inline-flex rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/50">
                      ENABLED
                    </span>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <BadgeIndianRupee size={18} className="text-cyan-400" />
            <div>
              <p className="text-sm text-white/50">Automation Tip</p>
              <h3 className="text-base font-semibold">Use recurring salary</h3>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/60">
            Add monthly salary as recurring income to keep forecasts and charts realistic.
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <Repeat size={18} className="text-amber-400" />
            <div>
              <p className="text-sm text-white/50">Expense Automation</p>
              <h3 className="text-base font-semibold">Track bills easily</h3>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/60">
            Add rent, EMI, subscriptions, and utilities once and reuse them every cycle.
          </p>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center gap-3">
            <CalendarDays size={18} className="text-violet-400" />
            <div>
              <p className="text-sm text-white/50">Planning Benefit</p>
              <h3 className="text-base font-semibold">Better budgeting</h3>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/60">
            Recurring rules improve budget planning, insights, and future monthly projections.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}