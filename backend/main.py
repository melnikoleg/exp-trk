import datetime
import jwt
import functools
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS


app = Flask(__name__)
CORS(app, supports_credentials=True, origins=['http://localhost:5173', 'http://127.0.0.1:5173'])

SECRET_KEY = "your_secret_key_here"
app.config['SECRET_KEY'] = SECRET_KEY

expenses_db = {}
users_db = {}
next_expense_id = 1
next_user_id = 2

users_db[1] = {
    "id": 1,
    "email": "user@example.com",
    "password": "user@example.com",
    "name": "Demo User"
}

def encode_auth_token(user_id):
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=5),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
    except Exception:
        return None

def decode_auth_token(auth_token):
    try:
        payload = jwt.decode(auth_token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None
    try:
        token = auth_header.split(" ")[1]
        user_id = decode_auth_token(token)
        if user_id and user_id in users_db:
            return users_db[user_id]
    except Exception:
        pass
    return None

def login_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({'message': 'Unauthorized', 'redirect': '/sign-in'}), 401
        return f(user=user, *args, **kwargs)
    return decorated_function

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    for user in users_db.values():
        if user['email'] == email and user['password'] == password:
            token = encode_auth_token(user['id'])
            resp = make_response(jsonify({'access_token': token}))
            resp.set_cookie('refresh_token', token, httponly=True, samesite='Lax', max_age=86400*7)
            return resp
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/auth/token', methods=['POST'])
def refresh_token():
    token = request.cookies.get('refresh_token')
    
    if not token and request.is_json:
        data = request.get_json()
        token = data.get('refresh_token')
    
    if not token and request.headers.get('Authorization'):
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
        except Exception:
            pass
    
    # Decode and validate the token
    user_id = decode_auth_token(token) if token else None
    if user_id and user_id in users_db:
        new_token = encode_auth_token(user_id)
        resp = make_response(jsonify({'access_token': new_token}))
        resp.set_cookie('refresh_token', new_token, httponly=True, samesite='Lax', max_age=86400*7)
        return resp
    return jsonify({'message': 'Invalid or expired token'}), 401

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    resp = make_response(jsonify({'message': 'Logged out'}))
    resp.set_cookie('refresh_token', '', expires=0)
    return resp

@app.route('/api/users/me', methods=['GET'])
@login_required
def get_user_profile(user):
    return jsonify({k: v for k, v in user.items() if k != 'password'})

@app.route('/api/expenses', methods=['POST'])
@login_required
def create_expense(user):
    global next_expense_id
    data = request.get_json()
    expense = {
        'id': next_expense_id,
        'user_id': user['id'],
        'amount': data.get('amount'),
        'category': data.get('category'),
        'date': data.get('date'),
        'description': data.get('description', ''),
        'name': data.get('name', ''),
        'currency': data.get('currency', 'BTC'),
    }
    expenses_db[next_expense_id] = expense
    next_expense_id += 1
    return jsonify(expense['id'])

@app.route('/api/expenses', methods=['GET'])
@login_required
def fetch_expenses(user):
    from_date = request.args.get('fromDate')
    to_date = request.args.get('toDate')
    limit = int(request.args.get('limit', 10))
    offset = int(request.args.get('offset', 0))
    user_expenses = [e for e in expenses_db.values() if e['user_id'] == user['id']]
    if from_date:
        user_expenses = [e for e in user_expenses if e['date'] >= from_date]
    if to_date:
        user_expenses = [e for e in user_expenses if e['date'] <= to_date]
    user_expenses = sorted(user_expenses, key=lambda x: x['date'], reverse=True)
    return jsonify(user_expenses[offset:offset+limit])

@app.route('/api/expenses/<int:expense_id>', methods=['GET'])
@login_required
def fetch_expense(expense_id, user):
    expense = expenses_db.get(expense_id)
    if not expense or expense['user_id'] != user['id']:
        return jsonify({'message': 'Not found'}), 404
    return jsonify(expense)

@app.route('/api/expenses/<int:expense_id>', methods=['PATCH'])
@login_required
def update_expense(expense_id, user):
    expense = expenses_db.get(expense_id)
    if not expense or expense['user_id'] != user['id']:
        return jsonify({'message': 'Not found'}), 404
    data = request.get_json()
    for key in ['amount', 'category', 'date', 'description']:
        if key in data:
            expense[key] = data[key]
    return jsonify(expense)

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
@login_required
def delete_expense(expense_id, user):
    expense = expenses_db.get(expense_id)
    if not expense or expense['user_id'] != user['id']:
        return jsonify({'message': 'Not found'}), 404
    del expenses_db[expense_id]
    return jsonify({'message': 'Deleted'})

@app.route('/api/auth/sign-up', methods=['POST'])
def sign_up():
    global next_user_id
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    if not email or not password or not name:
        return jsonify({'message': 'Missing fields'}), 400
    if any(u['email'] == email for u in users_db.values()):
        return jsonify({'message': 'Email already exists'}), 400
    user = {
        'id': next_user_id,
        'email': email,
        'password': password,
        'name': name
    }
    users_db[next_user_id] = user
    next_user_id += 1
    return jsonify({'message': 'User created'})

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    user = next((u for u in users_db.values() if u['email'] == email), None)
    if not user:
        return jsonify({'message': 'Email not found'}), 404
    return jsonify({'message': 'Reset code sent'})

@app.route('/api/auth/restore-password', methods=['POST'])
def restore_password():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = next((u for u in users_db.values() if u['email'] == email), None)
    if not user:
        return jsonify({'message': 'Email not found'}), 404
    user['password'] = password
    return jsonify({'message': 'Password reset successful'})

@app.route('/api/expenses/analyze-invoice', methods=['POST'])
@login_required
def analyze_invoice(user):
    if 'file' not in request.files:
        return jsonify({'message': 'No file provided'}), 400
    
    file = request.files['file']
    filename = file.filename if file.filename else "Unknown"

    try:
        import random
        
        categories = [  "other_payments",
  "hobby",
  "subscriptions",
  "transport",
  "restaurants",
  "utility",
  "online_shopping",
  "debts",]
        currencies = ['USD', 'EUR', 'PLN', 'BTC']
        
        name = "Invoice: " + filename if filename != "Unknown" else "Invoice"
        
        result = {
            'name': name,
            'amount': random.randint(50, 500),
            'currency': random.choice(currencies),
            'date': str(datetime.date.today()),
            'category': random.choice(categories),
            'description': f"Extracted from invoice: {filename}"
        }
        return jsonify(result)
    except Exception as e:
        print(f"Error processing invoice: {str(e)}")
        return jsonify({'message': 'Could not parse invoice.'}), 400

def add_sample_data():
    global next_expense_id
    today = datetime.date.today()
    expenses = [
        {'amount': 20,'name':'Lunch', 'category': 'other_payments', 'date': str(today), 'description': 'Lunch', 'user_id': 1, 'currency': 'USD'},
        {'amount': 50, 'name':'Taxi', 'category': 'other_payments', 'date': str(today - datetime.timedelta(days=1)), 'description': 'Taxi', 'user_id': 1, 'currency': 'USD'},
    ]
    
    for e in expenses:
        e['id'] = next_expense_id
        expenses_db[next_expense_id] = e
        next_expense_id += 1

add_sample_data()

if __name__ == '__main__':
    import os
    port = int(os.environ.get('FLASK_PORT', 8079))
    app.run(host="0.0.0.0", port=port, debug=True)