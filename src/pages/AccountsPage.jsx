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

const COLORS = ["#22d3ee", "#3b82f6", "#a78bfa", "#34d399", "#f59e0b", "#f472b6"];

function getAccountIcon(type) {
  const normalized = (type || "").toUpperCase();

  if (normalized.includes("BANK")) return Landmark;
  if (normalized.includes("WALLET")) return Wallet;
  if (normalized.includes("CARD")) return CreditCard;
  return PiggyBank;
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
  const isLoading = accountsQuery.isLoading;
  const isError = accountsQuery.isError;

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(resetAccountForm());

  const [transferForm, setTransferForm] = useState(resetTransferForm());

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      type: form.type,
      balance: Number(form.balance),
    };

    if (!payload.name || payload.balance < 0) {
      toast.error("Enter a valid account name and balance");
      return;
    }

    if (editingId) {
      updateAccountMutation.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => {
            toast.success("Account updated successfully");
            setEditingId(null);
            setForm(resetAccountForm());
          },
          onError: (error) => {
            console.error("Update account failed:", error?.response?.data || error);
            toast.error("Update failed");
          },
        }
      );
    } else {
      createAccountMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Account created successfully");
          setForm(resetAccountForm());
        },
        onError: (error) => {
          console.error("Create account failed:", error?.response?.data || error);
          toast.error("Create failed");
        },
      });
    }
  };

  const handleTransfer = (e) => {
    e.preventDefault();

    if (
      !transferForm.fromAccountId ||
      !transferForm.toAccountId ||
      !transferForm.amount
    ) {
      toast.error("Fill all transfer fields");
      return;
    }

    if (transferForm.fromAccountId === transferForm.toAccountId) {
      toast.error("Choose different accounts");
      return;
    }

    const payload = {
      fromAccountId: Number(transferForm.fromAccountId),
      toAccountId: Number(transferForm.toAccountId),
      amount: Number(transferForm.amount),
    };

    if (payload.amount <= 0) {
      toast.error("Enter a valid transfer amount");
      return;
    }

    transferMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Transfer successful");
        setTransferForm(resetTransferForm());
      },
      onError: (error) => {
        console.error("Transfer failed:", error?.response?.data || error);
        toast.error(
          error?.response?.data?.message ||
            error?.response?.data ||
            "Transfer failed"
        );
      },
    });
  };

  const handleEdit = (account) => {
    setEditingId(account.id);
    setForm({
      name: account.name || "",
      type: account.type || "BANK",
      balance: account.balance || "",
    });
  };

  const handleDelete = (account) => {
    if (!window.confirm(`Delete account "${account.name}"?`)) return;

    deleteAccountMutation.mutate(account.id, {
      onSuccess: () => {
        toast.success("Account deleted successfully");
      },
      onError: (error) => {
        console.error("Delete account failed:", error?.response?.data || error);
        toast.error("Delete failed");
      },
    });
  };

  const totalBalance = useMemo(
    () =>
      accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0),
    [accounts]
  );

  const bankCount = useMemo(
    () =>
      accounts.filter((a) => (a.type || "").toUpperCase().includes("BANK"))
        .length,
    [accounts]
  );

  const walletCount = useMemo(
    () =>
      accounts.filter((a) => (a.type || "").toUpperCase().includes("WALLET"))
        .length,
    [accounts]
  );

  const cardCount = useMemo(
    () =>
      accounts.filter((a) => (a.type || "").toUpperCase().includes("CARD"))
        .length,
    [accounts]
  );

  const largestAccount = useMemo(() => {
    if (!accounts.length) return null;
    return [...accounts].sort(
      (a, b) => Number(b.balance || 0) - Number(a.balance || 0)
    )[0];
  }, [accounts]);

  const chartData = accounts.map((account) => ({
    name: account.name,
    value: Number(account.balance || 0),
  }));

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Failed to load accounts data.
        </div>
      )}

      <div>
        <p className="text-sm text-white/50">Money Storage</p>
        <h1 className="text-3xl font-semibold tracking-tight">Accounts</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400">
                <Wallet size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Total Accounts</p>
                <h3 className="mt-1 text-3xl font-bold">
                  {isLoading ? "..." : accounts.length}
                </h3>
                <p className="mt-2 text-sm text-cyan-400">Tracked sources</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400">
                <BadgeIndianRupee size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Total Balance</p>
                <h3 className="mt-1 text-3xl font-bold">
                  {isLoading ? "..." : formatCurrency(totalBalance)}
                </h3>
                <p className="mt-2 text-sm text-emerald-400">Across all accounts</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-400">
                <Landmark size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Bank / Wallet</p>
                <h3 className="mt-1 text-3xl font-bold">
                  {isLoading ? "..." : `${bankCount} / ${walletCount}`}
                </h3>
                <p className="mt-2 text-sm text-violet-400">Type distribution</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
                <CreditCard size={18} />
              </div>
              <div>
                <p className="text-sm text-white/50">Cards</p>
                <h3 className="mt-1 text-3xl font-bold">
                  {isLoading ? "..." : cardCount}
                </h3>
                <p className="mt-2 text-sm text-amber-400">Card-based accounts</p>
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
                <p className="text-sm text-white/50">Largest Account</p>
                <h3 className="mt-1 text-xl font-bold">
                  {isLoading
                    ? "..."
                    : largestAccount
                    ? largestAccount.name
                    : "—"}
                </h3>
                <p className="mt-2 text-sm text-blue-400">
                  {largestAccount
                    ? formatCurrency(largestAccount.balance)
                    : "No accounts yet"}
                </p>
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
              <p className="text-sm text-white/50">Account Form</p>
              <h3 className="text-lg font-semibold">
                {editingId ? "Update Account" : "Create Account"}
              </h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Account name"
              value={form.name}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, name: e.target.value }))
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
              <option value="BANK" className="bg-slate-900">BANK</option>
              <option value="WALLET" className="bg-slate-900">WALLET</option>
              <option value="CREDIT_CARD" className="bg-slate-900">CREDIT CARD</option>
              <option value="SAVINGS" className="bg-slate-900">SAVINGS</option>
              <option value="CASH" className="bg-slate-900">CASH</option>
            </select>

            <input
              type="number"
              placeholder="Balance"
              value={form.balance}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, balance: e.target.value }))
              }
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
              required
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-white transition hover:opacity-90"
              >
                {editingId
                  ? updateAccountMutation.isPending
                    ? "Updating..."
                    : "Update Account"
                  : createAccountMutation.isPending
                  ? "Creating..."
                  : "Create Account"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(resetAccountForm());
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 rounded-2xl bg-white/5 p-4">
            <p className="text-sm text-white/50">Quick Note</p>
            <p className="mt-2 text-sm text-white/75">
              Use accounts to separate bank balances, wallets, cards, and cash
              for better money tracking.
            </p>
          </div>
        </GlassCard>

        <GlassCard className="p-6 xl:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Landmark size={18} />
            </div>
            <div>
              <p className="text-sm text-white/50">Account Overview</p>
              <h3 className="text-lg font-semibold">Balance Distribution</h3>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="h-72">
              {chartData.length === 0 ? (
                <div className="flex h-full items-center justify-center rounded-2xl bg-white/5 text-sm text-white/50">
                  No account data available.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={65}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
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
              )}
            </div>

            <div className="space-y-3">
              {isLoading ? (
                [...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="h-20 animate-pulse rounded-2xl bg-white/5"
                  />
                ))
              ) : accounts.length === 0 ? (
                <div className="rounded-2xl bg-white/5 p-6 text-center text-sm text-white/50">
                  No accounts created yet.
                </div>
              ) : (
                accounts.map((account) => {
                  const Icon = getAccountIcon(account.type);
                  return (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-2xl bg-white/8 p-3">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-medium">{account.name}</p>
                          <p className="mt-1 text-sm text-white/50">
                            {account.type || "ACCOUNT"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">
                            {formatCurrency(account.balance)}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(account)}
                            className="rounded-xl border border-white/10 bg-white/5 p-2 transition hover:bg-white/10"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(account)}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-300 transition hover:bg-red-500/20"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-white/8 p-3">
            <ArrowRightLeft size={18} />
          </div>
          <div>
            <p className="text-sm text-white/50">Internal Transfer</p>
            <h3 className="text-lg font-semibold">Move Money Between Accounts</h3>
          </div>
        </div>

        <form
          onSubmit={handleTransfer}
          className="mt-6 grid gap-4 md:grid-cols-4"
        >
          <select
            value={transferForm.fromAccountId}
            onChange={(e) =>
              setTransferForm((prev) => ({
                ...prev,
                fromAccountId: e.target.value,
              }))
            }
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            required
          >
            <option value="" className="bg-slate-900">
              From Account
            </option>
            {accounts.map((account) => (
              <option
                key={account.id}
                value={account.id}
                className="bg-slate-900"
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
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none"
            required
          >
            <option value="" className="bg-slate-900">
              To Account
            </option>
            {accounts.map((account) => (
              <option
                key={account.id}
                value={account.id}
                className="bg-slate-900"
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
              setTransferForm((prev) => ({ ...prev, amount: e.target.value }))
            }
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none placeholder:text-white/30"
            required
          />

          <button
            type="submit"
            className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-white transition hover:opacity-90"
          >
            {transferMutation.isPending ? "Transferring..." : "Transfer"}
          </button>
        </form>

        <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-white/70">
          Move funds internally between your linked accounts without affecting
          your total net balance.
        </div>
      </GlassCard>
    </div>
  );
}