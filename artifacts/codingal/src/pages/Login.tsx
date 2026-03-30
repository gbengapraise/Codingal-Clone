import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, BookOpen, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { login, student } = useAuth();
  const [, navigate] = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      navigate(`/dashboard/${student.id}`);
    }
  }, [student, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    const result = await login(email, password, rememberMe);
    setLoading(false);
    if (result.success && student) {
      navigate(`/dashboard/${student.id}`);
    } else if (!result.success) {
      setError(result.error || "Login failed. Please try again.");
    }
  };

  const demoAccounts = [
    { name: "Emma Johnson", email: "emma@example.com", grade: "Grade 6" },
    { name: "Liam Chen", email: "liam@example.com", grade: "Grade 8" },
    { name: "Sofia Patel", email: "sofia@example.com", grade: "Grade 5" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-red-500 to-secondary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 80 + 20}px`,
                height: `${Math.random() * 80 + 20}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative text-center text-white"
        >
          <Link href="/" className="flex items-center gap-3 justify-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight">Praise Coding Academy</span>
          </Link>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Welcome Back,<br />Young Coder! 🚀
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-sm mx-auto">
            Sign in to access your personal dashboard, track your progress, and jump into your next live class.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[
              { label: "Live Classes", value: "1:1" },
              { label: "Students", value: "45k+" },
              { label: "Courses", value: "100+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/15 backdrop-blur rounded-2xl p-4">
                <div className="text-2xl font-extrabold">{stat.value}</div>
                <div className="text-sm text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900">Praise Coding Academy</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-500">Access your student dashboard</p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-bold text-blue-700">Demo Accounts (any password)</span>
            </div>
            <div className="flex flex-col gap-2">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => { setEmail(acc.email); setPassword("demo123"); setError(""); }}
                  className="flex items-center justify-between text-left px-3 py-2 rounded-xl bg-white border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <div>
                    <span className="text-sm font-semibold text-gray-800">{acc.name}</span>
                    <span className="text-xs text-gray-500 ml-2">{acc.grade}</span>
                  </div>
                  <span className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">Use this →</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-gray-900 placeholder:text-gray-400"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                      rememberMe
                        ? "bg-primary border-primary"
                        : "bg-white border-gray-300 group-hover:border-primary/50"
                    }`}
                  >
                    {rememberMe && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                  Remember me
                </span>
              </label>
              <button type="button" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/" className="text-primary font-semibold hover:underline">
              Book a free class
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
