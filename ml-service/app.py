from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
import pandas as pd

# =====================================================
import datetime

# =====================================================
# APP SETUP
# =====================================================

app = FastAPI(title="MedHive AI Service")

# Simple in-memory history (for demo purposes)
HISTORY = []

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... (Previous Path Setup and Load Models code unchanged) ...

# =====================================================
# PATH SETUP
# =====================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# =====================================================
# LOAD MODELS
# =====================================================

# =====================================================
# LOAD MODELS
# =====================================================

symptom_model = None
symptom_columns = []
heart_model = None
diabetes_model = None

try:
    # Existing Symptom Model
    symptom_model = joblib.load(os.path.join(MODEL_DIR, "disease_prediction_model.pkl"))
    symptom_columns = joblib.load(os.path.join(MODEL_DIR, "symptom_columns.pkl"))
    print("DEBUG: Symptom model loaded.")
except Exception as e:
    print(f"WARNING: Symptom model not found or error loading: {e}")

try:
    heart_model = joblib.load(os.path.join(MODEL_DIR, "heart_model.pkl"))
    print("DEBUG: Heart model loaded.")
except Exception as e:
    print(f"WARNING: Heart model not found or error loading: {e}")

try:
    diabetes_model = joblib.load(os.path.join(MODEL_DIR, "diabetes_model_cleaned.pkl"))
    print("DEBUG: Diabetes model loaded.")
except Exception as e:
    print(f"WARNING: Diabetes model not found or error loading: {e}")


# =====================================================
# REQUEST SCHEMAS
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

# =====================================================
# NORMALIZATION FOR SYMPTOMS
# =====================================================

def normalize(text: str) -> str:
    return (
        text.lower()
        .strip()
        .replace(",", "")
        .replace(".", "")
        .replace("-", " ")
        .replace("  ", " ")
        .replace(" ", "_")
    )

def build_vector(symptoms):
    if not symptom_columns:
        return None, 0
        
    normalized_input = set(normalize(s) for s in symptoms)
    normalized_columns = [normalize(c) for c in symptom_columns]

    vector = []
    matched = 0

    for col in normalized_columns:
        if col in normalized_input:
            vector.append(1)
            matched += 1
        else:
            vector.append(0)

    return np.array(vector).reshape(1, -1), matched

# =====================================================
# ROUTES
# =====================================================

@app.get("/")
def root():
    return {"message": "MedHive AI Service Running"}

@app.get("/health")
def health():
    return {
        "status": "OK",
        "models_loaded": {
            "symptom": symptom_model is not None,
            "heart": heart_model is not None,
            "diabetes": diabetes_model is not None
        }
    }

@app.get("/symptoms")
def get_all_symptoms():
    print(f"DEBUG: /symptoms endpoint hit. Columns count: {len(symptom_columns)}")
    if not symptom_columns:
        print("DEBUG: symptom_columns empty, returning fallback.")
        return {
            "symptoms": ["fever", "cough", "headache", "fatigue", "nausea", "debug_fallback_active"]
        }
    return {
        "symptoms": sorted(symptom_columns)
    }

@app.get("/history")
def get_history():
    return HISTORY

# --- Symptom Prediction ---
@app.post("/predict")
def predict_symptoms(data: SymptomInput):
    if not symptom_model:
        raise HTTPException(status_code=503, detail="Symptom model not available")

    x, matched = build_vector(data.symptoms)

    if matched == 0:
        return {"matched_symptoms": 0, "top_predictions": [], "priority": "NORMAL"}

    probs = symptom_model.predict_proba(x)[0]
    classes = symptom_model.classes_

    results = sorted(
        [{"disease":str(c), "probability": round(float(p)*100, 2)} for c, p in zip(classes, probs)],
        key=lambda x: x["probability"],
        reverse=True
    )[:3]

    priority = "HIGH" if results[0]["probability"] > 50 else "NORMAL"
    
    # Save to history
    HISTORY.insert(0, {
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "type": "General Diagnosis",
        "result": results[0]["disease"] if results else "Unknown",
        "probability": f"{results[0]['probability']}%" if results else "0%",
        "status": priority 
    })
    
    return {"matched_symptoms": matched, "top_predictions": results, "priority": priority}

# --- Heart Disease Prediction ---
@app.post("/predict/heart")
def predict_heart(data: HeartInput):
    if not heart_model:
        raise HTTPException(status_code=503, detail="Heart model not available")
    
    features = [[
        data.age, data.sex, data.cp, data.trestbps, data.chol, 
        data.fbs, data.restecg, data.thalach, data.exang, 
        data.oldpeak, data.slope, data.ca, data.thal
    ]]
    
    prediction = heart_model.predict(features)[0]
    try:
        prob = heart_model.predict_proba(features)[0][1] * 100
    except:
        prob = 100 if prediction == 1 else 0

    result_text = "Heart Disease Present" if prediction == 1 else "No Heart Disease"
    is_danger = int(prediction) == 1
    
    # Save to history
    HISTORY.insert(0, {
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "type": "Heart Disease",
        "result": result_text,
        "probability": f"{round(prob, 2)}%",
        "status": "High" if is_danger else "Normal"
    })
    
    return {
        "prediction": result_text,
        "probability": round(prob, 2),
        "is_danger": is_danger
    }

# --- Diabetes Prediction ---
@app.post("/predict/diabetes")
def predict_diabetes(data: DiabetesInput):
    if not diabetes_model:
         raise HTTPException(status_code=503, detail="Diabetes model not available")

    features = [[
        data.Pregnancies, data.Glucose, data.BloodPressure, 
        data.SkinThickness, data.Insulin, data.BMI, 
        data.DiabetesPedigreeFunction, data.Age
    ]]
    
    prediction = diabetes_model.predict(features)[0]
    try:
        prob = diabetes_model.predict_proba(features)[0][1] * 100
    except:
        prob = 100 if prediction == 1 else 0

    result_text = "Diabetes Present" if prediction == 1 else "No Diabetes"
    is_danger = int(prediction) == 1

    # Save to history
    HISTORY.insert(0, {
        "date": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
        "type": "Diabetes",
        "result": result_text,
        "probability": f"{round(prob, 2)}%",
        "status": "High" if is_danger else "Normal"
    })

    return {
        "prediction": result_text,
        "probability": round(prob, 2),
        "is_danger": is_danger
    }
