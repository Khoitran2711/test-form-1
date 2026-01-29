
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
    const saved = localStorage.getItem('hospital_feedbacks');
    if (saved) {
      setFeedbacks(JSON.parse(saved));
    }
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
    if (user.role !== 'ADMIN') {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    return <AdminDashboard 
      feedbacks={feedbacks} 
      onUpdateFeedback={handleUpdateFeedback} 
      onLogout={handleLogout} 
    />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Khung y tế chuyên nghiệp */}
      <div className="bg-[#0f172a] text-[#94a3b8] text-[10px] font-black tracking-[0.2em] px-8 py-3 flex justify-between items-center border-b border-white/5 uppercase">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Máy chủ Ninh Thuận</span>
          <span className="hidden md:inline">Hotline: 1900 9095</span>
        </div>
        <button 
          onClick={() => setIsAdminMode(true)}
          className="hover:text-white transition-all flex items-center gap-2"
        >
          <Icons.User /> Đăng nhập quản trị
        </button>
      </div>

      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <div className="flex flex-col items-center gap-5">
            <div className="w-20 h-20 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 transform transition hover:scale-110">
              <Icons.Hospital />
            </div>
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4 uppercase">
                {HOSPITAL_NAME}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <span className="h-px w-12 bg-slate-200"></span>
                <p className="text-xs md:text-sm text-blue-600 font-bold uppercase tracking-[0.3em]">
                  Tận tâm phục vụ - Vững bước niềm tin
                </p>
                <span className="h-px w-12 bg-slate-200"></span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 bg-slate-50/50">
        <div className="relative pt-24 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-block px-4 py-1.5 mb-8 text-[11px] font-black tracking-widest text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 uppercase">
              Hệ thống phản ánh trực tuyến
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.05]">
              Sự hài lòng của bạn <br/>là <span className="text-blue-600">uy tín</span> của chúng tôi.
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Mọi phản hồi về chất lượng khám chữa bệnh và thái độ phục vụ sẽ được Ban Giám Đốc trực tiếp tiếp nhận và xử lý.
            </p>
          </div>
        </div>

        <div className="pb-32">
          <PublicFeedback onSubmit={handlePublicSubmit} />
        </div>
      </main>

      <footer className="bg-[#0f172a] text-white pt-24 pb-12 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-8">
               <div className="p-3 bg-blue-600 rounded-2xl"><Icons.Hospital /></div>
               <h3 className="text-2xl font-black tracking-tight uppercase leading-tight">{HOSPITAL_NAME}</h3>
            </div>
            <div className="space-y-6 text-slate-400 font-medium text-sm leading-relaxed">
              <p>Địa chỉ: Số 01 Nguyễn Văn Cừ, Tp. Phan Rang - Tháp Chàm, tỉnh Ninh Thuận.</p>
              <p>Hệ thống điện tử giúp rút ngắn khoảng cách giữa bệnh nhân và đội ngũ quản lý y tế, hướng tới sự minh bạch và chuyên nghiệp hóa.</p>
            </div>
          </div>
          
          <div className="md:col-span-3">
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-8">Thông tin liên hệ</h4>
            <ul className="space-y-4 text-sm text-slate-400 font-bold">
              <li className="flex items-center gap-3">
                <span className="text-blue-500">●</span> Điện thoại: (0259) 3822 660
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-500">●</span> Email: bvdknn@ninhthuan.gov.vn
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 bg-white/5 p-10 rounded-[2.5rem] border border-white/10 flex flex-col justify-center text-center">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">Đường dây nóng 24/7</h4>
            <p className="text-5xl font-black text-white mb-2 tabular-nums">1900 9095</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Nhấn phím 1 để gặp trực tiếp CSKH</p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-24 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] text-slate-500 font-black tracking-[0.2em] uppercase">
          <p>© 2024 BỆNH VIỆN ĐA KHOA NINH THUẬN. THIẾT KẾ BỞI PHÒNG CNTT.</p>
          <div className="flex gap-10">
            <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
            <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
