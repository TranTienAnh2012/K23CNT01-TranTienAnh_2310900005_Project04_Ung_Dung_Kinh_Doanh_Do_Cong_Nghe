"""
Dien Tu Store - Order Detail Queries (tta_chitietdonhang_query)
Handles CRUD for G5_chitietdonhang with stock and parent total sync.
"""
from sqlalchemy import text
from app.db.database import engine

def get_all(params=None):
    with engine.connect() as conn:
        query = """
            SELECT ct.*, sp.TenSanPham, sp.HinhAnh, dh.HoTenNguoiNhan, dh.NgayDatHang
            FROM G5_chitietdonhang ct
            JOIN G5_sanpham sp ON ct.MaSanPham = sp.MaSanPham
            JOIN G5_donhang dh ON ct.MaDonHang = dh.MaDonHang
            WHERE 1=1
        """
        args = {}
        if params:
            if params.get("ma_don_hang"):
                query += " AND ct.MaDonHang = :ma_don"
                args["ma_don"] = params["ma_don_hang"]
            if params.get("q"):
                query += " AND (sp.TenSanPham LIKE :q OR CAST(ct.MaDonHang AS VARCHAR) LIKE :q)"
                args["q"] = f"%{params['q']}%"
        
        query += " ORDER BY dh.NgayDatHang DESC"
        result = conn.execute(text(query), args)
        items = [dict(row._mapping) for row in result]
        
        total = conn.execute(text("SELECT COUNT(*) FROM G5_chitietdonhang")).scalar()
        return {"items": items, "total": total}

def get_by_id(ma):
    with engine.connect() as conn:
        query = """
            SELECT ct.*, sp.TenSanPham, sp.Gia 
            FROM G5_chitietdonhang ct
            JOIN G5_sanpham sp ON ct.MaSanPham = sp.MaSanPham
            WHERE ct.MaChiTiet = :ma
        """
        row = conn.execute(text(query), {"ma": ma}).first()
        return dict(row._mapping) if row else None

def _recalculate_order_total(conn, order_id):
    """Internal helper to sync parent order total."""
    new_total = conn.execute(text("""
        SELECT SUM(SoLuong * DonGia) 
        FROM G5_chitietdonhang 
        WHERE MaDonHang = :oid
    """), {"oid": order_id}).scalar() or 0
    
    conn.execute(text("UPDATE G5_donhang SET TongTien = :total WHERE MaDonHang = :oid"), 
                 {"total": new_total, "oid": order_id})

def update_item_qty(ma, new_qty):
    with engine.begin() as conn:
        # 1. Get current state
        item = conn.execute(text("SELECT MaDonHang, MaSanPham, SoLuong FROM G5_chitietdonhang WHERE MaChiTiet = :ma"), {"ma": ma}).first()
        if not item: return False
        
        diff = new_qty - item.SoLuong
        
        # 2. Update stock (if qty increased, deduct more; if decreased, restore diff)
        conn.execute(text("UPDATE G5_sanpham SET SoLuongTon = SoLuongTon - :diff WHERE MaSanPham = :pid"), 
                     {"diff": diff, "pid": item.MaSanPham})
        
        # 3. Update Detail
        conn.execute(text("UPDATE G5_chitietdonhang SET SoLuong = :qty WHERE MaChiTiet = :ma"), 
                     {"qty": new_qty, "ma": ma})
        
        # 4. Sync parent total
        _recalculate_order_total(conn, item.MaDonHang)
        return True

def delete_item(ma):
    with engine.begin() as conn:
        # 1. Get current state
        item = conn.execute(text("SELECT MaDonHang, MaSanPham, SoLuong FROM G5_chitietdonhang WHERE MaChiTiet = :ma"), {"ma": ma}).first()
        if not item: return False
        
        # 2. Restore stock
        conn.execute(text("UPDATE G5_sanpham SET SoLuongTon = SoLuongTon + :qty WHERE MaSanPham = :pid"), 
                     {"qty": item.SoLuong, "pid": item.MaSanPham})
        
        # 3. Delete row
        conn.execute(text("DELETE FROM G5_chitietdonhang WHERE MaChiTiet = :ma"), {"ma": ma})
        
        # 4. Sync parent total
        _recalculate_order_total(conn, item.MaDonHang)
        return True
