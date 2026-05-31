import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLayout from './AdminLayout';
import NhanvienLayout from './NhanvienLayout';

export default function LayoutSelector() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || '';

  if (role === 'nhanvien') {
    return <NhanvienLayout />;
  }

  return <AdminLayout />;
}
