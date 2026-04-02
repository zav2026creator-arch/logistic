import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet';

// Импортируем наши новые компоненты
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import AdminPage from './components/AdminPage';
import OrdersPage from './components/OrdersPage';
import OrderModal from './components/OrderModal';
import Sidebar from './components/Sidebar';
import MapController from './components/MapController';

const API_URL = 'https://logistic-f86s.onrender.com/api';

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => { map.invalidateSize(); }, 300);
  }, [map]);
  return null;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [focusedOrder, setFocusedOrder] = useState(null); // Для MapController
  const [selectedOrder, setSelectedOrder] = useState(null); // Для модального окна

  const fetchOrders = async () => {
    if (!user) return;
    const res = await fetch(`${API_URL}/orders?username=${user.username}&role=${user.role}`);
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => { fetchOrders(); }, [user]);

  const handleStatusUpdate = async (id, status) => {
    await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, carrier_username: user.username })
    });
    setSelected(null);
    fetchOrders();
  };

  if (!user) return <AuthPage onLogin={setUser} API_URL={API_URL} />;

  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar user={user} onLogout={() => setUser(null)} />

        <Routes>
          <Route path="/" element={
            <div className="flex h-[calc(100vh-96px)] overflow-hidden">
              {/* Добавляем сайдбар */}
              <Sidebar 
                orders={orders} 
                selectedId={focusedOrder?.id}
                onOrderClick={(order, showModal) => {
                  setFocusedOrder(order);
                  if (showModal) {
                    setSelectedOrder(order);
                  }
                }}
              />
              
              {/* Контейнер карты теперь занимает оставшееся место */}
              <div className="flex-1 relative">
                <MapContainer center={[44.0, 30.0]} zoom={5} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapController selectedOrder={focusedOrder} />
                  <MapResizer /> 
                  {orders.map(o => (
                    <Marker key={o.id} position={[o.lat, o.lng]} eventHandlers={{
        click: () => setSelected(o), // Чтобы при клике на маркер тоже срабатывал фокус
      }}>
                      <Popup>
                        <div className="p-2 text-center">
                          <p className="font-black uppercase italic text-blue-600">{o.cargo}</p>
                          <button onClick={() => setSelected(o)} className="mt-2 bg-slate-900 text-white px-4 py-1 rounded-lg text-[10px] uppercase font-black">Детали</button>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          } />
          <Route path="/orders" element={<OrdersPage user={user} orders={orders} onRefresh={fetchOrders} setSelected={setSelectedOrder} API_URL={API_URL} />} />
          <Route path="/admin" element={user.role === 'admin' ? <AdminPage API_URL={API_URL} /> : <Navigate to="/" />} />
        </Routes>

        {selected && (
          <OrderModal 
            selected={selectedOrder} 
            user={user} 
            onClose={() => setSelectedOrder(null)} // Проверьте эту строку
            onStatusUpdate={handleStatusUpdate} 
          />
        )}
      </div>
    </Router>
  );
}
