import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Truck, Plus, X, Loader2, Trash2, CheckCircle, BarChart3, Map as MapIcon, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const API_URL = 'https://logistic-f86s.onrender.com/api';

// Фикс иконок Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- СТРАНИЦА АВТОРИЗАЦИИ И РЕГИСТРАЦИИ ---
const AuthPage = ({ onLogin }) => {
  const [isReg, setIsReg] = useState(false);
  const [form, setForm] = useState({ 
    username: '', password: '', role: 'client', email: '', 
    phone: '', org_name: '', reg_address: '', reg_code: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const path = isReg ? '/register' : '/login';
    const res = await fetch(API_URL + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      if (isReg) { alert("Успешно! Теперь войдите."); setIsReg(false); }
      else onLogin(data);
    } else alert(data.detail || "Ошибка");
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-[50px] w-full max-w-2xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0 opacity-50"></div>
        <h2 className="text-4xl font-black mb-8 italic uppercase tracking-tighter">{isReg ? 'Регистрация' : 'Вход'}</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <input required className="p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-blue-500" placeholder="Логин" onChange={e => setForm({...form, username: e.target.value})} />
          <input required className="p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-blue-500" type="password" placeholder="Пароль" onChange={e => setForm({...form, password: e.target.value})} />
          
          {isReg && (
            <>
              <select className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-500" onChange={e => setForm({...form, role: e.target.value})}>
                <option value="client">Я Клиент (Грузоотправитель)</option>
                <option value="carrier">Я Перевозчик</option>
              </select>
              <input className="p-4 bg-slate-50 rounded-2xl border-none" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
              <input className="p-4 bg-slate-50 rounded-2xl border-none" placeholder="Телефон" onChange={e => setForm({...form, phone: e.target.value})} />
              <input className="p-4 bg-slate-50 rounded-2xl border-none" placeholder="Название организации" onChange={e => setForm({...form, org_name: e.target.value})} />
              <input className="col-span-1 md:col-span-2 p-4 bg-slate-50 rounded-2xl border-none" placeholder="Юридический адрес" onChange={e => setForm({...form, reg_address: e.target.value})} />
              <input className="p-4 bg-slate-50 rounded-2xl border-none" placeholder="ИНН / Код" onChange={e => setForm({...form, reg_code: e.target.value})} />
            </>
          )}
          
          <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 mt-4">
            {isReg ? 'Создать аккаунт' : 'Войти в систему'}
          </button>
        </form>
        <button onClick={() => setIsReg(!isReg)} className="w-full mt-8 text-slate-400 font-bold hover:text-blue-600 transition-colors">
          {isReg ? 'Уже есть аккаунт? Войти' : 'Создать новый аккаунт'}
        </button>
      </div>
    </div>
  );
};

// --- СТРАНИЦА АДМИНА ---
const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total_orders: 0, revenue: 0, total_users: 0 });

  useEffect(() => {
    fetch(`${API_URL}/admin/users`).then(r => r.json()).then(setUsers);
    fetch(`${API_URL}/admin/stats`).then(r => r.json()).then(setStats);
  }, []);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Обороты</p>
          <p className="text-4xl font-black text-blue-600 italic">{stats.revenue} ₽</p>
        </div>
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Всего заказов</p>
          <p className="text-4xl font-black">{stats.total_orders}</p>
        </div>
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Пользователи</p>
          <p className="text-4xl font-black">{stats.total_users}</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border overflow-hidden shadow-sm">
        <h3 className="p-8 font-black text-xl uppercase italic border-b bg-slate-50">Управление пользователями</h3>
        <table className="w-full text-left">
          <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50">
            <tr>
              <th className="p-6">Имя / Организация</th>
              <th className="p-6">Роль</th>
              <th className="p-6">Контакты</th>
              <th className="p-6">Код регистрации</th>
            </tr>
          </thead>
          <tbody className="divide-y font-medium text-sm">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                <td className="p-6"><span className="font-black text-slate-800">{u.username}</span><br/>{u.org_name}</td>
                <td className="p-6 uppercase text-[10px] font-black"><span className={u.role === 'carrier' ? 'text-orange-500' : 'text-blue-500'}>{u.role}</span></td>
                <td className="p-6">{u.email}<br/>{u.phone}</td>
                <td className="p-6 font-mono text-slate-400">{u.reg_code}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- ОСНОВНОЙ КОМПОНЕНТ ---
