// src/components/posts/PostList.tsx
import React from 'react';
import { Post } from '@/types/post';
import PostItem from './PostItem';

interface PostListProps {
  posts: Post[];
  onVote: (postId: string, value: 1 | -1) => Promise<void>;
}

const PostList: React.FC<PostListProps> = ({ posts, onVote }) => {
  if (!posts || posts.length === 0) {
    // Bu durum normalde ilk mesaj olduğu için pek olmaz ama yine de ekleyelim
    return <p className="text-gray-500 text-center py-8">Gösterilecek mesaj bulunamadı.</p>;
  }

  return (
    <div className="space-y-5"> {/* Mesajlar arası boşluk */}
      {posts.map(post => (
        <PostItem key={post.id} post={post} onVote={onVote}/>
      ))}
    </div>
  );
};

export default PostList;