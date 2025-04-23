// src/pages/register.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext'; // useAuth hook'unu import et

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clientError, setClientError] = useState<string | null>(null); // Şifre eşleşmeme hatası için
  const { register, loading, error: apiError, isAuthenticated } = useAuth(); // Context'ten al, apiError olarak yeniden adlandır
  const router = useRouter();

  // Eğer kullanıcı zaten giriş yapmışsa anasayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null); // Önceki hataları temizle

    // Client-side şifre kontrolü
    if (password !== confirmPassword) {
      setClientError('Şifreler eşleşmiyor!');
      return;
    }

    // Backend'e gönderilecek veri (DTO'ya uygun olmalı)
    const userData = {
      username,
      email,
      password,
    };
    await register(userData); // register fonksiyonunu çağır
  };

  // Hem client hem de API hatalarını göster
  const displayError = clientError || apiError;

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-purple-400 mb-6">Kayıt Ol</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
         {/* Hata Mesajı Alanı */}
        {displayError && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{displayError}</span>
          </div>
        )}
        <div>
          <label htmlFor="username" /* ... */ >Kullanıcı Adı</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            placeholder="mistik_kullanici"
          />
        </div>
        <div>
          <label htmlFor="email" /* ... */ >E-posta Adresi</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            placeholder="ornek@mail.com"
          />
        </div>
        <div>
          <label htmlFor="password" /* ... */ >Şifre</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            placeholder="********"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" /* ... */ >Şifre (Tekrar)</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
            placeholder="********"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {loading ? 'Kayıt Olunuyor...' : 'Kayıt Ol'}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-400">
        Zaten hesabın var mı?{' '}
        <Link href="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;