import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  adminsTable, studentsTable, magicTokensTable,
  studentProjectsTable, studentQuizzesTable,
  paymentLogsTable, feedbackFormsTable,
} from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { randomBytes } from "crypto";

const router: IRouter = Router();

// ─── Simple token store (in-memory, resets on server restart) ──────────────
const activeSessions = new Map<string, number>(); // token → adminId

function genToken() { return randomBytes(32).toString("hex"); }

function requireAdminSession(req: any, res: any, next: any) {
  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || !activeSessions.has(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.adminId = activeSessions.get(token);
  next();
}

// ─── Auth ──────────────────────────────────────────────────────────────────

router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ error: "Email and password required" });

  const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.email, email.toLowerCase().trim()));
  if (!admin || admin.passwordHash !== password) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = genToken();
  activeSessions.set(token, admin.id);
  res.json({ id: admin.id, name: admin.name, email: admin.email, token });
});

router.post("/admin/logout", requireAdminSession, (req: any, res) => {
  const token = req.headers.authorization?.slice(7) ?? "";
  activeSessions.delete(token);
  res.json({ success: true });
});

// ─── Students ──────────────────────────────────────────────────────────────

router.get("/admin/students", requireAdminSession, async (req, res) => {
  const students = await db.select({
    id: studentsTable.id,
    studentCode: studentsTable.studentCode,
    name: studentsTable.name,
    email: studentsTable.email,
    avatar: studentsTable.avatar,
    grade: studentsTable.grade,
    streak: studentsTable.streak,
    totalClasses: studentsTable.totalClasses,
    completedClasses: studentsTable.completedClasses,
    joinedDate: studentsTable.joinedDate,
    enrolledCourses: studentsTable.enrolledCourses,
    certificates: studentsTable.certificates,
    badges: studentsTable.badges,
    learningCredits: studentsTable.learningCredits,
    createdAt: studentsTable.createdAt,
  }).from(studentsTable).orderBy(desc(studentsTable.createdAt));
  res.json(students);
});

router.get("/admin/students/:id", requireAdminSession, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const [student] = await db.select().from(studentsTable).where(eq(studentsTable.id, id));
  if (!student) return res.status(404).json({ error: "Not found" });

  const [projects, quizzes, payments, feedbacks] = await Promise.all([
    db.select().from(studentProjectsTable).where(eq(studentProjectsTable.studentId, id)).orderBy(desc(studentProjectsTable.createdAt)),
    db.select().from(studentQuizzesTable).where(eq(studentQuizzesTable.studentId, id)).orderBy(desc(studentQuizzesTable.createdAt)),
    db.select().from(paymentLogsTable).where(eq(paymentLogsTable.studentId, id)).orderBy(desc(paymentLogsTable.createdAt)),
    db.select().from(feedbackFormsTable).where(eq(feedbackFormsTable.studentId, id)).orderBy(desc(feedbackFormsTable.createdAt)),
  ]);

  res.json({ ...student, projects, quizzes, payments, feedbacks });
});

// ─── Badges ────────────────────────────────────────────────────────────────

router.post("/admin/students/:id/badges", requireAdminSession, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description, icon, color } = req.body as { name: string; description?: string; icon?: string; color?: string };
  if (!name) return res.status(400).json({ error: "Badge name required" });

  const [student] = await db.select({ badges: studentsTable.badges }).from(studentsTable).where(eq(studentsTable.id, id));
  if (!student) return res.status(404).json({ error: "Student not found" });

  const existing = (student.badges as any[]) ?? [];
  const newBadge = { id: genToken().slice(0, 8), name, description: description ?? "", icon: icon ?? "🏆", color: color ?? "bg-yellow-400", awardedAt: new Date().toISOString() };
  const updated = [...existing, newBadge];

  await db.update(studentsTable).set({ badges: updated, updatedAt: new Date() }).where(eq(studentsTable.id, id));
  res.json({ success: true, badge: newBadge });
});

router.delete("/admin/students/:id/badges/:badgeId", requireAdminSession, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const [student] = await db.select({ badges: studentsTable.badges }).from(studentsTable).where(eq(studentsTable.id, id));
  if (!student) return res.status(404).json({ error: "Student not found" });
  const updated = ((student.badges as any[]) ?? []).filter((b: any) => b.id !== req.params.badgeId);
  await db.update(studentsTable).set({ badges: updated, updatedAt: new Date() }).where(eq(studentsTable.id, id));
  res.json({ success: true });
});

