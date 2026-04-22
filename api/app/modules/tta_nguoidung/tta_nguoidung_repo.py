from sqlalchemy import text
from app.db.connection import engine

def get_all(params=None):
    query = "SELECT * FROM G5_user WHERE G5_IsDeleted = 0"
    args = {}
    if params and params.get('q'):
        query += " AND (G5_HoTen LIKE :q OR G5_Email LIKE :q)"
        args['q'] = f"%{params['q']}%"
    
    query += " ORDER BY G5_MaNguoiDung DESC"
    
    with engine.connect() as conn:
        result = conn.execute(text(query), args)
        items = []
        for row in result:
            items.append({
                "MaNguoiDung": row.G5_MaNguoiDung,
                "HoTen": row.G5_HoTen,
                "Email": row.G5_Email,
                "SDT": row.G5_SDT,
                "VaiTro": row.G5_VaiTro,
                "NgayDangKy": row.G5_NgayDangKy.isoformat() if row.G5_NgayDangKy else None
            })
        return {"items": items, "total": len(items)}

def get_by_id(ma):
    query = "SELECT * FROM G5_user WHERE G5_MaNguoiDung = :ma"
    with engine.connect() as conn:
        row = conn.execute(text(query), {"ma": ma}).fetchone()
        if row:
            return {
                "MaNguoiDung": row.G5_MaNguoiDung,
                "HoTen": row.G5_HoTen,
                "Email": row.G5_Email,
                "SDT": row.G5_SDT,
                "VaiTro": row.G5_VaiTro,
                "NgayDangKy": row.G5_NgayDangKy.isoformat() if row.G5_NgayDangKy else None
            }
        return None

def create(data):
    query = """
        INSERT INTO G5_user (G5_HoTen, G5_Email, G5_MatKhau, G5_SDT, G5_VaiTro)
        VALUES (:hoten, :email, :pass, :sdt, :vaitro)
    """
    with engine.connect() as conn:
        conn.execute(text(query), {
            "hoten": data['HoTen'],
            "email": data['Email'],
            "pass": data['MatKhau'],
            "sdt": data.get('SDT'),
            "vaitro": data.get('VaiTro', 'user')
        })
        conn.commit()

def update(ma, data):
    query = """
        UPDATE G5_user SET G5_HoTen = :hoten, G5_SDT = :sdt, G5_VaiTro = :vaitro
        WHERE G5_MaNguoiDung = :ma
    """
    with engine.connect() as conn:
        conn.execute(text(query), {
            "hoten": data['HoTen'],
            "sdt": data.get('SDT'),
            "vaitro": data.get('VaiTro'),
            "ma": ma
        })
        conn.commit()

def delete(ma):
    query = "UPDATE G5_user SET G5_IsDeleted = 1 WHERE G5_MaNguoiDung = :ma"
    with engine.connect() as conn:
        conn.execute(text(query), {"ma": ma})
        conn.commit()
