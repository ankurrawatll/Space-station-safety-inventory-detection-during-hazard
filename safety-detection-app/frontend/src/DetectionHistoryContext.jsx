import React, { createContext, useState, useEffect } from "react";

export const DetectionHistoryContext = createContext();

export function DetectionHistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    // Only load metadata from localStorage
    return JSON.parse(localStorage.getItem("detection_history") || "[]");
  });
  // Session-only cache for image previews
  const [previewCache, setPreviewCache] = useState({});

  useEffect(() => {
    // Only store metadata, not images
    const metaHistory = history.map(({ id, detections, class_counts, confidences, date, filename }) => ({
      id, detections, class_counts, confidences, date, filename
    }));
    localStorage.setItem("detection_history", JSON.stringify(metaHistory.slice(0, 10)));
  }, [history]);

  const addDetection = (detection, inputPreview, outputPreview) => {
    setHistory((prev) => [detection, ...prev].slice(0, 10));
    setPreviewCache((prev) => ({ ...prev, [detection.id]: { input: inputPreview, output: outputPreview } }));
  };

  const clearHistory = () => {
    setHistory([]);
    setPreviewCache({});
    localStorage.removeItem("detection_history");
  };

  const deleteDetection = (id) => {
    setHistory((prev) => prev.filter(item => item.id !== id));
    setPreviewCache((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    const metaHistory = history.filter(item => item.id !== id).map(({ id, detections, class_counts, confidences, date, filename }) => ({
      id, detections, class_counts, confidences, date, filename
    }));
    localStorage.setItem("detection_history", JSON.stringify(metaHistory));
  };

  return (
    <DetectionHistoryContext.Provider value={{ history, addDetection, previewCache, clearHistory, deleteDetection }}>
      {children}
    </DetectionHistoryContext.Provider>
  );
} 