// src/pages/_app.tsx
import '@/styles/globals.css';
import "easymde/dist/easymde.min.css";
import "@/styles/markdown_editor.css" // Global stilleri import et (Tailwind için önemli)
import type { AppProps } from 'next/app';
import Layout from '@/components/layout/Layout'; // Layout bileşenini import et (varsayılan alias @/ ile)
import { AuthProvider } from '@/context/AuthContext';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
    <Layout> {/* Her sayfayı Layout ile sarmala */}
      <Component {...pageProps} />
      <ToastContainer
          position="bottom-right" // Bildirimlerin konumu
          autoClose={4000} // Otomatik kapanma süresi (ms)
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark" // Temaya uygun tema
        />
    </Layout>
    </AuthProvider>  // AuthProvider ile sarmala (kullanıcı bilgileri için)
  );
}