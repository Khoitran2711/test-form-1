
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

  const renderContent = () => {
    if (isAdminMode) {
      if (user.role !== 'ADMIN') return <AdminLogin onLogin={handleAdminLogin} />;
      return <AdminDashboard feedbacks={feedbacks} onUpdateFeedback={handleUpdateFeedback} onLogout={handleLogout} />;
    }
    return (
      <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8">
        {/* Header - Quay lại giao diện cũ với logo trong khối xanh */}
        <div className="w-full flex flex-col md:flex-row items-center gap-6 mb-12 bg-white/90 p-8 rounded-[30px] shadow-lg border border-blue-100">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-[20px] flex items-center justify-center text-white shadow-xl p-2 shrink-0">
            <Icons.Hospital />
          </div>
          <div className="flex flex-col text-center md:text-left">
            <h1 className="text-xl md:text-3xl font-extrabold text-blue-900 tracking-tight leading-none uppercase">
              {HOSPITAL_NAME}
            </h1>
            <div className="h-1 w-24 bg-blue-600 my-2 rounded-full mx-auto md:mx-0"></div>
            <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">
              Hệ thống tiếp nhận phản ánh & góp ý trực tuyến
            </p>
          </div>
        </div>

        <PublicFeedback onSubmit={handlePublicSubmit} />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image cố định */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
        <img 
          src="images/bg.png" 
          alt="Background" 
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000';
          }}
        />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px]"></div>
      </div>

      {/* Top Bar Navigation */}
      <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg p-1">
            <Icons.Hospital />
          </div>
          <span className="font-bold text-xs md:text-sm tracking-wide uppercase">Cổng thông tin y tế</span>
        </div>
        {!isAdminMode ? (
          <button 
            onClick={() => setIsAdminMode(true)} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all"
          >
            <Icons.User /> Quản trị viên
          </button>
        ) : (
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-all"
          >
            Đăng xuất
          </button>
        )}
      </nav>

      {renderContent()}

      {!isAdminMode && (
        <footer className="mt-auto bg-slate-900 text-white/80 py-12 px-6 border-t-4 border-blue-600">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl p-2">
                <Icons.Hospital />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{HOSPITAL_NAME}</h3>
                <p className="text-xs">Số 01 Nguyễn Văn Cừ, Tp. Phan Rang - Tháp Chàm, Ninh Thuận</p>
                <p className="text-xs">Hotline: (0259) 3822 660</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 text-blue-400">Đường dây nóng</p>
              <p className="text-3xl font-black text-white">1900 9095</p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/5 text-center text-[10px] uppercase tracking-[0.3em] opacity-40">
            © 2024 Ninh Thuan General Hospital. All rights reserved.
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
