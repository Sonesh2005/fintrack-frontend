import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
  Search,
  Wallet,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import GlassCard from "../components/ui/GlassCard";
import formatCurrency from "../utils/formatCurrency";
import { getExpenses } from "../api/expenseApi";
import { getIncomes } from "../api/incomeApi";

function normalizeExpense(item) {
  return {
    id: `expense-${item.id}`,
    originalId: item.id,
    title: item.title || item.name || item.description || "Expense",
    category: item.category || "Uncategorized",
    amount: Number(item.amount || 0),
    date: item.date || item.createdAt || item.transactionDate || "",
    type: "expense",
    raw: item,
  };
}

function normalizeIncome(item) {
  return {
    id: `income-${item.id}`,
    originalId: item.id,
    title: item.title || item.name || item.source || "Income",
    category: item.category || item.source || "Income",
    amount: Number(item.amount || 0),
    date: item.date || item.createdAt || item.transactionDate || "",
    type: "income",
    raw: item,
  };
}

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const expensesQuery = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  const incomesQuery = useQuery({
    queryKey: ["incomes"],
    queryFn: getIncomes,
  });

  const isLoading = expensesQuery.isLoading || incomesQuery.isLoading;
  const isError = expensesQuery.isError || incomesQuery.isError;

  const expenses = Array.isArray(expensesQuery.data)
    ? expensesQuery.data.map(normalizeExpense)
    : [];

  const incomes = Array.isArray(incomesQuery.data)
    ? incomesQuery.data.map(normalizeIncome)
    : [];

  const transactions = useMemo(() => {
    return [...expenses, ...incomes].sort(
      (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
    );
  }, [expenses, incomes]);

  const categories = useMemo(() => {
    const unique = new Set(
      transactions.map((item) => item.category).filter(Boolean)
    );
    return ["all", ...Array.from(unique)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        typeFilter === "all" ? true : item.type === typeFilter;

      const matchesCategory =
        categoryFilter === "all" ? true : item.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter]);

  const totalTransactions = filteredTransactions.length;

  const totalIncome = filteredTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = filteredTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const highestIncome =
    filteredTransactions
      .filter((item) => item.type === "income")
      .sort((a, b) => b.amount - a.amount)[0]?.amount || 0;

  const highestExpense =
    filteredTransactions
      .filter((item) => item.type === "expense")
      .sort((a, b) => b.amount - a.amount)[0]?.amount || 0;

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Failed to load transactions.
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        <SummaryCard
          title="Total Transactions"
          value={totalTransactions}
          subtitle="Filtered results"
          icon={<Wallet className="h-5 w-5" />}
        />
        <SummaryCard
          title="Income"
          value={formatCurrency(totalIncome)}
          subtitle="Visible income entries"
          icon={<TrendingUp className="h-5 w-5" />}
          iconClass="bg-emerald-500/10 text-emerald-300"
        />
        <SummaryCard
          title="Expenses"
          value={formatCurrency(totalExpense)}
          subtitle="Visible expense entries"
          icon={<TrendingDown className="h-5 w-5" />}
          iconClass="bg-rose-500/10 text-rose-300"
        />
        <SummaryCard
          title="Highest Expense"
          value={formatCurrency(highestExpense)}
          subtitle={`Highest income: ${formatCurrency(highestIncome)}`}
          icon={<Filter className="h-5 w-5" />}
          iconClass="bg-violet-500/10 text-violet-300"
        />
      </motion.div>

      <GlassCard className="p-5">
        <div className="grid gap-4 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <Search className="h-4 w-4 text-white/50" />
              <input
                type="text"
                placeholder="Search by title or category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
              />
            </div>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            <option value="all" className="bg-slate-900">
              All Types
            </option>
            <option value="income" className="bg-slate-900">
              Income
            </option>
            <option value="expense" className="bg-slate-900">
              Expense
            </option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
                className="bg-slate-900"
              >
                {category === "all" ? "All Categories" : category}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-white/8 px-5 py-4">
          <h3 className="text-lg font-semibold text-white">
            Transaction History
          </h3>
          <p className="mt-1 text-sm text-white/50">
            Complete combined history of income and expenses
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-16 animate-pulse rounded-2xl bg-white/5"
              />
            ))}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-white/50">
            No transactions found for the selected filters.
          </div>
        ) : (
          <div className="divide-y divide-white/6">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                      transaction.type === "income"
                        ? "bg-emerald-500/10 text-emerald-300"
                        : "bg-rose-500/10 text-rose-300"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-white">{transaction.title}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
                      <span className="rounded-full bg-white/6 px-2 py-1">
                        {transaction.category}
                      </span>
                      <span className="rounded-full bg-white/6 px-2 py-1 capitalize">
                        {transaction.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <p
                    className={`text-lg font-semibold ${
                      transaction.type === "income"
                        ? "text-emerald-300"
                        : "text-rose-300"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="mt-1 text-xs text-white/45">
                    {formatDate(transaction.date)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  iconClass = "bg-cyan-500/10 text-cyan-300",
}) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50">{title}</p>
          <h3 className="mt-3 text-3xl font-bold text-white">{value}</h3>
          <p className="mt-2 text-sm text-white/55">{subtitle}</p>
        </div>
        <div className={`rounded-2xl p-3 ${iconClass}`}>{icon}</div>
      </div>
    </GlassCard>
  );
}

function formatDate(dateValue) {
  if (!dateValue) return "No date";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}