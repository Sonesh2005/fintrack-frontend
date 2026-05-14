import {
  LayoutDashboard,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  Target,
  BarChart3,
  Settings,
  Sparkles,
} from "lucide-react";

const menu = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    active: true,
  },
  {
    icon: Wallet,
    label: "Accounts",
  },
  {
    icon: ArrowDownCircle,
    label: "Income",
  },
  {
    icon: ArrowUpCircle,
    label: "Expenses",
  },
  {
    icon: PiggyBank,
    label: "Budget",
  },
  {
    icon: Target,
    label: "Goals",
  },
  {
    icon: BarChart3,
    label: "Reports",
  },
  {
    icon: Settings,
    label: "Settings",
  },
];

export default function Sidebar() {
  return (
    <aside
      className="
        relative
        flex
        h-screen
        w-[290px]
        flex-col
        border-r
        border-white/10
        bg-white/[0.03]
        backdrop-blur-3xl
      "
    >

      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-purple-500/5 pointer-events-none" />

      {/* Logo */}
      <div className="relative flex items-center gap-4 px-8 py-8">

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            from-cyan-400
            to-purple-500
            shadow-[0_0_35px_rgba(34,211,238,0.45)]
          "
        >
          <Sparkles className="h-7 w-7 text-white" />
        </div>

        <div>

          <h1 className="text-2xl font-black tracking-tight text-white">
            FinTrack
          </h1>

          <p className="text-sm text-cyan-300">
            AI Finance OS
          </p>

        </div>
      </div>

      {/* Menu */}
      <nav className="relative mt-4 flex-1 space-y-3 px-4">

        {menu.map((item, index) => {

          const Icon = item.icon;

          return (
            <button
              key={index}
              className={`
                group
                relative
                flex
                w-full
                items-center
                gap-4
                overflow-hidden
                rounded-2xl
                px-5
                py-4
                text-left
                transition-all
                duration-300

                ${
                  item.active
                    ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/20 shadow-[0_0_25px_rgba(34,211,238,0.12)]"
                    : "hover:bg-white/5"
                }
              `}
            >

              {/* Hover Glow */}
              <div
                className="
                  absolute
                  inset-0
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                  bg-gradient-to-r
                  from-cyan-500/10
                  to-purple-500/10
                "
              />

              {/* Icon */}
              <div
                className={`
                  relative
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl

                  ${
                    item.active
                      ? "bg-gradient-to-br from-cyan-400 to-purple-500 shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                      : "bg-white/5"
                  }
                `}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>

              {/* Label */}
              <span
                className={`
                  relative
                  text-base
                  font-medium

                  ${
                    item.active
                      ? "text-white"
                      : "text-white/70 group-hover:text-white"
                  }
                `}
              >
                {item.label}
              </span>

            </button>
          );
        })}
      </nav>

      {/* Bottom Card */}
      <div className="relative p-5">

        <div
          className="
            overflow-hidden
            rounded-3xl
            border
            border-cyan-400/20
            bg-gradient-to-br
            from-cyan-500/10
            to-purple-500/10
            p-6
          "
        >

          <div className="absolute right-[-30px] top-[-30px] h-24 w-24 rounded-full bg-cyan-400/20 blur-2xl" />

          <h3 className="relative text-lg font-bold text-white">
            AI Insights
          </h3>

          <p className="relative mt-2 text-sm leading-6 text-white/60">
            Unlock advanced financial predictions and AI analytics.
          </p>

          <button
            className="
              relative
              mt-5
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-cyan-400
              to-purple-500
              py-3
              font-semibold
              text-white
              shadow-[0_0_30px_rgba(34,211,238,0.35)]
              transition-all
              duration-300
              hover:scale-[1.02]
            "
          >
            Upgrade Pro
          </button>

        </div>
      </div>

    </aside>
  );
}