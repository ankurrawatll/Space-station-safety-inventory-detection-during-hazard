from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from ultralytics import YOLO
import cv2
import numpy as np
import base64
import os

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model paths (update these to your actual model locations)
MODEL_PATHS = {
    'FireExtinguisher': '../../runs/detect/FireExtinguisher/weights/best.pt',
    'ToolBox': '../../runs/detect/ToolBox/weights/best.pt',
    'OxygenTank': '../../runs/detect/OxygenTank/weights/best.pt',
}

# Load models once at startup
models = {cls: YOLO(path) for cls, path in MODEL_PATHS.items()}

@app.post('/detect')
async def detect(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    all_detections = []
    color_map = {
        'FireExtinguisher': (0, 255, 0),
        'ToolBox': (255, 0, 0),
        'OxygenTank': (0, 0, 255)
    }
    for cls, model in models.items():
        results = model(image)
        for r in results:
            if r.boxes is not None:
                boxes = r.boxes.xyxy.cpu().numpy()
                confs = r.boxes.conf.cpu().numpy()
                for box, conf in zip(boxes, confs):
                    if float(conf) > 0.5:
                        all_detections.append({
                            'class': cls,
                            'conf': float(conf),
                            'box': [float(x) for x in box]
                        })
                        # Draw box
                        x1, y1, x2, y2 = map(int, box)
                        label = f"{cls} {conf:.2f}"
                        color = color_map.get(cls, (255, 255, 0))
                        cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
                        cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)
    # Encode processed image to base64
    _, buffer = cv2.imencode('.png', image)
    img_str = base64.b64encode(buffer).decode('utf-8')
    # Stats for charts
    class_counts = {cls: sum(1 for d in all_detections if d['class'] == cls) for cls in models.keys()}
    confs = [d['conf'] for d in all_detections]
    return JSONResponse({
        'detections': all_detections,
        'image': img_str,
        'class_counts': class_counts,
        'confidences': confs
    }) 