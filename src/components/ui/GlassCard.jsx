export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-3xl
        border border-white/10
        bg-white/5
        backdrop-blur-2xl
        shadow-2xl
        hover:border-cyan-400/20
        hover:shadow-cyan-500/10
        transition-all
        duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}