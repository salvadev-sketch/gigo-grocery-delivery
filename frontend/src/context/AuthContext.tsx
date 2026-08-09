import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, toFrontendUser, toFrontendAddress } from "../lib/api";
import type { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const token = localStorage.getItem("gigo_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const [meRes, addrRes] = await Promise.all([api.get("/auth/me"), api.get("/addresses")]);
      setUser(toFrontendUser({ ...meRes.data, addresses: addrRes.data.map(toFrontendAddress) }));
    } catch {
      localStorage.removeItem("gigo_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("gigo_token", data.token);
    await refreshUser();
  }

  async function register(name: string, email: string, password: string, phone?: string) {
    const { data } = await api.post("/auth/register", { name, email, password, phone });
    localStorage.setItem("gigo_token", data.token);
    await refreshUser();
  }

  function logout() {
    localStorage.removeItem("gigo_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
