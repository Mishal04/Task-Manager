import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaTasks, FaChartBar, FaSignOutAlt, FaTimes, FaRocket } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../../hooks/useTheme";

function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const { logout, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const menu = [
    { id: "dashboard", icon: <FaHome />, label: "Dashboard", accent: "#6366f1" },
    { id: "tasks",     icon: <FaTasks />, label: "My Tasks",  accent: "#a855f7" },
    { id: "analytics", icon: <FaChartBar />, label: "Analytics", accent: "#06b6d4" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const sidebarBg = theme === "dark" ? "#060b18" : "#ffffff";
  const borderColor = theme === "dark" ? "rgba(99,102,241,0.1)" : "#f1f5f9";

  const SidebarContent = () => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      {/* Header */}
      <div>
        <div style={{ padding: "24px", borderBottom: `1px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "14px", flexShrink: 0,
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)"
            }}>
              <FaRocket style={{ color: "#fff", fontSize: "16px" }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: "17px", color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
                TaskFlow Pro
              </div>
              <div style={{ fontSize: "9px", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                Productivity Suite
              </div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} style={{
              padding: "8px", borderRadius: "10px", border: "none", cursor: "pointer",
              background: theme === "dark" ? "rgba(255,255,255,0.05)" : "#f1f5f9",
              color: "var(--text-muted)", display: "flex"
            }}>
              <FaTimes />
            </button>
          )}
        </div>

        {/* User Profile Card */}
        {user && (
          <div style={{
            margin: "16px", padding: "14px", borderRadius: "16px",
            background: theme === "dark" ? "rgba(99,102,241,0.07)" : "linear-gradient(135deg, #faf5ff, #f0f9ff)",
            border: `1px solid ${theme === "dark" ? "rgba(99,102,241,0.12)" : "#e9d5ff"}`,
            display: "flex", alignItems: "center", gap: "12px"
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px", flexShrink: 0,
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: "14px",
              boxShadow: "0 4px 10px rgba(99,102,241,0.3)"
            }}>
              {getInitials(user.name)}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.name}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {menu.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); if (onClose) onClose(); }}
                style={{
                  position: "relative", width: "100%", display: "flex", alignItems: "center", gap: "14px",
                  padding: "13px 16px", borderRadius: "14px", border: "none", cursor: "pointer",
                  background: isActive
                    ? `linear-gradient(135deg, ${item.accent}22, ${item.accent}11)`
                    : "transparent",
                  borderLeft: isActive ? `3px solid ${item.accent}` : "3px solid transparent",
                  color: isActive ? item.accent : "var(--text-secondary)",
                  fontWeight: isActive ? 700 : 600,
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = theme === "dark" ? "rgba(255,255,255,0.04)" : "#f8fafc"; e.currentTarget.style.color = "var(--text-primary)"; }}}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}}
              >
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span style={{
                    marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%",
                    background: item.accent, boxShadow: `0 0 6px ${item.accent}`
                  }} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div style={{ padding: "16px", borderTop: `1px solid ${borderColor}` }}>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            padding: "12px", borderRadius: "14px", border: "1.5px solid rgba(239,68,68,0.3)",
            background: "rgba(239,68,68,0.06)", color: "#ef4444", fontWeight: 700, fontSize: "14px",
            cursor: "pointer", transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.06)"; e.currentTarget.style.color = "#ef4444"; }}
        >
          <FaSignOutAlt /> Logout
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar */}
      <aside style={{
        width: "270px", minHeight: "100vh", background: sidebarBg, flexShrink: 0,
        borderRight: `1px solid ${borderColor}`, display: "none", transition: "background 0.4s ease"
      }}
        className="lg:!block"
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={onClose}
              style={{ position: "fixed", inset: 0, background: "#000", zIndex: 40 }}
              className="lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              style={{
                position: "fixed", top: 0, bottom: 0, left: 0, width: "270px",
                background: sidebarBg, zIndex: 50, display: "flex", flexDirection: "column",
                boxShadow: "4px 0 30px rgba(0,0,0,0.3)", transition: "background 0.4s ease"
              }}
              className="lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
