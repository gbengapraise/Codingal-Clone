import { pgTable, serial, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

export const adminsTable = pgTable("admins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const magicTokensTable = pgTable("magic_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  studentId: integer("student_id").notNull(),
  expiresAt: timestamp("expires_at"),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studentProjectsTable = pgTable("student_projects", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
  thumbnail: text("thumbnail"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const studentQuizzesTable = pgTable("student_quizzes", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  questions: jsonb("questions").$type<{
    question: string;
    options: string[];
    correctIndex: number;
  }[]>().notNull().default([]),
  dueDate: text("due_date"),
  completed: boolean("completed").notNull().default(false),
  score: integer("score"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const paymentLogsTable = pgTable("payment_logs", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id"),
  studentName: text("student_name").notNull(),
  parentEmail: text("parent_email").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("USD"),
  description: text("description").notNull(),
  status: text("status").notNull().default("completed"),
  reference: text("reference"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const feedbackFormsTable = pgTable("feedback_forms", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  rating: integer("rating"),
  category: text("category").notNull().default("general"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Admin = typeof adminsTable.$inferSelect;
export type MagicToken = typeof magicTokensTable.$inferSelect;
export type StudentProject = typeof studentProjectsTable.$inferSelect;
export type StudentQuiz = typeof studentQuizzesTable.$inferSelect;
export type PaymentLog = typeof paymentLogsTable.$inferSelect;
export type FeedbackForm = typeof feedbackFormsTable.$inferSelect;
