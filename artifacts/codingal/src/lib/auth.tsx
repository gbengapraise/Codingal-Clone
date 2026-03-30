import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";

export interface StudentCourse {
  id: string;
  name: string;
  progress: number;
  nextClass: string;
  teacher: string;
  color: string;
}

export interface StudentCertificate {
  name: string;
  date: string;
  course: string;
}

export interface StudentUpcomingClass {
  date: string;
  time: string;
  course: string;
  teacher: string;
}

export interface Student {
  id: number;
  studentCode: string;
  name: string;
  email: string;
  avatar: string | null;
  grade: string;
  streak: number;
  totalClasses: number;
  completedClasses: number;
  joinedDate: string;
  enrolledCourses: StudentCourse[];
  certificates: StudentCertificate[];
  upcomingClasses: StudentUpcomingClass[];
}

interface AuthContextType {
  student: Student | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getDashboardLink: (studentId: number) => string;
}

const AuthContext = createContext<AuthContextType | null>(null);
const SESSION_KEY = "pca_session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setStudent(parsed);
      } catch {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    try {
      const res = await fetch("/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, error: err.error || "Invalid email or password. Try emma@example.com" };
      }

      const studentData: Student = await res.json();
      const sessionData = JSON.stringify(studentData);

      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, sessionData);
      } else {
        sessionStorage.setItem(SESSION_KEY, sessionData);
      }

      setStudent(studentData);
      return { success: true };
    } catch {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setStudent(null);
  };

  const getDashboardLink = (studentId: number) => `/dashboard/${studentId}`;

  return (
    <AuthContext.Provider value={{ student, isLoading, login, logout, getDashboardLink }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { student, isLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading && !student) {
      navigate("/login");
    }
  }, [student, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-gray-500 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!student) return null;
  return <>{children}</>;
}
