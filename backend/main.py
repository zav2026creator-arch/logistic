from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import bcrypt

def hash_password(password: str) -> bytes:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed

def check_password(password: str, hashed: bytes) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ ---
def init_db():
    conn = sqlite3.connect('logistics.db')
    cursor = conn.cursor()
    
    # Таблица пользователей (с расширенными полями)
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
    
    # Таблица заказов (с двумя точками координат и привязкой к юзеру)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cargo TEXT,
            location_from TEXT,
            location_to TEXT,
            lat REAL, lng REAL,
            lat2 REAL, lng2 REAL,
            status TEXT,
            client_username TEXT,
            carrier_username TEXT,
            price INTEGER DEFAULT 5000
        )
    ''')
    conn.commit()
    conn.close()

init_db()

# --- ЭНДПОИНТЫ АВТОРИЗАЦИИ ---
@app.post("/api/register")
async def register(data: dict):
    print(data)
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
    name = data['username']
    cursor.execute("SELECT * FROM users WHERE username = ?", (name,))
    user = cursor.fetchone()
    conn.close()
    if user:
        return dict(user)
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
    cursor.execute('''
        INSERT INTO orders (cargo, location_from, location_to, lat, lng, lat2, lng2, status, client_username)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (order['cargo'], order['from'], order['to'], order['lat'], order['lng'], 
          order['lat2'], order['lng2'], 'Pending', order['username']))
    conn.commit()
    conn.close()
    return {"status": "ok"}

@app.patch("/api/orders/{order_id}/status")
async def update_status(order_id: int, data: dict):
    conn = sqlite3.connect('logistics.db')
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = ?, carrier_username = ? WHERE id = ?", 
                   (data['status'], data.get('carrier_username'), order_id))
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
    cursor.execute("SELECT * FROM users")
    rows = cursor.fetchall()
    res = [dict(r) for r in rows]
    conn.close()
    return res

@app.get("/api/admin/stats")
async def get_stats():
    conn = sqlite3.connect('logistics.db')
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM orders")
    total = cursor.fetchone()[0]
    cursor.execute("SELECT SUM(price) FROM orders WHERE status = 'Delivered'")
    rev = cursor.fetchone()[0] or 0
    cursor.execute("SELECT COUNT(*) FROM users")
    usrs = cursor.fetchone()[0]
    conn.close()
    return {"total_orders": total, "revenue": rev, "total_users": usrs}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)