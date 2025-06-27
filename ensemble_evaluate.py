import os
import glob
import torch
from ultralytics import YOLO
from ultralytics.utils.ops import non_max_suppression
from tqdm import tqdm
import numpy as np

# Paths to models
MODEL_PATHS = [
    'runs/detect/FireExtinguisher/weights/best.pt',  # class 0
    'runs/detect/ToolBox/weights/best.pt',           # class 1
    'runs/detect/OxygenTank/weights/best.pt'         # class 2
]

# Class mapping (order must match your dataset/classes.txt)
CLASS_IDS = [0, 1, 2]

# Test set paths
TEST_IMG_DIR = 'data/test/images'
TEST_LABEL_DIR = 'data/test/labels'

# Output prediction dir (YOLO format)
PRED_LABEL_DIR = 'ensemble_pred_labels'
os.makedirs(PRED_LABEL_DIR, exist_ok=True)

# Load models
models = [YOLO(path) for path in MODEL_PATHS]

# Get test images
img_paths = sorted(glob.glob(os.path.join(TEST_IMG_DIR, '*.png')))

# Inference and ensemble
for img_path in tqdm(img_paths, desc='Ensembling'):
    all_preds = []
    for model, class_id in zip(models, CLASS_IDS):
        results = model(img_path, conf=0.001, iou=0.5, verbose=False)
        boxes = results[0].boxes
        if boxes is not None and len(boxes) > 0:
            for box in boxes:
                xywh = box.xywh[0].cpu().numpy()  # center x, center y, w, h (normalized)
                conf = float(box.conf[0].cpu().numpy())
                # Assign correct class id for this model
                all_preds.append([
                    class_id, xywh[0], xywh[1], xywh[2], xywh[3], conf
                ])
    # Convert to numpy array for NMS
    if len(all_preds) == 0:
        pred_lines = []
    else:
        all_preds = np.array(all_preds)
        if all_preds.ndim == 1:
            all_preds = all_preds.reshape(1, -1)
        nms_input = torch.tensor(np.stack([
            all_preds[:,1], all_preds[:,2], all_preds[:,3], all_preds[:,4], all_preds[:,5], all_preds[:,0]
        ], axis=1), dtype=torch.float32)
        print(f"DEBUG: nms_input.shape = {nms_input.shape}")  # Debug print
        if nms_input.ndim != 2:
            print(f"SKIPPING: nms_input is not 2D, shape={nms_input.shape}")
            pred_lines = []
        elif nms_input.shape[0] == 1:
            # Only one prediction, skip NMS
            x, y, w, h, conf, cls = nms_input[0].tolist()
            pred_lines = [f"{int(cls)} {x:.6f} {y:.6f} {w:.6f} {h:.6f} {conf:.6f}\n"]
        elif nms_input.shape[0] > 1:
            # Pass as a batch of one to NMS
            nms_out = non_max_suppression(nms_input[None, ...], conf_thres=0.001, iou_thres=0.5, classes=None, agnostic=True)[0]
            pred_lines = []
            if nms_out is not None and len(nms_out) > 0:
                for det in nms_out:
                    x, y, w, h, conf, cls = det.tolist()
                    pred_lines.append(f"{int(cls)} {x:.6f} {y:.6f} {w:.6f} {h:.6f} {conf:.6f}\n")
            else:
                pred_lines = []
        else:
            pred_lines = []
    # Write to file
    base = os.path.basename(img_path)
    pred_file = os.path.join(PRED_LABEL_DIR, base.replace('.png', '.txt'))
    with open(pred_file, 'w') as f:
        f.writelines(pred_lines)

print(f"\n✅ Ensemble predictions saved to {PRED_LABEL_DIR}")

# --- Evaluation ---
# Use ultralytics' built-in val function for mAP@0.5
# We'll create a temporary dataset YAML for evaluation
EVAL_YAML = 'ensemble_eval.yaml'
with open(EVAL_YAML, 'w') as f:
    f.write(f"""
path: .
train: {TEST_IMG_DIR}
val: {TEST_IMG_DIR}
test: {TEST_IMG_DIR}
nc: 3
names: ['FireExtinguisher', 'ToolBox', 'OxygenTank']
""")

# Evaluate using YOLO's val method
from ultralytics import YOLO
model = YOLO(MODEL_PATHS[0])  # Use any model, just for API access
metrics = model.val(
    data=EVAL_YAML,
    split='val',
    pred=PRED_LABEL_DIR
)
print("\n🎯 mAP@0.5 evaluation complete. See printed results above.") 