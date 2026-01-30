
import React, { useState } from 'react';
import { Icons, HOSPITAL_NAME, DEPARTMENTS } from '../constants';
import { Feedback } from '../types';

interface PublicFeedbackProps {
  onSubmit: (feedback: Omit<Feedback, 'id' | 'status' | 'createdAt'>) => void;
}

export const PublicFeedback: React.FC<PublicFeedbackProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    department: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    content: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => setImages(prev => [...prev, reader.result as string].slice(0, 2));
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, images });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto my-6 p-8 md:p-12 bg-white/95 backdrop-blur-xl rounded-[32px] md:rounded-[40px] shadow-2xl shadow-blue-900/10 text-center border border-white">
        <div className="w-16 h-16 md:w-24 md:h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 text-emerald-500 animate-bounce shadow-inner">
          <Icons.CheckCircle />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 md:mb-4 tracking-tight">Tiếp nhận thành công!</h2>
        <p className="text-sm md:text-base text-slate-500 mb-8 md:mb-10 leading-relaxed font-medium px-2">
          Cảm ơn sự đóng góp của bạn. Ý kiến đã được chuyển đến Ban Giám đốc {HOSPITAL_NAME} để xác minh và xử lý.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 md:py-5 rounded-2xl md:rounded-3xl transition-all shadow-xl shadow-blue-200"
        >
          Gửi thêm ý kiến khác
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mb-12 bg-white/90 backdrop-blur-xl rounded-[32px] md:rounded-[48px] shadow-2xl shadow-slate-900/10 overflow-hidden border border-white/50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar info - stacks on top on mobile */}
        <div className="md:w-[35%] bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 md:-mr-16 md:-mt-16 w-48 h-48 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6 md:mb-10 backdrop-blur-md shadow-lg">
              <Icons.Stethoscope />
            </div>
            <h3 className="text-xl md:text-2xl font-bold leading-tight mb-4 md:mb-6">Chúng tôi luôn lắng nghe quý khách</h3>
            <p className="text-blue-50 text-xs md:text-sm font-medium leading-relaxed opacity-90">
              Mọi ý kiến đóng góp là tài sản quý giá để Bệnh viện nâng cao chất lượng phục vụ nhân dân.
            </p>
          </div>
          <div className="hidden md:block mt-12 text-[9px] font-black uppercase tracking-[0.3em] opacity-50 bg-white/10 py-2 px-4 rounded-full w-fit">
            Bảo mật & Chính danh
          </div>
        </div>

        {/* Form area - more compact on mobile */}
        <form onSubmit={handleSubmit} className="md:w-[65%] p-6 md:p-14 space-y-6 md:space-y-8 bg-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Họ tên bệnh nhân</label>
              <input required className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-slate-100/50 border border-slate-200/50 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold outline-none placeholder:text-slate-300 text-sm md:text-base" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Số điện thoại</label>
              <input type="tel" className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-slate-100/50 border border-slate-200/50 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold outline-none placeholder:text-slate-300 text-sm md:text-base" placeholder="09xx xxx xxx" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Khoa / Phòng liên quan</label>
            <div className="relative">
              <select required className="w-full px-5 py-3.5 md:px-6 md:py-4.5 bg-slate-100/50 border border-slate-200/50 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold outline-none appearance-none cursor-pointer text-sm md:text-base" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                <option value="">-- Chọn khoa phòng --</option>
                {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <Icons.Clock />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nội dung phản ánh</label>
            <textarea required className="w-full px-5 py-4 md:px-6 md:py-5 bg-slate-100/50 border border-slate-200/50 rounded-2xl md:rounded-3xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all font-bold outline-none min-h-[120px] md:min-h-[160px] resize-none placeholder:text-slate-300 text-sm md:text-base" placeholder="Mô tả chi tiết sự việc..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          </div>

          <div className="space-y-3">
             <label className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Hình ảnh đính kèm</label>
             <div className="flex flex-wrap gap-3">
               {images.map((img, i) => (
                 <div key={i} className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-white shadow-lg">
                   <img src={img} className="w-full h-full object-cover" alt="feedback" />
                   <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-lg">×</button>
                 </div>
               ))}
               {images.length < 2 && (
                 <label className="w-20 h-20 md:w-24 md:h-24 bg-slate-100/50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-all text-slate-400 group">
                    <Icons.ClipboardList />
                    <span className="text-[7px] font-black mt-1.5 uppercase">Thêm ảnh</span>
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                 </label>
               )}
             </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 md:py-6 px-6 md:px-8 rounded-2xl md:rounded-[28px] shadow-xl transition-all flex items-center justify-center gap-3 md:gap-4 group active:scale-[0.98]">
            <span className="tracking-[0.1em] text-xs md:text-sm">GỬI PHẢN ÁNH NGAY</span>
            <Icons.Send />
          </button>
        </form>
      </div>
    </div>
  );
};
