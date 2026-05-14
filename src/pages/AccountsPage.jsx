import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import {
  Plus,
  Pencil,
  Trash2,
  Landmark,
  Wallet,
  CreditCard,
  PiggyBank,
  ArrowRightLeft,
  TrendingUp,
  BadgeIndianRupee,
  Sparkles,
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import GlassCard from "../components/ui/GlassCard";
import formatCurrency from "../utils/formatCurrency";
import useAccountsData from "../features/accounts/useAccountsData";

const COLORS = [
  "#22d3ee",
  "#3b82f6",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
];

function getAccountIcon(type) {
  const normalized = (type || "").toUpperCase();

  if (normalized.includes("BANK")) return Landmark;
  if (normalized.includes("WALLET")) return Wallet;
  if (normalized.includes("CARD")) return CreditCard;

  return PiggyBank;
}

function getGradient(type) {
  const normalized = (type || "").toUpperCase();

  if (normalized.includes("BANK"))
    return "from-cyan-500/20 to-blue-500/20";

  if (normalized.includes("WALLET"))
    return "from-emerald-500/20 to-teal-500/20";

  if (normalized.includes("CARD"))
    return "from-violet-500/20 to-fuchsia-500/20";

  return "from-amber-500/20 to-orange-500/20";
}

function resetAccountForm() {
  return {
    name: "",
    type: "BANK",
    balance: "",
  };
}

function resetTransferForm() {
  return {
    fromAccountId: "",
    toAccountId: "",
    amount: "",
  };
}

export default function AccountsPage() {
  const {
    accountsQuery,
    createAccountMutation,
    updateAccountMutation,
    deleteAccountMutation,
    transferMutation,
  } = useAccountsData();

  const accounts = accountsQuery.data || [];

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(resetAccountForm());

  const [transferForm, setTransferForm] =
    useState(resetTransferForm());

  const totalBalance = useMemo(() => {
    return accounts.reduce(
      (sum, account) => sum + Number(account.balance || 0),
      0
    );
  }, [accounts]);

  const chartData = accounts.map((account) => ({
    name: account.name,
    value: Number(account.balance || 0),
  }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      type: form.type,
      balance: Number(form.balance),
    };

    if (!payload.name || payload.balance < 0) {
      toast.error("Enter valid details");
      return;
    }

    if (editingId) {
      updateAccountMutation.mutate(
        {
          id: editingId,
          payload,
        },
        {
          onSuccess: () => {
            toast.success("Account updated");
            setEditingId(null);
            setForm(resetAccountForm());
          },
        }
      );
    } else {
      createAccountMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Account created");
          setForm(resetAccountForm());
        },
      });
    }
  };

  const handleDelete = (account) => {
    if (!window.confirm(`Delete ${account.name}?`)) return;

    deleteAccountMutation.mutate(account.id, {
      onSuccess: () => {
        toast.success("Account deleted");
      },
    });
  };

  const handleEdit = (account) => {
    setEditingId(account.id);

    setForm({
      name: account.name,
      type: account.type,
      balance: account.balance,
    });
  };

  const handleTransfer = (e) => {
    e.preventDefault();

    if (
      !transferForm.fromAccountId ||
      !transferForm.toAccountId ||
      !transferForm.amount
    ) {
      toast.error("Fill all fields");
      return;
    }

    transferMutation.mutate(
      {
        fromAccountId: Number(
          transferForm.fromAccountId
        ),
        toAccountId: Number(
          transferForm.toAccountId
        ),
        amount: Number(transferForm.amount),
      },
      {
        onSuccess: () => {
          toast.success("Transfer successful");

          setTransferForm(resetTransferForm());
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-cyan-400">
            Smart Banking
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Accounts Center
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3">
          <Sparkles className="text-cyan-400" size={18} />

          <span className="text-sm text-cyan-200">
            AI optimized financial accounts
          </span>
        </div>
      </div>

      {/* TOP STATS */}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50">
                Total Balance
              </p>

              <h2 className="mt-3 text-4xl font-black">
                {formatCurrency(totalBalance)}
              </h2>

              <p className="mt-3 text-sm text-emerald-400">
                Across all accounts
              </p>
            </div>

            <div className="rounded-3xl bg-cyan-500/10 p-4 text-cyan-400">
              <BadgeIndianRupee size={28} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50">
                Total Accounts
              </p>

              <h2 className="mt-3 text-4xl font-black">
                {accounts.length}
              </h2>

              <p className="mt-3 text-sm text-cyan-400">
                Connected sources
              </p>
            </div>

            <div className="rounded-3xl bg-blue-500/10 p-4 text-blue-400">
              <Wallet size={28} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50">
                Active Transfers
              </p>

              <h2 className="mt-3 text-4xl font-black">
                {accounts.length > 1 ? "Ready" : "0"}
              </h2>

              <p className="mt-3 text-sm text-violet-400">
                Internal transactions
              </p>
            </div>

            <div className="rounded-3xl bg-violet-500/10 p-4 text-violet-400">
              <ArrowRightLeft size={28} />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/50">
                Financial Health
              </p>

              <h2 className="mt-3 text-4xl font-black text-emerald-400">
                92%
              </h2>

              <p className="mt-3 text-sm text-emerald-400">
                Excellent status
              </p>
            </div>

            <div className="rounded-3xl bg-emerald-500/10 p-4 text-emerald-400">
              <TrendingUp size={28} />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* ACCOUNT CARDS */}

      <div className="grid gap-6 xl:grid-cols-3">
        {accounts.length === 0 ? (
          <GlassCard className="col-span-full flex flex-col items-center justify-center p-16 text-center">
            <div className="rounded-full bg-cyan-500/10 p-8">
              <Wallet
                size={50}
                className="text-cyan-400"
              />
            </div>

            <h2 className="mt-6 text-3xl font-bold">
              No Accounts Yet
            </h2>

            <p className="mt-3 max-w-md text-white/50">
              Create your first smart account to
              manage balances, transfers, savings,
              and financial analytics.
            </p>
          </GlassCard>
        ) : (
          accounts.map((account) => {
            const Icon = getAccountIcon(account.type);

            return (
              <motion.div
                key={account.id}
                whileHover={{
                  y: -8,
                }}
              >
                <GlassCard
                  className={`relative overflow-hidden border border-white/10 bg-gradient-to-br ${getGradient(
                    account.type
                  )} p-6`}
                >
                  <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cyan-500/10 blur-3xl" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-white/50">
                          {account.type}
                        </p>

                        <h3 className="mt-2 text-2xl font-bold">
                          {account.name}
                        </h3>
                      </div>

                      <div className="rounded-2xl bg-white/10 p-3">
                        <Icon size={24} />
                      </div>
                    </div>

                    <div className="mt-10">
                      <p className="text-sm text-white/40">
                        Current Balance
                      </p>

                      <h2 className="mt-2 text-4xl font-black">
                        {formatCurrency(
                          account.balance
                        )}
                      </h2>
                    </div>

                    <div className="mt-8 flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleEdit(account)
                        }
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 transition hover:bg-white/10"
                      >
                        <Pencil size={16} />
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(account)
                        }
                        className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-300 transition hover:bg-red-500/20"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>

      {/* CREATE + CHART */}

      <div className="grid gap-6 xl:grid-cols-5">
        <GlassCard className="xl:col-span-2 p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
              <Plus size={20} />
            </div>

            <div>
              <p className="text-sm text-white/50">
                Smart Account
              </p>

              <h2 className="text-xl font-bold">
                {editingId
                  ? "Update Account"
                  : "Create Account"}
              </h2>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <input
              type="text"
              placeholder="Account Name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="
  w-full
  rounded-2xl
  border
  border-white/10
  bg-[#111827]
  text-white
  px-5
  py-4
  outline-none
  appearance-none
"
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  type: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
            >
             <option
  value="BANK"
  className="bg-[#111827] text-white"
>
  BANK
</option>

<option
  value="WALLET"
  className="bg-[#111827] text-white"
>
  WALLET
</option>

<option
  value="CREDIT_CARD"
  className="bg-[#111827] text-white"
>
  CREDIT CARD
</option>

<option
  value="SAVINGS"
  className="bg-[#111827] text-white"
>
  SAVINGS
</option>

<option
  value="CASH"
  className="bg-[#111827] text-white"
>
  CASH
</option>
            </select>

            <input
              type="number"
              placeholder="Balance"
              value={form.balance}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  balance: e.target.value,
                }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30"
            />

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 py-4 text-lg font-semibold transition hover:scale-[1.01]"
            >
              {editingId
                ? "Update Account"
                : "Create Account"}
            </button>
          </form>
        </GlassCard>

        <GlassCard className="xl:col-span-3 p-7">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/50">
                Financial Analytics
              </p>

              <h2 className="text-2xl font-bold">
                Balance Distribution
              </h2>
            </div>

            <div className="rounded-2xl bg-violet-500/10 px-4 py-2 text-violet-300">
              Live Analytics
            </div>
          </div>

          <div className="mt-10 h-[400px]">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-white/10 text-white/40">
                No chart data available
              </div>
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={chartData}
                    innerRadius={90}
                    outerRadius={150}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      formatCurrency(value)
                    }
                    contentStyle={{
                      background: "#111827",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "18px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>
      </div>

      {/* TRANSFER */}

      <GlassCard className="p-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-blue-500/10 p-3 text-blue-400">
            <ArrowRightLeft size={20} />
          </div>

          <div>
            <p className="text-sm text-white/50">
              Instant Internal Transfer
            </p>

            <h2 className="text-2xl font-bold">
              Move Money Between Accounts
            </h2>
          </div>
        </div>

        <form
          onSubmit={handleTransfer}
          className="mt-8 grid gap-5 md:grid-cols-4"
        >
          <select
            value={transferForm.fromAccountId}
            onChange={(e) =>
              setTransferForm((prev) => ({
                ...prev,
                fromAccountId: e.target.value,
              }))
            }
            className="
  rounded-2xl
  border
  border-white/10
  bg-[#111827]
  text-white
  px-5
  py-4
  outline-none
  appearance-none
"
          >
            <option
  value=""
  className="bg-[#111827] text-white"
>
  From Account
</option>

            {accounts.map((account) => (
              <option
  key={account.id}
  value={account.id}
  className="bg-[#111827] text-white"
>
  {account.name}
</option>
            ))} 
          </select>

          <select
            value={transferForm.toAccountId}
            onChange={(e) =>
              setTransferForm((prev) => ({
                ...prev,
                toAccountId: e.target.value,
              }))
            }
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none"
          >
            <option value="">
              To Account
            </option>

            {accounts.map((account) => (
              <option
                key={account.id}
                value={account.id}
              >
                {account.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={transferForm.amount}
            onChange={(e) =>
              setTransferForm((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 outline-none placeholder:text-white/30"
          />

          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-lg font-semibold transition hover:scale-[1.02]"
          >
            Transfer
          </button>
        </form>

        <div className="mt-6 rounded-3xl border border-cyan-500/10 bg-cyan-500/5 p-5">
          <p className="text-cyan-300">
            Internal transfers do not affect your
            overall net worth. Funds move instantly
            between your connected accounts.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}