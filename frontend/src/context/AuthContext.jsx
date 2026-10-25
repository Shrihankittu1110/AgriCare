import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import i18n from '../locales/i18n';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agricare_token') || null);
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('agricare_token');
      if (storedToken) {
        try {
          const data = await authService.getMe();
          if (data.success && data.user) {
            setUser(data.user);
            setPreferences(data.preferences);
            if (data.user.preferredLanguage) {
              i18n.changeLanguage(data.user.preferredLanguage);
            }
          }
        } catch (err) {
          console.warn('[Auth] Session check failed, clearing token.');
          localStorage.removeItem('agricare_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.success) {
      localStorage.setItem('agricare_token', data.token);
      setToken(data.token);
      setUser(data.user);
      if (data.user.preferredLanguage) {
        i18n.changeLanguage(data.user.preferredLanguage);
      }
    }
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    if (data.success) {
      localStorage.setItem('agricare_token', data.token);
      setToken(data.token);
      setUser(data.user);
      if (data.user.preferredLanguage) {
        i18n.changeLanguage(data.user.preferredLanguage);
      }
    }
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setToken(null);
    setUser(null);
    setPreferences(null);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => ({ ...prev, ...updatedFields }));
    if (updatedFields.preferredLanguage) {
      i18n.changeLanguage(updatedFields.preferredLanguage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        preferences,
        isAuthenticated: Boolean(user && token),
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
