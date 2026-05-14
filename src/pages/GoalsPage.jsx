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
  Sparkles,
  Brain,
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
      return "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";

    case "On Track":
      return "text-cyan-300 bg-cyan-500/10 border-cyan-500/20";

    case "In Progress":
      return "text-amber-300 bg-amber-500/10 border-amber-500/20";

    default:
      return "text-white/60 bg-white/5 border-white/10";
  }
}

function getProgressGradient(status) {
  switch (status) {
    case "Completed":
      return "bg-gradient-to-r from-emerald-400 to-cyan-400";

    case "On Track":
      return "bg-gradient-to-r from-cyan-400 to-purple-500";

    default:
      return "bg-gradient-to-r from-amber-400 to-orange-500";
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

  const [editingId, setEditingId] =
    useState(null);

  const [form, setForm] = useState(
    resetGoalForm()
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      targetAmount: Number(
        form.targetAmount
      ),
      savedAmount: Number(
        form.savedAmount || 0
      ),
      category: form.category,
    };

    if (
      !payload.title ||
      payload.targetAmount <= 0
    ) {
      alert(
        "Enter a valid goal title and amount"
      );
      return;
    }

    if (editingId) {
      updateGoalMutation.mutate(
        {
          id: editingId,
          payload,
        },
        {
          onSuccess: () => {
            setEditingId(null);

            setForm(resetGoalForm());
          },
        }
      );
    } else {
      createGoalMutation.mutate(
        payload,
        {
          onSuccess: () => {
            setForm(resetGoalForm());
          },
        }
      );
    }
  };

  const handleEdit = (goal) => {
    setEditingId(goal.id);

    setForm({
      title: goal.title || "",
      targetAmount:
        goal.targetAmount || "",
      savedAmount:
        goal.savedAmount || "",
      category: goal.category || "",
    });
  };

  const handleDelete = (goal) => {
    if (
      !window.confirm(
        `Delete goal "${goal.title}"?`
      )
    )
      return;

    deleteGoalMutation.mutate(goal.id);
  };

  const totalTarget = useMemo(
    () =>
      goals.reduce(
        (sum, goal) =>
          sum +
          Number(
            goal.targetAmount || 0
          ),
        0
      ),
    [goals]
  );

  const totalSaved = useMemo(
    () =>
      goals.reduce(
        (sum, goal) =>
          sum +
          Number(goal.savedAmount || 0),
        0
      ),
    [goals]
  );

  const completedGoals = useMemo(
    () =>
      goals.filter(
        (goal) =>
          Number(
            goal.savedAmount || 0
          ) >=
          Number(
            goal.targetAmount || 0
          )
      ).length,
    [goals]
  );

  const remainingAmount = Math.max(
    totalTarget - totalSaved,
    0
  );

  const overallProgress =
    totalTarget > 0
      ? Math.min(
          (totalSaved / totalTarget) *
            100,
          100
        )
      : 0;

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
          Failed to load goals data.
        </div>

      )}

      {/* HEADER */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>

          <p className="text-sm text-white/50">
            Savings Planning
          </p>

          <h1 className="text-4xl font-black tracking-tight text-white">
            Financial Goals
          </h1>

        </div>

        <button
          className="
            flex items-center gap-2
            rounded-2xl
            bg-gradient-to-r
            from-cyan-400
            to-purple-500
            px-6 py-4
            font-semibold
            text-white
            shadow-[0_0_30px_rgba(34,211,238,0.25)]
            transition-all duration-300
            hover:scale-[1.03]
          "
        >

          <Sparkles size={18} />

          AI Goal Planner

        </button>

      </div>

      {/* STATS */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">

        <StatCard
          title="Total Goals"
          value={goals.length}
          subtitle="Tracked goals"
          icon={<Target size={18} />}
          color="cyan"
        />

        <StatCard
          title="Target Amount"
          value={formatCurrency(
            totalTarget
          )}
          subtitle="Goal target total"
          icon={<Trophy size={18} />}
          color="purple"
        />

        <StatCard
          title="Saved Amount"
          value={formatCurrency(
            totalSaved
          )}
          subtitle="Current progress"
          icon={<PiggyBank size={18} />}
          color="emerald"
        />

        <StatCard
          title="Remaining"
          value={formatCurrency(
            remainingAmount
          )}
          subtitle="Still required"
          icon={
            <CircleDashed size={18} />
          }
          color="amber"
        />

        <StatCard
          title="Completed"
          value={completedGoals}
          subtitle="Finished goals"
          icon={<TrendingUp size={18} />}
          color="blue"
        />

      </div>

      {/* MAIN GRID */}
      <div className="grid gap-5 xl:grid-cols-3">

        {/* LEFT PANEL */}
        <div className="space-y-5">

          {/* FORM */}
          <GlassCard
            className="
              border border-cyan-500/10
              bg-white/[0.03]
              p-7
              shadow-[0_0_40px_rgba(0,255,255,0.05)]
            "
          >

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-300">
                <Plus size={18} />
              </div>

              <div>

                <p className="text-sm text-white/50">
                  Goal Form
                </p>

                <h3 className="text-lg font-semibold text-white">

                  {editingId
                    ? "Update Goal"
                    : "Create Goal"}

                </h3>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-4"
            >

              <input
                type="text"
                placeholder="Goal title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    title:
                      e.target.value,
                  }))
                }
                className="
                  w-full rounded-2xl
                  border border-cyan-500/10
                  bg-white/[0.04]
                  px-4 py-4
                  outline-none
                  placeholder:text-white/30
                "
                required
              />

              <input
                type="number"
                placeholder="Target amount"
                value={
                  form.targetAmount
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    targetAmount:
                      e.target.value,
                  }))
                }
                className="
                  w-full rounded-2xl
                  border border-cyan-500/10
                  bg-white/[0.04]
                  px-4 py-4
                  outline-none
                  placeholder:text-white/30
                "
                required
              />

              <input
                type="number"
                placeholder="Saved amount"
                value={
                  form.savedAmount
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    savedAmount:
                      e.target.value,
                  }))
                }
                className="
                  w-full rounded-2xl
                  border border-cyan-500/10
                  bg-white/[0.04]
                  px-4 py-4
                  outline-none
                  placeholder:text-white/30
                "
              />

              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category:
                      e.target.value,
                  }))
                }
                className="
                  w-full rounded-2xl
                  border border-cyan-500/10
                  bg-white/[0.04]
                  px-4 py-4
                  outline-none
                  placeholder:text-white/30
                "
              />

              <div className="flex gap-3">

                <button
                  type="submit"
                  className="
                    flex-1 rounded-2xl
                    bg-gradient-to-r
                    from-cyan-400
                    to-purple-500
                    px-4 py-4
                    font-semibold
                    text-white
                    shadow-[0_0_30px_rgba(34,211,238,0.25)]
                    transition-all duration-300
                    hover:scale-[1.02]
                  "
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

                      setForm(
                        resetGoalForm()
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

          {/* AI PANEL */}
          <GlassCard
            className="
              relative overflow-hidden
              border border-cyan-500/10
              bg-white/[0.03]
              p-7
              shadow-[0_0_40px_rgba(0,255,255,0.05)]
            "
          >

            <div className="absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="flex items-center gap-3">

              <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-300">
                <Brain size={18} />
              </div>

              <div>

                <p className="text-sm text-white/50">
                  AI Insights
                </p>

                <h3 className="text-lg font-semibold text-white">
                  Smart Suggestions
                </h3>

              </div>

            </div>

            <div className="mt-6 space-y-4">

              <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-4">

                <p className="text-sm text-cyan-300">
                  Optimization
                </p>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  Increase monthly savings by
                  ₹5,000 to complete goals
                  faster.
                </p>

              </div>

              <div className="rounded-2xl border border-purple-500/10 bg-purple-500/5 p-4">

                <p className="text-sm text-purple-300">
                  Forecast
                </p>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  You are on track to achieve
                  your primary goal ahead of
                  schedule.
                </p>

              </div>

            </div>

          </GlassCard>

        </div>

        {/* GOALS LIST */}
        <GlassCard
          className="
            border border-cyan-500/10
            bg-white/[0.03]
            p-7
            shadow-[0_0_40px_rgba(0,255,255,0.05)]
            xl:col-span-2
          "
        >

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-white/50">
                Goals Overview
              </p>

              <h3 className="text-lg font-semibold text-white">
                Savings Progress
              </h3>

            </div>

            <div className="text-right">

              <p className="text-sm text-white/50">
                Overall Progress
              </p>

              <h3 className="mt-1 text-2xl font-black text-cyan-300">

                {overallProgress.toFixed(
                  0
                )}
                %

              </h3>

            </div>

          </div>

          {/* OVERALL BAR */}
          <div className="mt-6 h-4 w-full overflow-hidden rounded-full bg-white/10">

            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${overallProgress}%`,
              }}
              transition={{
                duration: 1,
              }}
              className="
                h-full rounded-full
                bg-gradient-to-r
                from-cyan-400
                to-purple-500
              "
            />

          </div>

          {/* GOALS */}
          <div className="mt-8 space-y-5">

            {isLoading ? (

              [...Array(4)].map(
                (_, index) => (

                  <div
                    key={index}
                    className="h-32 animate-pulse rounded-3xl bg-white/5"
                  />

                )
              )

            ) : goals.length === 0 ? (

              <div className="rounded-3xl bg-white/5 p-10 text-center text-sm text-white/50">
                No goals created yet.
              </div>

            ) : (

              goals.map((goal) => {
                const target = Number(
                  goal.targetAmount ||
                    0
                );

                const saved = Number(
                  goal.savedAmount ||
                    0
                );

                const progress =
                  target > 0
                    ? Math.min(
                        (saved /
                          target) *
                          100,
                        100
                      )
                    : 0;

                const status =
                  getGoalStatus(
                    saved,
                    target
                  );

                return (

                  <motion.div
                    key={goal.id}
                    whileHover={{
                      y: -4,
                      scale: 1.01,
                    }}
                    className="
                      rounded-3xl
                      border border-white/10
                      bg-white/[0.03]
                      p-6
                      transition-all duration-300
                    "
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <h4 className="text-xl font-bold text-white">
                          {goal.title}
                        </h4>

                        <p className="mt-2 text-sm text-white/50">

                          {goal.category ||
                            "General"}

                        </p>

                      </div>

                      <div className="flex items-center gap-2">

                        <span
                          className={`
                            rounded-2xl border
                            px-4 py-2
                            text-xs font-semibold
                            ${getGoalStatusColor(
                              status
                            )}
                          `}
                        >
                          {status}
                        </span>

                        <button
                          onClick={() =>
                            handleEdit(
                              goal
                            )
                          }
                          className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                        >

                          <Pencil
                            size={16}
                          />

                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              goal
                            )
                          }
                          className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                        >

                          <Trash2
                            size={16}
                          />

                        </button>

                      </div>

                    </div>

                    <div className="mt-6 flex items-center justify-between text-sm text-white/60">

                      <span>
                        Saved{" "}
                        {formatCurrency(
                          saved
                        )}
                      </span>

                      <span>
                        Target{" "}
                        {formatCurrency(
                          target
                        )}
                      </span>

                    </div>

                    {/* PROGRESS */}
                    <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-white/10">

                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${progress}%`,
                        }}
                        transition={{
                          duration: 1,
                        }}
                        className={`
                          h-full rounded-full
                          ${getProgressGradient(
                            status
                          )}
                        `}
                      />

                    </div>

                    <div className="mt-4 flex items-center justify-between">

                      <span className="text-sm text-white/50">

                        {progress.toFixed(
                          0
                        )}
                        % completed

                      </span>

                      <span className="text-sm text-white/60">

                        Remaining{" "}
                        {formatCurrency(
                          Math.max(
                            target -
                              saved,
                            0
                          )
                        )}

                      </span>

                    </div>

                  </motion.div>

                );
              })

            )}

          </div>

        </GlassCard>

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
  const colorMap = {
    cyan: "bg-cyan-500/10 text-cyan-300",
    purple:
      "bg-purple-500/10 text-purple-300",
    emerald:
      "bg-emerald-500/10 text-emerald-300",
    amber:
      "bg-amber-500/10 text-amber-300",
    blue: "bg-blue-500/10 text-blue-300",
  };

  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
    >

      <GlassCard
        className="
          border border-cyan-500/10
          bg-white/[0.03]
          p-6
          shadow-[0_0_40px_rgba(0,255,255,0.06)]
        "
      >

        <div className="flex items-center gap-4">

          <div
            className={`rounded-2xl p-3 ${colorMap[color]}`}
          >
            {icon}
          </div>

          <div>

            <p className="text-sm text-white/50">
              {title}
            </p>

            <h3 className="mt-2 text-3xl font-black text-white">
              {value}
            </h3>

            <p className="mt-2 text-sm text-white/50">
              {subtitle}
            </p>

          </div>

        </div>

      </GlassCard>

    </motion.div>
  );
}