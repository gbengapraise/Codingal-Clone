import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const enrolledCourseSchema = z.object({
  id: z.string(),
  name: z.string(),
  progress: z.number(),
  nextClass: z.string(),
  teacher: z.string(),
  color: z.string(),
});

export const upcomingClassSchema = z.object({
  date: z.string(),
  time: z.string(),
  course: z.string(),
  teacher: z.string(),
});

export const certificateSchema = z.object({
  name: z.string(),
  date: z.string(),
  course: z.string(),
});

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  studentCode: text("student_code").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatar: text("avatar"),
  grade: text("grade").notNull(),
  streak: integer("streak").notNull().default(0),
  totalClasses: integer("total_classes").notNull().default(0),
  completedClasses: integer("completed_classes").notNull().default(0),
  joinedDate: text("joined_date").notNull(),
  enrolledCourses: jsonb("enrolled_courses").$type<z.infer<typeof enrolledCourseSchema>[]>().notNull().default([]),
  certificates: jsonb("certificates").$type<z.infer<typeof certificateSchema>[]>().notNull().default([]),
  upcomingClasses: jsonb("upcoming_classes").$type<z.infer<typeof upcomingClassSchema>[]>().notNull().default([]),
  badges: jsonb("badges").$type<{ id: string; name: string; description: string; icon: string; color: string; awardedAt: string }[]>().notNull().default([]),
  learningCredits: integer("learning_credits").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
