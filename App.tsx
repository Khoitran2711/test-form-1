
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
      {/* Top Bar - Giữ lại thông tin quan trọng nhưng làm mờ nhẹ */}
      <div className="bg-slate-900/90 text-white/50 text-[9px] font-black tracking-[0.3em] px-8 py-3 flex justify-between items-center uppercase z-50">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Hệ thống đang hoạt động</span>
          <span className="hidden md:inline">Hotline 24/7: 1900 9095</span>
        </div>
        <button onClick={() => setIsAdminMode(true)} className="hover:text-white transition-colors flex items-center gap-2">
          <Icons.User /> Trang Quản Trị Hệ thống
        </button>
      </div>

      {/* Header Trong suốt */}
      <nav className="absolute top-[36px] left-0 right-0 z-40 py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
           <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-200/50">
                <Icons.Hospital />
              </div>
              <div className="text-center">
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight uppercase drop-shadow-sm">{HOSPITAL_NAME}</h1>
                <p className="text-[9px] text-blue-600 font-bold uppercase tracking-[0.4em] mt-1 italic">Chất lượng - Tận tâm - Chuyên nghiệp</p>
              </div>
           </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section với nền ảnh mờ nhẹ và đẩy nội dung lên */}
        <section className="relative pt-64 pb-20 px-6 text-center max-w-5xl mx-auto overflow-hidden">
          {/* Lớp nền trang trí */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-5">
             <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1586773860418-d319a39855df?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
          </div>

          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter leading-[1.1]">
              Góp ý của bạn là <br/><span className="text-blue-600">tài sản của chúng tôi</span>
            </h2>
            
            <p className="text-base md:text-lg text-slate-500 font-semibold leading-relaxed max-w-2xl mx-auto">
              Ban Giám đốc luôn trân trọng mọi ý kiến đóng góp chân thành để cải thiện quy trình khám chữa bệnh tại Bệnh viện Đa khoa Ninh Thuận.
            </p>
          </div>
        </section>

        <div className="pb-32 px-6">
          <PublicFeedback onSubmit={handlePublicSubmit} />
        </div>
      </main>

      <footer className="bg-slate-900 text-white/40 py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 border-b border-white/5 pb-16">
          <div>
            <div className="flex items-center gap-3 mb-8">
               <div className="p-2 bg-blue-600 rounded-xl text-white"><Icons.Hospital /></div>
               <h3 className="text-lg font-extrabold text-white uppercase tracking-tight">{HOSPITAL_NAME}</h3>
            </div>
            <div className="space-y-3 text-xs font-medium">
              <p>📍 Số 01 Nguyễn Văn Cừ, Tp. Phan Rang - Tháp Chàm, Ninh Thuận</p>
              <p>📞 (0259) 3822 660 | 📧 bvdknn@ninhthuan.gov.vn</p>
            </div>
          </div>
          <div className="bg-white/5 p-10 rounded-[32px] border border-white/5 text-center flex flex-col justify-center">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Đường dây nóng phản ánh</h4>
            <p className="text-5xl font-black text-white tracking-tighter tabular-nums leading-none">1900 9095</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-10 text-[9px] font-bold uppercase tracking-[0.4em] text-center">
          © 2024 Ninh Thuan General Hospital. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
