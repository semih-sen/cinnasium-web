// src/components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import Navbar from './Navbar'; // Navbar'ı import et

interface LayoutProps {
  children: ReactNode; // Sayfa içeriğini alacak prop
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100"> {/* Ana arkaplan rengi ve min yükseklik */}
      <Navbar /> {/* Navbar'ı en üste yerleştir */}
      {/* Ana içerik alanı: container genel hizalama ve padding için,
          içindeki div ise maksimum genişliği belirleyip içeriği ortalamak için */}
      <main className="flex-grow container mx-auto px-4 py-8 pt-16">
        {/* İçeriği saran ve maksimum genişliği sınırlayan div */}
        <div className="max-w-7xl mx-auto"> {/* EKLENDİ: max-w-7xl mx-auto */}
          {children}
        </div>
      </main>
      {/* İsteğe bağlı: Footer buraya eklenebilir */}
      {/* <footer className="bg-gray-900 text-center py-4 mt-auto">
        © 2025 Ezoterik Forum
      </footer> */}
    </div>
  );
};

export default Layout;