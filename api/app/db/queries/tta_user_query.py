from sqlalchemy import text
from app.db.database import engine

def get_all(params=None):
    query = "SELECT * FROM G5_user WHERE G5_IsDeleted = 0"
    args = {}
    if params and params.get('q'):
        query += " AND (G5_HoTen LIKE :q OR G5_Email LIKE :q)"
        args['q'] = f"%{params['q']}%"
    
    query += " ORDER BY G5_MaNguoiDung DESC"
    
    with engine.connect() as conn:
        result = conn.execute(text(query), args)
        items = []
        for row in result:
            items.append({
                "MaNguoiDung": row.G5_MaNguoiDung,
                "HoTen": row.G5_HoTen,
                "Email": row.G5_Email,
                "SDT": row.G5_SDT,
                "VaiTro": row.G5_VaiTro,
                "NgayDangKy": row.G5_NgayDangKy.isoformat() if row.G5_NgayDangKy else None
            })
        return {"items": items, "total": len(items)}
