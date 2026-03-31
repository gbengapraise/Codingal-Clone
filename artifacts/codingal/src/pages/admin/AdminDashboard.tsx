import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  Users, CreditCard, MessageSquare, LogOut, BookOpen, ChevronRight,
  Plus, Trash2, Copy, Check, Award, Star, Zap, FileText, BarChart3,
  X, Search, Eye, Shield, ExternalLink, Upload, CheckCircle2
} from "lucide-react";
import { RequireAdmin, useAdminAuth } from "@/lib/adminAuth";
import { useToast } from "@/hooks/use-toast";

type Section = "students" | "payments" | "feedback";

interface Student {
  id: number; name: string; email: string; grade: string; avatar: string | null;
  streak: number; totalClasses: number; completedClasses: number;
  enrolledCourses: any[]; certificates: any[]; badges: any[]; learningCredits: number;
  joinedDate: string;
}

interface PaymentLog {
  id: number; studentName: string; parentEmail: string; amount: number;
  currency: string; description: string; status: string; reference: string | null; createdAt: string;
}

interface FeedbackForm {
  id: number; studentId: number; title: string; message: string; category: string; createdAt: string;
}

function useAdminFetch<T>(url: string, deps: any[] = []) {
  const { admin } = useAdminAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    if (!admin) return;
    setLoading(true);
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${admin.token}` } });
      if (res.ok) setData(await res.json());
    } finally { setLoading(false); }
  };

  useEffect(() => { refetch(); }, [admin, ...deps]);
  return { data, loading, refetch };
}

// ─── Modal: Manage Student ─────────────────────────────────────────────────
function StudentModal({ student, onClose, token }: { student: Student; onClose: () => void; token: string }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "badges" | "projects" | "quizzes" | "certificates" | "credits" | "feedback" | "magic">("overview");
  const [loading, setLoading] = useState(false);

  const apiFetch = (path: string, method = "GET", body?: any) =>
    fetch(path, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });

  // Badges
  const [badgeName, setBadgeName] = useState(""); const [badgeIcon, setBadgeIcon] = useState("🏆"); const [badgeDesc, setBadgeDesc] = useState("");
  const [badges, setBadges] = useState(student.badges ?? []);
  const addBadge = async () => {
    if (!badgeName.trim()) return;
    setLoading(true);
    const res = await apiFetch(`/api/admin/students/${student.id}/badges`, "POST", { name: badgeName, icon: badgeIcon, description: badgeDesc });
    const data = await res.json();
    setBadges(b => [...b, data.badge]);
    setBadgeName(""); setBadgeDesc(""); setBadgeIcon("🏆");
    toast({ title: "Badge awarded! 🏅" });
    setLoading(false);
  };
  const removeBadge = async (badgeId: string) => {
    await apiFetch(`/api/admin/students/${student.id}/badges/${badgeId}`, "DELETE");
    setBadges(b => b.filter((x: any) => x.id !== badgeId));
    toast({ title: "Badge removed" });
  };

  // Projects
  const [projTitle, setProjTitle] = useState(""); const [projDesc, setProjDesc] = useState(""); const [projUrl, setProjUrl] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  useEffect(() => {
    apiFetch(`/api/admin/students/${student.id}`).then(r => r.json()).then(d => { setProjects(d.projects ?? []); });
  }, []);
  const addProject = async () => {
    if (!projTitle.trim()) return;
    setLoading(true);
    const res = await apiFetch(`/api/admin/students/${student.id}/projects`, "POST", { title: projTitle, description: projDesc, fileUrl: projUrl });
    const data = await res.json();
    setProjects(p => [...p, data]);
    setProjTitle(""); setProjDesc(""); setProjUrl("");
    toast({ title: "Project uploaded!" });
    setLoading(false);
  };
  const removeProject = async (id: number) => {
    await apiFetch(`/api/admin/students/${student.id}/projects/${id}`, "DELETE");
    setProjects(p => p.filter(x => x.id !== id));
  };

  // Quizzes
  const [quizTitle, setQuizTitle] = useState(""); const [quizDesc, setQuizDesc] = useState(""); const [quizDue, setQuizDue] = useState("");
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const addQuiz = async () => {
    if (!quizTitle.trim()) return;
    setLoading(true);
    const res = await apiFetch(`/api/admin/students/${student.id}/quizzes`, "POST", { title: quizTitle, description: quizDesc, dueDate: quizDue });
    const data = await res.json();
    setQuizzes(q => [...q, data]);
    setQuizTitle(""); setQuizDesc(""); setQuizDue("");
    toast({ title: "Quiz assigned!" });
    setLoading(false);
  };
  const removeQuiz = async (id: number) => {
    await apiFetch(`/api/admin/students/${student.id}/quizzes/${id}`, "DELETE");
    setQuizzes(q => q.filter(x => x.id !== id));
  };

  // Certificates
  const [certName, setCertName] = useState(""); const [certCourse, setCertCourse] = useState("");
  const [certs, setCerts] = useState(student.certificates ?? []);
  const addCert = async () => {
    if (!certName.trim() || !certCourse.trim()) return;
    setLoading(true);
    const res = await apiFetch(`/api/admin/students/${student.id}/certificates`, "POST", { name: certName, course: certCourse });
    const data = await res.json();
    setCerts(c => [...c, data.certificate]);
    setCertName(""); setCertCourse("");
    toast({ title: "Certificate uploaded! 🎓" });
    setLoading(false);
  };

  // Credits
  const [creditAmt, setCreditAmt] = useState(""); const [credits, setCredits] = useState(student.learningCredits ?? 0);
  const addCredits = async () => {
    const amount = parseInt(creditAmt);
    if (isNaN(amount)) return;
    setLoading(true);
    const res = await apiFetch(`/api/admin/students/${student.id}/credits`, "POST", { amount });
    const data = await res.json();
    setCredits(data.learningCredits);
    setCreditAmt("");
    toast({ title: `${amount > 0 ? "+" : ""}${amount} credits applied!` });
    setLoading(false);
  };

  // Feedback form
  const [fbTitle, setFbTitle] = useState(""); const [fbMsg, setFbMsg] = useState(""); const [fbCat, setFbCat] = useState("general");
  const sendFeedback = async () => {
    if (!fbTitle.trim() || !fbMsg.trim()) return;
    setLoading(true);
    await apiFetch(`/api/admin/feedback-forms`, "POST", { studentId: student.id, title: fbTitle, message: fbMsg, category: fbCat });
    setFbTitle(""); setFbMsg("");
    toast({ title: "Feedback form sent!" });
    setLoading(false);
  };

  // Magic link
  const [magicLink, setMagicLink] = useState(""); const [copied, setCopied] = useState(false);
  const generateMagicLink = async () => {
    setLoading(true);
    const res = await apiFetch(`/api/admin/students/${student.id}/magic-link`, "POST");
    const data = await res.json();
    setMagicLink(data.link);
    setLoading(false);
  };
  const copyMagicLink = () => {
    navigator.clipboard.writeText(magicLink);
    setCopied(true);
    toast({ title: "Magic link copied!" });
    setTimeout(() => setCopied(false), 2000);
  };

  const TABS = [
    { key: "overview", label: "Overview", icon: <Eye className="w-4 h-4" /> },
    { key: "badges", label: "Badges", icon: <Star className="w-4 h-4" /> },
    { key: "projects", label: "Projects", icon: <Upload className="w-4 h-4" /> },
    { key: "quizzes", label: "Quizzes", icon: <FileText className="w-4 h-4" /> },
    { key: "certificates", label: "Certs", icon: <Award className="w-4 h-4" /> },
    { key: "credits", label: "Credits", icon: <Zap className="w-4 h-4" /> },
    { key: "feedback", label: "Feedback", icon: <MessageSquare className="w-4 h-4" /> },
    { key: "magic", label: "Magic Link", icon: <ExternalLink className="w-4 h-4" /> },
  ] as const;

  const inputCls = "w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";
  const btnCls = "px-4 py-2 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <img src={student.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=e63946&color=fff`} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h2 className="font-bold text-white text-lg">{student.name}</h2>
              <p className="text-gray-400 text-sm">{student.grade} · {student.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto px-6 pt-4 gap-1 shrink-0 border-b border-gray-800 pb-0">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Classes Done", value: student.completedClasses, color: "text-green-400" },
                { label: "Day Streak", value: `${student.streak} 🔥`, color: "text-orange-400" },
                { label: "Certificates", value: certs.length, color: "text-purple-400" },
                { label: "Learning Credits", value: credits, color: "text-blue-400" },
                { label: "Badges", value: badges.length, color: "text-yellow-400" },
                { label: "Courses", value: student.enrolledCourses?.length ?? 0, color: "text-pink-400" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-800 rounded-2xl p-4">
                  <p className="text-gray-400 text-xs mb-1">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "badges" && (
            <>
              <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-white font-semibold text-sm">Award a Badge</h3>
                <div className="grid grid-cols-2 gap-3">
                  <input className={inputCls} placeholder="Badge name" value={badgeName} onChange={e => setBadgeName(e.target.value)} />
                  <input className={inputCls} placeholder="Icon emoji (🏆)" value={badgeIcon} onChange={e => setBadgeIcon(e.target.value)} />
                </div>
                <input className={inputCls} placeholder="Description (optional)" value={badgeDesc} onChange={e => setBadgeDesc(e.target.value)} />
                <button onClick={addBadge} disabled={loading || !badgeName} className={btnCls}><Plus className="w-4 h-4" />Award Badge</button>
              </div>
              <div className="space-y-2">
                {badges.map((b: any) => (
                  <div key={b.id} className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{b.icon}</span>
                      <div><p className="text-white font-semibold text-sm">{b.name}</p><p className="text-gray-400 text-xs">{b.description}</p></div>
                    </div>
                    <button onClick={() => removeBadge(b.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-400/10"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {badges.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No badges yet.</p>}
              </div>
            </>
          )}

          {activeTab === "projects" && (
            <>
              <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-white font-semibold text-sm">Upload a Project</h3>
                <input className={inputCls} placeholder="Project title *" value={projTitle} onChange={e => setProjTitle(e.target.value)} />
                <textarea className={inputCls + " resize-none h-20"} placeholder="Description" value={projDesc} onChange={e => setProjDesc(e.target.value)} />
                <input className={inputCls} placeholder="File / Project URL (e.g. scratch.mit.edu/...)" value={projUrl} onChange={e => setProjUrl(e.target.value)} />
                <button onClick={addProject} disabled={loading || !projTitle} className={btnCls}><Upload className="w-4 h-4" />Upload Project</button>
              </div>
              <div className="space-y-2">
                {projects.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
                    <div><p className="text-white font-semibold text-sm">{p.title}</p><p className="text-gray-400 text-xs">{p.description}</p>{p.fileUrl && <a href={p.fileUrl} target="_blank" className="text-primary text-xs hover:underline">{p.fileUrl}</a>}</div>
                    <button onClick={() => removeProject(p.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-400/10 shrink-0 ml-3"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {projects.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No projects uploaded yet.</p>}
              </div>
            </>
          )}

          {activeTab === "quizzes" && (
            <>
              <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-white font-semibold text-sm">Assign a Quiz</h3>
                <input className={inputCls} placeholder="Quiz title *" value={quizTitle} onChange={e => setQuizTitle(e.target.value)} />
                <textarea className={inputCls + " resize-none h-20"} placeholder="Instructions / description" value={quizDesc} onChange={e => setQuizDesc(e.target.value)} />
                <input className={inputCls} placeholder="Due date (e.g. April 10, 2025)" value={quizDue} onChange={e => setQuizDue(e.target.value)} />
                <button onClick={addQuiz} disabled={loading || !quizTitle} className={btnCls}><Plus className="w-4 h-4" />Assign Quiz</button>
              </div>
              <div className="space-y-2">
                {quizzes.map((q: any) => (
                  <div key={q.id} className="flex items-center justify-between bg-gray-800 rounded-xl p-3">
                    <div>
                      <p className="text-white font-semibold text-sm">{q.title}</p>
                      {q.dueDate && <p className="text-gray-400 text-xs">Due: {q.dueDate}</p>}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.completed ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>{q.completed ? "Completed" : "Pending"}</span>
                    </div>
                    <button onClick={() => removeQuiz(q.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-400/10 shrink-0 ml-3"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                {quizzes.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No quizzes assigned yet.</p>}
              </div>
            </>
          )}

          {activeTab === "certificates" && (
            <>
              <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-white font-semibold text-sm">Upload a Certificate</h3>
                <input className={inputCls} placeholder="Certificate name *" value={certName} onChange={e => setCertName(e.target.value)} />
                <input className={inputCls} placeholder="Course name *" value={certCourse} onChange={e => setCertCourse(e.target.value)} />
                <button onClick={addCert} disabled={loading || !certName || !certCourse} className={btnCls}><Award className="w-4 h-4" />Upload Certificate</button>
              </div>
              <div className="space-y-2">
                {certs.map((c: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-800 rounded-xl p-3">
                    <Award className="w-6 h-6 text-yellow-400 shrink-0" />
                    <div><p className="text-white font-semibold text-sm">{c.name}</p><p className="text-gray-400 text-xs">{c.course} · {c.date}</p></div>
                  </div>
                ))}
                {certs.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No certificates yet.</p>}
              </div>
            </>
          )}

          {activeTab === "credits" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 rounded-2xl p-6 text-center">
                <Zap className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                <p className="text-4xl font-black text-white">{credits}</p>
                <p className="text-gray-400 text-sm mt-1">Current Learning Credits</p>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
                <h3 className="text-white font-semibold text-sm">Add / Deduct Credits</h3>
                <input className={inputCls} type="number" placeholder="Amount (use negative to deduct, e.g. -50)" value={creditAmt} onChange={e => setCreditAmt(e.target.value)} />
                <button onClick={addCredits} disabled={loading || !creditAmt} className={btnCls}><Zap className="w-4 h-4" />Apply Credits</button>
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="bg-gray-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-white font-semibold text-sm">Send a Feedback Form</h3>
              <input className={inputCls} placeholder="Subject / Title *" value={fbTitle} onChange={e => setFbTitle(e.target.value)} />
              <select className={inputCls} value={fbCat} onChange={e => setFbCat(e.target.value)}>
                {["general", "performance", "behaviour", "progress", "achievement"].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <textarea className={inputCls + " resize-none h-32"} placeholder="Write your feedback / notes for the student here..." value={fbMsg} onChange={e => setFbMsg(e.target.value)} />
              <button onClick={sendFeedback} disabled={loading || !fbTitle || !fbMsg} className={btnCls}><MessageSquare className="w-4 h-4" />Send Feedback Form</button>
            </div>
          )}

          {activeTab === "magic" && (
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  <h3 className="text-white font-semibold">Generate Unique Login Link</h3>
                </div>
                <p className="text-gray-400 text-sm">Creates a special link that takes the student directly to their dashboard without needing a password. Valid for 30 days.</p>
                <button onClick={generateMagicLink} disabled={loading} className={btnCls}><Shield className="w-4 h-4" />Generate Magic Link</button>
              </div>
              {magicLink && (
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 space-y-3">
                  <p className="text-primary font-semibold text-sm">✅ Link Generated!</p>
                  <code className="block text-xs text-gray-300 bg-gray-900 rounded-xl p-3 break-all">{magicLink}</code>
                  <button onClick={copyMagicLink} className={btnCls + " w-full justify-center"}>
                    {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Link</>}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Dashboard ──────────────────────────────────────────────────
function AdminDashboardContent() {
  const { admin, logout } = useAdminAuth();
  const [, navigate] = useLocation();
  const [section, setSection] = useState<Section>("students");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  const { data: students, loading: studentsLoading, refetch: refetchStudents } = useAdminFetch<Student[]>("/api/admin/students");
  const { data: payments, loading: paymentsLoading, refetch: refetchPayments } = useAdminFetch<PaymentLog[]>("/api/admin/payment-logs");
  const { data: feedbacks, loading: feedbacksLoading } = useAdminFetch<FeedbackForm[]>("/api/admin/feedback-forms");

  // Add payment form
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [payForm, setPayForm] = useState({ studentName: "", parentEmail: "", amount: "", description: "", reference: "" });

  const addPayment = async () => {
    if (!admin || !payForm.studentName || !payForm.parentEmail || !payForm.amount || !payForm.description) return;
    await fetch("/api/admin/payment-logs", {
      method: "POST",
      headers: { Authorization: `Bearer ${admin.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...payForm, amount: parseInt(payForm.amount) }),
    });
    setPayForm({ studentName: "", parentEmail: "", amount: "", description: "", reference: "" });
    setShowAddPayment(false);
    refetchPayments();
    toast({ title: "Payment log added!" });
  };

  const filteredStudents = (students ?? []).filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.grade.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = (payments ?? []).reduce((sum, p) => sum + p.amount, 0);

  const NAV = [
    { key: "students", icon: <Users className="w-5 h-5" />, label: "Students" },
    { key: "payments", icon: <CreditCard className="w-5 h-5" />, label: "Payment Log" },
    { key: "feedback", icon: <MessageSquare className="w-5 h-5" />, label: "Feedback Forms" },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-white text-sm">Praise Coding Academy</span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
            <Shield className="w-3 h-3" /> Admin Panel
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(item => (
            <button key={item.key} onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${section === item.key ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">{admin?.name[0]}</div>
            <div className="min-w-0"><p className="text-white text-sm font-semibold truncate">{admin?.name}</p><p className="text-gray-500 text-xs truncate">{admin?.email}</p></div>
          </div>
          <button onClick={() => { logout(); navigate("/admin/login"); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Students", value: students?.length ?? 0, icon: <Users className="w-5 h-5" />, color: "from-blue-500/20 to-blue-600/20 border-blue-500/20 text-blue-400" },
              { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: <CreditCard className="w-5 h-5" />, color: "from-green-500/20 to-green-600/20 border-green-500/20 text-green-400" },
              { label: "Feedback Forms", value: feedbacks?.length ?? 0, icon: <MessageSquare className="w-5 h-5" />, color: "from-purple-500/20 to-purple-600/20 border-purple-500/20 text-purple-400" },
              { label: "Payment Records", value: payments?.length ?? 0, icon: <BarChart3 className="w-5 h-5" />, color: "from-orange-500/20 to-orange-600/20 border-orange-500/20 text-orange-400" },
            ].map((s, i) => (
              <div key={i} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-5`}>
                <div className={s.color.split(" ")[4] + " mb-3"}>{s.icon}</div>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-gray-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Students Section */}
          {section === "students" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Students</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…" className="pl-9 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 w-60" />
                </div>
              </div>
              <div className="grid gap-3">
                {studentsLoading && <p className="text-gray-500 text-sm">Loading…</p>}
                {filteredStudents.map(student => (
                  <motion.div key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center justify-between hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="flex items-center gap-4">
                      <img src={student.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=e63946&color=fff`} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-white">{student.name}</p>
                        <p className="text-gray-400 text-sm">{student.email} · {student.grade}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">{student.completedClasses} classes done</span>
                          {student.badges?.length > 0 && <span className="text-xs text-yellow-400">{student.badges.length} badges</span>}
                          {student.learningCredits > 0 && <span className="text-xs text-blue-400">{student.learningCredits} credits</span>}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-primary transition-colors" />
                  </motion.div>
                ))}
                {!studentsLoading && filteredStudents.length === 0 && <p className="text-gray-500 text-sm text-center py-8">No students found.</p>}
              </div>
            </div>
          )}

          {/* Payments Section */}
          {section === "payments" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Payment Log</h1>
                <button onClick={() => setShowAddPayment(!showAddPayment)} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all">
                  <Plus className="w-4 h-4" />Add Payment
                </button>
              </div>
              {showAddPayment && (
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-5 grid grid-cols-2 gap-3">
                  {[
                    ["studentName", "Student Name *"],
                    ["parentEmail", "Parent Email *"],
                    ["amount", "Amount (USD) *"],
                    ["description", "Description *"],
                    ["reference", "Reference / Invoice #"],
                  ].map(([key, placeholder]) => (
                    <input key={key} className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 text-sm focus:outline-none" placeholder={placeholder} value={(payForm as any)[key]} onChange={e => setPayForm(f => ({ ...f, [key]: e.target.value }))} />
                  ))}
                  <button onClick={addPayment} className="col-span-2 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-all">Save Payment Log</button>
                </div>
              )}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead><tr className="border-b border-gray-800">
                    {["Student", "Parent Email", "Amount", "Description", "Status", "Date"].map(h => <th key={h} className="text-left text-gray-400 text-xs font-semibold px-5 py-4">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {(payments ?? []).map(p => (
                      <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                        <td className="px-5 py-4 text-white text-sm font-medium">{p.studentName}</td>
                        <td className="px-5 py-4 text-gray-400 text-sm">{p.parentEmail}</td>
                        <td className="px-5 py-4 text-green-400 font-bold text-sm">${p.amount.toLocaleString()} {p.currency}</td>
                        <td className="px-5 py-4 text-gray-400 text-sm">{p.description}</td>
                        <td className="px-5 py-4"><span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${p.status === "completed" ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"}`}>{p.status}</span></td>
                        <td className="px-5 py-4 text-gray-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {(!payments || payments.length === 0) && <tr><td colSpan={6} className="text-center text-gray-500 text-sm py-8">No payment records yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Feedback Section */}
          {section === "feedback" && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Feedback Forms</h1>
              <div className="space-y-3">
                {(feedbacks ?? []).map(f => (
                  <div key={f.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-400/10 text-purple-400 font-semibold capitalize">{f.category}</span>
                        <h3 className="text-white font-bold mt-2">{f.title}</h3>
                      </div>
                      <span className="text-gray-500 text-xs">{new Date(f.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.message}</p>
                  </div>
                ))}
                {(!feedbacks || feedbacks.length === 0) && <p className="text-gray-500 text-sm text-center py-8">No feedback forms yet. Open a student and use the Feedback tab to send one.</p>}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Student Modal */}
      <AnimatePresence>
        {selectedStudent && admin && (
          <StudentModal student={selectedStudent} token={admin.token} onClose={() => setSelectedStudent(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminDashboard() {
  return <RequireAdmin><AdminDashboardContent /></RequireAdmin>;
}
