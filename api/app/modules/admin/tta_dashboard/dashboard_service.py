from . import tta_dashboard_repo as repo

def get_dashboard_summary():
    """Tổng hợp dữ liệu cho Dashboard"""
    stats = repo.get_stats()
    activities = repo.get_recent_activities(limit=10)
    
    return {
        "stats": stats,
        "recentActivities": activities
    }
