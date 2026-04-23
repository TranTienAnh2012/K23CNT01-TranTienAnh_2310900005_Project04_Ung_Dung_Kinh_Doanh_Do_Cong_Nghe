import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { voucherApi } from '../../../api/tta_api';

export default function NnhVoucherList() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res = await voucherApi.getAll();
      setVouchers(res.data.data.items || []);
    } catch (err) {
      console.error(err);
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa voucher này?")) return;
    try {
      await voucherApi.delete(id);
      fetchVouchers();
    } catch (err) {
      alert("Lỗi khi xóa");
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  if (loading) return (
    <div className="p-8 bg-slate-950 min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1280px] mx-auto font-['Inter'] bg-slate-950 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <nav className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 font-['Space_Grotesk']">
            <span>PROMOTIONS</span>
            <span className="material-symbols-outlined text-[12px]">chevron_right</span>
            <span className="text-blue-500">VOUCHERS</span>
          </nav>
          <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-white tracking-tight">Quản lý Voucher</h1>
          <p className="text-slate-500 mt-2 max-w-xl text-sm italic">Thiết lập các chương trình khuyến mãi và mã giảm giá cho khách hàng.</p>
        </div>
        <div>
          <Link to="/admin/voucher/them" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:translate-y-[-1px] transition-transform active:scale-95">
            <span className="material-symbols-outlined text-sm">add_card</span>
            TẠO VOUCHER MỚI
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vouchers.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-900/40 rounded-3xl border border-white/5">
            <span className="material-symbols-outlined text-5xl text-slate-700 mb-4">confirmation_number</span>
            <p className="text-slate-500 italic">Hiện tại chưa có mã giảm giá nào được tạo.</p>
          </div>
        ) : (
          vouchers.map((item) => (
            <div key={item.Id} className="bg-slate-900/60 backdrop-blur-md p-0 rounded-3xl border border-white/5 overflow-hidden group hover:border-blue-500/30 transition-all flex h-40">
              {/* Left Side: Discount Display */}
              <div className="w-32 bg-blue-600 flex flex-col items-center justify-center text-white relative">
                <div className="absolute top-0 bottom-0 -left-2 flex flex-col justify-around py-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-4 h-4 rounded-full bg-slate-950 -ml-2"></div>
                  ))}
                </div>
                <span className="text-2xl font-black font-['Space_Grotesk'] uppercase tracking-tighter">
                  {item.DiscountType === 'percent' ? `${item.DiscountValue}%` : `$${Math.floor(item.DiscountValue)}`}
                </span>
                <span className="text-[8px] font-bold tracking-[0.2em] uppercase mt-1">OFFER</span>
              </div>

              {/* Right Side: Details */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-white font-bold text-sm truncate max-w-[150px]">{item.Name}</h4>
                    <span className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase ${item.Status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                      {item.Status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-500 font-black font-['Space_Grotesk'] text-sm tracking-wider uppercase bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20">{item.Code}</span>
                    <button className="text-slate-500 hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-xs">content_copy</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    Min order: <b>${item.MinOrderValue}</b> • Max: <b>${item.MaxDiscount}</b>
                  </p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">EXPIRES</span>
                    <span className="text-[10px] text-slate-400 font-bold">{new Date(item.EndDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(item.Id)} className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 transition-all hover:text-white">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
