// src/pages/thread/[slug].tsx
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR, { mutate } from 'swr';
import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@/lib/fetcher';
import { Thread } from '@/types/thread'; // Sadece Thread tipi yeterli olabilir detay için
import { Post } from '@/types/post';
import PostList from '@/components/posts/PostList';
import { useAuth } from '@/context/AuthContext';
import { Paginated } from '@/types/paginated';
import ReplyForm from '@/components/posts/ReplyForm';

const POSTS_PER_PAGE = 10; // Sayfa başına mesaj sayısı



const ThreadPage: React.FC = () => {
  const router = useRouter();
  const { slug } = router.query;
  const { isAuthenticated } = useAuth();

  // Konu detaylarını çek (Backend endpoint: /threads/:slug varsayıldı)
  const { data: thread, error: threadError, isLoading: isLoadingThread } = useSWR<Thread>(
    slug ? `/threads/${slug}` : null,
    fetcher
  );

  // Konu ID'sini aldıktan sonra mesajları çek
  const threadId = thread?.id;

  const getKey = (pageIndex: number, previousPageData: Paginated<Post> | null): string | null => {
    if (!threadId || (previousPageData && !previousPageData.items.length)) return null;
    if (pageIndex === 0) return `/threads/${threadId}/posts?page=1&limit=${POSTS_PER_PAGE}`;

    const nextPage = previousPageData ? previousPageData.meta.currentPage + 1 : 1;
    if (previousPageData && nextPage > previousPageData.meta.totalPages) return null;

    return `/threads/${threadId}/posts?page=${nextPage}&limit=${POSTS_PER_PAGE}`;
  };

  const {
    data: postPages,
    error: postsError,
    isLoading: isLoadingPostsInitial,
    size,
    setSize,
    mutate,
    isValidating
  } = useSWRInfinite<Paginated<Post>>(getKey, fetcher, {
       // İlk gönderiyi (thread starter) tekrar tekrar yüklememek için revalidate ayarları
       // revalidateFirstPage: false // Eğer ilk sayfa hiç değişmeyecekse
  });

  const posts: Post[] = postPages ? postPages.reduce((acc, page) => acc.concat(page.items), [] as Post[]) : [];
  const isLoadingMore = isLoadingPostsInitial || (size > 0 && postPages && typeof postPages[size - 1] === 'undefined' && isValidating);
  const isReachingEnd = postPages ? postPages[postPages.length - 1]?.meta.currentPage >= postPages[postPages.length - 1]?.meta.totalPages : false;


// Cevap başarılı olduğunda çağrılacak fonksiyon
const handleReplySuccess = () => {
  console.log('Reply successful! Revalidating posts...');
  // SWR'a post verisini yeniden çekmesini/güncellemesini söyle
  // Bu sayede yeni post listede görünür
  mutate();
  // İsteğe bağlı: Son sayfaya scroll yapabilirsin
};

  // Ana Yükleme veya Konu Hatası Durumu
   if (isLoadingThread) {
     return <div className="text-center py-10 text-gray-400">Konu yükleniyor...</div>;
   }
  if (threadError || !thread) {
     // 404 durumunu ayrıca ele alabiliriz
     if(threadError?.response?.status === 404) {
         return <div className="text-center py-10 text-red-400">Konu bulunamadı.</div>;
     }
    return <div className="text-center py-10 text-red-400">Konu yüklenirken hata oluştu: {threadError?.message || 'Bilinmeyen Hata'}</div>;
  }


  return (
    <div>
      {/* Konu Başlığı ve Kategoriye Dönüş Linki */}
      <div className="mb-6">
         <nav className="text-sm text-gray-400 mb-2" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex">
               <li className="flex items-center">
                 <Link href="/" className="hover:text-purple-300">Anasayfa</Link>
                 <span className="mx-2">/</span>
               </li>
               {thread.category && (
                 <li className="flex items-center">
                   <Link href={`/category/${thread.category.slug}`} className="hover:text-purple-300">{thread.category.name}</Link>
                    <span className="mx-2">/</span>
                 </li>
               )}
                <li className="flex items-center text-gray-200" aria-current="page">
                    {/* Başlık çok uzunsa kısalt */}
                   {thread.title.length > 50 ? `${thread.title.substring(0, 50)}...` : thread.title}
               </li>
            </ol>
         </nav>
        <h1 className="text-3xl font-bold text-gray-100">{thread.title}</h1>
        {/* Konu kilitliyse uyarı */}
        {thread.isLocked && (
           <span className="text-sm bg-red-800 text-red-200 px-2 py-1 rounded ml-2">🔒 Kilitli</span>
        )}
      </div>

      {/* Mesaj Listesi */}
      <div>
         {isLoadingPostsInitial && <p className="text-center text-gray-400 py-5">Mesajlar yükleniyor...</p>}
         {postsError && <p className="text-center text-red-400 py-5">Mesajlar yüklenirken hata oluştu: {postsError.message}</p>}
         {!isLoadingPostsInitial && !postsError && <PostList posts={posts} />}

         {/* Daha Fazla Yükle Butonu */}
         {!isLoadingPostsInitial && !postsError && !isReachingEnd && (
            <div className="mt-6 text-center">
               <button
                 onClick={() => setSize(size + 1)}
                 disabled={isLoadingMore}
                 className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {isLoadingMore ? 'Yükleniyor...' : 'Daha Fazla Mesaj Yükle'}
               </button>
            </div>
          )}
           {!isLoadingPostsInitial && !postsError && isReachingEnd && posts.length > POSTS_PER_PAGE && ( // Sadece 1 sayfadan fazlaysa göster
              <p className="text-center text-gray-500 mt-6">Tüm mesajlar yüklendi.</p>
           )}
      </div>

      {/* === CEVAP YAZMA ALANI (GÜNCELLENDİ) === */}
      {isAuthenticated && !thread.isLocked && threadId && (
         // ReplyForm'u render et ve gerekli props'ları geç
         <ReplyForm threadId={threadId} onSuccess={handleReplySuccess} />
       )}
      {/* === Giriş yapmamış veya konu kilitliyse gösterilecek mesajlar (Değişiklik yok) === */}
       {!isAuthenticated && !thread.isLocked && (
          <div className="mt-8 text-center p-4 bg-gray-800 rounded-lg shadow">
             <p className="text-gray-400">Bu konuya cevap yazabilmek için <Link href={`/login?redirect=/thread/${slug}`} className="text-indigo-400 hover:text-indigo-300">giriş yapmanız</Link> gerekmektedir.</p>
          </div>
       )}
       {thread.isLocked && (
          <div className="mt-8 text-center p-4 bg-red-900/50 border border-red-800 rounded-lg shadow">
             <p className="text-red-300 font-semibold">🔒 Bu konu kilitlenmiştir ve yeni cevap yazılamaz.</p>
          </div>
       )}
       

    </div>
  );
};

export default ThreadPage;