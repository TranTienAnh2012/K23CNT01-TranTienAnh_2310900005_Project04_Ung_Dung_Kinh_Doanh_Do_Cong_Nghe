from sqlalchemy import text
from app.db.connection import engine

def get_all(params=None):
    query = "SELECT * FROM G5_thuoctinh"
    args = {}
    if params and params.get('q'):
        query += " WHERE G5_TenThuocTinh LIKE :q"
        args['q'] = f"%{params['q']}%"
    
    query += " ORDER BY G5_ThuocTinhID DESC"
    
    with engine.connect() as conn:
        result = conn.execute(text(query), args)
        items = []
        for row in result:
            items.append({
                "ThuocTinhID": row.G5_ThuocTinhID,
                "TenThuocTinh": row.G5_TenThuocTinh
            })
        return {"items": items, "total": len(items)}

def get_by_id(ma):
    query = "SELECT * FROM G5_thuoctinh WHERE G5_ThuocTinhID = :ma"
    with engine.connect() as conn:
        row = conn.execute(text(query), {"ma": ma}).fetchone()
        if not row:
            return None
        return {
            "ThuocTinhID": row.G5_ThuocTinhID,
            "TenThuocTinh": row.G5_TenThuocTinh
        }

def create(data):
    query = "INSERT INTO G5_thuoctinh (G5_TenThuocTinh) VALUES (:ten)"
    with engine.connect() as conn:
        conn.execute(text(query), {"ten": data.get('TenThuocTinh')})
        conn.commit()

def update(ma, data):
    query = "UPDATE G5_thuoctinh SET G5_TenThuocTinh = :ten WHERE G5_ThuocTinhID = :ma"
    with engine.connect() as conn:
        conn.execute(text(query), {"ten": data.get('TenThuocTinh'), "ma": ma})
        conn.commit()

def delete(ma):
    query = "DELETE FROM G5_thuoctinh WHERE G5_ThuocTinhID = :ma"
    with engine.connect() as conn:
        conn.execute(text(query), {"ma": ma})
        conn.commit()
