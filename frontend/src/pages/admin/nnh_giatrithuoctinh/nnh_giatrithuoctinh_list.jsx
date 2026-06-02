import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { giatrithuoctinhApi, sanphamApi } from '../../../api/tta_api';
import { useAdminTheme } from '../../../hooks/useAdminTheme';

export default function TtaGiaTriThuocTinhList() {
  const isDark = useAdminTheme();
  const navigate = useNavigate();
  const [values, setValues] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (maSp) => {
    setExpandedRows(prev => ({...prev, [maSp]: !prev[maSp]}));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resValues, resProds] = await Promise.all([
        giatrithuoctinhApi.getAll(),
        sanphamApi.getAll()
      ]);
      setValues(resValues.data.data.items || []);
      setProducts(resProds.data.data.items || []);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      setValues([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa giá trị thông số này không?")) return;
    try {
      await giatrithuoctinhApi.delete(id);
      fetchData();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
      alert("Xóa thất bại!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const groupedValues = values.reduce((acc, curr) => {
    if (!acc[curr.MaSanPham]) acc[curr.MaSanPham] = [];
    acc[curr.MaSanPham].push(curr);
    return acc;
  }, {});
  const productsWithValues = products.filter(p => groupedValues[p.MaSanPham]);

  if (loading) return (
    <div className={`p-8 min-h-screen flex items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} font-medium animate-pulse`}>Đang tải dữ liệu thông số...</p>
      </div>
    </div>
  );

  return (
    <div className={`p-8 min-h-[calc(100vh-64px)] ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} transition-colors duration-300 font-['Inter'] space-y-10`}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-2 text-blue-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 font-['Space_Grotesk']">
            <span>INVENTORY</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="opacity-60">TECHNICAL SPECS</span>
          </nav>
          <h1 className={`font-['Space_Grotesk'] text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>Quản lý Thông số Sản phẩm</h1>
          <p className={`${isDark ? 'text-slate-500' : 'text-slate-400'} mt-2 max-w-xl text-sm italic font-medium leading-relaxed`}>
            Chi tiết các thông số kỹ thuật đã được gán cho từng sản phẩm cụ thể dựa trên bảng giá trị thuộc tính.
          </p>
        </div>
        <div>
          <Link to="/admin/giatri-thuoctinh/them" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span>
            GÁN THÔNG SỐ MỚI
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} p-6 rounded-3xl border flex items-center gap-5 transition-all`}>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined">database</span>
          </div>
          <div>
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} font-bold uppercase tracking-widest`}>SẢN PHẨM ĐÃ CÓ THÔNG SỐ</p>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} font-['Space_Grotesk']`}>
              {[...new Set(values.map(v => v.MaSanPham))].length} / {products.length}
            </h3>
          </div>
        </div>
        <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} p-6 rounded-3xl border flex items-center gap-5 transition-all`}>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <span className="material-symbols-outlined">sync</span>
          </div>
          <div>
            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} font-bold uppercase tracking-widest`}>ĐỒNG BỘ LẦN CUỐI</p>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'} font-['Space_Grotesk']`}>
              {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </h3>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className={`${isDark ? 'bg-slate-900/60 border-slate-800 shadow-black/50' : 'bg-white border-slate-200 shadow-xl'} backdrop-blur-md rounded-[2.5rem] overflow-hidden border shadow-2xl min-h-[500px] flex flex-col`}>
        {/* Filters Bar */}
        <div className={`p-6 border-b ${isDark ? 'border-white/5 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50'} flex flex-wrap items-center justify-between gap-4`}>
          <div className="flex gap-3">
            <button className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Lọc nhóm
            </button>
          </div>
          <div className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Hiển thị <span className={isDark ? 'text-blue-400' : 'text-blue-600'}>{values.length}</span> bản ghi thông số
          </div>
        </div>

        {/* Main Content */}
        {values.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full"></div>
              <div className="relative w-56 h-56 flex items-center justify-center">
                <span className={`material-symbols-outlined text-8xl ${isDark ? 'text-slate-800' : 'text-slate-200'}`}>schema</span>
              </div>
            </div>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-3 font-['Space_Grotesk'] tracking-tight`}>Chưa có thông số nào được cấu hình</h2>
            <p className={`${isDark ? 'text-slate-500' : 'text-slate-400'} max-w-md mx-auto mb-10 text-sm italic font-medium`}>Bắt đầu gán giá trị thuộc tính cho sản phẩm của bạn.</p>
            <Link to="/admin/giatri-thuoctinh/them" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all active:scale-95">THÊM NGAY</Link>
          </div>
        ) : (
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-100'} border-b`}>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sản phẩm</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Số lượng thông số</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Quản lý</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/50' : 'divide-slate-100'}`}>
                {productsWithValues.map((product) => {
                  const productValues = groupedValues[product.MaSanPham] || [];
                  const isExpanded = expandedRows[product.MaSanPham];

                  return (
                    <React.Fragment key={product.MaSanPham}>
                      <tr className={`${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50/50'} ${isExpanded ? (isDark ? 'bg-white/[0.02]' : 'bg-slate-50/50') : ''} transition-colors cursor-pointer group`} onClick={() => toggleRow(product.MaSanPham)}>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'} border flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90 text-blue-500' : 'group-hover:text-blue-500'}`}>
                              <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{product.TenSanPham}</p>
                              <p className="text-[10px] text-slate-500 italic font-medium">{product.TenDanhMuc}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            {productValues.length} THÔNG SỐ
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/admin/san-pham/thong-so/${product.MaSanPham}`} onClick={(e) => e.stopPropagation()} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Chỉnh sửa thông số">
                              <span className="material-symbols-outlined text-lg">edit_note</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="3" className="p-0">
                            <div className={`${isDark ? 'bg-slate-950/50 border-slate-800/50' : 'bg-slate-50/50 border-slate-100'} border-y px-16 py-6 shadow-inner`}>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {productValues.map(v => (
                                  <div key={v.GiaTriID} className={`flex items-center justify-between p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-slate-800/50 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'} transition-colors`}>
                                    <div className="flex flex-col gap-1 w-full mr-4 overflow-hidden">
                                      <p className={`text-[10px] font-bold uppercase tracking-widest truncate ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{v.TenThuocTinh}</p>
                                      <p className={`text-sm font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{v.GiaTri}</p>
                                    </div>
                                    <button onClick={() => handleDelete(v.GiaTriID)} className="p-2 text-rose-400 hover:bg-rose-400/10 hover:text-rose-500 rounded-lg transition-colors shrink-0" title="Xóa giá trị này">
                                      <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
