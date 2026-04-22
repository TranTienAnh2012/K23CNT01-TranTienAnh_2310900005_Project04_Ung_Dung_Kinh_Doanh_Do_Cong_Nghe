import React, { useState, useEffect } from 'react';
import { sanphamApi, userApi, donhangApi, giatrithuoctinhApi } from '../../api/tta_api';

export default function TtaDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    specs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resP, resU, resO, resS] = await Promise.all([
          sanphamApi.getAll(),
          userApi.getAll(),
          donhangApi.getAll(),
          giatrithuoctinhApi.getAll()
        ]);
        setStats({
          products: resP.data.data.total || 0,
          users: resU.data.data.total || 0,
          orders: resO.data.data.total || 0,
          specs: resS.data.data.total || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Sản phẩm', value: stats.products, icon: '📦', color: '#3182ce', bg: '#ebf8ff' },
    { title: 'Người dùng', value: stats.users, icon: '👥', color: '#38a169', bg: '#f0fff4' },
    { title: 'Đơn hàng', value: stats.orders, icon: '🛒', color: '#d69e2e', bg: '#fffaf0' },
    { title: 'Thông số kỹ thuật', value: stats.specs, icon: '⚙️', color: '#e53e3e', bg: '#fff5f5' }
  ];

  if (loading) return <div className="loading-state">Đang tải báo cáo tổng quát...</div>;

  return (
    <div className="page-container" style={{ padding: '30px', background: '#f4f7f9', minHeight: '100vh' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#2d3748' }}>👋 Chào mừng quay lại, Admin G5!</h1>
        <p style={{ color: '#718096', fontSize: '16px' }}>Dưới đây là tổng quan tình hình kinh doanh của cửa hàng hôm nay.</p>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '50px' }}>
        {statCards.map((card, idx) => (
          <div key={idx} className="card" style={{ 
            padding: '25px', 
            borderRadius: '20px', 
            border: 'none', 
            boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
            transition: 'transform 0.3s ease'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: '#718096', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '10px' }}>{card.title}</h4>
                <p style={{ fontSize: '32px', fontWeight: '800', color: '#2d3748', margin: 0 }}>{card.value}</p>
              </div>
              <div style={{ 
                width: '60px', height: '60px', 
                background: card.bg, color: card.color, 
                borderRadius: '15px', display: 'flex', 
                alignItems: 'center', justifyContent: 'center', 
                fontSize: '28px' 
              }}>
                {card.icon}
              </div>
            </div>
            <div style={{ marginTop: '20px', height: '4px', width: '100%', background: '#edf2f7', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: '70%', background: card.color, borderRadius: '2px' }}></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div className="card" style={{ padding: '30px', borderRadius: '20px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>🚀 Lối tắt quản lý nhanh</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <button className="btn" style={{ height: '100px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '15px', textAlign: 'left', padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>➕</div>
              <div style={{ fontWeight: '600' }}>Thêm sản phẩm mới</div>
            </button>
            <button className="btn" style={{ height: '100px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '15px', textAlign: 'left', padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>📐</div>
              <div style={{ fontWeight: '600' }}>Cấu hình danh mục</div>
            </button>
            <button className="btn" style={{ height: '100px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '15px', textAlign: 'left', padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>📄</div>
              <div style={{ fontWeight: '600' }}>Xem đơn hàng mới</div>
            </button>
            <button className="btn" style={{ height: '100px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '15px', textAlign: 'left', padding: '20px' }}>
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>⚡</div>
              <div style={{ fontWeight: '600' }}>Cập nhật thông số</div>
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: '30px', borderRadius: '20px', background: '#2d3748', color: 'white' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>🔔 Thông báo hệ thống</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '15px 0', borderBottom: '1px solid #4a5568', fontSize: '14px' }}>
              🟢 Hệ thống hoạt động bình thường
            </li>
            <li style={{ padding: '15px 0', borderBottom: '1px solid #4a5568', fontSize: '14px' }}>
              📦 Cần cập nhật ảnh cho 5 sản phẩm
            </li>
            <li style={{ padding: '15px 0', fontSize: '14px' }}>
              🛡️ Đã sao lưu database lúc 02:00 AM
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
