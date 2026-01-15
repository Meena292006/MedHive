import sys
import os
# Apply patches before importing app
import numpy as np

# Patch numpy._core
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
except Exception:
    pass

# Now import app (which will apply its own patches and load models)
from app import heart_model, diabetes_model, liver_model

print("\n=== Model Loading Status ===")
print(f"Heart model: {'✅ Loaded' if heart_model is not None else '❌ Failed'}")
print(f"Diabetes model: {'✅ Loaded' if diabetes_model is not None else '❌ Failed'}")
print(f"Liver model: {'✅ Loaded' if liver_model is not None else '❌ Failed'}")
