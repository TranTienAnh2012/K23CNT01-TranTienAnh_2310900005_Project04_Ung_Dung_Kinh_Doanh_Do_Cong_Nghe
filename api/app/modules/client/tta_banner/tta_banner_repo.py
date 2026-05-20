from sqlalchemy import select
from app.db.connection import engine
from app.models.schema import banner, danhmuc

def get_all(params=None):
    # Dành cho client: Chỉ lấy những banner có TrangThai hoạt động (G5_TrangThai == 1)
    stmt = select(banner, danhmuc.c.G5_TenDanhMuc).select_from(
        banner.outerjoin(danhmuc, banner.c.G5_MaDanhMuc == danhmuc.c.G5_MaDanhMuc)
    ).where(banner.c.G5_TrangThai == 1)
    
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
