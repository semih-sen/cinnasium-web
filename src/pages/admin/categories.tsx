// src/pages/admin/categories.tsx
import React, { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { Category } from '@/types/category'; // Tam tip
import AdminLayout from '@/components/layout/AdminLayout';
import AdminCategoryTreeItem from '@/components/admin/AdminCategoryTreeItem'; // Oluşturduğumuz item bileşeni
import CategoryForm from '@/components/admin/CategoryForm'; // Oluşturduğumuz form bileşeni
import { toast } from 'react-toastify';
import api from '@/lib/api';

const AdminCategoriesPage: React.FC = () => {
  // Kategori ağacını çek
  const { data: categories, error, mutate, isLoading: isLoadingCategories } = useSWR<Category[]>('/category/tree', fetcher);

  // Formun görünürlüğü ve düzenleme durumu için state'ler
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Yeni kategori ekleme modunu aç
  const handleAddNewClick = () => {
    setEditingCategory(null); // Düzenleme modunda değiliz
    setIsFormVisible(true);
  };

  // Düzenleme modunu aç
  const handleEditClick = (category: Category) => {
    setEditingCategory(category);
    setIsFormVisible(true);
  };

  // Silme işlemi (onay ile)
  const handleDeleteClick = async (categoryId: string, categoryName: string) => {
     if (window.confirm(`'${categoryName}' kategorisini ve (varsa) tüm alt kategorilerini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
        try {
           // Backend'in cascade delete yaptığını varsayıyoruz
           await api.delete(`/categories/${categoryId}`);
           toast.success(`'${categoryName}' kategorisi başarıyla silindi!`);
           mutate(); // Listeyi yenile
        } catch (err: any) {
           console.error("Delete category error:", err);
           toast.error(err.response?.data?.message || 'Kategori silinirken bir hata oluştu.');
        }
     }
  };

  // Form başarıyla gönderildiğinde veya iptal edildiğinde formu kapat
  const handleFormSuccess = () => {
     setIsFormVisible(false);
     setEditingCategory(null);
     mutate(); // Listeyi yenile (başarı mesajını Form bileşeni veriyor)
  };

  const handleFormCancel = () => {
     setIsFormVisible(false);
     setEditingCategory(null);
  };

  // Yükleniyor veya hata durumu gösterimi
  const renderContent = () => {
    if (error) return <div className="text-red-400 bg-red-900/20 p-4 rounded">Kategoriler yüklenirken hata oluştu: {error.message}</div>;
    if (isLoadingCategories || !categories) return <div className="text-center py-10 text-gray-400">Kategoriler yükleniyor...</div>;
    if (categories.length === 0) return <div className="text-center py-10 text-gray-500">Henüz hiç kategori oluşturulmamış.</div>;

    // Kategori ağacını render et (sadece kök düğümleri map et)
    return (
      <div className="space-y-1 bg-gray-900 p-4 rounded-lg shadow-inner">
        {categories.map(category => (
          <AdminCategoryTreeItem
            key={category.id}
            category={category}
            level={0}
            onEdit={handleEditClick}
            // Silme fonksiyonuna kategori adını da gönderelim (onay mesajı için)
            onDelete={(id) => handleDeleteClick(id, category.name)}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-100">Kategori Yönetimi</h1>
        <button
          onClick={handleAddNewClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Yeni Kategori Ekle
        </button>
      </div>

      {/* Kategori Formu (Modal olarak gösteriliyor) */}
      {isFormVisible && categories && ( // categories yüklendiğinden emin ol
         <CategoryForm
            category={editingCategory}
            categories={categories} // Parent seçimi için ağacı gönder
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
         />
       )}

      {/* Kategori Listesi veya Yükleniyor/Hata Mesajı */}
      {renderContent()}

    </AdminLayout>
  );
};

export default AdminCategoriesPage;