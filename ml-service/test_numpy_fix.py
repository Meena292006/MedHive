import os
import sys
import numpy as np

# Apply compatibility patches BEFORE importing joblib
# Patch 1: Handle numpy._core references (NumPy 2.x compatibility)
try:
    if not hasattr(np, '_core'):
        import numpy.core as np_core
        class FakeCore:
            def __getattr__(self, name):
                return getattr(np_core, name)
        np._core = FakeCore()
        sys.modules['numpy._core'] = np._core
        try:
            import numpy.core.numeric as numeric_module
            np._core.numeric = numeric_module
            sys.modules['numpy._core.numeric'] = numeric_module
        except ImportError:
            pass
except Exception as e:
    print(f"Core patch warning: {e}")

# Patch 2: Handle NumPy random BitGenerator compatibility
try:
    import numpy.random._pickle as nrp
    if hasattr(nrp, '__bit_generator_ctor'):
        original_ctor = nrp.__bit_generator_ctor
        def patched_ctor(bit_generator_name, *args, **kwargs):
            try:
                return original_ctor(bit_generator_name, *args, **kwargs)
            except ValueError as e:
                if 'BitGenerator' in str(e) or 'MT19937' in str(e):
                    from numpy.random import MT19937
                    if 'MT19937' in str(bit_generator_name) or 'mt19937' in str(bit_generator_name):
                        return MT19937(*args, **kwargs)
                raise e
        nrp.__bit_generator_ctor = patched_ctor
    
    if hasattr(nrp, '_BIT_GENERATOR_MAP'):
        from numpy.random import MT19937
        nrp._BIT_GENERATOR_MAP['MT19937'] = MT19937
        nrp._BIT_GENERATOR_MAP['numpy.random._mt19937.MT19937'] = MT19937
        nrp._BIT_GENERATOR_MAP['<class \'numpy.random._mt19937.MT19937\'>'] = MT19937
except Exception as e:
    print(f"Random patch warning: {e}")

import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# Test diabetes model
diabetes_path = os.path.join(MODEL_DIR, "diabetes_model_cleaned.pkl")
print(f"\nTesting diabetes model: {diabetes_path}")
try:
    model = joblib.load(diabetes_path)
    print("✅ Diabetes model loaded successfully!")
    # Test prediction
    test_input = np.array([[6, 148, 72, 35, 0, 33.6, 0.627, 50]])
    pred = model.predict(test_input)[0]
    prob = model.predict_proba(test_input)[0]
    print(f"Test prediction: {pred}, Probabilities: {prob}")
except Exception as e:
    print(f"❌ Failed: {e}")
    import traceback
    traceback.print_exc()

# Test liver model
liver_path = os.path.join(MODEL_DIR, "liver_model.pkl")
print(f"\nTesting liver model: {liver_path}")
try:
    model = joblib.load(liver_path)
    print("✅ Liver model loaded successfully!")
    # Test prediction
    test_input = np.array([[52, 1, 2.4, 1.1, 230, 72, 68, 6.1, 3.0, 0.8]])
    pred = model.predict(test_input)[0]
    prob = model.predict_proba(test_input)[0]
    print(f"Test prediction: {pred}, Probabilities: {prob}")
except Exception as e:
    print(f"❌ Failed: {e}")
    import traceback
    traceback.print_exc()
