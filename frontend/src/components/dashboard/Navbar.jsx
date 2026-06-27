import { useState, useRef, useEffect } from "react";
import { FaBell, FaMoon, FaSun, FaSearch, FaBars, FaChevronDown, FaSignOutAlt, FaTasks } from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar({ search, setSearch, onMenuClick, activeTab, setActiveTab }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [bellBouncing, setBellBouncing] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { logout(); toast.success("Logged out"); navigate("/login"); };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const titles = {
    dashboard: { h: "Dashboard 👋", p: user ? `Welcome back, ${user.name}!` : "Manage your tasks efficiently." },
    tasks:     { h: "My Tasks 📋", p: "Create, update, and manage your tasks." },
    analytics: { h: "Analytics 📊", p: "Visualize your performance and progress." },
  };

  const headerBg = theme === "dark"
    ? "rgba(6,11,24,0.92)"
    : "rgba(255,255,255,0.92)";

  const borderCol = theme === "dark" ? "rgba(99,102,241,0.1)" : "#f1f5f9";

  const iconBtnStyle = {
    width: "38px", height: "38px", borderRadius: "12px", border: `1px solid ${borderCol}`,
    background: theme === "dark" ? "rgba(255,255,255,0.04)" : "#f8fafc",
    color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", transition: "all 0.2s ease", flexShrink: 0
  };

  return (
    <header style={{
      background: headerBg, backdropFilter: "blur(20px) saturate(180%)",
      borderBottom: `1px solid ${borderCol}`, position: "sticky", top: 0,
      zIndex: 30, padding: "14px 24px", display: "flex", alignItems: "center",
      justifyContent: "space-between", gap: "16px", transition: "background 0.4s ease",
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button onClick={onMenuClick} style={{ ...iconBtnStyle, display: "none" }} className="lg:!hidden">
          <FaBars />
        </button>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px", lineHeight: 1 }}>
            {(titles[activeTab] || titles.dashboard).h}
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px", fontWeight: 500 }}>
            {(titles[activeTab] || titles.dashboard).p}
          </p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

        {/* Search Bar */}
        {activeTab !== "analytics" && (
          <motion.div
            animate={{ width: searchFocused ? 260 : 190 }}
            transition={{ duration: 0.3 }}
            style={{ position: "relative", display: "none" }}
            className="md:!block"
          >
            <FaSearch style={{
              position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)",
              color: searchFocused ? "#6366f1" : "var(--text-muted)", transition: "color 0.2s", fontSize: "12px"
            }} />
            <input
              type="text" placeholder="Search tasks..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
              style={{
                width: "100%", paddingLeft: "34px", paddingRight: "12px", paddingTop: "9px", paddingBottom: "9px",
                borderRadius: "12px", fontSize: "13px", color: "var(--text-primary)",
                background: theme === "dark" ? "rgba(255,255,255,0.04)" : "#f8fafc",
                border: searchFocused ? "1.5px solid #6366f1" : `1.5px solid ${borderCol}`,
                boxShadow: searchFocused ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
                outline: "none", transition: "all 0.25s ease",
              }}
            />
          </motion.div>
        )}

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}
          onClick={toggleTheme} style={iconBtnStyle} title="Toggle theme"
        >
          {theme === "light"
            ? <FaMoon style={{ color: "#6366f1" }} />
            : <FaSun style={{ color: "#f59e0b", fontSize: "16px" }} />
          }
        </motion.button>

        {/* Notification Bell */}
        <button
          style={{ ...iconBtnStyle, position: "relative" }}
          onClick={() => { setBellBouncing(true); setTimeout(() => setBellBouncing(false), 800); }}
          title="Notifications"
        >
          <motion.span animate={bellBouncing ? { rotate: [-20, 20, -20, 20, -10, 10, 0] } : {}} transition={{ duration: 0.5 }}>
            <FaBell style={{ fontSize: "13px" }} />
          </motion.span>
          <span style={{
            position: "absolute", top: "8px", right: "8px", width: "7px", height: "7px",
            borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 0 2px var(--bg-surface)"
          }} />
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "24px", background: borderCol, flexShrink: 0 }} className="hidden sm:block" />

        {/* Profile */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px 4px 4px",
              borderRadius: "14px", border: "none", background: "none", cursor: "pointer" }}
          >
            <motion.div whileHover={{ scale: 1.05 }} style={{
              width: "36px", height: "36px", borderRadius: "12px", flexShrink: 0,
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 800, fontSize: "13px",
              boxShadow: "0 3px 10px rgba(99,102,241,0.35)"
            }}>
              {getInitials(user?.name)}
            </motion.div>
            <FaChevronDown style={{
              fontSize: "9px", color: "var(--text-muted)",
              transition: "transform 0.3s", transform: profileOpen ? "rotate(180deg)" : "rotate(0deg)"
            }} className="hidden sm:block" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: "absolute", right: 0, marginTop: "10px", width: "220px", zIndex: 50,
                  background: theme === "dark" ? "#0d1526" : "#fff",
                  border: `1px solid ${borderCol}`, borderRadius: "18px",
                  boxShadow: theme === "dark"
                    ? "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)"
                    : "0 20px 50px rgba(99,102,241,0.12)",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${borderCol}` }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{user?.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{user?.email}</div>
                </div>

                {/* Links */}
                <div style={{ padding: "8px" }}>
                  {[
                    { label: "Dashboard", id: "dashboard", color: "#6366f1" },
                    { label: "My Tasks", id: "tasks", color: "#a855f7" },
                    { label: "Analytics", id: "analytics", color: "#06b6d4" },
                  ].map((item) => (
                    <button key={item.id}
                      onClick={() => { setActiveTab(item.id); setProfileOpen(false); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 12px", borderRadius: "12px", border: "none",
                        background: activeTab === item.id ? `${item.color}12` : "transparent",
                        color: activeTab === item.id ? item.color : "var(--text-secondary)",
                        fontSize: "13px", fontWeight: 600, cursor: "pointer", textAlign: "left", transition: "all 0.15s"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = theme === "dark" ? "rgba(255,255,255,0.04)" : "#f8fafc"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = activeTab === item.id ? `${item.color}12` : "transparent"; }}
                    >
                      <FaTasks style={{ fontSize: "11px", color: item.color }} />
                      {item.label}
                    </button>
                  ))}

                  <div style={{ height: "1px", background: borderCol, margin: "6px 0" }} />

                  <button onClick={handleLogout}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 12px", borderRadius: "12px", border: "none",
                      background: "transparent", color: "#ef4444",
                      fontSize: "13px", fontWeight: 700, cursor: "pointer", textAlign: "left", transition: "all 0.15s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <FaSignOutAlt style={{ fontSize: "11px" }} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
