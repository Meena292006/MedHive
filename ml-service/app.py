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

# =====================================================
# LOAD LABEL ENCODER (NEW)
# =====================================================

LABEL_ENCODER = None
try:
    LABEL_ENCODER = joblib.load(os.path.join(MODEL_DIR, "label_encoder.pkl"))
    print("DEBUG: Label encoder loaded successfully")
except:
    print("DEBUG: No label encoder found - using fallback")

def get_disease_label(class_val):
    """
    Returns human-readable disease name.
    """
    if isinstance(class_val, (str, np.str_)):
        return class_val.title()
    
    # If integer, try mapping
    if LABEL_ENCODER:
        try:
            return LABEL_ENCODER.inverse_transform([int(class_val)])[0]
        except:
            pass
            
    return f"Unknown Disease (Class {class_val})"

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
        "models_loaded": len(models),
        "label_encoder": LABEL_ENCODER is not None
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
    print(f"DEBUG: Received symptoms: {data.symptoms}")
    combined_probs = defaultdict(float)
    total_matches = 0
    active_models_count = 0

    for model, cols in models:
        x, matched = build_vector(data.symptoms, cols)
        
        # 🚨 DYNAMIC FILTER: Skip models that don't match any symptoms
        if matched == 0:
            continue
            
        total_matches += matched
        active_models_count += 1

        # If model supports probabilities
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(x)[0]
            classes = model.classes_
        else:
            classes = model.classes_
            probs = np.ones(len(classes)) / len(classes)

        for disease, prob in zip(classes, probs):
            # Resolve label (handle ints/strings)
            disease_name = get_disease_label(disease)
            combined_probs[disease_name] += float(prob)

    # 🚨 NO MATCHES FOUND
    if total_matches == 0:
        return {
            "warning": "No selected symptoms matched model features",
            "top_predictions": [],
            "priority": "NORMAL"
        }

    # Normalize by active models (not total models) to avoid dilution
    normalization_factor = max(1, active_models_count)

    results = [
        {
            "disease": disease,
            "probability": round((prob / normalization_factor) * 100, 2)
        }
        for disease, prob in combined_probs.items()
    ]

    results = sorted(
        results,
        key=lambda x: x["probability"],
        reverse=True
    )[:3]
    
    # CALCULATE PRIORITY
    top_prob = results[0]["probability"] if results else 0
    priority = "HIGH" if top_prob > 50.0 else "NORMAL"

    return {
        "matched_symptoms": total_matches,
        "top_predictions": results,
        "priority": priority
    }
