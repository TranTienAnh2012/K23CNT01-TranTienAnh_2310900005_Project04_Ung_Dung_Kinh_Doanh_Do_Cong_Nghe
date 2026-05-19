import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bannerApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhBannerList() {
  const isDark = useAdminTheme();

  // =========================================================================
  // LỚP 3 (FRONTEND): THỰC THI TẠI COMPONENT VÀ GẮN DỮ LIỆU LÊN GIAO DIỆN
  // Khai báo State để lưu trữ dữ liệu trả về từ API và trạng thái loading
  // =========================================================================
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      // Gọi API ở Lớp 2 (bannerApi) thay vì gọi trực tiếp axios
      const res = await bannerApi.getAll();
      // Nhận JSON từ Backend, lấy đúng cấu trúc res.data.data.items và lưu vào State
      setBanners(res.data.data.items || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu banner:", err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  // useEffect sẽ kích hoạt tự động 1 lần duy nhất khi màn hình này vừa được mở lên
  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa banner này?")) return;
    try {
      await bannerApi.delete(id);
      alert("Xóa banner thành công!");
      fetchBanners();
    } catch (err) {
      alert("Lỗi khi xóa banner: " + JSON.stringify(err.response?.data || err.message));
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Đang tải banner...</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] flex flex-col`}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className={`font-['Space_Grotesk'] text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} mb-2`}>Quản Lý Banner Động</h2>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-['Inter'] max-w-2xl`}>Cấu hình banner hiển thị linh hoạt theo từng danh mục sản phẩm, tối ưu hóa trải nghiệm khách hàng tại Zenith Ztore.</p>
          </div>
          <Link to="/admin/banner/them" className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-500 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Thêm Banner Mới
          </Link>
        </div>

        {/* Stats Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className={`${isDark ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-md p-6 rounded-2xl border`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Tổng Số Banner</span>
              <span className="material-symbols-outlined text-blue-500">view_carousel</span>
            </div>
            <div className={`text-4xl font-['Space_Grotesk'] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{banners.length}</div>
          </div>
          <div className={`${isDark ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'} backdrop-blur-md p-6 rounded-2xl border`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Trạng Thái Hoạt Động</span>
              <span className="material-symbols-outlined text-emerald-400">check_circle</span>
            </div>
            <div className={`text-4xl font-['Space_Grotesk'] font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {banners.filter(b => b.TrangThai === 1).length} Kích hoạt
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-900/40 to-slate-900/80 border border-blue-900/30 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md">
            <div className="relative z-10">
              <h4 className="text-sm font-bold text-white mb-1">Cơ Chế Banner Theo Danh Mục</h4>
              <p className="text-xs text-blue-200/70">Khi người dùng chọn danh mục ở trang chủ, banner sẽ tự động thay đổi tương ứng.</p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <span className="material-symbols-outlined text-[100px]">wallpaper</span>
            </div>
          </div>
        </div>

        {/* Banner Table Card */}
        <div className={`${isDark ? 'bg-slate-900/70 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-2xl overflow-hidden border shadow-2xl`}>
          <div className={`p-6 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'} flex flex-wrap items-center justify-between gap-4`}>
            <h3 className={`font-['Space_Grotesk'] text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
              <span className="material-symbols-outlined text-slate-400">image</span>
              Danh Sách Banner
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50/50 border-slate-100'}`}>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Hình Ảnh</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Thông Tin Banner</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Danh Mục Liên Kết</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500">Trạng Thái</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-slate-500 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {banners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                      Chưa có banner nào. Hãy bấm "Thêm Banner Mới" để bắt đầu.
                    </td>
                  </tr>
                ) : (
                  banners.map((item) => (
                    <tr key={item.BannerID} className={`${isDark ? 'hover:bg-blue-900/10' : 'hover:bg-blue-50/50'} transition-colors group`}>
                      <td className="px-6 py-4 w-48">
                        <div className="w-40 h-20 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                          {item.UrlAnh ? (
                            <img src={getImageUrl(item.UrlAnh)} alt={item.TieuDe} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-slate-600">broken_image</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'} text-sm`}>{item.TieuDe || '(Không tiêu đề)'}</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs truncate">{item.MoTa || '(Không mô tả)'}</p>
                        {item.LinkRedirect && (
                          <a href={item.LinkRedirect} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline block mt-1 truncate max-w-xs">
                            🔗 {item.LinkRedirect}
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {item.MaDanhMuc ? (
                          <div>
                            <span className={`px-2.5 py-1 rounded ${isDark ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-blue-50 text-blue-600'} text-xs font-bold`}>
                              {item.TenDanhMuc || `Danh mục #${item.MaDanhMuc}`}
                            </span>
                          </div>
                        ) : (
                          <span className={`px-2.5 py-1 rounded ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'} text-xs font-bold`}>
                            Mặc định (Tất cả)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-bold ${item.TrangThai === 1
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                          {item.TrangThai === 1 ? 'Hiển thị' : 'Đang ẩn'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/banner/edit/${item.BannerID}`} className="p-2 bg-slate-800 hover:bg-amber-500/20 text-slate-400 hover:text-amber-500 rounded-lg transition-all" title="Sửa">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </Link>
                          <button onClick={() => handleDelete(item.BannerID)} className="p-2 bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 rounded-lg transition-all" title="Xóa">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
