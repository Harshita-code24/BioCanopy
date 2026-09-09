import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Role, User } from '../types';

type AuthContextValue = {
  user: User | null;
  login: (payload: User) => void;
  logout: () => void;
  signup: (payload: User) => void;
};

const AUTH_KEY = 'biocanopy-user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    if (saved) {
      setUser(JSON.parse(saved) as User);
    }
  }, []);

  const persist = (payload: User) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
    setUser(payload);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: persist,
      signup: persist,
      logout: () => {
        localStorage.removeItem(AUTH_KEY);
        setUser(null);
      },
    }),
    [user],
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
    name: role === 'admin' ? 'Aarav Planner' : 'Neha Resident',
    email: role === 'admin' ? 'admin@biocanopy.demo' : 'citizen@biocanopy.demo',
    role,
  };
}
