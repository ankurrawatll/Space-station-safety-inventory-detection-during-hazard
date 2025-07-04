# Space Station Safety Inventory Detection During Hazard

## 🏆 Overall mAP@0.5 (IoU 0.5) for all classes:
- **Multiclass5 (yolov8m, final hackathon model):** 
  - **Test Set:** 0.87 (87%) - **FINAL EVALUATION**
  - **Training Set:** 0.95 (95%) - **TRAINING PERFORMANCE**
- **Ensemble (one-class models):** 0.9920 (validation), 0.852 (test set)

----

## 🚀 Project Overview
This project provides a robust, modular pipeline for detecting and classifying critical safety equipment—**Fire Extinguisher, ToolBox, and Oxygen Tank**—in industrial or space station environments using YOLOv8 object detection. The solution is designed for high accuracy, real-time performance, and easy extensibility.

**Two main approaches were explored:**
- **1. Multiclass Model (multiclass5):** A single YOLOv8m model trained to detect all classes at once. **This is the final, official hackathon submission with the highest test set performance.**
- **2. Ensemble of Three One-Class Models:** Separate YOLOv8 models for each class, combined for final predictions.

---

## 📚 Project Journey & Approach

### 1. **Dataset Preparation**
- **Raw data** is organized into `data/train/`, `data/val/`, and `data/test/` with `images/` and `labels/` subfolders (YOLO format).
- **Class list** is defined in `classes.txt`.
- **grouping.py**: Separates dataset by class for one-class training.

### 2. **One-Class Model Training (Ensemble Approach)**
- **train_all_oneclass.py**: Trains a separate YOLOv8 model for each class (FireExtinguisher, ToolBox, OxygenTank) using class-specific data.
- **generate_oneclass_yamls.py**: Auto-generates YAML config files for each class.
- **Results** are saved in `runs/detect/<ClassName>/`.
- **Ensemble evaluation**: Predictions from all three models are combined using NMS for final scoring.

### 3. **Multi-Class Model Training (Final Hackathon Model)**
- **train_multiclass.py**: Trains a single YOLOv8 model to detect all three classes at once, using the full dataset and a shared YAML config (`yolo_params.yaml`).
- **Results** are saved in `runs/detect/multiclass3/`.
- **This multiclass3 model is the official, genuine hackathon submission.**

### 4. **Evaluation & Reporting**
- **ensemble_evaluate.py**: Runs all three one-class models on each test image, combines predictions (with NMS), and evaluates the ensemble mAP@0.5.
- **calculate_overall_map.py**: Reads the final mAP@0.5 from each one-class model's `results.csv` and computes the mean (overall) mAP@0.5 for reporting.
- **predict.py**: Runs inference and validation for the multiclass3 model and reports its mAP@0.5 on the test set.

### 5. **Visualization & Inference**
- **visualize.py**: Visualizes predictions and results.
- **predict.py**: Runs inference on new images using any trained model.

