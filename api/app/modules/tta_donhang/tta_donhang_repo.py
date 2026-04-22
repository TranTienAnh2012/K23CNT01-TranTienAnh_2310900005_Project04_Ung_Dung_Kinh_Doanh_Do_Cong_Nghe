from sqlalchemy import text
from app.db.connection import engine

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

def get_by_id(ma):
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

def create(data):
    # Logic tạo đơn hàng (sẽ phức tạp hơn vì cần chi tiết đơn hàng)
    query = """
        INSERT INTO G5_donhang (G5_HoTenNguoiNhan, G5_SoDienThoaiNguoiNhan, G5_DiaChiNguoiNhan, G5_TongTien, G5_TrangThai)
        VALUES (:hoten, :sdt, :diachi, :tongtien, 'Pending')
    """
    with engine.connect() as conn:
        result = conn.execute(text(query), {
            "hoten": data['HoTenNguoiNhan'],
            "sdt": data['SoDienThoai'],
            "diachi": data['DiaChi'],
            "tongtien": data['TongTien']
        })
        conn.commit()
        return result.lastrowid

def update_status(ma, status):
    query = "UPDATE G5_donhang SET G5_TrangThai = :status WHERE G5_MaDonHang = :ma"
    with engine.connect() as conn:
        conn.execute(text(query), {"status": status, "ma": ma})
        conn.commit()
        return True

def delete(ma):
    query = "UPDATE G5_donhang SET G5_IsDeleted = 1 WHERE G5_MaDonHang = :ma"
    with engine.connect() as conn:
        conn.execute(text(query), {"ma": ma})
        conn.commit()
        return True
