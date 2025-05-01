// src/components/auth/AdminGuard.tsx
import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

interface AdminGuardProps {
  children: ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Yükleme bitmediyse bekle
    if (loading) return;

    // Giriş yapmamışsa veya Admin değilse anasayfaya yönlendir (veya /login'e)
    if (!isAuthenticated || user?.role.toUpperCase() !== 'ADMIN') {
      console.warn('AdminGuard: Unauthorized access attempt.');
      router.push('/'); // Veya router.push('/login');
    }
  }, [isAuthenticated, user, loading, router]);

  // Yükleniyorsa veya yetkisizse (henüz yönlendirme olmadıysa) yükleniyor göster
  // Yetkili kullanıcı için içeriği render etmeden önce yüklenmenin bitmesini bekle
  if (loading || !isAuthenticated || user?.role.toUpperCase() !== 'ADMIN') {
    return <div className="flex justify-center items-center h-screen"><p>Yetki kontrol ediliyor...</p></div>;
  }

  // Yetkili Admin ise içeriği göster
  return <>{children}</>;
};

export default AdminGuard;