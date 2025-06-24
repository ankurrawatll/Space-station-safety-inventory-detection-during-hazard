import streamlit as st
from PIL import Image
import os
import time
import numpy as np
import cv2
import torch
from ultralytics import YOLO
import matplotlib.pyplot as plt
import pandas as pd

st.set_page_config(page_title="Safety Equipment Ensemble Detection", layout="wide")

# --- VANTA.JS 3D NETWORK BACKGROUND (using three.js) ---
st.markdown("""
    <style>
    #vanta-bg {
        position: fixed !important;
        z-index: 0 !important;
        top: 0; left: 0; width: 100vw; height: 100vh;
        opacity: 0.5;
        pointer-events: none;
    }
    .stApp {
        background: transparent !important;
    }
    .main .block-container {
        z-index: 1 !important;
        position: relative !important;
        background: transparent !important;
    }
    section[data-testid="stSidebar"] {
        background: rgba(24,24,27,0.95) !important;
        color: #f3f3f3;
        border-right: 2px solid #ff003c33;
    }
    .vanta-title {
        font-size: 2.8rem;
        font-weight: bold;
        color: #fff;
        text-shadow:
            -2px -2px 0 #000,  
            2px -2px 0 #000,
            -2px 2px 0 #000,
            2px 2px 0 #000,
            0 0 16px #ff003c;
        letter-spacing: 2px;
        margin-bottom: 0.5em;
        z-index: 1;
        position: relative;
    }
    .stMarkdown h2, .stMarkdown h3 {
        color: #ff003c !important;
        text-shadow: 0 0 12px #ff003c99;
    }
    .stFileUploader, .stDataFrame, .stImage, .stMetric, .stButton, .stDownloadButton {
        border-radius: 14px !important;
        box-shadow: 0 0 16px 0 #ff003c44;
        background: #232326 !important;
        border: 1.5px solid #ff003c33 !important;
        color: #f3f3f3 !important;
    }
    .stMarkdown, .stText, .stDataFrame, .stMetric, .stButton, .stDownloadButton {
        color: #f3f3f3 !important;
    }
    </style>
    <div id="vanta-bg"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
    <script>
    window.addEventListener('DOMContentLoaded', () => {
        if (window.VANTA) {
            window.VANTA.NET({
                el: document.getElementById('vanta-bg'),
                mouseControls: true,
                touchControls: true,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                color: 0xff003c,
                backgroundColor: 0x18181b,
                points: 8.0,
                maxDistance: 18.0,
                spacing: 16.0,
                showDots: false,
                gyroControls: false
            })
        }
    });
    </script>
""", unsafe_allow_html=True)

# --- NEON TITLE ---
st.markdown('<div class="vanta-title">  Space Station Safety Inventory Ensemble Detection</div>', unsafe_allow_html=True)

st.markdown("""
A professional tool for detecting Fire Extinguisher, ToolBox, and Oxygen Tank in images using an ensemble of YOLOv8 models.
- **Upload an image** to get started.
- **View detection results, stats, and graphs.**
""")

# --- CONFIG ---
MODEL_PATHS = {
    'FireExtinguisher': '../runs/detect/FireExtinguisher/weights/best.pt',
    'ToolBox': '../runs/detect/ToolBox/weights/best.pt',
    'OxygenTank': '../runs/detect/OxygenTank/weights/best.pt',
}
COLOR_MAP = {
    'FireExtinguisher': (0, 255, 0),   # Green
    'ToolBox': (255, 0, 0),            # Blue
    'OxygenTank': (0, 0, 255)          # Red
}
DATA_COLLECTION_DIR = "data_collection"
OUTPUT_DIR = "output"
CONF_THRESHOLD = 0.5

