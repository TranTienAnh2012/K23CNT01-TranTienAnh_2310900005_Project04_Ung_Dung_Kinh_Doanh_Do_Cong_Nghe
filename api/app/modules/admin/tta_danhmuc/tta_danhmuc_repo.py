from sqlalchemy import select, insert, update
from app.db.connection import engine
from app.models.schema import danhmuc

def get_all(params=None):
    stmt = select(danhmuc).where(danhmuc.c.G5_IsDeleted == 0)
    
    if params and params.get('q'):
        stmt = stmt.where(danhmuc.c.G5_TenDanhMuc.like(f"%{params['q']}%"))
    
    stmt = stmt.order_by(danhmuc.c.G5_MaDanhMuc.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._mapping
            items.append({
                "MaDanhMuc": row_dict['G5_MaDanhMuc'],
                "TenDanhMuc": row_dict['G5_TenDanhMuc'],
                "MoTa": row_dict['G5_MoTa']
            })
        return {"items": items, "total": len(items)}

def get_by_id(ma):
    stmt = select(danhmuc).where(danhmuc.c.G5_MaDanhMuc == ma)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if row:
            row_dict = row._mapping
            return {
                "MaDanhMuc": row_dict['G5_MaDanhMuc'],
                "TenDanhMuc": row_dict['G5_TenDanhMuc'],
                "MoTa": row_dict['G5_MoTa']
            }
        return None

def create(data):
    stmt = insert(danhmuc).values(
        G5_TenDanhMuc=data['TenDanhMuc'],
        G5_MoTa=data.get('MoTa')
    )
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_danhmuc(ma, data):
    stmt = update(danhmuc).where(danhmuc.c.G5_MaDanhMuc == ma).values(
        G5_TenDanhMuc=data['TenDanhMuc'],
        G5_MoTa=data.get('MoTa')
    )
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_danhmuc(ma):
    stmt = update(danhmuc).where(danhmuc.c.G5_MaDanhMuc == ma).values(G5_IsDeleted=1)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
