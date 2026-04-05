import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map as MapIcon, Truck, ShieldCheck, LogOut, User, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // Словарь флагов и названий
  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
   // { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'ukr', label: 'Українська', flag: '🇺🇦' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' }
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];

  // Функция для проверки активной ссылки (подсвечивает синим)
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-[3000] w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          
          {/* ЛОГОТИП */}
          <div className="flex items-center gap-2 md:gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:rotate-6 transition-transform">
                <Truck size={20} fill="currentColor" />
              </div>
              <span className="font-black text-xl tracking-tighter italic text-slate-800 hidden sm:block">
                ZAV<span className="text-blue-600">-Logistic</span>
              </span>
            </Link>

            {/* НАВИГАЦИЯ (Десктоп) */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <NavLink to="/" icon={<MapIcon size={16}/>} label={t('map')} active={isActive('/')} />
              <NavLink to="/orders" icon={<Truck size={16}/>} label={t('orders')} active={isActive('/orders')} />
              
              {user.role === 'admin' && (
                <NavLink to="/admin" icon={<ShieldCheck size={16}/>} label="Админ" active={isActive('/admin')} />
              )}
            </nav>
          </div>

          {/* ПРАВАЯ ЧАСТЬ (Профиль и Выход) */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Инфо о юзере (скрыто на совсем маленьких экранах) */}
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">
                {user.role}
              </span>
              <span className="text-sm font-bold text-slate-700 leading-none">
                {user.username}
              </span>
            </div>

            {/* Компактный выбор языка */}
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer">
                    <span className="text-lg">{currentLanguage.flag}</span>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 hidden sm:block">
                      {currentLanguage.code}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform" />
                  </div>

                  {/* Выпадающий список при наведении (или клике) */}
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-xl border border-slate-50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[6000]">
                    {languages.map((lng) => (
                      <button
                        key={lng.code}
                        onClick={() => i18n.changeLanguage(lng.code)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-bold transition-colors ${
                          i18n.language === lng.code ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{lng.flag}</span>
                        <span>{lng.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            {/* Кнопка Профиля / Юзера */}
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 sm:hidden">
              <User size={18} />
            </div>

            {/* Кнопка Выхода */}
            <button 
              onClick={onLogout}
              className="w-10 h-10 md:w-12 md:h-12 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-200 transition-all duration-300"
              title="Выйти"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* МОБИЛЬНОЕ МЕНЮ (Нижнее или под логотипом) */}
      <div className="md:hidden flex border-t border-slate-50">
        <MobileNavLink to="/" icon={<MapIcon size={20}/>} active={isActive('/')} />
        <MobileNavLink to="/orders" icon={<Truck size={20}/>} active={isActive('/orders')} />
        {user.role === 'admin' && (
          <MobileNavLink to="/admin" icon={<ShieldCheck size={20}/>} active={isActive('/admin')} />
        )}
      </div>
    </header>
  );
};

// Вспомогательный компонент для ссылок (Десктоп)
const NavLink = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
      active 
      ? 'bg-blue-50 text-blue-600' 
      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
    }`}
  >
    {icon}
    {label}
  </Link>
);

// Вспомогательный компонент для ссылок (Мобилки)
const MobileNavLink = ({ to, icon, active }) => (
  <Link 
    to={to} 
    className={`flex-1 flex items-center justify-center py-4 transition-all ${
      active ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-300'
    }`}
  >
    {icon}
  </Link>
);

export default Navbar;
