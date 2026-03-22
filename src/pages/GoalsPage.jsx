import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Target,
  Trophy,
  PiggyBank,
  TrendingUp,
  CircleDashed,
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import formatCurrency from "../utils/formatCurrency";
import useGoalsData from "../features/goals/useGoalsData";

function resetGoalForm() {
  return {
    title: "",
    targetAmount: "",
    savedAmount: "",
    category: "",
  };
}

function getGoalStatus(saved, target) {
  if (target <= 0) return "Not Set";
  if (saved >= target) return "Completed";
  if (saved >= target * 0.7) return "On Track";
  return "In Progress";
}

function getGoalStatusColor(status) {
  switch (status) {
    case "Completed":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "On Track":
      return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
    case "In Progress":
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    default:
      return "text-white/60 bg-white/5 border-white/10";
  }
}

export default function GoalsPage() {
  const {
    goalsQuery,
    createGoalMutation,
    updateGoalMutation,
    deleteGoalMutation,
  } = useGoalsData();

  const goals = goalsQuery.data || [];
  const isLoading = goalsQuery.isLoading;
  const isError = goalsQuery.isError;

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(resetGoalForm());

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      targetAmount: Number(form.targetAmount),
      savedAmount: Number(form.savedAmount || 0),
      category: form.category,
    };

    if (!payload.title || payload.targetAmount <= 0) {
      alert("Enter a valid goal title and target amount");
      return;
    }

    if (editingId) {
      updateGoalMutation.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => {
            setEditingId(null);
            setForm(resetGoalForm());
          },
        }
      );
    } else {
      createGoalMutation.mutate(payload, {
        onSuccess: () => {
          setForm(resetGoalForm());
        },
      });
    }
  };

  const handleEdit = (goal) => {
    setEditingId(goal.id);
    setForm({
      title: goal.title || "",
      targetAmount: goal.targetAmount || "",
      savedAmount: goal.savedAmount || "",
      category: goal.category || "",
    });
  };

  const handleDelete = (goal) => {
    if (!window.confirm(`Delete goal "${goal.title}"?`)) return;
    deleteGoalMutation.mutate(goal.id);
  };

  const totalTarget = useMemo(
    () => goals.reduce((sum, goal) => sum + Number(goal.targetAmount || 0), 0),
    [goals]
  );

  const totalSaved = useMemo(
    () => goals.reduce((sum, goal) => sum + Number(goal.savedAmount || 0), 0),
    [goals]
  );

  const completedGoals = useMemo(
    () =>
      goals.filter(
        (goal) => Number(goal.savedAmount || 0) >= Number(goal.targetAmount || 0)
      ).length,
    [goals]
  );

  const remainingAmount = Math.max(totalTarget - totalSaved, 0);
  const overallProgress =
    totalTarget > 0 ? Math.min((totalSaved / totalTarget) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Failed to load goals data.
        </div>
      )}

      <div>
        <p className="text-sm text-white/50">Savings Planning</p>
        <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
                <Target size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Total Goals</p>
                <h3 className="mt-1 text-3xl font-bold">{goals.length}</h3>
                <p className="mt-2 text-sm text-cyan-400">Tracked goals</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-400">
                <Trophy size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Target Amount</p>
                <h3 className="mt-1 text-3xl font-bold">
                  {formatCurrency(totalTarget)}
                </h3>
                <p className="mt-2 text-sm text-violet-400">Goal target total</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                <PiggyBank size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Saved Amount</p>
                <h3 className="mt-1 text-3xl font-bold">
                  {formatCurrency(totalSaved)}
                </h3>
                <p className="mt-2 text-sm text-emerald-400">Current progress</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
                <CircleDashed size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Remaining</p>
                <h3 className="mt-1 text-3xl font-bold">
                  {formatCurrency(remainingAmount)}
                </h3>
                <p className="mt-2 text-sm text-amber-400">Still needed</p>
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
                <p className="text-sm text-white/50">Completed</p>
                <h3 className="mt-1 text-3xl font-bold">{completedGoals}</h3>
                <p className="mt-2 text-sm text-blue-400">Finished goals</p>
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
              <p className="text-sm text-white/50">Goal Form</p>
              <h3 className="text-lg font-semibold">
                {editingId ? "Update Goal" : "Create Goal"}
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Goal title"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />

            <input
              type="number"
              placeholder="Target amount"
              value={form.targetAmount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, targetAmount: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />

            <input
              type="number"
              placeholder="Saved amount"
              value={form.savedAmount}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, savedAmount: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
            />

            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                {editingId
                  ? updateGoalMutation.isPending
                    ? "Updating..."
                    : "Update Goal"
                  : createGoalMutation.isPending
                  ? "Creating..."
                  : "Create Goal"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(resetGoalForm());
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-white/50">Overall Goal Progress</p>
            <p className="mt-2 text-2xl font-bold">{overallProgress.toFixed(0)}%</p>
            <div className="mt-3 h-3 w-full rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Target size={18} />
            </div>
            <div>
              <p className="text-sm text-white/50">Goals Overview</p>
              <h3 className="text-lg font-semibold">Savings Progress</h3>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {isLoading ? (
              [...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl bg-white/5"
                />
              ))
            ) : goals.length === 0 ? (
              <div className="rounded-2xl bg-white/5 p-6 text-center text-sm text-white/50">
                No goals created yet.
              </div>
            ) : (
              goals.map((goal) => {
                const target = Number(goal.targetAmount || 0);
                const saved = Number(goal.savedAmount || 0);
                const progress =
                  target > 0 ? Math.min((saved / target) * 100, 100) : 0;

                const status = getGoalStatus(saved, target);

                return (
                  <div
                    key={goal.id}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-semibold">{goal.title}</h4>
                        <p className="mt-1 text-sm text-white/50">
                          {goal.category || "General"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-xl border px-3 py-1 text-xs font-medium ${getGoalStatusColor(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                        <button
                          onClick={() => handleEdit(goal)}
                          className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(goal)}
                          className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-white/60">
                      <span>Saved {formatCurrency(saved)}</span>
                      <span>Target {formatCurrency(target)}</span>
                    </div>

                    <div className="mt-3 h-3 w-full rounded-full bg-white/10">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          status === "Completed"
                            ? "bg-gradient-to-r from-emerald-400 to-green-500"
                            : status === "On Track"
                            ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                            : "bg-gradient-to-r from-amber-400 to-orange-500"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-white/50">
                        {progress.toFixed(0)}% completed
                      </span>
                      <span className="text-sm text-white/60">
                        Remaining {formatCurrency(Math.max(target - saved, 0))}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}