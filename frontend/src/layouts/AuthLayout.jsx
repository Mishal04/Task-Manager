import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoon, FaSun, FaCheckCircle, FaCalendarAlt, FaChartLine, FaRocket } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";

function AuthLayout({ children, title, subtitle, footerText, footerLink, footerLinkText }) {
  const { theme, toggleTheme } = useTheme();

  const features = [
    { icon: <FaCheckCircle style={{ color: "#34d399" }} />, text: "Organize tasks with priority tags & custom categories" },
    { icon: <FaCalendarAlt style={{ color: "#a78bfa" }} />, text: "Track due dates with clear visual indicators" },
    { icon: <FaChartLine style={{ color: "#22d3ee" }} />, text: "Monitor weekly productivity with beautiful analytics" },
  ];

  return (
    /* Outer shell — always fills the full viewport */
    <div style={{
      minHeight: "100vh",
      display: "flex",
      backgroundColor: "var(--bg-base)",
      color: "var(--text-primary)",
      transition: "background-color 0.5s ease, color 0.5s ease",
    }}>

      {/* ── Theme Toggle ── */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        style={{
          position: "fixed", top: "20px", right: "20px", zIndex: 50,
          padding: "12px", borderRadius: "16px",
          background: "var(--bg-surface)",
          border: "1px solid var(--bg-border)",
          color: "var(--text-secondary)",
          cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease", display: "flex",
        }}
        aria-label="Toggle Theme"
      >
        {theme === "light"
          ? <FaMoon style={{ color: "#6366f1", fontSize: "18px" }} />
          : <FaSun  style={{ color: "#f59e0b", fontSize: "18px" }} />
        }
      </motion.button>

      {/* ── LEFT PANEL (desktop only) ── */}
      <div style={{
        display: "none",
        width: "50%",
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
      }}
        className="lg:!flex"
      >
        {/* Decorative glows */}
        <div style={{ position: "absolute", top: "-15%", left: "-15%", width: "55%", height: "55%", borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-15%", right: "-15%", width: "55%", height: "55%", borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(168,85,247,0.20) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: "30%", height: "30%", borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "480px", color: "#fff" }}>
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}
          >
            <div style={{
              width: "56px", height: "56px", borderRadius: "18px", flexShrink: 0,
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 24px rgba(99,102,241,0.5)",
            }}>
              <FaRocket style={{ fontSize: "22px", color: "#fff" }} />
            </div>
            <div>
              <h1 style={{
                fontSize: "28px", fontWeight: 900, letterSpacing: "-0.5px",
                background: "linear-gradient(90deg, #e0e7ff, #f5d0fe)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                TaskFlow Pro
              </h1>
              <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: "2px", color: "rgba(199,210,254,0.7)" }}>
                SaaS Productivity Suite
              </p>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1.25, marginBottom: "20px", color: "rgba(241,245,249,0.95)" }}
          >
            Streamline your workflow, amplify your output.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7, delay: 0.2 }}
            style={{ fontSize: "15px", lineHeight: 1.7, marginBottom: "36px", color: "rgba(148,163,184,0.9)" }}
          >
            A modern, beautifully designed task management platform built for high-performance individuals and teams.
          </motion.p>

          {/* Feature cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -25 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                whileHover={{ x: 6 }}
                style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "16px", borderRadius: "16px", cursor: "default",
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                  backdropFilter: "blur(8px)", transition: "all 0.3s ease",
                }}
              >
                <div style={{ fontSize: "18px", flexShrink: 0 }}>{f.icon}</div>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "rgba(226,232,240,0.9)" }}>{f.text}</p>
              </motion.div>
            ))}
          </div>

          {/* Stat pills */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            style={{ display: "flex", gap: "16px", marginTop: "36px" }}
          >
            {[
              { label: "Productivity", value: "+47%",  color: "#6366f1" },
              { label: "Tasks Done",   value: "100K+", color: "#a855f7" },
              { label: "Users",        value: "12K+",  color: "#06b6d4" },
            ].map((stat) => (
              <div key={stat.label} style={{
                flex: 1, padding: "12px", borderRadius: "14px", textAlign: "center",
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: "20px", fontWeight: 900, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: "9px", fontWeight: 700, marginTop: "2px", textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(148,163,184,0.7)" }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Form) ── */}
      {/*
        Use a flex column wrapper that is min-h-screen.
        The inner scroller allows the card to be centered when content fits,
        and scrollable when the register form overflows on small screens.
      */}
      <div style={{
        flex: 1,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        position: "relative",
      }}>
        {/* Ambient blobs */}
        <div style={{ position: "fixed", top: "10%",  right: "5%",  width: "320px", height: "320px", borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)", zIndex: 0 }} />
        <div style={{ position: "fixed", bottom: "10%", left: "52%", width: "280px", height: "280px", borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)", zIndex: 0 }} />

        {/* Centering wrapper — grows to push card to center */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
          position: "relative",
          zIndex: 1,
        }}>
          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 90 }}
            style={{
              width: "100%", maxWidth: "440px",
              borderRadius: "28px",
              padding: "40px",
              background: theme === "dark"
                ? "rgba(13,21,38,0.85)"
                : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(24px) saturate(180%)",
              border: theme === "dark"
                ? "1px solid rgba(99,102,241,0.18)"
                : "1px solid rgba(226,232,240,0.95)",
              boxShadow: theme === "dark"
                ? "0 32px 64px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1)"
                : "0 32px 64px -12px rgba(99,102,241,0.18), 0 0 0 1px rgba(226,232,240,0.9)",
            }}
          >
            {/* Mobile logo */}
            <div className="lg:hidden" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "14px", flexShrink: 0,
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
              }}>
                <FaRocket style={{ color: "#fff", fontSize: "16px" }} />
              </div>
              <span style={{
                fontSize: "20px", fontWeight: 900,
                background: "linear-gradient(90deg, #6366f1, #a855f7)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                TaskFlow Pro
              </span>
            </div>

            <h2 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-primary)" }}>
              {title}
            </h2>
            <p style={{ marginTop: "8px", marginBottom: "28px", fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              {subtitle}
            </p>

            {children}

            <div style={{ marginTop: "24px", textAlign: "center", fontSize: "13px", color: "var(--text-secondary)" }}>
              {footerText}{" "}
              <Link
                to={footerLink}
                style={{ color: "var(--color-primary)", fontWeight: 700, textDecoration: "none" }}
              >
                {footerLinkText}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;