from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import lich_tuvan
from datetime import datetime, date

def get_all(params=None):
    from app.models.schema import lich_tuvan_nhanvien, dichvu_tuvan, user
    from sqlalchemy.orm import aliased

    customer_user = aliased(user, name="customer_user")
    staff_user = aliased(user, name="staff_user")

    stmt = select(
        lich_tuvan.c.G5_Id,
        lich_tuvan.c.G5_MaNguoiDung,
        lich_tuvan.c.G5_MaDichVu,
        lich_tuvan.c.G5_ThoiGianBatDau,
        lich_tuvan.c.G5_ThoiGianKetThuc,
        lich_tuvan.c.G5_TrangThai,
        lich_tuvan.c.G5_GhiChu,
        dichvu_tuvan.c.G5_TenDichVu,
        dichvu_tuvan.c.G5_Gia,
        customer_user.c.G5_HoTen.label("G5_TenKhachHang"),
        staff_user.c.G5_HoTen.label("G5_TenNhanVien"),
        lich_tuvan_nhanvien.c.G5_MaNhanVien
    ).select_from(
        lich_tuvan
        .join(dichvu_tuvan, lich_tuvan.c.G5_MaDichVu == dichvu_tuvan.c.G5_Id)
        .outerjoin(customer_user, lich_tuvan.c.G5_MaNguoiDung == customer_user.c.G5_MaNguoiDung)
        .outerjoin(lich_tuvan_nhanvien, lich_tuvan.c.G5_Id == lich_tuvan_nhanvien.c.G5_MaLich)
        .outerjoin(staff_user, lich_tuvan_nhanvien.c.G5_MaNhanVien == staff_user.c.G5_MaNguoiDung)
    )
    
    if params:
        if 'G5_MaNguoiDung' in params and params['G5_MaNguoiDung'] is not None and str(params['G5_MaNguoiDung']).strip() != '':
            stmt = stmt.where(lich_tuvan.c.G5_MaNguoiDung == int(params['G5_MaNguoiDung']))
        if 'G5_MaNhanVien' in params and params['G5_MaNhanVien'] is not None and str(params['G5_MaNhanVien']).strip() != '':
            stmt = stmt.where(lich_tuvan_nhanvien.c.G5_MaNhanVien == int(params['G5_MaNhanVien']))

    if 'G5_IsDeleted' in [c.name for c in lich_tuvan.columns]:
        stmt = stmt.where(lich_tuvan.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(lich_tuvan.c.G5_Id.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        import decimal
        for row in result:
            item_dict = dict(row._mapping)
            for k, v in item_dict.items():
                if isinstance(v, decimal.Decimal):
                    item_dict[k] = float(v)
                elif isinstance(v, (datetime, date)):
                    item_dict[k] = v.isoformat()
            items.append(item_dict)
        return {"items": items, "total": len(items)}

def is_assigned_to_staff(schedule_id, staff_id):
    from app.models.schema import lich_tuvan_nhanvien
    stmt = select(lich_tuvan_nhanvien).where(
        lich_tuvan_nhanvien.c.G5_MaLich == schedule_id,
        lich_tuvan_nhanvien.c.G5_MaNhanVien == staff_id
    )
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        return row is not None

def get_by_id(id):
    from app.models.schema import lich_tuvan_nhanvien, dichvu_tuvan, user
    from sqlalchemy.orm import aliased

    customer_user = aliased(user, name="customer_user")
    staff_user = aliased(user, name="staff_user")

    stmt = select(
        lich_tuvan.c.G5_Id,
        lich_tuvan.c.G5_MaNguoiDung,
        lich_tuvan.c.G5_MaDichVu,
        lich_tuvan.c.G5_ThoiGianBatDau,
        lich_tuvan.c.G5_ThoiGianKetThuc,
        lich_tuvan.c.G5_TrangThai,
        lich_tuvan.c.G5_GhiChu,
        dichvu_tuvan.c.G5_TenDichVu,
        dichvu_tuvan.c.G5_Gia,
        customer_user.c.G5_HoTen.label("G5_TenKhachHang"),
        staff_user.c.G5_HoTen.label("G5_TenNhanVien"),
        lich_tuvan_nhanvien.c.G5_MaNhanVien
    ).select_from(
        lich_tuvan
        .join(dichvu_tuvan, lich_tuvan.c.G5_MaDichVu == dichvu_tuvan.c.G5_Id)
        .outerjoin(customer_user, lich_tuvan.c.G5_MaNguoiDung == customer_user.c.G5_MaNguoiDung)
        .outerjoin(lich_tuvan_nhanvien, lich_tuvan.c.G5_Id == lich_tuvan_nhanvien.c.G5_MaLich)
        .outerjoin(staff_user, lich_tuvan_nhanvien.c.G5_MaNhanVien == staff_user.c.G5_MaNguoiDung)
    ).where(lich_tuvan.c.G5_Id == id)

    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            return None
        import decimal
        item_dict = dict(row._mapping)
        for k, v in item_dict.items():
            if isinstance(v, decimal.Decimal):
                item_dict[k] = float(v)
            elif isinstance(v, (datetime, date)):
                item_dict[k] = v.isoformat()
        return item_dict

def create(data):
    staff_id = data.pop('G5_MaNhanVien', None)
    
    for k in ['G5_ThoiGianBatDau', 'G5_ThoiGianKetThuc']:
        if k in data and isinstance(data[k], str):
            try:
                val = data[k].replace('Z', '')
                if 'T' in val:
                    data[k] = datetime.strptime(val.split('.')[0], "%Y-%m-%dT%H:%M:%S")
                else:
                    data[k] = datetime.strptime(val, "%Y-%m-%d %H:%M:%S")
            except Exception as e:
                print("Date parse error:", e)
                pass

    stmt = insert(lich_tuvan).values(**data)
    with engine.connect() as conn:
        result = conn.execute(stmt)
        new_id = result.inserted_primary_key[0]
        
        if staff_id:
            from app.models.schema import lich_tuvan_nhanvien
            stmt_staff = insert(lich_tuvan_nhanvien).values(
                G5_MaLich=new_id,
                G5_MaNhanVien=int(staff_id)
            )
            conn.execute(stmt_staff)
            
        conn.commit()
        return new_id

def update_item(id, data):
    staff_id = data.pop('G5_MaNhanVien', None)
    
    for k in ['G5_ThoiGianBatDau', 'G5_ThoiGianKetThuc']:
        if k in data and isinstance(data[k], str):
            try:
                val = data[k].replace('Z', '')
                if 'T' in val:
                    data[k] = datetime.strptime(val.split('.')[0], "%Y-%m-%dT%H:%M:%S")
                else:
                    data[k] = datetime.strptime(val, "%Y-%m-%d %H:%M:%S")
            except Exception as e:
                print("Date parse error:", e)
                pass

    stmt = update(lich_tuvan).where(lich_tuvan.c.G5_Id == id).values(**data)
    with engine.connect() as conn:
        conn.execute(stmt)
        
        if staff_id is not None:
            from app.models.schema import lich_tuvan_nhanvien
            conn.execute(delete(lich_tuvan_nhanvien).where(lich_tuvan_nhanvien.c.G5_MaLich == id))
            if str(staff_id).strip() != '':
                conn.execute(insert(lich_tuvan_nhanvien).values(
                    G5_MaLich=id,
                    G5_MaNhanVien=int(staff_id)
                ))
                
        conn.commit()

def delete_item(id):
    from app.models.schema import lich_tuvan_nhanvien
    if 'G5_IsDeleted' in [c.name for c in lich_tuvan.columns]:
        stmt = update(lich_tuvan).where(lich_tuvan.c.G5_Id == id).values(G5_IsDeleted=1)
    else:
        stmt = delete(lich_tuvan).where(lich_tuvan.c.G5_Id == id)
    with engine.connect() as conn:
        conn.execute(delete(lich_tuvan_nhanvien).where(lich_tuvan_nhanvien.c.G5_MaLich == id))
        conn.execute(stmt)
        conn.commit()
