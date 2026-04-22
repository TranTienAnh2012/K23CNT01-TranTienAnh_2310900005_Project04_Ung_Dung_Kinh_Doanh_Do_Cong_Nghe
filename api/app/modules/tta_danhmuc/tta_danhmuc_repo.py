from sqlalchemy import text
from app.db.connection import engine

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

def get_by_id(ma):
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

def create(data):
    query = "INSERT INTO G5_danhmuc (G5_TenDanhMuc, G5_MoTa) VALUES (:ten, :mota)"
    with engine.connect() as conn:
        conn.execute(text(query), {"ten": data['TenDanhMuc'], "mota": data.get('MoTa')})
        conn.commit()

def update(ma, data):
    query = "UPDATE G5_danhmuc SET G5_TenDanhMuc = :ten, G5_MoTa = :mota WHERE G5_MaDanhMuc = :ma"
    with engine.connect() as conn:
        conn.execute(text(query), {"ten": data['TenDanhMuc'], "mota": data.get('MoTa'), "ma": ma})
        conn.commit()

def delete(ma):
    query = "UPDATE G5_danhmuc SET G5_IsDeleted = 1 WHERE G5_MaDanhMuc = :ma"
    with engine.connect() as conn:
        conn.execute(text(query), {"ma": ma})
        conn.commit()
