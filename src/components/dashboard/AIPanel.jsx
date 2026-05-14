import {
  Brain,
  Mic,
  MessageSquare,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function AIPanel({
  summary,
}) {

  const savingsRate =
    summary?.savingsRate || 0;

  const savings =
    summary?.savings || 0;

  const insight =
    savingsRate >= 30
      ? "Your savings performance is improving steadily this month."
      : "Expenses are affecting your savings growth.";

  return (

    <div className="space-y-8">

      {/* MAIN AI PANEL */}

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
        "
      >

        {/* GLOW */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-br
            from-cyan-500/5
            via-transparent
            to-purple-500/10
          "
        />

        <div
          className="
            absolute
            -right-24
            top-0
            h-72
            w-72
            rounded-full
            bg-cyan-500/10
            blur-3xl
          "
        />

        {/* CONTENT */}

        <div className="relative z-10">

          {/* HEADER */}

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p className="text-cyan-400">
                AI Assistant
              </p>

              <h2
                className="
                  text-4xl
                  font-black
                  text-white
                "
              >
                FinTrack AI
              </h2>

            </div>

            <div
              className="
                rounded-2xl
                bg-cyan-500/10
                p-4
                text-cyan-300
              "
            >

              <Sparkles size={28} />

            </div>

          </div>

          {/* AI ORB */}

          <div
            className="
              relative
              mt-12
              flex
              items-center
              justify-center
            "
          >

            {/* OUTER */}

            <div
              className="
                absolute
                h-72
                w-72
                rounded-full
                border
                border-cyan-500/10
                bg-cyan-500/5
                blur-2xl
              "
            />

            {/* RING */}

            <div
              className="
                flex
                h-60
                w-60
                items-center
                justify-center
                rounded-full
                border border-cyan-400/20
                bg-gradient-to-br
                from-cyan-500/10
                to-purple-500/10
                animate-pulse
              "
            >

              <div
                className="
                  flex
                  h-40
                  w-40
                  items-center
                  justify-center
                  rounded-full
                  border border-white/10
                  bg-[#081120]
                "
              >

                <Brain
                  size={72}
                  className="
                    text-cyan-300
                  "
                />

              </div>

            </div>

          </div>

          {/* INSIGHT */}

          <div
            className="
              mt-10
              rounded-2xl
              border border-cyan-500/10
              bg-cyan-500/5
              p-5
            "
          >

            <p className="text-cyan-300">
              AI Insight
            </p>

            <p
              className="
                mt-3
                leading-7
                text-white/70
              "
            >
              {insight}
            </p>

          </div>

          {/* ACTIONS */}

          <div
            className="
              mt-6
              grid
              gap-4
              md:grid-cols-2
            "
          >

            {/* CHAT */}

            <button
              className="
                group
                rounded-2xl
                border border-cyan-500/20
                bg-cyan-500/10
                p-5
                text-left
                transition
                hover:scale-[1.02]
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <MessageSquare
                  className="
                    text-cyan-300
                  "
                />

                <h3
                  className="
                    text-xl
                    font-bold
                    text-white
                  "
                >
                  AI Chat
                </h3>

              </div>

              <p
                className="
                  mt-4
                  leading-6
                  text-white/60
                "
              >
                Ask questions about
                your spending,
                savings and goals.
              </p>

            </button>

            {/* VOICE */}

            <button
              className="
                group
                rounded-2xl
                border border-purple-500/20
                bg-purple-500/10
                p-5
                text-left
                transition
                hover:scale-[1.02]
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <Mic
                  className="
                    text-purple-300
                  "
                />

                <h3
                  className="
                    text-xl
                    font-bold
                    text-white
                  "
                >
                  Voice Assistant
                </h3>

              </div>

              <p
                className="
                  mt-4
                  leading-6
                  text-white/60
                "
              >
                Speak naturally to
                interact with your
                finance assistant.
              </p>

            </button>

          </div>

        </div>

      </div>

      {/* STATS */}

      <div className="space-y-4">

        <div
          className="
            rounded-[28px]
            border border-white/10
            bg-white/[0.04]
            p-6
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <div>

              <p className="text-white/50">
                Savings Growth
              </p>

              <h2
                className="
                  mt-3
                  text-4xl
                  font-black
                  text-emerald-300
                "
              >
                {savingsRate.toFixed(1)}%
              </h2>

            </div>

            <TrendingUp
              size={26}
              className="
                text-emerald-300
              "
            />

          </div>

        </div>

        <div
          className="
            rounded-[28px]
            border border-white/10
            bg-white/[0.04]
            p-6
          "
        >

          <p className="text-white/50">
            Net Savings
          </p>

          <h2
            className="
              mt-3
              text-4xl
              font-black
              text-cyan-300
            "
          >
            Rs.{" "}
            {Number(
              savings
            ).toLocaleString(
              "en-IN"
            )}
          </h2>

        </div>

      </div>

    </div>
  );
}