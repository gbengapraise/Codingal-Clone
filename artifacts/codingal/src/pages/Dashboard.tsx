import { useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import {
  BookOpen, Trophy, Flame, Clock, Calendar, CheckCircle2,
  Copy, ExternalLink, LogOut, ChevronRight, Star, Play, Award
} from "lucide-react";
import { useAuth, RequireAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

function DashboardContent() {
  const { student, logout } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const params = useParams<{ studentId: string }>();

  useEffect(() => {
    if (student && String(student.id) !== params.studentId) {
      navigate(`/dashboard/${student.id}`);
    }
  }, [student, params.studentId, navigate]);

  if (!student) return null;

  const dashboardUrl = `${window.location.origin}/dashboard/${student.id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(dashboardUrl).then(() => {
      toast({
        title: "Link copied!",
        description: "Your unique dashboard link has been copied to clipboard.",
      });
    });
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const progressPercent = Math.round((student.completedClasses / student.totalClasses) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-gray-900 hidden sm:block">Praise Coding Academy</span>
            </Link>

            <div className="flex items-center gap-3">
              <img
                src={student.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=e63946&color=fff`}
                alt={student.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-primary/20"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">{student.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{student.grade}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Unique Dashboard Link Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-primary/10 via-orange-50 to-secondary/10 border border-primary/20 rounded-2xl p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ExternalLink className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary">Your Unique Dashboard Link</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">Bookmark this link to return directly to your dashboard anytime.</p>
              <code className="text-sm font-mono text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-gray-200 break-all">
                {dashboardUrl}
              </code>
            </div>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 shadow-md hover:shadow-lg transition-all shrink-0"
            >
              <Copy className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        </motion.div>

        {/* Welcome + Stats */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
            Welcome back, {student.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-gray-500">Joined {student.joinedDate} · {student.grade}</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <CheckCircle2 className="w-5 h-5" />, label: "Classes Done", value: student.completedClasses, color: "text-green-600 bg-green-100" },
            { icon: <Flame className="w-5 h-5" />, label: "Day Streak", value: `${student.streak}🔥`, color: "text-orange-600 bg-orange-100" },
            { icon: <BookOpen className="w-5 h-5" />, label: "Courses", value: student.enrolledCourses.length, color: "text-blue-600 bg-blue-100" },
            { icon: <Trophy className="w-5 h-5" />, label: "Certificates", value: student.certificates.length, color: "text-purple-600 bg-purple-100" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: courses */}
          <div className="lg:col-span-2 space-y-6">

            {/* Overall progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Overall Progress</h2>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                  />
                </div>
                <span className="text-sm font-bold text-gray-700 w-12 text-right">{progressPercent}%</span>
              </div>
              <p className="text-sm text-gray-500">{student.completedClasses} of {student.totalClasses} classes completed</p>
            </div>

            {/* Enrolled Courses */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-5">My Courses</h2>
              <div className="space-y-4">
                {student.enrolledCourses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                  >
                    <div className={`w-12 h-12 rounded-xl ${course.color} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{course.name}</h3>
                        <span className="text-sm font-bold text-gray-700 ml-2">{course.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
                        <div
                          className={`h-full ${course.color} rounded-full`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{course.nextClass}</span>
                        <span className="mx-1">·</span>
                        <span>{course.teacher}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certificates */}
            {student.certificates.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 mb-5">My Certificates</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {student.certificates.map((cert, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-400 to-orange-400 flex items-center justify-center shadow-sm">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.course}</p>
                        <p className="text-xs text-orange-600 font-medium mt-0.5">{cert.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: upcoming + info */}
          <div className="space-y-6">

            {/* Upcoming Classes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Upcoming Classes</h2>
              {student.upcomingClasses.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">No upcoming classes scheduled.</p>
              ) : (
                <div className="space-y-4">
                  {student.upcomingClasses.map((cls, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        {i < student.upcomingClasses.length - 1 && (
                          <div className="w-px flex-1 bg-gray-100 mt-2" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-bold text-gray-900 text-sm">{cls.course}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{cls.date} at {cls.time}</p>
                        <p className="text-xs text-primary font-medium mt-0.5">{cls.teacher}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Motivational card */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 fill-white" />
                <h3 className="font-bold">Keep it up!</h3>
              </div>
              <p className="text-sm text-white/85 mb-4">
                You're on a <strong>{student.streak}-day</strong> streak! Consistency is the key to becoming a great coder.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-sm font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all"
              >
                Browse More Courses
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Dashboard() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
