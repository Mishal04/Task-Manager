import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaQuoteLeft, FaSync } from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";

const QUOTES = [
  { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Your mind is for having ideas, not holding them.", author: "David Allen" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "Productivity is being able to do things you were never able to do before.", author: "Franz Kafka" },
  { text: "You don't need a new plan. You need a commitment.", author: "Seth Godin" },
  { text: "Amateurs wait for inspiration. The rest of us get up and go to work.", author: "Stephen King" },
  { text: "Focus is a muscle — you build it by using it.", author: "Unknown" },
  { text: "Small progress is still progress.", author: "Unknown" },
  { text: "A year from now you'll wish you started today.", author: "Karen Lamb" },
];

function ProductivityQuote() {
  const { theme } = useTheme();
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const quote = QUOTES[idx];

  const cardBg    = theme === "dark" ? "#0d1526" : "#ffffff";
  const borderCol = theme === "dark" ? "rgba(99,102,241,0.15)" : "#ede9fe";

  return (
    <div style={{
      background: cardBg, borderRadius: "22px", padding: "22px",
      border: `1px solid ${borderCol}`, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between",
      boxShadow: theme === "dark"
        ? "0 4px 20px rgba(0,0,0,0.2)"
        : "0 4px 20px rgba(139,92,246,0.06)",
      position: "relative", overflow: "hidden", transition: "all 0.4s ease"
    }}>
      {/* Background blob */}
      <div style={{
        position: "absolute", top: "-30%", right: "-20%", width: "120px", height: "120px",
        borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Top section */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              padding: "8px", borderRadius: "10px",
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))", color: "#a855f7"
            }}>
              <FaQuoteLeft style={{ fontSize: "14px" }} />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Daily Inspiration
            </span>
          </div>
          <button
            onClick={() => setIdx((i) => (i + 1) % QUOTES.length)}
            title="New quote"
            style={{ padding: "6px", borderRadius: "9px", border: "none", background: "transparent", color: "var(--text-muted)", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#6366f1"; e.currentTarget.style.background = "rgba(99,102,241,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}
          >
            <FaSync style={{ fontSize: "11px" }} />
          </button>
        </div>

        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ fontSize: "14px", fontStyle: "italic", color: "var(--text-secondary)", lineHeight: 1.7, fontWeight: 500 }}
        >
          "{quote.text}"
        </motion.p>
      </div>

      {/* Author */}
      <motion.div
        key={`author-${idx}`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px" }}
      >
        <div style={{ height: "2px", flex: 1, background: "linear-gradient(90deg, #6366f1, #a855f7, transparent)" }} />
        <span style={{ fontSize: "12px", fontWeight: 700, color: "#a855f7" }}>— {quote.author}</span>
      </motion.div>
    </div>
  );
}

export default ProductivityQuote;
