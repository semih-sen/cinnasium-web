// src/types/post.ts
import { User } from './user'; // Daha önce tanımladığımız User tipi

export interface Post {
  id: string;
  content: string; // İçerik (Markdown veya HTML olabilir, frontend'de handle edeceğiz)
  isEdited: boolean;
  isThreadStarter: boolean; // Konuyu başlatan mesaj mı?
  createdAt: string;    // ISO Date string
  updatedAt: string;    // ISO Date string
  upvotes: number;
  downvotes: number;
  score: number;
  commentCount: number; // Alt yorum sayısı (varsa)
  // Backend ilişkileri nasıl kurduysa:
  author?: Pick<User, 'id' | 'username' | 'avatarUrl' >; // Yazar bilgisi
  // threadId?: string; // Genelde bu sayfada zaten bilinir
  // Diğer alanlar...
}

