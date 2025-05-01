// src/components/admin/CategoryForm.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Category } from '@/types/category';
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { UserRole } from '@/types/enums'; // Rol enum'larını varsayalım (oluşturulmalı)

interface CategoryFormProps {
  category?: Category | null; // Düzenlenecek kategori (null ise yeni ekleniyor)
  categories: Category[]; // Parent seçimi için tüm ağaç
  onSuccess: () => void; // Başarılı işlem sonrası callback
  onCancel: () => void;  // İptal callback'i
}

// Kategori seçeneklerini oluşturmak için tip (new.tsx'teki ile aynı)
interface CategoryOption {
  value: string;
  label: string;
  level: number; // Düzeyi de taşıyalım
  original: Category; // Orijinal kategori objesi (alt öğeleri kontrol için)
}

// Recursive fonksiyon (new.tsx'teki, biraz geliştirilmiş)
const generateCategoryOptions = (
    categories: Category[],
    level = 0,
    disabledIds: string[] = [] // Kendini ve alt öğelerini parent olarak seçmeyi engellemek için
    ): CategoryOption[] => {
  let options: CategoryOption[] = [];
  const prefix = '— '.repeat(level);

  categories.forEach(category => {
    const isDisabled = disabledIds.includes(category.id);
    options.push({
      value: category.id,
      label: `${prefix}${category.name}`,
      level: level,
      original: category, // Orijinali ekle
    });

    if (category.children && category.children.length > 0) {
       // Eğer mevcut kategori disable edildiyse, tüm alt öğelerini de disable et
      const childDisabledIds = isDisabled
         ? [...disabledIds, ...category.children.map(c => c.id)]
         : disabledIds;
      options = options.concat(generateCategoryOptions(category.children, level + 1, childDisabledIds));
    }
  });
  return options;
};

// Kategori ağacından belirli bir ID ve onun tüm alt öğelerinin ID'lerini döndüren fonksiyon
const getCategoryAndDescendantIds = (categories: Category[], targetId: string): string[] => {
    let ids: string[] = [];
    const findDescendants = (category: Category) => {
        ids.push(category.id);
        if (category.children) {
            category.children.forEach(findDescendants);
        }
    };

    const findTarget = (cats: Category[]) => {
        for (const cat of cats) {
            if (cat.id === targetId) {
                findDescendants(cat);
                return true; // Bulduk, daha fazla aramaya gerek yok
            }
            if (cat.children && findTarget(cat.children)) {
                return true; // Alt ağaçta bulundu
            }
        }
        return false; // Bu dalda bulunamadı
    };

    findTarget(categories);
    return ids;
};


