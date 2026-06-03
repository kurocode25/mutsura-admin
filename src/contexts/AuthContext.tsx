import { createContext, useState, useContext, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logoutRequest, refreshToken, setAccessToken } from '../api';

interface User {
  id: string;
  name: {
    ja: string;
    en: string;
  };
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch (error: unknown) {
      console.error('Error in logout:', error);
    } finally {
      setAccessToken(null);
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoading(true);
      try {
        const refreshResponse = await refreshToken();
        const { token } = refreshResponse.data;
        setAccessToken(token);

        const meResponse = await getMe();
        if (meResponse.data && meResponse.data.user) {
          setUser(meResponse.data.user);
          setIsAuthenticated(true);
        } else {
          throw new Error('Failed to get user data after refresh');
        }
      } catch (error: unknown) {
        console.error('Error in verifyAuth:', error);
        await logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();

    const handleAuthError = () => {
      void logout();
    };

    window.addEventListener('auth-error', handleAuthError);

    return () => {
      window.removeEventListener('auth-error', handleAuthError);
    };
  }, [logout]);

  const login = async (token: string) => {
    setAccessToken(token);
    try {
      const response = await getMe();
      if (response.data && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        navigate('/');
      } else {
        throw new Error('Invalid user data after login');
      }
    } catch (error: unknown) {
      console.error('Error in login (getMe after login):', error);
      await logout();
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
