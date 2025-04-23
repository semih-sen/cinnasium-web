// src/pages/login.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext'; // useAuth hook'unu import et

const LoginPage: React.FC = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, isAuthenticated } = useAuth(); // Context'ten gerekli şeyleri al
  const router = useRouter();

  // Eğer kullanıcı zaten giriş yapmışsa anasayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Login sonrası mesaj göstermek için (örn. register sonrası)
  useEffect(() => {
    if (router.query.registered === 'true') {
      // Burada daha şık bir bildirim (toast notification) gösterebilirsin
       alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
       // Query parametresini temizle (isteğe bağlı)
       router.replace('/login', undefined, { shallow: true });
    }
  }, [router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username: emailOrUsername, password }); // login fonksiyonunu çağır
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">Giriş Yap</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hata Mesajı Alanı */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div>
          <label
            htmlFor="emailOrUsername"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            E-posta veya Kullanıcı Adı
          </label>
          <input
            type="text"
            id="emailOrUsername"
            name="emailOrUsername"
            required
            value={emailOrUsername} // Controlled component
            onChange={(e) => setEmailOrUsername(e.target.value)} // State'i güncelle
            disabled={loading} // Yüklenirken disable et
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            placeholder="ornek@mail.com"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Şifre
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password} // Controlled component
            onChange={(e) => setPassword(e.target.value)} // State'i güncelle
            disabled={loading} // Yüklenirken disable et
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            placeholder="********"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading} // Yüklenirken disable et
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-400">
        Hesabın yok mu?{' '}
        <Link href="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;