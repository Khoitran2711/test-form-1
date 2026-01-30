
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
      <div className="w-full max-w-2xl bg-white p-12 rounded-[30px] shadow-xl text-center border-t-8 border-emerald-500 animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icons.CheckCircle />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Gửi phản ánh thành công!</h2>
        <p className="text-slate-600 mb-8">Chúng tôi sẽ sớm xem xét và phản hồi ý kiến của quý khách.</p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all uppercase text-xs tracking-widest"
        >
          Gửi góp ý mới
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[30px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row">
      {/* Sidebar hướng dẫn */}
      <div className="md:w-1/3 bg-blue-600 p-10 text-white">
        <h3 className="text-2xl font-bold mb-6">Hướng dẫn</h3>
        <p className="text-blue-50 text-sm leading-relaxed mb-8">
          Quý khách vui lòng điền đầy đủ thông tin để bệnh viện có thể phản hồi chính xác nhất. Mọi thông tin cá nhân đều được bảo mật tuyệt đối.
        </p>
        <ul className="space-y-6">
          <li className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Icons.CheckCircle /></div>
            <span className="text-xs font-bold uppercase">Bảo mật thông tin</span>
          </li>
          <li className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Icons.Clock /></div>
            <span className="text-xs font-bold uppercase">Xử lý nhanh chóng</span>
          </li>
        </ul>
      </div>

      {/* Form phản ánh */}
      <form onSubmit={handleSubmit} className="md:w-2/3 p-8 md:p-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">Họ tên người bệnh</label>
            <input 
              required 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
              placeholder="Nguyễn Văn A" 
              value={formData.fullName} 
              onChange={e => setFormData({...formData, fullName: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase px-1">Số điện thoại</label>
            <input 
              type="tel" 
              required
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all" 
              placeholder="09xx xxx xxx" 
              value={formData.phoneNumber} 
              onChange={e => setFormData({...formData, phoneNumber: e.target.value})} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase px-1">Khoa / Phòng có phản ánh</label>
          <select 
            required 
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer" 
            value={formData.department} 
            onChange={e => setFormData({...formData, department: e.target.value})}
          >
            <option value="">-- Chọn khoa phòng --</option>
            {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase px-1">Nội dung phản ánh</label>
          <textarea 
            required 
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all min-h-[150px]" 
            placeholder="Mô tả chi tiết sự việc..." 
            value={formData.content} 
            onChange={e => setFormData({...formData, content: e.target.value})} 
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase px-1">Hình ảnh đính kèm (nếu có)</label>
          <div className="flex gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md">
                <img src={img} className="w-full h-full object-cover" alt="feedback" />
                <button 
                  type="button" 
                  onClick={() => setImages(images.filter((_, idx) => idx !== i))} 
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < 2 && (
              <label className="w-24 h-24 bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 transition-all text-slate-400">
                <Icons.ClipboardList />
                <span className="text-[10px] font-bold mt-2 uppercase tracking-tight">Thêm ảnh</span>
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </label>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          Gửi phản ánh chính thức
          <Icons.Send />
        </button>
      </form>
    </div>
  );
};
