from sqlalchemy import select
from app.db.connection import engine
from app.models.schema import user

def find_user_by_credentials(email, password):
    stmt = select(user).where(
        user.c.G5_Email == email,
        user.c.G5_MatKhau == password,
        user.c.G5_IsDeleted == 0
    )
    with engine.connect() as conn:
        result = conn.execute(stmt)
        return result.fetchone()
