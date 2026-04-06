import React, { useMemo, useState, useEffect } from 'react'; // Добавили useState и useEffect
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { X, Scale, Box, Info, Car, Gauge, Banknote, Phone, CheckCircle, Mail } from 'lucide-react'; // Добавили Phone и CheckCircle
import { useTranslation } from 'react-i18next';

const OrderModal = ({ selected, user, onClose, onStatusUpdate }) => {
  const { t } = useTranslation();
  const [isAccepted, setIsAccepted] = useState(false); // Состояние для переключения окон
  
  // Если заказ уже не в статусе Pending, сразу показываем контакты
  useEffect(() => {
    // Показываем экран контактов только если:
    // 1. Заказ принят (статус не Pending)
    // 2. Текущий пользователь — ПЕРЕВОЗЧИК
    if (selected && selected.status !== 'Pending' && user.role === 'carrier') {
      setIsAccepted(true);
    } else {
      setIsAccepted(false); // Для клиента всегда детали
    }
  }, [selected, user.role]);

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

  // Обработчик принятия заказа
  const handleAccept = () => {
    onStatusUpdate(selected.id, 'In_Transit');
    setIsAccepted(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-end md:items-center justify-center z-[5000] p-0 md:p-4">
      <div className="bg-white rounded-t-[32px] md:rounded-[40px] w-full max-w-6xl h-[94vh] md:h-auto max-h-[94vh] md:max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300 relative">
        
        {/* Кнопка закрытия (общая) */}
        <button onClick={onClose} className="absolute top-6 right-6 z-[6000] p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
          <X size={20} />
        </button>

        {(!isAccepted || user.role !== 'carrier') ? (
          /* --- ЭКРАН 1: ДЕТАЛИ ЗАКАЗА (Ваш существующий код) --- */
          <>
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 md:hidden shrink-0" />
            
            <div className="flex-1 overflow-y-auto p-6 md:p-12 flex flex-col order-2 md:order-1 custom-scrollbar">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    ID #{selected.id}
                  </span>
                  <span className="bg-amber-50 text-amber-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    {t('status_pending')}
                  </span>
                </div>
              </div>

              <h3 className="text-2xl md:text-4xl font-black italic uppercase mb-8 tracking-tighter text-slate-900 leading-tight">
                {selected.cargo}
              </h3>

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
                    <p className="text-sm font-bold text-slate-700 truncate">{selected.location_from}</p>
                    <p className="text-sm font-bold text-slate-700 truncate">{selected.location_to}</p>
                  </div>
                </div>
              </div>

              <div className="mt-auto flex flex-col sm:flex-row gap-3 pt-4">
                {user.role === 'carrier' && (
                  <button 
                    onClick={handleAccept}
                    className="flex-[2] bg-blue-600 text-white py-4 md:py-5 rounded-2xl md:rounded-[24px] font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                  >
                    {t('btn_accept')}
                  </button>
                )}
                <button onClick={onClose} className="flex-1 bg-slate-100 text-slate-500 py-4 md:py-5 rounded-2xl md:rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all">
                  {t('btn_close')}
                </button>
              </div>
            </div>

            <div className="h-[240px] md:h-auto md:w-1/2 relative order-1 md:order-2 shrink-0 border-b md:border-b-0 md:border-l border-slate-100">
              <MapContainer center={[selected.lat, selected.lng]} zoom={6} className="h-full w-full grayscale-[0.2]" zoomControl={false}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[selected.lat, selected.lng]} />
                <Marker position={[selected.lat2, selected.lng2]} />
                <Polyline positions={[[selected.lat, selected.lng], [selected.lat2, selected.lng2]]} color="#2563eb" dashArray="10, 15" weight={4} />
              </MapContainer>
            </div>
          </>
        ) : (
          /* --- ЭКРАН 2: КОНТАКТЫ КЛИЕНТА --- */
          <div className="flex-1 p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <CheckCircle size={40} />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">
              {t('order_accepted_title', 'Заказ принят!')}
            </h2>
            <p className="text-slate-500 mb-8 max-w-xs font-bold text-sm">
              {t('order_accepted_desc', 'Свяжитесь с заказчиком для уточнения деталей погрузки')}
            </p>
            
            <div className="w-full max-w-sm bg-slate-50 rounded-[32px] p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-100">
                  <Phone size={30} />
                </div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
                  {t('label_client_phone', 'Телефон заказчика')}
                </p>
                {/* Используем телефон из объекта заказа, либо заглушку */}
                <p className="text-2xl font-black text-blue-900 mb-6 tracking-tighter">
                  {selected.phone || '+39 345 888 22 11'}
                </p>
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white mb-2 shadow-md">
                  <Mail size={20} /> {/* Или импортируйте иконку Mail из lucide-react */}
                </div>
                <p className="text-[9px] font-black uppercase text-slate-400 mb-1">{t('label_client_email', 'Email заказчика')}</p>
                <p className="text-xl font-black text-emerald-900 mb-6">{selected.email}</p>
                
                <div className="grid grid-cols-1 gap-3 w-full">
                   <a 
                    href={`tel:${selected.phone || '+393458882211'}`} 
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100"
                   >
                     <Phone size={16} /> {t('call', 'Позвонить')}
                   </a>
                   <a 
                    href={`mailto:${selected.email}`} 
                    className="flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all"
                  >
                    {t('send_email', 'Написать Email')}
                  </a>
                   <button 
                    onClick={onClose}
                    className="bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-colors"
                   >
                     {t('btn_close')}
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
