import React, { useState, useEffect } from 'react';
import { danhmucThuoctinhApi, danhmucApi } from '../../../api/tta_api';

export default function TtaDanhMucThuocTinhList() {
  const [mappings, setMappings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resM, resC] = await Promise.all([
        danhmucThuoctinhApi.getAll(),
        danhmucApi.getAll()
      ]);
      setMappings(resM.data.data.items);
      setCategories(resC.data.data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Group mappings by category
  const groupedMappings = mappings.reduce((acc, curr) => {
    if (!acc[curr.MaDanhMuc]) {
      acc[curr.MaDanhMuc] = {
        name: curr.TenDanhMuc,
        attrs: []
      };
    }
    acc[curr.MaDanhMuc].attrs.push(curr);
    return acc;
  }, {});

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa liên kết này?')) return;
    try {
      await danhmucThuoctinhApi.delete(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state">Đang tải cấu hình danh mục...</div>;

  return (
    <div className="page-container" style={{ padding: '30px', background: '#f4f7f9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748' }}>📐 Cấu hình Thuộc tính theo Danh mục</h1>
          <p style={{ color: '#718096' }}>Quản lý các bộ khung thông số mẫu cho từng loại sản phẩm</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '12px 25px', borderRadius: '10px' }}>
          ➕ Thiết lập bộ mẫu mới
        </button>
      </div>

      <div className="category-specs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>
        {Object.entries(groupedMappings).map(([maDm, data]) => (
          <div key={maDm} className="card" style={{ padding: 0, borderRadius: '20px', border: 'none', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '20px 25px', background: '#2d3748', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>📁</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{data.name}</h3>
              </div>
              <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                {data.attrs.length} thuộc tính mẫu
              </span>
            </div>
            
            <div style={{ padding: '20px' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.attrs.map((attr, idx) => (
                  <li key={attr.Id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 15px', 
                    background: idx % 2 === 0 ? '#f8fafc' : 'white',
                    borderRadius: '10px',
                    marginBottom: '5px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#cbd5e0', fontSize: '12px' }}>#{idx + 1}</span>
                      <span style={{ color: '#4a5568', fontWeight: '500' }}>{attr.TenThuocTinh}</span>
                    </div>
                    <button 
                      onClick={() => handleDelete(attr.Id)}
                      style={{ background: 'transparent', border: 'none', color: '#fed7d7', cursor: 'pointer', fontSize: '16px' }}
                      onMouseEnter={e => e.target.style.color = '#e53e3e'}
                      onMouseLeave={e => e.target.style.color = '#fed7d7'}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              
              <button style={{ 
                width: '100%', 
                marginTop: '15px', 
                padding: '12px', 
                border: '2px dashed #e2e8f0', 
                borderRadius: '12px', 
                background: 'transparent', 
                color: '#718096',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                ➕ Thêm thuộc tính vào danh mục này
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
