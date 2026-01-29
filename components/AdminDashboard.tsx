
import React, { useState } from 'react';
import { Feedback, FeedbackStatus } from '../types';
import { Icons, HOSPITAL_NAME } from '../constants';
import { suggestReply } from '../services/geminiService';

interface AdminDashboardProps {
  feedbacks: Feedback[];
  onUpdateFeedback: (feedback: Feedback) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ feedbacks, onUpdateFeedback, onLogout }) => {
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [filter, setFilter] = useState<FeedbackStatus | 'ALL'>('ALL');

  const filteredFeedbacks = feedbacks
    .filter(f => filter === 'ALL' || f.status === filter)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSuggest = async () => {
    if (!selectedFeedback) return;
    setIsSuggesting(true);
    const suggestion = await suggestReply(selectedFeedback.content, selectedFeedback.department);
    setReplyText(suggestion);
    setIsSuggesting(false);
  };

  const handleSendReply = () => {
    if (!selectedFeedback || !replyText.trim()) return;
    
    const updated: Feedback = {
      ...selectedFeedback,
      adminReply: replyText,
      status: FeedbackStatus.RESOLVED,
      repliedAt: new Date().toLocaleString('vi-VN')
    };
    
    onUpdateFeedback(updated);
    setSelectedFeedback(updated);
    setReplyText('');
    alert('Đã gửi phản hồi thành công!');
  };

  return (
    <div className="h-screen bg-[#f1f5f9] flex flex-col overflow-hidden">
      {/* Header Admin */}
      <header className="bg-slate-900 text-white border-b border-white/10 z-30 shrink-0">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-1.5 rounded-lg"><Icons.Hospital /></div>
            <div>
              <h1 className="font-black text-sm tracking-tight uppercase leading-none">{HOSPITAL_NAME}</h1>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-1 block">Hệ thống quản trị chất lượng</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-white uppercase">Cán bộ quản lý</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Phòng Kế hoạch tổng hợp</span>
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 bg-white/10 hover:bg-red-500 text-xs font-black uppercase tracking-widest rounded-lg transition-all"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1600px] mx-auto w-full flex overflow-hidden">
        {/* List Sidebar */}
        <aside className="w-80 md:w-96 border-r border-slate-200 bg-white flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-100 shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Icons.ClipboardList />
                Danh sách phản ánh
              </h2>
              <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                {feedbacks.length}
              </span>
            </div>
            <div className="relative">
              <select 
                className="w-full text-xs font-bold border-slate-200 rounded-xl p-3 bg-slate-50 appearance-none focus:ring-2 focus:ring-blue-500 outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
              >
                <option value="ALL">Tất cả trạng thái</option>
                <option value={FeedbackStatus.PENDING}>🔴 Chờ xử lý</option>
                <option value={FeedbackStatus.RESOLVED}>🟢 Đã phản hồi</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center py-20 text-slate-400 italic text-sm">Chưa có phản ánh nào</div>
            ) : (
              filteredFeedbacks.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFeedback(f)}
                  className={`w-full text-left p-5 border-b border-slate-50 transition-all relative overflow-hidden group ${
                    selectedFeedback?.id === f.id 
                    ? 'bg-blue-50/80 border-l-4 border-l-blue-600' 
                    : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-100 px-2 py-0.5 rounded">
                      {f.department}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{f.id}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{f.fullName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">{f.content}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <Icons.Clock />
                      {f.date}
                    </div>
                    {f.status === FeedbackStatus.RESOLVED && (
                      <span className="text-[10px] font-black text-emerald-600 uppercase">Đã xử lý</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white overflow-y-auto">
          {selectedFeedback ? (
            <div className="max-w-4xl mx-auto p-10">
              <div className="flex justify-between items-start mb-10 pb-8 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                      selectedFeedback.status === FeedbackStatus.RESOLVED 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {selectedFeedback.status === FeedbackStatus.RESOLVED ? 'Hoàn thành' : 'Đang xử lý'}
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-1">{selectedFeedback.fullName}</h2>
                  <p className="text-slate-500 font-bold text-sm tracking-wide">📞 {selectedFeedback.phoneNumber || 'Không để lại số điện thoại'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-black mb-1">Thời điểm gửi</p>
                  <p className="text-sm font-bold text-slate-800">{selectedFeedback.date} | {selectedFeedback.time}</p>
                </div>
              </div>

              <div className="space-y-12">
                <section>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-widest">Khoa / Phòng ban</p>
                      <p className="text-lg font-black text-blue-700 uppercase tracking-tight">{selectedFeedback.department}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-widest">Mã phản ánh</p>
                      <p className="text-lg font-mono font-black text-slate-800 uppercase"># {selectedFeedback.id}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                    Nội dung phản ánh
                  </h4>
                  <div className="p-8 bg-blue-50/30 rounded-3xl border border-blue-100 text-slate-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                    "{selectedFeedback.content}"
                  </div>
                </section>

                {selectedFeedback.images.length > 0 && (
                   <section>
                     <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Hình ảnh minh chứng</h4>
                     <div className="flex gap-4">
                       {selectedFeedback.images.map((img, i) => (
                         <div key={i} className="relative group cursor-zoom-in">
                           <img src={img} className="w-48 h-48 object-cover rounded-2xl border border-slate-200 shadow-sm transition-all group-hover:shadow-xl" alt="Evidence" />
                         </div>
                       ))}
                     </div>
                   </section>
                )}

                <div className="h-px bg-slate-100" />

                {selectedFeedback.adminReply ? (
                  <section className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Icons.CheckCircle /></div>
                    <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Icons.CheckCircle />
                      Phản hồi chính thức của Bệnh viện
                    </h4>
                    <p className="text-slate-800 leading-relaxed text-lg font-medium">{selectedFeedback.adminReply}</p>
                    <div className="mt-6 pt-6 border-t border-emerald-100 flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      <span>Người gửi: Ban Giám đốc</span>
                      <span>Ngày phản hồi: {selectedFeedback.repliedAt}</span>
                    </div>
                  </section>
                ) : (
                  <section className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        Soạn thảo phản hồi y tế
                      </h4>
                      <button 
                        onClick={handleSuggest}
                        disabled={isSuggesting}
                        className="text-[10px] font-black text-blue-700 hover:bg-blue-100 flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 transition-all disabled:opacity-50 uppercase tracking-widest"
                      >
                        {isSuggesting ? (
                          <span className="flex items-center gap-2"><span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span> Đang phân tích...</span>
                        ) : '✨ Gợi ý từ AI Gemini'}
                      </button>
                    </div>
                    <textarea 
                      className="w-full p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none min-h-[200px] transition-all text-slate-800 text-lg leading-relaxed placeholder:italic"
                      placeholder="Nhập nội dung phản hồi chính thức mang phong cách y đức, chuyên nghiệp..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex gap-4">
                      <button 
                        onClick={handleSendReply}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 px-8 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest"
                      >
                        <Icons.Send />
                        Gửi phản hồi chính thức
                      </button>
                    </div>
                  </section>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-20 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mb-6 border border-slate-100">
                <Icons.ClipboardList />
              </div>
              <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Trung tâm quản lý phản ánh</p>
              <p className="text-sm max-w-sm mt-4 font-medium text-slate-400 leading-relaxed">Vui lòng chọn một hồ sơ phản ánh từ danh sách bên trái để bắt đầu quy trình xác minh và phản hồi.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
