"""Quick Performance Test"""
import os
import sys
import json
import numpy as np
import time
from tensorflow.keras.models import load_model

# Add project root to path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, PROJECT_ROOT)

from config import IMAGE_SIZE
MODEL_PATH = os.path.join(PROJECT_ROOT, "Models", "InceptionV3", "fine_tune_model_best.h5")

print("Loading model...")
model = load_model(MODEL_PATH)
print(f"✓ Loaded ({model.count_params()/1e6:.1f}M params)")

# Single image speed
dummy = np.random.rand(1, IMAGE_SIZE[0], IMAGE_SIZE[1], 3).astype(np.float32)
model.predict(dummy, verbose=0)  # warm up

start = time.time()
model.predict(dummy, verbose=0)
single_time = time.time() - start
print(f"\nSingle image: {single_time*1000:.1f}ms ({1/single_time:.1f} img/s)")

# Batch speed
for batch_size in [4, 8, 16]:
    batch = np.random.rand(batch_size, IMAGE_SIZE[0], IMAGE_SIZE[1], 3).astype(np.float32)
    start = time.time()
    model.predict(batch, verbose=0)
    throughput = batch_size / (time.time() - start)
    print(f"Batch {batch_size}: {throughput:.1f} img/s")

# Confidence check
samples = model.predict(np.random.rand(100, IMAGE_SIZE[0], IMAGE_SIZE[1], 3).astype(np.float32), verbose=0)
confidences = np.max(samples, axis=1)
print(f"\nAvg confidence: {np.mean(confidences)*100:.1f}%")
print(f"High (>80%): {np.sum(confidences > 0.8)}/100")

print("\n✓ Done")
