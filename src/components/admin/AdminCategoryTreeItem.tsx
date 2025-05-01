// src/components/admin/AdminCategoryTreeItem.tsx
import React, { useState } from 'react';
import { Category } from '@/types/category';
import { FaEdit, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa'; // İkonlar için

interface AdminCategoryTreeItemProps {
  category: Category;
  level: number;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

const AdminCategoryTreeItem: React.FC<AdminCategoryTreeItemProps> = ({ category, level, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true); // Başlangıçta açık mı?
  const hasChildren = category.children && category.children.length > 0;
  const paddingLeft = `${level * 1.5}rem`;

  return (
    <div className={`border-l ${level === 0 ? 'border-transparent' : 'border-gray-700/50'} ${level > 0 ? 'ml-4 pl-4' : ''}`}>
      <div className="flex items-center justify-between p-2 bg-gray-800 hover:bg-gray-700 rounded mb-1 transition-colors">
        <div className="flex items-center flex-grow overflow-hidden mr-2">
          {/* Genişlet/Daralt Butonu */}
          {hasChildren && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="mr-2 text-gray-500 hover:text-gray-300">
              {isExpanded ? <FaChevronDown size="0.8em" /> : <FaChevronRight size="0.8em" />}
            </button>
          )}
           {!hasChildren && <span className="inline-block w-[1.1em] mr-2"></span>} {/* Boşluk bırak */}

          {/* Kategori Adı */}
          <span className="font-medium text-gray-200 truncate" title={category.name}>
            {category.name}
          </span>
           {/* Rol bilgisi vb. küçük ikonlarla gösterilebilir */}
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex-shrink-0 space-x-2">
          <button
            onClick={() => onEdit(category)}
            title="Düzenle"
            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            title="Sil"
            className="text-red-500 hover:text-red-400 transition-colors p-1"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Alt Kategoriler (Genişletilmişse) */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {category.children?.map(child => (
            <AdminCategoryTreeItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategoryTreeItem;