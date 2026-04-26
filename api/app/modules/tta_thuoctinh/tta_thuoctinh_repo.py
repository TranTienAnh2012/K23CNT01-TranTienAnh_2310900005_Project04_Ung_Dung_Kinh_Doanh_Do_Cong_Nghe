from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import thuoctinh

def get_all(params=None):
    stmt = select(thuoctinh)
    
    if params and params.get('q'):
        stmt = stmt.where(thuoctinh.c.G5_TenThuocTinh.like(f"%{params['q']}%"))
    
    stmt = stmt.order_by(thuoctinh.c.G5_ThuocTinhID.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._asdict()
            items.append({
                "ThuocTinhID": row_dict['G5_ThuocTinhID'],
                "TenThuocTinh": row_dict['G5_TenThuocTinh']
            })
        return {"items": items, "total": len(items)}

def get_by_id(ma):
    stmt = select(thuoctinh).where(thuoctinh.c.G5_ThuocTinhID == ma)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        row_dict = row._asdict()
        return {
            "ThuocTinhID": row_dict['G5_ThuocTinhID'],
            "TenThuocTinh": row_dict['G5_TenThuocTinh']
        }

def create(data):
    stmt = insert(thuoctinh).values(G5_TenThuocTinh=data.get('TenThuocTinh'))
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_thuoctinh(ma, data):
    stmt = update(thuoctinh).where(thuoctinh.c.G5_ThuocTinhID == ma).values(G5_TenThuocTinh=data.get('TenThuocTinh'))
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_thuoctinh(ma):
    # Hard delete as in original repo
    stmt = delete(thuoctinh).where(thuoctinh.c.G5_ThuocTinhID == ma)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
