import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  FileBarChart2,
  Repeat,
  Download,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import GlassCard from "../components/ui/GlassCard";
import useDashboardData from "../features/dashboard/useDashboardData";
import useBudgetData from "../features/budget/useBudgetData";
import useRecurringData from "../features/recurring/useRecurringData";
import formatCurrency from "../utils/formatCurrency";

const COLORS = ["#22d3ee", "#a78bfa", "#f59e0b", "#34d399", "#3b82f6", "#f472b6"];

const formatINRForExport = (value) =>
  `INR ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Number(value || 0))}`;

export default function ReportsPage() {
  const { summaryQuery, monthlyQuery, categoryQuery } = useDashboardData();
  const { alertsQuery } = useBudgetData();
  const { recurringQuery } = useRecurringData();

  const isLoading =
    summaryQuery.isLoading ||
    monthlyQuery.isLoading ||
    categoryQuery.isLoading ||
    alertsQuery.isLoading ||
    recurringQuery.isLoading;

  const isError =
    summaryQuery.isError ||
    monthlyQuery.isError ||
    categoryQuery.isError ||
    alertsQuery.isError ||
    recurringQuery.isError;

  const summary = summaryQuery.data || {};
  const monthlyRaw = monthlyQuery.data || [];
  const categoryRaw = categoryQuery.data || [];
  const alerts = alertsQuery.data || {};
  const recurringItems = recurringQuery.data || [];

  const totalIncome = summary.totalIncome ?? 0;
  const totalExpense = summary.totalExpense ?? 0;
  const savings = summary.savings ?? totalIncome - totalExpense;
  const netFlow = totalIncome - totalExpense;
  const savingsRate =
    totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const monthlyData = monthNames.map((name, index) => {
    const monthNumber = index + 1;
    const record = monthlyRaw.find((m) => m.month === monthNumber);

    return {
      month: name,
      income: record?.income ?? 0,
      expense: record?.expense ?? 0,
    };
  });

  const categoryData = categoryRaw
    .map((item, index) => ({
      name: item.category ?? item.name ?? `Category ${index + 1}`,
      value: Number(item.total ?? item.amount ?? item.value ?? 0),
    }))
    .sort((a, b) => b.value - a.value);

  const topCategory = categoryData.length > 0 ? categoryData[0] : null;

  const recurringTotal = recurringItems.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const budgetSpent = alerts.currentSpent ?? alerts.spent ?? 0;
  const budgetUsed =
    alerts.percentageUsed ?? alerts.usedPercentage ?? alerts.spentPercentage ?? 0;
  const budgetStatus = alerts.status ?? "NO_BUDGET";

  const downloadCSV = () => {
    try {
      const rows = [];

      rows.push(["FINTRACK FINANCIAL REPORT"]);
      rows.push(["Generated At", new Date().toLocaleString("en-IN")]);
      rows.push([]);

      rows.push(["SUMMARY"]);
      rows.push(["Metric", "Value"]);
      rows.push(["Total Income", formatINRForExport(totalIncome)]);
      rows.push(["Total Expense", formatINRForExport(totalExpense)]);
      rows.push(["Net Savings", formatINRForExport(savings)]);
      rows.push(["Net Flow", formatINRForExport(netFlow)]);
      rows.push(["Savings Rate", `${savingsRate}%`]);
      rows.push(["Top Expense Category", topCategory ? topCategory.name : "—"]);
      rows.push([]);

      rows.push(["BUDGET SNAPSHOT"]);
      rows.push(["Metric", "Value"]);
      rows.push(["Current Spent", formatINRForExport(budgetSpent)]);
      rows.push(["Budget Used", `${budgetUsed}%`]);
      rows.push(["Budget Status", budgetStatus]);
      rows.push([]);

      rows.push(["RECURRING SNAPSHOT"]);
      rows.push(["Metric", "Value"]);
      rows.push(["Recurring Rules", recurringItems.length]);
      rows.push(["Recurring Total", formatINRForExport(recurringTotal)]);
      rows.push([]);

      rows.push(["CATEGORY BREAKDOWN"]);
      rows.push(["Category", "Amount"]);
      if (categoryData.length === 0) {
        rows.push(["No category data", formatINRForExport(0)]);
      } else {
        categoryData.forEach((item) => {
          rows.push([item.name, formatINRForExport(item.value)]);
        });
      }
      rows.push([]);

      rows.push(["MONTHLY ANALYTICS"]);
      rows.push(["Month", "Income", "Expense"]);
      monthlyData.forEach((item) => {
        rows.push([
          item.month,
          formatINRForExport(item.income),
          formatINRForExport(item.expense),
        ]);
      });

      const csvContent = rows
        .map((row) =>
          row
            .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "fintrack-report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("CSV downloaded");
    } catch (error) {
      console.error("CSV download failed:", error);
      toast.error("Failed to download CSV");
    }
  };

  const addSectionTitle = (doc, title, y) => {
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(14, y, 182, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, 18, y + 6.5);
  };

  const ensurePageSpace = (doc, nextSectionHeight = 30) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const currentY = doc.lastAutoTable?.finalY || 20;
    if (currentY + nextSectionHeight > pageHeight - 20) {
      doc.addPage();
      return 20;
    }
    return currentY + 8;
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      doc.setFillColor(11, 16, 32);
      doc.rect(0, 0, pageWidth, 34, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("FinTrack Financial Report", 14, 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, 24);

      doc.setTextColor(31, 41, 55);

      addSectionTitle(doc, "Summary", 40);
      autoTable(doc, {
        startY: 53,
        head: [["Metric", "Value"]],
        body: [
          ["Total Income", formatINRForExport(totalIncome)],
          ["Total Expense", formatINRForExport(totalExpense)],
          ["Net Savings", formatINRForExport(savings)],
          ["Net Flow", formatINRForExport(netFlow)],
          ["Savings Rate", `${savingsRate}%`],
          ["Top Expense Category", topCategory ? topCategory.name : "—"],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [34, 211, 238],
          textColor: [15, 23, 42],
          fontStyle: "bold",
        },
        bodyStyles: { textColor: [31, 41, 55] },
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
      });

      let nextY = ensurePageSpace(doc);
      addSectionTitle(doc, "Budget Snapshot", nextY);
      autoTable(doc, {
        startY: nextY + 13,
        head: [["Metric", "Value"]],
        body: [
          ["Current Spent", formatINRForExport(budgetSpent)],
          ["Budget Used", `${budgetUsed}%`],
          ["Budget Status", budgetStatus],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [167, 139, 250],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        bodyStyles: { textColor: [31, 41, 55] },
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
      });

      nextY = ensurePageSpace(doc);
      addSectionTitle(doc, "Recurring Snapshot", nextY);
      autoTable(doc, {
        startY: nextY + 13,
        head: [["Metric", "Value"]],
        body: [
          ["Recurring Rules", recurringItems.length],
          ["Recurring Total", formatINRForExport(recurringTotal)],
        ],
        theme: "grid",
        headStyles: {
          fillColor: [52, 211, 153],
          textColor: [15, 23, 42],
          fontStyle: "bold",
        },
        bodyStyles: { textColor: [31, 41, 55] },
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
      });

      nextY = ensurePageSpace(doc, 50);
      addSectionTitle(doc, "Category Breakdown", nextY);
      autoTable(doc, {
        startY: nextY + 13,
        head: [["Category", "Amount"]],
        body:
          categoryData.length > 0
            ? categoryData.map((item) => [item.name, formatINRForExport(item.value)])
            : [["No category data", formatINRForExport(0)]],
        theme: "striped",
        headStyles: {
          fillColor: [245, 158, 11],
          textColor: [15, 23, 42],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        bodyStyles: { textColor: [31, 41, 55] },
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
      });

      nextY = ensurePageSpace(doc, 60);
      addSectionTitle(doc, "Monthly Analytics", nextY);
      autoTable(doc, {
        startY: nextY + 13,
        head: [["Month", "Income", "Expense"]],
        body: monthlyData.map((item) => [
          item.month,
          formatINRForExport(item.income),
          formatINRForExport(item.expense),
        ]),
        theme: "striped",
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        bodyStyles: { textColor: [31, 41, 55] },
        styles: {
          fontSize: 10,
          cellPadding: 4,
          lineColor: [226, 232, 240],
          lineWidth: 0.2,
        },
      });

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i += 1) {
        doc.setPage(i);
        doc.setDrawColor(226, 232, 240);
        doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(
          `FinTrack Report • Page ${i} of ${pageCount}`,
          14,
          pageHeight - 8
        );
      }

      doc.save("fintrack-report.pdf");
      toast.success("PDF downloaded");
    } catch (error) {
      console.error("PDF download failed:", error);
      toast.error("Failed to download PDF");
    }
  };

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Failed to load report data.
        </div>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-white/50">Financial Intelligence</p>
          <h1 className="text-3xl font-semibold tracking-tight">Reports</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={downloadCSV}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <Download size={16} />
            Download CSV
          </button>

          <button
            onClick={downloadPDF}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            <FileText size={16} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <ReportCard
          title="Total Income"
          value={formatCurrency(totalIncome)}
          icon={<ArrowUpRight size={18} />}
          iconClass="bg-cyan-500/10 text-cyan-400"
        />
        <ReportCard
          title="Total Expense"
          value={formatCurrency(totalExpense)}
          icon={<ArrowDownRight size={18} />}
          iconClass="bg-amber-500/10 text-amber-400"
        />
        <ReportCard
          title="Net Savings"
          value={formatCurrency(savings)}
          icon={<PiggyBank size={18} />}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />
        <ReportCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          icon={<Wallet size={18} />}
          iconClass="bg-violet-500/10 text-violet-400"
        />
        <ReportCard
          title="Net Flow"
          value={formatCurrency(netFlow)}
          icon={<TrendingUp size={18} />}
          iconClass="bg-blue-500/10 text-blue-400"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard className="p-6 xl:col-span-2">
          <p className="text-sm text-white/50">Monthly Analytics</p>
          <h3 className="text-lg font-semibold">Income vs Expense</h3>

          <div className="mt-6 h-80">
            {isLoading ? (
              <div className="h-full animate-pulse rounded-2xl bg-white/5" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="incomeFillReport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="expenseFillReport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" />
                  <YAxis stroke="rgba(255,255,255,0.45)" />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      background: "#121a30",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      color: "white",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#22d3ee"
                    fill="url(#incomeFillReport)"
                    strokeWidth={3}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#a78bfa"
                    fill="url(#expenseFillReport)"
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="text-sm text-white/50">Expense Analysis</p>
          <h3 className="text-lg font-semibold">Category Breakdown</h3>

          <div className="mt-6 h-64">
            {categoryData.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-2xl bg-white/5 text-sm text-white/50">
                No category data available.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
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

          <div className="mt-4 space-y-3">
            {categoryData.length === 0 ? (
              <div className="rounded-2xl bg-white/5 p-4 text-sm text-white/50">
                No category data available.
              </div>
            ) : (
              categoryData.slice(0, 4).map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl bg-white/5 p-3"
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
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <FileBarChart2 size={18} />
            </div>
            <div>
              <p className="text-sm text-white/50">Insight Summary</p>
              <h3 className="text-lg font-semibold">Key Highlights</h3>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/50">Top Expense Category</p>
              <p className="mt-2 text-lg font-semibold">
                {topCategory ? topCategory.name : "—"}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/50">Savings Rate</p>
              <p className="mt-2 text-lg font-semibold">{savingsRate}%</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/50">Budget Status</p>
              <p className="mt-2 text-lg font-semibold">{budgetStatus}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-sm text-white/50">Budget Snapshot</p>
              <h3 className="text-lg font-semibold">Usage Overview</h3>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/50">Current Spent</p>
              <p className="mt-2 text-lg font-semibold">
                {formatCurrency(budgetSpent)}
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/50">Budget Used</p>
              <p className="mt-2 text-lg font-semibold">{budgetUsed}%</p>
            </div>

            <div className="h-3 w-full rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                style={{ width: `${Math.min(Number(budgetUsed), 100)}%` }}
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/8 p-3">
              <Repeat size={18} />
            </div>
            <div>
              <p className="text-sm text-white/50">Recurring Snapshot</p>
              <h3 className="text-lg font-semibold">Commitments</h3>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/50">Recurring Rules</p>
              <p className="mt-2 text-lg font-semibold">{recurringItems.length}</p>
            </div>

            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-sm text-white/50">Recurring Total</p>
              <p className="mt-2 text-lg font-semibold">
                {formatCurrency(recurringTotal)}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function ReportCard({ title, value, icon, iconClass }) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <GlassCard className="p-5">
        <div className="flex items-center gap-3">
          <div className={`rounded-2xl p-3 ${iconClass}`}>{icon}</div>
          <div>
            <p className="text-sm text-white/50">{title}</p>
            <h3 className="mt-1 text-3xl font-bold">{value}</h3>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}