import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  role: text("role").notNull().default("user"),
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
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  projectName: text("project_name").notNull(),
  projectType: text("project_type").notNull(),
  status: text("status").notNull().default("draft"),
  progress: integer("progress").notNull().default(0),
  currentStep: text("current_step").notNull().default("requirements"),
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
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  status: text("status").notNull().default("pending"),
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
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  applicationId: integer("application_id").notNull(),
  score: integer("score").notNull(),
  level: text("level").notNull(),
  feedback: text("feedback"),
  pdfUrl: text("pdf_url"),
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
export const firms = pgTable("firms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialization: text("specialization").notNull(),
  description: text("description"),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  website: text("website"),
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
