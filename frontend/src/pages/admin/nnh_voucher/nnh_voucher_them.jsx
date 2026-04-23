import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { voucherApi } from '../../../api/tta_api';

export default function NnhVoucherThem() {
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
      alert("Tạo voucher thành công!");
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
    <div className="p-8 max-w-[800px] mx-auto font-['Inter'] bg-slate-950 min-h-[calc(100vh-64px)]">
      <div className="mb-10 text-center">
        <h1 className="font-['Space_Grotesk'] text-4xl font-black text-white tracking-tight mb-2">Phát hành Voucher Mới</h1>
        <p className="text-slate-500 text-sm">Điền đầy đủ các thông tin để tạo mã khuyến mãi cho hệ thống Zenith Ztore.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900/60 backdrop-blur-xl p-10 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tên & Mã */}
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">TÊN CHƯƠNG TRÌNH</label>
              <input name="Name" required value={formData.Name} onChange={handleChange} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder-slate-600" placeholder="VD: Khuyến mãi Hè 2024" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">MÃ VOUCHER</label>
              <input name="Code" required value={formData.Code} onChange={handleChange} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 font-mono tracking-widest outline-none transition-all placeholder-slate-600" placeholder="SUMMER24" />
            </div>
          </div>

          {/* Loại & Giá trị */}
          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">LOẠI GIẢM GIÁ</label>
            <select name="DiscountType" value={formData.DiscountType} onChange={handleChange} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none">
              <option value="fixed">Số tiền cố định ($)</option>
              <option value="percent">Phần trăm (%)</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">GIÁ TRỊ GIẢM</label>
            <input name="DiscountValue" type="number" required value={formData.DiscountValue} onChange={handleChange} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="0.00" />
          </div>

          {/* Điều kiện */}
          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">ĐƠN TỐI THIỂU ($)</label>
            <input name="MinOrderValue" type="number" required value={formData.MinOrderValue} onChange={handleChange} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="0.00" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">GIẢM TỐI ĐA ($)</label>
            <input name="MaxDiscount" type="number" value={formData.MaxDiscount} onChange={handleChange} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="Để trống nếu không giới hạn" />
          </div>

          {/* Thời gian */}
          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">NGÀY BẮT ĐẦU</label>
            <input name="StartDate" type="datetime-local" required value={formData.StartDate} onChange={handleChange} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">NGÀY KẾT THÚC</label>
            <input name="EndDate" type="datetime-local" required value={formData.EndDate} onChange={handleChange} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
          </div>

          {/* Số lượng */}
          <div className="space-y-3 col-span-full">
            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-1">TỔNG SỐ LƯỢNG PHÁT HÀNH</label>
            <input name="TotalQuantity" type="number" required value={formData.TotalQuantity} onChange={handleChange} className="w-full bg-slate-800/50 border border-white/5 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" placeholder="100" />
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button type="button" onClick={() => navigate('/admin/voucher')} className="flex-1 bg-slate-800 text-slate-400 font-bold py-4 rounded-2xl hover:bg-slate-700 transition-all uppercase tracking-widest text-xs">HỦY BỎ</button>
          <button type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs disabled:opacity-50">
            {loading ? 'ĐANG XỬ LÝ...' : 'PHÁT HÀNH VOUCHER'}
          </button>
        </div>
      </form>
    </div>
  );
}
