from sqlalchemy import text
from app.db.connection import engine

def get_all(params=None):
    with engine.connect() as conn:
        query = """
            SELECT ct.G5_MaChiTiet AS MaChiTiet, ct.G5_MaDonHang AS MaDonHang, 
                   ct.G5_MaSanPham AS MaSanPham, ct.G5_SoLuong AS SoLuong,
                   sp.G5_TenSanPham AS TenSanPham, sp.G5_HinhAnh AS HinhAnh, sp.G5_GiaBan AS DonGia,
                   dh.G5_HoTenNguoiNhan AS HoTenNguoiNhan, dh.G5_NgayDatHang AS NgayDatHang
            FROM G5_chitietdonhang ct
            JOIN G5_sanpham sp ON ct.G5_MaSanPham = sp.G5_MaSanPham
            JOIN G5_donhang dh ON ct.G5_MaDonHang = dh.G5_MaDonHang
            WHERE 1=1
        """
        args = {}
        if params:
            if params.get("ma_don_hang"):
                query += " AND ct.G5_MaDonHang = :ma_don"
                args["ma_don"] = params["ma_don_hang"]
            if params.get("q"):
                query += " AND (sp.G5_TenSanPham LIKE :q OR CAST(ct.G5_MaDonHang AS VARCHAR) LIKE :q)"
                args["q"] = f"%{params['q']}%"
        
        query += " ORDER BY dh.G5_NgayDatHang DESC"
        result = conn.execute(text(query), args)
        items = [dict(row._mapping) for row in result]
        
        total = conn.execute(text("SELECT COUNT(*) FROM G5_chitietdonhang")).scalar()
        return {"items": items, "total": total}

def get_by_id(ma):
    with engine.connect() as conn:
        query = """
            SELECT ct.G5_MaChiTiet AS MaChiTiet, ct.G5_MaDonHang AS MaDonHang, 
                   ct.G5_MaSanPham AS MaSanPham, ct.G5_SoLuong AS SoLuong,
                   sp.G5_TenSanPham AS TenSanPham, sp.G5_GiaBan AS gia_goc
            FROM G5_chitietdonhang ct
            JOIN G5_sanpham sp ON ct.G5_MaSanPham = sp.G5_MaSanPham
            WHERE ct.G5_MaChiTiet = :ma
        """
        row = conn.execute(text(query), {"ma": ma}).first()
        return dict(row._mapping) if row else None

def _recalculate_order_total(conn, order_id):
    new_total = conn.execute(text("""
        SELECT SUM(G5_SoLuong * G5_GiaBan) 
        FROM G5_chitietdonhang ct
        JOIN G5_sanpham sp ON ct.G5_MaSanPham = sp.G5_MaSanPham
        WHERE G5_MaDonHang = :oid
    """), {"oid": order_id}).scalar() or 0
    
    conn.execute(text("UPDATE G5_donhang SET G5_TongTien = :total WHERE G5_MaDonHang = :oid"), 
                 {"total": new_total, "oid": order_id})

def update_qty(ma, new_qty):
    with engine.begin() as conn:
        item = conn.execute(text("SELECT G5_MaDonHang, G5_MaSanPham, G5_SoLuong FROM G5_chitietdonhang WHERE G5_MaChiTiet = :ma"), {"ma": ma}).first()
        if not item: return False
        
        diff = new_qty - item.G5_SoLuong
        conn.execute(text("UPDATE G5_sanpham SET G5_SoLuongTon = G5_SoLuongTon - :diff WHERE G5_MaSanPham = :pid"), 
                     {"diff": diff, "pid": item.G5_MaSanPham})
        
        conn.execute(text("UPDATE G5_chitietdonhang SET G5_SoLuong = :qty WHERE G5_MaChiTiet = :ma"), 
                     {"qty": new_qty, "ma": ma})
        
        _recalculate_order_total(conn, item.G5_MaDonHang)
        return True

def delete(ma):
    with engine.begin() as conn:
        item = conn.execute(text("SELECT G5_MaDonHang, G5_MaSanPham, G5_SoLuong FROM G5_chitietdonhang WHERE G5_MaChiTiet = :ma"), {"ma": ma}).first()
        if not item: return False
        
        conn.execute(text("UPDATE G5_sanpham SET G5_SoLuongTon = G5_SoLuongTon + :qty WHERE G5_MaSanPham = :pid"), 
                     {"qty": item.G5_SoLuong, "pid": item.G5_MaSanPham})
        
        conn.execute(text("DELETE FROM G5_chitietdonhang WHERE G5_MaChiTiet = :ma"), {"ma": ma})
        
        _recalculate_order_total(conn, item.G5_MaDonHang)
        return True
