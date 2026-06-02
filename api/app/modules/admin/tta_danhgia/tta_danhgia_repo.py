from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import danhgia, user, sanpham

def get_all(params=None):
    stmt = select(
        danhgia, 
        user.c.G5_HoTen, 
        sanpham.c.G5_TenSanPham
    ).select_from(
        danhgia.join(user, danhgia.c.G5_MaNguoiDung == user.c.G5_MaNguoiDung)
        .join(sanpham, danhgia.c.G5_MaSanPham == sanpham.c.G5_MaSanPham)
    )
    
    if params and params.get('ma_sp'):
        stmt = stmt.where(danhgia.c.G5_MaSanPham == params['ma_sp'])
        
    stmt = stmt.order_by(danhgia.c.G5_NgayDanhGia.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._asdict()
            items.append({
                "MaDanhGia": row_dict['G5_MaDanhGia'],
                "MaSanPham": row_dict['G5_MaSanPham'],
                "TenSanPham": row_dict['G5_TenSanPham'],
                "MaNguoiDung": row_dict['G5_MaNguoiDung'],
                "HoTen": row_dict['G5_HoTen'],
                "SoSao": row_dict['G5_SoSao'],
                "BinhLuan": row_dict['G5_BinhLuan'],
                "NgayDanhGia": row_dict['G5_NgayDanhGia'].isoformat() if row_dict['G5_NgayDanhGia'] else None
            })
        return {"items": items, "total": len(items)}

from datetime import datetime

def create(data):
    # Helper to parse ISO dates
    def parse_date(date_str):
        if not date_str: return datetime.utcnow()
        try:
            return datetime.fromisoformat(date_str.replace('T', ' ') if 'T' in date_str else date_str)
        except:
            return datetime.utcnow()

    stmt = insert(danhgia).values(
        G5_MaSanPham=data.get('MaSanPham'),
        G5_MaNguoiDung=data.get('MaNguoiDung'),
        G5_SoSao=data.get('SoSao'),
        G5_BinhLuan=data.get('BinhLuan'),
        G5_NgayDanhGia=parse_date(data.get('NgayDanhGia'))
    )
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_review(id):
    stmt = delete(danhgia).where(danhgia.c.G5_MaDanhGia == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