// ─── Certificates ──────────────────────────────────────────────────────────

router.post("/admin/students/:id/certificates", requireAdminSession, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, course, date } = req.body as { name: string; course: string; date?: string };
  if (!name || !course) return res.status(400).json({ error: "Name and course required" });

  const [student] = await db.select({ certificates: studentsTable.certificates }).from(studentsTable).where(eq(studentsTable.id, id));
  if (!student) return res.status(404).json({ error: "Student not found" });

  const cert = { name, course, date: date ?? new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) };
  const updated = [...((student.certificates as any[]) ?? []), cert];
  await db.update(studentsTable).set({ certificates: updated, updatedAt: new Date() }).where(eq(studentsTable.id, id));
  res.json({ success: true, certificate: cert });
});

// ─── Learning Credits ──────────────────────────────────────────────────────

router.post("/admin/students/:id/credits", requireAdminSession, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { amount, description } = req.body as { amount: number; description?: string };
  if (typeof amount !== "number") return res.status(400).json({ error: "Amount required" });

  const [student] = await db.select({ learningCredits: studentsTable.learningCredits }).from(studentsTable).where(eq(studentsTable.id, id));
  if (!student) return res.status(404).json({ error: "Student not found" });

  const newCredits = (student.learningCredits ?? 0) + amount;
  await db.update(studentsTable).set({ learningCredits: newCredits, updatedAt: new Date() }).where(eq(studentsTable.id, id));
  res.json({ success: true, learningCredits: newCredits });
});

// Mark a class as completed: increments completedClasses, deducts 1 credit
router.post("/admin/students/:id/complete-class", requireAdminSession, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const [student] = await db.select({
    completedClasses: studentsTable.completedClasses,
    totalClasses: studentsTable.totalClasses,
    learningCredits: studentsTable.learningCredits,
  }).from(studentsTable).where(eq(studentsTable.id, id));

  if (!student) return res.status(404).json({ error: "Student not found" });

  const newCompleted = (student.completedClasses ?? 0) + 1;
  const currentCredits = student.learningCredits ?? 0;
  const newCredits = Math.max(0, currentCredits - 1);

  await db.update(studentsTable).set({
    completedClasses: newCompleted,
    learningCredits: newCredits,
    updatedAt: new Date(),
  }).where(eq(studentsTable.id, id));

  res.json({ success: true, completedClasses: newCompleted, learningCredits: newCredits });
});

// ─── Projects ──────────────────────────────────────────────────────────────

router.post("/admin/students/:id/projects", requireAdminSession, async (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const { title, description, fileUrl, thumbnail, tags } = req.body as {
    title: string; description?: string; fileUrl?: string; thumbnail?: string; tags?: string[];
  };
  if (!title) return res.status(400).json({ error: "Title required" });

  const [project] = await db.insert(studentProjectsTable).values({
    studentId, title, description, fileUrl, thumbnail, tags: tags ?? [],
  }).returning();
  res.status(201).json(project);
});

router.delete("/admin/students/:id/projects/:projectId", requireAdminSession, async (req, res) => {
  await db.delete(studentProjectsTable).where(eq(studentProjectsTable.id, parseInt(req.params.projectId)));
  res.json({ success: true });
});

// ─── Quizzes ───────────────────────────────────────────────────────────────

router.post("/admin/students/:id/quizzes", requireAdminSession, async (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const { title, description, questions, dueDate } = req.body as {
    title: string; description?: string; dueDate?: string;
    questions?: { question: string; options: string[]; correctIndex: number }[];
  };
  if (!title) return res.status(400).json({ error: "Title required" });

  const [quiz] = await db.insert(studentQuizzesTable).values({
    studentId, title, description, questions: questions ?? [], dueDate,
  }).returning();
  res.status(201).json(quiz);
});

router.delete("/admin/students/:id/quizzes/:quizId", requireAdminSession, async (req, res) => {
  await db.delete(studentQuizzesTable).where(eq(studentQuizzesTable.id, parseInt(req.params.quizId)));
  res.json({ success: true });
});

// ─── Magic Login Link ──────────────────────────────────────────────────────

