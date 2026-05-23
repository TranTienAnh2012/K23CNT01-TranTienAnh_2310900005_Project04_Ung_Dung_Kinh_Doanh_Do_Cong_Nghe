import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { voucherApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhVoucherThem() {
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    Code: '',
    Description: '',
    DiscountType: 'fixed',
    DiscountValue: '',
    MinOrderValue: '',
    MaxDiscount: '',
    StartDate: '',
    EndDate: '',
    TotalQuantity: '',
    ApplyToAll: 1,
    Status: 'active'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await voucherApi.create(formData);
      navigate('/admin/voucher');
    } catch (err) {
      alert("Lỗi khi tạo voucher: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter']`}>
      <div className="max-w-[900px] mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h1 className={`font-['Space_Grotesk'] text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>Phát hành Voucher</h1>
          <p className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-sm font-medium italic`}>
            Thiết lập các chương trình khuyến mãi và mã giảm giá cho hệ thống Zenith Ztore.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-xl p-12 rounded-[3rem] border shadow-2xl space-y-10`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Tên & Mã */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Tên chương trình</label>
                <input 
                  name="Name" 
                  required 
                  value={formData.Name} 
                  onChange={handleChange} 
                  className={`w-full border rounded-[1.5rem] px-8 py-5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-700' : 'bg-slate-50 border-slate-100 text-slate-800 placeholder-slate-300'
                  }`} 
                  placeholder="VD: Khuyến mãi Hè 2024" 
                />
              </div>
              <div className="space-y-4">
                <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Mã voucher</label>
                <input 
                  name="Code" 
                  required 
                  value={formData.Code} 
                  onChange={handleChange} 
                  className={`w-full border rounded-[1.5rem] px-8 py-5 font-black text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all tracking-[0.2em] ${
                    isDark ? 'bg-slate-950 border-slate-800 text-blue-500 placeholder-slate-700' : 'bg-slate-50 border-slate-100 text-blue-600 placeholder-slate-300'
                  }`} 
                  placeholder="SUMMER24" 
                />
              </div>
            </div>

            {/* Loại & Giá trị */}
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Loại giảm giá</label>
              <div className="relative">
                <select 
                  name="DiscountType" 
                  value={formData.DiscountType} 
                  onChange={handleChange} 
                  className={`w-full border rounded-[1.5rem] px-8 py-5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
                  }`}
                >
                  <option value="fixed">Số tiền cố định ($)</option>
                  <option value="percent">Phần trăm (%)</option>
                </select>
                <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none">expand_more</span>
              </div>
            </div>
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Giá trị giảm</label>
              <input 
                name="DiscountValue" 
                type="number" 
                required 
                value={formData.DiscountValue} 
                onChange={handleChange} 
                className={`w-full border rounded-[1.5rem] px-8 py-5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`} 
                placeholder="0.00" 
              />
            </div>

            {/* Điều kiện */}
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Đơn tối thiểu ($)</label>
              <input 
                name="MinOrderValue" 
                type="number" 
                required 
                value={formData.MinOrderValue} 
                onChange={handleChange} 
                className={`w-full border rounded-[1.5rem] px-8 py-5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`} 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Giảm tối đa ($)</label>
              <input 
                name="MaxDiscount" 
                type="number" 
                value={formData.MaxDiscount} 
                onChange={handleChange} 
                className={`w-full border rounded-[1.5rem] px-8 py-5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`} 
                placeholder="Để trống nếu không giới hạn" 
              />
            </div>

            {/* Thời gian */}
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Ngày bắt đầu</label>
              <input 
                name="StartDate" 
                type="datetime-local" 
                required 
                value={formData.StartDate} 
                onChange={handleChange} 
                className={`w-full border rounded-[1.5rem] px-8 py-5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`} 
              />
            </div>
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Ngày kết thúc</label>
              <input 
                name="EndDate" 
                type="datetime-local" 
                required 
                value={formData.EndDate} 
                onChange={handleChange} 
                className={`w-full border rounded-[1.5rem] px-8 py-5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`} 
              />
            </div>

            {/* Số lượng */}
            <div className="space-y-4 col-span-full">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Tổng số lượng phát hành</label>
              <input 
                name="TotalQuantity" 
                type="number" 
                required 
                value={formData.TotalQuantity} 
                onChange={handleChange} 
                className={`w-full border rounded-[1.5rem] px-8 py-5 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`} 
                placeholder="100" 
              />
            </div>
          </div>

          <div className="pt-10 flex gap-6">
            <button 
              type="button" 
              onClick={() => navigate('/admin/voucher')} 
              className={`flex-1 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all border ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-white hover:text-slate-900'
              }`}
            >
              HỦY BỎ
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="flex-[2] bg-blue-600 text-white font-black py-5 rounded-[2rem] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 uppercase tracking-[0.2em] text-[10px] disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  ĐANG XỬ LÝ...
                </span>
              ) : 'PHÁT HÀNH VOUCHER'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
