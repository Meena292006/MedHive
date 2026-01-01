from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

# =====================================================
# APP SETUP
# =====================================================

app = FastAPI(title="MedHive AI Service (Symptom Model Only)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# PATH SETUP
# =====================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# =====================================================
# LOAD ONLY EXISTING MODEL (NO NEW PKL)
# =====================================================

model = joblib.load(os.path.join(MODEL_DIR, "disease_prediction_model.pkl"))
symptom_columns = joblib.load(os.path.join(MODEL_DIR, "symptom_columns.pkl"))

# =====================================================
# REQUEST SCHEMA
# =====================================================

class SymptomInput(BaseModel):
    symptoms: list[str]

# =====================================================
# NORMALIZATION
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
    return {"message": "MedHive AI Service running (IEEE removed, no new PKL)"}

@app.get("/health")
def health():
    return {
        "status": "OK",
        "model_used": "symptom-based model only"
    }

@app.get("/symptoms")
def get_all_symptoms():
    return {
        "symptoms": sorted(symptom_columns)
    }

@app.post("/predict")
def predict(data: SymptomInput):
    print("DEBUG: Received symptoms:", data.symptoms)

    x, matched = build_vector(data.symptoms)

    if matched == 0:
        return {
            "matched_symptoms": 0,
            "top_predictions": [],
            "priority": "NORMAL"
        }

    # model.classes_ already contains DISEASE NAMES
    probs = model.predict_proba(x)[0]
    classes = model.classes_

    results = [
        {
            "disease": str(disease),
            "probability": round(float(prob) * 100, 2)
        }
        for disease, prob in zip(classes, probs)
    ]

    results = sorted(
        results,
        key=lambda x: x["probability"],
        reverse=True
    )[:3]

    priority = "HIGH" if results[0]["probability"] > 50 else "NORMAL"

    return {
        "matched_symptoms": matched,
        "top_predictions": results,
        "priority": priority
    }
