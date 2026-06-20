"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "ai-tutor-users";
const CURRENT_KEY = "ai-tutor-current-user";

function getSavedUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CURRENT_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async (username: string, email: string, password: string) => {
    const users = getSavedUsers();
    if (users.find((u: any) => u.email === email)) return false;
    users.push({ username, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_KEY, JSON.stringify({ username, email }));
    setUser({ username, email });
    return true;
  };

  const login = async (email: string, password: string) => {
    const users = getSavedUsers();
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (!found) return false;
    localStorage.setItem(CURRENT_KEY, JSON.stringify({ username: found.username, email }));
    setUser({ username: found.username, email });
    return true;
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
