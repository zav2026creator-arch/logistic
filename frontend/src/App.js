import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';

// Импортируем наши новые компоненты
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import AdminPage from './components/AdminPage';
import OrdersPage from './components/OrdersPage';
import OrderModal from './components/OrderModal';
import Sidebar from './components/Sidebar';
import MapController from './components/MapController';
import ProfilePage from './components/ProfilePage';

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
  const { t } = useTranslation();

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
            <div className="flex flex-col md:flex-row h-[calc(100vh-112px)] md:h-[calc(100vh-80px)] overflow-hidden">
              
              {/* САЙДБАР: 
                  На мобилках: h-2/5 (40% экрана), снизу карта.
                  На десктопе: w-80 (фиксированно), h-full. 
              */}
              <div className="w-full md:w-80 h-[65%] md:h-full border-b md:border-r order-2 md:order-1 bg-white">
                <Sidebar 
                  orders={orders} 
                  selectedId={focusedOrder?.id}
                  onOrderClick={(order, showModal) => {
                    setFocusedOrder(order);
                    if (showModal) setSelectedOrder(order);
                  }}
                />
              </div>
              
              {/* КАРТА: 
                  На мобилках: h-[60%] (60% экрана).
                  На десктопе: flex-1 (все остальное место).
              */}
              <div className="flex-1 relative h-[35%] md:h-full order-1 md:order-2">
                <MapContainer center={[40.75, 40.61]} zoom={5} className="h-full w-full">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapController selectedOrder={focusedOrder} />
                  <MapResizer /> 
                  
                  {orders.map(o => (
                    <Marker 
                      key={o.id} 
                      position={[o.lat, o.lng]}
                      eventHandlers={{ click: () => setFocusedOrder(o) }}
                    >
                      <Popup>
                        <div className="p-2 text-center">
                          <p className="font-black uppercase italic text-blue-600 text-[10px]">{o.cargo}</p>
                          <button 
                            onClick={() => setSelectedOrder(o)} 
                            className="mt-2 bg-slate-900 text-white px-3 py-1 rounded-lg text-[9px] uppercase font-black"
                          >
                            {t('details')}
                          </button>
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
          <Route 
            path="/profile" 
            element={user ? (
              <ProfilePage 
                user={user} 
                API_URL={API_URL} 
                onUpdate={(updatedData) => setUser(updatedData)} 
                onLogout={() => setUser(null)}
              />
            ) : <Navigate to="/" />} 
          />
        </Routes>

        {selectedOrder && (
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
