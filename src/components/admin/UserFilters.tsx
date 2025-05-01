// src/components/admin/UserFilters.tsx
import React, { useState, useEffect } from 'react';
import { UserStatus, UserRole } from '@/types/enums'; // Enum'ları import et
import { useDebounce } from 'use-debounce'; // Arama için debounce (opsiyonel)

interface UserFiltersProps {
  currentFilters: { status: string; role: string; search: string };
  onFilterChange: (newFilters: { status: string; role: string; search: string }) => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({ currentFilters, onFilterChange }) => {
  const [status, setStatus] = useState(currentFilters.status);
  const [role, setRole] = useState(currentFilters.role);
  const [searchTerm, setSearchTerm] = useState(currentFilters.search);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // 500ms gecikme ile arama

  // Filtreler değiştiğinde parent component'e bildir
  useEffect(() => {
    // Sadece debounce edilmiş arama term'i değiştiğinde veya diğer filtreler değiştiğinde tetikle
     onFilterChange({ status, role, search: debouncedSearchTerm });
  }, [status, role, debouncedSearchTerm, onFilterChange]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-800 rounded-lg shadow">
      {/* Durum Filtresi */}
      <div>
        <label htmlFor="filter-status" className="block text-sm font-medium text-gray-300 mb-1">Durum</label>
        <select
          id="filter-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full input-style" // CategoryForm'daki global stili kullan
        >
          <option value="">Tümü</option>
          {Object.values(UserStatus).map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
      </div>

      {/* Rol Filtresi */}
      <div>
        <label htmlFor="filter-role" className="block text-sm font-medium text-gray-300 mb-1">Rol</label>
        <select
          id="filter-role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full input-style"
        >
          <option value="">Tümü</option>
          {Object.values(UserRole).map(r => (<option key={r} value={r}>{r}</option>))}
        </select>
      </div>

      {/* Arama Filtresi */}
      <div>
        <label htmlFor="filter-search" className="block text-sm font-medium text-gray-300 mb-1">Kullanıcı Adı/Email Ara</label>
        <input
          type="search"
          id="filter-search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ara..."
          className="w-full input-style"
        />
      </div>
    </div>
  );
};

export default UserFilters;