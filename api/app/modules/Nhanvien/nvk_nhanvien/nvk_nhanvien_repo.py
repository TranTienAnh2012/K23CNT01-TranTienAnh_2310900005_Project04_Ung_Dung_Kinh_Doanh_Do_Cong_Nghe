from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import lich_tuvan_nhanvien

def get_all(params=None):
    from app.models.schema import user, lich_tuvan, dichvu_tuvan
    
    staff_user = user.alias("staff_user")
    customer_user = user.alias("customer_user")
    
    stmt = select(
        lich_tuvan_nhanvien.c.G5_Id,
        lich_tuvan_nhanvien.c.G5_MaLich,
        lich_tuvan_nhanvien.c.G5_MaNhanVien,
        staff_user.c.G5_HoTen.label("G5_TenNhanVien"),
        dichvu_tuvan.c.G5_TenDichVu,
        customer_user.c.G5_HoTen.label("G5_TenKhachHang"),
        lich_tuvan.c.G5_ThoiGianBatDau,
        lich_tuvan.c.G5_ThoiGianKetThuc
    ).select_from(
        lich_tuvan_nhanvien
        .outerjoin(staff_user, lich_tuvan_nhanvien.c.G5_MaNhanVien == staff_user.c.G5_MaNguoiDung)
        .outerjoin(lich_tuvan, lich_tuvan_nhanvien.c.G5_MaLich == lich_tuvan.c.G5_Id)
        .outerjoin(customer_user, lich_tuvan.c.G5_MaNguoiDung == customer_user.c.G5_MaNguoiDung)
        .outerjoin(dichvu_tuvan, lich_tuvan.c.G5_MaDichVu == dichvu_tuvan.c.G5_Id)
    )
    
    if params:
        if 'G5_MaNhanVien' in params and params['G5_MaNhanVien'] is not None:
            try:
                stmt = stmt.where(lich_tuvan_nhanvien.c.G5_MaNhanVien == int(params['G5_MaNhanVien']))
            except ValueError:
                pass
                
    if 'G5_IsDeleted' in [c.name for c in lich_tuvan_nhanvien.columns]:
        stmt = stmt.where(lich_tuvan_nhanvien.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(lich_tuvan_nhanvien.c.G5_Id.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = dict(row._mapping)
            if row_dict.get('G5_ThoiGianBatDau'):
                row_dict['G5_ThoiGianBatDau'] = row_dict['G5_ThoiGianBatDau'].isoformat()
            if row_dict.get('G5_ThoiGianKetThuc'):
                row_dict['G5_ThoiGianKetThuc'] = row_dict['G5_ThoiGianKetThuc'].isoformat()
            items.append(row_dict)
        return {"items": items, "total": len(items)}

def get_by_id(id):
    from app.models.schema import user, lich_tuvan, dichvu_tuvan
    
    staff_user = user.alias("staff_user")
    customer_user = user.alias("customer_user")
    
    stmt = select(
        lich_tuvan_nhanvien.c.G5_Id,
        lich_tuvan_nhanvien.c.G5_MaLich,
        lich_tuvan_nhanvien.c.G5_MaNhanVien,
        staff_user.c.G5_HoTen.label("G5_TenNhanVien"),
        dichvu_tuvan.c.G5_TenDichVu,
        customer_user.c.G5_HoTen.label("G5_TenKhachHang"),
        lich_tuvan.c.G5_ThoiGianBatDau,
        lich_tuvan.c.G5_ThoiGianKetThuc
    ).select_from(
        lich_tuvan_nhanvien
        .outerjoin(staff_user, lich_tuvan_nhanvien.c.G5_MaNhanVien == staff_user.c.G5_MaNguoiDung)
        .outerjoin(lich_tuvan, lich_tuvan_nhanvien.c.G5_MaLich == lich_tuvan.c.G5_Id)
        .outerjoin(customer_user, lich_tuvan.c.G5_MaNguoiDung == customer_user.c.G5_MaNguoiDung)
        .outerjoin(dichvu_tuvan, lich_tuvan.c.G5_MaDichVu == dichvu_tuvan.c.G5_Id)
    ).where(lich_tuvan_nhanvien.c.G5_Id == id)
    
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        row_dict = dict(row._mapping)
        if row_dict.get('G5_ThoiGianBatDau'):
            row_dict['G5_ThoiGianBatDau'] = row_dict['G5_ThoiGianBatDau'].isoformat()
        if row_dict.get('G5_ThoiGianKetThuc'):
            row_dict['G5_ThoiGianKetThuc'] = row_dict['G5_ThoiGianKetThuc'].isoformat()
        return row_dict

def create(data):
    stmt = insert(lich_tuvan_nhanvien).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_item(id, data):
    stmt = update(lich_tuvan_nhanvien).where(lich_tuvan_nhanvien.c.G5_Id == id).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_item(id):
    if 'G5_IsDeleted' in [c.name for c in lich_tuvan_nhanvien.columns]:
        stmt = update(lich_tuvan_nhanvien).where(lich_tuvan_nhanvien.c.G5_Id == id).values(G5_IsDeleted=1)
    else:
        stmt = delete(lich_tuvan_nhanvien).where(lich_tuvan_nhanvien.c.G5_Id == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
