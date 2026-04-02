import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const OrdersPage = ({ user, orders, onRefresh, setSelected, API_URL }) => {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ cargo: '', weight: '', volume: '', distance: '', from: '', to: '' });
  const [isGeo, setIsGeo] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsGeo(true);
    
    const getCoords = async (city) => {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`);
      const d = await r.json();
      return d[0] ? [parseFloat(d[0].lat), parseFloat(d[0].lon)] : [40.0, 46.0];
    };

    const [lat, lng] = await getCoords(form.from);
    const [lat2, lng2] = await getCoords(form.to);

    await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, lat, lng, lat2, lng2, username: user.username })
    });

    setShowForm(false);
    setIsGeo(false);
    onRefresh();
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Останавливаем всплытие, чтобы не открылась модалка деталей
    if (window.confirm("Are you sure you want to delete this order?")) {
      await fetch(`${API_URL}/orders/${id}`, {
        method: 'DELETE',
      });
      onRefresh(); // Обновляем список
    }
  };

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">List of transportations</h2>
        {user.role === 'client' && (
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-10 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all">
            <Plus size={16}/> New order
          </button>
        )}
      </div>

      <div className="bg-white rounded-[40px] border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b text-[10px] font-black text-slate-400 uppercase">
            <tr>
              <th className="p-8">Cargo</th>
              <th className="p-8">Route</th>
              <th className="p-8">Status</th>
              <th className="p-8 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map(o => (
              <tr key={o.id} onClick={() => setSelected(o)} className="hover:bg-slate-50 cursor-pointer transition-all font-bold group">
                <td className="p-8 uppercase italic text-slate-800 group-hover:text-blue-600">{o.cargo}</td>
                <td className="p-8 text-slate-400 text-sm font-medium">{o.location_from} → {o.location_to}</td>
                <td className="p-8 italic uppercase text-[10px] font-black text-blue-500">{o.status}</td>
                <td className="p-8 text-right">
                  {/* Кнопка удаления видна только создателю (клиенту) или админу */}
                  {(user.role === 'admin' || user.role === 'client') && (
                    <button 
                      onClick={(e) => handleDelete(e, o.id)}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      title="Delete order"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[5000] p-4">
          <div className="bg-white p-12 rounded-[50px] w-full max-w-md shadow-2xl relative">
            <h3 className="text-3xl font-black italic uppercase mb-8">Create an order</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" placeholder="What are we carrying?" onChange={e => setForm({...form, cargo: e.target.value})} />
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" placeholder="Weight (KG)" onChange={e => setForm({...form, weight: e.target.value})} />
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" placeholder="Volume (M3)" onChange={e => setForm({...form, volume: e.target.value})} />
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" placeholder="Distance (Km)" onChange={e => setForm({...form, distance: e.target.value})} />
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" placeholder="From (City)" onChange={e => setForm({...form, from: e.target.value})} />
              <input required className="w-full p-5 bg-slate-50 rounded-2xl outline-none border-none font-bold" placeholder="Where (City)" onChange={e => setForm({...form, to: e.target.value})} />
              <button disabled={isGeo} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase mt-4 disabled:bg-slate-200">
                {isGeo ? 'Looking for cities...' : 'Place an order'}
              </button>
            </form>
            <button onClick={() => setShowForm(false)} className="w-full bg-red-600 text-white py-5 rounded-3xl font-black uppercase mt-4 disabled:bg-slate-200">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
