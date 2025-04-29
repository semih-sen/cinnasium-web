// src/pages/threads/new.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
// ... (diğer importlar aynı)
import useSWR from 'swr';
const SimpleMdeReact = dynamic(
    () => import('react-simplemde-editor'),
    { ssr: false }
  );
import AuthGuard from '@/components/auth/AuthGuard';
import { fetcher } from '@/lib/fetcher';
import api from '@/lib/api';
import { Category } from '@/types/category'; // Tam Category tipini alalım (children içeriyor)
import { toast } from 'react-toastify'; // Toastify importu
import dynamic from 'next/dynamic';

// Kategori seçeneklerini oluşturmak için tip
interface CategoryOption {
  value: string;
  label: string;
  slug?: string; // Slug'ı da taşıyalım ki ilk kategori seçimini yapabilelim
}

// Recursive fonksiyon: Kategori ağacını düzleştirip <option> için hazırlar
const generateCategoryOptions = (categories: Category[], level = 0): CategoryOption[] => {
  let options: CategoryOption[] = [];
  const prefix = '— '.repeat(level); // Her seviye için girinti

  categories.forEach(category => {
    options.push({
      value: category.id,
      label: `${prefix}${category.name}`,
      slug: category.slug // Slug'ı ekle
    });
    if (category.children && category.children.length > 0) {
      options = options.concat(generateCategoryOptions(category.children, level + 1));
    }
  });
  return options;
};


const NewThreadPage: React.FC = () => {
  const router = useRouter();
  const { category: initialCategorySlug } = router.query;

  // ... (form state'leri aynı: title, selectedCategoryId, content, isLoading, error)
    const [title, setTitle] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Error state'ini belki sadece client-side validasyon için tutabiliriz, API hatalarını toast ile göstereceğiz
    const [clientError, setClientError] = useState<string | null>(null);


  // Kategorileri Ağaç Olarak Çek
  const { data: categoryTree, error: categoriesError } = useSWR<Category[]>('/category/tree', fetcher);

  // Düzleştirilmiş kategori seçeneklerini hesapla
  const categoryOptions = useMemo(() => {
    return categoryTree ? generateCategoryOptions(categoryTree) : [];
  }, [categoryTree]);

  // URL'den gelen kategori slug'ına göre başlangıç kategorisini ayarla
  useEffect(() => {
    if (initialCategorySlug && categoryOptions.length > 0 && !selectedCategoryId) { // Sadece bir kere ayarla
      const initialCategory = categoryOptions.find(opt => opt.slug === initialCategorySlug);
      if (initialCategory) {
        setSelectedCategoryId(initialCategory.value);
      }
    }
  }, [initialCategorySlug, categoryOptions, selectedCategoryId]); // selectedCategoryId bağımlılığı eklendi


  // ... (onContentChange, editorOptions aynı)
    const onContentChange = useCallback((value: string) => { setContent(value); }, []);
    const editorOptions = useMemo(() => ({ /* ... seçenekler ... */ }), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null); // Client hatalarını temizle

    if (!selectedCategoryId) { setClientError("Lütfen bir kategori seçin."); return; }
    if (!title.trim()) { setClientError("Konu başlığı boş olamaz."); return; }
    if (!content.trim()) { setClientError("Mesaj içeriği boş olamaz."); return; }

     // Client hatası varsa toast ile göster
     if (clientError) {
         toast.error(clientError);
         return;
     }

    setIsLoading(true);
    // setError(null); // API hatası için state'i kullanmayacağız, toast kullanacağız

    try {
      const response = await api.post('/threads/create', {
        title: title.trim(),
        categoryId: selectedCategoryId,
        content: content,
      });

      // Başarı Toast'ı
      toast.success("Konu başarıyla oluşturuldu!");

      if (response.data && response.data.slug) {
        router.push(`/thread/${response.data.slug}`);
      } else {
        router.push('/');
      }

    } catch (err: any) {
      console.error("New thread error:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Konu oluşturulurken bir hata oluştu.';
      // API Hata Toast'ı
       if (Array.isArray(errorMessage)) {
         toast.error(errorMessage.join(', '));
       } else {
         toast.error(errorMessage);
       }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-6">Yeni Konu Aç</h1>

        <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-lg shadow-md space-y-6">
          {/* Client Hata Mesajı (opsiyonel, toast yeterli olabilir) */}
          {/* {clientError && <div className="text-red-400 text-sm">{clientError}</div>} */}

          {/* Kategori Seçimi */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
              Kategori *
            </label>
            {categoriesError && <p className="text-xs text-red-400">Kategoriler yüklenemedi.</p>}
            <select
              id="category"
              name="category"
              value={selectedCategoryId}
              onChange={(e) => { setSelectedCategoryId(e.target.value); setClientError(null); }} // Seçim değişince hatayı temizle
              required
              disabled={!categoryTree || isLoading}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              <option value="" disabled>-- Kategori Seçin --</option>
              {/* Düzleştirilmiş ve girintili seçenekleri render et */}
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Konu Başlığı */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Konu Başlığı *</label>
            <input /* ... (input aynı, onChange'de setClientError(null) eklenebilir) ... */
               type="text" id="title" name="title" value={title} required maxLength={150} disabled={isLoading}
               onChange={(e) => { setTitle(e.target.value); setClientError(null); }}
               className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
               placeholder="Konunuz için açıklayıcı bir başlık girin..."
            />
          </div>

          {/* İlk Mesaj İçeriği */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Mesaj İçeriği *</label>
            <SimpleMdeReact
                 id="content"
                 options={editorOptions}
                 value={content}
                 onChange={(value) => { onContentChange(value); if(value.trim()) setClientError(null); }} // İçerik girilince hatayı temizle
                 className={`${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
             />
          </div>

          {/* Gönder Butonu */}
           <div className="text-right">
               <button type="submit" disabled={isLoading || !selectedCategoryId || !title.trim() || !content.trim()} /* ... (button aynı) ... */ >
                   {isLoading ? 'Oluşturuluyor...' : 'Konuyu Oluştur'}
               </button>
           </div>
        </form>
      </div>
    </AuthGuard>
  );
};

export default NewThreadPage;