import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { X, Package, MapPin, Navigation, Truck, CreditCard } from 'lucide-react';

const OrderModal = ({ selected, user, onClose, onStatusUpdate }) => {
  // Защита от ошибки "cannot read property of null"
  if (!selected) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[4000] p-4">
      <div className="bg-white rounded-[50px] max-w-6xl w-full shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-300">
        
        {/* ЛЕВАЯ ЧАСТЬ: ИНФОРМАЦИЯ */}
        <div className="p-10 md:w-1/2 flex flex-col justify-between bg-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 transition-colors"
          >
            <X size={24} />
          </button>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Заказ #{selected.id}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                selected.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
              }`}>
                {selected.status}
              </span>
            </div>
            
            <h3 className="text-4xl font-black italic uppercase mb-8 tracking-tighter text-slate-900">
              {selected.cargo}
            </h3>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <div className="w-0.5 h-12 border-l-2 border-dashed border-slate-200 my-1" />
                  <Navigation size={16} className="text-blue-600" />
                </div>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-1">Откуда</p>
                    <p className="font-bold text-slate-700">{selected.location_from}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-1">Куда</p>
                    <p className="font-bold text-slate-700">{selected.location_to}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-300 mb-1 flex items-center gap-1">
                    <CreditCard size={12} /> Стоимость
                  </p>
                  <p className="text-xl font-black text-slate-900">{selected.price || 5000} ₽</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-300 mb-1 flex items-center gap-1">
                    <Truck size={12} /> Клиент
                  </p>
                  <p className="text-sm font-bold text-slate-700">{selected.client_username}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-3">
            {user.role === 'carrier' && selected.status === 'Pending' && (
              <button 
                onClick={() => onStatusUpdate(selected.id, 'In Transit')} 
                className="flex-1 bg-blue-600 text-white py-5 rounded-3xl font-black uppercase shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all"
              >
                Принять заказ
              </button>
            )}
            
            {user.role === 'carrier' && selected.status === 'In Transit' && (
              <button 
                onClick={() => onStatusUpdate(selected.id, 'Delivered')} 
                className="flex-1 bg-green-600 text-white py-5 rounded-3xl font-black uppercase shadow-xl shadow-green-200 hover:bg-green-700 transition-all"
              >
                Доставлено
              </button>
            )}

            <button 
              onClick={onClose} 
              className="flex-1 bg-slate-100 text-slate-400 py-5 rounded-3xl font-black uppercase hover:bg-slate-200 transition-all"
            >
              Закрыть
            </button>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: КАРТА */}
        <div className="h-[300px] md:h-auto md:w-1/2 bg-slate-100 relative grayscale-[0.2] contrast-[1.1]">
          <MapContainer 
            center={[selected.lat, selected.lng]} 
            zoom={6} 
            style={{height: '100%', width: '100%'}} 
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Точка А */}
            <Marker position={[selected.lat, selected.lng]} />
            
            {/* Точка Б */}
            <Marker position={[selected.lat2, selected.lng2]} />
            
            {/* Линия маршрута */}
            <Polyline 
              positions={[
                [selected.lat, selected.lng], 
                [selected.lat2, selected.lng2]
              ]} 
              color="#2563eb" 
              dashArray="10, 15" 
              weight={4} 
            />
          </MapContainer>
          
          {/* Декоративный градиент поверх карты для мягкого перехода */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none hidden md:block" />
        </div>
      </div>
    </div>
  );
};

export default OrderModal;