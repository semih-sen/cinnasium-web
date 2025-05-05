// src/components/posts/PostItem.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { Post } from '@/types/post';
import Image from "next/image"
import ReactMarkdown from 'react-markdown'; // Markdown'ı render etmek için
import { FaCommentAlt, FaSpinner, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import CommentSection from '../comments/CommentSection';
// import { formatDistanceToNow } from 'date-fns'; // Örnek zaman formatlama
// import { tr } from 'date-fns/locale'; // Örnek zaman formatlama

interface PostItemProps {
  post: Post;
  onVote: (postId: string, value: 1 | -1) => Promise<void>; 
}

 // Basit zaman formatlama fonksiyonu (ThreadListItem'daki ile aynı)
const formatRelativeTime = (dateString: string) => {
   try {
     const date = new Date(dateString);
     return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
   } catch (e) {
     return dateString;
   }
};

const PostItem: React.FC<PostItemProps> = ({ post, onVote }) => {
  const [isVoting, setIsVoting] = useState<'up' | 'down' | false>(false);
   const [showComments, setShowComments] = useState(false); // Sonraki adım için

  // Oylama işlemini yöneten fonksiyon
  const handleVoteClick = async (value: 1 | -1) => {
      setIsVoting(value === 1 ? 'up' : 'down');
      try {
          await onVote(post.id, value); // Parent component'teki fonksiyonu çağır
      } catch (error) {
          // Hata toast'ı parent'ta gösterilebilir veya burada da gösterilebilir
          console.error("Vote failed in PostItem", error);
      } finally {
          setIsVoting(false);
      }
  };


return (
  <div className={`flex flex-col sm:flex-row p-4 rounded-lg shadow ${post.isThreadStarter ? 'bg-gradient-to-b from-gray-800 to-gray-850 border-t-2 border-purple-600' : 'bg-gray-800'} mb-5`}>
    {/* Sol Taraf: Yazar Bilgileri (Değişiklik Yok) */}
    <div className="flex-shrink-0 w-full sm:w-24 md:w-32 sm:mr-4 text-center sm:text-left mb-4 sm:mb-0">
       {/* ... (Yazar kartı aynı) ... */}
         <Link href={`/profile/${post.author?.username || '#'}`} className="block mb-2">
           <div className="w-16 h-16 md:w-20 md:h-20 mx-auto sm:mx-0 bg-gray-700 rounded-full mb-2 flex items-center justify-center text-purple-400 text-3xl font-bold">
             {post.author?.username?.[0]?.toUpperCase() || '?'}
           </div>
           <span className="font-semibold text-sm md:text-base text-gray-200 hover:text-purple-300 break-words block">
             {post.author?.username || 'Bilinmeyen'}
           </span>
         </Link>
    </div>

    {/* Sağ Taraf: Mesaj İçeriği ve Metadatası */}
    <div className="flex-grow">
      {/* Mesaj Metadatası (Değişiklik Yok) */}
       <div className="text-xs text-gray-500 mb-2 pb-2 border-b border-gray-700 flex justify-between items-center">
         <span>
           Gönderim: {formatRelativeTime(post.createdAt)}
           {post.isEdited && <span className="ml-2 text-yellow-500">(Düzenlendi)</span>}
         </span>
         <Link href={`#post-${post.id}`} className="hover:text-gray-300">#{post.id.substring(0, 6)}</Link>
       </div>

      {/* Mesaj İçeriği (Değişiklik Yok) */}
      <div id={`post-${post.id}`} className="prose prose-sm prose-invert max-w-none text-gray-200 mb-4">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Alt Kısım: Oylama, Yorumlar ve Aksiyonlar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 pt-2 border-t border-gray-700/50">
         {/* Sol: Oylama ve Yorum Butonu */}
         <div className="flex items-center space-x-4 text-gray-400 mb-3 sm:mb-0">
           {/* Upvote Butonu */}
           <button
              onClick={() => handleVoteClick(1)}
              disabled={!!isVoting}
              className={`flex items-center space-x-1 hover:text-green-500 transition-colors text-xs disabled:opacity-50 disabled:cursor-wait`}
              title="Beğen"
           >
              {isVoting === 'up' ? <FaSpinner className="animate-spin" /> : <FaThumbsUp />}
              <span>{post.upvotes ?? 0}</span>
           </button>
            {/* Downvote Butonu */}
           <button
              onClick={() => handleVoteClick(-1)}
              disabled={!!isVoting}
              className={`flex items-center space-x-1 hover:text-red-500 transition-colors text-xs disabled:opacity-50 disabled:cursor-wait`}
              title="Beğenme"
           >
               {isVoting === 'down' ? <FaSpinner className="animate-spin" /> : <FaThumbsDown />}
              <span>{post.downvotes ?? 0}</span>
           </button>
           {/* Yorum Butonu (Sonraki adım) */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 hover:text-blue-400 transition-colors text-xs"
              title="Yorumlar"
           >
              <FaCommentAlt />
              <span>{post.commentCount ?? 0}</span>
           </button> 
         </div>

          {/* Sağ: Aksiyon Butonları (Placeholder) */}
         <div className="flex space-x-3 text-gray-400 text-xs">
           <button className="hover:text-indigo-400">Yanıtla</button>
           {/* <button className="hover:text-yellow-400">Düzenle</button> */}
           {/* <button className="hover:text-red-400">Sil</button> */}
         </div>
      </div>

       {/* Yorum Alanı (Sonraki adımda buraya gelecek) */}
       {showComments && <CommentSection postId={post.id} />} 

    </div>
  </div>
);
};

export default PostItem;