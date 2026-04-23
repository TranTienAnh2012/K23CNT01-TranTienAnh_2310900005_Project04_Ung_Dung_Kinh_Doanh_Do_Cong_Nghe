from sqlalchemy import select, insert, update
from app.db.connection import engine
from app.models.schema import donhang

def get_all(params=None):
    stmt = select(donhang).where(donhang.c.G5_IsDeleted == 0)
    
    if params and params.get('q'):
        stmt = stmt.where(donhang.c.G5_MaDonHang.like(f"%{params['q']}%"))
    
    stmt = stmt.order_by(donhang.c.G5_NgayDatHang.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._mapping
            items.append({
                "MaDonHang": row_dict['G5_MaDonHang'],
                "NgayDatHang": row_dict['G5_NgayDatHang'].isoformat() if row_dict['G5_NgayDatHang'] else None,
                "TongTien": float(row_dict['G5_TongTien']) if row_dict['G5_TongTien'] else 0,
                "TrangThai": row_dict['G5_TrangThai'],
                "HoTenNguoiNhan": row_dict['G5_HoTenNguoiNhan'],
                "SoDienThoai": row_dict['G5_SoDienThoaiNguoiNhan']
            })
        return {"orders": items, "total": len(items)}

def get_by_id(ma):
    stmt = select(donhang).where(donhang.c.G5_MaDonHang == ma)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if row:
            row_dict = row._mapping
            return {
                "MaDonHang": row_dict['G5_MaDonHang'],
                "NgayDatHang": row_dict['G5_NgayDatHang'].isoformat() if row_dict['G5_NgayDatHang'] else None,
                "TongTien": float(row_dict['G5_TongTien']) if row_dict['G5_TongTien'] else 0,
                "TrangThai": row_dict['G5_TrangThai'],
                "HoTenNguoiNhan": row_dict['G5_HoTenNguoiNhan'],
                "SoDienThoai": row_dict['G5_SoDienThoaiNguoiNhan'],
                "DiaChi": row_dict['G5_DiaChiNguoiNhan'],
                "GhiChu": row_dict['G5_GhiChu']
            }
        return None

def create(data):
    stmt = insert(donhang).values(
        G5_HoTenNguoiNhan=data['HoTenNguoiNhan'],
        G5_SoDienThoaiNguoiNhan=data['SoDienThoai'],
        G5_DiaChiNguoiNhan=data['DiaChi'],
        G5_TongTien=data['TongTien'],
        G5_TrangThai='Pending'
    )
    with engine.connect() as conn:
        result = conn.execute(stmt)
        conn.commit()
        return result.lastrowid

def update_status(ma, status):
    stmt = update(donhang).where(donhang.c.G5_MaDonHang == ma).values(G5_TrangThai=status)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
        return True

def delete_donhang(ma):
    stmt = update(donhang).where(donhang.c.G5_MaDonHang == ma).values(G5_IsDeleted=1)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
        return True
