import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  grade: string;
  enrolledCourses: { id: string; name: string; progress: number; nextClass: string; teacher: string; color: string }[];
  totalClasses: number;
  completedClasses: number;
  streak: number;
  joinedDate: string;
  certificates: { name: string; date: string; course: string }[];
  upcomingClasses: { date: string; time: string; course: string; teacher: string }[];
}

const MOCK_STUDENTS: Record<string, Student> = {
  "student-emma-2024": {
    id: "student-emma-2024",
    name: "Emma Johnson",
    email: "emma@example.com",
    avatar: "https://images.unsplash.com/photo-1595454223600-91fbcd25e27c?w=150&h=150&fit=crop&crop=face",
    grade: "Grade 6",
    streak: 12,
    totalClasses: 48,
    completedClasses: 36,
    joinedDate: "January 2024",
    enrolledCourses: [
      { id: "python", name: "Python for Kids", progress: 72, nextClass: "Tomorrow 4:00 PM", teacher: "Ms. Priya", color: "bg-blue-500" },
      { id: "scratch", name: "Scratch Programming", progress: 100, nextClass: "Completed", teacher: "Mr. James", color: "bg-purple-500" },
      { id: "webdev", name: "Web Development", progress: 30, nextClass: "Friday 5:00 PM", teacher: "Ms. Sarah", color: "bg-orange-500" },
    ],
    certificates: [
      { name: "Scratch Master", date: "March 2024", course: "Scratch Programming" },
    ],
    upcomingClasses: [
      { date: "Tomorrow", time: "4:00 PM", course: "Python for Kids", teacher: "Ms. Priya" },
      { date: "Friday", time: "5:00 PM", course: "Web Development", teacher: "Ms. Sarah" },
    ],
  },
  "student-liam-2024": {
    id: "student-liam-2024",
    name: "Liam Chen",
    email: "liam@example.com",
    avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&crop=face",
    grade: "Grade 8",
    streak: 25,
    totalClasses: 60,
    completedClasses: 58,
    joinedDate: "September 2023",
    enrolledCourses: [
      { id: "ai", name: "AI & Machine Learning", progress: 55, nextClass: "Today 6:00 PM", teacher: "Mr. Arjun", color: "bg-green-500" },
      { id: "gamedev", name: "Game Development", progress: 88, nextClass: "Saturday 3:00 PM", teacher: "Mr. Tom", color: "bg-red-500" },
    ],
    certificates: [
      { name: "Python Pro", date: "January 2024", course: "Python for Kids" },
      { name: "App Builder", date: "November 2023", course: "App Development" },
    ],
    upcomingClasses: [
      { date: "Today", time: "6:00 PM", course: "AI & Machine Learning", teacher: "Mr. Arjun" },
      { date: "Saturday", time: "3:00 PM", course: "Game Development", teacher: "Mr. Tom" },
    ],
  },
  "student-sofia-2024": {
    id: "student-sofia-2024",
    name: "Sofia Patel",
    email: "sofia@example.com",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face",
    grade: "Grade 5",
    streak: 7,
    totalClasses: 20,
    completedClasses: 12,
    joinedDate: "February 2024",
    enrolledCourses: [
      { id: "scratch", name: "Scratch Programming", progress: 60, nextClass: "Wednesday 4:30 PM", teacher: "Mr. James", color: "bg-purple-500" },
    ],
    certificates: [],
    upcomingClasses: [
      { date: "Wednesday", time: "4:30 PM", course: "Scratch Programming", teacher: "Mr. James" },
    ],
  },
};

const DEMO_CREDENTIALS: Record<string, string> = {
  "emma@example.com": "student-emma-2024",
  "liam@example.com": "student-liam-2024",
  "sofia@example.com": "student-sofia-2024",
};

interface AuthContextType {
  student: Student | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getDashboardLink: (studentId: string) => string;
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
        const { studentId } = JSON.parse(stored);
        if (MOCK_STUDENTS[studentId]) {
          setStudent(MOCK_STUDENTS[studentId]);
        }
      } catch {
        localStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string, rememberMe: boolean) => {
    await new Promise((r) => setTimeout(r, 900));
    const studentId = DEMO_CREDENTIALS[email.toLowerCase().trim()];
    if (!studentId || !MOCK_STUDENTS[studentId]) {
      return { success: false, error: "Invalid email or password. Try emma@example.com" };
    }
    const sessionData = JSON.stringify({ studentId });
    if (rememberMe) {
      localStorage.setItem(SESSION_KEY, sessionData);
    } else {
      sessionStorage.setItem(SESSION_KEY, sessionData);
    }
    setStudent(MOCK_STUDENTS[studentId]);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setStudent(null);
  };

  const getDashboardLink = (studentId: string) => `/dashboard/${studentId}`;

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
