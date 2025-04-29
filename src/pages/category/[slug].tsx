// src/pages/category/[slug].tsx
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite'; // Sonsuz yükleme için
import { fetcher } from '@/lib/fetcher';
import { Category } from '@/types/category';
import { Thread } from '@/types/thread';
import ThreadList from '@/components/threads/ThreadList';
import { useAuth } from '@/context/AuthContext'; // Yeni konu butonu için
import { Paginated } from '@/types/paginated';

const THREADS_PER_PAGE = 15; // Sayfa başına kaç konu gösterilecek

const CategoryPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query; // URL'den slug'ı al (örn: /category/mistisizm -> slug = 'mistisizm')
  const { isAuthenticated } = useAuth(); // Kullanıcı giriş yapmış mı?

  // Kategori bilgilerini çekmek için SWR
  const { data: category, error: categoryError } = useSWR<Category>(
    slug ? `/category/${slug}` : null, // slug varsa endpoint'i oluştur
    fetcher
  );

  // Konuları sayfalanmış çekmek için useSWRInfinite
  const getKey = (pageIndex: number, previousPageData: Paginated<Thread> | null): string | null => {
    // Endpoint'e ulaştık veya slug yoksa null dön
    if (!slug || (previousPageData && !previousPageData.items.length)) return null;
    // Henüz veri yoksa veya ilk sayfadaysak
    if (pageIndex === 0) return `/threads/category/${slug}/list?page=1&limit=${THREADS_PER_PAGE}`;
    // Sonraki sayfanın numarasını al (backend 1'den başlıyorsa pageIndex + 1)
    const nextPage = previousPageData ? previousPageData.meta.currentPage + 1 : 1;
    // Eğer mevcut sayfa toplam sayfadan büyük veya eşitse daha fazla yükleme
   if (previousPageData && nextPage > previousPageData.meta.totalPages) return null;

    return `/threads/category/${slug}/list?page=${nextPage}&limit=${THREADS_PER_PAGE}`;
  };

  const {

    data: threadPages, // Gelen sayfaların dizisi [[page1_data], [page2_data], ...]
    error: threadsError,
    isLoading: isLoadingThreadsInitial, // İlk sayfa yükleniyor mu?
    size, // Kaç sayfa yüklendiği
    setSize, // Yeni sayfa yükleme fonksiyonu
    isValidating // Herhangi bir sayfa yükleniyor veya revalidate ediliyor mu?
  } = useSWRInfinite<Paginated<Thread>>(getKey, fetcher);
console.log(useSWRInfinite<any>(getKey, fetcher).data)
  // threadPages dizisindeki tüm konuları tek bir diziye düzleştir
  const threads: Thread[] = threadPages ? threadPages.reduce((acc, page) => acc.concat(page.items), [] as Thread[]) : [];

  // Yükleme durumları
  const isLoadingMore = isLoadingThreadsInitial || (size > 0 && threadPages && typeof threadPages[size - 1] === 'undefined' && isValidating);
  // Son sayfaya ulaşılıp ulaşılmadığı kontrolü
  const isReachingEnd = threadPages ? threadPages[threadPages.length - 1]?.meta.currentPage>= threadPages[threadPages.length - 1]?.meta.totalPages : false;


  // Ana Yükleme veya Kategori Hatası Durumu
  if (!slug || (categoryError && categoryError.response?.status === 404)) {
    return <div className="text-center py-10 text-red-400">Kategori bulunamadı.</div>;
  }
  if (categoryError){
     return <div className="text-center py-10 text-red-400">Kategori bilgileri yüklenirken hata oluştu: {categoryError.message}</div>;
  }
  // Kategori bilgisi henüz yükleniyorsa
   if (!category) {
     return <div className="text-center py-10 text-gray-400">Kategori bilgileri yükleniyor...</div>;
   }


  return (
    <div>
      {/* Kategori Başlığı ve Açıklaması */}
      <div className="mb-8 p-6 bg-gray-800 rounded-lg shadow">
        <h1 className="text-3xl font-bold text-purple-400 mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-300">{category.description}</p>
        )}
      </div>

       {/* Yeni Konu Butonu */}
       {isAuthenticated && (
          <div className="mb-4 text-right">
             <Link
               href={`/thread/new?category=${category.slug}`} // Yeni konu açma sayfasına link (henüz yok)
               className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-md transition-colors"
             >
               Yeni Konu Aç
             </Link>
          </div>
        )}


      {/* Konu Listesi */}
      <div className="bg-gray-900 p-4 md:p-6 rounded-lg shadow-lg">
        {isLoadingThreadsInitial && <p className="text-center text-gray-400 py-5">Konular yükleniyor...</p>}
        {threadsError && <p className="text-center text-red-400 py-5">Konular yüklenirken hata oluştu: {threadsError.message}</p>}
        {!isLoadingThreadsInitial && !threadsError && <ThreadList threads={threads} />}

         {/* Daha Fazla Yükle Butonu */}
         {!isLoadingThreadsInitial && !threadsError && !isReachingEnd && (
            <div className="mt-6 text-center">
               <button
                 onClick={() => setSize(size + 1)}
                 disabled={isLoadingMore}
                 className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isLoadingMore ? 'Yükleniyor...' : 'Daha Fazla Konu Yükle'}
               </button>
            </div>
          )}
           {!isLoadingThreadsInitial && !threadsError && isReachingEnd && threads.length > 0 && (
              <p className="text-center text-gray-500 mt-6">Gösterilecek başka konu yok.</p>
           )}
      </div>
    </div>
  );
};

export default CategoryPage;