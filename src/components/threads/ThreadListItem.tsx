// src/components/threads/ThreadListItem.tsx
import React from 'react';
import Link from 'next/link';
import { Thread } from '@/types/thread';
// Zamanı formatlamak için bir kütüphane veya basit fonksiyon kullanabilirsin
// import { formatDistanceToNow } from 'date-fns';
// import { tr } from 'date-fns/locale';

interface ThreadListItemProps {
  thread: Thread;
}

// Basit zaman formatlama fonksiyonu (veya date-fns kullan)
const formatRelativeTime = (dateString: string) => {
   try {
    // date-fns ile daha iyi formatlama:
    // return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: tr });
    const date = new Date(dateString);
    // Çok basit formatlama:
    return date.toLocaleDateString('tr-TR') + ' ' + date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit'});
   } catch (e) {
     return dateString; // Hata olursa orijinal string'i dön
   }
};


const ThreadListItem: React.FC<ThreadListItemProps> = ({ thread }) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded ${thread.isPinned ? 'bg-purple-900/30 border-l-4 border-purple-600' : 'bg-gray-800 hover:bg-gray-700'} transition-colors shadow-sm`}>
      {/* Sol Taraf: Başlık, Yazar, İkonlar */}
      <div className="flex-grow overflow-hidden mr-4">
        <div className="flex items-center space-x-2 mb-1">
          {thread.isPinned && (
            <span title="Sabitlenmiş Konu" className="text-purple-400 flex-shrink-0">📌</span>
          )}
          {thread.isLocked && (
            <span title="Kilitli Konu" className="text-red-400 flex-shrink-0">🔒</span>
          )}
          <Link
            href={`/thread/${thread.slug}`} // Konu detay sayfasına link (henüz yok)
            className="text-base md:text-lg font-semibold text-gray-100 hover:text-purple-300 truncate transition-colors"
            title={thread.title}
          >
            {thread.title}
          </Link>
        </div>
        <p className="text-xs text-gray-400">
          <Link href={`/profile/${thread.author?.username || '#'}`} className="hover:text-gray-200">
             {thread.author?.username || 'Bilinmeyen Yazar'}
          </Link>
          {' • '}
          <span title={new Date(thread.createdAt).toLocaleString('tr-TR')}>{formatRelativeTime(thread.createdAt)}</span>
        </p>
      </div>

      {/* Orta: Cevap / Görüntülenme Sayısı */}
      <div className="hidden sm:flex flex-col text-center mx-4 flex-shrink-0">
        <span className="text-sm font-medium text-gray-200">{thread.replyCount}</span>
        <span className="text-xs text-gray-500">Cevap</span>
      </div>
       <div className="hidden sm:flex flex-col text-center mx-4 flex-shrink-0">
         <span className="text-sm font-medium text-gray-200">{thread.viewCount}</span>
         <span className="text-xs text-gray-500">Gösterim</span>
       </div>

      {/* Sağ Taraf: Son Mesaj Bilgisi */}
      <div className="text-right text-xs text-gray-400 flex-shrink-0 w-32 md:w-48 truncate">
        {thread.__lastPostBy__ ? (
           <Link href={`/profile/${thread.__lastPostBy__?.username || '#'}`} className="hover:text-gray-200">
             {thread.__lastPostBy__?.username || 'Bilinmiyor'}
           </Link>
        ) : (
          <span>-</span>
        )}

        <span className="block mt-1" title={new Date(thread.lastPostAt).toLocaleString('tr-TR')}>
          {formatRelativeTime(thread.lastPostAt)}
        </span>
      </div>
    </div>
  );
};

export default ThreadListItem;