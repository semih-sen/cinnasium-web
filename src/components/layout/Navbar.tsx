// src/components/layout/Navbar.tsx
import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-md"> {/* Temaya uygun koyu renk */}
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Sol Taraf: Logo/Site Adı ve Ana Linkler */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors"> {/* Tematik vurgu */}
            <strong>Cinnasium</strong> Forum
          </Link>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Anasayfa
            </Link>
            <Link href="/categories" className="hover:text-gray-300 transition-colors"> {/* Kategoriler sayfası için link (henüz sayfa yok) */}
              Kategoriler
            </Link>
            {/* Diğer ana linkler buraya eklenebilir */}
          </div>
        </div>

        {/* Sağ Taraf: Giriş/Kayıt Butonları (şimdilik statik) */}
        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors text-sm font-medium"
          >
            Giriş Yap
          </Link>
          <Link
            href="/register"
            className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors text-sm font-medium"
          >
            Kayıt Ol
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;