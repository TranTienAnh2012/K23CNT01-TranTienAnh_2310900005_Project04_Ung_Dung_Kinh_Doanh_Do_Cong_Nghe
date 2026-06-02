from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import dichvu_tuvan, user, lich_tuvan, lich_tuvan_nhanvien
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

def get_dichvu_tuvan():
    stmt = select(dichvu_tuvan)
    if 'G5_IsDeleted' in [c.name for c in dichvu_tuvan.columns]:
        stmt = stmt.where(dichvu_tuvan.c.G5_IsDeleted == 0)
    stmt = stmt.order_by(dichvu_tuvan.c.G5_Id.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = [serialize_row(dict(row._mapping)) for row in result]
        return {"items": items, "total": len(items)}

def get_staff_list():
    stmt = select(
        user.c.G5_MaNguoiDung,
        user.c.G5_HoTen
    ).where(
        (user.c.G5_VaiTro.in_(['nhanvien', 'staff'])) &
        (user.c.G5_IsDeleted == 0)
    )
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = [dict(row._mapping) for row in result]
        return {"items": items, "total": len(items)}

def get_lich_tuvan(user_id):
    staff_user = user.alias("staff_user")
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
        staff_user.c.G5_HoTen.label("G5_TenNhanVien")
    ).select_from(
        lich_tuvan
        .join(dichvu_tuvan, lich_tuvan.c.G5_MaDichVu == dichvu_tuvan.c.G5_Id)
        .outerjoin(lich_tuvan_nhanvien, lich_tuvan.c.G5_Id == lich_tuvan_nhanvien.c.G5_MaLich)
        .outerjoin(staff_user, lich_tuvan_nhanvien.c.G5_MaNhanVien == staff_user.c.G5_MaNguoiDung)
    ).where(
        lich_tuvan.c.G5_MaNguoiDung == user_id
    )
    
    if 'G5_IsDeleted' in [c.name for c in lich_tuvan.columns]:
        stmt = stmt.where(lich_tuvan.c.G5_IsDeleted == 0)
        
    stmt = stmt.order_by(lich_tuvan.c.G5_Id.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = [serialize_row(dict(row._mapping)) for row in result]
        return {"items": items, "total": len(items)}

def book_lich_tuvan(user_id, data):
    start_time = datetime.datetime.strptime(data.get('G5_ThoiGianBatDau'), "%Y-%m-%d %H:%M:%S")
    end_time = datetime.datetime.strptime(data.get('G5_ThoiGianKetThuc'), "%Y-%m-%d %H:%M:%S")
    
    booking_data = {
        'G5_MaNguoiDung': user_id,
        'G5_MaDichVu': int(data.get('G5_MaDichVu')),
        'G5_ThoiGianBatDau': start_time,
        'G5_ThoiGianKetThuc': end_time,
        'G5_TrangThai': 'Chờ xác nhận',
        'G5_GhiChu': data.get('G5_GhiChu'),
        'G5_IsDeleted': 0
    }
    
    with engine.begin() as conn:
        # Insert booking
        stmt_booking = insert(lich_tuvan).values(**booking_data)
        result = conn.execute(stmt_booking)
        booking_id = result.inserted_primary_key[0]
        
        # If staff is chosen, create assignment
        staff_id = data.get('G5_MaNhanVien')
        if staff_id:
            stmt_staff = insert(lich_tuvan_nhanvien).values(
                G5_MaLich=booking_id,
                G5_MaNhanVien=int(staff_id)
            )
            conn.execute(stmt_staff)
            
        return booking_id

def cancel_lich_tuvan(user_id, booking_id):
    # Verify booking exists and belongs to the client
    stmt_booking = select(lich_tuvan.c.G5_TrangThai).where(
        (lich_tuvan.c.G5_Id == booking_id) &
        (lich_tuvan.c.G5_MaNguoiDung == user_id)
    )
    
    with engine.begin() as conn:
        row = conn.execute(stmt_booking).fetchone()
        if not row:
            return False, "Không tìm thấy lịch tư vấn."
            
        status = row._mapping['G5_TrangThai']
        if status not in ['Chờ xác nhận', 'Đã xác nhận', 'Đã duyệt', 'Pending', 'Approved']:
            return False, "Không thể hủy lịch tư vấn ở trạng thái hiện tại."
            
        stmt_cancel = update(lich_tuvan).where(
            lich_tuvan.c.G5_Id == booking_id
        ).values(
            G5_TrangThai='Đã hủy'
        )
        conn.execute(stmt_cancel)
        return True, "Hủy lịch tư vấn thành công."
