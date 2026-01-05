import os
import json
from flask_bcrypt import Bcrypt

USERS_PATH = os.path.join(os.path.dirname(__file__), 'users.json')

def load_users():
    if os.path.exists(USERS_PATH):
        with open(USERS_PATH, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except Exception:
                return []
    return []

def save_users(users):
    with open(USERS_PATH, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

def find_user_by_username(username):
    users = load_users()
    for user in users:
        if user['username'] == username:
            return user
    return None

def create_user(username, password):
    bcrypt = Bcrypt()
    users = load_users()
    if any(u['username'] == username for u in users):
        return False, 'Username already exists'
    hashed = bcrypt.generate_password_hash(password).decode('utf-8')
    user = {'username': username, 'password': hashed}
    users.append(user)
    save_users(users)
    return True, 'User created'

def check_user_password(username, password):
    bcrypt = Bcrypt()
    user = find_user_by_username(username)
    if not user:
        return False
    return bcrypt.check_password_hash(user['password'], password)
