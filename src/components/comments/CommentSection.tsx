// src/components/comments/CommentSection.tsx
import React from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@/lib/fetcher';
import { PostComment } from '@/types/comment';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import { useAuth } from '@/context/AuthContext'; // Yorum formu için
import { Paginated } from '@/types/paginated';

interface CommentSectionProps {
  postId: string;
}

const COMMENTS_PER_PAGE = 5;

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { isAuthenticated } = useAuth();

  // Yorumları çekmek için SWR Infinite
  const getKey = (pageIndex: number, previousPageData: Paginated<PostComment> | null): string | null => {
    if (previousPageData && !previousPageData.items.length) return null;
    const page = pageIndex + 1;
    return `/posts/${postId}/comments?page=${page}&limit=${COMMENTS_PER_PAGE}`;
  };

  const { data, error, size, setSize, mutate, isValidating } = useSWRInfinite<Paginated<PostComment>>(getKey, fetcher);

  const comments: PostComment[] = data ? data.reduce((acc, page) => acc.concat(page.items), [] as PostComment[]) : [];
  const isLoadingInitial = !data && !error;
  const isLoadingMore = isLoadingInitial || (size > 0 && data && typeof data[size - 1] === 'undefined' && isValidating);
  
  console.log(data);
  const isEmpty = data?.[0]?.items.length === 0;
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.items.length < COMMENTS_PER_PAGE);

  const handleCommentSuccess = () => {
     // Yeni yorum eklenince ilk sayfayı (veya tümünü) yenile
     mutate();
     // Belki post'un commentCount'unu da yenilemek gerekir (parent'a callback ile?)
  };

  return (
    <div className="mt-3 pt-3 border-t border-dashed border-gray-600">
       {isLoadingInitial && <p className="text-xs text-gray-500">Yorumlar yükleniyor...</p>}
       {error && <p className="text-xs text-red-400">Yorumlar yüklenemedi.</p>}

       {!isLoadingInitial && !error && <CommentList comments={comments} />}

       {/* Daha Fazla Yorum Yükle */}
       {!isLoadingInitial && !error && !isReachingEnd && (
           <button
              onClick={() => setSize(size + 1)}
              disabled={isLoadingMore}
              className="text-xs text-indigo-400 hover:text-indigo-300 mt-2 disabled:opacity-50"
            >
              {isLoadingMore ? 'Yükleniyor...' : 'Önceki Yorumları Göster'}
            </button>
        )}

       {/* Yeni Yorum Formu */}
       {isAuthenticated && <CommentForm postId={postId} onSuccess={handleCommentSuccess} />}

    </div>
  );
};

export default CommentSection;