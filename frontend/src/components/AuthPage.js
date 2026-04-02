import React, { useState } from 'react';

const AuthPage = ({ onLogin, API_URL }) => {
  const [isReg, setIsReg] = useState(false);
  const [form, setForm] = useState({ 
    username: '', password: '', role: 'client', email: '', 
    phone: '', org_name: '', reg_address: '', reg_code: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL + (isReg ? '/register' : '/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      if (isReg) { 
        alert("Registration successful! Now log in to your account."); 
        setIsReg(false); 
      } else {
        onLogin(data);
      }
    } else {
      alert(data.detail || "Access error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-[50px] w-full max-w-2xl shadow-2xl">
        <h2 className="text-4xl font-black mb-8 italic uppercase tracking-tighter text-slate-800">
          {isReg ? 'Registration' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required className="p-4 bg-slate-50 rounded-2xl outline-none font-bold" placeholder="Login" onChange={e => setForm({...form, username: e.target.value})} />
          <input required className="p-4 bg-slate-50 rounded-2xl outline-none font-bold" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
          
          {isReg && (
            <>
              <select className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-500" onChange={e => setForm({...form, role: e.target.value})}>
                <option value="client">I am a Client</option>
                <option value="carrier">I'm a Carrier</option>
              </select>
              <input className="p-4 bg-slate-50 rounded-2xl border-none" placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
              <input className="p-4 bg-slate-50 rounded-2xl border-none" placeholder="Telephone" onChange={e => setForm({...form, phone: e.target.value})} />
              <input className="p-4 bg-slate-50 rounded-2xl border-none" placeholder="Organization" onChange={e => setForm({...form, org_name: e.target.value})} />
              <input className="md:col-span-2 p-4 bg-slate-50 rounded-2xl border-none" placeholder="Legal address" onChange={e => setForm({...form, reg_address: e.target.value})} />
              <input className="p-4 bg-slate-50 rounded-2xl border-none" placeholder="INN / Reg. code" onChange={e => setForm({...form, reg_code: e.target.value})} />
            </>
          )}
          
          <button type="submit" className="md:col-span-2 bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 mt-4 transition-all">
            {isReg ? 'Create an account' : 'Login'}
          </button>
        </form>
        <button onClick={() => setIsReg(!isReg)} className="w-full mt-8 text-slate-400 font-bold hover:text-blue-600">
          {isReg ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
