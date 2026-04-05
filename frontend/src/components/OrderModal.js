import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { X, Scale, Box, Info, Car, Gauge, Banknote } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OrderModal = ({ selected, user, onClose, onStatusUpdate }) => {
  const { t } = useTranslation();
  
  const distance = useMemo(() => {
    if (!selected) return 0;
    const R = 6371; 
    const dLat = (selected.lat2 - selected.lat) * Math.PI / 180;
    const dLon = (selected.lng2 - selected.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(selected.lat * Math.PI / 180) * Math.cos(selected.lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }, [selected]);

  if (!selected) return null;

  const finalPrice = selected.price || (distance * 1.1);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-end md:items-center justify-center z-[5000] p-0 md:p-4">
      <div className="bg-white rounded-t-[32px] md:rounded-[40px] w-full max-w-6xl h-[94vh] md:h-auto max-h-[94vh] md:max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300">
        
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 md:hidden shrink-0" />

        {/* ЛЕВАЯ ПАНЕЛЬ: ДЕТАЛИ */}
        <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col order-2 md:order-1 custom-scrollbar">
          
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                ID #{selected.id}
              </span>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                selected.status === 'Pending' ? 'bg-amber-50 text-amber-500' : 'bg-green-50 text-green-600'
              }`}>
                {/* Динамический перевод статуса */}
                {t(`status_${selected.status.toLowerCase().replace(/\s/g, '_')}`)}
              </span>
            </div>
            <button onClick={onClose} className="p-2 -mt-2 -mr-2 text-slate-300 hover:text-slate-900 hidden md:block">
              <X size={24} />
            </button>
          </div>

          <h3 className="text-2xl md:text-4xl font-black italic uppercase mb-8 tracking-tighter text-slate-900 leading-tight">
            {selected.cargo}
          </h3>

          {/* СЕТКА ГЛАВНЫХ ПОКАЗАТЕЛЕЙ */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-600 p-5 rounded-[24px] text-white shadow-lg shadow-blue-100">
              <div className="flex items-center gap-2 opacity-70 mb-1">
                <Gauge size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">{t('label_distance')}</span>
              </div>
              <p className="text-2xl font-black italic">~{distance} <span className="text-sm uppercase">{t('unit_km', 'km')}</span></p>
            </div>
            <div className="bg-emerald-500 p-5 rounded-[24px] text-white shadow-lg shadow-emerald-100">
              <div className="flex items-center gap-2 opacity-70 mb-1">
                <Banknote size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">{t('label_price')}</span>
              </div>
              <p className="text-2xl font-black italic">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(finalPrice)}</p>
            </div>
          </div>

          {/* ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Scale size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">{t('label_weight')}</span>
              </div>
              <p className="font-bold text-slate-700">{selected.weight || '—'} <span className="text-[10px]">{t('unit_kg', 'kg')}</span></p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Box size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">{t('label_volume')}</span>
              </div>
              <p className="font-bold text-slate-700">{selected.volume || '—'} <span className="text-[10px]">{t('unit_m3', 'm³')}</span></p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Car size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">{t('label_vehicle')}</span>
              </div>
              <p className="font-bold text-slate-700 text-[11px] uppercase truncate">
                {selected.vehicle_type || t('vehicle_any', 'Any')}
              </p>
            </div>
          </div>

          {/* ОПИСАНИЕ И МАРШРУТ */}
          <div className="space-y-6 mb-10">
            <div className="bg-slate-50/50 p-5 rounded-3xl border border-dashed border-slate-200">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Info size={14} />
                <span className="text-[9px] font-black uppercase tracking-widest">{t('label_description')}</span>
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                {selected.description || t('no_description', 'No additional requirements provided.')}
              </p>
            </div>

            <div className="flex items-start gap-4 px-2">
              <div className="flex flex-col items-center gap-1 mt-1">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <div className="w-0.5 h-8 bg-slate-100" />
                <div className="w-2 h-2 rounded-full bg-slate-300" />
              </div>
              <div className="space-y-4">
                <p className="text-sm font-bold text-slate-700 leading-none truncate">{selected.location_from}</p>
                <p className="text-sm font-bold text-slate-700 leading-none truncate">{selected.location_to}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 mt-4">
            <span className="text-[10px] font-black uppercase tracking-widest">{t('label_published')}:</span>
            <span className="text-xs font-bold text-slate-600">
              {selected.created_at || t('date_not_specified', 'N/A')}
            </span>
          </div>

          {/* КНОПКИ ДЕЙСТВИЙ */}
          <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4">
            {user.role === 'carrier' && selected.status === 'Pending' && (
              <button 
                onClick={() => onStatusUpdate(selected.id, 'In_Transit')}
                className="flex-[2] bg-blue-600 text-white py-4 md:py-5 rounded-2xl md:rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all"
              >
                {t('btn_accept')}
              </button>
            )}
            <button 
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-500 py-4 md:py-5 rounded-2xl md:rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
            >
              {t('btn_close')}
            </button>
          </div>
        </div>

        {/* ПРАВАЯ ПАНЕЛЬ: КАРТА */}
        <div className="h-[240px] md:h-auto md:w-1/2 relative order-1 md:order-2 shrink-0 border-b md:border-b-0 md:border-l border-slate-100">
          <MapContainer 
            center={[selected.lat, selected.lng]} 
            zoom={6} 
            className="h-full w-full grayscale-[0.2] contrast-[1.1]"
            zoomControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[selected.lat, selected.lng]} />
            <Marker position={[selected.lat2, selected.lng2]} />
            <Polyline 
              positions={[[selected.lat, selected.lng], [selected.lat2, selected.lng2]]} 
              color="#2563eb" 
              dashArray="10, 15" 
              weight={4} 
            />
          </MapContainer>
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 shadow-xl md:hidden z-[1001]"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 z-[1001] shadow-sm">
            <p className="text-[9px] font-black uppercase text-slate-400">{t('label_route')}</p>
            <p className="text-xs font-bold text-slate-800">{distance} {t('unit_km_straight', 'km straight')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
