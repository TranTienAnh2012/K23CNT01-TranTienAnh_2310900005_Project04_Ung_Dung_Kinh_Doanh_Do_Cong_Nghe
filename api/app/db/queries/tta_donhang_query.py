from sqlalchemy import text
from app.db.database import engine

def get_all(params=None):
    query = "SELECT * FROM G5_donhang WHERE G5_IsDeleted = 0"
    args = {}
    if params and params.get('q'):
        query += " AND G5_MaDonHang LIKE :q"
        args['q'] = f"%{params['q']}%"
    
    query += " ORDER BY G5_NgayDatHang DESC"
    
    with engine.connect() as conn:
        result = conn.execute(text(query), args)
        items = []
        for row in result:
            items.append({
                "MaDonHang": row.G5_MaDonHang,
                "NgayDatHang": row.G5_NgayDatHang.isoformat() if row.G5_NgayDatHang else None,
                "TongTien": row.G5_TongTien,
                "TrangThai": row.G5_TrangThai,
                "HoTenNguoiNhan": row.G5_HoTenNguoiNhan,
                "SoDienThoai": row.G5_SoDienThoaiNguoiNhan
            })
        return {"orders": items, "total": len(items)}

def get_one(ma):
    query = "SELECT * FROM G5_donhang WHERE G5_MaDonHang = :ma"
    with engine.connect() as conn:
        row = conn.execute(text(query), {"ma": ma}).fetchone()
        if row:
            return {
                "MaDonHang": row.G5_MaDonHang,
                "NgayDatHang": row.G5_NgayDatHang.isoformat() if row.G5_NgayDatHang else None,
                "TongTien": row.G5_TongTien,
                "TrangThai": row.G5_TrangThai,
                "HoTenNguoiNhan": row.G5_HoTenNguoiNhan,
                "SoDienThoai": row.G5_SoDienThoaiNguoiNhan,
                "DiaChi": row.G5_DiaChiNguoiNhan,
                "GhiChu": row.G5_GhiChu
            }
        return None