const CategoryForm: React.FC<CategoryFormProps> = ({ category, categories, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parentId, setParentId] = useState<string | null>(null);
  const [minViewRole, setMinViewRole] = useState<UserRole>(UserRole.GUEST);
  const [minThreadRole, setMinThreadRole] = useState<UserRole>(UserRole.USER);
  const [minPostRole, setMinPostRole] = useState<UserRole>(UserRole.USER);
  // Diğer alanlar eklenebilir (iconUrl, displayOrder vs.)

  const [isLoading, setIsLoading] = useState(false);

  // Düzenleme modunda formu doldur
  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || '');
      // Parent'ı bulmak için ağacı gezmemiz gerekebilir (veya backend'den parentId gelmeli)
      // Şimdilik backend'den geldiğini varsayalım veya category.parent objesi varsa:
      // setParentId(category.parentId || null);
      setMinViewRole(category.minViewRole || UserRole.GUEST); // Backend'den gelen role göre
      setMinThreadRole(category.minThreadRole || UserRole.USER);
      setMinPostRole(category.minPostRole || UserRole.USER);
    } else {
      // Yeni ekleme modunda formu sıfırla
      setName('');
      setDescription('');
      setParentId(null);
      setMinViewRole(UserRole.GUEST);
      setMinThreadRole(UserRole.USER);
      setMinPostRole(UserRole.USER);
    }
  }, [category]);


  // Parent dropdown seçeneklerini hazırla
  const parentOptions = useMemo(() => {
      // Düzenleme modundaysak, düzenlediğimiz kategoriyi ve onun alt öğelerini parent olarak seçemeyiz
      const disabledIds = category ? getCategoryAndDescendantIds(categories, category.id) : [];
      const generatedOptions = generateCategoryOptions(categories, 0, disabledIds);

     // Seçeneklerin başına "Ana Kategori" ekle
      const options : {value: string, label: string, disabled: boolean}[]= [{ value: "", label: "—— Ana Kategori ——", disabled: false }];

      generatedOptions.forEach(opt => {
        options.push({
            value: opt.value,
            label: opt.label,
            disabled: disabledIds.includes(opt.value) // Disable kontrolü
        })
      })

      return options

  }, [categories, category]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      parentId: parentId || null, // Boş string yerine null gönder
      minViewRole,
      minThreadRole,
      minPostRole,
    };

    try {
      if (category) {
        // Güncelleme
        await api.patch(`/category/${category.id}`, payload);
      } else {
        // Yeni Ekleme
        await api.post('/category/create', payload);
      }
      onSuccess(); // Başarı callback'ini çağır (listeyi yenileme vs. parent'ta yapılır)
    } catch (err: any) {
      console.error("Category form error:", err);
      toast.error(err.response?.data?.message || 'İşlem sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Bu formu bir Modal içine koyabilir veya doğrudan sayfada gösterebilirsin
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-100">
          {category ? 'Kategoriyi Düzenle' : 'Yeni Kategori Oluştur'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kategori Adı */}
          <div>
            <label htmlFor="cat-name" className="block text-sm font-medium text-gray-300 mb-1">Kategori Adı *</label>
            <input type="text" id="cat-name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} className="w-full input-style" />
          </div>

          {/* Açıklama */}
          <div>
            <label htmlFor="cat-desc" className="block text-sm font-medium text-gray-300 mb-1">Açıklama</label>
            <textarea id="cat-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} disabled={isLoading} className="w-full input-style"></textarea>
          </div>

          {/* Parent Kategori */}
          <div>
             <label htmlFor="cat-parent" className="block text-sm font-medium text-gray-300 mb-1">Üst Kategori</label>
             <select id="cat-parent" value={parentId ?? ""} onChange={(e) => setParentId(e.target.value || null)} disabled={isLoading} className="w-full input-style">
                {parentOptions.map(opt => (
                  <option key={opt.value || 'none'} value={opt.value} disabled={opt.disabled} className={opt.disabled ? 'text-gray-500' : ''}>
                    {opt.label}
                  </option>
                ))}
              </select>
           </div>

          {/* Rol İzinleri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
               <label htmlFor="cat-view" className="block text-sm font-medium text-gray-300 mb-1">Min. Görme Rolü</label>
               <select id="cat-view" value={minViewRole} onChange={(e) => setMinViewRole(e.target.value as UserRole)} disabled={isLoading} className="w-full input-style">
                 {Object.values(UserRole).map(role => (<option key={role} value={role}>{role}</option>))}
               </select>
             </div>
             <div>
               <label htmlFor="cat-thread" className="block text-sm font-medium text-gray-300 mb-1">Min. Konu Açma Rolü</label>
                <select id="cat-thread" value={minThreadRole} onChange={(e) => setMinThreadRole(e.target.value as UserRole)} disabled={isLoading} className="w-full input-style">
                  {Object.values(UserRole).map(role => (<option key={role} value={role}>{role}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="cat-post" className="block text-sm font-medium text-gray-300 mb-1">Min. Mesaj Yazma Rolü</label>
                <select id="cat-post" value={minPostRole} onChange={(e) => setMinPostRole(e.target.value as UserRole)} disabled={isLoading} className="w-full input-style">
                 {Object.values(UserRole).map(role => (<option key={role} value={role}>{role}</option>))}
                </select>
              </div>
            </div>


          {/* Butonlar */}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onCancel} disabled={isLoading} className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-semibold py-2 px-4 rounded transition-colors">
              İptal
            </button>
            <button type="submit" disabled={isLoading || !name.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-70">
              {isLoading ? 'Kaydediliyor...' : (category ? 'Güncelle' : 'Oluştur')}
            </button>
          </div>
        </form>
      </div>
      {/* Basit input stili (globals.css'e eklenebilir) */}
      <style jsx global>{`
        .input-style {
          background-color: #374151; /* bg-gray-700 */
          border: 1px solid #4B5563; /* border-gray-600 */
          border-radius: 0.375rem; /* rounded-md */
          color: white;
          padding: 0.5rem 0.75rem; /* px-3 py-2 */
          width: 100%;
        }
        .input-style:focus {
          outline: none;
          box-shadow: 0 0 0 2px #8B5CF6; /* ring-2 ring-purple-500 */
        }
        .input-style:disabled {
            opacity: 0.5;
        }
        select.input-style {
           appearance: none; /* Tarayıcı varsayılan okunu kaldır */
           background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23BBB%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.6-3.6%205.4-7.9%205.4-12.8%200-5-1.8-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E');
           background-repeat: no-repeat;
           background-position: right 0.7em top 50%, 0 0;
           background-size: 0.65em auto, 100%;
        }
      `}</style>
    </div>
  );
};

export default CategoryForm;