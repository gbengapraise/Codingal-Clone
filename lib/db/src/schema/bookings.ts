import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  childName: text("child_name").notNull(),
  parentEmail: text("parent_email").notNull(),
  phone: text("phone").notNull(),
  grade: text("grade").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Booking = typeof bookingsTable.$inferSelect;
