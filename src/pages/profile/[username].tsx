// src/pages/users/[username].tsx
import React from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { fetcher } from '@/lib/fetcher';
import { PublicUserProfile } from '@/types/user'; // Tanımladığımız tip
import { UserRole } from '@/types/enums'; // Enum'lar (badge için)

// Rol badge fonksiyonu (AdminLayout'tan veya ortak bir yerden alınabilir)
const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-800 text-purple-100">Admin</span>;
    case UserRole.MODERATOR: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">Moderatör</span>;
    case UserRole.USER: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-100">Kullanıcı</span>;
    default: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">{role}</span>;
  }
};

// Basit zaman formatlama (veya date-fns kullan)
const formatDate = (dateString: string) => {
   try { return new Date(dateString).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }); }
   catch (e) { return dateString; }
};

const UserProfilePage: React.FC = () => {
  const router = useRouter();
  const { username } = router.query as { username?: string }; // Tip belirterek alalım

  // Kullanıcı adını kullanarak SWR ile herkese açık profil verisini çek
  // Varsayım: GET /users/by-username/:username
  const { data: userProfile, error, isLoading } = useSWR<PublicUserProfile>(
    username ? `/users/${username}` : null, // username varsa fetch et
    fetcher
  );

  // === Yükleniyor Durumu ===
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="ml-3 text-gray-400">Profil yükleniyor...</p>
      </div>
    );
  }

  // === Hata Durumu (Özellikle 404 Kullanıcı Bulunamadı) ===
  if (error) {
    // Axios hatası genellikle error.response içinde detayları barındırır
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message || 'Bilinmeyen bir hata oluştu.';

    return (
      <div className="text-center py-10 px-4">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Profil Yüklenemedi</h1>
        {status === 404 ? (
          <p className="text-gray-400">'{username}' adlı kullanıcı bulunamadı.</p>
        ) : (
          <p className="text-gray-400">Profil bilgileri alınırken bir sorun oluştu: {errorMessage}</p>
        )}
         {/* Anasayfaya dön butonu eklenebilir */}
      </div>
    );
  }

  // === Kullanıcı Bulunamadı (Veri gelmedi ama hata da yoksa - nadir durum) ===
   if (!userProfile) {
      return <div className="text-center py-10 text-gray-500">Kullanıcı bilgisi bulunamadı.</div>;
   }


  // === Başarılı Durum: Profil Bilgilerini Göster ===
  return (
    // /profile/me ile benzer bir layout kullanabiliriz ama düzenleme yok
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* Sol Sütun: Avatar ve Temel Bilgiler */}
      <div className="md:col-span-1 space-y-6">
        <div className="p-4 bg-gray-800 rounded-lg shadow text-center">
          <Image
            src={userProfile.avatarUrl || '/default_avatar.png'} // public/default-avatar.png olmalı
            alt={`${userProfile.username} profili`}
            width={160}
            height={160}
            className="rounded-full object-cover border-4 border-gray-700 shadow-md mx-auto mb-4"
            priority
            onError={(e) => { e.currentTarget.src = '/default-avatar.png'; }}
          />
          <h2 className="text-2xl font-semibold text-gray-100">{userProfile.username}</h2>
          <p className="text-sm mt-1">{getRoleBadge(userProfile.role)}</p>
          {userProfile.location && (
            <p className="text-sm text-gray-400 mt-2">Konum: {userProfile.location}</p>
          )}
        </div>

        <div className="p-4 bg-gray-800 rounded-lg shadow text-sm">
          <p className="text-gray-400 mb-1">
            <span className="font-semibold text-gray-300">Katılım Tarihi:</span> {formatDate(userProfile.createdAt)}
          </p>
          {/* İstatistikler (backend sağlarsa) */}
          {/* {typeof userProfile.threadCount === 'number' && <p>...</p>} */}
          {/* {typeof userProfile.postCount === 'number' && <p>...</p>} */}
        </div>
      </div>

      {/* Sağ Sütun: İmza ve Aktivite (Aktivite kısmı sonra eklenebilir) */}
      <div className="md:col-span-2 space-y-6">
        {/* İmza Alanı */}
        {userProfile.signature ? (
          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-100 mb-3 border-b border-gray-700 pb-2">İmza</h3>
            <div className="prose prose-sm prose-invert max-w-none text-gray-200">
              <ReactMarkdown>{userProfile.signature}</ReactMarkdown>
            </div>
          </div>
        ) : (
          // İmza yoksa bu bölümü hiç göstermeyebilir veya placeholder koyabilirsin
           <div className="p-4 bg-gray-800 rounded-lg shadow">
               <p className="text-sm text-gray-500 italic">Kullanıcının ayarlanmış bir imzası bulunmuyor.</p>
           </div>
        )}

        {/* Kullanıcının Son Aktiviteleri (Placeholder) */}
        {/* <div className="p-4 bg-gray-800 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Son Aktiviteler</h3>
          <p className="text-sm text-gray-500 italic">Kullanıcının son gönderdiği mesajlar veya açtığı konular burada listelenecek...</p>
          // Backend'den /users/:username/posts gibi bir endpoint ile veri çekilebilir
        </div> */}
      </div>

    </div>
  );
};

export default UserProfilePage;