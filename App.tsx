
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
      <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Header - Độ trong suốt 10% để thấy background rõ nét */}
        <div className="w-full flex flex-col md:flex-row items-center gap-6 mb-12 bg-white/10 backdrop-blur-none p-8 rounded-[40px] shadow-2xl border border-white/20">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl p-3 shrink-0 overflow-hidden">
            {/* Sửa lại thẻ img Logo để tránh lỗi không hiện */}
            <img 
              src="images/logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain" 
            onError={(e) => {
    const target = e.target as HTMLImageElement;
    // Cách an toàn: Ẩn ảnh đi nếu lỗi thay vì cố nạp lại
    target.style.display = 'none'; 
    console.error("Lỗi: Không tìm thấy file bg.png");
                }
              }}
            />
          </div>
          <div className="flex flex-col text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-black text-blue-900 tracking-tighter leading-none uppercase drop-shadow-sm">
              {HOSPITAL_NAME}
            </h1>
            <div className="h-1.5 w-32 bg-blue-600 my-3 rounded-full mx-auto md:mx-0 shadow-sm"></div>
            <p className="text-blue-700 font-extrabold uppercase tracking-[0.2em] text-[10px] md:text-xs">
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
      {/* Background Image - ĐÃ SỬA LỖI VÒNG LẶP GÂY TẢI TRANG */}
      <div className="fixed inset-0 -z-50 overflow-hidden">
       <img 
  src="images/bg.png" 
  alt="" 
  className="w-full h-full object-cover"
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    // Cách an toàn: Ẩn ảnh đi nếu lỗi thay vì cố nạp lại
    target.style.display = 'none'; 
    console.error("Lỗi: Không tìm thấy file bg.png");
  }}
/>
        {/* Lớp phủ mỏng 20% và không blur để ảnh cực rõ */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-none"></div>
      </div>

      {/* Top Bar Navigation */}
      <nav className="bg-blue-900/90 backdrop-blur-md text-white px-6 py-4 flex justify-between items-center shadow-lg z-50 sticky top-0">
        {/* ... (phần nav giữ nguyên) */}
      </nav>

      {renderContent()}

      {!isAdminMode && (
        <footer className="mt-20 bg-slate-900/95 backdrop-blur-sm text-white/80 py-16 px-6 border-t-8 border-blue-600 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-2xl p-3 shadow-2xl">
                <Icons.Hospital />
              </div>
              <div>
                <h3 className="font-black text-xl text-white tracking-tight">{HOSPITAL_NAME}</h3>
                <p className="text-sm opacity-70">Số 01 Nguyễn Văn Cừ, Tp. Phan Rang - Tháp Chàm, Ninh Thuận</p>
                <p className="text-sm font-bold text-blue-400 mt-1">Đường dây nóng hỗ trợ: (0259) 3822 660</p>
              </div>
            </div>
            <div className="text-center md:text-right bg-white/5 p-6 rounded-[30px] border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-blue-400">Hotline Bộ Y Tế</p>
              <p className="text-4xl font-black text-white tracking-tighter">1900 9095</p>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">
            © 2024 Ninh Thuan General Hospital. Cam kết chất lượng phục vụ hàng đầu.
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
