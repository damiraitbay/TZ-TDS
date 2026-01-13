import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../services/api';
import { SortField, SortDirection } from '../types/user';
import UserTable from '../components/UserTable';

const ITEMS_PER_PAGE = 10;

const UserListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => userApi.getAllUsers(),
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Загрузка пользователей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">Ошибка при загрузке пользователей</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Список пользователей</h1>
      </div>
      <UserTable
        users={users}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UserListPage;

