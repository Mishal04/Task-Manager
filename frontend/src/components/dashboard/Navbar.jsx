import { useState, useRef, useEffect } from "react";
import { FaBell, FaMoon, FaSun, FaSearch, FaBars, FaChevronDown, FaSignOutAlt, FaTasks, FaCheckCircle, FaCircle, FaTimes } from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar({ search, setSearch, onMenuClick, activeTab, setActiveTab, desktopSidebarOpen }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [bellBouncing, setBellBouncing] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "Task \"Design UI\" is due today", time: "2m ago", read: false, color: "#ef4444" },
    { id: 2, text: "You completed 5 tasks this week!", time: "1h ago", read: false, color: "#10b981" },
    { id: 3, text: "New task \"Review PR\" was added", time: "3h ago", read: true, color: "#6366f1" },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
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
        <button 
          onClick={onMenuClick} 
          style={iconBtnStyle} 
          className={desktopSidebarOpen ? "lg:hidden" : ""}
        >
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
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            style={{ ...iconBtnStyle, position: "relative" }}
            onClick={() => {
              setBellBouncing(true);
              setTimeout(() => setBellBouncing(false), 800);
              setNotifOpen((o) => !o);
            }}
            title="Notifications"
          >
            <motion.span animate={bellBouncing ? { rotate: [-20, 20, -20, 20, -10, 10, 0] } : {}} transition={{ duration: 0.5 }}>
              <FaBell style={{ fontSize: "13px" }} />
            </motion.span>
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "-4px", right: "-4px",
                minWidth: "16px", height: "16px", borderRadius: "99px",
                background: "#ef4444", color: "#fff",
                fontSize: "9px", fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 3px",
                boxShadow: "0 0 0 2px var(--bg-surface)"
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.18 }}
                style={{
                  position: "absolute", right: 0, marginTop: "10px", width: "300px", zIndex: 50,
                  background: theme === "dark" ? "#0d1526" : "#fff",
                  border: `1px solid ${borderCol}`, borderRadius: "18px",
                  boxShadow: theme === "dark"
                    ? "0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)"
                    : "0 20px 50px rgba(99,102,241,0.12)",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div style={{ padding: "14px 16px", borderBottom: `1px solid ${borderCol}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>Notifications</div>
                    {unreadCount > 0 && (
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{unreadCount} unread</div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
                        style={{ fontSize: "11px", fontWeight: 600, color: "#6366f1", background: "none", border: "none", cursor: "pointer" }}
                      >
                        Mark all read
                      </button>
                    )}
                    <button onClick={() => setNotifOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", padding: "2px" }}>
                      <FaTimes style={{ fontSize: "11px" }} />
                    </button>
                  </div>
                </div>

                {/* List */}
                <div style={{ maxHeight: "260px", overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
                      No notifications yet
                    </div>
                  ) : notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, read: true } : n))}
                      style={{
                        padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: "10px",
                        cursor: "pointer", transition: "background 0.15s",
                        background: notif.read ? "transparent" : (theme === "dark" ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.04)"),
                        borderBottom: `1px solid ${borderCol}`,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = theme === "dark" ? "rgba(255,255,255,0.04)" : "#f8fafc"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = notif.read ? "transparent" : (theme === "dark" ? "rgba(99,102,241,0.05)" : "rgba(99,102,241,0.04)"); }}
                    >
                      <div style={{ marginTop: "3px", flexShrink: 0 }}>
                        {notif.read
                          ? <FaCircle style={{ fontSize: "7px", color: "var(--text-muted)" }} />
                          : <FaCheckCircle style={{ fontSize: "12px", color: notif.color }} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "12px", fontWeight: notif.read ? 500 : 700, color: "var(--text-primary)", lineHeight: 1.5 }}>
                          {notif.text}
                        </div>
                        <div style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "3px", fontWeight: 500 }}>{notif.time}</div>
                      </div>
                      {!notif.read && (
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: notif.color, flexShrink: 0, marginTop: "5px" }} />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
