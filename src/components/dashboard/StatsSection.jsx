import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
} from "lucide-react";

import { motion } from "framer-motion";

function formatCurrency(value) {

  return `Rs. ${Number(
    value || 0
  ).toLocaleString("en-IN")}`;
}

export default function StatsSection({
  summary,
}) {

  const stats = [
    {
      title: "Total Balance",

      value:
        formatCurrency(
          summary?.balance
        ),

      icon: Wallet,

      glow:
        "from-cyan-500/20 to-cyan-500/5",

      iconColor:
        "text-cyan-300",
    },

    {
      title: "Income",

      value:
        formatCurrency(
          summary?.income
        ),

      icon: TrendingUp,

      glow:
        "from-emerald-500/20 to-emerald-500/5",

      iconColor:
        "text-emerald-300",
    },

    {
      title: "Expenses",

      value:
        formatCurrency(
          summary?.expenses
        ),

      icon: TrendingDown,

      glow:
        "from-rose-500/20 to-rose-500/5",

      iconColor:
        "text-rose-300",
    },

    {
      title: "Savings",

      value:
        formatCurrency(
          summary?.savings
        ),

      icon: PiggyBank,

      glow:
        "from-purple-500/20 to-purple-500/5",

      iconColor:
        "text-purple-300",
    },
  ];

  return (

    <div
      className="
        grid
        gap-6
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >

      {stats.map(
        (item, index) => {

          const Icon =
            item.icon;

          return (

            <motion.div
              key={item.title}

              initial={{
                opacity: 0,
                y: 30,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              transition={{
                delay:
                  index * 0.1,
              }}

              whileHover={{
                y: -6,
              }}
            >

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-6
                  backdrop-blur-xl
                "
              >

                {/* GLOW */}

                <div
                  className={`
                    absolute
                    inset-0
                    bg-gradient-to-br
                    ${item.glow}
                  `}
                />

                {/* CONTENT */}

                <div className="relative z-10">

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
                          text-white/60
                        "
                      >
                        {item.title}
                      </p>

                      <h2
                        className="
                          mt-4
                          text-3xl
                          font-black
                          tracking-tight
                          text-white
                        "
                      >
                        {item.value}
                      </h2>

                    </div>

                    <div
                      className={`
                        rounded-2xl
                        bg-black/20
                        p-4
                        ${item.iconColor}
                      `}
                    >

                      <Icon size={24} />

                    </div>

                  </div>

                </div>

              </div>

            </motion.div>
          );
        }
      )}

    </div>
  );
}