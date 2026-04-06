import React, { useState } from 'react';
import { Package, Scale, Box, Car, Info, Plus, MapPin, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const OrdersPage = ({ user, orders, onRefresh, setSelected, API_URL }) => {
  const { t } = useTranslation(); // Подключаем перевод
  
  const [formData, setFormData] = useState({
    cargo: '', weight: '', volume: '', vehicle_type: '',
    description: '', location_from: '', location_to: '', price: ''
  });

  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Получаем координаты для обеих точек
    const fromCoords = await getCoordinates(formData.location_from);
    const toCoords = await getCoordinates(formData.location_to);

    if (!fromCoords || !toCoords) {
      alert(t('error_address_not_found', 'Не удалось найти один из адресов на карте'));
      return;
    }

    try {
      const newOrder = {
        ...formData,
        lat: fromCoords.lat,
        lng: fromCoords.lng,
        lat2: toCoords.lat,
        lng2: toCoords.lng,
        status: 'Pending',
        username: user.username
      };

      await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      
      setFormData({ cargo: '', weight: '', volume: '', vehicle_type: '', description: '', location_from: '', location_to: '', price: '' });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    // Используем перевод для системного окна подтверждения
    if (!window.confirm(t('confirm_delete', 'Delete this order?'))) return;
    await fetch(`${API_URL}/orders/${id}`, { method: 'DELETE' });
    onRefresh();
  };

  return (
    <div className="p-4 md:p-12 max-w-7xl mx-auto">
      
      {/* ФОРМА СОЗДАНИЯ */}
      {(user.role === 'client' || user.role === 'admin') && (
        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100 mb-12">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
              <Plus size={24} />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">{t('create_title')}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="relative">
                  <Package className="absolute left-4 top-4 text-slate-300" size={18} />
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder={t('placeholder_cargo')}
                    value={formData.cargo}
                    onChange={e => setFormData({...formData, cargo: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Scale className="absolute left-4 top-4 text-slate-300" size={18} />
                    <input
                      type="number"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                      placeholder={t('label_weight')}
                      value={formData.weight}
                      onChange={e => setFormData({...formData, weight: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <Box className="absolute left-4 top-4 text-slate-300" size={18} />
                    <input
                      type="number"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                      placeholder={t('label_volume')}
                      value={formData.volume}
                      onChange={e => setFormData({...formData, volume: e.target.value})}
                    />
                  </div>
                </div>

                <div className="relative">
                  <Car className="absolute left-4 top-4 text-slate-300" size={18} />
                  <input
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold"
                    placeholder={t('label_vehicle')}
                    value={formData.vehicle_type}
                    onChange={e => setFormData({...formData, vehicle_type: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    placeholder={t('placeholder_from')}
                    value={formData.location_from}
                    onChange={e => setFormData({...formData, location_from: e.target.value})}
                    required
                  />
                  <input
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                    placeholder={t('placeholder_to')}
                    value={formData.location_to}
                    onChange={e => setFormData({...formData, location_to: e.target.value})}
                    required
                  />
                </div>

                <div className="relative">
                  <Info className="absolute left-4 top-4 text-slate-300" size={18} />
                  <textarea
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold min-h-[110px]"
                    placeholder={t('placeholder_desc')}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">
              {t('btn_publish')}
            </button>
          </form>
        </div>
      )}

      {/* СПИСОК ЗАКАЗОВ */}
      <div className="mb-6 flex justify-between items-end">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter text-slate-400">{t('active_shipments', 'Active Shipments')}</h2>
        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">{orders.length} {t('total', 'total')}</span>
      </div>

      <div className="hidden md:block bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('label_cargo', 'Cargo')}</th>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('label_route', 'Route')}</th>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('label_params', 'Parameters')}</th>
              <th className="p-6 text-left text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('label_status', 'Status')}</th>
              <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('label_actions', 'Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id} onClick={() => setSelected(o)} className="border-b border-slate-50 last:border-none hover:bg-blue-50/30 cursor-pointer transition-colors group">
                <td className="p-6 font-black italic text-slate-800 uppercase group-hover:text-blue-600">{o.cargo}</td>
                <td className="p-6 text-sm font-bold text-slate-500">{o.location_from} → {o.location_to}</td>
                <td className="p-6 text-xs font-bold text-slate-400">{o.weight}{t('unit_kg', 'kg')} / {o.volume}{t('unit_m3', 'm³')}</td>
                <td className="p-6">
                   <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${o.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                    {t(`status_${o.status.toLowerCase().replace(/\s/g, '_')}`)}
                   </span>
                </td>
                {(user.role === 'client') && (
                  <td className="p-6 text-right">
                    <button onClick={(e) => handleDelete(e, o.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                  </td>                
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* МОБИЛЬНЫЕ КАРТОЧКИ */}
      <div className="md:hidden space-y-4">
        {orders.map(o => (
          <div key={o.id} onClick={() => setSelected(o)} className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className="font-black italic text-slate-800 uppercase">{o.cargo}</span>
              {(user.role === 'client') && (
                <button onClick={(e) => handleDelete(e, o.id)} className="text-slate-200"><Trash2 size={18}/></button>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-4">
              <MapPin size={14} className="text-blue-500" /> {o.location_from} → {o.location_to}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <span className="text-[10px] font-black uppercase text-slate-300">{o.weight}{t('unit_kg', 'kg')} · {o.vehicle_type || t('vehicle_any', 'Any')}</span>
              <span className="text-[10px] font-black uppercase text-blue-600">{t('details')} →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
