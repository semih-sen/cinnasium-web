// src/components/comments/CommentItem.tsx
import React from 'react';
import Link from 'next/link';
import { PostComment } from '@/types/comment';

// Basit zaman formatlama (PostItem'daki ile aynı veya date-fns)
const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'});
    } catch (e) {
      return dateString;
    }
 };


interface CommentItemProps {
  comment: PostComment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  return (
    <div className="flex items-start space-x-2 py-2 border-b border-gray-700/50 last:border-b-0">
       {/* Küçük Avatar Placeholder */}
        <div className="flex-shrink-0 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-purple-300 text-xs font-bold">
            {comment.author?.username?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-grow text-sm">
            <p className="text-gray-300">
               <Link href={`/profile/${comment.author?.username || '#'}`} className="font-semibold hover:text-purple-300 mr-1">
                   {comment.author?.username || 'Bilinmeyen'}
               </Link>
                <span className="text-gray-500 text-xs ml-1">· {formatRelativeTime(comment.createdAt)}</span>
            </p>
            <p className="text-gray-200 mt-1">{comment.content}</p>
        </div>
    </div>
  );
};

export default CommentItem;