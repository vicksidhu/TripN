import { Platform } from 'react-native';

const LOCAL_API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000'
    : 'http://localhost:5000';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  LOCAL_API_URL;

type ApiError = {
  message?: string;
};

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    headers: {
      'Content-Type': 'application/json',

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const errorData = data as ApiError;

    throw new Error(
      errorData.message || 'Something went wrong.'
    );
  }

  return data as T;
}

export async function get<T>(
  endpoint: string,
  token?: string
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'GET',
    },
    token
  );
}

export async function post<T>(
  endpoint: string,
  body: unknown,
  token?: string
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    token
  );
}

export async function put<T>(
  endpoint: string,
  body: unknown,
  token?: string
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'PUT',
      body: JSON.stringify(body),
    },
    token
  );
}

export async function remove<T>(
  endpoint: string,
  token?: string
): Promise<T> {
  return request<T>(
    endpoint,
    {
      method: 'DELETE',
    },
    token
  );
}