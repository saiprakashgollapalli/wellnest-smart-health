import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

/**
 * AuthProvider – wraps the app and provides auth state and actions.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wellnest_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((userData, token) => {
    localStorage.setItem('wellnest_token', token);
    localStorage.setItem('wellnest_user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('wellnest_token');
    localStorage.removeItem('wellnest_user');
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'ADMIN';
  const isTrainer = user?.role === 'TRAINER';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isTrainer }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}