// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api'; // Oluşturduğumuz API istemcisi
import { jwtDecode } from "jwt-decode"; // Dikkat: import şekli değişmiş olabilir, kütüphaneye göre kontrol et
import { toast } from 'react-toastify';

// Kullanıcı bilgilerinin tipi (JWT payload'ına göre genişletilebilir)
interface User {
  userId: string;
  username: string;
  role: string; // Veya enum tipi UserRole
}

// Context'in state ve fonksiyonlarının tipi
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>; // Credentials tipi DTO'ya göre ayarlanabilir
  register: (userData: any) => Promise<void>; // UserData tipi DTO'ya göre ayarlanabilir
  logout: () => void;
}

// Context'i oluştur (başlangıç değeri null veya undefined olabilir)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context Provider Bileşeni
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Başlangıçta yükleniyor (token kontrolü için)
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Uygulama yüklendiğinde token'ı kontrol et
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken');
    if (storedToken) {
      try {
        // Token'ın süresinin geçip geçmediğini kontrol etmek iyi bir pratik olurdu
        const decoded = jwtDecode<User & { exp: number }>(storedToken); // Payload'ı User tipine cast et
        // Örnek süre kontrolü:
         if (decoded.exp * 1000 < Date.now()) {
           console.log("Token expired, logging out.");
           localStorage.removeItem('accessToken');
           setToken(null);
           setUser(null);
           setIsAuthenticated(false);
         } else {
           console.log("Token found and valid, setting user.");
           setToken(storedToken);
           // userId backend'de 'sub' olarak gelebilir, payload'a göre ayarla
           setUser({ userId: (decoded as any).sub, username: decoded.username, role: decoded.role });
           setIsAuthenticated(true);
           api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`; // Axios default header'ını da ayarla
         }
      } catch (err) {
        console.error("Error decoding token:", err);
        
        localStorage.removeItem('accessToken'); // Geçersiz token'ı temizle
      }
    } else {
        console.log("No token found in localStorage.");
    }
    setLoading(false); // Kontrol bitti, yüklenmeyi durdur
  }, []);

  // Login Fonksiyonu
  const login = async (credentials: any) => {
    setLoading(true);
    setError(null);
    try {
      // Backend'deki login endpoint'ine istek at (Varsayım: /auth/login)
      const response = await api.post('/auth/login', credentials);
      const accessToken  = response.data.access_token; // Backend'den gelen token adı

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken); // Token'ı sakla
        const decoded = jwtDecode<User & { exp: number }>(accessToken);
        setToken(accessToken);
        setUser({ userId: (decoded as any).sub || decoded.userId, username: decoded.username, role: decoded.role });
        setIsAuthenticated(true);
        toast.success("Destur verilmiştir.")
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`; // Axios default header
        router.push('/'); // Anasayfaya yönlendir
      } else {
         throw new Error("Login failed: No access token received.");
      }

    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Giriş başarısız oldu. Lütfen bilgilerinizi kontrol edin.';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  // Register Fonksiyonu
  const register = async (userData: any) => {
    setLoading(true);
    setError(null);
    try {
       // Backend'deki register endpoint'ine istek at (Varsayım: /users)
      await api.post('/auth/register', userData); // Backend endpoint'ine göre '/auth/register' vs. olabilir
      // Başarılı kayıt sonrası ne yapılacağına karar ver
      console.log('Registration successful!');
      toast.success("Kervanımıza hoş sâdâ verdiniz.")
      // Örneğin kullanıcıyı login sayfasına yönlendirip mesaj gösterebilirsin
      router.push('/login?registered=true'); // Veya özel bir "kayıt başarılı" sayfasına
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.message || err.message || 'Kayıt sırasında bir hata oluştu.';
      // Birden fazla hata mesajı dönebilir (örn. validation), ona göre handle et
       if (Array.isArray(err.response?.data?.message)) {
         setError(err.response.data.message.join(', '));
       } else {
         setError(errorMessage);
       }
    } finally {
      setLoading(false);
    }
  };

  // Logout Fonksiyonu
  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Terk eyleyişiniz makbuldür.")
    delete api.defaults.headers.common['Authorization']; // Axios header'ını temizle
    router.push('/login'); // Login sayfasına yönlendir
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Context'i kullanmak için özel hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};