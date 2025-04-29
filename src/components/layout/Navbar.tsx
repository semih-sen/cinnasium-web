// src/components/layout/Navbar.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // useAuth hook'unu import et

const Navbar: React.FC = () => {
  // AuthContext'ten gerekli bilgileri ve fonksiyonları al
  const { isAuthenticated, user, logout, loading } = useAuth();

  return (
    <nav className="sticky top-0 bg-gray-900 text-white shadow-md">   
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Sol Taraf: Logo/Site Adı ve Ana Linkler (Değişiklik yok) */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
            <strong>Cinnasium</strong> Forum
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Divân
            </Link>
            <Link href="/categories" className="hover:text-gray-300 transition-colors">
              Sohbet Meydanı
            </Link>
          </div>
        </div>

        {/* Sağ Taraf: Dinamik Giriş/Profil Alanı */}
        <div className="flex items-center space-x-3">
          {/* Context yüklenirken hiçbir şey gösterme veya bir yükleniyor ikonu göster */}
          {loading ? (
            <div className="h-8 w-24 bg-gray-700 animate-pulse rounded"></div> // Yükleniyor placeholder'ı
          ) : isAuthenticated ? (
            // Kullanıcı giriş yapmışsa
            <>
              <span className="text-sm text-gray-300 hidden sm:inline">
                Selamun Aleykum,{' '}
                <Link href="/profile/me" className="font-medium hover:text-purple-300">
                  {user?.username || 'Kullanıcı'} {/* Kullanıcı adını göster */}
                </Link>
              </span>
              <button
                onClick={logout} // Logout fonksiyonunu çağır
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors text-sm font-medium"
              >
                Terk Et
              </button>
            </>
          ) : (
            // Kullanıcı giriş yapmamışsa
            <>
              <Link
                href="/login"
                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors text-sm font-medium"
              >
                Destur Al
              </Link>
              <Link
                href="/register"
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors text-sm font-medium"
              >
                Kervana Buyur
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;