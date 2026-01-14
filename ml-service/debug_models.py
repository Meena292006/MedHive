import joblib
import os
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

print(f"Checking model directory: {MODEL_DIR}")

models = {
    "symptom_columns.pkl": "symptom_columns",
    "disease_prediction_model.pkl": "disease_model",
    "heart_model.pkl": "heart_model",
    "diabetes_model_cleaned.pkl": "diabetes_model",
    "liver_model.pkl": "liver_model"}

for filename, name in models.items():
    path = os.path.join(MODEL_DIR, filename)
    print(f"--- Loading {name} from {path} ---")
    if not os.path.exists(path):
        print(f"ERROR: File not found: {path}")
        continue
        
    try:
        data = joblib.load(path)
        print(f"SUCCESS: Loaded {name}")
        if name == "symptom_columns":
            print(f"Count: {len(data)}")
            print(f"Sample: {data[:5]}")
    except Exception as e:
        print(f"CRITICAL ERROR loading {name}: {e}")
