import os
from ultralytics import YOLO
from tqdm import tqdm

# List of classes (should match your dataset)
CLASSES = ["FireExtinguisher", "ToolBox", "OxygenTank"]
BASE_DIR = "data/separated_dataset"

# Training configuration (tailored for laptop/4GB VRAM)
TRAIN_ARGS = dict(
    model="yolov8s.pt",
    epochs=60,
    imgsz=640,
    batch=14,
    optimizer="AdamW",
    lr0=0.001,
    lrf=0.0001,
    weight_decay=0.0005,
    momentum=0.937,
    warmup_epochs=3,
    warmup_momentum=0.8,
    mosaic=0.1,
    hsv_h=0.015,
    hsv_s=0.7,
    hsv_v=0.4,
    translate=0.1,
    scale=0.5,
    mixup=0.0,
    shear=0.0,
    copy_paste=0.0,
    patience=12,
    workers=2,
    device=0,
    single_cls=True
)

if __name__ == "__main__":
    print("Starting one-class YOLOv8 training for all classes...\n")
    for class_name in tqdm(CLASSES, desc="Classes", unit="class"):
        class_dir = os.path.join(BASE_DIR, class_name)
        yaml_path = os.path.join(class_dir, f"{class_name}.yaml")
        if not os.path.exists(yaml_path):
            print(f"❌ YAML not found for {class_name}, skipping.")
            continue
        print(f"\n🚀 Training model for class: {class_name}")
        model = YOLO(TRAIN_ARGS['model'])
        results = model.train(
            data=yaml_path,
            epochs=TRAIN_ARGS['epochs'],
            imgsz=TRAIN_ARGS['imgsz'],
            batch=TRAIN_ARGS['batch'],
            optimizer=TRAIN_ARGS['optimizer'],
            lr0=TRAIN_ARGS['lr0'],
            lrf=TRAIN_ARGS['lrf'],
            weight_decay=TRAIN_ARGS['weight_decay'],
            momentum=TRAIN_ARGS['momentum'],
            warmup_epochs=TRAIN_ARGS['warmup_epochs'],
            warmup_momentum=TRAIN_ARGS['warmup_momentum'],
            mosaic=TRAIN_ARGS['mosaic'],
            hsv_h=TRAIN_ARGS['hsv_h'],
            hsv_s=TRAIN_ARGS['hsv_s'],
            hsv_v=TRAIN_ARGS['hsv_v'],
            translate=TRAIN_ARGS['translate'],
            scale=TRAIN_ARGS['scale'],
            mixup=TRAIN_ARGS['mixup'],
            shear=TRAIN_ARGS['shear'],
            copy_paste=TRAIN_ARGS['copy_paste'],
            patience=TRAIN_ARGS['patience'],
            workers=TRAIN_ARGS['workers'],
            device=TRAIN_ARGS['device'],
            single_cls=TRAIN_ARGS['single_cls'],
            name=class_name
        )
        print(f"✅ Finished training for {class_name}! Check weights in runs/detect/{class_name}/weights/best.pt")
    print("\n🎉 All one-class models have been trained!") 