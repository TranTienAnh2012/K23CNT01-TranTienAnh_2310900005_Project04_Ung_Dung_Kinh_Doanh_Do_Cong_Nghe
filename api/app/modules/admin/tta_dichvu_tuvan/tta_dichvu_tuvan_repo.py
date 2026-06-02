from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import dichvu_tuvan

def get_all(params=None):
    stmt = select(dichvu_tuvan)
    
    if 'G5_IsDeleted' in [c.name for c in dichvu_tuvan.columns]:
        stmt = stmt.where(dichvu_tuvan.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(dichvu_tuvan.c.G5_Id.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = [dict(row._mapping) for row in result]
        return {"items": items, "total": len(items)}

def get_by_id(id):
    stmt = select(dichvu_tuvan).where(dichvu_tuvan.c.G5_Id == id)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        return dict(row._mapping)

def create(data):
    stmt = insert(dichvu_tuvan).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_item(id, data):
    stmt = update(dichvu_tuvan).where(dichvu_tuvan.c.G5_Id == id).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_item(id):
    if 'G5_IsDeleted' in [c.name for c in dichvu_tuvan.columns]:
        stmt = update(dichvu_tuvan).where(dichvu_tuvan.c.G5_Id == id).values(G5_IsDeleted=1)
    else:
        stmt = delete(dichvu_tuvan).where(dichvu_tuvan.c.G5_Id == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
