import { motion } from "framer-motion";
import { FaTrash, FaPen, FaCalendarAlt, FaBriefcase, FaUser, FaGraduationCap, FaLaptopCode, FaCheck } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";

const PRIORITY_STYLES = {
  High:   { label: "#ef4444", bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.25)",  bar: "#ef4444" },
  Medium: { label: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", bar: "#f59e0b" },
  Low:    { label: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", bar: "#10b981" },
};

const CATEGORY_ICONS = {
  Personal: { icon: <FaUser />,        color: "#6366f1" },
  Work:     { icon: <FaBriefcase />,   color: "#06b6d4" },
  Study:    { icon: <FaGraduationCap />, color: "#a855f7" },
  Freelance:{ icon: <FaLaptopCode />, color: "#f59e0b" },
};

function TaskCard({ task, handleEdit, deleteTask, toggleStatus }) {
  const { theme } = useTheme();

  const priority = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;
  const category = CATEGORY_ICONS[task.category] || CATEGORY_ICONS.Personal;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === "Pending";
  const isCompleted = task.status === "Completed";

  const cardBg = theme === "dark" ? "#0d1526" : "#ffffff";
  const borderColor = theme === "dark" ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  return (
    <motion.div
      layout
      whileHover={{ y: -3, boxShadow: theme === "dark"
        ? `0 16px 40px rgba(0,0,0,0.35), 4px 0 0 ${priority.bar} inset`
        : `0 16px 40px rgba(0,0,0,0.08), 4px 0 0 ${priority.bar} inset`
      }}
      style={{
        background: cardBg,
        borderRadius: "18px",
        padding: "18px 20px",
        border: `1px solid ${borderColor}`,
        boxShadow: theme === "dark"
          ? `0 4px 16px rgba(0,0,0,0.25), 4px 0 0 ${priority.bar} inset`
          : `0 4px 16px rgba(0,0,0,0.04), 4px 0 0 ${priority.bar} inset`,
        opacity: isCompleted ? 0.6 : 1,
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top row: Checkbox + Title + Priority badge */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>

        {/* Completion Checkbox */}
        <motion.button
          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
          onClick={() => toggleStatus(task)}
          style={{
            width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0, marginTop: "2px",
            border: isCompleted ? "none" : `2px solid ${theme === "dark" ? "#334155" : "#cbd5e1"}`,
            background: isCompleted ? "linear-gradient(135deg, #6366f1, #a855f7)" : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s",
            boxShadow: isCompleted ? "0 3px 10px rgba(99,102,241,0.4)" : "none"
          }}
        >
          {isCompleted && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <FaCheck style={{ color: "#fff", fontSize: "9px" }} />
            </motion.div>
          )}
        </motion.button>

        {/* Title & Description */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontSize: "15px", fontWeight: 700, color: "var(--text-primary)",
            textDecoration: isCompleted ? "line-through" : "none",
            opacity: isCompleted ? 0.5 : 1, transition: "all 0.2s",
            wordBreak: "break-word"
          }}>
            {task.title}
          </h3>
          {task.description && (
            <p style={{
              fontSize: "12px", color: "var(--text-muted)", marginTop: "4px",
              lineHeight: 1.5, opacity: isCompleted ? 0.5 : 1
            }}>
              {task.description}
            </p>
          )}
        </div>

        {/* Priority Badge */}
        <div style={{
          padding: "4px 10px", borderRadius: "99px", flexShrink: 0,
          background: priority.bg, border: `1px solid ${priority.border}`,
          display: "flex", alignItems: "center", gap: "6px"
        }}>
          {task.priority === "High" && (
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%", background: "#ef4444",
              boxShadow: "0 0 6px #ef4444", animation: "pulse 1.5s infinite"
            }} />
          )}
          <span style={{ fontSize: "11px", fontWeight: 700, color: priority.label }}>
            {task.priority}
          </span>
        </div>
      </div>

      {/* Footer row */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px",
        marginTop: "14px", paddingTop: "12px",
        borderTop: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.05)" : "#f1f5f9"}`
      }}>

        {/* Category */}
        <div style={{
          display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px",
          borderRadius: "99px", background: `${category.color}12`, border: `1px solid ${category.color}25`,
          fontSize: "11px", fontWeight: 700, color: category.color
        }}>
          <span style={{ fontSize: "10px" }}>{category.icon}</span>
          {task.category}
        </div>

        {/* Due Date */}
        <div style={{
          display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px",
          borderRadius: "99px", fontSize: "11px", fontWeight: 600,
          background: isOverdue ? "rgba(239,68,68,0.1)" : (theme === "dark" ? "rgba(255,255,255,0.04)" : "#f8fafc"),
          border: `1px solid ${isOverdue ? "rgba(239,68,68,0.25)" : (theme === "dark" ? "rgba(255,255,255,0.06)" : "#e2e8f0")}`,
          color: isOverdue ? "#ef4444" : "var(--text-muted)"
        }}>
          <FaCalendarAlt style={{ fontSize: "10px" }} />
          <span>
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
              : "No Due Date"
            }
          </span>
          {isOverdue && <span style={{ fontWeight: 800, fontSize: "9px", textTransform: "uppercase", letterSpacing: "0.05em" }}>OVERDUE</span>}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Edit */}
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => handleEdit(task)}
          disabled={isCompleted}
          title="Edit Task"
          style={{
            width: "32px", height: "32px", borderRadius: "10px", border: "none",
            background: theme === "dark" ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)",
            color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: isCompleted ? "not-allowed" : "pointer", opacity: isCompleted ? 0.4 : 1,
            transition: "all 0.2s", fontSize: "12px"
          }}
        >
          <FaPen />
        </motion.button>

        {/* Delete */}
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => deleteTask(task._id)}
          title="Delete Task"
          style={{
            width: "32px", height: "32px", borderRadius: "10px", border: "none",
            background: "rgba(239,68,68,0.1)", color: "#ef4444",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s", fontSize: "12px"
          }}
        >
          <FaTrash />
        </motion.button>
      </div>
    </motion.div>
  );
}

export default TaskCard;
