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
  emailSent?: boolean;
  user?: User;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (payload: { email: string; password?: string; name?: string; city?: string } | User) => Promise<AuthResult>;
  signup: (payload: { name?: string; email: string; password?: string; city?: string } | User) => Promise<AuthResult>;
  googleLogin: (payload: { name: string; email: string; city?: string }) => Promise<AuthResult>;
  updateProfile: (updates: { password?: string; city?: string }) => Promise<AuthResult>;
  logout: () => void;
};

const AUTH_USER_KEY = 'biocanopy-user';
const AUTH_TOKEN_KEY = 'biocanopy-token';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const enrichUser = (rawUser: User, pass?: string, cityOverride?: string, nameOverride?: string): User => {
  const pwd =
    pass ||
    rawUser.password ||
    (rawUser.email?.toLowerCase().includes('admin') ? 'admin123' : 'citizen123');
  return {
    ...rawUser,
    name: nameOverride || rawUser.name || 'Neha Resident',
    password: pwd,
    memberSince: rawUser.memberSince || 'September 2026',
    city: cityOverride || rawUser.city || 'Delhi',
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and verify session on load
  useEffect(() => {
    const initializeAuth = async () => {
      // Check for Google OAuth callback redirect parameters in URL
      const urlParams = new URLSearchParams(window.location.search);
      const googleToken = urlParams.get('google_token');
      const googleName = urlParams.get('name');
      const googleEmail = urlParams.get('email');
      if (googleToken && googleEmail) {
        setToken(googleToken);
        localStorage.setItem(AUTH_TOKEN_KEY, googleToken);
        const userObj: User = {
          name: googleName || 'Google User',
          email: googleEmail,
          role: googleEmail.includes('admin') ? 'admin' : 'citizen',
          city: 'Delhi',
        };
        const enriched = enrichUser(userObj, 'google_verified');
        setUser(enriched);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(enriched));
        window.history.replaceState({}, document.title, window.location.pathname);
        setIsLoading(false);
        return;
      }

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
            const enriched = enrichUser(data.user);
            setUser(enriched);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(enriched));
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
            setUser(enrichUser(JSON.parse(savedUser) as User));
          }
        }
      } else if (savedUser) {
        setUser(enrichUser(JSON.parse(savedUser) as User));
      } else {
        // Default guest/citizen user Neha Resident
        const defaultUser: User = {
          name: 'Neha Resident',
          email: 'neha.resident@biocanopy.demo',
          role: 'citizen',
          password: 'citizen123',
          memberSince: 'September 2026',
          city: 'Delhi',
        };
        setUser(defaultUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(defaultUser));
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (
    payload: { email: string; password?: string; name?: string; city?: string } | User
  ): Promise<AuthResult> => {
    // If password provided, call the backend
    if ('password' in payload && payload.password) {
      const payloadName = 'name' in payload && payload.name ? payload.name : undefined;
      const payloadCity = 'city' in payload && payload.city ? payload.city : undefined;
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: payload.email,
            password: payload.password,
            name: payloadName,
            city: payloadCity,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, message: data.message || 'Login failed.' };
        }

        const enriched = enrichUser(data.user, payload.password, payloadCity, payloadName);
        setUser(enriched);
        setToken(data.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(enriched));
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);

        return { success: true, message: data.message, user: enriched };
      } catch (err) {
        console.warn('Backend server unreachable, falling back to local demo auth:', err);
        // Fallback for offline demo
        const fallbackName =
          payloadName ||
          (payload.email.toLowerCase().includes('admin') ? 'Admin User' : 'Neha Resident');
        const fallbackCity = payloadCity || 'Delhi';
        const fallbackUser: User = enrichUser(
          {
            name: fallbackName,
            email: payload.email,
            role: payload.email.toLowerCase().includes('admin') ? 'admin' : 'citizen',
            city: fallbackCity,
          },
          payload.password,
          fallbackCity,
          fallbackName
        );
        setUser(fallbackUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));
        return { success: true, message: 'Logged in (offline demo mode).', user: fallbackUser };
      }
    }

    // Direct object login fallback
    const directUser = enrichUser(payload as User);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(directUser));
    setUser(directUser);
    return { success: true, user: directUser };
  };

  const signup = async (
    payload: { name?: string; email: string; password?: string; city?: string } | User
  ): Promise<AuthResult> => {
    if ('password' in payload && payload.password) {
      const payloadCity = 'city' in payload && payload.city ? payload.city : 'Delhi';
      const payloadName = 'name' in payload && payload.name ? payload.name : 'New Resident';
      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: payloadName,
            email: payload.email,
            password: payload.password,
            city: payloadCity,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          return { success: false, message: data.message || 'Signup failed.' };
        }

        const enriched = enrichUser(data.user, payload.password, payloadCity, payloadName);
        setUser(enriched);
        setToken(data.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(enriched));
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);

        return { success: true, message: data.message, user: enriched };
      } catch (err) {
        console.warn('Backend server unreachable, falling back to local demo auth:', err);
        const fallbackUser: User = enrichUser(
          {
            name: payloadName,
            email: payload.email,
            role: 'citizen',
            city: payloadCity,
          },
          payload.password,
          payloadCity,
          payloadName
        );
        setUser(fallbackUser);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));
        return { success: true, message: 'Account created (offline demo mode).', user: fallbackUser };
      }
    }

    const directUser = enrichUser(payload as User);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(directUser));
    setUser(directUser);
    return { success: true, user: directUser };
  };

  const googleLogin = async (payload: { name: string; email: string; city?: string }): Promise<AuthResult> => {
    const cityName = payload.city || 'Delhi';
    try {
      const res = await fetch(`${API_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          city: cityName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Google sign in failed.' };
      }

      const enriched = enrichUser(data.user, 'google_verified', cityName, payload.name);
      setUser(enriched);
      setToken(data.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(enriched));
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);

      return {
        success: true,
        message: data.message,
        emailSent: data.emailSent,
      };
    } catch (err) {
      console.warn('Backend server unreachable, falling back to local Google sign-in demo:', err);
      const isCitizen = !payload.email.toLowerCase().includes('admin');
      const fallbackUser: User = {
        name: payload.name,
        email: payload.email,
        role: isCitizen ? 'citizen' : 'admin',
        city: cityName,
        password: 'google_oauth_active',
        memberSince: 'October 2026',
      };
      setUser(fallbackUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));

      return {
        success: true,
        message: 'Signed in with Google successfully (demo mode)!',
        emailSent: isCitizen, // strictly citizen only
      };
    }
  };

  const updateProfile = async (updates: { password?: string; city?: string }): Promise<AuthResult> => {
    if (!user) {
      return { success: false, message: 'No active session.' };
    }

    const updatedUser: User = {
      ...user,
      ...(updates.password ? { password: updates.password } : {}),
      ...(updates.city ? { city: updates.city } : {}),
    };

    setUser(updatedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));

    if (token) {
      try {
        const res = await fetch(`${API_URL}/profile`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });
        if (!res.ok) {
          const data = await res.json();
          return { success: false, message: data.message || 'Profile update failed on server.' };
        }
      } catch (err) {
        console.warn('Failed to sync profile update with server:', err);
      }
    }

    return { success: true, message: 'Profile updated successfully!' };
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
      googleLogin,
      updateProfile,
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
