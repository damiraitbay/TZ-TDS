import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../services/api';
import { UserFormData } from '../types/user';
import UserForm from '../components/UserForm';

const UserFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', id],
    queryFn: () => (id ? userApi.getUserById(Number(id)) : null),
    enabled: isEditMode,
  });

  const createMutation = useMutation({
    mutationFn: (data: UserFormData) => userApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      if (!id) throw new Error('ID не указан');
      return userApi.updateUser(Number(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
      navigate('/');
    },
  });

  const handleSubmit = (data: UserFormData) => {
    // Фильтруем пустые навыки
    const filteredData = {
      ...data,
      skills: data.skills.filter(skill => skill.trim() !== ''),
    };

    if (isEditMode) {
      updateMutation.mutate(filteredData);
    } else {
      createMutation.mutate(filteredData);
    }
  };

  if (isEditMode && isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Загрузка данных пользователя...</div>
      </div>
    );
  }

  if (isEditMode && !user) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">Пользователь не найден</div>
      </div>
    );
  }

  const initialData = user
    ? {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        skills: user.skills.length > 0 ? user.skills : [''],
      }
    : undefined;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {isEditMode ? 'Редактирование пользователя' : 'Добавление нового пользователя'}
      </h1>
      <UserForm
        onSubmit={handleSubmit}
        initialData={initialData}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default UserFormPage;