os.makedirs(DATA_COLLECTION_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# --- LOAD MODELS ---
@st.cache_resource
def load_models():
    models = {}
    for cls, path in MODEL_PATHS.items():
        models[cls] = YOLO(path)
    return models

models = load_models()

# --- SIDEBAR INFO ---
st.sidebar.header("Project Info")
st.sidebar.markdown("""
- **Model:** YOLOv8s (One-class-per-model, Ensemble)
- **Classes:** Fire Extinguisher, ToolBox, Oxygen Tank
- **mAP@50:** FireExtinguisher 98.7%, ToolBox 99.4%, OxygenTank 99.5%
- **Hardware:** RTX 3050 4GB VRAM
""")

# --- IMAGE UPLOAD ---
uploaded_file = st.file_uploader("Upload an image for detection", type=["jpg", "jpeg", "png"])
if uploaded_file:
    # Save uploaded image
    img_path = os.path.join(DATA_COLLECTION_DIR, uploaded_file.name)
    with open(img_path, "wb") as f:
        f.write(uploaded_file.getbuffer())
    image = cv2.imdecode(np.frombuffer(uploaded_file.read(), np.uint8), cv2.IMREAD_COLOR)
    st.image(Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB)), caption="Uploaded Image", use_column_width=True)

    # --- RUN ENSEMBLE DETECTION ---
    st.subheader("Detection Results (Ensemble)")
    start_time = time.time()
    all_detections = []
    for cls, model in models.items():
        results = model(img_path)
        for r in results:
            if r.boxes is not None:
                boxes = r.boxes.xyxy.cpu().numpy()
                confs = r.boxes.conf.cpu().numpy()
                for box, conf in zip(boxes, confs):
                    if float(conf) > CONF_THRESHOLD:
                        det = {
                            'class': cls,
                            'conf': float(conf),
                            'box': [float(x) for x in box]
                        }
                        all_detections.append(det)
    end_time = time.time()
    inf_time = end_time - start_time

    # --- DRAW RESULTS ---
    result_img = image.copy()
    for det in all_detections:
        x1, y1, x2, y2 = map(int, det['box'])
        label = f"{det['class']} {det['conf']:.2f}"
        color = COLOR_MAP.get(det['class'], (255, 255, 0))
        cv2.rectangle(result_img, (x1, y1), (x2, y2), color, 2)
        cv2.putText(result_img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

    out_img_path = os.path.join(OUTPUT_DIR, f"ensemble_{uploaded_file.name}")
    cv2.imwrite(out_img_path, result_img)
    st.image(Image.fromarray(cv2.cvtColor(result_img, cv2.COLOR_BGR2RGB)), caption="Ensemble Detection Output", use_column_width=True)

    # --- SHOW DETECTIONS TABLE ---
    if all_detections:
        df = pd.DataFrame(all_detections)
        st.dataframe(df)
    else:
        st.info("No objects detected.")

    # --- STATS & GRAPHS ---
    st.subheader("Detection Statistics & Graphs")
    if all_detections:
        df = pd.DataFrame(all_detections)
        # 1. Bar chart: Class counts
        class_counts = df["class"].value_counts()
        st.bar_chart(class_counts)

        # 2. Histogram: Confidence distribution
        st.write("Confidence Distribution")
        plt.figure(figsize=(4,2))
        plt.hist(df["conf"], bins=10, color='#ff003c')
        plt.xlabel("Confidence")
        plt.ylabel("Count")
        plt.title("Detection Confidence Histogram")
        plt.gca().spines['bottom'].set_color('#ff003c')
        plt.gca().spines['left'].set_color('#ff003c')
        plt.gca().tick_params(axis='x', colors='#ff003c')
        plt.gca().tick_params(axis='y', colors='#ff003c')
        st.pyplot(plt.gcf())
        plt.clf()

        # 3. Pie chart: Class proportions
        st.write("Class Proportions")
        plt.pie(class_counts, labels=class_counts.index, autopct='%1.1f%%', startangle=140, colors=['#ff003c', '#232326', '#b30021'])
        plt.axis('equal')
        st.pyplot(plt.gcf())
        plt.clf()

        # 4. Inference time
        st.metric("Inference Time (s)", f"{inf_time:.3f}")

        # 5. Static mAP/accuracy chart
        st.write("Model mAP@50 (Static)")
        map_scores = {"FireExtinguisher": 98.7, "ToolBox": 99.4, "OxygenTank": 99.5}
        plt.bar(map_scores.keys(), map_scores.values(), color=['#ff003c', '#232326', '#b30021'])
        plt.ylabel("mAP@50 (%)")
        plt.ylim(95, 100)
        plt.gca().spines['bottom'].set_color('#ff003c')
        plt.gca().spines['left'].set_color('#ff003c')
        plt.gca().tick_params(axis='x', colors='#ff003c')
        plt.gca().tick_params(axis='y', colors='#ff003c')
        st.pyplot(plt.gcf())
        plt.clf()
    else:
        st.info("No statistics to display.")

    # --- DOWNLOAD OUTPUT ---
    with open(out_img_path, "rb") as f:
        st.download_button("Download Labeled Image", f, file_name=f"ensemble_{uploaded_file.name}")

# --- FOOTER ---
st.markdown("---")
st.markdown("<span style='color:#ff003c;font-weight:bold;'>Made with ❤️ for Hackathon and Industrial Safety!</span>", unsafe_allow_html=True) 