"""
Flask API Backend for Vietnamese Food Classification
Handles image upload and model prediction
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.inception_v3 import preprocess_input
import os
import sys
from PIL import Image
import jwt
from datetime import datetime, timedelta
import json
from functools import wraps
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config import FOOD_DATABASE, MODEL_PATH, IMAGE_SIZE
from history_utils import save_prediction_history, get_prediction_history, delete_history_item, delete_all_history
from user_utils import create_user, check_user_password, find_user_by_username
import base64
import io

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# JWT Configuration
SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default_secret_key_change_in_production')
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv('REFRESH_TOKEN_EXPIRE_DAYS', 7))

# Load model at startup
model = None
_food_classes_cache = None

# JWT Helper Functions
def create_access_token(username):
    """Create JWT access token"""
    payload = {
        'username': username,
        'type': 'access',
        'exp': datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def create_refresh_token(username):
    """Create JWT refresh token"""
    payload = {
        'username': username,
        'type': 'refresh',
        'exp': datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token, token_type='access'):
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        if payload.get('type') != token_type:
            return None
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# Middleware decorator for protected routes
def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.headers.get('Authorization', None)
        if not auth or not auth.startswith('Bearer '):
            return jsonify({'success': False, 'message': 'Missing or invalid authorization header'}), 401
        
        token = auth.split(' ')[1]
        payload = verify_token(token, 'access')
        
        if not payload:
            return jsonify({'success': False, 'message': 'Invalid or expired token'}), 401
        
        request.current_user = payload['username']
        return f(*args, **kwargs)
    return decorated

# Đăng ký người dùng
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password required'}), 400
    ok, msg = create_user(username, password)
    if ok:
        return jsonify({'success': True, 'message': 'User created successfully'})
    else:
        return jsonify({'success': False, 'message': 'Username already exists'}), 400

# Đăng nhập người dùng
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'success': False, 'message': 'Username and password required'}), 400
    if not check_user_password(username, password):
        return jsonify({'success': False, 'message': 'Invalid username or password'}), 401
    
    # Tạo access và refresh tokens
    access_token = create_access_token(username)
    refresh_token = create_refresh_token(username)
    
    return jsonify({
        'success': True,
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'Bearer',
        'expires_in': ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        'username': username
    })

# API refresh token
@app.route('/api/refresh', methods=['POST'])
def refresh():
    """Refresh access token using refresh token"""
    data = request.get_json()
    refresh_token = data.get('refresh_token')
    
    if not refresh_token:
        return jsonify({'success': False, 'message': 'Refresh token required'}), 400
    
    payload = verify_token(refresh_token, 'refresh')
    if not payload:
        return jsonify({'success': False, 'message': 'Invalid or expired refresh token'}), 401
    
    # Tạo access token mới
    username = payload['username']
    new_access_token = create_access_token(username)
    
    return jsonify({
        'success': True,
        'access_token': new_access_token,
        'token_type': 'Bearer',
        'expires_in': ACCESS_TOKEN_EXPIRE_MINUTES * 60
    })

# API lấy lịch sử dự đoán gần nhất
@app.route('/api/history', methods=['GET'])
@token_required
def get_history():
    try:
        limit = int(request.args.get('limit', 20))
        username = request.current_user
        history = get_prediction_history(username, limit=limit)
        return jsonify({
            'success': True,
            'history': history,
            'username': username
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# API xóa toàn bộ lịch sử dự đoán
@app.route('/api/history', methods=['DELETE'])
@token_required
def delete_history():
    try:
        username = request.current_user
        delete_all_history(username)
        return jsonify({
            'success': True,
            'message': 'History deleted',
            'deleted_by': username
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# API xóa một record lịch sử
@app.route('/api/history/<item_id>', methods=['DELETE'])
@token_required
def delete_history_item_route(item_id):
    try:
        username = request.current_user
        if delete_history_item(username, item_id):
            return jsonify({
                'success': True,
                'message': 'History item deleted',
                'deleted_by': username
            })
        else:
            return jsonify({'success': False, 'message': 'Item not found'}), 404
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

def load_ml_model():
    """Load TensorFlow model"""
    global model
    try:
        # Adjust path to go from backend/ to root directory
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, MODEL_PATH)
        
        if os.path.exists(model_path):
            model = load_model(model_path, compile=False)
            logger.info(f"Model loaded successfully from {model_path}")
        else:
            logger.error(f"Model not found at {model_path}")
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")

# Load model on startup
load_ml_model()


def get_food_classes():
    """Get list of food classes in ORIGINAL order from JSON (cached)"""
    global _food_classes_cache
    if _food_classes_cache is None:
        _food_classes_cache = list(FOOD_DATABASE.keys())
    return _food_classes_cache


def preprocess_image_data(img):
    """Preprocess PIL Image for InceptionV3 prediction"""
    img = img.resize(IMAGE_SIZE)
    img_array = np.array(img, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)  
    return img_array


def get_food_info(food_name, lang='VN'):
    """Get food information in specified language"""
    if food_name not in FOOD_DATABASE:
        return None
    
    food = FOOD_DATABASE[food_name]
    lang_suffix = '' if lang == 'VN' else '_en'
    
    return {
        'name': food_name if lang == 'VN' else food.get('name_en', food_name),
        'region': food['region'],
        'description': food.get(f'description{lang_suffix}', food['description_vn']),
        'ingredients': food.get(f'ingredients{lang_suffix}', food['ingredients_vn']),
        'related': food.get('related', [])
    }


@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict food from uploaded image"""
    try:
        if model is None:
            return jsonify({'success': False, 'error': 'Model not loaded'}), 500
        
        if 'image' not in request.files:
            return jsonify({'success': False, 'error': 'No image provided'}), 400
        
        file = request.files['image']
        lang = request.form.get('lang', 'VN')
        
        img = Image.open(file.stream).convert('RGB')
        img_array = preprocess_image_data(img)
        
        buffered = io.BytesIO()
        img.save(buffered, format="JPEG", quality=85)
        img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        pred_probs = model.predict(img_array, verbose=0)[0]
        
        classes = get_food_classes()
        top_k = 4
        top_indices = np.argpartition(pred_probs, -top_k)[-top_k:]
        top_indices = top_indices[np.argsort(pred_probs[top_indices])][::-1]
        
        food_name = classes[top_indices[0]]
        confidence = float(pred_probs[top_indices[0]] * 100)
        related = [classes[i] for i in top_indices[1:top_k]]
        
        food_info = get_food_info(food_name, lang)
        
        if not food_info:
            return jsonify({'success': False, 'error': 'Food information not found'}), 404

        # Lưu lịch sử nếu user đã đăng nhập
        try:
            auth = request.headers.get('Authorization', None)
            if auth and auth.startswith('Bearer '):
                token = auth.split(' ')[1]
                payload = verify_token(token, 'access')
                if payload:
                    username = payload['username']
                    save_prediction_history(
                        username,
                        food_name, 
                        confidence, 
                        image_base64=img_base64
                    )
        except Exception as e:
            # Không làm gián đoạn prediction nếu lưu lịch sử thất bại
            pass

        return jsonify({
            'success': True,
            'food_name': food_name,
            'confidence': confidence,
            'food_info': food_info,
            'related': related
        })
    
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/foods/search', methods=['GET'])
def search_foods():
    """Search foods with pagination and region filter"""
    try:
        lang = request.args.get('lang', 'VN')
        search = request.args.get('search', '').lower().strip()
        region = request.args.get('region', 'all')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 12))
        
        classes = get_food_classes()
        
        filtered_foods = []
        for food_name in classes:
            info = get_food_info(food_name, lang)
            if not info:
                continue
            
            if region != 'all' and info.get('region') != region:
                continue
            
            if search and search not in food_name.lower() and search not in info.get('description', '').lower():
                continue
            
            filtered_foods.append({'id': food_name, **info})
        
        total = len(filtered_foods)
        total_pages = max(1, (total + per_page - 1) // per_page)
        page = max(1, min(page, total_pages))
        
        start = (page - 1) * per_page
        end = start + per_page
        foods = filtered_foods[start:end]
        
        return jsonify({
            'success': True,
            'foods': foods,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': total,
                'total_pages': total_pages,
                'has_next': page < total_pages,
                'has_prev': page > 1
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/food/<food_name>', methods=['GET'])
def get_food_detail(food_name):
    """Get detailed info for specific food"""
    try:
        lang = request.args.get('lang', 'VN')
        info = get_food_info(food_name, lang)
        
        if not info:
            return jsonify({'success': False, 'error': 'Food not found'}), 404
        
        return jsonify({
            'success': True,
            'food': info
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    logger.info("="*50)
    logger.info("Starting Flask API Server")
    logger.info(f"API available at http://localhost:5000")
    logger.info(f"Model path: {MODEL_PATH}")
    logger.info("="*50)
    logger.info("Available endpoints:")
    logger.info("  Auth: POST /api/register, /api/login, /api/refresh")
    logger.info("  Food: POST /api/predict, GET /api/food/<name>, /api/foods/search")
    logger.info("  History: GET /api/history, DELETE /api/history[/<id>]")
    logger.info("="*50)
    app.run(debug=True, host='0.0.0.0', port=5000)
