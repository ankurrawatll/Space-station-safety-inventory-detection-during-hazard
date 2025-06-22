import os
import yaml

CLASSES = ["FireExtinguisher", "ToolBox", "OxygenTank"]
BASE_DIR = os.path.abspath("data/separated_dataset")

for class_name in CLASSES:
    class_dir = os.path.join(BASE_DIR, class_name)
    images_dir = os.path.join(class_dir, "images")
    yaml_path = os.path.join(class_dir, f"{class_name}.yaml")
    data = {
        'train': images_dir,
        'val': images_dir,  # using all images for val for simplicity
        'names': [class_name]
    }
    with open(yaml_path, 'w') as f:
        yaml.dump(data, f)
    print(f"✅ Generated {yaml_path} with absolute image paths") 