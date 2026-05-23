import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { shopApi } from '../../../api/tta_api';
import { useAuth } from '../../../context/AuthContext';

export default function NvtClientVoucher() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('public'); // 'public' | 'my-unused' | 'my-used'
  const [publicVouchers, setPublicVouchers] = useState([]);
  const [myVouchers, setMyVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      // Gọi API lấy voucher công khai (kèm cờ Claimed nếu đã đăng nhập)
      const resPublic = await shopApi.getPublicVouchers();
      if (resPublic.data?.data) {
        setPublicVouchers(resPublic.data.data);
      }

      // Nếu đã đăng nhập, lấy voucher cá nhân
      if (user) {
        const resMy = await shopApi.getMyVouchers();
        if (resMy.data?.data) {
          setMyVouchers(resMy.data.data);
        }
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách voucher:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [user]);

  const handleClaimVoucher = async (voucherId) => {
    if (!user) {
      alert("Vui lòng đăng nhập để nhận mã giảm giá.");
      navigate(`/login?redirect=/voucher`);
      return;
    }

    try {
      await shopApi.claimVoucher({ VoucherId: voucherId });
      alert("Nhận mã giảm giá thành công! Voucher đã được lưu vào ví của bạn.");
      fetchVouchers(); // Refresh dữ liệu
    } catch (err) {
      console.error("Lỗi nhận voucher:", err);
      alert(err.response?.data?.message || "Nhận mã giảm giá thất bại. Vui lòng thử lại.");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Vô thời hạn';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Lọc voucher của tôi theo trạng thái Unused / Used
  const unusedVouchers = myVouchers.filter(v => !v.IsUsed);
  const usedVouchers = myVouchers.filter(v => v.IsUsed);

  // Render thẻ Voucher dạng Ticket sang trọng
  const renderVoucherCard = (v, isMyVoucher = false) => {
    const isPercent = v.DiscountType === 'percent';
    const discountText = isPercent ? `Giảm ${v.DiscountValue}%` : `Giảm ${formatPrice(v.DiscountValue)}`;
    const isClaimed = v.Claimed;
    const isUsed = v.IsUsed;

    // Tính toán lượng còn lại cho thanh tiến trình
    const total = v.TotalQuantity || 1;
    const used = v.UsedQuantity || 0;
    const percentLeft = Math.max(0, Math.min(100, Math.round(((total - used) / total) * 100)));

    return (
      <div
        key={v.Id || v.VoucherId}
        className="group relative bg-white border border-purple-100 rounded-2xl flex shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden min-h-[120px]"
      >
        {/* Phần bo tròn khuyết bên trái (Ticket shape) */}
        <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-50 border-r border-purple-100 rounded-full z-10"></div>
        {/* Phần bo tròn khuyết bên phải (Ticket shape) */}
        <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-slate-50 border-l border-purple-100 rounded-full z-10"></div>

        {/* CỘT TRÁI: HIỂN THỊ ICON / GIÁ TRỊ GIẢM GIÁ */}
        <div className="w-1/3 bg-gradient-to-br from-purple-600 to-indigo-600 flex flex-col items-center justify-center text-white p-4 shrink-0 relative">
          <span className="material-symbols-outlined text-3xl mb-1 opacity-90 group-hover:scale-110 transition-transform">
            {isPercent ? 'percent' : 'confirmation_number'}
          </span>
          <span className="text-sm font-extrabold tracking-wide text-center">
            {isPercent ? `${v.DiscountValue}% OFF` : 'VND OFF'}
          </span>
          {/* Đường đứt nét dọc chia vé */}
          <div className="absolute right-0 top-0 bottom-0 border-r-2 border-dashed border-white/30 h-full"></div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN CHI TIẾT VÀ NÚT TÁC VỤ */}
        <div className="flex-1 p-4 md:p-5 flex flex-col justify-between min-w-0">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-block px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-black rounded uppercase tracking-wider">
                {v.Code}
              </span>
              {!isMyVoucher && v.TotalQuantity > 0 && (
                <span className="text-[10px] text-slate-400 font-bold">
                  Còn lại: {percentLeft}%
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-sm text-slate-800 truncate leading-snug">
              {v.Name || `Mã giảm giá ${v.Code}`}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Đơn tối thiểu {formatPrice(v.MinOrderValue)}
              {isPercent && v.MaxDiscount > 0 && ` (Tối đa ${formatPrice(v.MaxDiscount)})`}
            </p>
          </div>

          <div className="flex items-end justify-between gap-3 pt-2">
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                HSD: {formatDate(v.EndDate)}
              </p>
            </div>

            {/* NÚT TÁC VỤ */}
            <div>
              {isMyVoucher ? (
                isUsed ? (
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-4 py-1.5 rounded-xl block text-center select-none">
                    Đã dùng
                  </span>
                ) : (
                  <Link
                    to="/"
                    className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-xl block text-center shadow-md shadow-purple-200 transition-all hover:scale-[1.02]"
                  >
                    Dùng ngay
                  </Link>
                )
              ) : isClaimed ? (
                <span className="text-xs font-bold text-purple-400 bg-purple-50 px-4 py-1.5 rounded-xl block text-center select-none border border-purple-100">
                  Đã nhận
                </span>
              ) : (
                <button
                  onClick={() => handleClaimVoucher(v.Id)}
                  className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-1.5 rounded-xl block text-center shadow-md shadow-purple-200 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  Nhận mã
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 font-['Inter']">
      {/* Quay lại */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-purple-600 font-bold mb-6 transition-colors">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Quay lại trang chủ
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">Ví Voucher Ưu Đãi</h1>
          <p className="text-sm text-slate-500">
            Sử dụng mã giảm giá để nhận nhiều ưu đãi hấp dẫn khi mua sắm tại Zenith Ztore
          </p>
        </div>
      </div>

      {/* TABS CHỌN NHÓM VOUCHER */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('public')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border duration-300 cursor-pointer active:scale-95 ${
            activeTab === 'public'
              ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Nhận mã ưu đãi ({publicVouchers.length})
        </button>

        <button
          onClick={() => setActiveTab('my-unused')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border duration-300 cursor-pointer active:scale-95 ${
            activeTab === 'my-unused'
              ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Voucher chưa dùng ({user ? unusedVouchers.length : 0})
        </button>

        <button
          onClick={() => setActiveTab('my-used')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border duration-300 cursor-pointer active:scale-95 ${
            activeTab === 'my-used'
              ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Voucher đã dùng ({user ? usedVouchers.length : 0})
        </button>
      </div>

      {/* DANH SÁCH VOUCHER RENDER THEO TAB */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-100 rounded-2xl h-[120px] border border-slate-200/60" />
          ))}
        </div>
      ) : (
        <>
          {activeTab === 'public' && (
            publicVouchers.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-slate-50 rounded-3xl border border-dashed border-slate-200 max-w-lg mx-auto">
                <span className="material-symbols-outlined text-4xl text-slate-400">confirmation_number</span>
                <p className="text-slate-500 text-sm font-medium">Hiện tại không có chương trình khuyến mãi nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicVouchers.map(v => renderVoucherCard(v, false))}
              </div>
            )
          )}

          {activeTab === 'my-unused' && (
            !user ? (
              <div className="py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl max-w-lg mx-auto space-y-4">
                <span className="material-symbols-outlined text-3xl text-purple-600">lock</span>
                <p className="text-sm text-slate-500">Vui lòng đăng nhập để xem ví voucher của bạn.</p>
                <Link to="/login?redirect=/voucher" className="inline-block px-6 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-md">Đăng nhập</Link>
              </div>
            ) : unusedVouchers.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-slate-50 rounded-3xl border border-dashed border-slate-200 max-w-lg mx-auto">
                <span className="material-symbols-outlined text-4xl text-slate-400">inventory_2</span>
                <p className="text-slate-500 text-sm font-medium">Ví voucher trống. Hãy qua tab Nhận mã để săn ưu đãi nhé!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {unusedVouchers.map(v => renderVoucherCard(v, true))}
              </div>
            )
          )}

          {activeTab === 'my-used' && (
            !user ? (
              <div className="py-12 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl max-w-lg mx-auto space-y-4">
                <span className="material-symbols-outlined text-3xl text-purple-600">lock</span>
                <p className="text-sm text-slate-500">Vui lòng đăng nhập để xem ví voucher của bạn.</p>
                <Link to="/login?redirect=/voucher" className="inline-block px-6 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl shadow-md">Đăng nhập</Link>
              </div>
            ) : usedVouchers.length === 0 ? (
              <div className="py-16 text-center space-y-3 bg-slate-50 rounded-3xl border border-dashed border-slate-200 max-w-lg mx-auto">
                <span className="material-symbols-outlined text-4xl text-slate-400">history</span>
                <p className="text-slate-500 text-sm font-medium">Bạn chưa sử dụng mã giảm giá nào.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {usedVouchers.map(v => renderVoucherCard(v, true))}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
