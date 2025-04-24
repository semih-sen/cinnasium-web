// src/components/categories/CategoryList.tsx
import React from 'react';
import { Category } from '@/types/category';
import CategoryItem from './CategoryItem'; // CategoryItem'ı import et

interface CategoryListProps {
  categories: Category[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return <p className="text-gray-500">Gösterilecek kategori bulunamadı.</p>;
  }

  return (
    <div className="space-y-4"> {/* Kategoriler arası boşluk */}
      {categories.map(category => (
        <CategoryItem key={category.id} category={category} level={0} /> // level=0 top-level için
      ))}
    </div>
  );
};

export default CategoryList;