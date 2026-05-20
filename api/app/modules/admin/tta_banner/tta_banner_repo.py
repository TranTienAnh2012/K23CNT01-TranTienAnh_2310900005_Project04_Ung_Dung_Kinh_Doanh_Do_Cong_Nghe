from sqlalchemy import select, insert, update, delete
from app.db.connection import engine
from app.models.schema import banner, danhmuc

def get_all(params=None):
    stmt = select(banner, danhmuc.c.G5_TenDanhMuc).select_from(
        banner.outerjoin(danhmuc, banner.c.G5_MaDanhMuc == danhmuc.c.G5_MaDanhMuc)
    )
    
    if params and params.get('danhmuc'):
        stmt = stmt.where(banner.c.G5_MaDanhMuc == params['danhmuc'])
        
    stmt = stmt.order_by(banner.c.G5_BannerID.desc())
    
    with engine.connect() as conn:
        result = conn.execute(stmt)
        items = []
        for row in result:
            row_dict = row._mapping
            items.append({
                "BannerID": row_dict['G5_BannerID'],
                "MaDanhMuc": row_dict['G5_MaDanhMuc'],
                "TenDanhMuc": row_dict['G5_TenDanhMuc'],
                "TieuDe": row_dict['G5_TieuDe'],
                "MoTa": row_dict['G5_MoTa'],
                "UrlAnh": row_dict['G5_UrlAnh'],
                "LinkRedirect": row_dict['G5_LinkRedirect'],
                "TrangThai": row_dict['G5_TrangThai'],
                "NgayTao": row_dict['G5_NgayTao'].isoformat() if row_dict['G5_NgayTao'] else None
            })
        return {"items": items, "total": len(items)}

def get_by_id(id):
    stmt = select(banner, danhmuc.c.G5_TenDanhMuc).select_from(
        banner.outerjoin(danhmuc, banner.c.G5_MaDanhMuc == danhmuc.c.G5_MaDanhMuc)
    ).where(banner.c.G5_BannerID == id)
    
    with engine.connect() as conn:
        row = conn.execute(stmt).fetchone()
        if row:
            row_dict = row._mapping
            return {
                "BannerID": row_dict['G5_BannerID'],
                "MaDanhMuc": row_dict['G5_MaDanhMuc'],
                "TenDanhMuc": row_dict['G5_TenDanhMuc'],
                "TieuDe": row_dict['G5_TieuDe'],
                "MoTa": row_dict['G5_MoTa'],
                "UrlAnh": row_dict['G5_UrlAnh'],
                "LinkRedirect": row_dict['G5_LinkRedirect'],
                "TrangThai": row_dict['G5_TrangThai'],
                "NgayTao": row_dict['G5_NgayTao'].isoformat() if row_dict['G5_NgayTao'] else None
            }
        return None

def create(data):
    stmt = insert(banner).values(
        G5_MaDanhMuc=data.get('MaDanhMuc'),
        G5_TieuDe=data.get('TieuDe'),
        G5_MoTa=data.get('MoTa'),
        G5_UrlAnh=data['UrlAnh'],
        G5_LinkRedirect=data.get('LinkRedirect'),
        G5_TrangThai=data.get('TrangThai', 1)
    )
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def update_banner(id, data):
    update_values = {}
    if 'MaDanhMuc' in data: update_values['G5_MaDanhMuc'] = data['MaDanhMuc']
    if 'TieuDe' in data: update_values['G5_TieuDe'] = data['TieuDe']
    if 'MoTa' in data: update_values['G5_MoTa'] = data['MoTa']
    if 'UrlAnh' in data: update_values['G5_UrlAnh'] = data['UrlAnh']
    if 'LinkRedirect' in data: update_values['G5_LinkRedirect'] = data['LinkRedirect']
    if 'TrangThai' in data: update_values['G5_TrangThai'] = data['TrangThai']
    
    if not update_values:
        return

    stmt = update(banner).where(banner.c.G5_BannerID == id).values(**update_values)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

def delete_banner(id):
    stmt = delete(banner).where(banner.c.G5_BannerID == id)
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()
