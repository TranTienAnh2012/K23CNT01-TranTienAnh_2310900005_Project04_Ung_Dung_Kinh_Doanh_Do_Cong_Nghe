import React, { useState, useEffect } from 'react';
import { danhgiaApi } from '../../../api/tta_api';

export default function NnhDanhGiaList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await danhgiaApi.getAll();
      setReviews(res.data.data.items || []);
    } catch (err) {
      console.error(err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await danhgiaApi.delete(id);
      fetchReviews();
    } catch (err) {
      alert("Lỗi khi xóa đánh giá");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) return (
    <div className="p-8 bg-slate-950 min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1280px] mx-auto font-['Inter'] bg-slate-950 min-h-[calc(100vh-64px)]">
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 font-['Space_Grotesk']">
          <span>HỆ THỐNG</span>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-blue-500">ĐÁNH GIÁ KHÁCH HÀNG</span>
        </nav>
        <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-white tracking-tight">Quản lý Đánh giá</h1>
        <p className="text-slate-500 mt-2 max-w-xl text-sm italic">Xem và quản lý các phản hồi từ khách hàng về sản phẩm của Zenith Ztore.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-900/40 rounded-3xl border border-white/5">
            <span className="material-symbols-outlined text-5xl text-slate-700 mb-4">rate_review</span>
            <p className="text-slate-500 italic">Chưa có đánh giá nào từ khách hàng.</p>
          </div>
        ) : (
          reviews.map((item) => (
            <div key={item.MaDanhGia} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-blue-500 font-bold text-lg border border-white/5">
                    {item.HoTen ? item.HoTen[0].toUpperCase() : '?'}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">{item.HoTen}</h4>
                    <p className="text-[10px] text-slate-500 font-medium tracking-wider uppercase">{item.TenSanPham}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(item.MaDanhGia)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`material-symbols-outlined text-sm ${i < item.SoSao ? 'text-amber-400' : 'text-slate-700'}`} style={{ fontVariationSettings: i < item.SoSao ? "'FILL' 1" : "''" }}>
                    star
                  </span>
                ))}
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">"{item.BinhLuan}"</p>
              
              <div className="pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <span>{new Date(item.NgayDanhGia).toLocaleDateString('vi-VN')}</span>
                <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-400 border border-white/5">Hợp lệ</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
