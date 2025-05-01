// src/components/admin/UserTable.tsx
import React, { useState } from "react";
// import { User } from '@/types/user'; // Detaylı User tipi
import { UserStatus, UserRole } from "@/types/enums";
import { FaEdit } from "react-icons/fa"; // İkonlar

// User tipini genişletelim veya yeni bir AdminUser tipi oluşturalım
interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLoginAt?: string; // Opsiyonel
}

interface UserTableProps {
  users: AdminUser[];
  onStatusChange: (userId: string, newStatus: UserStatus) =>  Promise<void>;
  onRoleChange: (userId: string, newRole: UserRole) =>  Promise<void>;
}

// Duruma göre renk/badge döndüren yardımcı fonksiyon
const getStatusBadge = (status: UserStatus) => {
  switch (status) {
    case UserStatus.ACTIVE:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">
          Aktif
        </span>
      );
    case UserStatus.PENDING:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-800 text-yellow-100">
          Beklemede
        </span>
      );
    case UserStatus.SUSPENDED:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-800 text-orange-100">
          Askıda
        </span>
      );
    case UserStatus.BANNED:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-800 text-red-100">
          Yasaklı
        </span>
      );
    default:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
          Bilinmiyor
        </span>
      );
  }
};
// Role göre renk/badge döndüren yardımcı fonksiyon
const getRoleBadge = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-800 text-purple-100">
          Admin
        </span>
      );
    case UserRole.MODERATOR:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-800 text-blue-100">
          Moderatör
        </span>
      );
    case UserRole.USER:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-100">
          Kullanıcı
        </span>
      );
    default:
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-300">
          {role}
        </span>
      );
  }
};

const UserTable: React.FC<UserTableProps> = ({
  users,
  onStatusChange,
  onRoleChange,
}) => {
  // Aksiyonlar için küçük bir dropdown menü bileşeni (veya basit butonlar)
  const ActionMenu: React.FC<{ user: AdminUser }> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded hover:bg-gray-600"
        >
          <FaEdit />
        </button>
        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 z-10" style={{ right: '100%' }}>
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <p className="px-4 pt-2 pb-1 text-xs text-gray-400">
                Durum Değiştir:
              </p>
              {Object.values(UserStatus).map(
                (status) =>
                  user.status !== status && ( // Mevcut durumu gösterme
                    <button
                      key={status}
                      onClick={() => {
                        onStatusChange(user.id, status as UserStatus);
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500 hover:text-white"
                      role="menuitem"
                    >
                      {status} Yap
                    </button>
                  )
              )}
              <div className="border-t border-gray-600 my-1"></div>
              <p className="px-4 pt-1 pb-1 text-xs text-gray-400">
                Rol Değiştir:
              </p>
              {Object.values(UserRole).map(
                (role) =>
                  user.role !== role && ( // Mevcut rolü gösterme
                    <button
                      key={role}
                      onClick={() => {
                        onRoleChange(user.id, role as UserRole);
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500 hover:text-white"
                      role="menuitem"
                    >
                      {role} Yap
                    </button>
                  )
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Kullanıcı
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Rol
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Durum
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
            >
              Kayıt Tarihi
            </th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Son Giriş</th> 
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Eylemler</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-gray-700/50 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-100">
                  {user.username}
                </div>
                <div className="text-xs text-gray-400">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getRoleBadge(user.role)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(user.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {new Date(user.createdAt).toLocaleDateString("tr-TR")}
              </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                 {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('tr-TR') : '-'}
               </td> 
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {/* Aksiyon Menüsü */}
                <ActionMenu user={user} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <p className="text-center py-6 text-gray-500">
          Filtrelerle eşleşen kullanıcı bulunamadı.
        </p>
      )}
    </div>
  );
};

export default UserTable;
