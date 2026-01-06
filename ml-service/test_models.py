import joblib
import os
import numpy as np
import warnings

# Suppress sklearn warnings about versions for now to see output cleanly
warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

heart_path = os.path.join(MODEL_DIR, "heart_model.pkl")
diabetes_path = os.path.join(MODEL_DIR, "diabetes_model_cleaned.pkl")

def test_heart():
    print("\n--- Testing Heart Model ---")
    if not os.path.exists(heart_path):
        print("Heart model not found.")
        return

    try:
        model = joblib.load(heart_path)
        # Sample 1: Healthy-ish (Age 30, ok stats)
        # age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
        input_1 = np.array([[30, 1, 0, 120, 200, 0, 0, 150, 0, 0.0, 2, 0, 2]])
        
        # Sample 2: Unhealthy (Old age, high bp, angina)
        input_2 = np.array([[70, 1, 0, 160, 300, 1, 1, 100, 1, 3.0, 1, 2, 3]])

        pred_1 = model.predict(input_1)[0]
        prob_1 = model.predict_proba(input_1)[0] if hasattr(model, 'predict_proba') else "N/A"
        
        pred_2 = model.predict(input_2)[0]
        prob_2 = model.predict_proba(input_2)[0] if hasattr(model, 'predict_proba') else "N/A"

        print(f"Input 1 (Healthy-ish) -> Pred: {pred_1}, Probs: {prob_1}")
        print(f"Input 2 (Unhealthy)   -> Pred: {pred_2}, Probs: {prob_2}")

        if pred_1 != pred_2:
            print("SUCCESS: Heart model predictions vary.")
        else:
            print("WARNING: Heart model predictions are the same for different inputs.")

    except Exception as e:
        print(f"Error testing heart model: {e}")

def test_diabetes():
    print("\n--- Testing Diabetes Model ---")
    if not os.path.exists(diabetes_path):
        print("Diabetes model not found.")
        return

    try:
        model = joblib.load(diabetes_path)
        # Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DPedigree, Age
        
        # Sample 1: Healthy
        input_1 = np.array([[0, 85, 66, 29, 0, 26.6, 0.351, 31]])
        
        # Sample 2: Diabetic case
        input_2 = np.array([[6, 148, 72, 35, 0, 33.6, 0.627, 50]])

        pred_1 = model.predict(input_1)[0]
        prob_1 = model.predict_proba(input_1)[0] if hasattr(model, 'predict_proba') else "N/A"

        pred_2 = model.predict(input_2)[0]
        prob_2 = model.predict_proba(input_2)[0] if hasattr(model, 'predict_proba') else "N/A"

        print(f"Input 1 (Healthy) -> Pred: {pred_1}, Probs: {prob_1}")
        print(f"Input 2 (Diabetic) -> Pred: {pred_2}, Probs: {prob_2}")

        if pred_1 != pred_2:
            print("SUCCESS: Diabetes model predictions vary.")
        else:
            print("WARNING: Diabetes model predictions are the same for different inputs.")

    except Exception as e:
        print(f"Error testing diabetes model: {e}")

if __name__ == "__main__":
    test_heart()
    test_diabetes()
