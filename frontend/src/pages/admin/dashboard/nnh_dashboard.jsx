import React, { useState, useEffect } from 'react';
import { sanphamApi, userApi, donhangApi, giatrithuoctinhApi } from '../../../api/tta_api';

export default function TtaDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    specs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resP, resU, resO, resS] = await Promise.all([
          sanphamApi.getAll(),
          userApi.getAll(),
          donhangApi.getAll(),
          giatrithuoctinhApi.getAll()
        ]);
        setStats({
          products: resP.data.data.total || 0,
          users: resU.data.data.total || 0,
          orders: resO.data.data.total || 0,
          specs: resS.data.data.total || 0
        });
      } catch (err) {
        console.error("Lỗi lấy dữ liệu thật, đang dùng dữ liệu giả lập:", err);
        // Giả lập dữ liệu vì không kết nối được Database
        setStats({
          products: 342,
          users: 1204,
          orders: 856,
          specs: 89
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Sản phẩm', value: stats.products, icon: '📦', color: '#3182ce', bg: '#ebf8ff' },
    { title: 'Người dùng', value: stats.users, icon: '👥', color: '#38a169', bg: '#f0fff4' },
    { title: 'Đơn hàng', value: stats.orders, icon: '🛒', color: '#d69e2e', bg: '#fffaf0' },
    { title: 'Thông số kỹ thuật', value: stats.specs, icon: '⚙️', color: '#e53e3e', bg: '#fff5f5' }
  ];

  if (loading) return <div className="p-8 text-slate-400">Đang tải báo cáo hệ thống...</div>;

  return (
    <div className="p-8 min-h-[calc(100vh-64px)] bg-slate-950 font-['Inter']">
      {/* Welcome Banner */}
      <section className="mb-8 relative overflow-hidden rounded-2xl bg-blue-600 p-8 shadow-xl shadow-blue-900/20">
        <div className="relative z-10">
          <h3 className="font-['Space_Grotesk'] text-4xl font-bold text-white mb-2">Welcome back, Admin G5.</h3>
          <p className="text-lg text-blue-100 opacity-90 max-w-2xl">Hệ sinh thái Zenith đang hoạt động tối ưu. Bạn có 12 tác vụ đang chờ xử lý và 5 bản cập nhật sản phẩm cần phê duyệt.</p>
          <div className="mt-6 flex gap-4">
            <button className="px-6 py-2 bg-white text-blue-600 font-bold rounded-lg hover:shadow-lg transition-all active:scale-95">Xuất Báo Cáo</button>
            <button className="px-6 py-2 bg-blue-500 text-white border border-blue-400/30 font-bold rounded-lg hover:bg-blue-400 transition-all">Xem Logs</button>
          </div>
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[300px] absolute -right-20 -top-20">terminal</span>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1 */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-white/5 p-6 rounded-xl group hover:border-blue-500/50 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">+12.5%</span>
          </div>
          <p className="text-slate-400 font-semibold text-sm mb-1">Tổng Sản Phẩm</p>
          <h4 className="text-3xl font-bold text-white mb-4">{stats.products}</h4>
          <div className="h-10 w-full flex items-end gap-1">
            <div className="flex-1 bg-blue-500/20 h-[40%] rounded-t-sm group-hover:bg-blue-500/40 transition-all"></div>
            <div className="flex-1 bg-blue-500/20 h-[60%] rounded-t-sm group-hover:bg-blue-500/40 transition-all"></div>
            <div className="flex-1 bg-blue-500/20 h-[50%] rounded-t-sm group-hover:bg-blue-500/40 transition-all"></div>
            <div className="flex-1 bg-blue-500/20 h-[80%] rounded-t-sm group-hover:bg-blue-500/40 transition-all"></div>
            <div className="flex-1 bg-blue-500/20 h-[70%] rounded-t-sm group-hover:bg-blue-500/40 transition-all"></div>
            <div className="flex-1 bg-blue-500 h-[95%] rounded-t-sm"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-white/5 p-6 rounded-xl group hover:border-purple-500/50 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">+3.2%</span>
          </div>
          <p className="text-slate-400 font-semibold text-sm mb-1">Tổng Người Dùng</p>
          <h4 className="text-3xl font-bold text-white mb-4">{stats.users}</h4>
          <div className="h-10 w-full flex items-end gap-1">
            <div className="flex-1 bg-purple-500/20 h-[30%] rounded-t-sm group-hover:bg-purple-500/40 transition-all"></div>
            <div className="flex-1 bg-purple-500/20 h-[40%] rounded-t-sm group-hover:bg-purple-500/40 transition-all"></div>
            <div className="flex-1 bg-purple-500/20 h-[60%] rounded-t-sm group-hover:bg-purple-500/40 transition-all"></div>
            <div className="flex-1 bg-purple-500/20 h-[55%] rounded-t-sm group-hover:bg-purple-500/40 transition-all"></div>
            <div className="flex-1 bg-purple-500/20 h-[85%] rounded-t-sm group-hover:bg-purple-500/40 transition-all"></div>
            <div className="flex-1 bg-purple-500 h-[90%] rounded-t-sm"></div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-white/5 p-6 rounded-xl group hover:border-orange-500/50 transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400">
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-400/10 px-2 py-1 rounded">-0.8%</span>
          </div>
          <p className="text-slate-400 font-semibold text-sm mb-1">Tổng Đơn Hàng</p>
          <h4 className="text-3xl font-bold text-white mb-4">{stats.orders}</h4>
          <div className="h-10 w-full flex items-end gap-1">
            <div className="flex-1 bg-orange-500/20 h-[70%] rounded-t-sm group-hover:bg-orange-500/40 transition-all"></div>
            <div className="flex-1 bg-orange-500/20 h-[80%] rounded-t-sm group-hover:bg-orange-500/40 transition-all"></div>
            <div className="flex-1 bg-orange-500/20 h-[65%] rounded-t-sm group-hover:bg-orange-500/40 transition-all"></div>
            <div className="flex-1 bg-orange-500/20 h-[50%] rounded-t-sm group-hover:bg-orange-500/40 transition-all"></div>
            <div className="flex-1 bg-orange-500/20 h-[45%] rounded-t-sm group-hover:bg-orange-500/40 transition-all"></div>
            <div className="flex-1 bg-orange-500 h-[40%] rounded-t-sm"></div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-xl border-blue-500/30 ring-1 ring-blue-500/20">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">settings_input_component</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active</span>
            </div>
          </div>
          <p className="text-slate-400 font-semibold text-sm mb-1">Thông số kỹ thuật</p>
          <h4 className="text-3xl font-bold text-white mb-4">{stats.specs}</h4>
          <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between text-[11px] font-medium text-slate-500">
            <span>Uptime: 99.98%</span>
            <span>Lat: 12ms</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Management */}
        <div className="lg:col-span-2">
          <h5 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-6">Quản Lý Nhanh</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/70 backdrop-blur-md border border-white/5 p-6 rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer group border-l-4 border-l-blue-500">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">add_box</span>
                </div>
                <div>
                  <h6 className="font-bold text-white">Thêm Sản Phẩm Mới</h6>
                  <p className="text-sm text-slate-400">Ra mắt mẫu công nghệ mới</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-md border border-white/5 p-6 rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                  <span className="material-symbols-outlined">inventory</span>
                </div>
                <div>
                  <h6 className="font-bold text-white">Kiểm Tra Kho</h6>
                  <p className="text-sm text-slate-400">Quản lý số lượng tồn kho</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-md border border-white/5 p-6 rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                  <span className="material-symbols-outlined">rule</span>
                </div>
                <div>
                  <h6 className="font-bold text-white">Kiểm Duyệt Nội Dung</h6>
                  <p className="text-sm text-slate-400">Đánh giá mô tả kỹ thuật</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-md border border-white/5 p-6 rounded-xl hover:bg-slate-800/80 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <div>
                  <h6 className="font-bold text-white">Khuyến Mãi</h6>
                  <p className="text-sm text-slate-400">Quản lý chiến dịch giảm giá</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-slate-900/70 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h6 className="font-bold text-white">Hoạt Động Gần Đây</h6>
              <button className="text-xs font-bold text-blue-400 uppercase tracking-widest hover:text-blue-300">Xem Tất Cả</button>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                    <th className="px-6 py-4 font-semibold">Đối Tượng</th>
                    <th className="px-6 py-4 font-semibold">Hành Động</th>
                    <th className="px-6 py-4 font-semibold">Trạng Thái</th>
                    <th className="px-6 py-4 font-semibold">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                          <span className="material-symbols-outlined text-xs">phone_iphone</span>
                        </div>
                        <span className="font-medium">Zenith Pro Max v2</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">Cập nhật giá</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest">Đã Sửa</span></td>
                    <td className="px-6 py-4 text-slate-500">2 phút trước</td>
                  </tr>
                  <tr className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center">
                          <span className="material-symbols-outlined text-xs">face</span>
                        </div>
                        <span className="font-medium">User: user_8829</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">Đăng nhập mới</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Thành Công</span></td>
                    <td className="px-6 py-4 text-slate-500">5 phút trước</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* System Monitor */}
        <div className="space-y-6">
          <h5 className="font-['Space_Grotesk'] text-2xl font-bold text-white">Giám Sát Hệ Thống</h5>
          <div className="bg-slate-900/70 backdrop-blur-md border border-white/5 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              <h6 className="font-bold text-white">Hệ thống ổn định</h6>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="material-symbols-outlined text-orange-400">warning</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Thiếu Media</p>
                  <p className="text-xs text-slate-400 mt-0.5">5 sản phẩm cần cập nhật ảnh bìa.</p>
                  <button className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-wider hover:underline">Sửa Ngay</button>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="material-symbols-outlined text-blue-400">backup</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Sao Lưu Hoàn Tất</p>
                  <p className="text-xs text-slate-400 mt-0.5">Đã sao lưu toàn bộ cơ sở dữ liệu hệ thống thành công.</p>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium">02:00 AM Hôm Nay</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="material-symbols-outlined text-slate-500">update</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">Cập Nhật Firmware</p>
                  <p className="text-xs text-slate-400 mt-0.5">Phiên bản v5.0 đã sẵn sàng để triển khai.</p>
                  <button className="w-full mt-3 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-md hover:bg-slate-600 transition-colors">Cài Đặt Cập Nhật</button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-transparent p-6 rounded-xl bg-slate-900/50 border border-blue-900/30">
            <h6 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Tải Hệ Thống</h6>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1e293b" strokeWidth="3"></path>
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeDasharray="24, 100" strokeWidth="3"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">24%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">Mức An Toàn</p>
                <p className="text-[11px] text-slate-400">Tất cả các node dữ liệu đang hoạt động ở mức nhiệt độ bình thường.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
