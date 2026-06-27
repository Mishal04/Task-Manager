import { useState } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";

function CalendarWidget() {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear  = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const daysOfWeek = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays     = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const isToday = (day) => {
    if (!day) return false;
    const t = new Date();
    return t.getDate() === day && t.getMonth() === currentMonth && t.getFullYear() === currentYear;
  };

  const cardBg    = theme === "dark" ? "#0d1526" : "#ffffff";
  const borderCol = theme === "dark" ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const mutedCol  = theme === "dark" ? "rgba(255,255,255,0.04)" : "#f8fafc";

  return (
    <div style={{
      background: cardBg, borderRadius: "22px", padding: "20px",
      border: `1px solid ${borderCol}`,
      boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)",
      transition: "all 0.4s ease"
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
          {months[currentMonth]} {currentYear}
        </h3>
        <div style={{ display: "flex", gap: "4px" }}>
          {[FaChevronLeft, FaChevronRight].map((Icon, i) => (
            <button
              key={i}
              onClick={i === 0 ? () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1)) : () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))}
              style={{
                width: "30px", height: "30px", borderRadius: "9px", border: "none",
                background: mutedCol, color: "var(--text-muted)", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", fontSize: "10px", transition: "all 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#6366f120"; e.currentTarget.style.color = "#6366f1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = mutedCol; e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>

      {/* Weekday headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "8px", textAlign: "center" }}>
        {daysOfWeek.map((d) => (
          <div key={d} style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", padding: "4px 0", textTransform: "uppercase" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
        {days.map((day, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "1" }}>
            {day ? (
              <motion.span
                whileHover={{ scale: 1.15 }}
                style={{
                  width: "28px", height: "28px", borderRadius: "9px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: isToday(day) ? 800 : 500, cursor: "default",
                  background: isToday(day) ? "linear-gradient(135deg, #6366f1, #a855f7)" : "transparent",
                  color: isToday(day) ? "#fff" : "var(--text-primary)",
                  boxShadow: isToday(day) ? "0 4px 12px rgba(99,102,241,0.4)" : "none",
                  transition: "all 0.2s"
                }}
              >
                {day}
              </motion.span>
            ) : <span />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarWidget;
