// src/lib/api.ts
import axios from 'axios';

// Backend API adresini .env dosyasından alacağız
// Dikkat: Next.js'te tarayıcıda erişilebilir environment değişkenleri NEXT_PUBLIC_ ile başlamalıdır.
const API_URL = 'https://cinnasium.com/api'; // NestJS portu genelde 3000'den farklıdır, backend'ine göre ayarla!
const API_URL2 = 'http://localhost:3000'; // NestJS portu genelde 3000'den farklıdır, backend'ine göre ayarla!


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İsteğe bağlı: JWT'yi otomatik eklemek için interceptor (daha sonra lazım olacak)
api.interceptors.request.use((config) => {
  // localStorage'dan token'ı al (veya cookie'den - şimdilik localStorage)
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
