import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthUser, AuthResult, RegisterData, UserRole } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: AuthUser | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error('[AuthContext] Failed to initialize auth:', err);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setCurrentUser(result.user);
    }
    return result;
  };

  const register = async (data: RegisterData): Promise<AuthResult> => {
    const result = await authService.register(data);
    if (result.success && result.user) {
      setCurrentUser(result.user);
    }
    return result;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setCurrentUser(null);
  };

  const refreshUser = async (): Promise<void> => {
    const user = await authService.getCurrentUser();
    setCurrentUser(user);
  };

  const role = currentUser?.role || null;
  const isAuthenticated = Boolean(currentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
