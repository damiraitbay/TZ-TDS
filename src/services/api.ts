import { User, UserFormData } from '../types/user';

const API_BASE_URL = 'https://69668b8df6de16bde44db645.mockapi.io/users';

// Интерфейс для ответа от MockAPI (может содержать createdAt)
interface MockAPIUser {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  registrationDate?: string;
  createdAt?: string;
}

// Преобразование данных из MockAPI в наш формат User
const transformUser = (data: MockAPIUser): User => {
  return {
    id: typeof data.id === 'string' ? parseInt(data.id, 10) : data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    skills: Array.isArray(data.skills) ? data.skills : [],
    registrationDate: data.registrationDate || data.createdAt || new Date().toISOString(),
  };
};

export const userApi = {
  // Получить всех пользователей
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MockAPIUser[] = await response.json();
      return data.map(transformUser);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Ошибка API: ${error.message}`);
      }
      throw new Error('Произошла неизвестная ошибка при обращении к API');
    }
  },

  // Получить пользователя по ID
  getUserById: async (id: number): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MockAPIUser = await response.json();
      return transformUser(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Ошибка API: ${error.message}`);
      }
      throw new Error('Произошла неизвестная ошибка при обращении к API');
    }
  },

  // Создать нового пользователя
  createUser: async (userData: UserFormData): Promise<User> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...userData,
          registrationDate: new Date().toISOString(),
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MockAPIUser = await response.json();
      return transformUser(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Ошибка API: ${error.message}`);
      }
      throw new Error('Произошла неизвестная ошибка при обращении к API');
    }
  },

  // Обновить пользователя
  updateUser: async (id: number, userData: UserFormData): Promise<User> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (response.status === 404) {
        throw new Error('Пользователь не найден');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MockAPIUser = await response.json();
      return transformUser(data);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Ошибка API: ${error.message}`);
      }
      throw new Error('Произошла неизвестная ошибка при обращении к API');
    }
  },

  // Удалить пользователя
  deleteUser: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (response.status === 404) {
        throw new Error('Пользователь не найден');
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Ошибка API: ${error.message}`);
      }
      throw new Error('Произошла неизвестная ошибка при обращении к API');
    }
  },
};

