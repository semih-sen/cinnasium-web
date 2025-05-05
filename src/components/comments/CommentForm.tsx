// src/components/comments/CommentForm.tsx
import React, { useState } from 'react';
import api from '@/lib/api';
import { toast } from 'react-toastify';

interface CommentFormProps {
  postId: string;
  onSuccess: () => void; // Yorum eklenince listeyi yenilemek için
}

const CommentForm: React.FC<CommentFormProps> = ({ postId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      // Varsayım: POST /posts/:id/comments
      await api.post(`/posts/${postId}/comments`, { content });
      setContent('');
      toast.success("Yorumunuz eklendi.", { autoClose: 2000 });
      onSuccess(); // Parent'a bildir (mutate tetiklenecek)
    } catch (err: any) {
      console.error("Comment submit error:", err);
      toast.error(err.response?.data?.message || 'Yorum eklenirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex items-center space-x-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Yorum ekle..."
        disabled={isLoading}
        required
        className="flex-grow px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !content.trim()}
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-3 py-1 rounded transition-colors disabled:opacity-70"
      >
        {isLoading ? '...' : 'Gönder'}
      </button>
    </form>
  );
};

export default CommentForm;