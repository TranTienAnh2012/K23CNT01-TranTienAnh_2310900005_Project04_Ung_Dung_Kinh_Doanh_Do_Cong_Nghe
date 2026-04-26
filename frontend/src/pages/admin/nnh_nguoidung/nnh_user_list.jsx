import React, { useState, useEffect } from 'react';
import { userApi } from '../../../api/tta_api';

export default function TtaUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll();
      setUsers(res.data.data.items);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu, dùng mock:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Đang tải người dùng...</div>;

  return (
    <div className="p-8 min-h-[calc(100vh-64px)] bg-slate-950 font-['Inter'] flex flex-col">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-['Space_Grotesk'] text-4xl font-bold text-white tracking-tight mb-2">Quản Lý Người Dùng</h2>
          <p className="text-slate-400 font-['Inter'] max-w-xl">Kiểm soát quyền truy cập và giám sát hoạt động của các tài khoản trên hệ thống.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-800 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 transition-colors">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Bộ lọc
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-800 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-900 transition-colors">
            <span class="material-symbols-outlined text-lg">download</span>
            Xuất CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl border border-white/5 flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40">
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">ID</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">Họ Tên</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">Email</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">Vai Trò</th>
                <th className="px-6 py-4 text-[11px] uppercase tracking-widest text-slate-500 font-bold">Ngày Đăng Ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {users.map((u) => (
                <tr key={u.MaNguoiDung} className="hover:bg-slate-900/30 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-400">
                    #{u.MaNguoiDung}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {u.avatar ? (
                        <img 
                          src={u.avatar} 
                          alt={u.HoTen} 
                          className="w-10 h-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-300 border border-slate-700" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-500 font-bold flex items-center justify-center border border-blue-500/20">
                          {u.HoTen.charAt(0)}
                        </div>
                      )}
                      <p className="text-sm font-bold text-slate-200">{u.HoTen}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {u.Email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border ${
                      u.VaiTro === 'admin' 
                        ? 'bg-blue-600/10 text-blue-400 border-blue-600/20' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {u.VaiTro === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400 font-medium">
                    {new Date(u.NgayDangKy).toLocaleDateString('vi-VN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-900/20">
          <p className="text-xs text-slate-500 font-medium">Hiển thị {users.length} người dùng</p>
          <div className="flex gap-2">
            <button className="p-2 border border-slate-800 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20">1</button>
            <button className="px-3 py-1 text-slate-400 hover:text-white transition-colors text-sm font-medium">2</button>
            <button className="p-2 border border-slate-800 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-xl flex items-center justify-between border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Phiên Đang Chạy</p>
            <h3 className="text-3xl font-bold text-white font-['Space_Grotesk']">0</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <span className="material-symbols-outlined text-[28px]">bolt</span>
          </div>
        </div>
        <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-xl flex items-center justify-between border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Tổng Khách Hàng</p>
            <h3 className="text-3xl font-bold text-white font-['Space_Grotesk']">{users.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <span className="material-symbols-outlined text-[28px]">group_add</span>
          </div>
        </div>
        <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-xl flex items-center justify-between border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Cảnh Báo Bảo Mật</p>
            <h3 className="text-3xl font-bold text-white font-['Space_Grotesk']">0</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
            <span className="material-symbols-outlined text-[28px]">security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
