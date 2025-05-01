// src/pages/admin/users.tsx
import React, { useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { fetcher } from '@/lib/fetcher';
import AdminLayout from '@/components/layout/AdminLayout';
import UserFilters from '@/components/admin/UserFilters'; // Filtre bileşeni
import UserTable from '@/components/admin/UserTable'; // Tablo bileşeni
import { UserStatus, UserRole } from '@/types/enums'; // Enum'lar
import { toast } from 'react-toastify';
import api from '@/lib/api';

// Backend'den gelen User tipi (AdminUser olarak adlandırdık tabloda)
// Gerçek User tipine göre ayarlanmalı
interface AdminUser {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    lastLoginAt?: string;
}

// Backend'den gelen sayfalanmış yanıt tipi
interface PaginatedUsers {
   items: AdminUser[];
   meta: { totalPages: number; currentPage: number; }; // Sadece bu ikisi yeterli olabilir
}

const USERS_PER_PAGE = 20;

const AdminUsersPage: React.FC = () => {
    // Filtre state'leri (UserFilters'a gönderilecek)
   const [filters, setFilters] = useState({ status: '', role: '', search: '' });

    // SWR Infinite key oluşturucu (filtreleri kullanır)
   const getKey = (pageIndex: number, previousPageData: PaginatedUsers | null): string | null => {
       // Son sayfaya ulaştıysak veya ilk sayfada hiç veri yoksa dur
       if (previousPageData && (!previousPageData.items || previousPageData.items.length === 0)) return null;
       // İlk sayfa veya sonraki sayfa numarası
       const page = pageIndex + 1;
       // Query parametrelerini oluştur
       const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: USERS_PER_PAGE.toString(),
          // Sadece doluysa filtreleri ekle
          ...(filters.status && { status: filters.status }),
          ...(filters.role && { role: filters.role }),
          ...(filters.search && { search: filters.search }),
       }).toString();
       //console.log("Fetching users:", `/users?${queryParams}`); // Debug için
       return `/users?${queryParams}`;
   };

  // SWR ile veriyi çek
  const {
      data: userPages,
      error,
      size, // Kaç sayfa yüklendi
      setSize, // Daha fazla sayfa yükle
      mutate, // Veriyi manuel yenile
      isValidating // Herhangi bir yükleme/yenileme var mı?
    } = useSWRInfinite<PaginatedUsers>(getKey, fetcher, {
        revalidateFirstPage: false // Filtre değişmediği sürece ilk sayfayı tekrar çekme
    });

  // Veriyi hazırlama ve state'leri hesaplama
  const users: AdminUser[] = userPages ? userPages.reduce((acc, page) => acc.concat(page.items), [] as AdminUser[]) : [];
  const isLoadingInitial = !userPages && !error; // İlk yükleme
  const isLoadingMore = isLoadingInitial || (size > 0 && userPages && typeof userPages[size - 1] === 'undefined' && isValidating);
  const isEmpty = userPages?.[0]?.items.length === 0;
  // Son sayfaya ulaşıp ulaşmadığımızı kontrol et (meta.totalPages varsa daha güvenilir olur)
  const isReachingEnd = isEmpty || (userPages && userPages[userPages.length - 1]?.items.length < USERS_PER_PAGE);
  // const isReachingEnd = isEmpty || (userPages && userPages[userPages.length-1]?.meta.currentPage >= userPages[userPages.length-1]?.meta.totalPages); // Eğer meta.totalPages varsa


  // Filtreler değiştiğinde SWR'ı tetikle (setSize(1) ilk sayfadan başlatır)
   const handleFilterChange = (newFilters: { status: string; role: string; search: string }) => {
       //console.log("Filters changed:", newFilters); // Debug
       setFilters(newFilters);
       // Filtre değiştiğinde SWR'ın yeniden validate etmesi genellikle yeterli olur,
       // ancak emin olmak için setSize(1) ile ilk sayfayı yeniden yükletebiliriz.
       // setSize(1);
   };


   // Kullanıcı Durumunu Güncelleme Fonksiyonu
  const handleStatusChange = async (userId: string, newStatus: UserStatus) => {
      if(window.confirm(`Kullanıcının durumunu ${newStatus} olarak değiştirmek istediğinize emin misiniz?`)){
         try {
            await api.put(`/users/${userId}`, { status: newStatus });
            toast.success('Kullanıcı durumu başarıyla güncellendi!');
            mutate(); // Mevcut veriyi yenile
         } catch (err: any) {
             console.error("Status change error:", err);
            toast.error(err.response?.data?.message || 'Durum güncellenirken hata oluştu.');
         }
      }
  };

  // Kullanıcı Rolünü Güncelleme Fonksiyonu
   const handleRoleChange = async (userId: string, newRole: UserRole) => {
       if(window.confirm(`Kullanıcının rolünü ${newRole} olarak değiştirmek istediğinize emin misiniz?`)){
          try {
             await api.put(`/users/${userId}`, { role: newRole });
             toast.success('Kullanıcı rolü başarıyla güncellendi!');
             mutate(); // Mevcut veriyi yenile
          } catch (err: any) {
             console.error("Role change error:", err);
             toast.error(err.response?.data?.message || 'Rol güncellenirken hata oluştu.');
          }
       }
   };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-gray-100 mb-6">Kullanıcı Yönetimi</h1>

       {/* Filtreleme Formu */}
       {/*<UserFilters currentFilters={filters} onFilterChange={handleFilterChange} />*/}

      {/* Hata Durumu */}
      {error && !isLoadingInitial && (
         <div className="bg-red-900/30 text-red-300 p-4 rounded mb-4">
             Kullanıcılar yüklenirken bir hata oluştu: {error.message}
         </div>
       )}

      {/* Kullanıcı Tablosu */}
       <UserTable
          users={users}
          onStatusChange={handleStatusChange}
          onRoleChange={handleRoleChange}
       />

        {/* İlk yükleme göstergesi (Tablo yerine gösterilebilir) */}
        {isLoadingInitial && (
            <div className="text-center py-10 text-gray-400">Kullanıcılar yükleniyor...</div>
        )}

        {/* Boş veri durumu (İlk yükleme bittikten sonra) */}
        {!isLoadingInitial && isEmpty && (
            <div className="text-center py-10 text-gray-500">Filtrelerle eşleşen kullanıcı bulunamadı.</div>
        )}


        {/* Daha Fazla Yükle Butonu */}
        {!isLoadingInitial && !isEmpty && !isReachingEnd && (
          <div className="mt-6 text-center">
             <button
               onClick={() => setSize(size + 1)}
               disabled={isLoadingMore}
               className="bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-6 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
             >
               {isLoadingMore ? 'Yükleniyor...' : 'Daha Fazla Kullanıcı Yükle'}
             </button>
          </div>
        )}

    </AdminLayout>
  );
};

export default AdminUsersPage;