import sys
import os

# Add api to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'api'))

from app.db.connection import engine
from app.modules.client.tta_profile.tta_profile_repo import get_profile, update_profile

def test():
    # Fetch user 1
    print("Testing get_profile for user 1:")
    p = get_profile(1)
    print("Profile:", p)

    # Update user 1 TenDangNhap and GioiTinh
    print("\nUpdating profile for user 1:")
    update_profile(1, {
        "TenDangNhap": "tienanh_updated",
        "GioiTinh": "Female",
        "HoTen": "Tran Tien Anh Updated"
    })

    print("\nFetching profile again after update:")
    p_updated = get_profile(1)
    print("Updated Profile:", p_updated)

    # Revert update to keep clean
    print("\nReverting update for user 1:")
    update_profile(1, {
        "TenDangNhap": "tienanh",
        "GioiTinh": "Male",
        "HoTen": "Tran Tien Anh"
    })

if __name__ == '__main__':
    test()
