
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
    <div className="min-h-screen flex flex-col relative bg-[#fcfdfe] overflow-x-hidden">
      {/* Background Toàn Trang */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[0.5px] z-10"></div>
        <img 
          src="images/bg.png.png" 
          alt="" 
          className="w-full h-full object-cover opacity-70 transition-opacity duration-1000"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            // Fallback nếu ảnh sai tên
            if (!target.src.includes('bg.png.png')) {
                target.src = 'images/bg.png';
            }
          }}
        />
      </div>

      {/* Top Bar */}
      <div className="bg-slate-900/95 text-white/50 text-[10px] font-black tracking-[0.2em] px-4 md:px-8 py-3 flex justify-between items-center uppercase z-50 shadow-lg">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> 
            <span className="hidden xs:inline">Hệ thống tiếp nhận trực tuyến</span>
          </span>
          <span className="hidden sm:inline">Tổng đài: 1900 9095</span>
        </div>
        <button onClick={() => setIsAdminMode(true)} className="hover:text-white transition-colors flex items-center gap-2 group">
          <Icons.User /> 
          <span className="group-hover:translate-x-0.5 transition-transform uppercase">Quản trị viên</span>
        </button>
      </div>

      {/* Banner Header - Cải thiện Responsive */}
      <header className="relative w-full pt-8 pb-4 md:pt-12 md:pb-6 px-4 md:px-8 flex flex-col items-center justify-center z-20">
        <div className="max-w-6xl w-full bg-white/50 backdrop-blur-3xl rounded-[32px] md:rounded-[48px] p-6 md:p-12 border border-white/70 shadow-2xl shadow-blue-900/5">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            
            {/* Khối Trái: Nhận diện */}
            <div className="flex flex-col items-center text-center space-y-3 shrink-0">
              <div className="w-14 h-14 md:w-16 bg-blue-600 rounded-[20px] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Icons.Hospital />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl md:text-2xl font-extrabold text-slate-900 tracking-tight uppercase leading-tight">
                  {HOSPITAL_NAME}
                </h1>
                <p className="text-blue-600 font-bold tracking-[0.15em] uppercase text-[9px] md:text-[10px]">
                  Chất lượng - Tận tâm - Chuyên nghiệp
                </p>
              </div>
            </div>

            {/* Thanh kẻ dọc */}
            <div className="hidden lg:block w-[1px] h-20 bg-slate-300/40 rounded-full shrink-0"></div>
            <div className="lg:hidden w-16 h-[2px] bg-slate-200 rounded-full opacity-50"></div>

            {/* Khối Phải: Slogan */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 lg:max-w-[55%]">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Lắng nghe để thấu hiểu – <br className="hidden md:block lg:hidden" />
                <span className="text-blue-600">Góp ý để hoàn thiện</span>
              </h2>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-wide opacity-80 leading-relaxed">
                Mọi ý kiến của quý bệnh nhân giúp chúng tôi nâng cao chất lượng dịch vụ y tế cho cộng đồng
              </p>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content - Cân đối độ rộng max-w-6xl */}
      <main className="flex-1 flex flex-col items-center justify-start pb-20 md:pb-24 px-4 md:px-8 relative z-30">
        <div className="w-full max-w-6xl">
          <PublicFeedback onSubmit={handlePublicSubmit} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white/40 py-12 md:py-16 px-6 md:px-12 relative z-40">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-white/5 pb-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg"><Icons.Hospital /></div>
               <h3 className="text-sm md:text-base font-extrabold text-white uppercase tracking-tight">{HOSPITAL_NAME}</h3>
            </div>
            <div className="space-y-2 text-[11px] font-medium opacity-60">
              <p>📍 Số 01 Nguyễn Văn Cừ, Tp. Phan Rang - Tháp Chàm, Ninh Thuận</p>
              <p>📞 (0259) 3822 660 | 📧 bvdknn@ninhthuan.gov.vn</p>
            </div>
          </div>
          <div className="bg-white/5 p-8 rounded-[32px] border border-white/10 text-center flex flex-col justify-center backdrop-blur-lg">
            <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Hotline Phản Ánh</h4>
            <p className="text-3xl md:text-5xl font-black text-white tracking-tighter tabular-nums leading-none">1900 9095</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 text-[9px] font-bold uppercase tracking-[0.4em] text-center opacity-30 px-4">
          © 2024 Ninh Thuan General Hospital. Professional Medical Services.
        </div>
      </footer>
    </div>
  );
};

export default App;
