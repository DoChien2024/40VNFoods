"""
Configuration file for Vietnamese Food Recognition System
Using InceptionV3 Model
"""
import json
import os
from functools import lru_cache

# Model Configuration
MODEL_PATH = "Models/InceptionV3/fine_tune_model_best.h5" 
IMAGE_SIZE = (299, 299)  # Must match InceptionV3 training size!
NUM_CLASSES = 40 
BATCH_SIZE = 32 

FOOD_DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'backend', 'food_database.json')

# Load FOOD_DATABASE from JSON (cached for performance)
@lru_cache(maxsize=1)
def _load_food_database():
    """Load food database with caching"""
    with open(FOOD_DATABASE_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

FOOD_DATABASE = _load_food_database()
