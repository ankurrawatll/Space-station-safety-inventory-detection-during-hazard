import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { DetectionHistoryProvider } from "./DetectionHistoryContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DetectionHistoryProvider>
      <App />
    </DetectionHistoryProvider>
  </React.StrictMode>
); 