// src/pages/profile/me.tsx
import React from 'react';
import AuthGuard from '@/components/auth/AuthGuard'; // AuthGuard'ı import et
import { useAuth } from '@/context/AuthContext';

const MyProfilePage: React.FC = () => {
  const { user } = useAuth(); // Kullanıcı bilgilerini almak için

  return (
    <AuthGuard> {/* Sayfa içeriğini AuthGuard ile sarmala */}
      <div>
        <h1 className="text-3xl font-bold mb-4">Profilim</h1>
        {user ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <p><span className="font-semibold">Kullanıcı Adı:</span> {user.username}</p>
            <p><span className="font-semibold">Rol:</span> {user.role}</p>
            <p><span className="font-semibold">Kullanıcı ID:</span> {user.userId}</p>
            {/* Diğer profil bilgileri buraya eklenebilir */}
          </div>
        ) : (
          <p>Kullanıcı bilgileri yükleniyor...</p>
        )}
      </div>
    </AuthGuard>
  );
};

export default MyProfilePage;