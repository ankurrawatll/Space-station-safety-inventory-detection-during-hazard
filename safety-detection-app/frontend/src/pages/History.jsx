import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { DetectionHistoryContext } from "../DetectionHistoryContext";

export default function History({ theme }) {
  const { history, previewCache, clearHistory, deleteDetection, addDetection } = useContext(DetectionHistoryContext);
  const [expanded, setExpanded] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [undoType, setUndoType] = useState(null); // 'delete' or 'clear'
  const [undoData, setUndoData] = useState(null); // detection or array
  const [undoTimeout, setUndoTimeout] = useState(null);

  // Undo handler
  const handleUndo = () => {
    if (undoType === "delete" && undoData) {
      addDetection(undoData.detection, undoData.inputPreview, undoData.outputPreview);
    } else if (undoType === "clear" && Array.isArray(undoData)) {
      // Restore all
      undoData.forEach(item => {
        addDetection(item.detection, item.inputPreview, item.outputPreview);
      });
    }
    setShowUndo(false);
    setUndoType(null);
    setUndoData(null);
    if (undoTimeout) clearTimeout(undoTimeout);
  };

  // Delete with confirmation and undo
  const handleDelete = (item) => {
    if (!window.confirm("Are you sure you want to delete this detection?")) return;
    // Save for undo
    setUndoType("delete");
    setUndoData({
      detection: item,
      inputPreview: previewCache[item.id]?.input,
      outputPreview: previewCache[item.id]?.output
    });
    deleteDetection(item.id);
    setShowUndo(true);
    if (undoTimeout) clearTimeout(undoTimeout);
    setUndoTimeout(setTimeout(() => setShowUndo(false), 5000));
  };

  // Clear with confirmation and undo
  const handleClear = () => {
    if (!window.confirm("Are you sure you want to clear all detection history?")) return;
    // Save all for undo
    const all = history.map(item => ({
      detection: item,
      inputPreview: previewCache[item.id]?.input,
      outputPreview: previewCache[item.id]?.output
    }));
    setUndoType("clear");
    setUndoData(all);
    clearHistory();
    setShowUndo(true);
    if (undoTimeout) clearTimeout(undoTimeout);
    setUndoTimeout(setTimeout(() => setShowUndo(false), 5000));
  };

  return (
    <motion.div
      className="pt-32 px-8 min-h-screen"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <h2 className="text-3xl font-bold text-white mb-8 text-center font-orbitron drop-shadow-lg">Detection History</h2>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-lg font-semibold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg hover:scale-105 transition"
        >
          Clear History
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {history.length === 0 && <div className="text-white/60 col-span-3 text-center">No detection history yet.</div>}
        {history.map(item => (
          <motion.div
            key={item.id}
            className="relative rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md border border-[#1B1A55]/30 shadow-xl cursor-pointer group flex flex-col transition-all hover:scale-[1.03]"
            whileHover={{ scale: 1.04 }}
            onClick={() => setExpanded(item)}
          >
            <button
              onClick={e => { e.stopPropagation(); handleDelete(item); }}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-10"
              title="Delete"
            >
              &times;
            </button>
            <div className="flex flex-col gap-2 p-4">
              <div className="flex gap-2 items-center justify-between">
                <span className="text-xs text-white/60 font-mono">{item.date}</span>
                <span className="text-xs text-white/60 font-mono">{item.filename}</span>
              </div>
              <div className="flex gap-2 items-center justify-center">
                {previewCache[item.id]?.input ? (
                  <img src={previewCache[item.id].input} alt="Input" className="rounded-xl border border-[#1B1A55]/30 w-20 h-20 object-cover bg-black/30" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-black/30 flex items-center justify-center text-white/40 text-xs">No input</div>
                )}
                <span className="text-white/40 text-2xl">→</span>
                {previewCache[item.id]?.output ? (
                  <img src={previewCache[item.id].output} alt="Output" className="rounded-xl border border-[#1B1A55]/30 w-20 h-20 object-cover bg-black/30" />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-black/30 flex items-center justify-center text-white/40 text-xs">No output</div>
                )}
              </div>
              <div className="mt-2 text-xs text-white/80">
                <div>Class Counts: {item.class_counts && Object.entries(item.class_counts).map(([cls, cnt]) => `${cls}: ${cnt}`).join(", ")}</div>
                <div>Confidences: {item.confidences && item.confidences.map(c => (c * 100).toFixed(1) + "%").join(", ")}</div>
              </div>
              <div className="mt-2 text-xs text-white/60">Detections: {item.detections && item.detections.length}</div>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Undo Snackbar */}
      {showUndo && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-4 z-50">
          <span>History updated.</span>
          <button
            onClick={handleUndo}
            className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold shadow"
          >
            Undo
          </button>
        </div>
      )}
      {/* Modal/Expand logic */}
      {expanded && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setExpanded(null)}
        >
          <div className="bg-white/20 backdrop-blur-md border border-[#1B1A55]/30 rounded-2xl p-8 shadow-2xl min-w-[320px] max-w-lg text-white relative">
            <button className="absolute top-2 right-4 text-2xl" onClick={() => setExpanded(null)}>&times;</button>
            <div className="flex gap-4 items-center mb-4">
              {previewCache[expanded.id]?.input ? (
                <img src={previewCache[expanded.id].input} alt="Input" className="rounded-xl border border-[#1B1A55]/30 w-24 h-24 object-cover bg-black/30" />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-black/30 flex items-center justify-center text-white/40 text-xs">No input</div>
              )}
              <span className="text-white/40 text-3xl">→</span>
              {previewCache[expanded.id]?.output ? (
                <img src={previewCache[expanded.id].output} alt="Output" className="rounded-xl border border-[#1B1A55]/30 w-24 h-24 object-cover bg-black/30" />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-black/30 flex items-center justify-center text-white/40 text-xs">No output</div>
              )}
            </div>
            <div className="font-bold text-lg mb-2">{expanded.filename}</div>
            <div className="text-xs text-white/60 mb-2">{expanded.date}</div>
            <div className="text-xs text-white/80 mb-2">Class Counts: {expanded.class_counts && Object.entries(expanded.class_counts).map(([cls, cnt]) => `${cls}: ${cnt}`).join(", ")}</div>
            <div className="text-xs text-white/80 mb-2">Confidences: {expanded.confidences && expanded.confidences.map(c => (c * 100).toFixed(1) + "%").join(", ")}</div>
            <div className="text-xs text-white/80 mb-2">Detections: {expanded.detections && expanded.detections.length}</div>
            <div className="text-xs text-white/80">{expanded.detections && expanded.detections.map((det, idx) => (
              <div key={idx} className="mb-1">{det.class} ({(det.conf * 100).toFixed(1)}%) [ {det.box.map(v => v.toFixed(0)).join(", ")} ]</div>
            ))}</div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
} 