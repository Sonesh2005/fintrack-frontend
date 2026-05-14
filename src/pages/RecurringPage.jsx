import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

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
  Sparkles,
  Brain,
  Clock3,
} from "lucide-react";

import GlassCard from "../components/ui/GlassCard";
import formatCurrency from "../utils/formatCurrency";
import useRecurringData from "../features/recurring/useRecurringData";

function formatDate(value) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function getTypeBadge(type) {
  if (type === "INCOME") {
    return "bg-cyan-500/10 text-cyan-300 border-cyan-500/20";
  }

  return "bg-amber-500/10 text-amber-300 border-amber-500/20";
}

function getFrequencyBadge(frequency) {
  switch (frequency) {
    case "WEEKLY":
      return "bg-violet-500/10 text-violet-300 border-violet-500/20";

    case "YEARLY":
      return "bg-blue-500/10 text-blue-300 border-blue-500/20";

    default:
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  }
}

function getCardGradient(type) {
  if (type === "INCOME") {
    return "from-cyan-500/10 to-blue-500/10";
  }

  return "from-amber-500/10 to-orange-500/10";
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

  const isLoading =
    recurringQuery.isLoading;

  const isError =
    recurringQuery.isError;

  const [form, setForm] = useState(
    resetRecurringForm()
  );

  const [editingId, setEditingId] =
    useState(null);

  const incomeCount = items.filter(
    (item) =>
      item.category === "INCOME"
  ).length;

  const expenseCount = items.filter(
    (item) =>
      item.category !== "INCOME"
  ).length;

  const totalRecurringAmount =
    useMemo(
      () =>
        items.reduce(
          (sum, item) =>
            sum +
            Number(item.amount || 0),
          0
        ),
      [items]
    );

  const nextDueRule = useMemo(() => {
    const validItems = items
      .filter(
        (item) => item.startDate
      )
      .sort(
        (a, b) =>
          new Date(a.startDate) -
          new Date(b.startDate)
      );

    return validItems.length > 0
      ? validItems[0]
      : null;
  }, [items]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      amount: Number(form.amount),
      category: form.type,
      frequency: form.frequency,
      startDate: form.nextDueDate,
    };

    if (
      !payload.title ||
      payload.amount <= 0 ||
      !payload.startDate
    ) {
      toast.error(
        "Fill all fields correctly"
      );

      return;
    }

    if (editingId) {
      updateRecurringMutation.mutate(
        {
          id: editingId,
          payload,
        },
        {
          onSuccess: () => {
            toast.success(
              "Recurring rule updated"
            );

            setEditingId(null);

            setForm(
              resetRecurringForm()
            );
          },
        }
      );
    } else {
      createRecurringMutation.mutate(
        payload,
        {
          onSuccess: () => {
            toast.success(
              "Recurring rule created"
            );

            setForm(
              resetRecurringForm()
            );
          },
        }
      );
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      title: item.title || "",
      amount: item.amount || "",
      type:
        item.category ||
        "EXPENSE",
      frequency:
        item.frequency ||
        "MONTHLY",
      nextDueDate:
        item.startDate || "",
    });
  };

  const handleDelete = (item) => {
    if (
      !window.confirm(
        `Delete "${item.title}"?`
      )
    ) {
      return;
    }

    deleteRecurringMutation.mutate(
      item.id,
      {
        onSuccess: () => {
          toast.success(
            "Recurring rule deleted"
          );
        },
      }
    );
  };

  return (
    <div className="relative space-y-8 overflow-hidden">

      {/* BACKGROUND GLOW */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[140px]" />

        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-purple-500/10 blur-[140px]" />

      </div>

      {/* ERROR */}

      {isError && (

        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          Failed to load recurring rules.
        </div>

      )}

      {/* HEADER */}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <p className="text-sm text-cyan-400">
            Smart Automation
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white">
            Recurring Center
          </h1>

        </div>

        <div className="hidden md:flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3">

          <Sparkles
            className="text-cyan-400"
            size={18}
          />

          <span className="text-sm text-cyan-200">
            AI optimized recurring automation
          </span>

        </div>

      </div>

      {/* STATS */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Recurring Rules"
          value={items.length}
          subtitle="Automation rules"
          icon={<Repeat size={20} />}
          color="cyan"
        />

        <StatCard
          title="Income Rules"
          value={incomeCount}
          subtitle="Recurring income"
          icon={<TrendingUp size={20} />}
          color="blue"
        />

        <StatCard
          title="Expense Rules"
          value={expenseCount}
          subtitle="Recurring expenses"
          icon={
            <BadgeIndianRupee
              size={20}
            />
          }
          color="amber"
        />

        <StatCard
          title="Total Value"
          value={formatCurrency(
            totalRecurringAmount
          )}
          subtitle="Rule total"
          icon={<Wallet size={20} />}
          color="emerald"
        />

        <StatCard
          title="Next Due"
          value={
            nextDueRule
              ? formatDate(
                  nextDueRule.startDate
                )
              : "—"
          }
          subtitle={
            nextDueRule
              ? nextDueRule.title
              : "No rule"
          }
          icon={<Clock3 size={20} />}
          color="purple"
        />

      </div>

      {/* MAIN GRID */}

      <div className="grid gap-6 xl:grid-cols-3">

        {/* FORM */}

        <GlassCard className="border border-cyan-500/10 bg-white/[0.03] p-7 shadow-[0_0_40px_rgba(0,255,255,0.05)]">

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
              <Plus size={18} />
            </div>

            <div>

              <p className="text-sm text-white/50">
                Automation Form
              </p>

              <h3 className="text-lg font-semibold text-white">

                {editingId
                  ? "Update Rule"
                  : "Create Rule"}

              </h3>

            </div>

          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-4"
          >

            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  title:
                    e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30"
              required
            />

            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  amount:
                    e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30"
              required
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type:
                    e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-[#111827] text-white px-5 py-4 outline-none"
            >

              <option
                value="EXPENSE"
                className="bg-[#111827] text-white"
              >
                EXPENSE
              </option>

              <option
                value="INCOME"
                className="bg-[#111827] text-white"
              >
                INCOME
              </option>

            </select>

            <select
              value={form.frequency}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  frequency:
                    e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-[#111827] text-white px-5 py-4 outline-none"
            >

              <option
                value="MONTHLY"
                className="bg-[#111827] text-white"
              >
                MONTHLY
              </option>

              <option
                value="WEEKLY"
                className="bg-[#111827] text-white"
              >
                WEEKLY
              </option>

              <option
                value="YEARLY"
                className="bg-[#111827] text-white"
              >
                YEARLY
              </option>

            </select>

            <input
              type="date"
              value={form.nextDueDate}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  nextDueDate:
                    e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
              required
            />

            <div className="flex gap-3">

              <button
                type="submit"
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 px-5 py-4 font-semibold text-white transition hover:scale-[1.01]"
              >

                {editingId
                  ? "Update Rule"
                  : "Create Rule"}

              </button>

              {editingId && (

                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);

                    setForm(
                      resetRecurringForm()
                    );
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4"
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </GlassCard>

        {/* RULES */}

        <div className="space-y-5 xl:col-span-2">

          {isLoading ? (

            [...Array(5)].map(
              (_, index) => (

                <div
                  key={index}
                  className="h-40 animate-pulse rounded-3xl bg-white/5"
                />

              )
            )

          ) : items.length === 0 ? (

            <GlassCard className="flex flex-col items-center justify-center p-16 text-center">

              <div className="rounded-full bg-cyan-500/10 p-8">

                <Repeat
                  size={50}
                  className="text-cyan-400"
                />

              </div>

              <h2 className="mt-6 text-3xl font-bold">
                No Recurring Rules
              </h2>

              <p className="mt-3 max-w-md text-white/50">
                Create smart recurring automations for salary, bills, subscriptions, EMI, and more.
              </p>

            </GlassCard>

          ) : (

            items.map((item) => (

              <motion.div
                key={item.id}
                whileHover={{
                  y: -5,
                }}
              >

                <GlassCard
                  className={`relative overflow-hidden border border-white/10 bg-gradient-to-br ${getCardGradient(
                    item.category
                  )} p-6`}
                >

                  <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

                  <div className="relative z-10">

                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                      <div>

                        <div className="flex items-center gap-3">

                          <h3 className="text-2xl font-bold text-white">

                            {item.title}

                          </h3>

                          <span
                            className={`inline-flex rounded-2xl border px-3 py-1 text-xs font-semibold ${getTypeBadge(
                              item.category
                            )}`}
                          >

                            {item.category}

                          </span>

                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">

                          <span
                            className={`inline-flex rounded-2xl border px-3 py-1 text-xs font-semibold ${getFrequencyBadge(
                              item.frequency
                            )}`}
                          >

                            {item.frequency}

                          </span>

                          <div className="flex items-center gap-2 text-sm text-white/60">

                            <CalendarDays size={15} />

                            {formatDate(
                              item.startDate
                            )}

                          </div>

                        </div>

                      </div>

                      <div className="text-right">

                        <p className="text-sm text-white/50">
                          Recurring Amount
                        </p>

                        <h2 className="mt-2 text-4xl font-black text-white">

                          {formatCurrency(
                            item.amount
                          )}

                        </h2>

                      </div>

                    </div>

                    <div className="mt-8 flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        <span className="inline-flex rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">

                          ENABLED

                        </span>

                        <div className="flex items-center gap-2 text-sm text-cyan-300">

                          <BellRing
                            size={15}
                          />

                          Smart automation active

                        </div>

                      </div>

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            handleEdit(
                              item
                            )
                          }
                          className="rounded-2xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                        >

                          <Pencil
                            size={17}
                          />

                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              item
                            )
                          }
                          className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-300 transition hover:bg-red-500/20"
                        >

                          <Trash2
                            size={17}
                          />

                        </button>

                      </div>

                    </div>

                  </div>

                </GlassCard>

              </motion.div>

            ))

          )}

        </div>

      </div>

      {/* AI INSIGHTS */}

      <div className="grid gap-5 md:grid-cols-3">

        <InsightCard
          icon={
            <Brain
              size={18}
              className="text-cyan-300"
            />
          }
          title="AI Forecast"
          description="Your recurring expenses may increase 8% next month."
        />

        <InsightCard
          icon={
            <Sparkles
              size={18}
              className="text-purple-300"
            />
          }
          title="Optimization"
          description="Cancel unused subscriptions to save more monthly."
        />

        <InsightCard
          icon={
            <TrendingUp
              size={18}
              className="text-emerald-300"
            />
          }
          title="Planning Benefit"
          description="Recurring automation improves long-term budgeting accuracy."
        />

      </div>

    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}) {
  const colors = {
    cyan:
      "bg-cyan-500/10 text-cyan-300",
    blue: "bg-blue-500/10 text-blue-300",
    amber:
      "bg-amber-500/10 text-amber-300",
    emerald:
      "bg-emerald-500/10 text-emerald-300",
    purple:
      "bg-purple-500/10 text-purple-300",
  };

  return (
    <motion.div
      whileHover={{
        y: -5,
      }}
    >

      <GlassCard className="border border-cyan-500/10 bg-white/[0.03] p-6">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-white/50">
              {title}
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              {value}
            </h2>

            <p className="mt-3 text-sm text-white/50">
              {subtitle}
            </p>

          </div>

          <div
            className={`rounded-3xl p-4 ${colors[color]}`}
          >
            {icon}
          </div>

        </div>

      </GlassCard>

    </motion.div>
  );
}

function InsightCard({
  icon,
  title,
  description,
}) {
  return (
    <GlassCard className="border border-cyan-500/10 bg-white/[0.03] p-6">

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-white/5 p-3">
          {icon}
        </div>

        <div>

          <p className="font-semibold text-white">
            {title}
          </p>

          <p className="mt-1 text-sm text-white/50">
            AI powered
          </p>

        </div>

      </div>

      <p className="mt-5 leading-7 text-white/70">
        {description}
      </p>

    </GlassCard>
  );
}