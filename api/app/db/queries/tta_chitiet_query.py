from sqlalchemy import text
from app.db.database import engine

def get_all(params=None):
    query = """
        SELECT ct.*, sp.G5_TenSanPham, sp.G5_GiaBan
        FROM G5_chitietdonhang ct
        JOIN G5_sanpham sp ON ct.G5_MaSanPham = sp.G5_MaSanPham
    """
    args = {}
    if params and params.get('ma_don_hang'):
        query += " WHERE ct.G5_MaDonHang = :ma"
        args['ma'] = params['ma_don_hang']
    
    with engine.connect() as conn:
        result = conn.execute(text(query), args)
        items = []
        for row in result:
            items.append({
                "MaChiTiet": row.G5_MaChiTiet,
                "MaDonHang": row.G5_MaDonHang,
                "MaSanPham": row.G5_MaSanPham,
                "TenSanPham": row.G5_TenSanPham,
                "GiaBan": row.G5_GiaBan,
                "SoLuong": row.G5_SoLuong,
                "ThanhTien": row.G5_SoLuong * row.G5_GiaBan
            })
        return {"items": items, "total": len(items)}
