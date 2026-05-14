import CountUp from "react-countup";
import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  change,
  icon,
  glow,
}) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.01,
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
      }}
      className="
        relative
        overflow-hidden
        rounded-[30px]
        border
        border-white/10
        bg-white/[0.04]
        p-6
        backdrop-blur-3xl
      "
    >

      {/* Glow */}
      <div
        className={`
          absolute
          right-[-40px]
          top-[-40px]
          h-40
          w-40
          rounded-full
          blur-3xl
          ${glow}
        `}
      />

      {/* Top */}
      <div className="relative flex items-start justify-between">

        <div>

          <p className="text-sm text-white/50">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-white">

            ₹
            <CountUp
              end={value}
              duration={2}
              separator=","
            />

          </h2>

        </div>

        <div
          className="
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-2xl
            bg-white/10
            backdrop-blur-xl
          "
        >
          {icon}
        </div>

      </div>

      {/* Bottom */}
      <div className="relative mt-8 flex items-center justify-between">

        <div
          className="
            rounded-xl
            border
            border-cyan-400/20
            bg-cyan-400/10
            px-3
            py-2
            text-sm
            font-semibold
            text-cyan-300
          "
        >
          {change}
        </div>

        <p className="text-sm text-white/40">
          vs last month
        </p>

      </div>

    </motion.div>
  );
}