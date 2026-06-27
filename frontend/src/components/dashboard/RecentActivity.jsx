import { motion } from "framer-motion";
import { FaPlusCircle, FaCheckCircle, FaTrashAlt, FaPenNib, FaInfoCircle } from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";

const TYPE_CONFIG = {
  create:   { icon: <FaPlusCircle />,  color: "#6366f1" },
  complete: { icon: <FaCheckCircle />, color: "#10b981" },
  delete:   { icon: <FaTrashAlt />,   color: "#ef4444" },
  update:   { icon: <FaPenNib />,     color: "#f59e0b" },
  info:     { icon: <FaInfoCircle />, color: "#06b6d4" },
};

const DEFAULT_ACTIVITIES = [
  { id: "1", text: "Logged into TaskFlow Pro dashboard", time: "Just now",    type: "info"    },
  { id: "2", text: "Created study workspace folder",    time: "1 hour ago",  type: "create"  },
  { id: "3", text: "Completed database setup checklist",time: "3 hours ago", type: "complete"},
];

function RecentActivity({ activities }) {
  const { theme } = useTheme();
  const list = activities && activities.length > 0 ? activities : DEFAULT_ACTIVITIES;

  const cardBg    = theme === "dark" ? "#0d1526" : "#ffffff";
  const borderCol = theme === "dark" ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  return (
    <div style={{
      background: cardBg, borderRadius: "22px", padding: "22px",
      border: `1px solid ${borderCol}`, height: "100%", display: "flex", flexDirection: "column",
      boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)",
      transition: "all 0.4s ease"
    }}>
      <div style={{ marginBottom: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Recent Activity</h3>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
          Realtime session log of task operations.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
        {list.slice(0, 8).map((act, i) => {
          const cfg = TYPE_CONFIG[act.type] || TYPE_CONFIG.info;
          return (
            <motion.div
              key={act.id || i}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}
            >
              {/* Icon bubble */}
              <div style={{
                width: "30px", height: "30px", borderRadius: "10px", flexShrink: 0,
                background: `${cfg.color}15`, border: `1px solid ${cfg.color}25`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: cfg.color, fontSize: "12px"
              }}>
                {cfg.icon}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4, wordBreak: "break-word" }}>
                  {act.text}
                </p>
                <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--text-muted)", display: "block", marginTop: "2px" }}>
                  {act.time}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{ paddingTop: "14px", borderTop: `1px solid ${borderCol}`, textAlign: "center" }}>
        <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
          • Active session tracking •
        </span>
      </div>
    </div>
  );
}

export default RecentActivity;
