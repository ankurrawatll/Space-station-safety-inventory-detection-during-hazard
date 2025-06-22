import os
import shutil

# Define dataset and class mapping
DATASET_DIR = "data"
CLASSES_FILE = os.path.join(DATASET_DIR, "classes.txt")

# Read class names
with open(CLASSES_FILE, "r") as f:
    CLASSES = f.read().splitlines()

print(f"Classes found: {CLASSES}")

# Output directory
OUTPUT_DIR = os.path.join(DATASET_DIR, "separated_dataset_test")

# Create class folders with images and labels subfolders
for cls in CLASSES:
    os.makedirs(os.path.join(OUTPUT_DIR, cls, "images"), exist_ok=True)
    os.makedirs(os.path.join(OUTPUT_DIR, cls, "labels"), exist_ok=True)

# Helper: process one subfolder (test)
def process_split(split_name):
    image_dir = os.path.join(DATASET_DIR, split_name, "images")
    label_dir = os.path.join(DATASET_DIR, split_name, "labels")
    
    print(f"Processing {split_name} split...")
    print(f"Image directory: {image_dir}")
    print(f"Label directory: {label_dir}")

    processed_count = 0
    skipped_count = 0

    for label_file in os.listdir(label_dir):
        if not label_file.endswith(".txt"):
            continue

        label_path = os.path.join(label_dir, label_file)
        # Change .txt to .png for image files
        image_name = label_file.replace(".txt", ".png")
        image_path = os.path.join(image_dir, image_name)

        # Skip if image missing
        if not os.path.exists(image_path):
            print(f"⚠️  Image missing: {image_name}")
            skipped_count += 1
            continue

        with open(label_path, "r") as f:
            lines = f.readlines()

        found_classes = set()
        for line in lines:
            parts = line.strip().split()
            if len(parts) < 5:
                continue
            class_id = int(parts[0])
            if 0 <= class_id < len(CLASSES):
                found_classes.add(CLASSES[class_id])

        # Copy image and label into all relevant class folders
        for cls in found_classes:
            # Copy image
            dest_image_path = os.path.join(OUTPUT_DIR, cls, "images", image_name)
            shutil.copy(image_path, dest_image_path)
            
            # Copy label
            dest_label_path = os.path.join(OUTPUT_DIR, cls, "labels", label_file)
            shutil.copy(label_path, dest_label_path)
            
            print(f"✅ Copied {image_name} to {cls} class")

        processed_count += 1

    print(f"Processed {processed_count} files, skipped {skipped_count} files")

# Run for test set
process_split("test")

print(f"\n✅ All images and labels sorted into class folders in {OUTPUT_DIR}")

# Print summary
for cls in CLASSES:
    cls_image_dir = os.path.join(OUTPUT_DIR, cls, "images")
    cls_label_dir = os.path.join(OUTPUT_DIR, cls, "labels")
    
    image_count = len([f for f in os.listdir(cls_image_dir) if f.endswith('.png')])
    label_count = len([f for f in os.listdir(cls_label_dir) if f.endswith('.txt')])
    
    print(f"{cls}: {image_count} images, {label_count} labels")
