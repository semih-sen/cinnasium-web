// src/components/layout/AdminLayout.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import AdminGuard from '../auth/AdminGuard'; // Admin Guard'ı dahil et

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const router = useRouter();
  const menuItems = [
    // { href: '/admin/dashboard', label: 'Gösterge Paneli' }, // Şimdilik kapalı
    { href: '/admin/categories', label: 'Kategoriler' },
    { href: '/admin/users', label: 'Kullanıcılar' },
    // Eklenecek diğer menüler
  ];

  return (
    // AdminGuard ile tüm admin layout'unu koru
    <AdminGuard>
       {/* Ana Layout'u kullanmaya devam ediyoruz, sadece içeriği farklı */}
       {/* max-w-7xl burada da geçerli olacak */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/5 lg:w-1/6 flex-shrink-0">
          <nav className="sticky top-20 bg-gray-800 p-4 rounded-lg shadow"> {/* top-16 (navbar) + padding */}
            <h3 className="text-lg font-semibold text-purple-400 mb-4">Admin Paneli</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded transition-colors text-sm ${
                      router.pathname === item.href
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Ana İçerik Alanı */}
        <section className="w-full md:w-4/5 lg:w-5/6">
          {children}
        </section>
      </div>
    </AdminGuard>
  );
};

export default AdminLayout;