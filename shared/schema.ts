import { mysqlTable, varchar, int, text, timestamp, json, mysqlEnum } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  role: mysqlEnum("role", ["user", "admin"]).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  company: true,
  role: true,
});

// Applications table
export const applications = mysqlTable("applications", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  projectName: varchar("project_name", { length: 255 }).notNull(),
  projectType: varchar("project_type", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["draft", "pending", "in_progress", "approved", "rejected", "needs_info"])
    .notNull()
    .default("draft"),
  progress: int("progress").notNull().default(0),
  currentStep: mysqlEnum("current_step", ["requirements", "upload", "feedback", "submitted"])
    .notNull()
    .default("requirements"),
  feedbackMessage: text("feedback_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertApplicationSchema = createInsertSchema(applications).pick({
  userId: true,
  projectName: true,
  projectType: true,
  status: true,
  progress: true,
  currentStep: true,
  feedbackMessage: true,
});

// Documents table
export const documents = mysqlTable("documents", {
  id: int("id").primaryKey().autoincrement(),
  applicationId: int("application_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  fileUrl: varchar("file_url", { length: 1000 }).notNull(),
  fileType: varchar("file_type", { length: 50 }).notNull(),
  status: mysqlEnum("status", ["pending", "reviewed", "approved", "rejected"])
    .notNull()
    .default("pending"),
  feedback: json("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).pick({
  applicationId: true,
  name: true,
  description: true,
  fileUrl: true,
  fileType: true,
  status: true,
  feedback: true,
});

// Certifications table
export const certifications = mysqlTable("certifications", {
  id: int("id").primaryKey().autoincrement(),
  applicationId: int("application_id").notNull(),
  score: int("score").notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  feedback: text("feedback"),
  pdfUrl: varchar("pdf_url", { length: 1000 }),
  issuedAt: timestamp("issued_at").defaultNow(),
});

export const insertCertificationSchema = createInsertSchema(certifications).pick({
  applicationId: true,
  score: true,
  level: true,
  feedback: true,
  pdfUrl: true,
});

// Firms table
export const firms = mysqlTable("firms", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  specialization: varchar("specialization", { length: 255 }).notNull(),
  description: text("description"),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactPhone: varchar("contact_phone", { length: 50 }),
  website: varchar("website", { length: 255 }),
});

export const insertFirmSchema = createInsertSchema(firms).pick({
  name: true,
  specialization: true,
  description: true,
  contactEmail: true,
  contactPhone: true,
  website: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type Certification = typeof certifications.$inferSelect;
export type InsertCertification = z.infer<typeof insertCertificationSchema>;

export type Firm = typeof firms.$inferSelect;
export type InsertFirm = z.infer<typeof insertFirmSchema>;
