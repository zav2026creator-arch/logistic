import sqlite3
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import bcrypt
import os

app = FastAPI()

# --- МИДЛВЕР (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ХЕШИРОВАНИЕ ---
def hash_password(password: str) -> bytes:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password_bytes, salt)

def check_password(password: str, hashed: bytes) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

# --- ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ ---
def init_db():
    conn = sqlite3.connect('logistics.db')
    cursor = conn.cursor()
    
    # Таблица пользователей
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password BLOB,
            role TEXT,
            email TEXT,
            phone TEXT,
            org_name TEXT,
            reg_address TEXT,
            reg_code TEXT
        )
    ''')
    
    # Таблица заказов (ОБНОВЛЕННАЯ: добавил created_at, vehicle_type)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cargo TEXT,
            weight REAL,
            volume REAL,
            distance REAL,
            location_from TEXT,
            location_to TEXT,
            lat REAL, lng REAL,
            lat2 REAL, lng2 REAL,
            description TEXT,
            vehicle_type TEXT,
            status TEXT,
            client_username TEXT,
            carrier_username TEXT,
            price INTEGER DEFAULT 5000,
            created_at TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- ЭНДПОИНТЫ АВТОРИЗАЦИИ ---
@app.post("/api/register")
async def register(data: dict):
    conn = sqlite3.connect('logistics.db')
    cursor = conn.cursor()
    try:
        cursor.execute('''
            INSERT INTO users (username, password, role, email, phone, org_name, reg_address, reg_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (data['username'], hash_password(data['password']), data['role'], data['email'], 
              data['phone'], data['org_name'], data['reg_address'], data['reg_code']))
        conn.commit()
        return {"status": "success"}
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")
    finally:
        conn.close()

@app.post("/api/login")
async def login(data: dict):
    conn = sqlite3.connect('logistics.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (data['username'],))
    user = cursor.fetchone()
    conn.close()
    
    if user and check_password(data['password'], user['password']):
        user_dict = dict(user)
        del user_dict['password'] # Удаляем хеш пароля из ответа для безопасности
        return user_dict
    
    raise HTTPException(status_code=401, detail="Неверные данные")

# --- ЭНДПОИНТЫ ЗАКАЗОВ ---
@app.get("/api/orders")
async def get_orders(username: str, role: str):
    conn = sqlite3.connect('logistics.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    if role == 'admin':
        cursor.execute("SELECT * FROM orders ORDER BY id DESC")
    elif role == 'client':
        cursor.execute("SELECT * FROM orders WHERE client_username = ? ORDER BY id DESC", (username,))
    else: # carrier
        cursor.execute("SELECT * FROM orders WHERE carrier_username = ? OR status = 'Pending' ORDER BY id DESC", (username,))
    
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/orders") 
async def create_order(order: dict):
    conn = sqlite3.connect('logistics.db')
    cursor = conn.cursor()
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    
    # Обрати внимание: во фронтенде поля называются 'location_from', а не 'from'
    cursor.execute('''
        INSERT INTO orders (
            cargo, weight, volume, distance, location_from, location_to, 
            lat, lng, lat2, lng2, description, vehicle_type, price, 
            status, client_username, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        order['cargo'], order.get('weight', 0), order.get('volume', 0), 
        order.get('distance', 0), order['location_from'], order['location_to'], 
        order['lat'], order['lng'], order['lat2'], order['lng2'], 
        order.get('description', ''), order.get('vehicle_type', ''), 
        order.get('price', 5000), 'Pending', order['username'], now
    ))
    conn.commit()
    conn.close()
    return {"status": "ok", "created_at": now}

@app.patch("/api/orders/{order_id}/status")
async def update_status(order_id: int, data: dict):
    conn = sqlite3.connect('logistics.db')
    cursor = conn.cursor()
    # Если передаем carrier_username, обновляем и его (при принятии заказа)
    if 'carrier_username' in data:
        cursor.execute("UPDATE orders SET status = ?, carrier_username = ? WHERE id = ?", 
                       (data['status'], data['carrier_username'], order_id))
    else:
        cursor.execute("UPDATE orders SET status = ? WHERE id = ?", 
                       (data['status'], order_id))
    conn.commit()
    conn.close()
    return {"status": "updated"}

@app.delete("/api/orders/{order_id}")
async def delete_order(order_id: int):
    conn = sqlite3.connect('logistics.db')
    cursor = conn.cursor()
    cursor.execute("DELETE FROM orders WHERE id = ?", (order_id,))
    conn.commit()
    conn.close()
    return {"status": "deleted"}

# --- АДМИН-ПАНЕЛЬ ---
@app.get("/api/admin/users")
async def get_users():
    conn = sqlite3.connect('logistics.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, role, email, phone, org_name FROM users")
    rows = cursor.fetchall()
    conn.close()
    return [dict(r) for r in rows]

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
