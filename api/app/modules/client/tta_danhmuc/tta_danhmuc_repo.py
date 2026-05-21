from sqlalchemy import select
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
