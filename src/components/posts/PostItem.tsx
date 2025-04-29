// src/components/posts/PostItem.tsx
import React from 'react';
import Link from 'next/link';
import { Post } from '@/types/post';
import ReactMarkdown from 'react-markdown'; // Markdown'ı render etmek için
// import { formatDistanceToNow } from 'date-fns'; // Örnek zaman formatlama
// import { tr } from 'date-fns/locale'; // Örnek zaman formatlama

interface PostItemProps {
  post: Post;
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

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  return (
    <div className={`flex p-4 rounded-lg shadow ${post.isThreadStarter ? 'bg-gradient-to-b from-gray-800 to-gray-850 border-t-2 border-purple-600' : 'bg-gray-800'} mb-5`}>
      {/* Sol Taraf: Yazar Bilgileri */}
      <div className="flex-shrink-0 w-24 md:w-32 mr-4 text-center">
        <Link href={`/profile/${post.author?.username || '#'}`} className="block mb-2">
          {/* Avatar Placeholder */}
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gray-700 rounded-full mb-2 flex items-center justify-center text-purple-400 text-3xl font-bold">
             {/* Gerçek avatarUrl varsa <img src={post.author.avatarUrl} /> kullan */}
             {
              post.author?.avatarUrl == "default_avatar.png" ?
             post.author?.username?.[0]?.toUpperCase() || '?' : (<img src={"http://192.168.0.104:3000/auth/"+post.author?.username+"/profileImage"} />)}
          </div>
          <span className="font-semibold text-sm md:text-base text-gray-200 hover:text-purple-300 break-words">
            {post.author?.username || 'Bilinmeyen'}
          </span>
        </Link>
         {/* Rol, katılım tarihi vb. bilgiler buraya eklenebilir */}
         <div className="text-xs text-gray-500 mt-1">
            {/* Örn: <p>Üye</p> <p>Katılım: Ocak 2024</p> */}
         </div>
      </div>

      {/* Sağ Taraf: Mesaj İçeriği ve Metadatası */}
      <div className="flex-grow">
        {/* Mesaj Metadatası */}
        <div className="text-xs text-gray-500 mb-2 pb-2 border-b border-gray-700 flex justify-between">
          <span>
            Gönderim: {formatRelativeTime(post.createdAt)}
            {post.isEdited && <span className="ml-2 text-yellow-500">(Düzenlendi)</span>}
          </span>
           {/* Mesaj Linki/ID'si vb. */}
           <Link href={`#post-${post.id}`} className="hover:text-gray-300">#{post.id.substring(0, 6)}</Link>
        </div>

        {/* Mesaj İçeriği (Markdown Render Edilmiş) */}
        <div id={`post-${post.id}`} className="prose prose-sm prose-invert max-w-none text-gray-200">
          {/* prose classes (from @tailwindcss/typography) markdown stilini ayarlar */}
          {/* prose-invert koyu tema için */}
          <ReactMarkdown >{post.content}</ReactMarkdown>
        </div>

         {/* İmza Alanı (varsa) */}
         {/* {post.author?.signature && (
           <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-400 italic">
             <ReactMarkdown>{post.author.signature}</ReactMarkdown>
           </div>
         )} */}


        {/* Alt Kısım: Oylama ve Aksiyon Butonları (Placeholder) */}
        <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-700/50">
           <div className="flex space-x-3 text-gray-400">
             {/* Oylama Butonları (Placeholder) */}
             <button className="hover:text-green-500 text-xs">👍 {post.upvotes}</button>
             <button className="hover:text-red-500 text-xs">👎 {post.downvotes}</button>
           </div>
           <div className="flex space-x-3 text-gray-400">
              {/* Aksiyon Butonları (Placeholder) */}
             <button className="hover:text-indigo-400 text-xs">Yanıtla</button>
             {/* <button className="hover:text-yellow-400 text-xs">Düzenle</button> */}
             {/* <button className="hover:text-red-400 text-xs">Sil</button> */}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;