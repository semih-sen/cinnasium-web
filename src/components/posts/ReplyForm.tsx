// src/components/posts/ReplyForm.tsx
import React, { useState, useCallback, useMemo } from 'react';

const SimpleMDE = dynamic(
    () => import('react-simplemde-editor'),
    { ssr: false }
  );
  


import api from '@/lib/api'; // Axios instance'ımız
import dynamic from 'next/dynamic';

interface ReplyFormProps {
  threadId: string; // Hangi konuya cevap yazıldığını bilmek için
  onSuccess: () => void; // Başarılı gönderim sonrası tetiklenecek fonksiyon (listeyi yenilemek için)
}

const ReplyForm: React.FC<ReplyFormProps> = ({ threadId, onSuccess }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editörün içeriği değiştiğinde state'i güncelle
  const onChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  // Editör seçenekleri (isteğe bağlı, useMemo ile performans optimizasyonu)
  const editorOptions = useMemo(() => {
    return {
      spellChecker: false, // Tarayıcı spell check'i kapatabiliriz
      maxHeight: "250px",
      minHeight: "150px",

      autofocus: false,
      placeholder: "Mesajınızı buraya yazın (Markdown desteklenir)...",
      status: ["lines", "words"], // Alt status bar'da ne gösterilecek
       /*toolbar: [ // Gösterilecek toolbar butonları (özelleştirilebilir)
         "bold", "italic", "heading", "|",
         "quote", "unordered-list", "ordered-list", "|",
         "link", "image", "|", // Resim yükleme backend desteği gerektirir!
         "preview", "side-by-side", "fullscreen", "|",
         "guide"
       ],*/
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Mesaj içeriği boş olamaz.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Backend endpoint'ine istek at (Varsayım: POST /threads/:tid/posts)
      await api.post(`/threads/${threadId}/posts`, { content });

      // Başarılı olduysa:
      setContent(''); // Editörü temizle
      onSuccess(); // Başarı callback'ini çağır (listeyi yenilemek için)

    } catch (err: any) {
      console.error("Reply error:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Mesaj gönderilirken bir hata oluştu.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-200">Cevap Yaz</h3>
      <form onSubmit={handleSubmit}>
        {/* Hata Mesajı */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-2 rounded mb-3 text-sm" role="alert">
            {error}
          </div>
        )}

        {/* Markdown Editörü */}
        {/* SimpleMdeReact dinamik olarak import edilirse SSR'da hata vermez */}
        {/* Ama şimdilik doğrudan import edelim, gerekirse düzeltiriz */}
        <SimpleMDE
        
             options={editorOptions}
             value={content}
             onChange={onChange}
             
             className="bg-gray-700 border border-gray-600 rounded" // Temel stil
        />

        {/* Gönder Butonu */}
        <div className="text-right mt-3">
          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;