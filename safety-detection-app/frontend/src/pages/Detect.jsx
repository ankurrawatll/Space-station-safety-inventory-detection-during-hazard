import React, { useState, useRef, useContext } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { DetectionHistoryContext } from "../DetectionHistoryContext";
import FloatingShapesBackground from "../FloatingShapesBackground";

const COLORS = ["#3C0753", "#1B1A55", "#2E236C", "#00FFB3", "#FFB347", "#FF6961"];

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function getNowString() {
  const now = new Date();
  return now.toLocaleString();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Detect({ theme }) {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const inputRef = useRef();
  const { addDetection } = useContext(DetectionHistoryContext);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setResult(null);
    setError("");
    if (f) {
      setFileUrl(URL.createObjectURL(f));
    } else {
      setFileUrl("");
    }
  };

  const handleDetect = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("http://localhost:8000/detect", formData, { responseType: "json" });
      setResult(res.data);
      setError("");
      // Only add metadata to history (no images), but pass previews for session cache
      addDetection({
        id: Date.now(),
        detections: res.data.detections,
        class_counts: res.data.class_counts,
        confidences: res.data.confidences,
        date: getNowString(),
        filename: file.name
      }, fileUrl, `data:image/png;base64,${res.data.image}`);
    } catch (err) {
      if (!result) setError("Detection failed. Please check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = () => {
    if (!result?.image) return;
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${result.image}`;
    link.download = "detection_result.png";
    link.click();
  };

  const handleDownloadJSON = () => {
    if (!result?.detections) return;
    downloadFile("detections.json", JSON.stringify(result.detections, null, 2));
  };

  const handleDownloadCSV = () => {
    if (!result?.detections) return;
    const csv = [
      "class,confidence,box",
      ...result.detections.map(d => `${d.class},${d.conf},[${d.box.join(" ")}]`)
    ].join("\n");
    downloadFile("detections.csv", csv);
  };

  const classCountsData = result && result.class_counts
    ? Object.entries(result.class_counts).map(([name, value]) => ({ name, value }))
    : [];
  const confidencesData = result && result.confidences
    ? result.confidences.map((conf, idx) => ({ name: `Det ${idx + 1}`, value: conf }))
    : [];

  return (
    <motion.div
      className="pt-32 px-8 min-h-screen relative overflow-hidden bg-[#0a0a1a]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Floating shapes animated background */}
      <FloatingShapesBackground />
      <div className="relative z-10">
        <h2 className="text-3xl font-bold text-white mb-8 text-center font-orbitron drop-shadow-lg">Detect Safety Equipment</h2>
        <div className="mx-auto max-w-2xl bg-white/10 backdrop-blur-md border border-[#2E236C]/30 rounded-2xl p-8 shadow-lg mb-12">
          <div className="text-center text-white/80 mb-4">Drag & drop images here or click to upload</div>
          <div className="flex flex-col items-center justify-center text-center gap-2">
            <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="block text-white mb-2" />
            {file && <div className="text-xs text-white/60 mt-1">{file.name}</div>}
            <button
              style={{ color: '#fff' }}
              className="mt-2 px-10 py-4 rounded-xl font-extrabold text-lg bg-gradient-to-r from-cyan-400 to-blue-700 text-white shadow-2xl border-2 border-cyan-400 drop-shadow-lg hover:from-cyan-300 hover:to-blue-500 hover:border-white hover:shadow-cyan-400/60 focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDetect}
              disabled={!file || loading}
            >
              {loading ? "Detecting..." : "Detect"}
            </button>
          </div>
          {error && <div className="text-red-400 mt-4 text-center">{error}</div>}
        </div>
        {/* Input/Output Preview */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-md border border-[#2E236C]/30 rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center w-full min-h-[300px]">
            <div className="text-white/70 mb-2">Input Preview</div>
            {fileUrl ? (
              <img src={fileUrl} alt="Input Preview" className="rounded-xl border-2 border-[#2E236C] shadow-xl max-w-full mb-2" style={{ background: "#18181b", maxHeight: 220 }} />
            ) : (
              <div className="w-full h-48 bg-black/30 rounded-lg flex items-center justify-center text-white/40">No input image</div>
            )}
            {file && <div className="text-xs text-white/60 mt-2">{file.name}</div>}
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-[#2E236C]/30 rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center w-full min-h-[300px]">
            <div className="text-white/70 mb-2">Output Preview</div>
            {result?.image ? (
              <img src={`data:image/png;base64,${result.image}`} alt="Detection Result" className="rounded-xl border-2 border-[#2E236C] shadow-xl max-w-full mb-2" style={{ background: "#18181b", maxHeight: 220 }} />
            ) : (
              <div className="w-full h-48 bg-black/30 rounded-lg flex items-center justify-center text-white/40">No output image</div>
            )}
          </div>
        </div>
        {/* Detection Table and Download Buttons */}
        {result && (
          <>
            <div className="bg-white/10 backdrop-blur-md border border-[#2E236C]/30 rounded-2xl p-6 shadow-lg max-w-3xl mx-auto mb-8">
              <div className="text-white/70 mb-2">Detection Results</div>
              {result.detections && result.detections.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <table className="min-w-full bg-black/30 rounded-lg text-white border border-[#2E236C]/40 shadow-lg text-xs">
                    <thead>
                      <tr>
                        <th className="px-2 py-1 border-b border-[#2E236C]/40">Class</th>
                        <th className="px-2 py-1 border-b border-[#2E236C]/40">Confidence</th>
                        <th className="px-2 py-1 border-b border-[#2E236C]/40">Box [x1, y1, x2, y2]</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.detections.map((det, idx) => (
                        <tr key={idx} className="hover:bg-[#2E236C]/30 transition-all">
                          <td className="px-2 py-1 border-b border-[#2E236C]/20 font-semibold">{det.class}</td>
                          <td className="px-2 py-1 border-b border-[#2E236C]/20">{(det.conf * 100).toFixed(1)}%</td>
                          <td className="px-2 py-1 border-b border-[#2E236C]/20">{det.box.map((v) => v.toFixed(0)).join(", ")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-white/40 mt-2">No detections</div>
              )}
              {/* Stats */}
              <div className="mt-4 text-white/80 text-xs">
                <div>Class Counts: {result.class_counts && Object.entries(result.class_counts).map(([cls, cnt]) => `${cls}: ${cnt}`).join(", ")}</div>
                <div>Confidences: {result.confidences && result.confidences.map(c => (c * 100).toFixed(1) + "%").join(", ")}</div>
              </div>
            </div>
            <div className="flex gap-4 justify-center mt-4">
              <button onClick={handleDownloadImage} className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#3C0753] to-[#2E236C] text-white shadow-lg hover:scale-105 transition">Download Labeled Image</button>
              <button onClick={handleDownloadJSON} className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#2E236C] to-[#1B1A55] text-white shadow-lg hover:scale-105 transition">Download JSON</button>
              <button onClick={handleDownloadCSV} className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#1B1A55] to-[#3C0753] text-white shadow-lg hover:scale-105 transition">Download CSV</button>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
} 