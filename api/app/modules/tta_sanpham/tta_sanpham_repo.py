from sqlalchemy import text
from app.db.connection import engine # Cập nhật từ database sang connection

def get_all(params=None):
    query = """
        SELECT sp.*, dm.G5_TenDanhMuc 
        FROM G5_sanpham sp
        JOIN G5_danhmuc dm ON sp.G5_MaDanhMuc = dm.G5_MaDanhMuc
        WHERE sp.G5_IsDeleted = 0
    """
    args = {}
    if params and params.get('q'):
        query += " AND sp.G5_TenSanPham LIKE :q"
        args['q'] = f"%{params['q']}%"
    
    query += " ORDER BY sp.G5_MaSanPham DESC"
    
    with engine.connect() as conn:
        result = conn.execute(text(query), args)
        items = []
        for row in result:
            items.append({
                "MaSanPham": row.G5_MaSanPham,
                "TenSanPham": row.G5_TenSanPham,
                "TenDanhMuc": row.G5_TenDanhMuc,
                "Gia": row.G5_GiaGoc,
                "GiaBan": row.G5_GiaBan,
                "SoLuongTon": row.G5_SoLuongTon,
                "TrangThai": row.G5_TrangThai,
                "HinhAnh": row.G5_HinhAnh
            })
        return {"items": items, "total": len(items)}

def get_by_id(ma_sp):
    query = """
        SELECT sp.*, dm.G5_TenDanhMuc 
        FROM G5_sanpham sp
        JOIN G5_danhmuc dm ON sp.G5_MaDanhMuc = dm.G5_MaDanhMuc
        WHERE sp.G5_MaSanPham = :ma_sp
    """
    with engine.connect() as conn:
        row = conn.execute(text(query), {"ma_sp": ma_sp}).fetchone()
        if not row:
            return None
            
        return {
            "MaSanPham": row.G5_MaSanPham,
            "TenSanPham": row.G5_TenSanPham,
            "TenDanhMuc": row.G5_TenDanhMuc,
            "Gia": row.G5_GiaGoc,
            "GiaBan": row.G5_GiaBan,
            "SoLuongTon": row.G5_SoLuongTon,
            "TrangThai": row.G5_TrangThai,
            "HinhAnh": row.G5_HinhAnh
        }
