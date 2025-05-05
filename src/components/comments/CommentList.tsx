// src/components/comments/CommentList.tsx
import React from 'react';
import { PostComment } from '@/types/comment';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: PostComment[];
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return <p className="text-xs text-gray-500 py-2">Henüz hiç yorum yapılmamış.</p>;
  }
  return (
    <div>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
export default CommentList;