router.post("/admin/students/:id/magic-link", requireAdminSession, async (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  const [student] = await db.select({ id: studentsTable.id, name: studentsTable.name }).from(studentsTable).where(eq(studentsTable.id, studentId));
  if (!student) return res.status(404).json({ error: "Student not found" });

  const token = randomBytes(20).toString("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  await db.insert(magicTokensTable).values({ token, studentId, expiresAt });

  const domain = process.env.REPLIT_DEV_DOMAIN ?? "localhost";
  const link = `https://${domain}/magic/${token}`;
  res.json({ success: true, token, link, expiresAt });
});

// ─── Magic Token Login (for students) ─────────────────────────────────────

router.get("/magic/:token", async (req, res) => {
  const { token } = req.params;
  const [record] = await db.select().from(magicTokensTable).where(eq(magicTokensTable.token, token));

  if (!record) return res.status(404).json({ error: "Invalid or expired link" });
  if (record.expiresAt && new Date() > record.expiresAt) return res.status(410).json({ error: "Link has expired" });

  const [student] = await db.select({
    id: studentsTable.id,
    studentCode: studentsTable.studentCode,
    name: studentsTable.name,
    email: studentsTable.email,
    avatar: studentsTable.avatar,
    grade: studentsTable.grade,
    streak: studentsTable.streak,
    totalClasses: studentsTable.totalClasses,
    completedClasses: studentsTable.completedClasses,
    joinedDate: studentsTable.joinedDate,
    enrolledCourses: studentsTable.enrolledCourses,
    certificates: studentsTable.certificates,
    badges: studentsTable.badges,
    learningCredits: studentsTable.learningCredits,
    upcomingClasses: studentsTable.upcomingClasses,
  }).from(studentsTable).where(eq(studentsTable.id, record.studentId));

  if (!student) return res.status(404).json({ error: "Student not found" });

  await db.update(magicTokensTable).set({ usedAt: new Date() }).where(eq(magicTokensTable.token, token));

  res.json({ student });
});

// ─── Payment Logs ─────────────────────────────────────────────────────────

router.get("/admin/payment-logs", requireAdminSession, async (req, res) => {
  const logs = await db.select().from(paymentLogsTable).orderBy(desc(paymentLogsTable.createdAt));
  res.json(logs);
});

router.post("/admin/payment-logs", requireAdminSession, async (req, res) => {
  const { studentId, studentName, parentEmail, amount, currency, description, status, reference } = req.body as {
    studentId?: number; studentName: string; parentEmail: string; amount: number;
    currency?: string; description: string; status?: string; reference?: string;
  };
  if (!studentName || !parentEmail || !amount || !description) {
    return res.status(400).json({ error: "studentName, parentEmail, amount and description required" });
  }

  const [log] = await db.insert(paymentLogsTable).values({
    studentId, studentName, parentEmail, amount, currency: currency ?? "USD",
    description, status: status ?? "completed", reference,
  }).returning();
  res.status(201).json(log);
});

// ─── Feedback Forms ────────────────────────────────────────────────────────

router.get("/admin/feedback-forms", requireAdminSession, async (req, res) => {
  const forms = await db.select().from(feedbackFormsTable).orderBy(desc(feedbackFormsTable.createdAt));
  res.json(forms);
});

router.post("/admin/feedback-forms", requireAdminSession, async (req, res) => {
  const { studentId, title, message, category } = req.body as {
    studentId: number; title: string; message: string; category?: string;
  };
  if (!studentId || !title || !message) return res.status(400).json({ error: "studentId, title and message required" });

  const [form] = await db.insert(feedbackFormsTable).values({
    studentId, title, message, category: category ?? "general",
  }).returning();
  res.status(201).json(form);
});

router.delete("/admin/feedback-forms/:id", requireAdminSession, async (req, res) => {
  await db.delete(feedbackFormsTable).where(eq(feedbackFormsTable.id, parseInt(req.params.id)));
  res.json({ success: true });
});

// ─── Stats ─────────────────────────────────────────────────────────────────

router.get("/admin/stats", requireAdminSession, async (req, res) => {
  const [studentCount] = await db.select({ count: sql<number>`count(*)` }).from(studentsTable);
  const [paymentCount] = await db.select({ count: sql<number>`count(*)`, total: sql<number>`sum(amount)` }).from(paymentLogsTable);
  const [bookingCount] = await db.select({ count: sql<number>`count(*)` }).from(db.$with("b").as(db.select().from(studentProjectsTable)));

  res.json({
    totalStudents: Number(studentCount?.count ?? 0),
    totalRevenue: Number(paymentCount?.total ?? 0),
    totalPayments: Number(paymentCount?.count ?? 0),
  });
});

export default router;
