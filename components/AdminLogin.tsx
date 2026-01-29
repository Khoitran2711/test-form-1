
import React, { useState } from 'react';
import { Icons, HOSPITAL_NAME } from '../constants';

interface AdminLoginProps {
  onLogin: (username: string) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin(username);
    } else {
      setError('Tài khoản hoặc mật khẩu không chính xác');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-slate-200 overflow-hidden border border-white">
        <div className="bg-slate-900 p-12 text-center text-white relative">
          <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-xl">
              <Icons.Hospital />
            </div>
            <h2 className="text-xl font-extrabold uppercase tracking-tight">{HOSPITAL_NAME}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-3">Cổng Quản Trị Phản Ánh</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 text-center">{error}</div>}
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tài khoản</label>
            <input type="text" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold transition-all" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mật khẩu</label>
            <input type="password" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold transition-all" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all uppercase tracking-[0.2em] text-sm mt-4">
            Đăng nhập hệ thống
          </button>
        </form>
      </div>
    </div>
  );
};
