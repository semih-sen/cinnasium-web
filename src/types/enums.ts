export enum UserRole {
    ADMIN = 'admin',
    MODERATOR = 'moderator',
    USER = 'user',
    GUEST = 'guest', // Misafir rolü de olabilir
  }
  
  // Kullanıcı Durumu için Enum (İsteğe bağlı ama önerilir)
  export enum UserStatus {
    ACTIVE = 'active', // Aktif
    PENDING = 'pending_verification', // Doğrulama bekliyor
    SUSPENDED = 'suspended', // Askıya alınmış
    BANNED = 'banned', // Yasaklanmış
  }