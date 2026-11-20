import { post } from './api';

export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export async function register(
  data: RegisterData
): Promise<AuthResponse> {
  return post<AuthResponse>('/api/auth/register', data);
}

export async function login(
  data: LoginData
): Promise<AuthResponse> {
  return post<AuthResponse>('/api/auth/login', data);
}