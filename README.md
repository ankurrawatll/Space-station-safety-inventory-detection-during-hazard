# Space Station Safety Inventory Detection During Hazard

> **🏆 Overall mAP@0.5 (IoU 0.5) for all classes: 0.9920**

## 🚀 Project Overview
This project provides an automated solution for detecting and classifying critical safety equipment—**Fire Extinguisher, ToolBox, and Oxygen Tank**—in industrial or space station environments using YOLOv8 object detection. The pipeline is designed for robust, real-time detection, even on limited hardware (e.g., RTX 3050 4GB VRAM), and is highly modular and scalable.

## 📁 Folder & File Structure

```
HackByte_Dataset/
│
├── .git/                        # Git repository folder
├── README.md                    # Project documentation
├── push.bat                     # Batch script to push code to GitHub
├── grouping.py                  # Script to separate dataset by class
├── visualize.py                 # Script to visualize predictions
├── Testing.py                   # (Not previously documented) Likely for testing code or models
├── train_all_oneclass.py        # Main script: trains one-class YOLOv8 models for each class
├── generate_oneclass_yamls.py   # Script to auto-generate YAMLs for each class
├── yolo11n.pt                   # (Optional) Additional YOLO weights
├── runs/                        # YOLO training and detection outputs
├── yolov8s.pt                   # Pretrained YOLOv8s weights
├── predict.py                   # Script to run inference on new images
├── yolo_params.yaml             # YOLO hyperparameters
├── ENV_SETUP/                   # Environment setup scripts
├── classes.txt                  # List of class names

```

## 🧠 Model & Approach
- **YOLOv8s** is used for its speed and accuracy, optimized for 4GB VRAM.
- **One-class-per-model**: Each class (FireExtinguisher, ToolBox, OxygenTank) is trained as a separate model for focused detection.
- **Custom dataset separation**: `grouping.py` automatically sorts images and labels into class-specific folders, handling multi-class images.
- **Augmentation**: Conservative use of mosaic, HSV, translation, and scaling to prevent overfitting on small datasets.
- **Early stopping** and **patience** to avoid overfitting.
- **Automated YAML generation** for each class with `generate_oneclass_yamls.py`.

## 📊 Model Accuracy
- **FireExtinguisher**: mAP@50 = **98.7%**
- **ToolBox**: mAP@50 = **99.4%**
- **OxygenTank**: mAP@50 = **99.5%**

## 🧮 Calculate Overall mAP@0.5 for All Classes
To compute the overall (mean) mAP@0.5 across all three one-class models, use the provided script:

```bash
python calculate_overall_map.py
```

This script reads the `results.csv` files from each model's training output (in `runs/detect/FireExtinguisher/`, `runs/detect/ToolBox/`, and `runs/detect/OxygenTank/`), extracts the final mAP@0.5 value for each, and prints the mean mAP@0.5. This is useful for reporting your system's combined performance to judges or in documentation.

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ankurrawatll/Space-station-safety-inventory-detection-during-hazard-.-.git
cd HackByte_Dataset
```

### 2. Install Python & pip
- Python 3.8+ is recommended.
- [Download Python](https://www.python.org/downloads/)

### 3. Install Requirements
You can use the provided batch scripts or install manually:

**Using batch script (Windows):**
```bash
cd ENV_SETUP
./install_packages.bat
```

**Or manually with pip:**
```bash
pip install ultralytics tqdm opencv-python matplotlib pyyaml torch pandas
```

## 🏋️‍♂️ Training the Models

**Train all one-class models:**
```bash
python train_all_oneclass.py
```
- This will train a separate YOLOv8 model for each class using the data in `data/separated_dataset/`.
- Weights and results will be saved in `runs/detect/<ClassName>/weights/best.pt`.

**Train a single class:**
```bash
python train_fireextinguisher.py
# or
python train_oxygentank.py
# or
python train_toolbox.py
```

## 🔍 Testing & Inference

**Run inference on new images:**
```bash
python predict.py --weights runs/detect/FireExtinguisher/weights/best.pt --source test_images/1.png
```
- Replace the weights and source as needed for other classes or images.

**Visualize predictions:**
```bash
python visualize.py
```

## 🧩 Dataset Preparation
- To separate your dataset by class for one-class training, run:
```bash
python grouping.py
```
- This will create `data/separated_dataset_test/` with images and labels sorted by class.

## 🏆 Why This Project is Innovative & Competitive
- **Automated, scalable dataset handling** for one-class and multi-class scenarios.
- **Optimized for low-resource hardware** (RTX 3050 4GB VRAM).
- **High accuracy** with minimal overfitting due to careful augmentation and early stopping.
- **Modular, well-documented code** for easy extension and deployment.
- **Ready for real-world deployment** in safety-critical environments.

## 📬 Contact & Contribution
- For issues or contributions, open an issue or pull request on [GitHub](https://github.com/ankurrawatll/Space-station-safety-inventory-detection-during-hazard-.-).

---

**Made with ❤️ for Hackathon and Industrial Safety!** 
