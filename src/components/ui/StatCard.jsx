import { motion } from "framer-motion";
import GlassCard from "./GlassCard";

export default function StatCard({
  title,
  value,
  subtitle,
  subtitleColor = "text-white/60",
  loading = false,
}) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <GlassCard className="p-5">
        <p className="text-sm text-white/60">{title}</p>

        {loading ? (
          <div className="mt-3 h-10 w-32 animate-pulse rounded-xl bg-white/10" />
        ) : (
          <h3 className="mt-3 text-3xl font-bold tracking-tight">{value}</h3>
        )}

        {loading ? (
          <div className="mt-3 h-4 w-24 animate-pulse rounded bg-white/10" />
        ) : (
          <p className={`mt-2 text-sm ${subtitleColor}`}>{subtitle}</p>
        )}
      </GlassCard>
    </motion.div>
  );
}