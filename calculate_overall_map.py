import pandas as pd
import os

# Paths to result.csv files for each model
RESULT_PATHS = [
    'runs/detect/FireExtinguisher/results.csv',
    'runs/detect/ToolBox/results.csv',
    'runs/detect/OxygenTank/results.csv'
]

class_names = ['FireExtinguisher', 'ToolBox', 'OxygenTank']
map_scores = []

for path, name in zip(RESULT_PATHS, class_names):
    if not os.path.exists(path):
        print(f"❌ File not found: {path}")
        continue
    df = pd.read_csv(path)
    # Get the last non-NaN value in the 'metrics/mAP50(B)' column
    map50 = df['metrics/mAP50(B)'].dropna().values[-1]
    map_scores.append(map50)
    print(f"{name}: mAP@0.5 = {map50:.4f}")

if map_scores:
    overall_map = sum(map_scores) / len(map_scores)
    print(f"\nOverall mAP@0.5 (mean of all classes): {overall_map:.4f}")
else:
    print("No mAP@0.5 scores found. Please check your result.csv files.") 
