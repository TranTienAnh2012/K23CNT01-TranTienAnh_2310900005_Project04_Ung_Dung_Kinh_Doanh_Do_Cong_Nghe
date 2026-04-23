from sqlalchemy import select, insert, update, delete, or_
from app.db.connection import engine
from app.models.schema import sanpham, danhmuc

def get_all(params=None):
    stmt = select(
        sanpham, 
        danhmuc.c.G5_TenDanhMuc
    ).select_from(
        sanpham.join(danhmuc, sanpham.c.G5_MaDanhMuc == danhmuc.c.G5_MaDanhMuc)
    ).where(sanpham.c.G5_IsDeleted == 0)
    
    if params and params.get('q'):
        stmt = stmt.where(sanpham.c.G5_TenSanPham.like(f"%{params['q']}%"))
    
    stmt = stmt.order_by(sanpham.c.G5_MaSanPham.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            # Map Row to dict using column names
            row_dict = row._mapping
            items.append({
                "MaSanPham": row_dict['G5_MaSanPham'],
                "TenSanPham": row_dict['G5_TenSanPham'],
                "TenDanhMuc": row_dict['G5_TenDanhMuc'],
                "Gia": float(row_dict['G5_GiaGoc']) if row_dict['G5_GiaGoc'] else 0,
                "GiaBan": float(row_dict['G5_GiaBan']) if row_dict['G5_GiaBan'] else 0,
                "SoLuongTon": row_dict['G5_SoLuongTon'],
                "TrangThai": row_dict['G5_TrangThai'],
                "HinhAnh": row_dict['G5_HinhAnh']
            })
        return {"items": items, "total": len(items)}

def get_by_id(ma_sp):
    stmt = select(
        sanpham, 
        danhmuc.c.G5_TenDanhMuc
    ).select_from(
        sanpham.join(danhmuc, sanpham.c.G5_MaDanhMuc == danhmuc.c.G5_MaDanhMuc)
    ).where(sanpham.c.G5_MaSanPham == ma_sp)
    
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
            
        row_dict = row._mapping
        return {
            "MaSanPham": row_dict['G5_MaSanPham'],
            "TenSanPham": row_dict['G5_TenSanPham'],
            "TenDanhMuc": row_dict['G5_TenDanhMuc'],
            "Gia": float(row_dict['G5_GiaGoc']) if row_dict['G5_GiaGoc'] else 0,
            "GiaBan": float(row_dict['G5_GiaBan']) if row_dict['G5_GiaBan'] else 0,
            "SoLuongTon": row_dict['G5_SoLuongTon'],
            "TrangThai": row_dict['G5_TrangThai'],
            "HinhAnh": row_dict['G5_HinhAnh']
        }

def create(data):
    stmt = insert(sanpham).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_product(ma_sp, data):
    stmt = update(sanpham).where(sanpham.c.G5_MaSanPham == ma_sp).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_product(ma_sp):
    # Soft delete
    stmt = update(sanpham).where(sanpham.c.G5_MaSanPham == ma_sp).values(G5_IsDeleted=1)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
