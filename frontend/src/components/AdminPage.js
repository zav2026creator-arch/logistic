import React, { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';

const AdminPage = ({ API_URL }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total_orders: 0, revenue: 0, total_users: 0 });
  const [editingUser, setEditingUser] = useState(null);

  const loadData = () => {
    fetch(`${API_URL}/admin/users`).then(r => r.json()).then(setUsers);
    fetch(`${API_URL}/admin/stats`).then(r => r.json()).then(setStats);
  };

  useEffect(loadData, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/admin/users/${editingUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingUser)
    });
    setEditingUser(null);
    loadData();
  };

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Выручка</p>
          <p className="text-4xl font-black text-blue-600 italic">{stats.revenue} ₽</p>
        </div>
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Заказов</p>
          <p className="text-4xl font-black">{stats.total_orders}</p>
        </div>
        <div className="bg-white p-8 rounded-[40px] border shadow-sm">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Пользователей</p>
          <p className="text-4xl font-black">{stats.total_users}</p>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border overflow-hidden shadow-sm">
        <h3 className="p-8 font-black text-xl uppercase italic border-b bg-slate-50">Управление пользователями</h3>
        <table className="w-full text-left">
          <thead className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 border-b">
            <tr>
              <th className="p-6">Логин / Организация</th>
              <th className="p-6">Роль</th>
              <th className="p-6">Контакты</th>
              <th className="p-6 text-right">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y font-medium text-sm">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-6"><span className="font-black text-slate-800">{u.username}</span><br/><span className="text-xs text-slate-400">{u.org_name}</span></td>
                <td className="p-6 uppercase text-[10px] font-black tracking-widest">{u.role}</td>
                <td className="p-6 text-xs">{u.email}<br/>{u.phone}</td>
                <td className="p-6 text-right">
                  <button onClick={() => setEditingUser(u)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[5000]">
          <form onSubmit={handleUpdate} className="bg-white p-10 rounded-[40px] w-full max-w-lg space-y-4 shadow-2xl border">
            <h3 className="text-2xl font-black italic mb-6 uppercase">Редактировать профиль</h3>
            <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none" value={editingUser.org_name} placeholder="Название организации" onChange={e => setEditingUser({...editingUser, org_name: e.target.value})} />
            <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none" value={editingUser.email} placeholder="Email" onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
            <input className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none" value={editingUser.phone} placeholder="Телефон" onChange={e => setEditingUser({...editingUser, phone: e.target.value})} />
            <div className="flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase">Сохранить</button>
              <button type="button" onClick={() => setEditingUser(null)} className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black uppercase">Отмена</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPage;