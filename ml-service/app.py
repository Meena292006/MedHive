# =====================================================
# QUIET LOGGING (NO JSON / NO ACCESS SPAM)
# =====================================================
import pandas as pd
import logging
import os
import io
import numpy as np
import joblib
from PIL import Image
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
# OPTIONAL TENSORFLOW (ECG)
# =====================================================
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

# ECG
ecg_model = None
if TF_AVAILABLE:
    try:
        ecg_model = load_model(
            os.path.join(MODEL_DIR, "ecg_heart_model_final.keras"),
            compile=False
        )
        print("✅ ECG model loaded")
    except Exception:
        logging.error("ECG model load failed", exc_info=True)
        print("❌ ECG model failed (see medhive_errors.log)")

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


# =====================================================
# HEART
# =====================================================
@app.post("/predict/heart")
def predict_heart(data: HeartInput):
    if heart_model is None:
        raise HTTPException(503, "Heart model not loaded")

    try:
        X = pd.DataFrame([[
            data.age,
            data.sex,
            data.cp,
            data.trestbps,
            data.chol,
            data.fbs,
            data.restecg,
            data.thalach,
            data.exang,
            data.oldpeak,
            data.slope,
            data.ca,
            data.thal
        ]], columns=HEART_FEATURES)

        raw_pred = heart_model.predict(X)[0]
        label = str(raw_pred).lower()

        is_disease = label in ["presence", "disease", "yes", "1", "true"]

        if hasattr(heart_model, "predict_proba"):
            classes = [str(c).lower() for c in heart_model.classes_]
            if "presence" in classes:
                idx = classes.index("presence")
                prob = float(heart_model.predict_proba(X)[0][idx]) * 100
            else:
                prob = 50.0
        else:
            prob = 100.0 if is_disease else 0.0

    except Exception as e:
        logging.error("Heart prediction failed", exc_info=True)
        raise HTTPException(500, f"Heart prediction failed: {e}")

    return {
        "prediction": "Heart Disease Detected" if is_disease else "No Heart Disease",
        "probability": round(prob, 2),
        "is_danger": prob >= 40,
        "raw_model_label": raw_pred
    }

# =====================================================
# DIABETES
# =====================================================
@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):
    if diabetes_model is None:
        raise HTTPException(503, "Diabetes model not loaded")

    pred, prob = safe_predict(diabetes_model, [
        data.Pregnancies, data.Glucose, data.BloodPressure,
        data.SkinThickness, data.Insulin, data.BMI,
        data.DiabetesPedigreeFunction, data.Age
    ])

    return {
        "prediction": "Diabetes Detected" if pred else "No Diabetes",
        "probability": prob,
        "is_danger": pred == 1,
        "raw_model_label": pred
    }

# =====================================================
# LIVER
# =====================================================
@app.post("/predict/liver")
def predict_liver(data: LiverInput):
    if liver_model is None:
        raise HTTPException(503, "Liver model not loaded")

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
# ECG
# =====================================================
@app.post("/predict/ecg")
async def predict_ecg(file: UploadFile = File(...)):
    if ecg_model is None:
        raise HTTPException(503, "ECG model unavailable")

    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    arr = image.img_to_array(img) / 255.0
    arr = np.expand_dims(arr, axis=0)

    score = float(ecg_model.predict(arr)[0][0])
    diagnosis = "Disease" if score > 0.5 else "Normal"

    return {
        "prediction": diagnosis,
        "confidence": round(score * 100, 2),
        "raw_score": score
    }
