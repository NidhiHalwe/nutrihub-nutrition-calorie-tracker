import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();
const AUTH_KEY = 'foodhub_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
    } catch { return null; }
  });

  function login(userData) {
    setUser(userData);
    localStorage.setItem(AUTH_KEY, JSON.stringify(userData));
  }
  function logout() {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
