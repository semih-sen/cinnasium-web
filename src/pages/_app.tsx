// src/pages/_app.tsx
import '@/styles/globals.css'; // Global stilleri import et (Tailwind için önemli)
import type { AppProps } from 'next/app';
import Layout from '@/components/layout/Layout'; // Layout bileşenini import et (varsayılan alias @/ ile)
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
    <Layout> {/* Her sayfayı Layout ile sarmala */}
      <Component {...pageProps} />
    </Layout>
    </AuthProvider>  // AuthProvider ile sarmala (kullanıcı bilgileri için)
  );
}