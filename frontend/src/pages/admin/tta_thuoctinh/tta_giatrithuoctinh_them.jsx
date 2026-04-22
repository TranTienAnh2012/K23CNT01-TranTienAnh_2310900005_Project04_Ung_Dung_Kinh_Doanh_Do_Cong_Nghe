import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sanphamApi, giatrithuoctinhApi, danhmucThuoctinhApi } from '../../../api/tta_api';

export default function TtaGiaTriThuocTinhThem() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingSpecs, setFetchingSpecs] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const resProd = await sanphamApi.getAll();
        setProducts(resProd.data.data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
          // Chuyển đổi dữ liệu từ DB sang định dạng của Form
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
      alert('Đã lưu tất cả thông số thành công!');
      navigate('/admin/giatri-thuoctinh');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi lưu dữ liệu. Vui lòng thử lại.');
    }
  };

  if (loading) return <div className="loading-state">Đang tải danh sách sản phẩm...</div>;

  return (
    <div className="page-container" style={{ background: '#f4f7f9', minHeight: '100vh', padding: '30px' }}>
      <div className="card" style={{ maxWidth: '900px', margin: '0 auto', borderRadius: '15px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '30px', borderBottom: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#2d3748' }}>➕ Thêm Thông số Kỹ thuật</h2>
            <p style={{ color: '#718096', marginTop: '5px' }}>Hệ thống tự động tải thuộc tính từ Database</p>
          </div>
          <div style={{ background: '#ebf8ff', padding: '10px 20px', borderRadius: '10px', color: '#3182ce', fontWeight: '600' }}>
            {rows.length} thông số
          </div>
        </div>
        
        <div style={{ padding: '30px' }}>
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#4a5568' }}>Chọn sản phẩm để nạp cấu hình *</label>
            <select 
              className="form-control" 
              style={{ height: '50px', borderRadius: '10px', border: '2px solid #3182ce', fontSize: '16px', boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.1)' }}
              value={selectedProduct} 
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">-- Chọn sản phẩm (Tự động nạp mẫu từ DB) --</option>
              {products.map(sp => (
                <option key={sp.MaSanPham} value={sp.MaSanPham}>{sp.TenSanPham}</option>
              ))}
            </select>
          </div>

          {fetchingSpecs && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#3182ce' }}>
              <div className="spinner"></div> Đang nạp danh sách thuộc tính từ Database...
            </div>
          )}

          {!fetchingSpecs && selectedProduct && rows.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px', background: '#fff5f5', borderRadius: '10px', color: '#c53030' }}>
              ⚠️ Sản phẩm này chưa được liên kết thuộc tính trong danh mục. Hãy liên kết ở mục "Thông số theo danh mục".
            </div>
          )}

          <div className="bulk-rows" style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '10px', fontWeight: '600', color: '#718096', fontSize: '13px', paddingLeft: '10px' }}>
              <div style={{ flex: 1 }}>TÊN THUỘC TÍNH (TỪ DATABASE)</div>
              <div style={{ flex: 2 }}>GIÁ TRỊ CHI TIẾT</div>
              <div style={{ width: '40px' }}></div>
            </div>
            
            {rows.map((row, index) => (
              <div key={index} className="bulk-form-row" style={{ display: 'flex', gap: '15px', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Tên thuộc tính..." 
                    style={{ borderRadius: '8px', border: '1px solid #cbd5e0', background: row.attrId ? '#f7fafc' : '#fff' }}
                    value={row.attrName}
                    readOnly={!!row.attrId}
                    onChange={(e) => handleRowChange(index, 'attrName', e.target.value)}
                  />
                </div>
                <div style={{ flex: 2 }}>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nhập giá trị (Vd: 8GB, Apple A17...)" 
                    style={{ borderRadius: '8px', border: '1px solid #3182ce' }}
                    value={row.value}
                    autoFocus={index === 0}
                    onChange={(e) => handleRowChange(index, 'value', e.target.value)}
                  />
                </div>
                <button 
                  className="btn-icon delete" 
                  style={{ color: '#fed7d7' }} 
                  onClick={() => removeRow(index)}
                >
                  ✕
                </button>
              </div>
            ))}

            <button 
              className="btn" 
              style={{ border: '2px dashed #cbd5e0', width: '100%', marginTop: '10px', background: 'transparent', color: '#718096', fontWeight: '600' }} 
              onClick={addRow}
            >
              ➕ Thêm thuộc tính khác ngoài mẫu
            </button>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
            <button className="btn btn-primary" onClick={handleSaveAll} style={{ flex: 2, height: '55px', fontSize: '16px', borderRadius: '10px', fontWeight: '700' }}>
              Lưu toàn bộ thông số
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/giatri-thuoctinh')} style={{ flex: 1, height: '55px', fontSize: '16px', borderRadius: '10px', background: '#edf2f7', color: '#4a5568' }}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
