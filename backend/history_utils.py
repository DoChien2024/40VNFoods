"""History management utilities for per-user prediction history"""
import os
import json
import uuid
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

HISTORY_DIR = os.path.join(os.path.dirname(__file__), 'history')

if not os.path.exists(HISTORY_DIR):
    os.makedirs(HISTORY_DIR)

def get_user_history_path(username):
    """Lấy đường dẫn file lịch sử cho một user cụ thể"""
    return os.path.join(HISTORY_DIR, f'{username.lower()}.json')

def save_prediction_history(username, food_name, confidence, image_base64=None):
    """Lưu lịch sử dự đoán cho user"""
    try:
        record = {
            '_id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'food_name': food_name,
            'confidence': confidence,
            'image_base64': image_base64
        }
        
        user_history_path = get_user_history_path(username)
        
        # Đọc dữ liệu hiện có
        data = []
        if os.path.exists(user_history_path):
            try:
                with open(user_history_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
            except (json.JSONDecodeError, IOError) as e:
                logger.warning(f"Failed to read history for {username}: {e}")
                data = []
        
        data.append(record)
        
        # Ghi lại file
        with open(user_history_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"History saved for user: {username}, food: {food_name}")
    except Exception as e:
        logger.error(f"Failed to save history for {username}: {e}")

def get_prediction_history(username, limit=50):
    """Lấy lịch sử dự đoán của một user (mới nhất trước)"""
    user_history_path = get_user_history_path(username)
    
    if not os.path.exists(user_history_path):
        return []
    
    try:
        with open(user_history_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data[-limit:][::-1]
    except (json.JSONDecodeError, IOError) as e:
        logger.error(f"Failed to read history for {username}: {e}")
        return []

def delete_history_item(username, item_id):
    """Xóa một record lịch sử theo ID"""
    user_history_path = get_user_history_path(username)
    
    if not os.path.exists(user_history_path):
        return False
    
    try:
        with open(user_history_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        logger.error(f"Failed to read history for {username}: {e}")
        return False
    
    original_len = len(data)
    data = [item for item in data if item.get('_id') != item_id]
    
    if len(data) == original_len:
        return False
    
    with open(user_history_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    logger.info(f"Deleted history item {item_id} for user: {username}")
    return True

def delete_all_history(username):
    """Xóa toàn bộ lịch sử của một user"""
    user_history_path = get_user_history_path(username)
    
    if os.path.exists(user_history_path):
        try:
            with open(user_history_path, 'w', encoding='utf-8') as f:
                json.dump([], f)
            logger.info(f"Cleared all history for user: {username}")
            return True
        except IOError as e:
            logger.error(f"Failed to clear history for {username}: {e}")
            return False
    return False
