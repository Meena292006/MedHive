import tensorflow as tf
import numpy as np
from PIL import Image
import os

print("Current working directory:", os.getcwd())

MODEL_DIR = "models"  # ← relative to where you run the script
MODEL_FILENAME = "ecg_heart_model_final.keras"  # ← change this if name is different!

full_path = os.path.join(MODEL_DIR, MODEL_FILENAME)

print("Looking for model at:", os.path.abspath(full_path))
print("File exists?", os.path.isfile(full_path))

if not os.path.isdir(MODEL_DIR):
    print(f"ERROR: Folder '{MODEL_DIR}' does not exist!")
    exit(1)

if not os.path.isfile(full_path):
    print("Available files in 'models' folder:")
    print(os.listdir(MODEL_DIR))
    print("\nPlease fix the MODEL_FILENAME above to match one of these files.")
    exit(1)

print("\nTrying to load model...")
try:
    model = tf.keras.models.load_model(full_path, compile=False)
    print("→ Model loaded SUCCESSFULLY!")
except Exception as e:
    print("Loading FAILED!")
    print("Error type:", type(e).__name__)
    print("Error message:", str(e))