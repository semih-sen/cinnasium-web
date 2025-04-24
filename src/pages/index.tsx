// src/pages/index.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import useSWR from 'swr'; // SWR hook'unu import et
import { fetcher } from '@/lib/fetcher'; // Fetcher'ı import et
import { Category } from '@/types/category'; // Kategori tipini import et
import CategoryList from '@/components/categories/CategoryList'; // CategoryList bileşenini import et

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // SWR ile kategori ağacını çek (Backend endpoint: /categories/tree varsayıldı)
  const { data: categories, error, isLoading } = useSWR<Category[]>('/category/tree', fetcher);

  return (
    <div>
      {/* Hero Alanı (Değişiklik yok) */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-950 py-20 md:py-32 text-center rounded-lg shadow-xl mb-12">
       {/* ... (Hero içeriği aynı) ... */}
         <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-purple-400 mb-4 leading-tight">
            Gizemli Bilginin Kapıları Aralanıyor
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Mistisizm, ezoterizm, metafizik ve teknolojinin kesiştiği noktada derin sohbetlere katılın, keşfedin ve paylaşın.
          </p>
          {!isAuthenticated && (
            <Link href="/register" /* ... */ >Topluluğa Katıl</Link>
          )}
           {isAuthenticated && (
             <Link href="/categories" /* ... */ >Kategorileri Keşfet</Link>
           )}
        </div>
      </section>

      {/* Kategori Listesi Alanı (Artık Dinamik) */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-center text-gray-200 mb-8">
          Tartışma Alanları
        </h2>
        <div className="p-4 md:p-8 bg-gray-900 rounded-lg shadow-lg"> {/* Arka planı biraz daha koyu yaptım */}
          {isLoading && ( // Yüklenirken göster
            <div className="text-center text-gray-400 py-8">
               {/* Basit bir yükleniyor animasyonu */}
               <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
               <p className="mt-2">Kategoriler yükleniyor...</p>
            </div>
          )}
          {error && ( // Hata durumunda göster
            <div className="text-center text-red-400 bg-red-900 border border-red-700 p-4 rounded">
              Kategoriler yüklenirken bir hata oluştu: {error.message || 'Sunucu hatası'}
            </div>
          )}
          {!isLoading && !error && categories && ( // Yükleme bitti, hata yok ve veri varsa göster
            <CategoryList categories={categories} />
          )}
           {!isLoading && !error && (!categories || categories.length === 0) && ( // Yükleme bitti, hata yok ama veri boşsa
              <p className="text-center text-gray-500 py-8">Henüz hiç kategori oluşturulmamış.</p>
           )}
        </div>
      </section>

      {/* ... (İsteğe Bağlı Diğer Bölümler) ... */}
    </div>
  );
};

export default HomePage;