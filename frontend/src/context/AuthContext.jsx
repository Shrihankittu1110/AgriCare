import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import i18n from '../locales/i18n';

const AuthContext = createContext(null);

// Helper to check if a stored token is a valid unexpired JWT
const isValidJwt = (token) => {
  if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
    return false;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return false; // Token has expired
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('agricare_token');
    return isValidJwt(stored) ? stored : null;
  });
  const [preferences, setPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('agricare_token');

      if (!isValidJwt(storedToken)) {
        localStorage.removeItem('agricare_token');
        localStorage.removeItem('agricare_user');
        if (isMounted) {
          setToken(null);
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const data = await authService.getMe();
        if (isMounted && data.success && data.user) {
          setUser(data.user);
          setPreferences(data.preferences);
          if (data.user.preferredLanguage) {
            i18n.changeLanguage(data.user.preferredLanguage);
          }
        }
      } catch (err) {
        // Silently reset stale token without noisy warnings
        localStorage.removeItem('agricare_token');
        localStorage.removeItem('agricare_user');
        if (isMounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
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
