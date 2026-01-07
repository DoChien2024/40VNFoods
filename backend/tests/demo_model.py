"""Interactive Demo"""
import os
import sys
import json
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.inception_v3 import preprocess_input

# Add project root to path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, PROJECT_ROOT)

from config import IMAGE_SIZE
MODEL_PATH = os.path.join(PROJECT_ROOT, "Models", "InceptionV3", "fine_tune_model_best.h5")
CLASS_MAPPING_FILE = os.path.join(PROJECT_ROOT, "Models", "InceptionV3", "class_mapping.json")

print("Loading model...")
model = load_model(MODEL_PATH)

with open(CLASS_MAPPING_FILE, 'r', encoding='utf-8') as f:
    class_mapping = json.load(f)
class_names = [class_mapping[str(i)] for i in range(len(class_mapping))]

print(f"✓ Loaded ({len(class_names)} classes)\n")


def predict_image(image_path, top_n=5):
    """Predict image"""
    img = Image.open(image_path).convert('RGB').resize(IMAGE_SIZE)
    img_array = preprocess_input(np.expand_dims(np.array(img), axis=0))
    
    predictions = model.predict(img_array, verbose=0)[0]
    top_indices = np.argsort(predictions)[-top_n:][::-1]
    
    print(f"\n{os.path.basename(image_path)}:")
    for rank, idx in enumerate(top_indices, 1):
        conf = predictions[idx] * 100
        bar = "█" * int(conf / 2)
        print(f"{rank}. {class_names[idx]}")
        print(f"   {bar} {conf:.1f}%")
    
    return class_names[top_indices[0]], predictions[top_indices[0]]


def predict_folder(folder_path):
    """Predict all images in folder"""
    extensions = ('.jpg', '.jpeg', '.png', '.bmp')
    images = [f for f in os.listdir(folder_path) if f.lower().endswith(extensions)]
    
    if not images:
        print("No images found")
        return
    
    results = []
    for img_file in images:
        dish, conf = predict_image(os.path.join(folder_path, img_file), top_n=3)
        results.append({'image': img_file, 'prediction': dish, 'confidence': float(conf)})
    
    # Summary
    avg_conf = np.mean([r['confidence'] for r in results])
    high = sum(1 for r in results if r['confidence'] >= 0.8)
    
    print(f"\n{'='*50}")
    print(f"Total: {len(results)}, High confidence: {high}, Avg: {avg_conf*100:.1f}%")
    
    # Save
    output_file = os.path.join(PROJECT_ROOT, "Models", "InceptionV3", "demo_results.json")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"✓ Saved: {output_file}")


# Menu
while True:
    print("\n" + "="*50)
    print("1. Test image")
    print("2. Test folder")
    print("3. Show classes")
    print("4. Exit")
    
    choice = input("\nChoice (1-4): ").strip()
    
    if choice == '1':
        path = input("Image path: ").strip().strip('"')
        if os.path.exists(path):
            predict_image(path)
        else:
            print("Not found")
    
    elif choice == '2':
        path = input("Folder path: ").strip().strip('"')
        if os.path.exists(path):
            predict_folder(path)
        else:
            print("Not found")
    
    elif choice == '3':
        print("\nClasses:")
        for i, name in enumerate(class_names, 1):
            print(f"{i:2d}. {name}")
    
    elif choice == '4':
        print("\n✓ Bye\n")
        break
