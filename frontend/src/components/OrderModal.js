import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { X, Package, MapPin, Navigation, Truck, CreditCard, ChevronRight } from 'lucide-react';

const OrderModal = ({ selected, user, onClose, onStatusUpdate }) => {
  if (!selected) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center z-[4000] p-0 md:p-4 transition-all">
      {/* Контейнер модалки: на мобилках прижат к низу, на десктопе по центру */}
      <div className="bg-white rounded-t-[32px] md:rounded-[40px] w-full max-w-5xl h-[92vh] md:h-auto max-h-[92vh] md:max-h-[85vh] flex flex-col md:flex-row overflow-hidden shadow-2xl border-t md:border border-white/20 animate-in slide-in-from-bottom md:zoom-in duration-300">
        
        {/* ИНДИКАТОР ДЛЯ МОБИЛОК (полоска сверху) */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 md:hidden shrink-0" />

        {/* ЛЕВАЯ ЧАСТЬ: КОНТЕНТ */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 flex flex-col justify-between order-2 md:order-1">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                  #{selected.id}
                </span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  selected.status === 'Pending' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-600'
                }`}>
                  {selected.status}
                </span>
              </div>
              <button onClick={onClose} className="p-2 -mt-2 -mr-2 text-slate-300 hover:text-slate-900 md:block hidden">
                <X size={24} />
              </button>
            </div>
            
            <h3 className="text-2xl md:text-4xl font-black italic uppercase mb-8 tracking-tighter text-slate-900 leading-tight">
              {selected.cargo}
            </h3>

            {/* МАРШРУТ */}
            <div className="relative space-y-6 mb-10">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                  <MapPin size={16} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-0.5">From</p>
                  <p className="font-bold text-slate-700 text-sm md:text-base">{selected.location_from}</p>
                </div>
              </div>
              
              <div className="absolute left-4 top-8 w-px h-6 border-l-2 border-dashed border-slate-100" />

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                  <Navigation size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest mb-0.5">To</p>
                  <p className="font-bold text-slate-700 text-sm md:text-base">{selected.location_to}</p>
                </div>
              </div>
            </div>

            {/* КАРТОЧКИ С ИНФО */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 pt-6 border-t border-slate-50">
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Price</p>
                <p className="text-lg font-black text-slate-900 italic">{selected.price || '5 000'} $</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl">
                <p className="text-[9px] uppercase font-black text-slate-400 mb-1">Client</p>
                <p className="text-sm font-bold text-slate-700 truncate">{selected.client_username}</p>
              </div>
            </div>
          </div>

          {/* КНОПКИ ДЕЙСТВИЙ */}
          <div className="mt-8 md:mt-12 flex flex-col gap-3">
            {user.role === 'carrier' && selected.status === 'Pending' && (
              <button 
                onClick={() => onStatusUpdate(selected.id, 'In Transit')} 
                className="w-full bg-blue-600 text-white py-4 md:py-5 rounded-2xl md:rounded-3xl font-black uppercase text-xs md:text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
              >
                Accept freight
              </button>
            )}
            
            <button 
              onClick={onClose} 
              className="w-full bg-slate-100 text-slate-500 py-4 md:py-5 rounded-2xl md:rounded-3xl font-black uppercase text-xs md:text-sm hover:bg-slate-200 transition-all"
            >
              {user.role === 'carrier' ? 'Back to search' : 'Close'}
            </button>
          </div>
        </div>

        {/* ПРАВАЯ ЧАСТЬ: МИНИ-КАРТА */}
        <div className="h-[200px] md:h-auto md:w-1/2 relative order-1 md:order-2 shrink-0">
          <MapContainer 
            center={[selected.lat, selected.lng]} 
            zoom={6} 
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[selected.lat, selected.lng]} />
            <Marker position={[selected.lat2, selected.lng2]} />
            <Polyline 
              positions={[[selected.lat, selected.lng], [selected.lat2, selected.lng2]]} 
              color="#2563eb" 
              dashArray="8, 12" 
              weight={3} 
            />
          </MapContainer>
          {/* Кнопка закрытия для мобилок поверх карты */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 shadow-lg md:hidden z-[1001]"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