### 6. **Apps & Deployment**
- **safety-detection-app/**: Full-stack app (backend + frontend in FastApi and React) for real-time detection and history.
- **streamlit_app/**: Streamlit-based app for visualization and data collection.

---

## 📁 Folder & File Structure

```plaintext
HackByte_Dataset/
│
├── README.md                    # Project documentation
├── classes.txt                  # List of class names
├── yolo_params.yaml             # YOLO hyperparameters and dataset config
├── calculate_overall_map.py     # Calculates overall mAP@0.5 score (IoU = 0.5)
├── ensemble_evaluate.py         # Ensembles predictions from all models and evaluates mAP
├── ensemble_eval.yaml           # Dataset YAML for ensemble evaluation
├── train_multiclass.py          # Trains a single YOLOv8 model for all classes
├── train_all_oneclass.py        # Trains one-class YOLOv8 models for each class
├── train_only.py                # (Empty or custom training script)
├── generate_oneclass_yamls.py   # Auto-generates YAMLs for each class
├── grouping.py                  # Script to separate dataset by class
├── visualize.py                 # Script to visualize predictions
├── predict.py                   # Script to run inference and validation
├── Testing.py                   # Script for testing code or models
├── yolo11n.pt                   # (Optional) Additional YOLO weights
├── yolov8s.pt                   # Pretrained YOLOv8s weights
├── push.bat                     # Batch script to push code to GitHub
│
├── ENV_SETUP/                   # Environment setup scripts
│   ├── install_packages.bat
│   ├── setup_env.bat
│   └── create_env.bat
│
├── data/                        # Dataset root
│   ├── train/
│   │   ├── images/
│   │   ├── labels/
│   │   └── labels.cache
│   ├── val/
│   │   ├── images/
│   │   ├── labels/
│   │   └── labels.cache
│   └── test/
│       ├── images/
│       ├── labels/
│       └── labels.cache
│
├── predictions/                 # Model predictions (images and labels)
│   ├── images/
│   └── labels/
│
├── ensemble_pred_labels/        # Ensemble model predictions (YOLO label format)
│   └── *.txt
│
├── runs/                        # YOLO training and detection outputs
│   └── detect/
│       ├── FireExtinguisher/
│       │   └── weights/
│       │       ├── best.pt
│       │       └── last.pt
│       ├── ToolBox/
│       │   └── weights/
│       │       ├── best.pt
│       │       └── last.pt
│       ├── OxygenTank/
│       │   └── weights/
│       │       ├── best.pt
│       │       └── last.pt
│       ├── multiclass5/
│       │   ├── weights/
│       │   │   ├── best.pt
│       │   │   └── last.pt
│       │   ├── results.csv
│       │   ├── confusion_matrix.png
│       │   ├── confusion_matrix_normalized.png
│       │   ├── ...
│       ├── multiclass/
│       ├── multiclass2/
│       ├── val/
│       ├── val2/
│       ├── val3/
│       ├── val5/
│
├── safety-detection-app/        # Full-stack app
│   ├── backend/
│   │   └── main.py
│   └── frontend/
│       ├── index.html
│       ├── package.json
│       ├── package-lock.json
│       ├── postcss.config.cjs
│       ├── tailwind.config.cjs
│       ├── src/
│       ├── dist/
│       └── node_modules/
│
└── streamlit_app/               # Streamlit-based app for visualization or data collection
    ├── app.py
    ├── output/
    └── data_collection/
```

---

## 📊 Model Accuracy
- **FireExtinguisher**: mAP@0.5 = **0.987**
- **ToolBox**: mAP@0.5 = **0.994**
- **OxygenTank**: mAP@0.5 = **0.994**
- **Overall (mean, one-class models)**: **0.9920**
- **Multi-class model (100 epochs)**: **0.945**

---

## 🧑‍🔬 Model Approaches & Final Submission

### 1. **Multiclass Model (multiclass5) [Final Hackathon Submission - PRIORITY]**
- **Description:** Trains a single YOLOv8m model to detect all three classes at once. This is the official model submitted for the hackathon with the highest test set performance.
- **Test Set mAP@0.5:** **0.87 (87%)** - **FINAL EVALUATION RESULT**
- **Training Set mAP@0.5:** **0.95 (95%)** - **TRAINING PERFORMANCE**
- **Per-Class mAP@0.5 (Test Set):**
  - FireExtinguisher: 0.884 (88.4%)
  - ToolBox: 0.863 (86.3%)
  - OxygenTank: 0.863 (86.3%)
- **Model Weights:** `runs/detect/multiclass5/weights/best.pt`
- **Key Improvement:** +0.018 mAP@0.5 improvement over yolov8s model by using yolov8m
- **How to run:**
  ```bash
  python predict.py
  ```
- **Note:** This is the final, genuine model for hackathon evaluation and reporting. Test set results (0.87) represent the true performance on unseen data.

### 2. **Ensemble of Three One-Class Models**
- **Description:** Trains a separate YOLOv8 model for each class (FireExtinguisher, ToolBox, OxygenTank) and combines their predictions using NMS for final evaluation.
- **Test Set mAP@0.5:** **0.852** (ensemble evaluation)
- **Per-Class mAP@0.5:**
  - FireExtinguisher: 0.875
  - ToolBox: 0.838
  - OxygenTank: 0.843
- **How to run:**
  ```bash
  python ensemble_evaluate.py
  ```

---

## 🧮 Calculate Overall mAP@0.5 for All Classes
To compute the overall (mean) mAP@0.5 across all three one-class models, use:

```bash
python calculate_overall_map.py
```

This script reads the `results.csv` files from each model's training output (in `runs/detect/FireExtinguisher/`, `runs/detect/ToolBox/`, and `runs/detect/OxygenTank/`), extracts the final mAP@0.5 value for each, and prints the mean mAP@0.5. This is useful for reporting your system's combined performance to judges or in documentation.

---

## ⚙️ Setup & Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ankurrawatll/Space-station-safety-inventory-detection-during-hazard.git
   cd HackByte_Dataset
   ```
2. **Install Python & pip**
   - Python 3.8+ is recommended.
3. **Install Requirements**
   - Use the provided batch scripts in `ENV_SETUP/` or install manually:
   ```bash
   pip install ultralytics tqdm opencv-python matplotlib pyyaml torch pandas
   ```

---

## 🏋️‍♂️ Training & Evaluation

- **Train all one-class models:**
  ```bash
  python train_all_oneclass.py
  ```
- **Train a multi-class model:**
  ```bash
  python train_multiclass.py
  ```
- **Ensemble evaluation:**
  ```bash
  python ensemble_evaluate.py
  ```
- **Calculate overall mAP@0.5:**
  ```bash
  python calculate_overall_map.py
  ```

---

## 🔍 Inference & Visualization
- **Run inference:**
  ```bash
  python predict.py --weights runs/detect/multiclass/weights/best.pt --source data/test/images/001.png
  ```
- **Visualize predictions:**
  ```bash
  python visualize.py
  ```

---

## 🧩 Why This Project is Innovative & Competitive
- **Automated, scalable dataset handling** for both one-class and multi-class scenarios.
- **Ensemble evaluation** for best possible mAP@0.5.
- **Optimized for low-resource hardware** (RTX 3050 4GB VRAM).
- **High accuracy** with minimal overfitting due to careful augmentation and early stopping.
- **Modular, well-documented code** for easy extension and deployment.
- **Ready for real-world deployment** in safety-critical environments.

---

## 📬 Contact & Contribution
- For issues or contributions, open an issue or pull request on [GitHub](https://github.com/ankurrawatll/Space-station-safety-inventory-detection-during-hazard).

---

**Made with ❤️ for Hackathon and Industrial Safety!** 
