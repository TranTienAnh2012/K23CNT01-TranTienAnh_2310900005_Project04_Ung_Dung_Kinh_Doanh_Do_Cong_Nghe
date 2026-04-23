import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { sanphamApi, giatrithuoctinhApi, danhmucThuoctinhApi } from '../../../api/tta_api';

export default function TtaGiaTriThuocTinhThem() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const categoryFilter = queryParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingSpecs, setFetchingSpecs] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resProd = await sanphamApi.getAll();
        let allProds = resProd.data.data.items;
        
        if (categoryFilter && categoryFilter !== 'Tất cả') {
          allProds = allProds.filter(p => p.TenDanhMuc === categoryFilter);
        }
        
        setProducts(allProds);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryFilter]);

  // Tự động tải thuộc tính từ Database khi chọn sản phẩm
  useEffect(() => {
    const fetchSpecsByProduct = async () => {
      if (!selectedProduct) {
        setRows([]);
        return;
      }
      
      setFetchingSpecs(true);
      try {
        const res = await danhmucThuoctinhApi.getBySanPham(selectedProduct);
        const dbSpecs = res.data.data;
        
        if (dbSpecs && dbSpecs.length > 0) {
          const newRows = dbSpecs.map(spec => ({
            attrName: spec.TenThuocTinh,
            value: '',
            attrId: spec.ThuocTinhID
          }));
          setRows(newRows);
        } else {
          setRows([{ attrName: '', value: '' }]);
        }
      } catch (err) {
        console.error("Lỗi khi lấy thuộc tính từ DB:", err);
        setRows([{ attrName: '', value: '' }]);
      } finally {
        setFetchingSpecs(false);
      }
    };

    fetchSpecsByProduct();
  }, [selectedProduct]);

  const addRow = () => setRows([...rows, { attrName: '', value: '' }]);
  const removeRow = (index) => setRows(rows.filter((_, i) => i !== index));

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleSaveAll = async () => {
    if (!selectedProduct) return alert('Vui lòng chọn sản phẩm!');
    if (rows.length === 0) return alert('Vui lòng thêm ít nhất một thông số!');
    
    setSaving(true);
    try {
      for (const row of rows) {
        if (row.attrName && row.value) {
          await giatrithuoctinhApi.create({
            MaSanPham: selectedProduct,
            TenThuocTinh: row.attrName,
            ThuocTinhID: row.attrId,
            GiaTri: row.value
          });
        }
      }
      navigate('/admin/giatri-thuoctinh');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu dữ liệu. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="p-8 bg-slate-950 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-['Inter'] text-sm font-medium animate-pulse">Đang chuẩn bị hệ thống thông số...</p>
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-[1200px] mx-auto font-['Inter'] bg-slate-950 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 font-['Space_Grotesk']">
          <Link to="/admin/giatri-thuoctinh" className="hover:text-blue-500 transition-colors">ATTRIBUTES</Link>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-blue-500">NEW SPECIFICATIONS</span>
        </nav>
        <h1 className="font-['Space_Grotesk'] text-4xl font-bold text-white tracking-tight">Thêm Thông số Kỹ thuật</h1>
        <p className="text-slate-500 mt-2 max-w-xl text-sm italic">Cấu hình các giá trị thông số chi tiết cho từng sản phẩm theo mẫu danh mục.</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Form Area */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Step 1: Selection */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500">
                <span className="material-symbols-outlined text-xl">inventory_2</span>
              </div>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">Chọn sản phẩm</h3>
            </div>
            
            <div className="relative">
              <select 
                className="w-full bg-slate-800/50 border border-slate-700 text-white px-6 py-4 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-sm"
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
              >
                <option value="" className="bg-slate-900">-- Chọn sản phẩm ({categoryFilter || 'Tất cả'}) --</option>
                {products.map(sp => (
                  <option key={sp.MaSanPham} value={sp.MaSanPham} className="bg-slate-900">{sp.TenSanPham} ({sp.TenDanhMuc})</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </div>

          {/* Step 2: Attribute Values */}
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl relative min-h-[400px]">
            {fetchingSpecs && (
              <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="text-xs text-blue-400 font-bold tracking-widest uppercase">Nạp cấu hình mẫu...</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-500">
                  <span className="material-symbols-outlined text-xl">settings_input_component</span>
                </div>
                <h3 className="font-['Space_Grotesk'] text-lg font-bold text-white">Giá trị chi tiết</h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-bold tracking-tighter uppercase border border-white/5">
                {rows.length} THÔNG SỐ
              </span>
            </div>

            {!selectedProduct ? (
              <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                <span className="material-symbols-outlined text-5xl text-slate-700 mb-4">touch_app</span>
                <p className="text-slate-500 text-sm font-medium italic">Vui lòng chọn sản phẩm ở trên để bắt đầu cấu hình</p>
              </div>
            ) : rows.length === 0 && !fetchingSpecs ? (
              <div className="p-8 text-center bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                <span className="material-symbols-outlined text-rose-500 text-4xl mb-4">warning</span>
                <p className="text-white font-bold text-sm mb-2">Chưa có liên kết danh mục</p>
                <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto mb-6">
                  Sản phẩm này chưa được gán bộ thuộc tính mẫu trong danh mục. Hãy thiết lập khung trước để làm việc nhanh hơn.
                </p>
                <Link to="/admin/danhmuc-thuoctinh" className="text-blue-500 text-xs font-bold hover:underline">Đi tới Thông số theo danh mục →</Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  <div className="col-span-5">Tên thuộc tính</div>
                  <div className="col-span-6">Giá trị</div>
                </div>
                
                {rows.map((row, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-center group animate-in fade-in slide-in-from-left-4 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="col-span-5 relative">
                      <input 
                        type="text" 
                        className={`w-full bg-slate-800/30 border ${row.attrId ? 'border-slate-700/50 text-slate-400' : 'border-slate-600 text-white focus:border-blue-500'} px-4 py-3 rounded-xl focus:outline-none transition-all text-sm font-medium`}
                        placeholder="Vd: Dung lượng..."
                        value={row.attrName}
                        readOnly={!!row.attrId}
                        onChange={(e) => handleRowChange(index, 'attrName', e.target.value)}
                      />
                      {row.attrId && <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-xs text-slate-600">lock</span>}
                    </div>
                    <div className="col-span-6">
                      <input 
                        type="text" 
                        className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm font-medium"
                        placeholder="Nhập giá trị (Vd: 8GB, 5000mAh...)"
                        value={row.value}
                        autoFocus={index === 0 && row.attrId}
                        onChange={(e) => handleRowChange(index, 'value', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <button 
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                        onClick={() => removeRow(index)}
                      >
                        <span className="material-symbols-outlined text-lg">close</span>
                      </button>
                    </div>
                  </div>
                ))}

                <button 
                  className="w-full mt-6 py-4 border-2 border-dashed border-slate-800 hover:border-slate-600 rounded-2xl text-slate-500 hover:text-slate-300 transition-all text-xs font-bold flex items-center justify-center gap-2" 
                  onClick={addRow}
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  THÊM THUỘC TÍNH KHÁC NGOÀI MẪU
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between">
            <div>
              <h3 className="font-['Space_Grotesk'] text-xl font-bold text-white mb-4">Hoàn tất thiết lập</h3>
              <p className="text-xs text-slate-500 leading-relaxed italic mb-8">
                Đảm bảo các giá trị thông số khớp với tài liệu kỹ thuật của nhà sản xuất trước khi lưu vào hệ thống.
              </p>
            </div>
            
            <div className="space-y-3">
              <button 
                onClick={handleSaveAll}
                disabled={saving || !selectedProduct || rows.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ĐANG LƯU DỮ LIỆU...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    LƯU TOÀN BỘ THÔNG SỐ
                  </>
                )}
              </button>
              
              <button 
                onClick={() => navigate('/admin/giatri-thuoctinh')}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-4 rounded-2xl font-bold text-sm transition-all"
              >
                QUAY LẠI
              </button>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-blue-600/5 border border-blue-500/10 p-6 rounded-3xl">
            <h4 className="text-blue-500 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lightbulb</span>
              Mẹo nhỏ
            </h4>
            <ul className="space-y-3">
              <li className="text-[11px] text-slate-400 leading-relaxed">• Hệ thống tự động khóa tên thuộc tính nếu lấy từ mẫu.</li>
              <li className="text-[11px] text-slate-400 leading-relaxed">• Bạn có thể thêm bao nhiêu thuộc tính tùy ý cho một sản phẩm.</li>
              <li className="text-[11px] text-slate-400 leading-relaxed">• Sử dụng đơn vị chuẩn (Vd: GB, mAh, Hz) để bộ lọc hoạt động tốt nhất.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
