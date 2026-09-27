import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('fixit_token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fixit_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Validate and hydrate profile on startup
  useEffect(() => {
    const hydrateUser = async () => {
      const storedToken = localStorage.getItem('fixit_token');
      if (storedToken) {
        try {
          const profileResponse = await authService.getProfile();
          if (profileResponse && profileResponse.data) {
            setUser(profileResponse.data);
            localStorage.setItem('fixit_user', JSON.stringify(profileResponse.data));
          }
        } catch (err) {
          // Token is invalid or expired
          logout();
        }
      }
      setLoading(false);
    };

    hydrateUser();
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    const authData = response.data; // AuthResponse { token, tokenType, user }

    localStorage.setItem('fixit_token', authData.token);
    localStorage.setItem('fixit_user', JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
    return authData.user;
  };

  const register = async (registrationData) => {
    const response = await authService.register(registrationData);
    const authData = response.data;

    localStorage.setItem('fixit_token', authData.token);
    localStorage.setItem('fixit_user', JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
    return authData.user;
  };

  const logout = () => {
    localStorage.removeItem('fixit_token');
    localStorage.removeItem('fixit_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
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

export default AuthContext;
