import { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/auth';
import { getToken, setToken, removeToken } from '../utils/token';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // restore session on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      getMe()
        .then((data) => {
          setUser(data.user);
        })
        .catch(() => {
          removeToken();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // login function
  const login = (userData, token) => {
    setToken(token);
    setUser(userData);
  };

  // logout function
  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
