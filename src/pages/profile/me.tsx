// src/pages/profile/me.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Image from 'next/image'; // Next.js imaj optimizasyonu
const SimpleMdeReact = dynamic(
    () => import('react-simplemde-editor'),
    { ssr: false }
  );// İmza için editör
import ReactMarkdown from 'react-markdown'; // Mevcut imzayı göstermek için
import AuthGuard from '@/components/auth/AuthGuard';
import { fetcher } from '@/lib/fetcher';
import { UserProfile } from '@/types/user'; // Tanımladığımız profil tipi
import api from '@/lib/api';
import { toast } from 'react-toastify';
import { FaCamera, FaEdit, FaSave, FaTimes, FaSpinner } from 'react-icons/fa';
import { UserRole, UserStatus } from '@/types/enums';
import dynamic from 'next/dynamic';

const MyProfilePage: React.FC = () => {
  const router = useRouter();

  // SWR ile tam profil verisini çek
  const { data: userProfile, error, mutate, isLoading: isLoadingProfile } = useSWR<UserProfile>('/auth/profile', fetcher);

  // State'ler
  const [isEditingSignature, setIsEditingSignature] = useState(false);
  const [signatureInput, setSignatureInput] = useState('');
  const [isSavingSignature, setIsSavingSignature] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null); // Gizli file input'a erişim için

  // Editör seçenekleri (imza için daha basit olabilir)
  const signatureEditorOptions = useMemo(() => ({
    spellChecker: false,
    maxHeight: "150px",
    minHeight: "80px",
    autofocus: true,
    placeholder: "İmzanızı buraya yazın (Markdown desteklenir)...",
    status: false, // Status bar'ı gizle
    //toolbar: ["bold", "italic", "|", "link", "|", "preview", "guide"], // Daha basit toolbar
  }), []);

  // İmza düzenleme moduna girildiğinde input'u doldur
  useEffect(() => {
    if (isEditingSignature && userProfile) {
      setSignatureInput(userProfile.signature || '');
    }
  }, [isEditingSignature, userProfile]);

  // Dosya seçildiğinde önizleme oluştur
  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      // Component unmount olduğunda object URL'i temizle
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  // Avatar Yükleme Fonksiyonu
  const handleAvatarUpload = async () => {
    if (!selectedFile) return;
    setIsUploadingAvatar(true);

    const formData = new FormData();
    formData.append('file', selectedFile); // Backend 'file' key'ini bekliyor varsayımı

    try {
      // Varsayım: POST /users/me/avatar
      const response = await api.post<{ avatarUrl: string }>('/auth/setProfileImage ', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios bunu FormData için otomatik ayarlayabilir ama belirtmek iyi olabilir
        },
      });

      const newAvatarUrl = response.data.avatarUrl;

      // SWR datasını optimistic olarak GÜNCELLEME (mutate)
      // Direkt yeni data objesi ile mutate etmek daha doğru
      if (userProfile) {
           mutate({ ...userProfile, avatarUrl: newAvatarUrl }, false); // Revalidate etme, backend zaten güncelledi
      }

      toast.success("Profil resmi başarıyla güncellendi!");
      setSelectedFile(null); // Seçili dosyayı temizle

    } catch (err: any) {
      console.error("Avatar upload error:", err);
      toast.error(err.response?.data?.message || 'Profil resmi yüklenirken bir hata oluştu.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // İmza Kaydetme Fonksiyonu
  const handleSignatureSave = async () => {
     setIsSavingSignature(true);
     try {
         // Varsayım: PATCH /users/me
         await api.patch('/users/me', { signature: signatureInput });

         // SWR datasını güncelle
         if (userProfile) {
              mutate({ ...userProfile, signature: signatureInput }, false);
         }

         toast.success("İmza başarıyla kaydedildi!");
         setIsEditingSignature(false); // Düzenleme modundan çık

     } catch (err: any) {
        console.error("Signature save error:", err);
        toast.error(err.response?.data?.message || 'İmza kaydedilirken bir hata oluştu.');
     } finally {
        setIsSavingSignature(false);
     }
  };

   // Dosya seçme input'unu tetikle
   const triggerFileInput = () => {
       fileInputRef.current?.click();
   };

  // Yükleniyor veya Hata Durumu
  if (isLoadingProfile) {
     return <AuthGuard><div className="text-center py-10">Profil yükleniyor...</div></AuthGuard>;
  }
  if (error || !userProfile) {
     return <AuthGuard><div className="text-center py-10 text-red-400">Profil yüklenirken hata oluştu.</div></AuthGuard>;
  }

  // Başarılı Yükleme Sonrası Render
  return (
    <AuthGuard>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sol Sütun: Avatar ve Temel Bilgiler */}
        <div className="md:col-span-1 space-y-6">
           {/* Avatar Alanı */}
           <div className="p-4 bg-gray-800 rounded-lg shadow text-center relative group">
              <div className="relative inline-block mb-4">
                  <Image
                    // Önizleme varsa onu, yoksa mevcut avatarı, o da yoksa placeholder göster
                    src={previewUrl || userProfile.avatarUrl!=null ? `/${userProfile.avatarUrl}` : "/default.png"} // public/default-avatar.png ekle
                    alt={`${userProfile.username} profili`}
                    width={160}
                    height={160}
                    className="rounded-full object-cover border-4 border-gray-700 shadow-md mx-auto"
                    priority // Profil resmi önemli, öncelikli yüklensin
                    onError={(e) => { e.currentTarget.src = "https://www.nicepng.com/png/full/128-1280406_view-user-icon-png-user-circle-icon-png.png"; }} // Yükleme hatasında default göster
                  />
                   {/* Resim Değiştir Butonu (Hover ile veya sürekli görünür) */}
                   <button
                      onClick={triggerFileInput}
                      disabled={isUploadingAvatar}
                      className="absolute bottom-1 right-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-2 shadow transition-opacity opacity-100 md:opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Profil Resmini Değiştir"
                   >
                      {isUploadingAvatar ? <FaSpinner className="animate-spin"/> : <FaCamera />}
                   </button>
               </div>

               {/* Gizli Dosya Input'u */}
               <input
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  ref={fileInputRef}
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                />

               {/* Seçilen Dosyayı Yükleme Butonu */}
               {selectedFile && (
                  <div className='mt-2 space-x-2'>
                     <button
                       onClick={handleAvatarUpload}
                       disabled={isUploadingAvatar}
                       className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1 px-3 rounded disabled:opacity-50"
                     >
                       {isUploadingAvatar ? 'Yükleniyor...' : 'Yükle'}
                     </button>
                      <button
                        onClick={() => setSelectedFile(null)} // Seçimi iptal et
                        disabled={isUploadingAvatar}
                        className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-semibold py-1 px-3 rounded disabled:opacity-50"
                      >
                        İptal
                      </button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Max 2MB (PNG, JPG, GIF)</p>

              <h2 className="text-2xl font-semibold mt-4 text-gray-100">{userProfile.username}</h2>
              <p className="text-sm text-gray-400">{userProfile.email}</p>
               <p className="text-sm mt-1">{getRoleBadge(userProfile.role)} {getStatusBadge(userProfile.status)}</p>
           </div>

            {/* Diğer Bilgiler */}
            <div className="p-4 bg-gray-800 rounded-lg shadow text-sm">
                <p className="text-gray-400 mb-1"><span className="font-semibold text-gray-300">Katılım Tarihi:</span> {new Date(userProfile.createdAt).toLocaleDateString('tr-TR')}</p>
                {userProfile.lastLoginAt && <p className="text-gray-400"><span className="font-semibold text-gray-300">Son Görülme:</span> {new Date(userProfile.lastLoginAt).toLocaleString('tr-TR')}</p>}
                {/* Konum vb. eklenebilir */}
            </div>
        </div>

        {/* Sağ Sütun: İmza ve Diğer Ayarlar */}
        <div className="md:col-span-2 space-y-6">
          {/* İmza Alanı */}
          <div className="p-4 bg-gray-800 rounded-lg shadow">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-100">İmza</h3>
              {!isEditingSignature && (
                <button
                  onClick={() => setIsEditingSignature(true)}
                  className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center"
                >
                  <FaEdit className="mr-1"/> Düzenle
                </button>
              )}
            </div>

            {isEditingSignature ? (
              // Düzenleme Modu
              <div>
                <SimpleMdeReact
                  options={signatureEditorOptions}
                  value={signatureInput}
                  onChange={setSignatureInput} // useCallback gereksiz olabilir burada
                  className={`${isSavingSignature ? 'opacity-50 pointer-events-none' : ''}`}
                />
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => setIsEditingSignature(false)}
                    disabled={isSavingSignature}
                    className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-semibold py-1 px-3 rounded text-sm transition-colors"
                  >
                    <FaTimes className="inline mr-1"/> İptal
                  </button>
                   <button
                    onClick={handleSignatureSave}
                    disabled={isSavingSignature}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm transition-colors disabled:opacity-50"
                  >
                     {isSavingSignature ? <FaSpinner className="animate-spin inline mr-1"/> : <FaSave className="inline mr-1"/>} Kaydet
                   </button>
                </div>
              </div>
            ) : (
              // Gösterme Modu
              userProfile.signature ? (
                <div className="prose prose-sm prose-invert max-w-none text-gray-200 p-2 border border-dashed border-gray-700 rounded min-h-[50px]">
                  <ReactMarkdown>{userProfile.signature}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Henüz bir imza ayarlanmamış.</p>
              )
            )}
          </div>

          {/* Diğer Ayarlar Buraya Eklenebilir (örn: şifre değiştirme formu linki) */}
          {/* <div className="p-4 bg-gray-800 rounded-lg shadow">
             <h3 className="text-lg font-semibold text-gray-100 mb-3">Hesap Ayarları</h3>
             <Link href="/settings/account" className="text-indigo-400 hover:text-indigo-300 text-sm">Şifre Değiştir</Link>
          </div> */}

        </div>
      </div>
    </AuthGuard>
  );
};

// Badge fonksiyonları (UserTable'dan kopyalandı veya ortak bir yere taşınabilir)

// Duruma göre renk/badge döndüren yardımcı fonksiyon
const getStatusBadge = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">
          Aktif
        </span>
      );
    case UserStatus.PENDING:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-800 text-yellow-100">
          Beklemede
        </span>
      );
    case UserStatus.SUSPENDED:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-800 text-orange-100">
          Askıda
        </span>
      );
    case UserStatus.BANNED:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-800 text-red-100">
          Yasaklı
        </span>
      );
    default:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
          Bilinmiyor
        </span>
      );
  }
};
// Role göre renk/badge döndüren yardımcı fonksiyon
const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-800 text-purple-100">
          Admin
        </span>
      );
    case UserRole.MODERATOR:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
          Moderatör
        </span>
      );
    case UserRole.USER:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-100">
          Kullanıcı
        </span>
      );
    default:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
          {role}
        </span>
      );
  }
};


export default MyProfilePage;