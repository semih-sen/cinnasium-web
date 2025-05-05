// src/types/thread.ts
import { User } from './user';
import { Category } from './category'; // Sadece ID/isim/slug yeterli olabilir

export interface Thread {
  id: string;
  title: string;
  slug: string;
  isLocked: boolean;
  isPinned: boolean;
  viewCount: number;
  replyCount: number;
  createdAt: string; // ISO Date string
  lastPostAt: string; // ISO Date string
  // Backend ilişkileri nasıl kurduysa (nested object veya sadece ID)
  category?: Pick<Category, 'id' | 'name' | 'slug'>; // Kategori bilgisi
  author?: Pick<User, 'id' | 'username'>;        // Yazar bilgisi
  __lastPostBy__?: Pick<User, 'id' | 'username'>;   // Son mesajı yazan
  // Backend'den gelen diğer alanlar
}

