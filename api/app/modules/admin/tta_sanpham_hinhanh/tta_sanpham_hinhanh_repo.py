from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import sanpham_hinhanh

def get_all(params=None):
    stmt = select(sanpham_hinhanh)
    
    if 'G5_IsDeleted' in [c.name for c in sanpham_hinhanh.columns]:
        stmt = stmt.where(sanpham_hinhanh.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(sanpham_hinhanh.c.G5_Id.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = [dict(row._mapping) for row in result]
        return {"items": items, "total": len(items)}

def get_by_id(id):
    stmt = select(sanpham_hinhanh).where(sanpham_hinhanh.c.G5_Id == id)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        return dict(row._mapping)

def create(data):
    stmt = insert(sanpham_hinhanh).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_item(id, data):
    stmt = update(sanpham_hinhanh).where(sanpham_hinhanh.c.G5_Id == id).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_item(id):
    if 'G5_IsDeleted' in [c.name for c in sanpham_hinhanh.columns]:
        stmt = update(sanpham_hinhanh).where(sanpham_hinhanh.c.G5_Id == id).values(G5_IsDeleted=1)
    else:
        stmt = delete(sanpham_hinhanh).where(sanpham_hinhanh.c.G5_Id == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
