import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaSearch, FaFilter, FaSortAmountDown, FaClipboardList, FaCalendarCheck } from "react-icons/fa";
import { useTheme } from "../hooks/useTheme";

import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import StatsCards from "../components/StatsCards";
import Navbar from "../components/dashboard/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import ProductivityQuote from "../components/dashboard/ProductivityQuote";
import CalendarWidget from "../components/dashboard/CalendarWidget";
import WeeklyChart from "../components/dashboard/WeeklyChart";
import ProgressRing from "../components/dashboard/ProgressRing";
import RecentActivity from "../components/dashboard/RecentActivity";

function Dashboard() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 1024 : true);
  const [loadingTasks, setLoadingTasks] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState(() => {
    try { return JSON.parse(localStorage.getItem("activities") || "[]"); } catch { return []; }
  });

  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy]               = useState("Newest");

  const [formData, setFormData] = useState({
    title: "", description: "", priority: "Medium", category: "Personal", dueDate: ""
  });
  const [editId, setEditId] = useState(null);

  const logActivity = (text, type) => {
    const act = {
      id: Date.now().toString(), text, type,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    const updated = [act, ...activities].slice(0, 20);
    setActivities(updated);
    localStorage.setItem("activities", JSON.stringify(updated));
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    try {
      setLoadingTasks(true);
      const res = await api.get("/tasks", { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data.tasks);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login");
      } else { toast.error("❌ Failed to load tasks!"); }
    } finally { setLoadingTasks(false); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const addTask = async (e) => {
    e.preventDefault();
    if (!formData.title) { toast.error("Task title is required"); return; }
    const token = localStorage.getItem("token");
    try {
      if (editId) {
        await api.put(`/tasks/${editId}`, formData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("✅ Task Updated!"); logActivity(`Updated "${formData.title}"`, "update"); setEditId(null);
      } else {
        await api.post("/tasks", formData, { headers: { Authorization: `Bearer ${token}` } });
        toast.success("🎉 Task Added!"); logActivity(`Created "${formData.title}"`, "create");
      }
      setFormData({ title: "", description: "", priority: "Medium", category: "Personal", dueDate: "" });
      fetchTasks();
    } catch { toast.error("❌ Something went wrong!"); }
  };

  const deleteTask = async (id) => {
    const token = localStorage.getItem("token");
    const t = tasks.find((x) => x._id === id);
    try {
      await api.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("🗑️ Task Deleted!");
      if (t) logActivity(`Deleted "${t.title}"`, "delete");
      fetchTasks();
    } catch { toast.error("❌ Failed to delete task!"); }
  };

  const toggleStatus = async (task) => {
    const token = localStorage.getItem("token");
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    try {
      await api.put(`/tasks/${task._id}`, { ...task, status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(newStatus === "Completed" ? "🎉 Task Completed!" : "⏳ Task Reopened");
      logActivity(newStatus === "Completed" ? `Completed "${task.title}"` : `Reopened "${task.title}"`, newStatus === "Completed" ? "complete" : "update");
      fetchTasks();
    } catch { toast.error("❌ Failed to update status!"); }
  };

  const handleEdit = (task) => {
    setFormData({ title: task.title, description: task.description || "", priority: task.priority || "Medium", category: task.category || "Personal", dueDate: task.dueDate ? task.dueDate.split("T")[0] : "" });
    setEditId(task._id);
    setActiveTab("tasks");
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setFormData({ title: "", description: "", priority: "Medium", category: "Personal", dueDate: "" });
  };

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "All" || t.status === statusFilter) &&
      (priorityFilter === "All" || t.priority === priorityFilter) &&
      (categoryFilter === "All" || t.category === categoryFilter))
    .sort((a, b) => sortBy === "Newest" ? new Date(b.createdAt) - new Date(a.createdAt) : new Date(a.createdAt) - new Date(b.createdAt));

  const nextPending = tasks.filter((t) => t.status === "Pending").slice(0, 4);

  const baseBg = theme === "dark" ? "#060b18" : "#f8fafc";
  const cardBg = theme === "dark" ? "#0d1526" : "#ffffff";
  const borderCol = theme === "dark" ? "rgba(255,255,255,0.06)" : "#f1f5f9";
  const mutedBg = theme === "dark" ? "rgba(255,255,255,0.04)" : "#f1f5f9";
  const inputStyle = {
    background: theme === "dark" ? "rgba(255,255,255,0.04)" : "#ffffff",
    border: `1.5px solid ${borderCol}`, color: "var(--text-primary)",
    borderRadius: "12px", padding: "10px 14px", fontSize: "13px", outline: "none",
    cursor: "pointer", transition: "all 0.2s ease"
  };

  const SkeletonCard = () => (
    <div style={{
      background: cardBg, borderRadius: "18px", padding: "20px", height: "120px",
      border: `1px solid ${borderCol}`, overflow: "hidden", position: "relative"
    }}>
      <div className="skeleton" style={{ width: "40%", height: "14px", borderRadius: "6px", marginBottom: "10px" }} />
      <div className="skeleton" style={{ width: "70%", height: "10px", borderRadius: "6px", marginBottom: "6px" }} />
      <div className="skeleton" style={{ width: "50%", height: "10px", borderRadius: "6px" }} />
    </div>
  );

  const tabMotion = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    exit:    { opacity: 0, y: -16 },
    transition: { duration: 0.3 }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: baseBg, transition: "background 0.4s ease" }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar
          search={search} setSearch={setSearch}
          activeTab={activeTab} setActiveTab={setActiveTab}
          desktopSidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main style={{ flex: 1, padding: "28px", maxWidth: "1400px", width: "100%", margin: "0 auto" }}>
          <AnimatePresence mode="wait">

            {/* ── DASHBOARD TAB ── */}
            {activeTab === "dashboard" && (
              <motion.div key="dashboard" {...tabMotion} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {loadingTasks ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
                    {[1,2,3,4].map((i) => <SkeletonCard key={i} />)}
                  </div>
                ) : <StatsCards tasks={tasks} />}

                <div style={{ display: "grid", gridTemplateColumns: "minmax(260px, 1fr) 2fr", gap: "24px" }}
                  className="responsive-grid-1-2"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <CalendarWidget />
                    <ProductivityQuote />
                  </div>

                  {/* Next Tasks panel */}
                  <div style={{
                    background: cardBg, borderRadius: "22px", padding: "22px",
                    border: `1px solid ${borderCol}`,
                    boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)",
                    display: "flex", flexDirection: "column"
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                      <div style={{ padding: "9px", borderRadius: "11px", background: "rgba(99,102,241,0.1)", color: "#6366f1", fontSize: "14px" }}>
                        <FaClipboardList />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Upcoming Pending Tasks</h3>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>Focus on completing these next.</p>
                      </div>
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                      {loadingTasks ? (
                        [1,2].map((i) => <SkeletonCard key={i} />)
                      ) : nextPending.length === 0 ? (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 0", textAlign: "center" }}>
                          <FaCalendarCheck style={{ fontSize: "36px", color: theme === "dark" ? "#1e293b" : "#e2e8f0", marginBottom: "12px" }} />
                          <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)" }}>All caught up! Zero pending tasks.</p>
                        </div>
                      ) : nextPending.map((t) => (
                        <TaskCard key={t._id} task={t} handleEdit={handleEdit} deleteTask={deleteTask} toggleStatus={toggleStatus} />
                      ))}
                    </div>

                    <div style={{ paddingTop: "14px", borderTop: `1px solid ${borderCol}`, textAlign: "right", marginTop: "auto" }}>
                      <button
                        onClick={() => setActiveTab("tasks")}
                        style={{ background: "none", border: "none", fontSize: "12px", fontWeight: 700, color: "#6366f1", cursor: "pointer" }}
                      >
                        View All My Tasks →
                      </button>
                    </div>
                  </div>
                </div>

                {!loadingTasks && tasks.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
                    className="responsive-grid-1-1"
                  >
                    <ProgressRing tasks={tasks} />
                    <RecentActivity activities={activities} />
                  </div>
                )}
              </motion.div>
            )}

            {/* ── TASKS TAB ── */}
            {activeTab === "tasks" && (
              <motion.div key="tasks" {...tabMotion} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                {/* Filter Panel */}
                <div style={{
                  background: cardBg, borderRadius: "18px", padding: "18px 20px",
                  border: `1px solid ${borderCol}`,
                  boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.03)",
                }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
                    {/* Search */}
                    <div style={{ position: "relative", flex: "1 1 200px" }}>
                      <FaSearch style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#6366f1", fontSize: "12px" }} />
                      <input
                        type="text" placeholder="Search tasks by title..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        style={{ ...inputStyle, width: "100%", paddingLeft: "36px" }}
                      />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <FaFilter style={{ fontSize: "11px", color: "var(--text-muted)" }} />
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Filters:</span>
                    </div>

                    {/* Status */}
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={inputStyle}>
                      <option value="All">All Statuses</option>
                      <option value="Pending">⏳ Pending</option>
                      <option value="Completed">✅ Completed</option>
                    </select>

                    {/* Priority */}
                    <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={inputStyle}>
                      <option value="All">All Priorities</option>
                      <option value="High">🔴 High</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="Low">🟢 Low</option>
                    </select>

                    {/* Category */}
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={inputStyle}>
                      <option value="All">All Categories</option>
                      <option value="Personal">👤 Personal</option>
                      <option value="Study">📚 Study</option>
                      <option value="Work">💼 Work</option>
                      <option value="Freelance">💻 Freelance</option>
                    </select>

                    {/* Sort */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", ...inputStyle, cursor: "default" }}>
                      <FaSortAmountDown style={{ fontSize: "11px", color: "var(--text-muted)" }} />
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ border: "none", background: "transparent", outline: "none", fontSize: "13px", color: "var(--text-primary)", cursor: "pointer" }}>
                        <option value="Newest">Newest</option>
                        <option value="Oldest">Oldest</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Task Form + Task List Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px", alignItems: "start" }}
                  className="responsive-grid-form"
                >
                  <div style={{ position: "sticky", top: "80px" }}>
                    <TaskForm formData={formData} handleChange={handleChange} addTask={addTask} editId={editId} onCancel={handleCancelEdit} />
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    {loadingTasks ? (
                      [1,2,3].map((i) => <SkeletonCard key={i} />)
                    ) : filteredTasks.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                        style={{
                          background: cardBg, borderRadius: "22px", padding: "56px 24px",
                          border: `1px solid ${borderCol}`, textAlign: "center",
                          boxShadow: theme === "dark" ? "0 4px 20px rgba(0,0,0,0.2)" : "0 4px 20px rgba(0,0,0,0.04)"
                        }}
                      >
                        <svg className="animate-float" style={{ width: "160px", height: "100px", margin: "0 auto 20px" }} viewBox="0 0 200 120" fill="none">
                          <rect x="50" y="20" width="100" height="80" rx="16" fill={theme === "dark" ? "#0d1526" : "#f8fafc"} stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"} strokeWidth="2" />
                          <line x1="70" y1="45" x2="130" y2="45" stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"} strokeWidth="3" strokeLinecap="round" />
                          <line x1="70" y1="60" x2="110" y2="60" stroke={theme === "dark" ? "#1e293b" : "#e2e8f0"} strokeWidth="3" strokeLinecap="round" />
                          <circle cx="150" cy="85" r="18" fill="#6366f115" stroke="#6366f1" strokeWidth="2" />
                          <path d="M145 85L148 89L155 81" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <h2 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>No tasks match your filters 🚀</h2>
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "8px", maxWidth: "360px", margin: "8px auto 0", lineHeight: 1.6 }}>
                          Try adjusting your search, filters, or sort order — or create a new task.
                        </p>
                        {(search || statusFilter !== "All" || priorityFilter !== "All" || categoryFilter !== "All") && (
                          <button
                            onClick={() => { setSearch(""); setStatusFilter("All"); setPriorityFilter("All"); setCategoryFilter("All"); }}
                            style={{
                              marginTop: "20px", padding: "10px 20px", borderRadius: "12px",
                              border: `1.5px solid ${borderCol}`, background: "transparent",
                              color: "#6366f1", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.2s"
                            }}
                          >
                            Reset all filters
                          </button>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div layout style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        <AnimatePresence mode="popLayout">
                          {filteredTasks.map((t) => (
                            <motion.div key={t._id}
                              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                              transition={{ type: "spring", stiffness: 100, damping: 16 }}
                            >
                              <TaskCard task={t} handleEdit={handleEdit} deleteTask={deleteTask} toggleStatus={toggleStatus} />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ANALYTICS TAB ── */}
            {activeTab === "analytics" && (
              <motion.div key="analytics" {...tabMotion} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                <StatsCards tasks={tasks} />
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }} className="responsive-grid-2-1">
                  <WeeklyChart tasks={tasks} />
                  <ProgressRing tasks={tasks} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }} className="responsive-grid-2-1">
                  <RecentActivity activities={activities} />
                  <ProductivityQuote />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;