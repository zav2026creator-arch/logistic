import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Building2, Save, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProfilePage = ({ user, onUpdate, onLogout, API_URL }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ ...user });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const updatedUser = await res.json();
        onUpdate(updatedUser); // Обновляем состояние пользователя в App.js
        setMessage({ type: 'success', text: t('profile_updated', 'Профиль обновлен!') });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при сохранении' });
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="flex-1 bg-slate-50 p-4 md:p-8 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">
            {t('profile', 'Профиль')}
          </h1>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-2 ${
            message.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
            
            {/* Основная инфо */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{t('username', 'Логин')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    disabled 
                    value={formData.username}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-400 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{t('role', 'Роль')}</label>
                <input 
                  type="text" 
                  disabled 
                  value={formData.role}
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-slate-400 font-bold uppercase tracking-widest"
                />
              </div>
            </div>

            {/* Контакты */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{t('email', 'Email')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email || ''} 
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{t('phone', 'Телефон')}</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone || ''} 
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Дополнительно для компаний */}
            <div className="space-y-6 pt-4 border-t border-slate-50">
               <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{t('org_name', 'Название организации')}</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    name="org_name"
                    value={formData.org_name || ''} 
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">{t('address', 'Адрес')}</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    name="reg_address"
                    value={formData.reg_address || ''} 
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 ring-blue-100 transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? '...' : <><Save size={20} /> {t('save_changes', 'Сохранить изменения')}</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;