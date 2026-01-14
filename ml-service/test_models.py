import joblib
import os
import numpy as np
import warnings

warnings.filterwarnings("ignore")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

heart_path = os.path.join(MODEL_DIR, "heart_model.pkl")
diabetes_path = os.path.join(MODEL_DIR, "diabetes_model_cleaned.pkl")
liver_path = os.path.join(MODEL_DIR, "liver_model.pkl")


def test_heart():
    print("\n--- Testing Heart Model ---")
    if not os.path.exists(heart_path):
        print("Heart model not found.")
        return

    model = joblib.load(heart_path)

    input_1 = np.array([[30, 1, 0, 120, 200, 0, 0, 150, 0, 0.0, 2, 0, 2]])
    input_2 = np.array([[70, 1, 0, 160, 300, 1, 1, 100, 1, 3.0, 1, 2, 3]])

    pred_1 = model.predict(input_1)[0]
    pred_2 = model.predict(input_2)[0]

    print(f"Healthy-ish → Pred: {pred_1}, Probs: {model.predict_proba(input_1)[0]}")
    print(f"Unhealthy   → Pred: {pred_2}, Probs: {model.predict_proba(input_2)[0]}")

    print("SUCCESS" if pred_1 != pred_2 else "WARNING")


def test_diabetes():
    print("\n--- Testing Diabetes Model ---")
    if not os.path.exists(diabetes_path):
        print("Diabetes model not found.")
        return

    model = joblib.load(diabetes_path)

    input_1 = np.array([[0, 85, 66, 29, 0, 26.6, 0.351, 31]])
    input_2 = np.array([[6, 148, 72, 35, 0, 33.6, 0.627, 50]])

    pred_1 = model.predict(input_1)[0]
    pred_2 = model.predict(input_2)[0]

    print(f"Healthy  → Pred: {pred_1}, Probs: {model.predict_proba(input_1)[0]}")
    print(f"Diabetic → Pred: {pred_2}, Probs: {model.predict_proba(input_2)[0]}")

    print("SUCCESS" if pred_1 != pred_2 else "WARNING")


def test_liver():
    print("\n--- Testing Liver Model ---")
    if not os.path.exists(liver_path):
        print("Liver model not found.")
        return

    model = joblib.load(liver_path)

    # age, gender, total_bilirubin, direct_bilirubin,
    # alkaline_phosphotase, alt, ast, total_proteins, albumin, ag_ratio

    # Healthy
    input_1 = np.array([[28, 0, 0.7, 0.2, 95, 22, 20, 7.4, 4.4, 1.6]])

    # Diseased
    input_2 = np.array([[52, 1, 2.4, 1.1, 230, 72, 68, 6.1, 3.0, 0.8]])

    pred_1 = model.predict(input_1)[0]
    pred_2 = model.predict(input_2)[0]

    print(f"Healthy → Pred: {pred_1}, Probs: {model.predict_proba(input_1)[0]}")
    print(f"Disease → Pred: {pred_2}, Probs: {model.predict_proba(input_2)[0]}")

    print("SUCCESS" if pred_1 != pred_2 else "WARNING")


if __name__ == "__main__":
    test_heart()
    test_diabetes()
    test_liver()
