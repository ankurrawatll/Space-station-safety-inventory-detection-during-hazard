import React from "react";
import { Link, useLocation } from "react-router-dom";

const tabs = [
  { name: "Home", path: "/", theme: "home" },
  { name: "Detect", path: "/detect", theme: "detect" },
  { name: "History", path: "/history", theme: "history" },
  { name: "Model Feedback", path: "/feedback", theme: "feedback" },
];

export default function Navbar({ theme, setTheme }) {
  const location = useLocation();
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="font-orbitron text-2xl tracking-widest text-white drop-shadow-lg">Space Station Inventory Detection</div>
      <div className="flex gap-6">
        {tabs.map(tab => (
          <Link
            key={tab.name}
            to={tab.path}
            onClick={() => setTheme(tab.theme)}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md border border-white/20 shadow-md text-white/90 ${
              location.pathname === tab.path
                ? "bg-gradient-to-r from-[#3C0753] to-[#2E236C] text-white shadow-lg scale-105"
                : "hover:bg-white/20 hover:scale-105"
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </nav>
  );
} 