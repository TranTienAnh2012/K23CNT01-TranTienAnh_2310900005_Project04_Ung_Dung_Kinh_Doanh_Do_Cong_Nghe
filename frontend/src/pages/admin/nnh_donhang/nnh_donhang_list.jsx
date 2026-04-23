import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { donhangApi } from '../../../api/tta_api';

export default function TtaDonHangList() {
  const [data, setData] = useState({ orders: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchOrders = async (query = '') => {
    setLoading(true);
    try {
      const res = await donhangApi.getAll({ q: query });
      setData(res.data.data);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      setData({ total: 0, orders: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(search);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  if (loading) return <div className="p-8 text-slate-400">Đang tải dữ liệu đơn hàng...</div>;

  return (
    <div className="p-8 min-h-[calc(100vh-64px)] bg-slate-950 font-['Inter']">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-9xl">local_mall</span>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <span className="material-symbols-outlined">shopping_bag</span>
            </div>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              +12%
            </span>
          </div>
          <h3 className="text-slate-500 text-[11px] uppercase tracking-wider font-bold mb-1">Tổng đơn hàng</h3>
          <p className="font-['Space_Grotesk'] text-white text-3xl font-bold">{data.total}</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-9xl">payments</span>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <span className="material-symbols-outlined">account_balance_wallet</span>
            </div>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              +8.4%
            </span>
          </div>
          <h3 className="text-slate-500 text-[11px] uppercase tracking-wider font-bold mb-1">Doanh thu ước tính</h3>
          <p className="font-['Space_Grotesk'] text-white text-3xl font-bold">{formatPrice(data.orders.reduce((sum, o) => sum + (o.TongTien || 0), 0))}</p>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-9xl">conveyor_belt</span>
          </div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <span className="text-xs font-medium text-slate-500 italic">Chờ xử lý</span>
          </div>
          <h3 className="text-slate-500 text-[11px] uppercase tracking-wider font-bold mb-1">Vận đơn chờ giao</h3>
          <p className="font-['Space_Grotesk'] text-white text-3xl font-bold">{data.orders.filter(o => o.TrangThai === 'pending' || o.TrangThai === 'Processing').length}</p>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <div className="px-8 py-6 border-b border-slate-800 flex flex-wrap justify-between items-center bg-slate-900/40 gap-4">
          <div>
            <h2 className="font-['Space_Grotesk'] text-white text-2xl font-bold">Danh sách đơn hàng</h2>
            <p className="text-slate-500 text-sm italic">Cập nhật lúc: 14:30 Hôm nay</p>
          </div>
          <div className="flex gap-3">
            <form className="relative" onSubmit={handleSearch}>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">search</span>
              <input 
                className="bg-slate-950 border-slate-800 rounded-full pl-10 pr-4 py-2 text-xs text-slate-300 w-64 focus:ring-1 focus:ring-blue-600 outline-none transition-all" 
                placeholder="Mã đơn, tên khách..." 
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <button className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Bộ lọc
            </button>
            <Link to="/admin/don-hang/them" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-2 hover:translate-y-[-1px] transition-transform shadow-lg shadow-blue-600/20 active:scale-95">
              <span className="material-symbols-outlined text-sm">add</span>
              Tạo đơn mới
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-950/60 text-slate-500 uppercase text-[10px] font-bold tracking-[0.2em]">
              <tr>
                <th className="px-8 py-4">Mã ĐH</th>
                <th className="px-8 py-4">Khách hàng</th>
                <th className="px-8 py-4">Tổng cộng</th>
                <th className="px-8 py-4">Ngày đặt</th>
                <th className="px-8 py-4 text-center">Trạng thái</th>
                <th className="px-8 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {data.orders.map((order) => (
                <tr key={order.MaDonHang} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-8 py-5">
                    <span className="font-mono text-blue-500 font-bold">#{order.MaDonHang}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {order.HoTenNguoiNhan.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{order.HoTenNguoiNhan}</div>
                        <div className="text-[10px] text-slate-500">{order.Email || order.SoDienThoai}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-['Space_Grotesk'] font-bold text-white">{formatPrice(order.TongTien)}</td>
                  <td className="px-8 py-5 text-sm text-slate-400 font-medium">{new Date(order.NgayDatHang).toLocaleDateString('vi-VN')}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      order.TrangThai === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      order.TrangThai === 'Processing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {order.TrangThai}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <Link to={`/admin/don-hang/edit/${order.MaDonHang}`} className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </Link>
                      <Link to={`/admin/don-hang/delete/${order.MaDonHang}`} className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-6 border-t border-slate-800 flex justify-between items-center bg-slate-950/20">
          <span className="text-xs text-slate-500 font-medium">Hiển thị {data.orders.length} của {data.total} kết quả</span>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-600/20">1</button>
            <button className="px-3 py-1 rounded-lg hover:bg-slate-800 text-slate-400 text-xs transition-colors">2</button>
            <button className="px-3 py-1 rounded-lg hover:bg-slate-800 text-slate-400 text-xs transition-colors">3</button>
            <span className="text-slate-600 self-center">...</span>
            <button className="p-2 rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status Floating Bar */}
      <div className="mt-12 p-4 bg-slate-900/60 backdrop-blur-md rounded-2xl flex items-center justify-between border border-slate-800/40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Máy chủ: Sydney-01</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-600 text-sm">cloud_done</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Đồng bộ: Hoạt động</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-600 font-mono tracking-tighter">ZENITH-OS-v2.4.0-STABLE</div>
      </div>
    </div>
  );
}
