import {
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";

function formatCurrency(value) {

  return `Rs. ${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}

export default function BottomSection({
  summary,
}) {

  const savings =
    summary?.savings || 0;

  const income =
    summary?.income || 0;

  const expenses =
    summary?.expenses || 0;

  const savingsRate =
    summary?.savingsRate || 0;

  const insights = [
    {
      title:
        "Savings Performance",

      value:
        `${savingsRate.toFixed(1)}%`,

      icon:
        ArrowUpRight,

      color:
        "text-emerald-300",

      bg:
        "bg-emerald-500/10",

      description:
        "Your savings trend is improving steadily.",
    },

    {
      title:
        "Income Stream",

      value:
        formatCurrency(income),

      icon:
        Sparkles,

      color:
        "text-cyan-300",

      bg:
        "bg-cyan-500/10",

      description:
        "Monthly income flow remains healthy.",
    },

    {
      title:
        "Expense Ratio",

      value:
        formatCurrency(expenses),

      icon:
        ArrowDownRight,

      color:
        "text-rose-300",

      bg:
        "bg-rose-500/10",

      description:
        "Monitor unnecessary spending categories.",
    },
  ];

  return (

    <div
      className="
        rounded-[32px]
        border border-white/10
        bg-white/[0.04]
        p-8
      "
    >

      {/* HEADER */}

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
            Smart Analytics
          </p>

          <h2
            className="
              text-3xl
              font-black
              text-white
            "
          >
            Financial Insights
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
          Live Data
        </div>

      </div>

      {/* INSIGHTS GRID */}

      <div
        className="
          grid
          gap-6
          lg:grid-cols-3
        "
      >

        {insights.map(
          (
            item,
            index
          ) => {

            const Icon =
              item.icon;

            return (

              <div
                key={index}

                className="
                  rounded-[28px]
                  border border-white/10
                  bg-black/20
                  p-6
                "
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-sm
                        text-white/50
                      "
                    >
                      {item.title}
                    </p>

                    <h2
                      className={`
                        mt-4
                        text-3xl
                        font-black
                        ${item.color}
                      `}
                    >
                      {item.value}
                    </h2>

                  </div>

                  <div
                    className={`
                      rounded-2xl
                      p-4
                      ${item.bg}
                      ${item.color}
                    `}
                  >

                    <Icon size={22} />

                  </div>

                </div>

                <p
                  className="
                    mt-6
                    leading-7
                    text-white/60
                  "
                >
                  {item.description}
                </p>

              </div>
            );
          }
        )}

      </div>

      {/* SUMMARY */}

      <div
        className="
          mt-8
          rounded-[28px]
          border border-cyan-500/10
          bg-gradient-to-r
          from-cyan-500/10
          to-purple-500/10
          p-6
        "
      >

        <div
          className="
            flex
            flex-col
            gap-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >

          <div>

            <p className="text-cyan-300">
              Financial Summary
            </p>

            <h2
              className="
                mt-2
                text-4xl
                font-black
                text-white
              "
            >
              {formatCurrency(savings)}
            </h2>

            <p
              className="
                mt-3
                text-white/60
              "
            >
              Current retained savings after expenses.
            </p>

          </div>

          <div
            className="
              rounded-2xl
              border border-white/10
              bg-black/20
              px-6 py-4
            "
          >

            <p className="text-white/50">
              Savings Rate
            </p>

            <h2
              className="
                mt-2
                text-3xl
                font-black
                text-cyan-300
              "
            >
              {savingsRate.toFixed(1)}%
            </h2>

          </div>

        </div>

      </div>

    </div>
  );
}