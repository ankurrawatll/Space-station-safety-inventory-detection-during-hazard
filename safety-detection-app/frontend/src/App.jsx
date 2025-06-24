import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Home from "./pages/Home";
import Detect from "./pages/Detect";
import History from "./pages/History";
import ModelFeedback from "./pages/ModelFeedback";
import { themes } from "./themeConfig";

function AnimatedRoutes({ theme }) {
  return (
    <Routes>
      <Route path="/" element={<Home theme={theme} />} />
      <Route path="/detect" element={<Detect theme={theme} />} />
      <Route path="/history" element={<History theme={theme} />} />
      <Route path="/feedback" element={<ModelFeedback theme={theme} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  const [theme, setTheme] = useState("home");
  return (
    <Router>
      <motion.div
        className={`${themes[theme].bg} min-h-screen transition-colors duration-500`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <Navbar theme={theme} setTheme={setTheme} />
        <AnimatedRoutes theme={theme} />
      </motion.div>
    </Router>
  );
} 