
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

  // Render nội dung chính dựa trên chế độ
  const renderContent = () => {
    if (isAdminMode) {
      if (user.role !== 'ADMIN') return <AdminLogin onLogin={handleAdminLogin} />;
      return <AdminDashboard feedbacks={feedbacks} onUpdateFeedback={handleUpdateFeedback} onLogout={handleLogout} />;
    }
    return (
      <>
        {/* Banner Header - Cực kỳ trong suốt */}
       <header className="relative w-full pt-6 pb-4 md:pt-10 md:pb-6 px-4 md:px-8 flex flex-col items-center justify-center z-20">
  {/* Chỉnh bg-white/5 và backdrop-blur-md để thấy rõ ảnh nền phía sau */}
  <div className="max-w-6xl w-full bg-white/5 backdrop-blur-none rounded-[32px] md:rounded-[48px] p-6 md:p-10 border border-white/20 shadow-2xl shadow-blue-900/5">
    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
      <div className="flex flex-col items-center text-center space-y-3 shrink-0">
        {/* Logo vẫn giữ màu xanh đặc trưng y tế */}
        <div className="w-14 h-14 md:w-16 bg-blue-600 rounded-[20px] flex items-center justify-center text-white shadow-xl">
          <Icons.Hospital />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight uppercase leading-tight">
            {HOSPITAL_NAME}
          </h1>
          <p className="text-blue-600 font-bold tracking-[0.15em] uppercase text-[9px] md:text-[10px]">
            Chất lượng - Tận tâm - Chuyên nghiệp
          </p>
        </div>
      </div>
      
      <div className="hidden lg:block w-[1px] h-20 bg-slate-300/40 rounded-full"></div>
      
      <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 lg:max-w-[55%]">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Lắng nghe để thấu hiểu – <br className="hidden md:block lg:hidden" />
          <span className="text-blue-600">Góp ý để hoàn thiện</span>
        </h2>
      </div>
    </div>
  </div>
</header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-start pb-20 px-4 md:px-8 relative z-30">
          <div className="w-full max-w-6xl">
            <PublicFeedback onSubmit={handlePublicSubmit} />
          </div>
        </main>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-transparent">
      {/* Background Toàn Trang */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        <img 
          src="images/bg.png.png" 
          alt="" 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes('.png.png')) {
                target.src = 'images/bg.png';
            }
          }}
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
      </div>

      {/* Top Bar */}
      <div className="bg-slate-900/95 text-white/50 text-[10px] font-black tracking-[0.2em] px-4 md:px-8 py-3 flex justify-between items-center uppercase z-50">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> 
            <span className="hidden xs:inline">Hệ thống trực tuyến</span>
          </span>
        </div>
        {!isAdminMode && (
          <button onClick={() => setIsAdminMode(true)} className="hover:text-white transition-colors flex items-center gap-2 group">
            <Icons.User /> 
            <span className="group-hover:translate-x-0.5 transition-transform uppercase">Đăng nhập Quản trị</span>
          </button>
        )}
        {isAdminMode && (
          <button onClick={handleLogout} className="hover:text-white transition-colors flex items-center gap-2">
            <span className="uppercase text-red-400">Đăng xuất</span>
          </button>
        )}
      </div>

      {renderContent()}

      {!isAdminMode && (
        <footer className="bg-slate-900/90 backdrop-blur-md text-white/40 py-12 px-6 md:px-12 relative z-40">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-white/5 pb-12">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-xl p-1 shadow-lg">
                    <Icons.Hospital />
                 </div>
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
      )}
    </div>
  );
};

// Add default export to fix error in index.tsx
export default App;
