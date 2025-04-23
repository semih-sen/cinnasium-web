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
      <main className="flex-grow container mx-auto px-4 py-8"> {/* Ana içerik alanı, container ile ortalanmış */}
        {children} {/* Sayfanın asıl içeriği buraya gelecek */}
      </main>
      {/* İsteğe bağlı: Footer buraya eklenebilir */}
      {/* <footer className="bg-gray-900 text-center py-4 mt-auto">
        © 2025 Ezoterik Forum
      </footer> */}
    </div>
  );
};

export default Layout;