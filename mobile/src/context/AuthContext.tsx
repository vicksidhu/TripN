import * as SecureStore from 'expo-secure-store';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import { Platform } from 'react-native';

import type { User } from '@/services/authService';

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

const TOKEN_KEY = 'tripn_token';
const USER_KEY = 'tripn_user';

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    try {
      let storedToken: string | null = null;
      let storedUser: string | null = null;

      if (Platform.OS === 'web') {
        storedToken = localStorage.getItem(TOKEN_KEY);
        storedUser = localStorage.getItem(USER_KEY);
      } else {
        storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        storedUser = await SecureStore.getItemAsync(USER_KEY);
      }

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(
    newToken: string,
    newUser: User
  ): Promise<void> {
    const serializedUser = JSON.stringify(newUser);

    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, serializedUser);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      await SecureStore.setItemAsync(USER_KEY, serializedUser);
    }

    setToken(newToken);
    setUser(newUser);
  }

  async function signOut(): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    }

    setToken(null);
    setUser(null);
  }

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: Boolean(token && user),
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside an AuthProvider.'
    );
  }

  return context;
}