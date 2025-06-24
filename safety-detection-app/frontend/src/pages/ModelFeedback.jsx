import React, { useState } from "react";
import { motion } from "framer-motion";

const mockFeedback = [
  { id: 1, img: "", label: "Fire Extinguisher", conf: 0.52, flagged: false },
  { id: 2, img: "", label: "ToolBox", conf: 0.48, flagged: true },
];

export default function ModelFeedback({ theme }) {
  const [feedback, setFeedback] = useState(mockFeedback);
  const [hasError, setHasError] = useState(false);
  const toggleFlag = id => {
    setFeedback(fb => fb.map(item => item.id === id ? { ...item, flagged: !item.flagged } : item));
  };
  try {
    if (hasError) throw new Error();
    return (
      <motion.div
        className="pt-32 px-8 min-h-screen"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <h2 className="text-3xl font-bold text-yellow-200 mb-8 text-center font-orbitron drop-shadow-lg">Model Feedback</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {feedback.map(item => (
            <motion.div
              key={item.id}
              className="flex items-center gap-6 rounded-2xl p-6 bg-white/20 backdrop-blur-md border border-yellow-400/30 shadow-lg text-yellow-100"
              whileHover={{ scale: 1.03 }}
            >
              <div className="h-20 w-20 bg-black/30 rounded-lg flex items-center justify-center text-yellow-100/40">Image</div>
              <div className="flex-1">
                <div className="font-bold text-lg">{item.label}</div>
                <div className="text-sm mb-2">Confidence: {(item.conf * 100).toFixed(1)}%</div>
                <button
                  className={`px-4 py-1 rounded-lg font-semibold text-sm transition-all duration-300 ${item.flagged ? "bg-orange-500 text-white" : "bg-yellow-300 text-orange-900"}`}
                  onClick={() => toggleFlag(item.id)}
                >
                  {item.flagged ? "Unflag" : "Flag"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Falcon Info Panel */}
        <div className="max-w-2xl mx-auto bg-white/20 backdrop-blur-md border border-yellow-400/30 rounded-2xl p-8 shadow-lg text-yellow-100 mb-8">
          <h3 className="font-bold text-lg mb-2">What happens to flagged detections?</h3>
          <p className="text-yellow-100/80 text-sm">Flagged low-confidence detections are logged for review and can be used to retrain the YOLOv8 models, improving accuracy and reducing false positives/negatives in future runs.</p>
        </div>
        {/* Download flagged logs */}
        <div className="flex justify-center">
          <button className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg hover:scale-105 transition">Download Flagged Logs (CSV)</button>
        </div>
      </motion.div>
    );
  } catch (e) {
    return <div className="text-center text-red-400 mt-32">An error occurred in Model Feedback. Please reload the page or contact support.</div>;
  }
} 