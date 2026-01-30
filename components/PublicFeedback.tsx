
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
      <div className="max-w-xl mx-auto my-12 p-10 bg-white/95 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-blue-900/10 text-center border border-white">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 animate-bounce shadow-inner">
          <Icons.CheckCircle />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-4 tracking-tight">Gửi thành công!</h2>
        <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium px-4">
          Cảm ơn bạn đã phản hồi. Chúng tôi đã tiếp nhận thông tin và sẽ sớm xử lý để cải thiện dịch vụ tại {HOSPITAL_NAME}.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 text-xs uppercase tracking-widest"
        >
          Gửi thêm góp ý khác
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mb-12 md:mb-16 bg-white/90 backdrop-blur-2xl rounded-[28px] md:rounded-[40px] shadow-2xl shadow-slate-900/5 overflow-hidden border border-white/60">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Thông tin - Thu gọn lại để nhường chỗ cho Form */}
        <div className="lg:w-[30%] bg-blue-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-8 backdrop-blur-md shadow-2xl">
              <Icons.Stethoscope />
            </div>
            <h3 className="text-xl font-bold leading-tight mb-4 tracking-tight">Sự hài lòng của bạn là ưu tiên hàng đầu</h3>
            <p className="text-blue-50 text-xs font-medium leading-relaxed opacity-90">
              Mọi đóng góp giúp Bệnh viện Đa khoa Ninh Thuận nâng cao tiêu chuẩn phục vụ và điều trị y tế.
            </p>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
             <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Phản ánh an toàn & Bảo mật</div>
          </div>
        </div>

        {/* Form chính - Tối ưu padding và font size */}
        <form onSubmit={handleSubmit} className="lg:w-[70%] p-6 md:p-12 space-y-8 bg-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Họ tên người phản ánh</label>
              <input required className="w-full px-5 py-4 bg-slate-100/40 border border-slate-200/40 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold outline-none placeholder:text-slate-300 text-sm" placeholder="Nguyễn Văn A" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Số điện thoại</label>
              <input type="tel" className="w-full px-5 py-4 bg-slate-100/40 border border-slate-200/40 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold outline-none placeholder:text-slate-300 text-sm" placeholder="09xx xxx xxx" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Khoa / Phòng liên quan</label>
            <div className="relative">
              <select required className="w-full px-5 py-4 bg-slate-100/40 border border-slate-200/40 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold outline-none appearance-none cursor-pointer text-sm" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                <option value="">-- Chọn khoa phòng --</option>
                {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <Icons.Clock />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nội dung phản ánh cụ thể</label>
            <textarea required className="w-full px-5 py-5 bg-slate-100/40 border border-slate-200/40 rounded-[20px] md:rounded-[28px] focus:ring-4 focus:ring-blue-500/10 focus:bg-white transition-all font-bold outline-none min-h-[140px] md:min-h-[180px] resize-none placeholder:text-slate-300 text-sm leading-relaxed" placeholder="Vui lòng mô tả chi tiết sự việc..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          </div>

          <div className="space-y-4">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Hình ảnh đính kèm (Tối đa 2)</label>
             <div className="flex flex-wrap gap-4">
               {images.map((img, i) => (
                 <div key={i} className="relative w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden border-2 border-white shadow-lg group">
                   <img src={img} className="w-full h-full object-cover" alt="feedback" />
                   <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-xl transition-colors">×</button>
                 </div>
               ))}
               {images.length < 2 && (
                 <label className="w-20 h-20 md:w-28 md:h-28 bg-slate-50/50 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all text-slate-400">
                    <Icons.ClipboardList />
                    <span className="text-[8px] font-black mt-2 uppercase tracking-widest text-slate-300">Tải ảnh</span>
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                 </label>
               )}
             </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 md:py-6 px-8 rounded-xl md:rounded-[32px] shadow-2xl transition-all flex items-center justify-center gap-4 group active:scale-[0.99]">
              <span className="tracking-[0.15em] text-xs md:text-sm uppercase">Gửi ý kiến phản ánh chính thức</span>
              <Icons.Send />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
