// src/lib/fetcher.ts
import api from './api'; // Axios instance'ımız

// Verilen URL'e GET isteği atıp response datasını döndüren basit fetcher
export const fetcher = (url: string) => api.get(url).then(res => res.data);