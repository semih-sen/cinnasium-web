// src/types/user.ts (veya yeni src/types/profile.ts)
import { UserRole, UserStatus } from './enums'; // Enum'ları import et

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


