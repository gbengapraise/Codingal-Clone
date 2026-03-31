import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  token: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);
const ADMIN_SESSION_KEY = "pca_admin_session";

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_SESSION_KEY);
    if (stored) {
      try { setAdmin(JSON.parse(stored)); } catch { localStorage.removeItem(ADMIN_SESSION_KEY); }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.error || "Invalid credentials" };
      }
      const data: AdminUser = await res.json();
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(data));
      setAdmin(data);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { admin, isLoading } = useAdminAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !admin) navigate("/admin/login");
  }, [admin, isLoading, navigate]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
  if (!admin) return null;
  return <>{children}</>;
}
