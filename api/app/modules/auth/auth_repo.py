from sqlalchemy import select, insert
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

def create_user_account(email, password, name, phone=None):
    # Check if email exists
    check_stmt = select(user).where(user.c.G5_Email == email)
    with engine.connect() as conn:
        if conn.execute(check_stmt).fetchone():
            return None, "Email này đã được đăng ký trong hệ thống."

    # Insert new user with default role 'customer'
    stmt = insert(user).values(
        G5_HoTen=name,
        G5_Email=email,
        G5_MatKhau=password,
        G5_SDT=phone,
        G5_VaiTro='customer'
    )
    with engine.connect() as conn:
        conn.execute(stmt)
        conn.commit()

    # Retrieve newly created user row
    return find_user_by_credentials(email, password), None
