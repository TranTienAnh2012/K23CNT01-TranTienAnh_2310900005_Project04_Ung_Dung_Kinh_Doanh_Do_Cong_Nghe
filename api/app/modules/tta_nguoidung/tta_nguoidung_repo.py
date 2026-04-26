from sqlalchemy import select, insert, update, or_
from app.db.connection import engine
from app.models.schema import user

def get_all(params=None):
    stmt = select(user).where(user.c.G5_IsDeleted == 0)
    
    if params and params.get('q'):
        stmt = stmt.where(or_(
            user.c.G5_HoTen.like(f"%{params['q']}%"),
            user.c.G5_Email.like(f"%{params['q']}%")
        ))
    
    stmt = stmt.order_by(user.c.G5_MaNguoiDung.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._mapping
            items.append({
                "MaNguoiDung": row_dict['G5_MaNguoiDung'],
                "HoTen": row_dict['G5_HoTen'],
                "Email": row_dict['G5_Email'],
                "SDT": row_dict['G5_SDT'],
                "VaiTro": row_dict['G5_VaiTro'],
                "NgayDangKy": row_dict['G5_NgayDangKy'].isoformat() if row_dict['G5_NgayDangKy'] else None
            })
        return {"items": items, "total": len(items)}

def get_by_id(ma):
    stmt = select(user).where(user.c.G5_MaNguoiDung == ma)
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if row:
            row_dict = row._mapping
            return {
                "MaNguoiDung": row_dict['G5_MaNguoiDung'],
                "HoTen": row_dict['G5_HoTen'],
                "Email": row_dict['G5_Email'],
                "SDT": row_dict['G5_SDT'],
                "VaiTro": row_dict['G5_VaiTro'],
                "NgayDangKy": row_dict['G5_NgayDangKy'].isoformat() if row_dict['G5_NgayDangKy'] else None
            }
        return None

def create(data):
    stmt = insert(user).values(
        G5_HoTen=data['HoTen'],
        G5_Email=data['Email'],
        G5_MatKhau=data['MatKhau'],
        G5_SDT=data.get('SDT'),
        G5_VaiTro=data.get('VaiTro', 'user')
    )
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_user(ma, data):
    # Only update provided fields
    update_values = {}
    if 'HoTen' in data: update_values['G5_HoTen'] = data['HoTen']
    if 'SDT' in data: update_values['G5_SDT'] = data['SDT']
    if 'VaiTro' in data: update_values['G5_VaiTro'] = data['VaiTro']
    
    if not update_values:
        return

    stmt = update(user).where(user.c.G5_MaNguoiDung == ma).values(**update_values)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_user(ma):
    stmt = update(user).where(user.c.G5_MaNguoiDung == ma).values(G5_IsDeleted=1)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
