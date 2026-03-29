import React from 'react';
import { Link } from 'react-router-dom';
import { Map as MapIcon, Truck, ShieldCheck, LogOut } from 'lucide-react';

const Navbar = ({ user, onLogout }) => (
  <nav className="h-24 bg-white border-b px-12 flex items-center justify-between sticky top-0 z-[2000] shadow-sm">
    <div className="flex items-center gap-12">
      <h1 className="font-black text-3xl text-blue-600 italic tracking-tighter">ZAV-Logistic</h1>
      <div className="flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
        <Link to="/" className="hover:text-blue-600 flex items-center gap-2"><MapIcon size={14}/> Карта</Link>
        <Link to="/orders" className="hover:text-blue-600 flex items-center gap-2"><Truck size={14}/> Заказы</Link>
        {user.role === 'admin' && (
          <Link to="/admin" className="text-slate-900 border-b-2 border-blue-600 flex items-center gap-2">
            <ShieldCheck size={14}/> Админ
          </Link>
        )}
      </div>
    </div>
    <div className="flex items-center gap-6">
      <div className="text-right">
        <p className="text-[10px] font-black text-slate-300 uppercase mb-1">{user.role}</p>
        <p className="font-black text-slate-800 uppercase italic tracking-tighter">{user.username}</p>
      </div>
      <button onClick={onLogout} className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
        <LogOut size={20}/>
      </button>
    </div>
  </nav>
);

export default Navbar;