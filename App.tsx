
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
    <div className="min-h-screen flex flex-col relative">
      {/* Background Toàn Trang - Đã sửa đường dẫn và tăng độ rõ */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10"></div>
        <div 
          className="w-full h-full bg-[url('images/bg.png')] bg-cover bg-center bg-fixed opacity-40 transform scale-105"
          style={{ transition: 'opacity 1.5s ease-in-out' }}
        ></div>
      </div>

      {/* Top Bar */}
      <div className="bg-slate-900/95 text-white/50 text-[9px] font-black tracking-[0.3em] px-8 py-3 flex justify-between items-center uppercase z-50 shadow-lg">
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

      {/* Banner Header */}
      <header className="relative w-full pt-20 pb-16 px-6 flex flex-col items-center justify-center z-20">
        <div className="max-w-7xl w-full flex flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 transform hover:rotate-6 transition-transform">
              <Icons.Hospital />
            </div>
            <div className="text-center">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight uppercase leading-none">{HOSPITAL_NAME}</h1>
              <p className="text-blue-600 font-extrabold tracking-tight uppercase text-xs md:text-sm mt-3 opacity-90">Chất lượng - Tận tâm - Chuyên nghiệp</p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tighter leading-[1.1] drop-shadow-sm">
              Góp ý của bạn  <br/>
              <span className="text-blue-600">Tài sản của chúng tôi</span>
            </h2>
            <p className="text-[10px] md:text-xs text-slate-500 font-black uppercase tracking-[0.3em] opacity-90 max-w-lg mx-auto leading-loose">
              Mỗi ý kiến phản hồi giúp chúng tôi hoàn thiện dịch vụ y tế cho cộng đồng
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start -mt-8 pb-32 px-6 relative z-30">
        <div className="w-full max-w-5xl">
          <PublicFeedback onSubmit={handlePublicSubmit} />
        </div>
      </main>

      <footer className="bg-slate-900 text-white/40 py-16 px-8 relative z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-white/5 pb-16">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2.5 bg-blue-600 rounded-xl text-white"><Icons.Hospital /></div>
               <h3 className="text-base font-extrabold text-white uppercase tracking-tight">{HOSPITAL_NAME}</h3>
            </div>
            <div className="space-y-3 text-[11px] font-medium opacity-60 leading-relaxed">
              <p className="text-base font-extrabold text-white uppercase tracking-tight">📍 <span>Số 01 Nguyễn Văn Cừ, Tp. Phan Rang - Tháp Chàm, Ninh Thuận</span></p>
              <p className="text-base font-extrabold text-white uppercase tracking-tight">📞 <span>(0259) 3822 660 | 📧 bvdknn@ninhthuan.gov.vn</span></p>
            </div>
          </div>
          <div className="bg-white/5 p-12 rounded-[40px] border border-white/10 text-center flex flex-col justify-center backdrop-blur-lg">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Đường dây nóng phản ánh</h4>
            <p className="text-5xl font-black text-white tracking-tighter tabular-nums leading-none">1900 9095</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 text-[9px] font-bold uppercase tracking-[0.5em] text-center opacity-30">
          © 2024 Ninh Thuan General Hospital. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
