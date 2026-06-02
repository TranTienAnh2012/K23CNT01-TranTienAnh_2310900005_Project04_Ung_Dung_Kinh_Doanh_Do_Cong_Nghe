import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sanphamApi, danhmucApi, uploadApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhSanPhamSua() {
  const isDark = useAdminTheme();
  const { ma } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    TenSanPham: '',
    MaDanhMuc: '',
    GiaGoc: '',
    GiaBan: '',
    SoLuongTon: '',
    MoTa: '',
    HinhAnh: '',
    TrangThai: 1
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          danhmucApi.getAll(),
          sanphamApi.getOne(ma)
        ]);
        
        setCategories(catRes.data.data.items);
        
        const prod = prodRes.data.data;
        setFormData({
          TenSanPham: prod.TenSanPham,
          MaDanhMuc: prod.MaDanhMuc || '', // Handle if null
          GiaGoc: prod.Gia,
          GiaBan: prod.GiaBan,
          SoLuongTon: prod.SoLuongTon,
          MoTa: prod.MoTa || '',
          HinhAnh: prod.HinhAnh || '',
          TrangThai: prod.TrangThai
        });

        if (prod.HinhAnh) {
          setPreview(prod.HinhAnh.startsWith('http') ? prod.HinhAnh : `http://localhost:5000${prod.HinhAnh}`);
        }
      } catch (err) {
        console.error("Lỗi tải dữ liệu:", err);
        alert("Không thể tải thông tin sản phẩm!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ma]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const res = await uploadApi.uploadImage(file);
      setFormData(prev => ({ ...prev, HinhAnh: res.data.data.url }));
    } catch (err) {
      alert("Lỗi khi tải ảnh lên!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // CHIẾN LƯỢC CHUẨN HÓA CỰC ĐOAN: Đảm bảo không bao giờ có null/NaN
    const submitData = {
      TenSanPham: formData.TenSanPham || "",
      MaDanhMuc: Number(formData.MaDanhMuc) || 0,
      GiaGoc: Number(formData.GiaGoc) || 0,
      GiaBan: Number(formData.GiaBan) || 0,
      SoLuongTon: Number(formData.SoLuongTon) || 0,
      MoTa: formData.MoTa || "",
      HinhAnh: formData.HinhAnh || "",
      // Nếu TrangThai là 1 hoặc "1" hoặc true thì gửi 1, ngược lại gửi 0. Tuyệt đối không gửi null.
      TrangThai: (formData.TrangThai == 1 || formData.TrangThai === true) ? 1 : 0
    };

    console.log("DỮ LIỆU GỬI ĐI (JSON):", JSON.stringify(submitData));

    try {
      await sanphamApi.update(ma, submitData);
      alert("Cập nhật sản phẩm thành công!");
      navigate('/admin/san-pham');
    } catch (err) {
      console.error("LỖI API CHI TIẾT:", err.response?.data);
      const errorMsg = err.response?.data?.message;
      let detailedMsg = "";
      
      if (typeof errorMsg === 'object') {
        detailedMsg = Object.entries(errorMsg)
          .map(([key, val]) => `${key}: ${val}`)
          .join('\\n');
      } else {
        detailedMsg = errorMsg || "Lỗi không xác định";
      }
        
      alert("Lỗi khi cập nhật sản phẩm!\\n" + detailedMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-slate-400">Đang tải thông tin...</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter']`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-full ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'} border flex items-center justify-center transition-colors`}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className={`font-['Space_Grotesk'] text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Chỉnh Sửa Sản Phẩm</h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Cập nhật thông tin định danh và cấu hình của thực thể sản phẩm.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className={`${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-md'} backdrop-blur-md p-6 rounded-2xl border shadow-xl`}>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-2`}>
                <span className="material-symbols-outlined text-blue-400">edit_note</span>
                Thông Tin Chi Tiết
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Tên Sản Phẩm</label>
                  <input 
                    required
                    name="TenSanPham"
                    value={formData.TenSanPham}
                    onChange={handleChange}
                    className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Danh Mục</label>
                    <select 
                      required
                      name="MaDanhMuc"
                      value={formData.MaDanhMuc}
                      onChange={handleChange}
                    className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none`}
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map(c => (
                        <option key={c.MaDanhMuc} value={c.MaDanhMuc}>{c.TenDanhMuc}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Số Lượng Tồn</label>
                    <input 
                      required
                      type="number"
                      name="SoLuongTon"
                      value={formData.SoLuongTon}
                      onChange={handleChange}
                      className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Mô Tả</label>
                  <textarea 
                    name="MoTa"
                    value={formData.MoTa}
                    onChange={handleChange}
                    rows="5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">payments</span>
                Giá Cả
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Giá Gốc (VND)</label>
                  <input 
                    required
                    type="number"
                    name="GiaGoc"
                    value={formData.GiaGoc}
                    onChange={handleChange}
                    className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Giá Bán (VND)</label>
                  <input 
                    required
                    type="number"
                    name="GiaBan"
                    value={formData.GiaBan}
                    onChange={handleChange}
                    className={`w-full ${isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'} border rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-400">image</span>
                Ảnh Sản Phẩm
              </h3>
              
              <div className="relative aspect-square bg-slate-950 rounded-xl border-2 border-dashed border-slate-800 flex flex-col items-center justify-center overflow-hidden group">
                {preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold text-sm">Đổi ảnh</label>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <span className="material-symbols-outlined text-slate-600 text-4xl mb-2">add_photo_alternate</span>
                    <p className="text-xs text-slate-500 font-medium">Chưa có ảnh</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {uploading && (
                  <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-800 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-400">visibility</span>
                Trạng Thái
              </h3>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-sm text-slate-400 font-medium">Đang hiển thị</span>
                <button 
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, TrangThai: prev.TrangThai === 1 ? 0 : 1 }))}
                  className={`w-12 h-6 rounded-full transition-all relative ${formData.TrangThai === 1 ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.TrangThai === 1 ? 'left-7' : 'left-1'}`}></div>
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={submitting || uploading}
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-white font-bold rounded-2xl shadow-lg shadow-amber-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined">update</span>
                  Cập Nhật Ngay
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
