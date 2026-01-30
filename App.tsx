
import React, { useState, useEffect } from 'react';
import { PublicFeedback } from './components/PublicFeedback';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Feedback, FeedbackStatus, User } from './types';
import { HOSPITAL_NAME, Icons } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User>({ role: 'PUBLIC' });
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hospital_feedbacks');
      if (saved) setFeedbacks(JSON.parse(saved));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    localStorage.setItem('hospital_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const handlePublicSubmit = (newFeedback: Omit<Feedback, 'id' | 'status' | 'createdAt'>) => {
    const feedback: Feedback = {
      ...newFeedback,
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      status: FeedbackStatus.PENDING,
      createdAt: new Date().toISOString()
    };
    setFeedbacks(prev => [feedback, ...prev]);
  };

  const handleUpdateFeedback = (updated: Feedback) => {
    setFeedbacks(prev => prev.map(f => f.id === updated.id ? updated : f));
  };

  const handleAdminLogin = (username: string) => {
    setUser({ role: 'ADMIN', username });
    setIsAdminMode(true);
  };

  const handleLogout = () => {
    setUser({ role: 'PUBLIC' });
    setIsAdminMode(false);
  };

  if (isAdminMode) {
    if (user.role !== 'ADMIN') return <AdminLogin onLogin={handleAdminLogin} />;
    return <AdminDashboard feedbacks={feedbacks} onUpdateFeedback={handleUpdateFeedback} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe]">
      {/* Top Bar - Thanh mảnh và chuyên nghiệp */}
      <div className="bg-slate-900/95 text-white/50 text-[9px] font-black tracking-[0.3em] px-8 py-3 flex justify-between items-center uppercase z-50">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> 
            Hệ thống đang hoạt động
          </span>
          <span className="hidden md:inline">Hotline 24/7: 1900 9095</span>
        </div>
        <button onClick={() => setIsAdminMode(true)} className="hover:text-white transition-colors flex items-center gap-2 group">
          <Icons.User /> 
          <span className="group-hover:translate-x-0.5 transition-transform uppercase">Trang Quản Trị Hệ thống</span>
        </button>
      </div>

      {/* Banner Header - Chứa Logo và Slogan với Ảnh nền rõ nét hơn */}
      <header className="relative w-full pt-16 pb-12 px-6 flex flex-col items-center justify-center overflow-hidden">
        {/* Nền ảnh với Overlay Gradient để hòa quyện vào trang web */}
        <div className="absolute top-0 left-0 w-full h-full -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/80 to-[#fcfdfe] z-10"></div>
          <div 
            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center transition-opacity duration-1000 opacity-15"
          ></div>
        </div>

        <div className="max-w-7xl w-full flex flex-col items-center gap-8 text-center z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-200/50 transform transition-transform hover:scale-110">
              <Icons.Hospital />
            </div>
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight uppercase leading-none">{HOSPITAL_NAME}</h1>
              <p className="text-[9px] text-blue-600 font-bold uppercase tracking-[0.4em] mt-2 italic">Chất lượng - Tận tâm - Chuyên nghiệp</p>
            </div>
          </div>

          {/* Slogan */}
          <div className="mt-2 space-y-3">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tighter leading-[1.1]">
              Góp ý của bạn là <br/>
              <span className="text-blue-600 drop-shadow-sm">tài sản của chúng tôi</span>
            </h2>
            <p className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-[0.3em] opacity-90">
              Lắng nghe để cải tiến — Chia sẻ để hoàn thiện
            </p>
          </div>
        </div>
      </header>

      {/* Main Content - Form được đẩy lên cao sát banner */}
      <main className="flex-1 flex flex-col items-center justify-start -mt-4 pb-24 px-6 relative z-30">
        <div className="w-full max-w-5xl">
          <PublicFeedback onSubmit={handlePublicSubmit} />
        </div>
      </main>

      <footer className="bg-slate-900 text-white/40 py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-white/5 pb-16">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-blue-600 rounded-xl text-white"><Icons.Hospital /></div>
               <h3 className="text-base font-extrabold text-white uppercase tracking-tight">{HOSPITAL_NAME}</h3>
            </div>
            <div className="space-y-2 text-[11px] font-medium opacity-60">
              <p>📍 Số 01 Nguyễn Văn Cừ, Tp. Phan Rang - Tháp Chàm, Ninh Thuận</p>
              <p>📞 (0259) 3822 660 | 📧 bvdknn@ninhthuan.gov.vn</p>
            </div>
          </div>
          <div className="bg-white/5 p-10 rounded-[32px] border border-white/5 text-center flex flex-col justify-center">
            <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Đường dây nóng phản ánh</h4>
            <p className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none">1900 9095</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 text-[8px] font-bold uppercase tracking-[0.4em] text-center opacity-30">
          © 2024 Ninh Thuan General Hospital. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
