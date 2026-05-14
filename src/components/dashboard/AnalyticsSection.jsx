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
  "#8b5cf6",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#3b82f6",
];

function formatMonth(month) {

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // IF NUMBER

  if (
    typeof month === "number"
  ) {

    return (
      months[month - 1] || ""
    );
  }

  // IF STRING

  if (
    typeof month === "string"
  ) {

    return month.slice(0, 3);
  }

  return "";
}

export default function AnalyticsSection({
  monthlyData,
  categoryData,
}) {

  const formattedMonthly =
    monthlyData?.map(
      (item) => ({
        ...item,

        month:
          formatMonth(
            item.month
          ),
      })
    ) || [];

  return (

    <div className="space-y-8">

      {/* MONTHLY ANALYTICS */}

      <div
        className="
          relative
          overflow-hidden
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

        {/* GLOWS */}

        <div
          className="
            absolute
            -right-24
            -top-24
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

          <div
            className="
              mb-8
              flex
              items-center
              justify-between
            "
          >

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
                Monthly Overview
              </h2>

            </div>

          </div>

          <div className="h-[420px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={formattedMonthly}
              >

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

      {/* CATEGORY CHART */}

      <div
        className="
          rounded-[32px]
          border border-white/10
          bg-white/[0.04]
          p-8
        "
      >

        <div className="mb-8">

          <p className="text-cyan-400">
            Spending Analytics
          </p>

          <h2
            className="
              text-3xl
              font-black
              text-white
            "
          >
            Expense Categories
          </h2>

        </div>

        <div
          className="
            grid
            gap-8
            xl:grid-cols-[420px_1fr]
          "
        >

          {/* PIE */}

          <div className="h-[360px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={categoryData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={80}
                  outerRadius={130}
                  paddingAngle={3}
                >

                  {categoryData?.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={index}
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

          </div>

          {/* LEGENDS */}

          <div className="space-y-4">

            {categoryData?.map(
              (
                item,
                index
              ) => (

                <div
                  key={index}

                  className="
                    flex
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/20
                    px-5
                    py-4
                  "
                >

                  <div
                    className="
                      flex
                      items-center
                      gap-4
                    "
                  >

                    <div
                      className="
                        h-4
                        w-4
                        rounded-full
                      "
                      style={{
                        background:
                          COLORS[
                            index %
                              COLORS.length
                          ],
                      }}
                    />

                    <span
                      className="
                        font-medium
                        text-white
                      "
                    >
                      {item.category}
                    </span>

                  </div>

                  <span
                    className="
                      font-semibold
                      text-cyan-300
                    "
                  >
                    Rs.{" "}
                    {Number(
                      item.amount || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </span>

                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  );
}