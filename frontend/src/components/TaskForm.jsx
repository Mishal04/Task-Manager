import { useState } from "react";
import { motion } from "framer-motion";
import { FaPlus, FaSave, FaFolder, FaFlag, FaCalendarPlus, FaPenFancy } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";

function TaskForm({ formData, handleChange, addTask, editId, onCancel }) {
  const { theme } = useTheme();
  const [focusedField, setFocusedField] = useState("");

  const cardBg = theme === "dark" ? "#0d1526" : "#ffffff";
  const borderColor = theme === "dark" ? "rgba(255,255,255,0.06)" : "#f1f5f9";

  const labelStyle = {
    display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px",
    fontSize: "11px", fontWeight: 700, color: "var(--text-muted)",
    textTransform: "uppercase", letterSpacing: "0.08em"
  };

  const getInputStyle = (field) => ({
    width: "100%", padding: "12px 14px", borderRadius: "13px", fontSize: "13px",
    color: "var(--text-primary)", border: focusedField === field
      ? "1.5px solid #6366f1"
      : `1.5px solid ${theme === "dark" ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
    background: focusedField === field
      ? (theme === "dark" ? "rgba(99,102,241,0.06)" : "#fafbff")
      : (theme === "dark" ? "rgba(255,255,255,0.03)" : "#f8fafc"),
    boxShadow: focusedField === field ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
    outline: "none", transition: "all 0.25s ease",
  });

  const selectStyle = {
    width: "100%", padding: "12px 14px", borderRadius: "13px", fontSize: "13px",
    color: "var(--text-primary)", border: `1.5px solid ${theme === "dark" ? "rgba(255,255,255,0.06)" : "#e2e8f0"}`,
    background: theme === "dark" ? "rgba(255,255,255,0.03)" : "#f8fafc",
    outline: "none", cursor: "pointer", transition: "all 0.2s ease"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: cardBg, borderRadius: "22px", padding: "24px",
        border: `1px solid ${borderColor}`,
        boxShadow: theme === "dark"
          ? "0 8px 30px rgba(0,0,0,0.3)"
          : "0 8px 30px rgba(99,102,241,0.06)",
        position: "relative", overflow: "hidden", transition: "all 0.4s ease"
      }}
    >
      {/* Top accent glow */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, #6366f1, #a855f7, #06b6d4)"
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", paddingBottom: "16px", borderBottom: `1px solid ${borderColor}` }}>
        <div style={{
          padding: "10px", borderRadius: "12px",
          background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))",
          color: "#6366f1", fontSize: "16px", flexShrink: 0
        }}>
          <FaPenFancy />
        </div>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
            {editId ? "Update Task" : "Create New Task"}
          </h2>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
            {editId ? "Modify the existing task details" : "Fill in the form to add a new task"}
          </p>
        </div>
      </div>

      <form onSubmit={addTask} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Title */}
        <div>
          <label style={labelStyle}>Task Title</label>
          <input
            type="text" name="title" placeholder="What needs to be done?"
            value={formData.title} onChange={handleChange} required
            onFocus={() => setFocusedField("title")} onBlur={() => setFocusedField("")}
            style={getInputStyle("title")}
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            name="description" placeholder="Add details or notes..." rows="3"
            value={formData.description} onChange={handleChange}
            onFocus={() => setFocusedField("description")} onBlur={() => setFocusedField("")}
            style={{ ...getInputStyle("description"), resize: "none", lineHeight: "1.5" }}
          />
        </div>

        {/* Priority & Category - 2 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={labelStyle}><FaFlag style={{ fontSize: "9px", color: "#ef4444" }} /> Priority</label>
            <select name="priority" value={formData.priority} onChange={handleChange} style={selectStyle}>
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🔴 High</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}><FaFolder style={{ fontSize: "9px", color: "#6366f1" }} /> Category</label>
            <select name="category" value={formData.category} onChange={handleChange} style={selectStyle}>
              <option value="Personal">👤 Personal</option>
              <option value="Study">📚 Study</option>
              <option value="Work">💼 Work</option>
              <option value="Freelance">💻 Freelance</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label style={labelStyle}><FaCalendarPlus style={{ fontSize: "9px", color: "#06b6d4" }} /> Due Date</label>
          <input
            type="date" name="dueDate" value={formData.dueDate} onChange={handleChange}
            onFocus={() => setFocusedField("dueDate")} onBlur={() => setFocusedField("")}
            style={getInputStyle("dueDate")}
          />
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
          {editId && onCancel && (
            <button
              type="button" onClick={onCancel}
              style={{
                flex: 1, padding: "13px", borderRadius: "13px",
                border: `1.5px solid ${theme === "dark" ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
                background: "transparent", color: "var(--text-secondary)",
                fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s"
              }}
            >
              Cancel
            </button>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            type="submit"
            style={{
              flex: editId && onCancel ? 2 : 1, padding: "13px", borderRadius: "13px", border: "none",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: "0 6px 20px rgba(99,102,241,0.4)", transition: "all 0.3s ease"
            }}
          >
            {editId ? <><FaSave style={{ fontSize: "11px" }} /> Save Changes</> : <><FaPlus style={{ fontSize: "11px" }} /> Add Task</>}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

export default TaskForm;