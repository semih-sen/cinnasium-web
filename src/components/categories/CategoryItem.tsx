// src/components/categories/CategoryItem.tsx
import React from 'react';
import Link from 'next/link';
import { Category } from '@/types/category'; // Kategori tipini import et
// İleride CategoryList'i de import edeceğiz recursive yapı için

interface CategoryItemProps {
  category: Category;
  level?: number; // İç içe girinti seviyesi için (opsiyonel)
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, level = 0 }) => {
  const hasChildren = category.children && category.children.length > 0;
  // Girinti için sol padding (isteğe bağlı)
  const paddingLeft = `${level * 1.5}rem`; // Her seviye için 1.5rem (24px)

  return (
    <div
      className={`bg-gray-800 p-4 rounded-md shadow transition-colors hover:bg-gray-700 ${level > 0 ? 'mt-2' : ''}`}
      style={{ marginLeft: paddingLeft }} // Girintiyi uygula
    >
      <div className="flex justify-between items-center">
        {/* Sol taraf: Kategori Adı ve Açıklama */}
        <div className="flex-grow pr-4">
          <Link
            href={`/category/${category.slug}`} // Kategori sayfasına link (henüz oluşturulmadı)
            className="text-lg font-semibold text-purple-400 hover:text-purple-300 transition-colors"
          >
            {category.name}
          </Link>
          {category.description && (
            <p className="text-sm text-gray-400 mt-1">{category.description}</p>
          )}
        </div>
        {/* Sağ taraf: İstatistikler (Opsiyonel) */}
        {(typeof category.threadCount === 'number' || typeof category.postCount === 'number') && (
           <div className="text-right text-sm text-gray-500 flex-shrink-0">
             {typeof category.threadCount === 'number' && (
               <div>{category.threadCount} Konu</div>
             )}
             {typeof category.postCount === 'number' && (
               <div>{category.postCount} Mesaj</div>
             )}
           </div>
        )}
      </div>

      {/* Alt Kategoriler (varsa) */}
      {hasChildren && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          {/* Alt kategorileri listelemek için CategoryList'i (veya doğrudan map) kullanacağız */}
           {category.children?.map(child => (
             <CategoryItem key={child.id} category={child} level={level + 1} />
           ))}
        </div>
      )}
    </div>
  );
};

export default CategoryItem;