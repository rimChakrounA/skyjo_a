import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  apiLogin,
  apiMe,
  apiRegister,
  loadToken,
  removeToken,
  saveToken,
  type AuthUser,
} from '@/services/authService';

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Restaurer la session au montage si un token est stocké
  useEffect(() => {
    if (loadToken() === null) {
      setLoading(false);
      return;
    }
    void apiMe()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    const { token, user: u } = await apiLogin(username, password);
    saveToken(token);
    setUser(u);
  }, []);

  const register = useCallback(async (username: string, password: string): Promise<void> => {
    const { token, user: u } = await apiRegister(username, password);
    saveToken(token);
    setUser(u);
  }, []);

  const logout = useCallback((): void => {
    removeToken();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
