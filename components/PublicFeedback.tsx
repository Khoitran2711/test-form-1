
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
      <div className="max-w-xl mx-auto my-20 p-10 bg-white rounded-[32px] shadow-2xl shadow-blue-100/50 text-center border border-blue-50">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-500 animate-bounce">
          <Icons.CheckCircle />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Tiếp nhận thành công!</h2>
        <p className="text-slate-500 mb-10 leading-relaxed font-medium">
          Cảm ơn sự đóng góp của bạn. Ý kiến đã được chuyển đến Ban Giám đốc {HOSPITAL_NAME} để xác minh và xử lý.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200"
        >
          Gửi thêm ý kiến khác
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-slate-100">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar info */}
        <div className="md:w-1/3 bg-blue-600 p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-8 backdrop-blur-md">
              <Icons.Stethoscope />
            </div>
            <h3 className="text-2xl font-bold leading-tight mb-4">Chúng tôi luôn lắng nghe quý khách</h3>
            <p className="text-blue-100 text-sm font-medium leading-relaxed opacity-80">
              Mọi ý kiến đóng góp là động lực để Bệnh viện Đa khoa Ninh Thuận ngày càng nâng cao chất lượng phục vụ bệnh nhân.
            </p>
          </div>
          <div className="mt-12 text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">
            Hệ thống bảo mật & Ẩn danh
          </div>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="md:w-2/3 p-10 md:p-14 space-y-8 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Họ và Tên </label>
              <input required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-semibold outline-none" placeholder="Ví dụ: Nguyễn Văn A" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Số điện thoại</label>
              <input className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-semibold outline-none" placeholder="09xx xxx xxx" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Khoa / Phòng Bạn muốn đóng góp ý kiến</label>
            <select required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-semibold outline-none appearance-none" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
              <option value="">-- Chọn khoa --</option>
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nội dung ý kiến</label>
            <textarea required className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-semibold outline-none min-h-[150px] resize-none" placeholder="Quý khách vui lòng mô tả chi tiết sự việc..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          </div>

          <div className="space-y-4">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hình ảnh đính kèm (Nếu có)</label>
             <div className="flex flex-wrap gap-4">
               {images.map((img, i) => (
                 <div key={i} className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                   <img src={img} className="w-full h-full object-cover" />
                   <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">×</button>
                 </div>
               ))}
               {images.length < 2 && (
                 <label className="w-20 h-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all text-slate-400">
                    <Icons.ClipboardList />
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                 </label>
               )}
             </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 px-8 rounded-[24px] shadow-2xl transition-all flex items-center justify-center gap-3 group">
            <span>GỬI Ý KIẾN CỦA BẠN</span>
            <Icons.Send />
          </button>
        </form>
      </div>
    </div>
  );
};
