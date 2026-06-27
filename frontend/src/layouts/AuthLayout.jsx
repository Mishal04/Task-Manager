import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoon, FaSun, FaTasks, FaCheckCircle, FaCalendarAlt, FaChartLine, FaRocket } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";

function AuthLayout({ children, title, subtitle, footerText, footerLink, footerLinkText }) {
  const { theme, toggleTheme } = useTheme();

  const features = [
    { icon: <FaCheckCircle className="text-emerald-400" />, text: "Organize tasks with priority tags & custom categories" },
    { icon: <FaCalendarAlt className="text-violet-400" />, text: "Track due dates with clear visual indicators" },
    { icon: <FaChartLine className="text-cyan-400" />, text: "Monitor weekly productivity with beautiful analytics" },
  ];

  return (
    <div className="min-h-screen flex transition-colors duration-500"
      style={{ backgroundColor: "var(--bg-base)", color: "var(--text-primary)" }}
    >
      {/* Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-50 p-3 rounded-2xl shadow-lg border cursor-pointer transition-all duration-300"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--bg-border)",
          color: "var(--text-secondary)",
        }}
        aria-label="Toggle Theme"
      >
        {theme === "light"
          ? <FaMoon className="text-indigo-500 text-lg" />
          : <FaSun className="text-amber-400 text-lg" />
        }
      </motion.button>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12"
        style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}
      >
        {/* Decorative glows */}
        <div className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.20) 0%, transparent 70%)" }} />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-lg text-white">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              <FaRocket className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight" style={{ background: "linear-gradient(90deg, #e0e7ff, #f5d0fe)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                TaskFlow Pro
              </h1>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase mt-0.5" style={{ color: "rgba(199,210,254,0.7)" }}>
                SaaS Productivity Suite
              </p>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-bold leading-tight mb-5"
            style={{ color: "rgba(241,245,249,0.95)" }}
          >
            Streamline your workflow, amplify your output.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base leading-relaxed mb-10"
            style={{ color: "rgba(148,163,184,0.9)" }}
          >
            A modern, beautifully designed task management platform built for high-performance individuals and teams.
          </motion.p>

          {/* Feature Cards */}
          <div className="space-y-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 6 }}
                className="flex items-center gap-4 p-4 rounded-2xl cursor-default transition-all duration-300"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(8px)" }}
              >
                <div className="text-xl flex-shrink-0">{f.icon}</div>
                <p className="text-sm font-medium" style={{ color: "rgba(226,232,240,0.9)" }}>{f.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-4 mt-10"
          >
            {[
              { label: "Productivity", value: "+47%", color: "#6366f1" },
              { label: "Tasks Done", value: "100K+", color: "#a855f7" },
              { label: "Users", value: "12K+", color: "#06b6d4" },
            ].map((stat) => (
              <div key={stat.label} className="flex-1 p-3 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[10px] font-semibold mt-0.5 uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.7)" }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 relative overflow-hidden">
        {/* Blurred ambient blobs */}
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 90 }}
          className="w-full max-w-md rounded-3xl shadow-2xl relative z-10 p-8 md:p-10"
          style={{
            background: theme === "dark" ? "rgba(13,21,38,0.80)" : "rgba(255,255,255,0.88)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: theme === "dark" ? "1px solid rgba(99,102,241,0.15)" : "1px solid rgba(226,232,240,0.9)",
            boxShadow: theme === "dark"
              ? "0 25px 60px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.08)"
              : "0 25px 60px -10px rgba(99,102,241,0.15), 0 0 0 1px rgba(226,232,240,0.8)"
          }}
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
            >
              <FaRocket className="text-white" />
            </div>
            <span className="text-xl font-black" style={{ background: "linear-gradient(90deg, #6366f1, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              TaskFlow Pro
            </span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
            {title}
          </h2>
          <p className="mt-2 mb-8 text-sm" style={{ color: "var(--text-muted)" }}>{subtitle}</p>

          {children}

          <div className="mt-7 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            {footerText}{" "}
            <Link
              to={footerLink}
              className="font-bold transition-colors"
              style={{ color: "var(--color-primary)" }}
            >
              {footerLinkText}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AuthLayout;