import os
from ultralytics import YOLO

# Path to the dataset YAML file
DATA_YAML = "yolo_params.yaml"

# Training configuration (multi-class, tailored for 4GB VRAM)
TRAIN_ARGS = dict(
    model="yolov8m.pt",
    epochs=200,
    imgsz=640,
    batch=8,
    optimizer="AdamW",
    lr0=0.002,
    lrf=0.0001,
    weight_decay=0.0005,
    momentum=0.937,
    warmup_epochs=3,
    warmup_momentum=0.8,
    mosaic=0.5,
    hsv_h=0.015,
    hsv_s=0.7,
    hsv_v=0.4,
    translate=0.1,
    scale=0.5,
    mixup=0.1,
    shear=0.0,
    copy_paste=0.1,
    patience=25,
    workers=0,
    device=0,
    single_cls=False  # Multi-class detection
)

if __name__ == "__main__":
    print("Starting multi-class YOLOv8 training for all classes...\n")
    model = YOLO(TRAIN_ARGS['model'])
    results = model.train(
        data=DATA_YAML,
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
        name="multiclass"
    )
    print("\n✅ Finished multi-class training! Check weights in runs/detect/multiclass/weights/best.pt") 