
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
  };

  return (
    <div className="h-screen bg-[#f8fafc] flex flex-col overflow-hidden text-slate-800">
      {/* Navbar - Tối ưu cho mobile */}
      <nav className="bg-white border-b border-slate-100 px-4 md:px-8 h-16 md:h-20 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg">
            <Icons.Hospital />
          </div>
          <div>
            <h1 className="font-extrabold text-sm md:text-lg tracking-tight leading-none mb-0.5 md:mb-1 truncate max-w-[150px] md:max-w-none">Admin Panel</h1>
            <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hệ thống Điều hành</p>
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-8">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold">Quản trị viên</p>
          </div>
          <button onClick={onLogout} className="px-3 py-2 md:px-5 md:py-2.5 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-[10px] md:text-xs font-bold rounded-lg md:rounded-xl transition-all border border-slate-100 uppercase tracking-widest">Thoát</button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden w-full">
        {/* Sidebar Danh sách - Stack on mobile if no selection */}
        <aside className={`w-full md:w-[350px] lg:w-[400px] bg-white border-r border-slate-100 flex flex-col shrink-0 ${selectedFeedback ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 md:p-8 border-b border-slate-50 shrink-0">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xs md:text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Icons.ClipboardList /> Phản ánh mới
              </h2>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 md:px-3 py-1 rounded-full border border-blue-100">{feedbacks.length}</span>
            </div>
            <select 
              className="w-full bg-slate-50 border-none rounded-xl p-3 md:p-4 text-[11px] md:text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="ALL">Tất cả hồ sơ</option>
              <option value={FeedbackStatus.PENDING}>🔴 Chờ xử lý</option>
              <option value={FeedbackStatus.RESOLVED}>🟢 Đã phản hồi</option>
            </select>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center py-20 opacity-30 text-xs italic">Dữ liệu trống</div>
            ) : (
              filteredFeedbacks.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFeedback(f)}
                  className={`w-full text-left p-4 md:p-6 rounded-xl md:rounded-2xl transition-all border ${
                    selectedFeedback?.id === f.id 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' 
                    : 'bg-white border-slate-50 hover:border-blue-100 text-slate-600'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2 md:mb-3">
                    <span className={`text-[8px] md:text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                      selectedFeedback?.id === f.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600'
                    }`}>{f.department}</span>
                    <span className={`text-[9px] font-mono ${selectedFeedback?.id === f.id ? 'text-white/60' : 'text-slate-300'}`}>#{f.id}</span>
                  </div>
                  <h4 className="font-extrabold text-xs md:text-sm mb-1 truncate">{f.fullName}</h4>
                  <p className={`text-[11px] line-clamp-2 leading-relaxed opacity-80 ${selectedFeedback?.id === f.id ? 'text-white/80' : 'text-slate-400'}`}>{f.content}</p>
                </button>
              ))
            )}
          </div>
        </aside>

        {/* Nội dung chi tiết - Show on mobile if selected */}
        <main className={`flex-1 bg-[#fcfdfe] overflow-y-auto ${!selectedFeedback ? 'hidden md:block' : 'block'}`}>
          {selectedFeedback ? (
            <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-10">
              <button onClick={() => setSelectedFeedback(null)} className="md:hidden mb-4 text-blue-600 text-xs font-black flex items-center gap-2">
                ← QUAY LẠI DANH SÁCH
              </button>
              <div className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 border border-slate-100 shadow-sm space-y-8 md:space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                         selectedFeedback.status === FeedbackStatus.RESOLVED 
                         ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                         : 'bg-amber-50 text-amber-600 border-amber-100'
                       }`}>
                         {selectedFeedback.status === FeedbackStatus.RESOLVED ? 'Hoàn thành' : 'Chờ xác minh'}
                       </span>
                    </div>
                    <h2 className="text-xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{selectedFeedback.fullName}</h2>
                    <p className="text-slate-400 font-bold text-[11px] md:text-xs mt-1 md:mt-2">📞 {selectedFeedback.phoneNumber || 'Không có số'}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5 md:mb-1">Gửi lúc</p>
                    <p className="text-[11px] md:text-xs font-bold text-slate-600">{selectedFeedback.date} - {selectedFeedback.time}</p>
                  </div>
                </header>

                <div className="p-5 md:p-8 bg-slate-50 rounded-2xl md:rounded-3xl border border-slate-100">
                  <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1 h-3 md:h-4 bg-blue-600 rounded-full"></span> Nội dung
                  </h4>
                  <p className="text-slate-700 font-medium leading-relaxed text-base md:text-lg italic">"{selectedFeedback.content}"</p>
                  
                  {selectedFeedback.images.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {selectedFeedback.images.map((img, i) => (
                        <img key={i} src={img} className="w-20 h-20 md:w-32 md:h-32 object-cover rounded-xl border-2 border-white shadow-sm" alt="evidence" />
                      ))}
                    </div>
                  )}
                </div>

                {selectedFeedback.adminReply ? (
                  <div className="p-5 md:p-8 bg-emerald-50 rounded-2xl md:rounded-3xl border border-emerald-100">
                    <h4 className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-3">Phản hồi của Bệnh viện</h4>
                    <p className="text-emerald-900 font-semibold text-base md:text-lg leading-relaxed">{selectedFeedback.adminReply}</p>
                    <p className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-emerald-200/50 text-[9px] font-bold text-emerald-600/60 uppercase">{selectedFeedback.repliedAt}</p>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Soạn thảo</h4>
                      <button 
                        onClick={handleSuggest} 
                        disabled={isSuggesting}
                        className="text-[9px] md:text-[10px] font-black bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-blue-600"
                      >
                        {isSuggesting ? '...' : '✨ AI GỢI Ý'}
                      </button>
                    </div>
                    <textarea 
                      className="w-full p-5 md:p-8 bg-slate-50 border-none rounded-2xl md:rounded-3xl focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none min-h-[150px] md:min-h-[220px] transition-all text-slate-700 font-medium text-base md:text-lg"
                      placeholder="Viết phản hồi..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                    />
                    <button 
                      onClick={handleSendReply}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 md:py-5 px-6 md:px-8 rounded-2xl md:rounded-3xl shadow-xl transition-all flex items-center justify-center gap-3 text-xs md:text-sm uppercase tracking-widest"
                    >
                      Xác nhận phản hồi
                      <Icons.Send />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 p-10 text-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-slate-50">
                <Icons.ClipboardList />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Chọn một hồ sơ để xem chi tiết</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
