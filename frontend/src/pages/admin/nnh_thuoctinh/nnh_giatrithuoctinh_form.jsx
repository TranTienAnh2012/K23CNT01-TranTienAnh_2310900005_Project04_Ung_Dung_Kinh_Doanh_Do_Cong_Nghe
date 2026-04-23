import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sanphamApi, danhmucThuoctinhApi, giatrithuoctinhApi } from '../../../api/tta_api';

export default function TtaGiaTriThuocTinhForm() {
  const { ma } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [categoryAttrs, setCategoryAttrs] = useState([]);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProd = await sanphamApi.getOne(ma);
        const prod = resProd.data.data;
        setProduct(prod);

        // Fetch attributes linked to this product's category
        const resAttrs = await danhmucThuoctinhApi.getAll({ ma_danh_muc: prod.MaDanhMuc });
        setCategoryAttrs(resAttrs.data.data.items);

        // Fetch existing values for this product
        const resValues = await giatrithuoctinhApi.getBySanPham(ma);
        const existingValues = {};
        resValues.data.data.forEach(item => {
          existingValues[item.ThuocTinhID] = {
            id: item.GiaTriID,
            value: item.GiaTri
          };
        });
        setValues(existingValues);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ma]);

  const handleInputChange = (attrId, value) => {
    setValues(prev => ({
      ...prev,
      [attrId]: {
        ...prev[attrId],
        value: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      for (const attr of categoryAttrs) {
        const data = values[attr.ThuocTinhID];
        if (data && data.value) {
          if (data.id) {
            // Update
            await giatrithuoctinhApi.update(data.id, { GiaTri: data.value });
          } else {
            // Create
            await giatrithuoctinhApi.create({
              MaSanPham: ma,
              ThuocTinhID: attr.ThuocTinhID,
              GiaTri: data.value
            });
          }
        }
      }
      alert('Cập nhật thông số thành công!');
      navigate('/admin/san-pham');
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu thông số.');
    }
  };

  if (loading) return <div>Đang tải thông số...</div>;

  return (
    <div className="page-container">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">⚙️ Thông số sản phẩm: {product?.TenSanPham}</h3>
        </div>
        <div className="card-body">
          <div className="form-specs">
            {categoryAttrs.length === 0 && <p>Chưa có thông số nào được thiết lập cho danh mục này.</p>}
            {categoryAttrs.map(attr => (
              <div key={attr.ThuocTinhID} className="form-group">
                <label>{attr.TenThuocTinh}</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={values[attr.ThuocTinhID]?.value || ''}
                  onChange={(e) => handleInputChange(attr.ThuocTinhID, e.target.value)}
                  placeholder={`Nhập ${attr.TenThuocTinh.toLowerCase()}...`}
                />
              </div>
            ))}
          </div>
          <div className="form-actions" style={{ marginTop: '20px' }}>
            <button className="btn btn-primary" onClick={handleSave}>Lưu thay đổi</button>
            <button className="btn btn-secondary" onClick={() => navigate('/admin/san-pham')}>Hủy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
