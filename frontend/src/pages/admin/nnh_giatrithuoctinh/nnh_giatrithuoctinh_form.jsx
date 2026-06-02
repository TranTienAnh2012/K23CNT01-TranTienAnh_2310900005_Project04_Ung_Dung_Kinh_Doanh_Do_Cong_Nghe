import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { giatrithuoctinhApi, sanphamApi, danhmucThuoctinhApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function NnhGiaTriThuocTinhForm() {
  const isDark = useAdminTheme();
  const { ma } = useParams(); // MaSanPham nếu đi từ chi tiết sản phẩm
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(ma || '');
  const [availableAttributes, setAvailableAttributes] = useState([]);
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const resProds = await sanphamApi.getAll();
        setProducts(resProds.data.data.items);

        if (selectedProduct) {
          // Lấy danh sách thuộc tính được phép cho danh mục của sản phẩm này
          const prod = resProds.data.data.items.find(p => p.MaSanPham === parseInt(selectedProduct));
          if (prod) {
            const resAttrs = await danhmucThuoctinhApi.getBySanPham(selectedProduct);
            const attrs = resAttrs.data.data;
            setAvailableAttributes(attrs);

            // Lấy các giá trị hiện có
            const resValues = await giatrithuoctinhApi.getBySanPham(selectedProduct);
            const currentValues = resValues.data.data;

            // Map vào form
            const initialForm = attrs.map(attr => {
              const existing = currentValues.find(v => v.ThuocTinhID === attr.ThuocTinhID);
              return {
                ThuocTinhID: attr.ThuocTinhID,
                TenThuocTinh: attr.TenThuocTinh,
                GiaTri: existing ? existing.GiaTri : ''
              };
            });
            setFormData(initialForm);
          }
        }
      } catch (err) {
        console.error("Lỗi khởi tạo form:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [selectedProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Lưu từng thuộc tính (Backend thường xử lý mảng hoặc gọi lẻ)
      // Ở đây giả định backend nhận từng cái hoặc có endpoint bulk
      const promises = formData
        .filter(item => item.GiaTri.trim() !== '')
        .map(item => giatrithuoctinhApi.create({
          MaSanPham: parseInt(selectedProduct),
          ThuocTinhID: item.ThuocTinhID,
          GiaTri: item.GiaTri
        }));
      
      await Promise.all(promises);
      alert("Cập nhật thông số thành công!");
      navigate('/admin/giatri-thuoctinh');
    } catch (err) {
      alert("Lỗi khi lưu: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading && !products.length) return <div className="p-8 text-slate-500">Đang tải cấu hình...</div>;

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter']`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'}`}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 className={`font-['Space_Grotesk'] text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Cấu hình Thông số Kỹ thuật</h2>
            <p className={isDark ? 'text-slate-400' : 'text-slate-500'}>Gán giá trị cụ thể cho các thuộc tính của sản phẩm.</p>
          </div>
        </div>

        <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-[2.5rem] border p-10 shadow-2xl`}>
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Product Selection */}
            <div className="space-y-4">
              <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>1. Chọn sản phẩm mục tiêu</label>
              <select 
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                disabled={!!ma}
                className={`w-full px-6 py-4 rounded-2xl border transition-all font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                } ${ma ? 'opacity-60' : ''}`}
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map(p => (
                  <option key={p.MaSanPham} value={p.MaSanPham}>{p.TenSanPham} ({p.TenDanhMuc})</option>
                ))}
              </select>
            </div>

            {/* Attributes Inputs */}
            {selectedProduct && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>2. Nhập giá trị thông số</label>
                
                {availableAttributes.length === 0 ? (
                  <div className={`p-8 rounded-2xl border-2 border-dashed text-center ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-sm italic text-slate-500">Danh mục này chưa được cấu hình thuộc tính mẫu. Vui lòng kiểm tra lại bảng "Thông số theo danh mục".</p>
                    <Link to="/admin/danhmuc-thuoctinh" className="text-blue-500 text-xs font-bold mt-4 block underline">Cấu hình ngay</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.map((item, idx) => (
                      <div key={item.ThuocTinhID} className="space-y-2">
                        <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.TenThuocTinh}</label>
                        <input 
                          type="text"
                          value={item.GiaTri}
                          onChange={(e) => {
                            const newForm = [...formData];
                            newForm[idx].GiaTri = e.target.value;
                            setFormData(newForm);
                          }}
                          placeholder={`Nhập ${item.TenThuocTinh.toLowerCase()}...`}
                          className={`w-full px-5 py-3.5 rounded-xl border transition-all text-sm outline-none focus:border-blue-500/50 ${
                            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="pt-6 border-t border-slate-800/50 flex justify-end gap-4">
              <button 
                type="button"
                onClick={() => navigate(-1)}
                className={`px-8 py-4 rounded-2xl font-bold text-xs transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                HỦY BỎ
              </button>
              <button 
                type="submit"
                disabled={saving || !selectedProduct}
                className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center gap-2"
              >
                {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                LƯU THÔNG SỐ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
