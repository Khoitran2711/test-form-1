
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
    <div className="min-h-screen flex flex-col relative bg-transparent">
      {/* Background Toàn Trang - Fix lỗi zoom/fixed trên mobile */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10"></div>
        <img 
          src="images/bg.png" 
          alt="background"
          className="w-full h-full object-cover opacity-50 transition-opacity duration-1000"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.src.endsWith('.jpg')) {
                target.src = 'images/bg.jpg';
            }
          }}
        />
      </div>

      {/* Top Bar - Co giãn linh hoạt */}
      <div className="bg-slate-900/95 text-white/50 text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] px-4 md:px-8 py-3 flex justify-between items-center uppercase z-50 shadow-lg">
        <div className="flex items-center gap-3 md:gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> 
            <span className="hidden xs:inline">Hệ thống đang hoạt động</span>
            <span className="xs:inline sm:hidden">Trực tuyến</span>
          </span>
          <span className="hidden sm:inline">Hotline 24/7: 1900 9095</span>
        </div>
        <button onClick={() => setIsAdminMode(true)} className="hover:text-white transition-colors flex items-center gap-2 group">
          <Icons.User /> 
          <span className="group-hover:translate-x-0.5 transition-transform uppercase">Quản trị</span>
        </button>
      </div>

      {/* Banner Header - Đưa phần logo và tên bệnh viện lên cao hơn */}
      <header className="relative w-full pt-4 pb-6 md:pt-6 md:pb-12 px-4 md:px-6 flex flex-col items-center justify-center z-20">
        <div className="max-w-7xl w-full flex flex-col items-center gap-4 md:gap-6 text-center">
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
              <Icons.Hospital />
            </div>
            <div className="text-center">
              <h1 className="text-lg md:text-3xl font-extrabold text-slate-900 tracking-tight uppercase leading-tight md:leading-none">{HOSPITAL_NAME}</h1>
              <p className="text-blue-600 font-extrabold tracking-tight uppercase text-[10px] md:text-sm mt-2 md:mt-3">Chất lượng - Tận tâm - Chuyên nghiệp</p>
            </div>
          </div>

          <div className="mt-2 md:mt-4 space-y-2 md:space-y-4">
            <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tighter leading-[1.2] md:leading-[1.1] drop-shadow-sm">
              Góp ý của bạn là <br/>
              <span className="text-blue-600">tài sản của chúng tôi</span>
            </h2>
            <p className="text-[8px] md:text-xs text-slate-500 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-90 max-w-lg mx-auto leading-relaxed md:leading-loose px-4">
              Mỗi ý kiến phản hồi giúp chúng tôi hoàn thiện dịch vụ y tế cho cộng đồng
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-start pb-20 md:pb-32 px-4 md:px-6 relative z-30">
        <div className="w-full max-w-5xl">
          <PublicFeedback onSubmit={handlePublicSubmit} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white/40 py-12 md:py-16 px-6 md:px-8 relative z-40 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 border-b border-white/5 pb-12 md:pb-16 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
               <div className="p-2 bg-blue-600 rounded-xl text-white"><Icons.Hospital /></div>
               <h3 className="text-sm md:text-base font-extrabold text-white uppercase tracking-tight">{HOSPITAL_NAME}</h3>
            </div>
            <div className="space-y-3 text-[10px] md:text-[11px] font-medium opacity-60 leading-relaxed">
              <p className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                <span>📍 Số 01 Nguyễn Văn Cừ,</span>
                <span>Tp. Phan Rang - Tháp Chàm, Ninh Thuận</span>
              </p>
              <p className="flex flex-col md:flex-row items-center gap-1 md:gap-2">
                <span>📞 (0259) 3822 660</span>
                <span className="hidden md:inline">|</span>
                <span>📧 bvdknn@ninhthuan.gov.vn</span>
              </p>
            </div>
          </div>
          <div className="bg-white/5 p-8 md:p-12 rounded-[32px] md:rounded-[40px] border border-white/10 text-center flex flex-col justify-center backdrop-blur-lg">
            <h4 className="text-[9px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Đường dây nóng phản ánh</h4>
            <p className="text-3xl md:text-5xl font-black text-white tracking-tighter tabular-nums leading-none">1900 9095</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 md:pt-10 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.4em] md:tracking-[0.5em] text-center opacity-30 px-4">
          © 2024 Ninh Thuan General Hospital. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
