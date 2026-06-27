import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";

import api from "../services/api";
import AuthLayout from "../layouts/AuthLayout";

function Register() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [strength, setStrength] = useState({ score: 0, text: "", color: "#94a3b8" });

  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  useEffect(() => {
    const pwd = formData.password;
    if (!pwd) { setStrength({ score: 0, text: "", color: "#94a3b8" }); return; }
    if (pwd.length < 6) { setStrength({ score: 1, text: "Weak — min 6 chars", color: "#ef4444" }); return; }
    const hasL = /[a-zA-Z]/.test(pwd), hasN = /[0-9]/.test(pwd), hasS = /[^A-Za-z0-9]/.test(pwd);
    if (hasL && hasN && hasS && pwd.length >= 8) setStrength({ score: 3, text: "Strong password ✓", color: "#10b981" });
    else if (hasL && hasN) setStrength({ score: 2, text: "Medium — add symbols", color: "#f59e0b" });
    else setStrength({ score: 1, text: "Weak — mix letters & numbers", color: "#ef4444" });
  }, [formData.password]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields"); triggerShake(); return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters"); triggerShake(); return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match"); triggerShake(); return;
    }
    try {
      setLoading(true);
      await api.post("/auth/register", { name: formData.name, email: formData.email, password: formData.password });
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field, iconColor) => ({
    display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "14px",
    border: focusedField === field ? "1.5px solid #6366f1" : `1.5px solid ${theme === "dark" ? "rgba(99,102,241,0.15)" : "#e2e8f0"}`,
    background: focusedField === field ? (theme === "dark" ? "rgba(99,102,241,0.06)" : "#fafbff") : (theme === "dark" ? "rgba(255,255,255,0.03)" : "#f8fafc"),
    boxShadow: focusedField === field ? "0 0 0 3px rgba(99,102,241,0.12)" : "none",
    transition: "all 0.25s ease",
    position: "relative",
  });

  const iconFor = { name: "#06b6d4", email: "#6366f1", password: "#a855f7", confirmPassword: "#f59e0b" };

  const labelStyle = {
    display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: 700,
    color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em"
  };

  const innerInputStyle = {
    flex: 1, background: "transparent", border: "none", outline: "none",
    fontSize: "14px", color: "var(--text-primary)"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      <AuthLayout
        title="Create Account 🚀"
        subtitle="Join TaskFlow Pro and start organizing your work."
        footerText="Already have an account?"
        footerLink="/login"
        footerLinkText="Login"
      >
        <motion.form
          onSubmit={handleSubmit}
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", flexDirection: "column", gap: "18px" }}
        >
          {/* Full Name */}
          <div>
            <label style={labelStyle}>Full Name</label>
            <div style={inputStyle("name")}>
              <FaUser style={{ color: iconFor.name, marginRight: "10px", flexShrink: 0 }} />
              <input type="text" name="name" placeholder="John Doe"
                value={formData.name} onChange={handleChange}
                onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField("")}
                style={innerInputStyle} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>Email Address</label>
            <div style={inputStyle("email")}>
              <FaEnvelope style={{ color: iconFor.email, marginRight: "10px", flexShrink: 0 }} />
              <input type="email" name="email" placeholder="example@gmail.com"
                value={formData.email} onChange={handleChange}
                onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField("")}
                style={innerInputStyle} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>Password</label>
            <div style={inputStyle("password")}>
              <FaLock style={{ color: iconFor.password, marginRight: "10px", flexShrink: 0 }} />
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Create password"
                value={formData.password} onChange={handleChange}
                onFocus={() => setFocusedField("password")} onBlur={() => setFocusedField("")}
                style={{ ...innerInputStyle, paddingRight: "30px" }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "14px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Strength bar */}
            {formData.password && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>Strength:</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: strength.color }}>{strength.text}</span>
                </div>
                <div style={{ height: "5px", background: theme === "dark" ? "#1e293b" : "#e2e8f0", borderRadius: "99px", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: strength.score === 1 ? "33%" : strength.score === 2 ? "66%" : "100%" }}
                    style={{ height: "100%", borderRadius: "99px", background: strength.color }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>Confirm Password</label>
            <div style={inputStyle("confirmPassword")}>
              <FaLock style={{ color: iconFor.confirmPassword, marginRight: "10px", flexShrink: 0 }} />
              <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Re-enter password"
                value={formData.confirmPassword} onChange={handleChange}
                onFocus={() => setFocusedField("confirmPassword")} onBlur={() => setFocusedField("")}
                style={{ ...innerInputStyle, paddingRight: "30px" }} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: "absolute", right: "14px", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 0 }}>
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            disabled={loading} type="submit"
            style={{
              width: "100%", padding: "14px", borderRadius: "14px", border: "none",
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #06b6d4 100%)",
              color: "#fff", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: "0 8px 24px -4px rgba(99,102,241,0.45)", transition: "all 0.3s ease",
            }}
          >
            {loading ? <><FaSpinner className="animate-spin" /> Creating Account...</> : "Create Account →"}
          </motion.button>
        </motion.form>
      </AuthLayout>
    </motion.div>
  );
}

export default Register;