import os
import sys
import io
import logging
import warnings
import traceback

# =====================================================
# SUPPRESS TF NOISE
# =====================================================
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

warnings.filterwarnings("ignore")
logging.getLogger("tensorflow").setLevel(logging.ERROR)

# =====================================================
# IMPORTS
# =====================================================
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from PIL import Image

# Optional TF imports (SAFE)
try:
    from tensorflow.keras.models import load_model
    from tensorflow.keras.preprocessing import image
    TF_AVAILABLE = True
except Exception:
    TF_AVAILABLE = False
    load_model = None
    image = None

# =====================================================
# APP INIT
# =====================================================
app = FastAPI(title="MedHive AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# PATHS
# =====================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# =====================================================
# MODEL VARS
# =====================================================
symptom_model = None
symptom_columns = []

heart_model = None
diabetes_model = None
liver_model = None
ecg_model = None

print(f"📦 MODEL DIR: {MODEL_DIR}")

# =====================================================
# LOAD MODELS
# =====================================================
def load_joblib(name):
    try:
        model = joblib.load(os.path.join(MODEL_DIR, name))
        print(f"✅ Loaded {name}")
        return model
    except Exception:
        print(f"❌ Failed {name}")
        traceback.print_exc()
        return None

symptom_model = load_joblib("disease_prediction_model.pkl")
try:
    symptom_columns = joblib.load(os.path.join(MODEL_DIR, "symptom_columns.pkl"))
except Exception:
    symptom_columns = []

heart_model = load_joblib("heart_model.pkl")
diabetes_model = load_joblib("diabetes_model_cleaned.pkl")
liver_model = load_joblib("liver_model.pkl")

# ---- ECG MODEL (OPTIONAL)
if TF_AVAILABLE:
    try:
        ecg_path = os.path.join(MODEL_DIR, "ecg_heart_model_final.keras")
        old_stdout, old_stderr = sys.stdout, sys.stderr
        sys.stdout, sys.stderr = io.StringIO(), io.StringIO()
        ecg_model = load_model(ecg_path, compile=False, safe_mode=False)
        sys.stdout, sys.stderr = old_stdout, old_stderr
        print("✅ ECG model loaded")
    except Exception:
        sys.stdout, sys.stderr = old_stdout, old_stderr
        ecg_model = None
        print("❌ ECG model failed")
        traceback.print_exc()
else:
    print("⚠️ TensorFlow not installed – ECG disabled")

# =====================================================
# SCHEMAS
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
# SAFE PREDICT
# =====================================================
def safe_predict(model, features):
    X = np.array(features).reshape(1, -1)
    pred = int(model.predict(X)[0])

    prob = None
    if hasattr(model, "predict_proba"):
        try:
            prob = float(model.predict_proba(X)[0][-1]) * 100
        except Exception:
            prob = 100.0 if pred == 1 else 0.0
    else:
        prob = 100.0 if pred == 1 else 0.0

    return pred, round(prob, 2)

# =====================================================
# ROUTES
# =====================================================
@app.get("/")
def root():
    return {"status": "MedHive AI Service Running"}

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

    def norm(t): return t.lower().replace(" ", "_")
    vec = [1 if norm(c) in map(norm, data.symptoms) else 0 for c in symptom_columns]
    if sum(vec) == 0:
        return {"matched": 0, "top_predictions": []}

    probs = symptom_model.predict_proba([vec])[0]
    res = sorted(
        [{"disease": str(c), "probability": round(float(p) * 100, 2)}
         for c, p in zip(symptom_model.classes_, probs)],
        key=lambda x: x["probability"],
        reverse=True
    )[:3]

    return {"matched": sum(vec), "top_predictions": res}

# =====================================================
# HEART / DIABETES / LIVER
# =====================================================
@app.post("/predict/heart")
def predict_heart(data: HeartInput):
    if heart_model is None:
        raise HTTPException(503, "Heart model not loaded")

    X = [[
        data.age, data.sex, data.cp, data.trestbps, data.chol,
        data.fbs, data.restecg, data.thalach, data.exang,
        data.oldpeak, data.slope, data.ca, data.thal
    ]]

    label = heart_model.predict(X)[0]              # Presence / Absence
    probs = heart_model.predict_proba(X)[0]
    prob_presence = float(probs[1]) * 100

    # MEDICAL threshold (NOT ML default)
    is_danger = prob_presence >= 40

    return {
        "prediction": "Presence" if is_danger else "Absence",
        "raw_model_label": label,
        "probability": round(prob_presence, 2),
        "risk_level": (
            "High Risk" if prob_presence >= 70 else
            "Moderate Risk" if prob_presence >= 40 else
            "Low Risk"
        )
    }


# =====================================================
# ECG (OPTIONAL)
# =====================================================
@app.post("/predict/ecg")
async def predict_ecg(file: UploadFile = File(...)):
    if ecg_model is None:
        raise HTTPException(503, "ECG model unavailable")

    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    arr = image.img_to_array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)

    prob = float(ecg_model.predict(arr)[0][0])
    return {
        "prediction": "Heart Disease Detected" if prob > 0.5 else "Normal ECG",
        "confidence": round(prob * 100, 2)
    }
