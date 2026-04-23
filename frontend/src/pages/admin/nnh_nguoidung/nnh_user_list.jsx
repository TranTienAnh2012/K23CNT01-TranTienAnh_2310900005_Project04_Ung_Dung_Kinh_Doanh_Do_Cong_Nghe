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
      setUsers([
        { 
          MaNguoiDung: 1, 
          HoTen: 'Alex Montgomery', 
          Email: 'alex.m@ztore.com', 
          VaiTro: 'admin', 
          NgayDangKy: '2023-10-12T00:00:00Z',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAACbvb74wV4O61zpb4d38Mfc9ur1A9D-_Dat7VE4kw2YC0RJjttoxzFuNuk1leC2GOLHBZduALxskhSkmFCl_3yk1tgeWzaW7A6yQqkmMyCFvShtweIhl-uuZPbZH9Oo1mCeHd0OOUCZhjdMgaaET5ZaP9d637oQmIQOebf27n9WtJUE8zvMoN5kXZnE09rZtfefRlJ6IT78jBMvK6OfFCG1KQziZ3zJeAynjlflx3EkYC1d8BwS765Z5rtEwfNSIpUIS8239NKQ'
        },
        { 
          MaNguoiDung: 2, 
          HoTen: 'Sarah Jenkins', 
          Email: 's.jenkins@gmail.com', 
          VaiTro: 'user', 
          NgayDangKy: '2024-01-05T00:00:00Z',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdeib5H30y-AcaaL-Q2v4n58mL5jmeooY-XvZBca0eAy3Y0FzVp1sYCHd0RY-Fu99Fp_qF5pd1Chyr46ZmLrMQ_9nMNe4_V0KHox-mexHv5OcYAkbgOw-_LGJpp1Ows_6CHD1D9gDhTULpeepvYKgqWnCaV6AQj3szPqlvQk1rCZxz5N2lXSpdnEcVJnfJLLnJ2IgbhEovVg_bUNaxffR04fZBtCJUkX85Sn7GJHWNrnHufK2HFq4lelmR3z1HSqzyFOTc5ynUFw'
        },
        { 
          MaNguoiDung: 3, 
          HoTen: 'Marcus Thorne', 
          Email: 'm.thorne@outlook.com', 
          VaiTro: 'user', 
          NgayDangKy: '2023-11-28T00:00:00Z',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRk2H1ep6iAxLi8u-Jh8jHkRhcGS7D5zv4_FwqPkNwkWz4FqIw3XiwyWj9hoN1hjUOMTgWUly3l9buFSTRh7XusOQZtyyIKfu3HJoa_9HB6JJ5fD_cTtuficlkYP2G2wcLByNui7MjTBw3AP_xY4V5nzkfDJXBDJP_nkHM7EZOyXt02e8JEZEz9C72Gjd8gyHZvpggU0hWr6WlGja-Es4o6oGnA4ajB7l39HIkW9sAXPo9Gxb6JSH05EmT_kAzNn8KmHWeuIcE5Q'
        },
        { 
          MaNguoiDung: 4, 
          HoTen: 'Elena Rodriquez', 
          Email: 'e.rod@ztore.design', 
          VaiTro: 'admin', 
          NgayDangKy: '2024-02-14T00:00:00Z',
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA4j3yqrfoRcIIRDSbyJOyQG-g8-FVsOiVcuPdluNYgpScHaDM5xBR5RgFd-csmx6ZJB3Okd-er8twBnspZ-LvLaoHmHUx6Tzi1GI_rilikZL5e7_0CeasHFhrrRUHuf23i6dgvcZ8NuZ14w2jjGqxLB6KbA3n7Z1YcYWKGHIDb83SCgd_TOR5ihsgNcCAVR7Z_bMtV5uzLRjCJBEfmvAgJVSoSMrCRbHmJFDrN0VrbqubHMoTfv4-4Y-mVvQRqi0kwCRFbJetfSg'
        }
      ]);
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
            <h3 className="text-3xl font-bold text-white font-['Space_Grotesk']">482</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <span className="material-symbols-outlined text-[28px]">bolt</span>
          </div>
        </div>
        <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-xl flex items-center justify-between border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Tổng Khách Hàng</p>
            <h3 className="text-3xl font-bold text-white font-['Space_Grotesk']">8,912</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
            <span className="material-symbols-outlined text-[28px]">group_add</span>
          </div>
        </div>
        <div className="bg-slate-900/70 backdrop-blur-md p-6 rounded-xl flex items-center justify-between border border-white/5">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-slate-400 mb-1 font-bold">Cảnh Báo Bảo Mật</p>
            <h3 className="text-3xl font-bold text-white font-['Space_Grotesk']">03</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500">
            <span className="material-symbols-outlined text-[28px]">security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
