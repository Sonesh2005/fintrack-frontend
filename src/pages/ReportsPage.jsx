import { motion } from "framer-motion";
import toast from "react-hot-toast";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

import {
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  Brain,
  Target,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const COLORS = [
  "#22d3ee",
  "#3b82f6",
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
];

function formatCurrency(value) {

  return `Rs. ${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}

export default function ReportsPage() {

  const totalIncome = 145000;

  const totalExpense = 82000;

  const savings =
    totalIncome - totalExpense;

  const savingsRate = Math.round(
    (savings / totalIncome) * 100
  );

  const healthScore = 92;

  const budgetLimit = 90000;

  const budgetUsed = Math.round(
    (totalExpense / budgetLimit) *
      100
  );

  const monthlyData = [
    {
      month: "Jan",
      income: 35000,
      expense: 22000,
    },

    {
      month: "Feb",
      income: 42000,
      expense: 28000,
    },

    {
      month: "Mar",
      income: 38000,
      expense: 26000,
    },

    {
      month: "Apr",
      income: 52000,
      expense: 30000,
    },

    {
      month: "May",
      income: 61000,
      expense: 34000,
    },
  ];

  const categoryData = [
    {
      name: "Food",
      value: 18000,
    },

    {
      name: "Shopping",
      value: 12000,
    },

    {
      name: "Bills",
      value: 15000,
    },

    {
      name: "Travel",
      value: 8000,
    },

    {
      name: "Entertainment",
      value: 6000,
    },
  ];

  const recurringItems = [
    {
      name: "Netflix",
      amount: 649,
    },

    {
      name: "Spotify",
      amount: 119,
    },

    {
      name: "Rent",
      amount: 18000,
    },
  ];

  const recurringTotal =
    recurringItems.reduce(
      (acc, item) =>
        acc + item.amount,
      0
    );

  const downloadPDF = async () => {

    try {

      const doc = new jsPDF();

      const drawCard = (
        x,
        y,
        w,
        h,
        title,
        value,
        accent = [34, 211, 238]
      ) => {

        doc.setFillColor(
          16,
          24,
          40
        );

        doc.roundedRect(
          x,
          y,
          w,
          h,
          6,
          6,
          "F"
        );

        doc.setDrawColor(
          ...accent
        );

        doc.roundedRect(
          x,
          y,
          w,
          h,
          6,
          6
        );

        doc.setTextColor(
          148,
          163,
          184
        );

        doc.setFontSize(10);

        doc.text(
          title,
          x + 5,
          y + 10
        );

        doc.setTextColor(
          255,
          255,
          255
        );

        doc.setFontSize(18);

        doc.text(
          value,
          x + 5,
          y + 24
        );
      };

      const drawProgressBar = (
        x,
        y,
        w,
        value,
        color = [34, 211, 238]
      ) => {

        doc.setFillColor(
          30,
          41,
          59
        );

        doc.roundedRect(
          x,
          y,
          w,
          8,
          4,
          4,
          "F"
        );

        doc.setFillColor(
          ...color
        );

        doc.roundedRect(
          x,
          y,
          (w * value) / 100,
          8,
          4,
          4,
          "F"
        );
      };

      // PAGE 1

      doc.setFillColor(
        6,
        11,
        25
      );

      doc.rect(
        0,
        0,
        210,
        297,
        "F"
      );

      doc.setTextColor(
        34,
        211,
        238
      );

      doc.setFontSize(30);

      doc.text(
        "FinTrack AI Report",
        14,
        22
      );

      doc.setTextColor(
        148,
        163,
        184
      );

      doc.setFontSize(11);

      doc.text(
        `Generated ${new Date().toLocaleString()}`,
        14,
        30
      );

      doc.setFillColor(
        15,
        23,
        42
      );

      doc.roundedRect(
        14,
        42,
        182,
        60,
        8,
        8,
        "F"
      );

      doc.setTextColor(
        255,
        255,
        255
      );

      doc.setFontSize(18);

      doc.text(
        "Financial Health Score",
        24,
        58
      );

      doc.setTextColor(
        34,
        211,
        238
      );

      doc.setFontSize(42);

      doc.text(
        `${healthScore}`,
        24,
        86
      );

      doc.setTextColor(
        255,
        255,
        255
      );

      doc.setFontSize(16);

      doc.text(
        "/100",
        52,
        86
      );

      drawCard(
        14,
        118,
        42,
        34,
        "Income",
        formatCurrency(totalIncome)
      );

      drawCard(
        61,
        118,
        42,
        34,
        "Expense",
        formatCurrency(totalExpense),
        [168, 85, 247]
      );

      drawCard(
        108,
        118,
        42,
        34,
        "Savings",
        formatCurrency(savings),
        [16, 185, 129]
      );

      drawCard(
        155,
        118,
        41,
        34,
        "Rate",
        `${savingsRate}%`,
        [59, 130, 246]
      );

      doc.setFillColor(
        15,
        23,
        42
      );

      doc.roundedRect(
        14,
        165,
        182,
        70,
        8,
        8,
        "F"
      );

      doc.setTextColor(
        34,
        211,
        238
      );

      doc.setFontSize(18);

      doc.text(
        "AI Insights",
        20,
        180
      );

      doc.setTextColor(
        255,
        255,
        255
      );

      doc.setFontSize(11);

      doc.text(
        `• Savings rate increased to ${savingsRate}%`,
        22,
        196
      );

      doc.text(
        `• Food category dominates spending`,
        22,
        208
      );

      doc.text(
        `• Monthly recurring spend is ${formatCurrency(recurringTotal)}`,
        22,
        220
      );

      doc.text(
        "Budget Usage",
        20,
        250
      );

      drawProgressBar(
        20,
        256,
        160,
        budgetUsed,
        [168, 85, 247]
      );

      doc.setTextColor(
        168,
        85,
        247
      );

      doc.text(
        `${budgetUsed}%`,
        184,
        262
      );

      // PAGE 2

      doc.addPage();

      doc.setFillColor(
        8,
        16,
        32
      );

      doc.rect(
        0,
        0,
        210,
        297,
        "F"
      );

      doc.setTextColor(
        34,
        211,
        238
      );

      doc.setFontSize(24);

      doc.text(
        "Monthly Analytics",
        14,
        20
      );

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 500)
      );

      const barChart =
        document.getElementById(
          "pdf-bar-chart"
        );

      const barCanvas =
        await html2canvas(
          barChart,
          {
            backgroundColor:
              "#081020",

            scale: 2,
          }
        );

      const barImage =
        barCanvas.toDataURL(
          "image/png"
        );

      doc.addImage(
        barImage,
        "PNG",
        10,
        35,
        190,
        90
      );

      autoTable(doc, {
        startY: 140,

        head: [
          [
            "Month",
            "Income",
            "Expense",
          ],
        ],

        body:
          monthlyData.map(
            (month) => [
              month.month,

              formatCurrency(
                month.income
              ),

              formatCurrency(
                month.expense
              ),
            ]
          ),

        theme: "grid",

        styles: {
          fillColor: [
            18,
            28,
            52,
          ],

          textColor: [
            255,
            255,
            255,
          ],
        },

        headStyles: {
          fillColor: [
            34,
            211,
            238,
          ],

          textColor: [0, 0, 0],
        },
      });

      // PAGE 3

      doc.addPage();

      doc.setFillColor(
        8,
        16,
        32
      );

      doc.rect(
        0,
        0,
        210,
        297,
        "F"
      );

      doc.setTextColor(
        34,
        211,
        238
      );

      doc.setFontSize(24);

      doc.text(
        "Expense Categories",
        14,
        20
      );

      const pieChart =
        document.getElementById(
          "pdf-pie-chart"
        );

      const pieCanvas =
        await html2canvas(
          pieChart,
          {
            backgroundColor:
              "#081020",

            scale: 2,
          }
        );

      const pieImage =
        pieCanvas.toDataURL(
          "image/png"
        );

      doc.addImage(
        pieImage,
        "PNG",
        10,
        35,
        190,
        110
      );

      autoTable(doc, {
        startY: 160,

        head: [
          [
            "Category",
            "Amount",
          ],
        ],

        body:
          categoryData.map(
            (item) => [
              item.name,

              formatCurrency(
                item.value
              ),
            ]
          ),

        theme: "grid",

        styles: {
          fillColor: [
            18,
            28,
            52,
          ],

          textColor: [
            255,
            255,
            255,
          ],
        },

        headStyles: {
          fillColor: [
            168,
            85,
            247,
          ],

          textColor: [
            255,
            255,
            255,
          ],
        },
      });

      doc.save(
        "fintrack-premium-report.pdf"
      );

      toast.success(
        "Premium PDF Downloaded"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "PDF export failed"
      );
    }
  };

  return (

    <div className="space-y-8 p-6">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-cyan-400">
            AI Financial Intelligence
          </p>

          <h1 className="text-4xl font-black text-white">
            Reports Center
          </h1>

        </div>

        <button
          onClick={downloadPDF}
          className="
            flex items-center gap-3
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-purple-500
            px-6 py-4
            text-white
          "
        >

          <Download size={20} />

          Download PDF

        </button>

      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

        <Card
          title="Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp size={20} />}
        />

        <Card
          title="Expense"
          value={formatCurrency(totalExpense)}
          icon={<TrendingDown size={20} />}
        />

        <Card
          title="Savings"
          value={formatCurrency(savings)}
          icon={<Wallet size={20} />}
        />

        <Card
          title="Savings Rate"
          value={`${savingsRate}%`}
          icon={<Target size={20} />}
        />

      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        <div
  className="
    relative overflow-hidden
    rounded-[32px]
    border border-cyan-500/10
    bg-gradient-to-br
    from-[#081120]
    via-[#0b132b]
    to-[#15162c]
    p-8
    shadow-2xl
  "
>

  {/* GLOW */}

  <div
    className="
      absolute
      -top-24
      -right-24
      h-64
      w-64
      rounded-full
      bg-cyan-500/10
      blur-3xl
    "
  />

  <div
    className="
      absolute
      bottom-0
      left-0
      h-40
      w-40
      rounded-full
      bg-purple-500/10
      blur-3xl
    "
  />

  <div className="relative z-10">

    <div className="mb-8 flex items-center justify-between">

      <div>

        <p className="text-cyan-400">
          Financial Analytics
        </p>

        <h2
          className="
            text-3xl
            font-black
            text-white
          "
        >
          Monthly Analytics
        </h2>

      </div>

      <div
        className="
          rounded-2xl
          border border-cyan-500/20
          bg-cyan-500/10
          px-4 py-2
          text-cyan-300
        "
      >
        +18.4%
      </div>

    </div>

    <div className="h-[420px]">
      <ResponsiveContainer
  width="100%"
  height="100%"
>

  <AreaChart data={monthlyData}>

    <defs>

      <linearGradient
        id="incomeGradient"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >

        <stop
          offset="0%"
          stopColor="#22d3ee"
          stopOpacity={0.7}
        />

        <stop
          offset="100%"
          stopColor="#22d3ee"
          stopOpacity={0}
        />

      </linearGradient>

      <linearGradient
        id="expenseGradient"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >

        <stop
          offset="0%"
          stopColor="#8b5cf6"
          stopOpacity={0.7}
        />

        <stop
          offset="100%"
          stopColor="#8b5cf6"
          stopOpacity={0}
        />

      </linearGradient>

    </defs>

    <CartesianGrid
      strokeDasharray="3 3"
      stroke="rgba(255,255,255,0.05)"
      vertical={false}
    />

    <XAxis
      dataKey="month"
      stroke="#64748b"
      tickLine={false}
      axisLine={false}
    />

    <YAxis
      stroke="#64748b"
      tickLine={false}
      axisLine={false}
    />

    <Tooltip
      contentStyle={{
        background:
          "#0f172a",

        border:
          "1px solid rgba(34,211,238,0.2)",

        borderRadius:
          "16px",

        color: "white",
      }}
    />

    <Area
      type="monotone"
      dataKey="income"
      stroke="#22d3ee"
      strokeWidth={4}
      fill="url(#incomeGradient)"
    />

    <Area
      type="monotone"
      dataKey="expense"
      stroke="#8b5cf6"
      strokeWidth={4}
      fill="url(#expenseGradient)"
    />

  </AreaChart>

</ResponsiveContainer>
          </div>

  </div>

</div>  

        <ChartCard title="Expense Categories">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={categoryData}
                innerRadius={80}
                outerRadius={120}
                dataKey="value"
              >

                {categoryData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={entry.name}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </ChartCard>

      </div>

      <div
        className="
          rounded-3xl
          border border-cyan-500/10
          bg-white/[0.03]
          p-8
        "
      >

        <div className="flex items-center gap-4">

          <div
            className="
              rounded-2xl
              bg-cyan-500/10
              p-4
              text-cyan-300
            "
          >
            <Brain size={24} />
          </div>

          <div>

            <p className="text-cyan-400">
              AI Insights
            </p>

            <h2 className="text-2xl font-bold text-white">
              Financial Summary
            </h2>

          </div>

        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">

          <InsightCard
            title="Healthy Savings"
            description={`Savings rate is ${savingsRate}%`}
          />

          <InsightCard
            title="Budget Usage"
            description={`${budgetUsed}% of budget used`}
          />

          <InsightCard
            title="Recurring Rules"
            description={`${recurringItems.length} active subscriptions`}
          />

        </div>

      </div>

      {/* HIDDEN PDF CHARTS */}

      <div
        className="
          fixed
          left-0
          top-0
          opacity-0
          pointer-events-none
        "
      >

        <div
          id="pdf-bar-chart"
          className="
            h-[400px]
            w-[700px]
            bg-[#081020]
            p-8
          "
        >

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <AreaChart data={monthlyData}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />

              <XAxis
                dataKey="month"
                stroke="#94a3b8"
              />

              <YAxis stroke="#94a3b8" />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="income"
                stroke="#22d3ee"
                fill="#22d3ee"
              />

              <Area
                type="monotone"
                dataKey="expense"
                stroke="#a855f7"
                fill="#a855f7"
              />

            </AreaChart>

          </ResponsiveContainer>

        </div>

        <div
          id="pdf-pie-chart"
          className="
            mt-10
            h-[450px]
            w-[700px]
            bg-[#081020]
            p-8
          "
        >

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={categoryData}
                innerRadius={90}
                outerRadius={140}
                dataKey="value"
              >

                {categoryData.map(
                  (
                    entry,
                    index
                  ) => (

                    <Cell
                      key={entry.name}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />

                  )
                )}

              </Pie>

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
  icon,
}) {

  return (

    <motion.div
      whileHover={{
        y: -5,
      }}
    >

      <div
        className="
          rounded-3xl
          border border-cyan-500/10
          bg-white/[0.03]
          p-6
        "
      >

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-white/50">
              {title}
            </p>

            <h2
              className="
                mt-3
                text-4xl
                font-black
                text-white
              "
            >
              {value}
            </h2>

          </div>

          <div
            className="
              rounded-3xl
              bg-cyan-500/10
              p-4
              text-cyan-300
            "
          >
            {icon}
          </div>

        </div>

      </div>

    </motion.div>
  );
}

function ChartCard({
  title,
  children,
}) {

  return (

    <div
      className="
        rounded-3xl
        border border-cyan-500/10
        bg-white/[0.03]
        p-6
      "
    >

      <h2
        className="
          mb-6
          text-2xl
          font-bold
          text-white
        "
      >
        {title}
      </h2>

      <div className="h-[350px]">
        {children}
      </div>

    </div>
  );
}

function InsightCard({
  title,
  description,
}) {

  return (

    <div
      className="
        rounded-3xl
        border border-white/10
        bg-white/5
        p-6
      "
    >

      <h3
        className="
          text-lg
          font-semibold
          text-white
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-3
          leading-7
          text-white/60
        "
      >
        {description}
      </p>

    </div>
  );
}