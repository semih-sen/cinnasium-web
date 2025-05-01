import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-gray-100">Gösterge Paneli</h1>
      <p className="mt-4 text-gray-400">Bu alan yakında istatistikler ve özet bilgilerle dolacak...</p>
    </AdminLayout>
  );
};
export default AdminDashboardPage;