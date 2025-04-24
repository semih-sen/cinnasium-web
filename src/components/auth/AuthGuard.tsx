// src/components/auth/AuthGuard.tsx
import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Context yüklenmediyse veya kullanıcı giriş yapmamışsa login'e yönlendir.
    // loading kontrolü, ilk yüklemede gereksiz yönlendirmeyi engeller.
    if (!loading && !isAuthenticated) {
      // Yönlendirmeden önce mevcut yolu kaydetmek isteyebilirsin (login sonrası geri dönmek için)
      // router.push(`/login?redirect=${router.asPath}`);
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Eğer yükleniyorsa veya kullanıcı giriş yapmamışsa (henüz yönlendirme gerçekleşmediyse) boşluk veya yükleniyor göstergesi göster
  if (loading || !isAuthenticated) {
    // Daha şık bir loading spinner component'i kullanabilirsin
    return <div className="flex justify-center items-center h-screen"><p>Yükleniyor...</p></div>;
  }

  // Kullanıcı giriş yapmışsa ve yüklenme bittiyse, korunan içeriği göster
  return <>{children}</>;
};

export default AuthGuard;