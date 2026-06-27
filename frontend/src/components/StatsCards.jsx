import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaClipboardList, FaCheckDouble, FaHourglassHalf, FaExclamationTriangle } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";

function AnimatedNumber({ value }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const end = parseInt(value, 10) || 0;
    if (end === 0) { setCurrent(0); return; }
    const duration = 700;
    const start = performance.now();
    const animate = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = t * (2 - t);
      setCurrent(Math.floor(ease * end));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);
  return <span>{current}</span>;
}

function StatsCards({ tasks }) {
  const { theme } = useTheme();
  const total      = tasks.length;
  const completed  = tasks.filter((t) => t.status === "Completed").length;
  const pending    = tasks.filter((t) => t.status === "Pending").length;
  const highP      = tasks.filter((t) => t.priority === "High").length;

  const cards = [
    {
      title: "Total Tasks", value: total,
      icon: <FaClipboardList />,
      gradient: "linear-gradient(135deg, #6366f1, #818cf8)",
      glow: "rgba(99,102,241,0.3)",
      bg: "rgba(99,102,241,0.08)",
      border: "rgba(99,102,241,0.2)",
      subColor: "#818cf8",
    },
    {
      title: "Completed", value: completed,
      icon: <FaCheckDouble />,
      gradient: "linear-gradient(135deg, #10b981, #34d399)",
      glow: "rgba(16,185,129,0.3)",
      bg: "rgba(16,185,129,0.08)",
      border: "rgba(16,185,129,0.2)",
      subColor: "#34d399",
    },
    {
      title: "Pending", value: pending,
      icon: <FaHourglassHalf />,
      gradient: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      glow: "rgba(245,158,11,0.3)",
      bg: "rgba(245,158,11,0.08)",
      border: "rgba(245,158,11,0.2)",
      subColor: "#fbbf24",
    },
    {
      title: "High Priority", value: highP,
      icon: <FaExclamationTriangle />,
      gradient: "linear-gradient(135deg, #ef4444, #f87171)",
      glow: "rgba(239,68,68,0.3)",
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.2)",
      subColor: "#f87171",
    },
  ];

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } } };

  const cardBg = theme === "dark" ? "#0d1526" : "#ffffff";
  const cardBorder = theme === "dark" ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  return (
    <motion.div
      variants={containerVariants} initial="hidden" animate="show"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "20px", marginBottom: "28px" }}
    >
      {cards.map((card) => (
        <motion.div
          key={card.title} variants={itemVariants}
          whileHover={{ y: -6, boxShadow: `0 20px 50px -10px ${card.glow}` }}
          style={{
            background: cardBg, borderRadius: "22px", padding: "22px",
            border: `1px solid ${cardBorder}`,
            boxShadow: `0 4px 20px rgba(0,0,0,${theme === "dark" ? "0.2" : "0.04"})`,
            transition: "all 0.3s ease", cursor: "default", position: "relative", overflow: "hidden"
          }}
        >
          {/* Background accent blob */}
          <div style={{
            position: "absolute", top: "-20px", right: "-20px", width: "80px", height: "80px",
            borderRadius: "50%", background: card.bg, filter: "blur(20px)", pointerEvents: "none"
          }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {card.title}
              </p>
              <h2 style={{ fontSize: "40px", fontWeight: 900, color: "var(--text-primary)", marginTop: "8px", letterSpacing: "-1px", lineHeight: 1 }}>
                <AnimatedNumber value={card.value} />
              </h2>
            </div>

            <div style={{
              width: "48px", height: "48px", borderRadius: "14px", flexShrink: 0,
              background: card.gradient, display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "18px", boxShadow: `0 6px 16px ${card.glow}`
            }}>
              {card.icon}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "16px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: card.subColor }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>Updated just now</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default StatsCards;