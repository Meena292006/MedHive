import joblib
import os

# Define model paths
models_dir = os.path.join("ml-service", "models")

heart_path = os.path.join(models_dir, "heart_model.pkl")
diabetes_path = os.path.join(models_dir, "diabetes_model_cleaned.pkl")
liver_path = os.path.join(models_dir, "liver_model.pkl")


def inspect_model(path, name):
    print(f"\n--- Inspecting {name} ---")

    if not os.path.exists(path):
        print(f"File not found: {path}")
        return

    try:
        model = joblib.load(path)

        print(f"Type: {type(model)}")

        if hasattr(model, "get_params"):
            print("Params:")
            for k, v in model.get_params().items():
                print(f"  {k}: {v}")

        if hasattr(model, "n_features_in_"):
            print(f"Features expected: {model.n_features_in_}")

        if hasattr(model, "classes_"):
            print(f"Classes: {model.classes_}")

    except Exception as e:
        print(f"Error loading {name}: {e}")


if __name__ == "__main__":
    inspect_model(heart_path, "Heart Model")
    inspect_model(diabetes_path, "Diabetes Model")
    inspect_model(liver_path, "Liver Model")
