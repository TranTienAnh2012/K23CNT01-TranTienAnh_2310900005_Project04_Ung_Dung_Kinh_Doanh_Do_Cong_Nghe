from sqlalchemy import text
from app.db.database import engine

def get_all(params=None):
    query = "SELECT * FROM G5_danhmuc WHERE G5_IsDeleted = 0"
    args = {}
    if params and params.get('q'):
        query += " AND G5_TenDanhMuc LIKE :q"
        args['q'] = f"%{params['q']}%"
    
    query += " ORDER BY G5_MaDanhMuc DESC"
    
    with engine.connect() as conn:
        result = conn.execute(text(query), args)
        items = []
        for row in result:
            items.append({
                "MaDanhMuc": row.G5_MaDanhMuc,
                "TenDanhMuc": row.G5_TenDanhMuc,
                "MoTa": row.G5_MoTa
            })
        return {"items": items, "total": len(items)}

def get_one(ma):
    query = "SELECT * FROM G5_danhmuc WHERE G5_MaDanhMuc = :ma"
    with engine.connect() as conn:
        row = conn.execute(text(query), {"ma": ma}).fetchone()
        if row:
            return {
                "MaDanhMuc": row.G5_MaDanhMuc,
                "TenDanhMuc": row.G5_TenDanhMuc,
                "MoTa": row.G5_MoTa
            }
        return None
