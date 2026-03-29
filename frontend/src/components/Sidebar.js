import React, { useState, useMemo } from 'react';
import { Package, MapPin, Navigation, Search, Filter, Weight} from 'lucide-react';

const Sidebar = ({ orders, onOrderClick, selectedId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Логика фильтрации (useMemo для оптимизации)
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.location_from.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Список уникальных статусов для выпадающего списка
  const statuses = ['All', ...new Set(orders.map(o => o.status))];

  return (
    <div className="w-80 h-full bg-white border-r shadow-xl z-[1000] flex flex-col overflow-hidden">
      {/* Шапка и Фильтры */}
      <div className="p-6 border-b bg-slate-50 space-y-4">
        <div>
          <h2 className="font-black italic uppercase text-xl tracking-tighter">Активные грузы</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Найдено: {filteredOrders.length}
          </p>
        </div>

        {/* Поле поиска */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text"
            placeholder="Поиск груза..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-blue-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Фильтр по статусу */}
        <div className="flex items-center gap-2">
          <Filter size={12} className="text-slate-400" />
          <select 
            className="flex-1 bg-transparent text-[10px] font-black uppercase tracking-widest outline-none text-slate-600 cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status === 'All' ? 'Все статусы' : status}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Список заказов */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-slate-300 font-bold italic">
            {orders.length === 0 ? "Заказов пока нет" : "Ничего не найдено"}
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => onOrderClick(order, false)}
              className={`p-4 rounded-3xl border-2 transition-all cursor-pointer group ${
                selectedId === order.id 
                ? 'border-blue-600 bg-blue-50' 
                : 'border-slate-50 bg-white hover:border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${selectedId === order.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Package size={16} />
                </div>
                <span className="font-black text-xs uppercase italic truncate text-slate-800">
                  {order.cargo}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin size={12} className="text-slate-300 mt-1 shrink-0" />
                  <p className="text-[10px] font-bold text-slate-500 leading-tight">
                    {order.location_from}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Navigation size={12} className="text-blue-400 mt-1 shrink-0" />
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">
                    {order.location_to}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Weight size={12} className="text-blue-400 mt-1 shrink-0" />
                  <p className="text-[10px] font-bold text-slate-800 leading-tight">
                    {order.weight} KG
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="text-[9px] font-black px-2 py-1 bg-slate-100 rounded-lg text-slate-400 uppercase">
                  #{order.id}
                </span>
                <span className={`text-[9px] font-black uppercase italic ${
                  order.status === 'Pending' ? 'text-amber-500' : 
                  order.status === 'In Transit' ? 'text-blue-500' : 'text-green-500'
                }`}>
                  {order.status}
                </span>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Чтобы не сработал клик по карточке (flyTo)
                        onOrderClick(order, true); // true означает "открыть модалку"
                    }}
                    className="text-[10px] font-black bg-slate-900 text-white px-3 py-1.5 rounded-xl uppercase hover:bg-blue-600 transition-colors"
                    >
                    Детали
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;