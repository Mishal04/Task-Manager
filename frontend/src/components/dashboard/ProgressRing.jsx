import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

function ProgressRing({ tasks }) {
  const { theme } = useTheme();
  const total     = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;

  const radius      = 56;
  const strokeWidth = 11;
  const circumference = 2 * Math.PI * radius;
  const dashoffset    = circumference - (pct / 100) * circumference;

  const cardBg    = theme === "dark" ? "#0d1526" : "#ffffff";
  const borderCol = theme === "dark" ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const trackColor = theme === "dark" ? "#1e293b" : "#f1f5f9";

  const getMessage = () => {
    if (pct === 100 && total > 0) return { text: "🎉 Flawless productivity!", color: "#6366f1" };
    if (pct >= 75)                return { text: "Almost there, keep going!", color: "#10b981" };
    if (pct >= 50)                return { text: "Halfway there, great work!", color: "#f59e0b" };
    if (total > 0)                return { text: "Let's start completing tasks!", color: "#ef4444" };
    return                               { text: "No tasks yet. Create one!", color: "var(--text-muted)" };
  };

  const msg = getMessage();

  return (
    <div style={{
      background: cardBg, borderRadius: "22px", padding: "24px",
      border: `1px solid ${borderCol}`, height: "100%", display: "flex", flexDirection: "column",
      boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)",
      transition: "all 0.4s ease"
    }}>
      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Completion Rate</h3>
      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
        Overall task completion percentage.
      </p>

      {/* SVG Ring */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", margin: "20px 0", position: "relative" }}>
        <svg width="150" height="150" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="75" cy="75" r={radius} fill="transparent"
            stroke={trackColor} strokeWidth={strokeWidth} />
          <motion.circle cx="75" cy="75" r={radius} fill="transparent"
            stroke="url(#progGrad)" strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashoffset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="progGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ fontSize: "28px", fontWeight: 900, color: "var(--text-primary)", letterSpacing: "-1px", lineHeight: 1 }}
          >
            {pct}%
          </motion.span>
          <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>
            {completed}/{total} Done
          </span>
        </div>
      </div>

      {/* Footer message */}
      <div style={{
        paddingTop: "16px", borderTop: `1px solid ${borderCol}`,
        textAlign: "center", fontSize: "12px", fontWeight: 700, color: msg.color
      }}>
        {msg.text}
      </div>
    </div>
  );
}

export default ProgressRing;
