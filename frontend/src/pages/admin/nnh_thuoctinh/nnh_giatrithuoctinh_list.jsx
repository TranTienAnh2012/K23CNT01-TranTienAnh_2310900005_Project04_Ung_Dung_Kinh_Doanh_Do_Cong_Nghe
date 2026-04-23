import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { giatrithuoctinhApi, sanphamApi } from '../../../api/tta_api';

export default function TtaGiaTriThuocTinhList() {
  const [values, setValues] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resValues, resProds] = await Promise.all([
        giatrithuoctinhApi.getAll(),
        sanphamApi.getAll()
      ]);
      setValues(resValues.data.data.items);
      setProducts(resProds.data.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group values by product
  const groupedValues = values.reduce((acc, curr) => {
    if (!acc[curr.MaSanPham]) {
      acc[curr.MaSanPham] = {
        name: curr.TenSanPham,
        specs: []
      };
    }
    acc[curr.MaSanPham].specs.push(curr);
    return acc;
  }, {});

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa thông số này?')) return;
    try {
      await giatrithuoctinhApi.delete(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state">Đang tải dữ liệu...</div>;

  return (
    <div className="page-container" style={{ background: '#f4f7f9', minHeight: '100vh', padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748' }}>⚙️ Quản lý Thuộc tính Sản phẩm</h1>
          <p style={{ color: '#718096' }}>Hệ thống quản lý thông số kỹ thuật tập trung</p>
        </div>
        <Link to="/admin/giatri-thuoctinh/them" className="btn btn-primary" style={{ padding: '12px 25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(49, 130, 206, 0.3)' }}>
          <span>➕</span> THÊM THÔNG SỐ MỚI
        </Link>
      </div>

      <div className="stats-row" style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div className="card" style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
          <h4 style={{ color: '#718096', fontSize: '14px' }}>Tổng số sản phẩm có cấu hình</h4>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3748' }}>{Object.keys(groupedValues).length}</p>
        </div>
        <div className="card" style={{ flex: 1, padding: '20px', textAlign: 'center' }}>
          <h4 style={{ color: '#718096', fontSize: '14px' }}>Tổng số thuộc tính đã nhập</h4>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#38a169' }}>{values.length}</p>
        </div>
      </div>

      {Object.keys(groupedValues).length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '100px 20px', borderRadius: '15px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📝</div>
          <h3>Chưa có dữ liệu thông số</h3>
          <p style={{ color: '#718096', marginBottom: '25px' }}>Hãy bắt đầu bằng cách thêm thông số cho sản phẩm đầu tiên của bạn.</p>
          <Link to="/admin/giatri-thuoctinh/them" className="btn btn-primary">Thêm ngay</Link>
        </div>
      ) : (
        <div className="specs-grid">
          {Object.entries(groupedValues).map(([maSp, data]) => (
            <div key={maSp} className="specs-product-card" style={{ background: 'white', borderRadius: '15px', border: 'none', boxShadow: '0 5px 20px rgba(0,0,0,0.03)', marginBottom: '30px' }}>
              <div className="specs-card-header" style={{ padding: '20px 25px', borderBottom: '1px solid #edf2f7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '45px', height: '45px', background: '#ebf8ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#2d3748' }}>{data.name}</h3>
                    <span style={{ fontSize: '12px', color: '#3182ce', fontWeight: '500', background: '#ebf8ff', padding: '2px 10px', borderRadius: '20px' }}>
                      {data.specs.length} thông số kỹ thuật
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Link to={`/admin/san-pham/thong-so/${maSp}`} className="btn btn-secondary" style={{ padding: '8px 15px', fontSize: '13px', background: '#f7fafc', color: '#4a5568', border: '1px solid #e2e8f0' }}>
                    ✎ Chỉnh sửa
                  </Link>
                </div>
              </div>
              
              <div style={{ padding: '0 15px 15px 15px' }}>
                <table className="specs-table">
                  <thead>
                    <tr>
                      <th style={{ background: 'transparent', padding: '15px 10px' }}>Thuộc tính</th>
                      <th style={{ background: 'transparent', padding: '15px 10px' }}>Giá trị chi tiết</th>
                      <th style={{ background: 'transparent', padding: '15px 10px', textAlign: 'right' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.specs.map((s) => (
                      <tr key={s.GiaTriID} className="spec-row-hover">
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ color: '#4a5568', fontWeight: '500' }}>{s.TenThuocTinh}</span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ color: '#2d3748' }}>{s.GiaTri}</span>
                        </td>
                        <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                          <button 
                            className="btn-icon delete" 
                            style={{ color: '#fed7d7', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = '#e53e3e'}
                            onMouseLeave={e => e.target.style.color = '#fed7d7'}
                            onClick={() => handleDelete(s.GiaTriID)}
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .spec-row-hover:hover {
          background-color: #fcfcfc;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(49, 130, 206, 0.4);
        }
      `}} />
    </div>
  );
}
