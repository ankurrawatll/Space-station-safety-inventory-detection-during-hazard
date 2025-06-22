# from ultralytics import YOLO
# import cv2
# import os
# import matplotlib.pyplot as plt

# # Paths to model weights
# fire_model_path = 'runs/detect/FireExtinguisher/weights/best.pt'
# toolbox_model_path = 'runs/detect/ToolBox/weights/best.pt'
# oxygen_model_path = 'runs/detect/OxygenTank/weights/best.pt'

# # Class names for each model
# class_names = ['FireExtinguisher', 'ToolBox', 'OxygenTank']
# model_paths = [fire_model_path, toolbox_model_path, oxygen_model_path]

# # Load all models
# models = [YOLO(path) for path in model_paths]

# # Path to test image (update for your environment)
# test_img_path = 'test_images/3.png'

# # Run inference for each model and collect results
# results_list = []
# all_detections = []
# for model, class_name in zip(models, class_names):
#     results = model(test_img_path)
#     detections = []
#     for r in results:
#         if r.boxes is not None:
#             boxes = r.boxes.xyxy.cpu().numpy()
#             confs = r.boxes.conf.cpu().numpy()
#             for box, conf in zip(boxes, confs):
#                 det = {'class': class_name, 'conf': float(conf), 'box': [float(x) for x in box]}
#                 detections.append(det)
#                 all_detections.append(det)
#     results_list.append({'class': class_name, 'detections': detections})

# # Print report for each model
# print("\n--- Detection Report for test_images/1.png ---\n")
# for res in results_list:
#     print(f"Model: {res['class']}")
#     if res['detections']:
#         for i, det in enumerate(res['detections'], 1):
#             print(f"  Detection {i}: Confidence={det['conf']:.2f}, Box={det['box']}")
#     else:
#         print("  No detections.")
#     print()

# # Print summary table
# print("Summary Table:")
# print(f"{'Model':<18} | {'# Detections':<12}")
# print('-'*32)
# for res in results_list:
#     print(f"{res['class']:<18} | {len(res['detections']):<12}")

# # Draw all detections on the image
# image = cv2.imread(test_img_path)
# color_map = {
#     'FireExtinguisher': (0, 255, 0),   # Green
#     'ToolBox': (255, 0, 0),            # Blue
#     'OxygenTank': (0, 0, 255)          # Red
# }
# for det in all_detections:
#     x1, y1, x2, y2 = map(int, det['box'])
#     label = f"{det['class']} {det['conf']:.2f}"
#     color = color_map.get(det['class'], (255, 255, 0))
#     cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
#     cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

# # Save the result image
# output_path = 'test_images/1_ensemble_result.png'
# cv2.imwrite(output_path, image)
# print(f"\n✅ Ensemble result image saved to {output_path}")

# # Show the result inline if in a notebook
# try:
#     image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
#     plt.figure(figsize=(10, 8))
#     plt.imshow(image_rgb)
#     plt.axis('off')
#     plt.title('Ensemble Detection Result')
#     plt.show()
# except Exception as e:
#     print(f"Could not display image inline: {e}") 





import os
import cv2
from ultralytics import YOLO
import matplotlib.pyplot as plt

# ------------------------------ Config ------------------------------
# Model paths
fire_model_path = 'runs/detect/FireExtinguisher/weights/best.pt'
toolbox_model_path = 'runs/detect/ToolBox/weights/best.pt'
oxygen_model_path = 'runs/detect/OxygenTank/weights/best.pt'

model_paths = [fire_model_path, toolbox_model_path, oxygen_model_path]
class_names = ['FireExtinguisher', 'ToolBox', 'OxygenTank']
color_map = {
    'FireExtinguisher': (0, 255, 0),
    'ToolBox': (255, 0, 0),
    'OxygenTank': (0, 0, 255)
}

# Input and output folders
input_folder = 'test_images'
output_folder = 'result_photos'
os.makedirs(output_folder, exist_ok=True)

# Confidence threshold
CONF_THRESHOLD = 0.5

# ------------------------------ Load Models ------------------------------
models = [YOLO(path) for path in model_paths]

# ------------------------------ Process All Images ------------------------------
image_files = [f for f in os.listdir(input_folder) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]

print(f"\n📁 Found {len(image_files)} test images. Starting ensemble detection...\n")

for img_name in image_files:
    img_path = os.path.join(input_folder, img_name)
    image = cv2.imread(img_path)
    all_detections = []

    for model, class_name in zip(models, class_names):
        results = model(img_path)
        for r in results:
            if r.boxes is not None:
                boxes = r.boxes.xyxy.cpu().numpy()
                confs = r.boxes.conf.cpu().numpy()
                for box, conf in zip(boxes, confs):
                    if float(conf) > CONF_THRESHOLD:
                        det = {
                            'class': class_name,
                            'conf': float(conf),
                            'box': [float(x) for x in box]
                        }
                        all_detections.append(det)

    # Draw all detections
    for det in all_detections:
        x1, y1, x2, y2 = map(int, det['box'])
        label = f"{det['class']} {det['conf']:.2f}"
        color = color_map.get(det['class'], (255, 255, 0))
        cv2.rectangle(image, (x1, y1), (x2, y2), color, 2)
        cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.8, color, 2)

    # Save result image
    save_path = os.path.join(output_folder, img_name)
    cv2.imwrite(save_path, image)
    print(f"✅ Saved: {save_path}")

print(f"\n🎉 Ensemble detection completed for all images.\n🖼️ Output saved to: {output_folder}")
