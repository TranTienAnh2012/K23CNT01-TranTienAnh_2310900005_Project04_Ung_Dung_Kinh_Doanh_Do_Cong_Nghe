from sqlalchemy import select
from app.db.connection import engine
from app.models.schema import sanpham, danhmuc, giatrithuoctinh, thuoctinh

def get_all(params=None):
    # Dành cho client: Chỉ hiện sản phẩm chưa bị xóa (G5_IsDeleted == 0) và đang bán (G5_TrangThai == 1)
    stmt = select(
        sanpham, 
        danhmuc.c.G5_TenDanhMuc
    ).select_from(
        sanpham.join(danhmuc, sanpham.c.G5_MaDanhMuc == danhmuc.c.G5_MaDanhMuc)
    ).where(sanpham.c.G5_IsDeleted == 0, sanpham.c.G5_TrangThai == 1)
    
    if params and params.get('q'):
        stmt = stmt.where(sanpham.c.G5_TenSanPham.like(f"%{params['q']}%"))
    
    stmt = stmt.order_by(sanpham.c.G5_MaSanPham.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._mapping
            items.append({
                "MaSanPham": row_dict['G5_MaSanPham'],
                "TenSanPham": row_dict['G5_TenSanPham'],
                "MaDanhMuc": row_dict['G5_MaDanhMuc'],
                "TenDanhMuc": row_dict['G5_TenDanhMuc'],
                "Gia": float(row_dict['G5_GiaGoc']) if row_dict['G5_GiaGoc'] else 0,
                "GiaBan": float(row_dict['G5_GiaBan']) if row_dict['G5_GiaBan'] else 0,
                "SoLuongTon": row_dict['G5_SoLuongTon'],
                "TrangThai": row_dict['G5_TrangThai'],
                "HinhAnh": row_dict['G5_HinhAnh']
            })
        return {"items": items, "total": len(items)}

def get_by_id(ma_sp):
    stmt = select(
        sanpham, 
        danhmuc.c.G5_TenDanhMuc
    ).select_from(
        sanpham.join(danhmuc, sanpham.c.G5_MaDanhMuc == danhmuc.c.G5_MaDanhMuc)
    ).where(sanpham.c.G5_MaSanPham == ma_sp, sanpham.c.G5_IsDeleted == 0, sanpham.c.G5_TrangThai == 1)
    
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
            
        row_dict = row._mapping
        
        # Lấy thông số kỹ thuật (attributes)
        stmt_attrs = select(
            giatrithuoctinh.c.G5_GiaTri,
            thuoctinh.c.G5_TenThuocTinh
        ).select_from(
            giatrithuoctinh.join(thuoctinh, giatrithuoctinh.c.G5_ThuocTinhID == thuoctinh.c.G5_ThuocTinhID)
        ).where(giatrithuoctinh.c.G5_MaSanPham == ma_sp)
        
        attrs_result = conn.execute(stmt_attrs)
        specifications = []
        for attr_row in attrs_result:
            attr_dict = attr_row._mapping
            specifications.append({
                "TenThuocTinh": attr_dict['G5_TenThuocTinh'],
                "GiaTri": attr_dict['G5_GiaTri']
            })
            
        return {
            "MaSanPham": row_dict['G5_MaSanPham'],
            "TenSanPham": row_dict['G5_TenSanPham'],
            "MaDanhMuc": row_dict['G5_MaDanhMuc'],
            "TenDanhMuc": row_dict['G5_TenDanhMuc'],
            "Gia": float(row_dict['G5_GiaGoc']) if row_dict['G5_GiaGoc'] else 0,
            "GiaBan": float(row_dict['G5_GiaBan']) if row_dict['G5_GiaBan'] else 0,
            "SoLuongTon": row_dict['G5_SoLuongTon'],
            "TrangThai": row_dict['G5_TrangThai'],
            "HinhAnh": row_dict['G5_HinhAnh'],
            "MoTa": row_dict['G5_MoTa'],
            "ThuongHieu": row_dict['G5_ThuongHieu'],
            "XuatXu": row_dict['G5_XuatXu'],
            "BaoHanh": row_dict['G5_BaoHanh'],
            "specifications": specifications
        }
