import { Router, type IRouter } from "express";
import { db, studentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/students", async (req, res) => {
  try {
    const students = await db
      .select({
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
        upcomingClasses: studentsTable.upcomingClasses,
        createdAt: studentsTable.createdAt,
      })
      .from(studentsTable)
      .orderBy(studentsTable.createdAt);
    res.json(students);
  } catch (err) {
    req.log.error({ err }, "Failed to list students");
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

router.get("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid student ID" });

    const [student] = await db
      .select({
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
        upcomingClasses: studentsTable.upcomingClasses,
        createdAt: studentsTable.createdAt,
      })
      .from(studentsTable)
      .where(eq(studentsTable.id, id));

    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    req.log.error({ err }, "Failed to get student");
    res.status(500).json({ error: "Failed to fetch student" });
  }
});

router.post("/students/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [student] = await db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.email, email.toLowerCase().trim()));

    if (!student) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      id: student.id,
      studentCode: student.studentCode,
      name: student.name,
      email: student.email,
      avatar: student.avatar,
      grade: student.grade,
      streak: student.streak,
      totalClasses: student.totalClasses,
      completedClasses: student.completedClasses,
      joinedDate: student.joinedDate,
      enrolledCourses: student.enrolledCourses,
      certificates: student.certificates,
      upcomingClasses: student.upcomingClasses,
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/students", async (req, res) => {
  try {
    const { name, email, password, grade } = req.body as {
      name: string; email: string; password: string; grade: string;
    };
    if (!name || !email || !password || !grade) {
      return res.status(400).json({ error: "Name, email, password, and grade are required" });
    }

    const existing = await db
      .select({ id: studentsTable.id })
      .from(studentsTable)
      .where(eq(studentsTable.email, email.toLowerCase().trim()));

    if (existing.length > 0) {
      return res.status(409).json({ error: "A student with this email already exists" });
    }

    const studentCode = `student-${name.toLowerCase().replace(/\s+/g, "-")}-${new Date().getFullYear()}`;

    const [newStudent] = await db
      .insert(studentsTable)
      .values({
        studentCode,
        name,
        email: email.toLowerCase().trim(),
        passwordHash: password,
        grade,
        joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        enrolledCourses: [],
        certificates: [],
        upcomingClasses: [],
      })
      .returning({
        id: studentsTable.id,
        studentCode: studentsTable.studentCode,
        name: studentsTable.name,
        email: studentsTable.email,
        grade: studentsTable.grade,
      });

    res.status(201).json(newStudent);
  } catch (err) {
    req.log.error({ err }, "Failed to create student");
    res.status(500).json({ error: "Failed to create student" });
  }
});

router.put("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid student ID" });

    const updates = req.body as Partial<{
      name: string;
      grade: string;
      streak: number;
      totalClasses: number;
      completedClasses: number;
      enrolledCourses: unknown[];
      certificates: unknown[];
      upcomingClasses: unknown[];
    }>;

    const [updated] = await db
      .update(studentsTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(studentsTable.id, id))
      .returning({ id: studentsTable.id, name: studentsTable.name });

    if (!updated) return res.status(404).json({ error: "Student not found" });
    res.json({ success: true, student: updated });
  } catch (err) {
    req.log.error({ err }, "Failed to update student");
    res.status(500).json({ error: "Failed to update student" });
  }
});

router.delete("/students/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid student ID" });

    const [deleted] = await db
      .delete(studentsTable)
      .where(eq(studentsTable.id, id))
      .returning({ id: studentsTable.id });

    if (!deleted) return res.status(404).json({ error: "Student not found" });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete student");
    res.status(500).json({ error: "Failed to delete student" });
  }
});

export default router;
