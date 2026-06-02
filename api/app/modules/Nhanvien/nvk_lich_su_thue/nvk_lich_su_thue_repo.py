from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import lich_su_thue

import datetime
import decimal

def serialize_row(row_dict):
    if not row_dict:
        return None
    new_dict = {}
    for k, v in row_dict.items():
        if isinstance(v, (datetime.datetime, datetime.date)):
            new_dict[k] = v.isoformat()
        elif isinstance(v, decimal.Decimal):
            new_dict[k] = float(v)
        else:
            new_dict[k] = v
    return new_dict

def get_all(params=None):
    from app.models.schema import donhang_thue, user, sanpham
    
    stmt = select(
        lich_su_thue.c.G5_Id,
        lich_su_thue.c.G5_MaSanPham,
        lich_su_thue.c.G5_MaDonThue,
        lich_su_thue.c.G5_TrangThai,
        lich_su_thue.c.G5_ThoiDiem,
        sanpham.c.G5_TenSanPham,
        sanpham.c.G5_HinhAnh,
        user.c.G5_HoTen,
        user.c.G5_Email,
        user.c.G5_SDT
    ).select_from(
        lich_su_thue
        .join(sanpham, lich_su_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
        .join(donhang_thue, lich_su_thue.c.G5_MaDonThue == donhang_thue.c.G5_MaDonThue)
        .outerjoin(user, donhang_thue.c.G5_MaNguoiDung == user.c.G5_MaNguoiDung)
    )
    
    if 'G5_IsDeleted' in [c.name for c in lich_su_thue.columns]:
        stmt = stmt.where(lich_su_thue.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(lich_su_thue.c.G5_Id.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = [serialize_row(dict(row._mapping)) for row in result]
        return {"items": items, "total": len(items)}

def get_by_id(id):
    from app.models.schema import donhang_thue, user, sanpham
    
    stmt = select(
        lich_su_thue.c.G5_Id,
        lich_su_thue.c.G5_MaSanPham,
        lich_su_thue.c.G5_MaDonThue,
        lich_su_thue.c.G5_TrangThai,
        lich_su_thue.c.G5_ThoiDiem,
        sanpham.c.G5_TenSanPham,
        sanpham.c.G5_HinhAnh,
        user.c.G5_HoTen,
        user.c.G5_Email,
        user.c.G5_SDT
    ).select_from(
        lich_su_thue
        .join(sanpham, lich_su_thue.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
        .join(donhang_thue, lich_su_thue.c.G5_MaDonThue == donhang_thue.c.G5_MaDonThue)
        .outerjoin(user, donhang_thue.c.G5_MaNguoiDung == user.c.G5_MaNguoiDung)
    ).where(lich_su_thue.c.G5_Id == id)
    
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        return serialize_row(dict(row._mapping))

def create(data):
    stmt = insert(lich_su_thue).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_item(id, data):
    stmt = update(lich_su_thue).where(lich_su_thue.c.G5_Id == id).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_item(id):
    if 'G5_IsDeleted' in [c.name for c in lich_su_thue.columns]:
        stmt = update(lich_su_thue).where(lich_su_thue.c.G5_Id == id).values(G5_IsDeleted=1)
    else:
        stmt = delete(lich_su_thue).where(lich_su_thue.c.G5_Id == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
