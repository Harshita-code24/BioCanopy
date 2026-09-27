import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Role, User } from '../types';

export type AuthResult = {
  success: boolean;
  message?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: { email: string; password?: string } | User) => Promise<AuthResult>;
  signup: (payload: { name?: string; email: string; password?: string } | User) => Promise<AuthResult>;
  logout: () => void;
};

const AUTH_USER_KEY = 'biocanopy-user';
const AUTH_TOKEN_KEY = 'biocanopy-token';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify session on load
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      const savedUser = localStorage.getItem(AUTH_USER_KEY);

      if (savedToken) {
        setToken(savedToken);
        try {
          // Verify with backend
          const res = await fetch(`${API_URL}/me`, {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
          } else {
            // Token expired or invalid
            localStorage.removeItem(AUTH_TOKEN_KEY);
            localStorage.removeItem(AUTH_USER_KEY);
            setUser(null);
            setToken(null);
          }
        } catch {
          // If server is unreachable, use saved user cache
          if (savedUser) {
            setUser(JSON.parse(savedUser) as User);
          }
        }
      } else if (savedUser) {
        setUser(JSON.parse(savedUser) as User);
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (
    payload: { email: string; password?: string } | User
  ): Promise<AuthResult> => {
    // If password provided, call the backend
    if ('password' in payload && payload.password) {
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, message: data.message || 'Login failed.' };
        }

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);

        return { success: true, message: data.message };
      } catch (err) {
        console.warn('Backend server unreachable, falling back to local demo auth:', err);
        // Fallback for offline demo
        const fallbackName =
          'name' in payload && typeof payload.name === 'string'
            ? payload.name
            : 'Neha Resident';
        const fallbackUser: User = {
          name: fallbackName,
          email: payload.email,
          role: 'citizen',
        };
        setUser(fallbackUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));
        return { success: true, message: 'Logged in (offline demo mode).' };
      }
    }

    // Direct object login fallback
    const directUser = payload as User;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(directUser));
    setUser(directUser);
    return { success: true };
  };

  const signup = async (
    payload: { name?: string; email: string; password?: string } | User
  ): Promise<AuthResult> => {
    if ('password' in payload && payload.password) {
      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: payload.name || 'New Resident',
            email: payload.email,
            password: payload.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, message: data.message || 'Signup failed.' };
        }

        setUser(data.user);
        setToken(data.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);

        return { success: true, message: data.message };
      } catch (err) {
        console.warn('Backend server unreachable, falling back to local demo auth:', err);
        const fallbackName =
          'name' in payload && typeof payload.name === 'string'
            ? payload.name
            : 'New Resident';
        const fallbackUser: User = {
          name: fallbackName,
          email: payload.email,
          role: 'citizen',
        };
        setUser(fallbackUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));
        return { success: true, message: 'Account created (offline demo mode).' };
      }
    }

    const directUser = payload as User;
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(directUser));
    setUser(directUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      signup,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export function defaultUser(role: Role): User {
  return {
    name: 'Neha Resident',
    email: 'neha.resident@biocanopy.demo',
    role,
  };
}
