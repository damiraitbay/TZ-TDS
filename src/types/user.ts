export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
  registrationDate: string;
}

export interface UserFormData {
  firstName: string;
  lastName: string;
  email: string;
  skills: string[];
}

export type SortField = 'id' | 'firstName' | 'lastName' | 'email' | 'registrationDate';
export type SortDirection = 'asc' | 'desc';

