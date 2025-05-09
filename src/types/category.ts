import { UserRole } from "./enums";

// src/types/category.ts
export interface Category {
    id: string; // UUID kullandığını varsayıyorum
    name: string;
    slug: string;
    description?: string; // Opsiyonel olabilir
    iconUrl?: string;    // Opsiyonel olabilir
    threadCount?: number; // Backend'den geliyorsa ekleyelim
    postCount?: number;   // Backend'den geliyorsa ekleyelim
    children?: Category[];
    minViewRole: UserRole,
    minThreadRole: UserRole,
    minPostRole:UserRole // Hiyerarşi için (tree yapısı)
    // Backend'deki diğer gerekli alanları buraya ekleyebilirsin
  }