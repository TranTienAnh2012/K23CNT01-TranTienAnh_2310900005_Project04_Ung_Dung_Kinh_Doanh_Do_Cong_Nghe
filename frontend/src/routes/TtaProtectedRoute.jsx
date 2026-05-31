import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TtaProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const location = useLocation();
  
  if (!token) {
    // If no token, redirect to login
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase() || '';
  if (role !== 'admin' && role !== 'nhanvien') {
    // If token exists but role is not allowed, redirect to homepage
    return <Navigate to="/" replace />;
  }

  // Restrict routes for employees (nhanvien) to only rental and service sections
  if (role === 'nhanvien') {
    const allowedPrefixes = [
      '/admin/sanpham-thue',
      '/admin/donhang-thue',
      '/admin/chitiet-thue',
      '/admin/lichsu-thue',
      '/admin/dichvu-tuvan',
      '/admin/lich-tuvan'
    ];
    const isAllowed = allowedPrefixes.some(prefix => location.pathname.startsWith(prefix));
    if (!isAllowed) {
      return <Navigate to="/admin/sanpham-thue" replace />;
    }
  }
  
  return children;
};

export default TtaProtectedRoute;
