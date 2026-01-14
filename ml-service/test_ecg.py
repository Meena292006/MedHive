import os
from tensorflow.keras.models import load_model

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
ecg_model_path = os.path.join(MODEL_DIR, "ecg_heart_model_final.keras")

print(f"Model path: {ecg_model_path}")
print(f"File exists: {os.path.exists(ecg_model_path)}")
print(f"File size: {os.path.getsize(ecg_model_path) if os.path.exists(ecg_model_path) else 'N/A'}")

try:
    print("\nAttempting to load model...")
    ecg_model = load_model(ecg_model_path, compile=False)
    print("✓ ECG model loaded successfully!")
    print(f"Model type: {type(ecg_model)}")
    print(f"Model summary:")
    ecg_model.summary()
except Exception as e:
    print(f"✗ ECG model load failed!")
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {e}")
    import traceback
    traceback.print_exc()
