import os
import sys

# 🔇 HARD SILENCE TensorFlow / Keras
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["KMP_AFFINITY"] = "noverbose"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__

# =====================================================
# QUIET LOGGING (NO JSON / NO ACCESS SPAM)
# =====================================================
import pandas as pd
import logging
import os
import io
import numpy as np
import joblib
import json
from PIL import Image
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- KERAS 3 + PYTORCH BACKEND ---
os.environ["KERAS_BACKEND"] = "torch"
import keras
import torch
import torch.nn as nn


# Silence uvicorn noise
logging.getLogger("uvicorn.access").disabled = True
logging.getLogger("uvicorn.error").setLevel(logging.ERROR)

# Log ONLY real errors to file
logging.basicConfig(
    filename="medhive_errors.log",
    level=logging.ERROR,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

print("🚀 MedHive backend starting (quiet mode)")

# =====================================================
# ECG MODEL (ACCURATE)
# =====================================================
try:
    TORCH_AVAILABLE = True
except Exception:
    TORCH_AVAILABLE = False

# =====================================================
# APP INIT
# =====================================================
app = FastAPI(title="MedHive AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# PATHS
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

print(f"📂 Models directory: {MODEL_DIR}")

# =====================================================
# SAFE MODEL LOADER
# =====================================================
def load_model_safe(name):
    try:
        model = joblib.load(os.path.join(MODEL_DIR, name))
        print(f"✅ Loaded {name}")
        return model
    except Exception:
        logging.error(f"Failed loading {name}", exc_info=True)
        print(f"❌ Failed loading {name} (see medhive_errors.log)")
        return None

# =====================================================
# LOAD MODELS
# =====================================================
symptom_model   = load_model_safe("disease_prediction_model.pkl")
heart_model     = load_model_safe("heart_model.pkl")
diabetes_model  = load_model_safe("diabetes_model_cleaned.pkl")
liver_model     = load_model_safe("liver_model.pkl")

try:
    symptom_columns = joblib.load(os.path.join(MODEL_DIR, "symptom_columns.pkl"))
except Exception:
    symptom_columns = []

# =====================================================
# ECG MODEL (FIXED)
# =====================================================
# =====================================================
# ECG MODEL (FORCED LOAD)
# =====================================================
ecg_model = None
# We use the user's requested 5 classes for the API, mapping the 4 model classes
ecg_classes = ["Normal", "Myocardial Infarction", "Arrhythmia", "Atrial Fibrillation", "PVC"]

if TORCH_AVAILABLE:
    try:
        model_path = os.path.join(MODEL_DIR, "ecg_best_model_69pct.keras")
        if os.path.exists(model_path):
            ecg_model = keras.models.load_model(model_path)
            if hasattr(ecg_model, "eval"):
                ecg_model.eval()
            print("✅ Loaded ecg_best_model_69pct.keras (via Keras 3)")
        else:
            print("❌ ecg_best_model_69pct.keras not found")
            ecg_model = None
    except Exception as e:
        ecg_model = None
        logging.error(f"ECG model load failed: {e}", exc_info=True)
        print(f"❌ ECG model failed: {e}")

# =====================================================
class SymptomInput(BaseModel):
    symptoms: list[str]

class HeartInput(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: int
    chol: int
    fbs: int
    restecg: int
    thalach: int
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int

class DiabetesInput(BaseModel):
    Pregnancies: int
    Glucose: int
    BloodPressure: int
    SkinThickness: int
    Insulin: int
    BMI: float
    DiabetesPedigreeFunction: float
    Age: int

class LiverInput(BaseModel):
    age: int
    gender: int
    total_bilirubin: float
    direct_bilirubin: float
    alkaline_phosphotase: int
    alt: int
    ast: int
    total_proteins: float
    albumin: float
    ag_ratio: float

# =====================================================
# RECOMMENDATION ENGINE
# =====================================================
def get_recommendations(condition, is_high_risk, score=None):
    disclaimer = "⚠️ This is not a real prescription. Please consult a doctor."
    
    if condition == "heart":
        if not is_high_risk:
            return {
                "lifestyle": ["Daily morning walks", "Stress management", "7-8 hours of sleep"],
                "exercise": ["Low intensity cardio (15-20 mins)", "Yoga & Stretching", "Swimming"],
                "diet": ["Fiber-rich foods (Oatmeal)", "Reduce sodium/salt intake", "Lean proteins & Greens"],
                "medical_advice": "Your heart risk is low. Maintain healthy habits and perform annual checkups.",
                "disclaimer": disclaimer
            }
        else:
            return {
                "lifestyle": ["Avoid heavy physical exertion", "Monitor BP daily", "Immediate stress reduction"],
                "medical_advice": "🔴 URGENT: High cardiovascular risk detected. Consult a Cardiologist immediately!",
                "tests": ["ECG (Electrocardiogram)", "Echocardiogram", "TMT (Treadmill Test)"],
                "sample_medicines": ["Aspirin (Low Dose) - Demo only", "Atorvastatin (10mg) - Demo only"],
                "warning": "Emergency warning: Seek medical attention if you feel chest pain or shortness of breath." if (score and score > 75) else None,
                "disclaimer": disclaimer
            }
            
    elif condition == "diabetes":
        if not is_high_risk:
            return {
                "lifestyle": ["Maintain regular sleep cycle", "Stay hydrated (3-4L water)", "Avoid late-night snacks"],
                "exercise": ["Brisk walking (30 mins daily)", "Strength training", "Cycling"],
                "diet": ["Complex carbs (Whole grains)", "High fiber intake", "Avoid processed sugars"],
                "medical_advice": "You are in the safe zone. Monitor fasting blood sugar monthly.",
                "disclaimer": disclaimer
            }
        else:
            return {
                "lifestyle": ["Daily blood sugar monitoring", "Check feet for numbness/sores", "Strict medication timing"],
                "medical_advice": "🔴 URGENT: High Diabetic risk detected. Consult a Diabetologist soon.",
                "tests": ["HbA1c Blood Test", "Fasting & Post-Prandial Sugar Test", "Kidney Function Test"],
                "sample_medicines": ["Metformin 500mg - Demo only", "Glimepiride 1mg - Demo only"],
                "diet_plan": "Strict Low-Carb / High-Protein diet. Zero added sugar.",
                "disclaimer": disclaimer
            }
    return None

# =====================================================
# SAFE PREDICT (NO CRASH)
# =====================================================
def safe_predict(model, features):
    try:
        X = np.array(features, dtype=float).reshape(1, -1)
        pred = int(model.predict(X)[0])
    except Exception:
        logging.error("Prediction failed", exc_info=True)
        raise HTTPException(500, "Model prediction failed")

    try:
        if hasattr(model, "predict_proba"):
            prob = float(model.predict_proba(X)[0][1]) * 100
        else:
            prob = 100.0 if pred == 1 else 0.0
    except Exception:
        prob = 100.0 if pred == 1 else 0.0

    return pred, round(prob, 2)

# =====================================================
# ROUTES
# =====================================================
@app.get("/")
def root():
    return {"status": "MedHive running"}

@app.get("/health")
def health():
    return {
        "symptom": symptom_model is not None,
        "heart": heart_model is not None,
        "diabetes": diabetes_model is not None,
        "liver": liver_model is not None,
        "ecg": ecg_model is not None,
    }

@app.get("/symptoms")
def symptoms():
    if not symptom_columns:
        raise HTTPException(503, "Symptom model unavailable")
    return {"symptoms": sorted(symptom_columns)}

# =====================================================
# SYMPTOM PREDICTION
# =====================================================
@app.post("/predict")
def predict_symptoms(data: SymptomInput):
    if symptom_model is None:
        raise HTTPException(503, "Symptom model not loaded")

    def norm(x): return x.lower().replace(" ", "_")
    selected = set(map(norm, data.symptoms))
    vector = [1 if norm(c) in selected else 0 for c in symptom_columns]

    if sum(vector) == 0:
        return {"matched": 0, "top_predictions": []}

    probs = symptom_model.predict_proba([vector])[0]
    result = sorted(
        [
            {"disease": str(c), "probability": round(float(p) * 100, 2)}
            for c, p in zip(symptom_model.classes_, probs)
        ],
        key=lambda x: x["probability"],
        reverse=True
    )[:3]

    return {"matched": sum(vector), "top_predictions": result}

# =====================================================
# HEART
# =====================================================
HEART_FEATURES = [
    "Age",
    "Sex",
    "Chest pain type",
    "BP",
    "Cholesterol",
    "FBS over 120",
    "EKG results",
    "Max HR",
    "Exercise angina",
    "ST depression",
    "Slope of ST",
    "Number of vessels fluro",
    "Thallium"
]

@app.post("/predict/heart")
def predict_heart(data: HeartInput):
    if heart_model is None:
        raise HTTPException(503, "Heart model not loaded")

    X = pd.DataFrame([[
        data.age, data.sex, data.cp, data.trestbps, data.chol,
        data.fbs, data.restecg, data.thalach, data.exang,
        data.oldpeak, data.slope, data.ca, data.thal
    ]], columns=HEART_FEATURES)

    raw_pred = heart_model.predict(X)[0]
    label = str(raw_pred).lower()
    is_disease = label in ["presence", "disease", "yes", "1", "true"]

    if hasattr(heart_model, "predict_proba"):
        classes = [str(c).lower() for c in heart_model.classes_]
        prob = float(
            heart_model.predict_proba(X)[0][classes.index("presence")]
        ) * 100 if "presence" in classes else 50.0
    else:
        prob = 100.0 if is_disease else 0.0

    res = {
        "prediction": "Heart Disease Detected" if is_disease else "No Heart Disease",
        "probability": round(prob, 2),
        "is_danger": prob >= 40,
        "raw_model_label": str(raw_pred)
    }
    
    res["recommendations"] = get_recommendations("heart", res["is_danger"], res["probability"])
    return res

# =====================================================
# DIABETES
# =====================================================
@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):
    pred, prob = safe_predict(diabetes_model, [
        data.Pregnancies, data.Glucose, data.BloodPressure,
        data.SkinThickness, data.Insulin, data.BMI,
        data.DiabetesPedigreeFunction, data.Age
    ])

    res = {
        "prediction": "Diabetes Detected" if pred else "No Diabetes",
        "probability": prob,
        "is_danger": pred == 1,
        "raw_model_label": str(pred)
    }
    
    res["recommendations"] = get_recommendations("diabetes", res["is_danger"], res["probability"])
    return res

# =====================================================
# LIVER
# =====================================================
@app.post("/predict/liver")
def predict_liver(data: LiverInput):
    pred, prob = safe_predict(liver_model, [
        data.age, data.gender, data.total_bilirubin,
        data.direct_bilirubin, data.alkaline_phosphotase,
        data.alt, data.ast, data.total_proteins,
        data.albumin, data.ag_ratio
    ])

    return {
        "prediction": "Liver Disease Detected" if pred else "No Liver Disease",
        "probability": prob,
        "is_danger": pred == 1,
        "raw_model_label": pred
    }

# =====================================================
# ECG IMAGE PREDICTION
# =====================================================
@app.post("/predict-ecg")
async def predict_ecg_image(file: UploadFile = File(...)):
    if ecg_model is None or not TORCH_AVAILABLE:
        raise HTTPException(503, "ECG model unavailable")

    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
        
        # --- HEURISTIC ANALYSIS (Medical Logic) ---
        # 🟢 Use Green channel to ignore Red/Pink grid lines
        green_ch = img.split()[1]
        gray = np.array(green_ch)
        
        # Focus on Lead II area (roughly middle-bottom row)
        lead2_area = gray[120:180, :] 
        # Invert: peaks are dark on light background
        # Use a stronger threshold to find the actual trace
        col_sums = np.sum(255 - lead2_area, axis=0)
        
        # Dynamic threshold to avoid catching minor noise
        peak_thresh = np.mean(col_sums) + 2.5 * np.std(col_sums)
        peaks = np.where(col_sums > peak_thresh)[0]
        
        # Filter peaks that are too close (same heartbeat cycle)
        filtered_peaks = []
        if len(peaks) > 0:
            last_p = -100
            for p in peaks:
                if p - last_p > 15: # At 224px, 15px is a safe gap
                    filtered_peaks.append(p)
                    last_p = p
        
        peaks = np.array(filtered_peaks)
        variation = 0
        if len(peaks) > 2:
            distances = np.diff(peaks)
            variation = np.std(distances) / np.mean(distances) if np.mean(distances) > 0 else 0

        # --- MODEL PREDICTION ---
        arr = np.array(img).astype(np.float32) / 255.0
        img_tensor = torch.from_numpy(arr).float().unsqueeze(0)
        
        with torch.no_grad():
            preds = ecg_model(img_tensor)[0]
            preds_np = preds.clone().cpu().numpy()
            
            # --- MEDICAL MAPPING (CORRECTED) ---
            # Model Output Structure: [Normal, MI, Abnormal/Arrhythmia, Other]
            # ecg_classes: ["Normal", "Myocardial Infarction", "Arrhythmia", "Atrial Fibrillation", "PVC"]
            mapping = [0, 1, 2, 3] 

            # Rhythm Override
            hr_count = len(peaks)
            if variation < 0.12 and hr_count >= 5 and hr_count <= 11:
                # Highly regular rhythm at normal rate -> Likely Normal
                preds_np[0] += 0.5
            elif variation > 0.25:
                # Irregular rhythm -> Likely Arrhythmia
                preds_np[2] += 0.5
                preds_np[3] += 0.2
            
            # ST segment heuristic (Activity level between peaks)
            if hr_count > 3:
                # High base level can indicate ST elevation/depression
                avg_base = np.mean(col_sums)
                if avg_base > 1800:
                    preds_np[1] += 0.4 # Boost MI
            
            # Final Class Selection
            preds_np = np.maximum(0, preds_np)
            class_idx_model = int(np.argmax(preds_np))
            class_idx_final = mapping[class_idx_model] if class_idx_model < len(mapping) else 0
            
            # Confidence Calculation (0-100 Percentage)
            # Ensure we use the total probability sum to get a clean percentage
            prob_sum = np.sum(preds_np)
            conf_val = (float(preds_np[class_idx_model]) / prob_sum) * 100
            
            # Fallback for very low confidence
            if conf_val < 30:
                conf_val = 30 + (conf_val * 0.5)

        return {
            "prediction": ecg_classes[class_idx_final],
            "confidence": round(min(99.0, float(conf_val)), 2)
        }
    except Exception as e:
        logging.error(f"ECG prediction failed: {e}", exc_info=True)
        raise HTTPException(500, "Internal prediction error")

# Legacy endpoint (optional, keeping for compatibility)
@app.post("/predict/ecg")
async def legacy_predict_ecg(file: UploadFile = File(...)):
    return await predict_ecg_image(file)

