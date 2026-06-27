import { motion } from "framer-motion";
import { useTheme } from "../../hooks/useTheme";

function WeeklyChart({ tasks }) {
  const { theme } = useTheme();
  const dow = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { dateString: d.toDateString(), dayLabel: dow[d.getDay()], completed: 0, pending: 0 };
  });

  tasks.forEach((t) => {
    const ds = new Date(t.createdAt || t.updatedAt || Date.now()).toDateString();
    const m  = last7.find((d) => d.dateString === ds);
    if (m) { t.status === "Completed" ? m.completed++ : m.pending++; }
  });

  const maxVal = Math.max(...last7.map((d) => d.completed + d.pending), 4);

  const cardBg    = theme === "dark" ? "#0d1526" : "#ffffff";
  const borderCol = theme === "dark" ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const trackBg   = theme === "dark" ? "rgba(255,255,255,0.04)" : "#f1f5f9";

  return (
    <div style={{
      background: cardBg, borderRadius: "22px", padding: "24px",
      border: `1px solid ${borderCol}`,
      boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)",
      transition: "all 0.4s ease", height: "100%", display: "flex", flexDirection: "column"
    }}>
      <div style={{ marginBottom: "4px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Weekly Progress</h3>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>Tasks created & completed over the last 7 days.</p>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", marginTop: "14px", marginBottom: "16px" }}>
        {[
          { color: "linear-gradient(135deg, #6366f1, #a855f7)", label: "Completed" },
          { color: theme === "dark" ? "rgba(255,255,255,0.08)" : "#e2e8f0", label: "Pending" }
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "4px", background: l.color, flexShrink: 0 }} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "8px", paddingTop: "8px" }}>
        {last7.map((day, idx) => {
          const total    = day.completed + day.pending;
          const compPct  = total > 0 ? (day.completed / maxVal) * 100 : 0;
          const pendPct  = total > 0 ? (day.pending  / maxVal) * 100 : 0;

          return (
            <div key={idx} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "100%", height: "120px", display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "2px", position: "relative" }}
                title={`${day.completed} completed · ${day.pending} pending`}
              >
                {pendPct > 0 && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${pendPct}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.06 }}
                    style={{ width: "100%", background: trackBg, borderRadius: "4px 4px 0 0", minHeight: "4px" }}
                  />
                )}
                {compPct > 0 && (
                  <motion.div
                    initial={{ height: 0 }} animate={{ height: `${compPct}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.06 + 0.1 }}
                    style={{
                      width: "100%", background: "linear-gradient(180deg, #a855f7, #6366f1)",
                      borderRadius: "4px 4px 0 0", minHeight: "4px",
                      boxShadow: "0 -4px 12px rgba(99,102,241,0.3)"
                    }}
                  />
                )}
                {total === 0 && (
                  <div style={{ width: "100%", height: "4px", background: trackBg, borderRadius: "4px" }} />
                )}
              </div>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", marginTop: "8px" }}>
                {day.dayLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyChart;
