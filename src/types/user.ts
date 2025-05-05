import { UserRole, UserStatus } from './enums'; // Enum'ları import et

// src/types/user.ts
export interface User {
    id: string;
    username: string;
    avatarUrl:string
    // İhtiyaç olursa avatarUrl vb. eklenebilir
  }

  export interface UserProfile {
    id: string;
    username: string;
    email: string; // E-postayı göstermeyebilirsin, backend'den gelmeyebilir de
    role: UserRole;
    status: UserStatus;
    avatarUrl?: string | null;
    signature?: string | null;
    location?: string | null; // Örnek ek alan
    createdAt: string; // ISO Date string
    lastLoginAt?: string | null; // ISO Date string
    // Backend'den gelen diğer alanlar
  }
  export interface PublicUserProfile {
    id: string;
    username: string;
    avatarUrl?: string | null;
    signature?: string | null;
    location?: string | null;
    role: UserRole; // Rolü göstermek isteyip istemediğine bağlı
    createdAt: string; // Katılım tarihi için
    // Opsiyonel İstatistikler (backend sağlarsa)
    // postCount?: number;
    // threadCount?: number;
  }