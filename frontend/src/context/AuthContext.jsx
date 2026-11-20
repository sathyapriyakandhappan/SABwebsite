import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sab_admin_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('sab_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('sab_admin_token');
      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.data.success) {
            setUser(res.data.admin);
            localStorage.setItem('sab_admin_user', JSON.stringify(res.data.admin));
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.admin);
      localStorage.setItem('sab_admin_token', res.data.token);
      localStorage.setItem('sab_admin_user', JSON.stringify(res.data.admin));
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('sab_admin_token');
    localStorage.removeItem('sab_admin_user');
  };

  const updateProfile = async (data) => {
    const res = await authApi.updateProfile(data);
    if (res.data.success) {
      setUser(res.data.admin);
      localStorage.setItem('sab_admin_user', JSON.stringify(res.data.admin));
    }
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
