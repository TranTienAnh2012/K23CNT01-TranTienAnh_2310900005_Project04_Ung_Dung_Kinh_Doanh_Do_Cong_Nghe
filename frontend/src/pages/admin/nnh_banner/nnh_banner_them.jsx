import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bannerApi, danhmucApi, uploadApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhBannerThem() {
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
  };
  const [formData, setFormData] = useState({
    MaDanhMuc: '',
    TieuDe: '',
    MoTa: '',
    UrlAnh: '',
    LinkRedirect: '',
    TrangThai: 1,
    ViTri: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await danhmucApi.getAll();
        setCategories(res.data.data.items || []);
      } catch (err) {
        console.error("Lỗi lấy danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Hiển thị xem trước ảnh ngay lập tức
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Tải ảnh qua API upload chung của hệ thống
    setUploading(true);
    try {
      const res = await uploadApi.uploadImage(file);
      const uploadedUrl = res.data.data.url;
      setFormData(prev => ({ ...prev, UrlAnh: uploadedUrl }));
    } catch (err) {
      alert("Lỗi khi tải ảnh lên từ thiết bị!");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        MaDanhMuc: formData.MaDanhMuc ? parseInt(formData.MaDanhMuc) : null,
        ViTri: formData.ViTri ? parseInt(formData.ViTri) : null
      };
      await bannerApi.create(payload);
      alert("Thêm banner mới thành công!");
      navigate('/admin/banner');
    } catch (err) {
      const errMsg = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      alert("Lỗi khi thêm banner: " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] flex flex-col items-center justify-center`}>
      <div className={`w-full max-w-4xl ${isDark ? 'bg-slate-900/70 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-3xl overflow-hidden border shadow-2xl`}>
        <div className={`p-8 border-b ${isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'} flex items-center justify-between`}>
          <div>
            <h3 className={`font-['Space_Grotesk'] text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-3`}>
              <span className="material-symbols-outlined text-blue-500 text-3xl">add_photo_alternate</span>
              Thêm Banner Mới
            </h3>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'} mt-1`}>Tải lên hình ảnh từ ổ đĩa và gán cho các danh mục sản phẩm.</p>
          </div>
          <button onClick={() => navigate('/admin/banner')} className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600'} border flex items-center justify-center transition-colors`}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          {/* Cột trái: Tải ảnh & Trạng thái */}
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Hình Ảnh Banner</label>
              
              <div className="relative aspect-video w-full bg-slate-950 rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center overflow-hidden group">
                {(preview || formData.UrlAnh) ? (
                  <>
                    <img src={preview || getImageUrl(formData.UrlAnh)} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold text-sm shadow">Chọn ảnh khác</label>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <span className="material-symbols-outlined text-slate-600 text-4xl mb-2">cloud_upload</span>
                    <p className="text-xs text-slate-400 font-bold">Click để tải ảnh từ thiết bị</p>
                    <p className="text-[10px] text-slate-600 mt-1">Hỗ trợ mọi thư mục trên ổ đĩa</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] text-blue-400 font-bold animate-pulse">Đang tải ảnh lên...</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Hoặc đường dẫn ảnh (URL)</label>
                <input 
                  required
                  type="text"
                  className={`w-full px-3 py-2 rounded-lg border text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-slate-300 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-800'} outline-none transition-all`}
                  placeholder="URL hình ảnh sau khi tải..."
                  value={formData.UrlAnh}
                  onChange={e => {
                    setFormData({...formData, UrlAnh: e.target.value});
                    setPreview(null);
                  }}
                />
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-200 bg-slate-50'} flex items-center justify-between`}>
               <div>
                  <p className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Trạng thái</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Hiển thị ngay</p>
               </div>
               <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, TrangThai: prev.TrangThai === 1 ? 0 : 1 }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.TrangThai === 1 ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.TrangThai === 1 ? 'left-7' : 'left-1'}`}></div>
                </button>
            </div>
          </div>

          {/* Cột phải: Thông tin liên kết & Nội dung */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Danh mục hiển thị</label>
              <select 
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all`}
                value={formData.MaDanhMuc}
                onChange={e => setFormData({...formData, MaDanhMuc: e.target.value})}
              >
                <option value="">-- Mặc định (Áp dụng chung cho tất cả) --</option>
                {categories.map(dm => (
                  <option key={dm.MaDanhMuc} value={dm.MaDanhMuc}>
                    {dm.TenDanhMuc}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-500">Banner sẽ tự động thay đổi khi khách hàng bấm vào danh mục tương ứng trên trang chủ.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vị trí hiển thị Banner</label>
              <select 
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all`}
                value={formData.ViTri}
                onChange={e => setFormData({...formData, ViTri: e.target.value})}
              >
                <option value="">-- Mặc định (Tự động theo thứ tự) --</option>
                <option value="1">Vị trí 1: Banner chính (Bên trái lớn)</option>
                <option value="2">Vị trí 2: Banner phụ 1 (Góc trên bên phải)</option>
                <option value="3">Vị trí 3: Banner phụ 2 (Góc dưới bên phải)</option>
              </select>
              <p className="text-[10px] text-slate-500">Đặt vị trí cụ thể cho banner để cố định vị trí của nó trên trang chủ.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tiêu đề Banner</label>
              <input 
                type="text"
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all`}
                placeholder="Khuyến mãi cực sốc..."
                value={formData.TieuDe}
                onChange={e => setFormData({...formData, TieuDe: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Mô tả thông điệp</label>
              <textarea 
                rows="3"
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all resize-none`}
                placeholder="Nhập nội dung thông điệp quảng cáo..."
                value={formData.MoTa}
                onChange={e => setFormData({...formData, MoTa: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Link đích khi click (URL chuyển hướng)</label>
              <input 
                type="text"
                className={`w-full px-4 py-3 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'} outline-none transition-all`}
                placeholder="https://example.com/san-pham-hot"
                value={formData.LinkRedirect}
                onChange={e => setFormData({...formData, LinkRedirect: e.target.value})}
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/admin/banner')} 
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'}`}
              >
                Hủy
              </button>
              <button 
                type="submit" 
                disabled={loading || uploading}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-500 active:scale-95 disabled:bg-slate-800 transition-all flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">cloud_done</span>
                    Hoàn tất tải lên
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
