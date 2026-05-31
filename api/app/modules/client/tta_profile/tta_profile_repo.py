from sqlalchemy import select, update
from app.db.connection import engine
from app.models.schema import user
from datetime import datetime

def get_profile(user_id):
    stmt = select(user).where(user.c.G5_MaNguoiDung == user_id, user.c.G5_IsDeleted == 0)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if row:
            r = row._mapping
            return {
                "MaNguoiDung": r['G5_MaNguoiDung'],
                "HoTen": r['G5_HoTen'],
                "Email": r['G5_Email'],
                "SDT": r['G5_SDT'],
                "NgaySinh": r['G5_NgaySinh'].isoformat() if r['G5_NgaySinh'] else None,
                "AvatarUrl": r['G5_AvatarUrl'],
                "VaiTro": r['G5_VaiTro'],
                "NgayDangKy": r['G5_NgayDangKy'].isoformat() if r['G5_NgayDangKy'] else None,
                "TenDangNhap": r['G5_TenDangNhap'] if 'G5_TenDangNhap' in r else None,
                "GioiTinh": r['G5_GioiTinh'] if 'G5_GioiTinh' in r else None
            }
        return None

def update_profile(user_id, data):
    update_values = {}
    if 'HoTen' in data:
        update_values['G5_HoTen'] = data['HoTen']
    if 'SDT' in data:
        update_values['G5_SDT'] = data['SDT']
    if 'NgaySinh' in data:
        if data['NgaySinh']:
            # Parse YYYY-MM-DD
            try:
                update_values['G5_NgaySinh'] = datetime.strptime(data['NgaySinh'], "%Y-%m-%d").date()
            except ValueError:
                try:
                    update_values['G5_NgaySinh'] = datetime.fromisoformat(data['NgaySinh'].replace('Z', '+00:00')).date()
                except Exception:
                    raise Exception("Ngày sinh không đúng định dạng YYYY-MM-DD")
        else:
            update_values['G5_NgaySinh'] = None
    if 'AvatarUrl' in data:
        update_values['G5_AvatarUrl'] = data['AvatarUrl']
    if 'TenDangNhap' in data:
        update_values['G5_TenDangNhap'] = data['TenDangNhap']
    if 'GioiTinh' in data:
        update_values['G5_GioiTinh'] = data['GioiTinh']
    elif 'Gender' in data:
        update_values['G5_GioiTinh'] = data['Gender']
        
    if not update_values:
        return True
        
    stmt = update(user).where(user.c.G5_MaNguoiDung == user_id).values(**update_values)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
    return True

def change_password(user_id, current_pwd, new_pwd):
    stmt = select(user).where(user.c.G5_MaNguoiDung == user_id, user.c.G5_IsDeleted == 0)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if not row:
            raise Exception("Người dùng không tồn tại.")
        
        r = row._mapping
        if r['G5_MatKhau'] != current_pwd:
            raise Exception("Mật khẩu hiện tại không chính xác.")
            
        stmt_update = update(user).where(user.c.G5_MaNguoiDung == user_id).values(G5_MatKhau=new_pwd)
        conn.execute(stmt_update)
        conn.commit()
    return True