export default function App() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    const res = await fetch(`${API_URL}/orders?username=${user.username}&role=${user.role}`);
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [user]);

  const onUpdateStatus = async (id, status) => {
    await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, carrier_username: user.username })
    });
    fetchOrders();
  };

  const onAddOrder = async (order) => {
    await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...order, username: user.username })
    });
    fetchOrders();
  };

  if (!user) return <AuthPage onLogin={setUser} />;

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <nav className="h-24 bg-white border-b px-12 flex items-center justify-between sticky top-0 z-[2000] shadow-sm">
          <div className="flex items-center gap-12">
            <h1 className="font-black text-3xl text-blue-600 italic tracking-tighter">ZAV-Logistic</h1>
            <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <Link to="/" className="hover:text-blue-600 flex items-center gap-2"><MapIcon size={14}/> Карта</Link>
              <Link to="/orders" className="hover:text-blue-600 flex items-center gap-2"><Truck size={14}/> Заказы</Link>
              {user.role === 'admin' && <Link to="/admin" className="text-slate-900 border-b-2 border-blue-600"><ShieldCheck size={14}/> Админ</Link>}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-300 uppercase leading-none mb-1">{user.role}</p>
              <p className="font-black text-slate-800 uppercase italic tracking-tighter">{user.username}</p>
            </div>
            <button onClick={() => setUser(null)} className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><LogOut size={20}/></button>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="h-[calc(100vh-96px)]">
              <MapContainer center={[40.75, 20.61]} zoom={5} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {orders.map(o => (
                  <Marker key={o.id} position={[o.lat, o.lng]}>
                    <Popup>
                      <div className="p-2">
                        <p className="font-black text-blue-600 uppercase italic">{o.cargo}</p>
                        <p className="text-[10px] font-bold text-slate-400 mb-2">{o.location_from} → {o.location_to}</p>
                        <button onClick={() => setSelected(o)} className="w-full bg-slate-900 text-white py-2 rounded-lg text-[10px] font-black uppercase">Детали</button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          } />
          
          <Route path="/orders" element={<OrdersPage user={user} orders={orders} onAdd={onAddOrder} onStatus={onUpdateStatus} loading={loading} setSelected={setSelected} />} />
          <Route path="/admin" element={user.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
        </Routes>

        {/* МОДАЛКА ДЕТАЛЕЙ С ЛИНИЕЙ МАРШРУТА */}
        {selected && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[4000] p-4">
            <div className="bg-white rounded-[40px] max-w-5xl w-full shadow-2xl flex flex-col md:flex-row overflow-hidden">
              <div className="p-12 md:w-1/2 flex flex-col justify-between">
                <div>
                  <h3 className="text-3xl font-black italic uppercase mb-2 italic tracking-tighter">Заказ #{selected.id}</h3>
                  <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mb-10 underline decoration-2">{selected.status}</p>
                  <div className="space-y-6">
                    <div><p className="text-[10px] uppercase font-black text-slate-300">Груз</p><p className="text-xl font-bold">{selected.cargo}</p></div>
                    <div><p className="text-[10px] uppercase font-black text-slate-300">Маршрут</p><p className="font-bold">{selected.location_from} — {selected.location_to}</p></div>
                  </div>
                </div>
                <div className="mt-12 flex flex-col gap-3">
                  {user.role === 'carrier' && selected.status === 'Pending' && (
                    <button onClick={() => { onUpdateStatus(selected.id, 'In Progress'); setSelected(null); }} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase shadow-xl shadow-blue-100">Принять заказ</button>
                  )}
                  {selected.status === 'In Progress' && (
                    <button onClick={() => { onUpdateStatus(selected.id, 'Delivered'); setSelected(null); }} className="w-full bg-green-500 text-white py-5 rounded-3xl font-black uppercase shadow-xl shadow-green-100">Доставлено</button>
                  )}
                  <button onClick={() => setSelected(null)} className="w-full bg-slate-100 text-slate-400 py-5 rounded-3xl font-black uppercase hover:bg-slate-200 transition-colors">Закрыть</button>
                </div>
              </div>
              <div className="h-[400px] md:h-auto md:w-1/2 bg-slate-100 border-l">
                <MapContainer center={[selected.lat, selected.lng]} zoom={5} style={{height: '100%'}} zoomControl={false}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[selected.lat, selected.lng]} />
                  <Marker position={[selected.lat2, selected.lng2]} />
                  <Polyline positions={[[selected.lat, selected.lng], [selected.lat2, selected.lng2]]} color="#2563eb" dashArray="10, 15" weight={4} />
                </MapContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

// --- СТРАНИЦА СПИСКА ЗАКАЗОВ ---
const OrdersPage = ({ user, orders, onAdd, onStatus, loading, setSelected }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ cargo: '', from: '', to: '' });
  const [geocoding, setGeocoding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setGeocoding(true);
    const getC = async (q) => {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`);
      const d = await r.json();
      return d[0] ? [d[0].lat, d[0].lon] : [40, 46];
    };
    const [lat, lng] = await getC(form.from);
    const [lat2, lng2] = await getC(form.to);
    await onAdd({ ...form, lat, lng, lat2, lng2 });
    setShowForm(false);
    setGeocoding(false);
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">Список перевозок</h2>
        {user.role === 'client' && (
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-200 flex items-center gap-2 hover:scale-105 transition-all">
            <Plus size={16}/> Новый заказ
          </button>
        )}
      </div>

      <div className="bg-white rounded-[40px] border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase">
            <tr><th className="p-6">Груз</th><th className="p-6">Маршрут</th><th className="p-6">Статус</th></tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(o => (
              <tr key={o.id} onClick={() => setSelected(o)} className="hover:bg-slate-50 cursor-pointer transition-colors font-bold">
                <td className="p-6 uppercase italic text-slate-800">{o.cargo}</td>
                <td className="p-6 text-slate-400 text-sm">{o.location_from} → {o.location_to}</td>
                <td className="p-6 italic uppercase text-[10px] font-black text-blue-600">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[5000] p-4">
          <div className="bg-white p-12 rounded-[50px] w-full max-w-md shadow-2xl relative">
            <h3 className="text-3xl font-black italic uppercase mb-8">Создать заказ</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" placeholder="Что везем?" onChange={e => setForm({...form, cargo: e.target.value})} />
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" placeholder="Откуда (Город)" onChange={e => setForm({...form, from: e.target.value})} />
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" placeholder="Куда (Город)" onChange={e => setForm({...form, to: e.target.value})} />
              <button disabled={geocoding} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase mt-4 disabled:bg-slate-200">
                {geocoding ? 'Ищем города...' : 'Разместить заказ'}
              </button>
            </form>
            <button onClick={() => setShowForm(false)} className="w-full mt-4 font-black uppercase text-[10px] text-slate-300">Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};
