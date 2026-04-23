import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { chitietApi } from '../../../api/tta_api';

export default function TtaChiTietDonHangList() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDetails = async (query = '') => {
    setLoading(true);
    try {
      const res = await chitietApi.getAll({ q: query });
      setData(res.data.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      setData({ total: 0, items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDetails(search);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <div className="p-8 text-slate-400">Đang tải chi tiết đơn hàng...</div>;

  return (
    <div className="p-8 min-h-[calc(100vh-64px)] bg-slate-950 font-['Inter'] space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Transaction View</span>
            <div className="px-2 py-0.5 rounded text-[10px] bg-blue-600 text-white font-bold uppercase">Live Data</div>
          </div>
          <h3 className="font-['Space_Grotesk'] text-white text-4xl font-bold">Quản Lý Chi Tiết</h3>
          <p className="text-slate-500 font-medium italic">Viewing all granular item breakdowns across the system.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-700 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all text-white active:scale-95">
            <span className="material-symbols-outlined text-sm">print</span>
            XUẤT PDF
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">sync</span>
            CẬP NHẬT TRẠNG THÁI
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Trạng Thái Đơn</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"></span>
            <span className="text-white font-['Space_Grotesk'] text-xl font-bold">Đang Giao</span>
          </div>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Tổng Thanh Toán</p>
          <span className="text-white font-['Space_Grotesk'] text-xl font-bold">{formatPrice(42500000)}</span>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Phương Thức</p>
          <div className="flex items-center gap-2 text-white font-['Space_Grotesk'] text-xl font-bold">
            <span className="material-symbols-outlined text-blue-500">credit_card</span>
            Visa •••• 4242
          </div>
        </div>
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Khu Vực</p>
          <span className="text-white font-['Space_Grotesk'] text-xl font-bold">TP. Hồ Chí Minh</span>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-6 py-5 text-slate-500 uppercase tracking-widest text-[10px] font-bold">Mã CT</th>
                <th className="px-6 py-5 text-slate-500 uppercase tracking-widest text-[10px] font-bold">ĐƠN HÀNG</th>
                <th className="px-6 py-5 text-slate-500 uppercase tracking-widest text-[10px] font-bold">SẢN PHẨM</th>
                <th className="px-6 py-5 text-slate-500 uppercase tracking-widest text-[10px] font-bold">NGƯỜI NHẬN</th>
                <th className="px-6 py-5 text-slate-500 uppercase tracking-widest text-[10px] font-bold">NGÀY ĐẶT</th>
                <th className="px-6 py-5 text-slate-500 uppercase tracking-widest text-[10px] font-bold text-center">SỐ LƯỢNG</th>
                <th className="px-6 py-5 text-slate-500 uppercase tracking-widest text-[10px] font-bold text-right">THÀNH TIỀN</th>
                <th className="px-6 py-5 text-slate-500 uppercase tracking-widest text-[10px] font-bold text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {data.items.map((item) => (
                <tr key={item.MaChiTiet} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-6 font-mono text-xs text-blue-500 font-bold">#{item.MaChiTiet}</td>
                  <td className="px-6 py-6 font-bold text-white text-sm">#{item.MaDonHang}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-700">
                        <img src={item.HinhAnh} alt={item.TenSanPham} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">{item.TenSanPham}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-medium">{item.BienThe || 'Original'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-white font-bold text-sm">{item.HoTenNguoiNhan}</span>
                      <span className="text-[10px] text-slate-500">{item.Email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm text-slate-400 font-medium">{new Date(item.NgayDatHang).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-6 text-center font-bold text-white font-['Space_Grotesk']">{item.SoLuong.toString().padStart(2, '0')}</td>
                  <td className="px-6 py-6 text-right font-bold text-white font-['Space_Grotesk']">{formatPrice(item.SoLuong * item.DonGia)}</td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Link to={`/admin/chi-tiet/view/${item.MaChiTiet}`} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                      </Link>
                      <Link to={`/admin/chi-tiet/edit/${item.MaChiTiet}`} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 bg-slate-950/40 flex justify-between items-center border-t border-slate-800">
          <p className="text-sm text-slate-500 italic">Hiển thị <span className="text-white font-bold">{data.items.length}</span> danh mục hàng cho giao dịch này</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-700 text-slate-500 opacity-50 cursor-not-allowed">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm shadow-lg shadow-blue-600/20">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-700 text-slate-400 hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 space-y-6">
          <h4 className="font-['Space_Grotesk'] text-white text-xl font-bold">Thông Tin Giao Hàng</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Địa Chỉ Nhận Hàng</p>
                <p className="text-white font-medium">123 Đường Công Nghệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh, Việt Nam</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Số Điện Thoại</p>
                <p className="text-white font-medium">+84 901 234 567</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Ghi Chú</p>
                <p className="text-slate-400 font-medium italic">"Giao hàng trong giờ hành chính. Vui lòng gọi trước khi đến 15 phút."</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1">Đơn Vị Vận Chuyển</p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-500">local_shipping</span>
                  <p className="text-white font-medium">Zenith Logistics Premium</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-600/5 backdrop-blur-md p-8 rounded-3xl border border-blue-500/20 space-y-6">
          <h4 className="font-['Space_Grotesk'] text-white text-xl font-bold">Tóm Tắt Đơn Hàng</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-slate-400 text-sm">
              <span>Tạm tính (3 sản phẩm)</span>
              <span className="font-bold">{formatPrice(42500000)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-sm">
              <span>Phí vận chuyển</span>
              <span className="text-emerald-500 font-bold uppercase tracking-tight text-xs">Miễn phí</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-sm">
              <span>Thuế VAT (10%)</span>
              <span className="italic">Đã bao gồm</span>
            </div>
            <div className="h-[1px] bg-slate-800 my-4"></div>
            <div className="flex justify-between items-end">
              <span className="text-white font-bold text-sm">Tổng cộng</span>
              <div className="text-right">
                <p className="text-3xl font-black text-white font-['Space_Grotesk']">{formatPrice(42500000)}</p>
                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">Thanh toán hoàn tất</p>
              </div>
            </div>
          </div>
          <button className="w-full py-4 bg-white text-slate-950 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest active:scale-95 shadow-xl shadow-white/5">
            <span className="material-symbols-outlined text-sm">task_alt</span>
            Xác Nhận Hoàn Thành
          </button>
        </div>
      </div>
    </div>
  );
}
