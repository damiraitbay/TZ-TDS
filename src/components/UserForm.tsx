import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { FieldArrayPath, Control } from 'react-hook-form';
import { UserFormData } from '../types/user';

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialData?: UserFormData;
  isLoading?: boolean;
}

const UserForm = ({ onSubmit, initialData, isLoading }: UserFormProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    defaultValues: initialData || {
      firstName: '',
      lastName: '',
      email: '',
      skills: [''],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control as Control<UserFormData>,
    name: 'skills' as FieldArrayPath<UserFormData>,
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            Имя <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            {...register('firstName', {
              required: 'Имя обязательно для заполнения',
              minLength: {
                value: 2,
                message: 'Имя должно содержать минимум 2 символа',
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Фамилия <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            {...register('lastName', {
              required: 'Фамилия обязательна для заполнения',
              minLength: {
                value: 2,
                message: 'Фамилия должна содержать минимум 2 символа',
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email обязателен для заполнения',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Некорректный формат email',
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Навыки
          </label>
          <div className="space-y-2">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  {...register(`skills.${index}` as const)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                  placeholder="Введите навык"
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Удалить
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => append('')}
              className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              + Добавить навык
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default UserForm;

