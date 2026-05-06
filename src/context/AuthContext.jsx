import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch, getToken, isTokenExpired, setUnauthorizedHandler } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null);
  const [loading, setLoading] = useState(true);

  const signOut = useCallback(() => {
    setUser(null);
    localStorage.removeItem('lm_user');
    localStorage.removeItem('lm_token');
  }, []);

  // Register global 401 handler so any expired API call auto-signs out
  useEffect(() => {
    setUnauthorizedHandler(signOut);
  }, [signOut]);

  // Restore session on mount — validate token before trusting localStorage
  useEffect(() => {
    const token  = getToken();
    const stored = localStorage.getItem('lm_user');

    if (token && !isTokenExpired(token) && stored) {
      try { setUser(JSON.parse(stored)); } catch { /* corrupted — fall through to clear */ }
    } else {
      // Token missing, expired, or state inconsistent — clear everything
      localStorage.removeItem('lm_user');
      localStorage.removeItem('lm_token');
    }

    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    localStorage.setItem('lm_user', JSON.stringify(data.user));
    localStorage.setItem('lm_token', data.token);
  };

  const signUp = async (name, email, password) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setUser(data.user);
    localStorage.setItem('lm_user', JSON.stringify(data.user));
    localStorage.setItem('lm_token', data.token);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
