import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import api from "../services/api.ts";

type User = {
  _id?: string;
  id?: string;
  username: string;
  dob?: string;
  coins: number;
  total_played: number;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (payload: {
    username: string;
    password: string;
    confirmPassword: string;
    dob: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
  }, []);

  const login = async (username: string, password: string) => {
    const { data } = await api.post("/auth/login", { username, password });
    setUser(data.user);
  };

  const signup = async (payload: {
    username: string;
    password: string;
    confirmPassword: string;
    dob: string;
  }) => {
    const { data } = await api.post("/auth/signup", payload);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, logout, refreshMe }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
