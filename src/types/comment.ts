// src/types/comment.ts
import { User } from './user';

export interface PostComment {
    id: string;
    content: string;
    createdAt: string; // ISO Date string
    author?: Pick<User, 'id' | 'username' /* | 'avatarUrl' */>;
    postId?: string; // Genelde biliniyor olacak
}

