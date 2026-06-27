import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

import api from "../services/api";
import AuthLayout from "../layouts/AuthLayout";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      triggerShake();
      return;
    }
    try {
      setLoading(true);
      const response = await api.post("/auth/login", formData);
      login(response.data.token, response.data.user);
      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) => ({
    display: "flex",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: "14px",
    border: focusedField === field
      ? "1.5px solid #6366f1"
      : `1.5px solid ${theme === "dark" ? "rgba(99,102,241,0.15)" : "#e2e8f0"}`,
    background: focusedField === field
      ? (theme === "dark" ? "rgba(99,102,241,0.06)" : "#fafbff")
      : (theme === "dark" ? "rgba(255,255,255,0.03)" : "#f8fafc"),
    boxShadow: focusedField === field ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
    transition: "all 0.25s ease",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      <AuthLayout
        title="Welcome Back 👋"
        subtitle="Sign in to resume managing your tasks."
        footerText="Don't have an account?"
        footerLink="/register"
        footerLinkText="Register"
      >
        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          {/* Email */}
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Email Address
            </label>
            <div style={inputClass("email")}>
              <FaEnvelope style={{ color: "#6366f1", marginRight: "10px", flexShrink: 0 }} />
              <input
                type="email" name="email" placeholder="Enter your email"
                value={formData.email} onChange={handleChange}
                onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField("")}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--text-primary)" }}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Password
              </label>
              <Link to="#" style={{ fontSize: "12px", color: "#6366f1", fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>
            <div style={{ ...inputClass("password"), position: "relative" }}>
              <FaLock style={{ color: "#a855f7", marginRight: "10px", flexShrink: 0 }} />
              <input
                type={showPassword ? "text" : "password"} name="password" placeholder="Enter password"
                value={formData.password} onChange={handleChange}
                onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField("")}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "var(--text-primary)", paddingRight: "32px" }}
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "14px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--text-secondary)", cursor: "pointer" }}>
            <input type="checkbox" style={{ width: "16px", height: "16px", accentColor: "#6366f1" }} />
            Remember Me
          </label>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            style={{
              width: "100%", padding: "14px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              color: "#fff", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: "0 8px 24px -4px rgba(99,102,241,0.4)",
              transition: "all 0.3s ease",
            }}
          >
            {loading ? <><FaSpinner className="animate-spin" /> Logging in...</> : "Sign In →"}
          </motion.button>
        </motion.form>
      </AuthLayout>
    </motion.div>
  );
}

export default Login;