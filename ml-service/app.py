from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from collections import defaultdict
import os

# =====================================================
# APP SETUP
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
# PATH SETUP
# =====================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# =====================================================
# LOAD MODELS
# =====================================================

model_a = joblib.load(os.path.join(MODEL_DIR, "disease_prediction_model.pkl"))
cols_a  = joblib.load(os.path.join(MODEL_DIR, "symptom_columns.pkl"))

model_b = joblib.load(os.path.join(MODEL_DIR, "ieee_symptom_model.pkl"))
cols_b  = joblib.load(os.path.join(MODEL_DIR, "ieee_symptom_columns.pkl"))

models = [
    (model_a, cols_a),
    (model_b, cols_b)
]

# =====================================================
# REQUEST SCHEMA
# =====================================================

class SymptomInput(BaseModel):
    symptoms: list[str]

# =====================================================
# NORMALIZATION (CRITICAL FIX)
# =====================================================

def normalize(text: str) -> str:
    """
    Convert symptoms to model-friendly format
    fever -> fever
    chest pain -> chest_pain
    Shortness Of Breath -> shortness_of_breath
    """
    return text.lower().strip().replace(" ", "_")

def build_vector(symptoms, columns):
    normalized_input = set(normalize(s) for s in symptoms)
    normalized_columns = [normalize(c) for c in columns]

    vector = [
        1 if normalized_columns[i] in normalized_input else 0
        for i in range(len(columns))
    ]

    return np.array(vector).reshape(1, -1), sum(vector)

# =====================================================
# CACHE
# =====================================================

SYMPTOM_CACHE = None

# =====================================================
# ROUTES
# =====================================================

@app.get("/")
def root():
    return {"message": "MedHive AI Service running"}

@app.get("/health")
def health():
    return {
        "status": "OK",
        "models_loaded": len(models)
    }

@app.get("/symptoms")
def get_all_symptoms():
    """
    Returns ALL symptoms used by BOTH models
    """
    global SYMPTOM_CACHE

    if SYMPTOM_CACHE:
        return SYMPTOM_CACHE

    all_symptoms = set()
    for _, cols in models:
        for s in cols:
            all_symptoms.add(str(s))

    SYMPTOM_CACHE = {
        "symptoms": sorted(all_symptoms)
    }
    return SYMPTOM_CACHE

@app.post("/predict")
def predict(data: SymptomInput):
    combined_probs = defaultdict(float)
    total_matches = 0

    for model, cols in models:
        x, matched = build_vector(data.symptoms, cols)
        total_matches += matched

        # If model supports probabilities
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(x)[0]
            classes = model.classes_
        else:
            classes = model.classes_
            probs = np.ones(len(classes)) / len(classes)

        for disease, prob in zip(classes, probs):
            if not isinstance(disease, (str, np.str_)):
                continue
            combined_probs[str(disease)] += float(prob)

    # 🚨 SAFETY CHECK (VERY IMPORTANT)
    if total_matches == 0:
        return {
            "warning": "No selected symptoms matched model features",
            "top_predictions": []
        }

    num_models = len(models)

    results = [
        {
            "disease": disease,
            "probability": round((prob / num_models) * 100, 2)
        }
        for disease, prob in combined_probs.items()
    ]

    results = sorted(
        results,
        key=lambda x: x["probability"],
        reverse=True
    )[:3]

    return {
        "matched_symptoms": total_matches,
        "top_predictions": results
    }
