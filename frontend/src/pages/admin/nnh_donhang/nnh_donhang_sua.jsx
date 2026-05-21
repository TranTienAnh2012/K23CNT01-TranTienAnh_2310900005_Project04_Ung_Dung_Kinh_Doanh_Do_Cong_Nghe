import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../../../api/tta_axios';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function TtaDonHangSua() {
  const isDark = useAdminTheme();
  const { ma } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [resOrder, resItems] = await Promise.all([
          axios.get(`/api/tta_donhang/${ma}`),
          axios.get(`/api/tta_chitiet_donhang`, { params: { ma_don_hang: ma } })
        ]);
        setOrder(resOrder.data.data);
        setItems(resItems.data.data.items);
      } catch (err) {
        console.error("Lỗi tải dữ liệu đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ma]);

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await axios.put(`/api/tta_donhang/${ma}`, { TrangThai: newStatus });
      setOrder({ ...order, TrangThai: newStatus });
      alert("Cập nhật trạng thái thành công!");
    } catch (err) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className={`p-8 min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="font-bold tracking-widest text-xs uppercase">Đang nạp vận đơn...</p>
      </div>
    </div>
  );

  if (!order) return <div className="p-8 text-center text-rose-500 font-bold">Lỗi: Không tìm thấy đơn hàng #{ma}</div>;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Hoàn thành': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'Đã hủy': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'Đang giao': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Đã xác nhận': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter']`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'}`}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className={`font-['Space_Grotesk'] text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Đơn hàng #{order.MaDonHang}</h2>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${getStatusStyle(order.TrangThai)}`}>
                  {order.TrangThai}
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'} font-medium`}>Ngày đặt: {new Date(order.NgayDatHang).toLocaleString('vi-VN')}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className={`px-6 py-3 border ${isDark ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-600'} rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all active:scale-95`}>
              <span className="material-symbols-outlined text-sm">print</span>
              IN HÓA ĐƠN
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Left Column: Details & Items */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Order Items Table */}
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-3xl border overflow-hidden shadow-2xl`}>
              <div className={`px-8 py-5 border-b ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'} flex justify-between items-center`}>
                <h3 className="font-bold text-sm uppercase tracking-[0.2em] text-blue-500">Chi tiết mặt hàng</h3>
                <span className="text-[10px] font-black text-slate-500 uppercase">{items.length} SẢN PHẨM</span>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      <th className="px-8 py-4">Sản phẩm</th>
                      <th className="px-8 py-4 text-center">Số lượng</th>
                      <th className="px-8 py-4 text-right">Đơn giá</th>
                      <th className="px-8 py-4 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {items.map((item) => (
                      <tr key={item.Id} className="group transition-colors hover:bg-blue-600/5">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                              {getImageUrl(item.HinhAnh) ? (
                                <img src={getImageUrl(item.HinhAnh)} alt={item.TenSanPham} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              ) : (
                                <span className="material-symbols-outlined text-slate-400 text-2xl">image_not_supported</span>
                              )}
                            </div>
                            <div>
                              <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.TenSanPham}</p>
                              <p className="text-[10px] text-slate-500 mt-1">Mã SP: #{item.MaSanPham}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center font-bold text-sm">{item.SoLuong}</td>
                        <td className="px-8 py-5 text-right font-medium text-sm text-slate-400">{item.DonGia.toLocaleString('vi-VN')}₫</td>
                        <td className="px-8 py-5 text-right font-black text-sm text-blue-500">{item.ThanhTien.toLocaleString('vi-VN')}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={`p-8 flex justify-end ${isDark ? 'bg-slate-950/40' : 'bg-slate-50/50'}`}>
                <div className="w-full max-w-[240px] space-y-3">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Tạm tính:</span>
                    <span>{order.TongTien.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Phí vận chuyển:</span>
                    <span className="text-emerald-500 font-bold">Miễn phí</span>
                  </div>
                  <div className={`pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'} flex justify-between items-center`}>
                    <span className="font-bold text-sm">TỔNG CỘNG:</span>
                    <span className="text-xl font-black text-blue-600">{order.TongTien.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Note Card */}
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-amber-50 border-amber-100'} p-6 rounded-3xl border flex gap-4 items-start`}>
               <span className="material-symbols-outlined text-amber-500 text-3xl">sticky_note_2</span>
               <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-amber-600 mb-1">Ghi chú từ khách hàng</h4>
                  <p className={`text-sm italic ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{order.GhiChu || "Không có yêu cầu đặc biệt."}</p>
               </div>
            </div>
          </div>

          {/* Right Column: Customer & Actions */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            
            {/* Customer Info Card */}
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-3xl border p-8 shadow-2xl`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold">Thông tin người mua</h3>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Họ và tên</label>
                  <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{order.HoTenNguoiNhan}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Số điện thoại</label>
                  <p className={`font-bold text-sm text-blue-500 tracking-wider`}>{order.SoDienThoai}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Địa chỉ giao hàng</label>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{order.DiaChi}</p>
                </div>
              </div>
              
              <button className={`w-full mt-8 py-3 rounded-xl border ${isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-50 text-slate-600'} text-xs font-bold transition-all active:scale-95`}>
                XEM LỊCH SỬ MUA HÀNG
              </button>
            </div>

            {/* Quick Actions / Status Update */}
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xl'} rounded-3xl border p-8 space-y-6`}>
               <h3 className="font-['Space_Grotesk'] text-lg font-bold flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500">settings</span>
                  Xử lý vận đơn
               </h3>
               
               <div className="space-y-3">
                  {[
                    { val: 'Chờ xác nhận', label: 'Chờ xác nhận', icon: 'hourglass_empty' },
                    { val: 'Đã xác nhận', label: 'Xác nhận đơn hàng', icon: 'check_circle' },
                    { val: 'Đang giao', label: 'Bắt đầu giao hàng', icon: 'local_shipping' },
                    { val: 'Hoàn thành', label: 'Đánh dấu hoàn thành', icon: 'verified' },
                    { val: 'Đã hủy', label: 'Hủy bỏ đơn hàng', icon: 'cancel' },
                  ].map((st) => (
                    <button 
                      key={st.val}
                      onClick={() => handleUpdateStatus(st.val)}
                      disabled={updating || order.TrangThai === st.val}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        order.TrangThai === st.val 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' 
                        : `${isDark ? 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-600' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-slate-300'}`
                      } disabled:cursor-not-allowed`}
                    >
                      <span className={`material-symbols-outlined ${order.TrangThai === st.val ? 'text-white' : 'text-slate-500'}`}>{st.icon}</span>
                      <span className="text-xs font-bold flex-1">{st.label}</span>
                      {order.TrangThai === st.val && <span className="material-symbols-outlined text-sm">done_all</span>}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
