import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center transition-colors duration-500">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-8 shadow-xl"
      >
        <span className="text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
          404
        </span>

        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mt-4 tracking-tight">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-8 leading-relaxed">
          Oops! The page you are looking for does not exist or has been moved. Let's get you back on track.
        </p>

        <Link to="/dashboard">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20 dark:shadow-indigo-600/10 transition-all duration-300 cursor-pointer"
          >
            <FaHome />
            <span>Go to Dashboard</span>
          </motion.button>
        </Link>
      </motion.div>

    </div>
  );
}

export default NotFound;