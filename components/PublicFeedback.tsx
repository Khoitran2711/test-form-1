
import React, { useState } from 'react';
import { Icons, HOSPITAL_NAME, DEPARTMENTS } from '../constants';
import { Feedback, FeedbackStatus } from '../types';

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
      if (files.length + images.length > 2) {
        alert('Chỉ được chọn tối đa 2 ảnh!');
        return;
      }
      
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      images
    });
    setSubmitted(true);
    // Reset form after 5s or scrolling back
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        phoneNumber: '',
        department: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        content: '',
      });
      setImages([]);
    }, 5000);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-12 bg-white rounded-3xl shadow-2xl text-center border border-green-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
          <Icons.CheckCircle />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Gửi phản ánh thành công!</h2>
        <p className="text-slate-600 mb-8 text-lg">
          Cảm ơn quý khách đã tin tưởng và góp ý. Chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all"
        >
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
      {/* Visual Header */}
      <div className="bg-slate-900 px-8 py-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center bg-white w-14 h-14 rounded-2xl shadow-lg mb-6 text-blue-600">
            <Icons.Stethoscope />
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-extrabold uppercase tracking-tight leading-tight">
            Phản ánh chất lượng dịch vụ
          </h1>
          <p className="text-slate-400 mt-3 font-medium text-lg uppercase tracking-widest text-sm">
            {HOSPITAL_NAME}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Họ và tên <span className="text-red-500">*</span></label>
            <input 
              required
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Nhập họ và tên đầy đủ"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Số điện thoại</label>
            <input 
              type="tel"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Nhập số điện thoại (tùy chọn)"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Khoa điều trị <span className="text-red-500">*</span></label>
          <select 
            required
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all appearance-none"
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
          >
            <option value="">-- Chọn khoa --</option>
            {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Ngày phản ánh <span className="text-red-500">*</span></label>
            <input 
              required
              type="date"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Giờ phản ánh <span className="text-red-500">*</span></label>
            <input 
              required
              type="time"
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
              value={formData.time}
              onChange={(e) => setFormData({...formData, time: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Nội dung phản ánh <span className="text-red-500">*</span></label>
          <textarea 
            required
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all min-h-[160px] resize-none"
            placeholder="Mô tả chi tiết sự việc, thái độ phục vụ hoặc vấn đề bạn gặp phải..."
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Hình ảnh minh chứng (Tối đa 2 ảnh)</label>
          <div className="mt-2 flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer relative">
            <input 
              type="file" 
              accept="image/*"
              multiple
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <div className="text-center">
              <div className="bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Icons.ClipboardList />
              </div>
              <p className="text-slate-600 font-medium">Kéo thả hoặc nhấn để chọn ảnh</p>
              <p className="text-slate-400 text-xs mt-1">Hỗ trợ JPG, PNG (Dưới 5MB)</p>
            </div>
          </div>
          {images.length > 0 && (
            <div className="flex gap-4 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group w-20 h-20">
                  <img src={img} className="w-full h-full object-cover rounded-lg border border-slate-200" alt="Evidence" />
                  <button 
                    type="button"
                    onClick={() => setImages(images.filter((_, i) => i !== idx))}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-2xl shadow-xl shadow-blue-200 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-lg"
        >
          <Icons.Send />
          GỬI PHẢN ÁNH CHÍNH THỨC
        </button>
      </form>
    </div>
  );
};
