import { 
  User, 
  InsertUser, 
  Application, 
  InsertApplication, 
  Document, 
  InsertDocument, 
  Certification, 
  InsertCertification, 
  Firm, 
  InsertFirm,
  users,
  applications,
  documents,
  certifications,
  firms
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Application operations
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByUserId(userId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<Application>): Promise<Application | undefined>;
  
  // Document operations
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByApplicationId(applicationId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<Document>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Certification operations
  getCertification(id: number): Promise<Certification | undefined>;
  getCertificationByApplicationId(applicationId: number): Promise<Certification | undefined>;
  createCertification(certification: InsertCertification): Promise<Certification>;
  
  // Firm operations
  getFirm(id: number): Promise<Firm | undefined>;
  getAllFirms(): Promise<Firm[]>;
  createFirm(firm: InsertFirm): Promise<Firm>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private applications: Map<number, Application>;
  private documents: Map<number, Document>;
  private certifications: Map<number, Certification>;
  private firms: Map<number, Firm>;
  
  sessionStore: session.Store;
  
  private userId: number;
  private applicationId: number;
  private documentId: number;
  private certificationId: number;
  private firmId: number;

  constructor() {
    this.users = new Map();
    this.applications = new Map();
    this.documents = new Map();
    this.certifications = new Map();
    this.firms = new Map();
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    this.userId = 1;
    this.applicationId = 1;
    this.documentId = 1;
    this.certificationId = 1;
    this.firmId = 1;
    
    // Add some initial firms
    this.createFirm({
      name: "EcoConsult UAE",
      specialization: "PBRS Certification",
      description: "Leading consultancy specializing in Pearl Building Rating System certifications",
      contactEmail: "info@ecoconsult.ae",
      contactPhone: "+971-2-555-1234",
      website: "https://ecoconsult.ae"
    });
    
    this.createFirm({
      name: "Green Solutions LLC",
      specialization: "Public Realm Certification",
      description: "Expert consultants for sustainable public spaces and parks certification",
      contactEmail: "contact@greensolutions.ae",
      contactPhone: "+971-2-555-5678",
      website: "https://greensolutions.ae"
    });
    
    this.createFirm({
      name: "Villa Sustainability Services",
      specialization: "PVRS Certification",
      description: "Specialized in Pearl Villa Rating System certification for residential properties",
      contactEmail: "support@villasustain.ae",
      contactPhone: "+971-2-555-9012",
      website: "https://villasustain.ae"
    });
    
    // Create admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      name: "Admin User",
      email: "admin@greenguard.com",
      role: "admin"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // Application operations
  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }
  
  async getApplicationsByUserId(userId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (application) => application.userId === userId,
    );
  }
  
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.applicationId++;
    const now = new Date();
    const application: Application = {
      ...insertApplication,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.applications.set(id, application);
    return application;
  }
  
  async updateApplication(id: number, applicationUpdate: Partial<Application>): Promise<Application | undefined> {
    const application = this.applications.get(id);
    if (!application) {
      return undefined;
    }
    
    const updatedApplication: Application = {
      ...application,
      ...applicationUpdate,
      updatedAt: new Date()
    };
    
    this.applications.set(id, updatedApplication);
    return updatedApplication;
  }
  
  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getDocumentsByApplicationId(applicationId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.applicationId === applicationId,
    );
  }
  
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const now = new Date();
    const document: Document = {
      ...insertDocument,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.documents.set(id, document);
    return document;
  }
  
  async updateDocument(id: number, documentUpdate: Partial<Document>): Promise<Document | undefined> {
    const document = this.documents.get(id);
    if (!document) {
      return undefined;
    }
    
    const updatedDocument: Document = {
      ...document,
      ...documentUpdate,
      updatedAt: new Date()
    };
    
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }
  
  // Certification operations
  async getCertification(id: number): Promise<Certification | undefined> {
    return this.certifications.get(id);
  }
  
  async getCertificationByApplicationId(applicationId: number): Promise<Certification | undefined> {
    return Array.from(this.certifications.values()).find(
      (certification) => certification.applicationId === applicationId,
    );
  }
  
  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const id = this.certificationId++;
    const now = new Date();
    const certification: Certification = {
      ...insertCertification,
      id,
      issuedAt: now
    };
    this.certifications.set(id, certification);
    return certification;
  }
  
  // Firm operations
  async getFirm(id: number): Promise<Firm | undefined> {
    return this.firms.get(id);
  }
  
  async getAllFirms(): Promise<Firm[]> {
    return Array.from(this.firms.values());
  }
  
  async createFirm(insertFirm: InsertFirm): Promise<Firm> {
    const id = this.firmId++;
    const firm: Firm = {
      ...insertFirm,
      id
    };
    this.firms.set(id, firm);
    return firm;
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const PostgresSessionStore = connectPg(session);
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true 
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Application operations
  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }
  
  async getApplicationsByUserId(userId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.userId, userId));
  }
  
  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const [application] = await db
      .insert(applications)
      .values(insertApplication)
      .returning();
    return application;
  }
  
  async updateApplication(id: number, applicationUpdate: Partial<Application>): Promise<Application | undefined> {
    const [updatedApplication] = await db
      .update(applications)
      .set(applicationUpdate)
      .where(eq(applications.id, id))
      .returning();
    return updatedApplication;
  }
  
  // Document operations
  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }
  
  async getDocumentsByApplicationId(applicationId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.applicationId, applicationId));
  }
  
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }
  
  async updateDocument(id: number, documentUpdate: Partial<Document>): Promise<Document | undefined> {
    const [updatedDocument] = await db
      .update(documents)
      .set(documentUpdate)
      .where(eq(documents.id, id))
      .returning();
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    await db.delete(documents).where(eq(documents.id, id));
    return true;
  }
  
  // Certification operations
  async getCertification(id: number): Promise<Certification | undefined> {
    const [certification] = await db.select().from(certifications).where(eq(certifications.id, id));
    return certification;
  }
  
  async getCertificationByApplicationId(applicationId: number): Promise<Certification | undefined> {
    const [certification] = await db
      .select()
      .from(certifications)
      .where(eq(certifications.applicationId, applicationId));
    return certification;
  }
  
  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const [certification] = await db
      .insert(certifications)
      .values(insertCertification)
      .returning();
    return certification;
  }
  
  // Firm operations
  async getFirm(id: number): Promise<Firm | undefined> {
    const [firm] = await db.select().from(firms).where(eq(firms.id, id));
    return firm;
  }
  
  async getAllFirms(): Promise<Firm[]> {
    return await db.select().from(firms);
  }
  
  async createFirm(insertFirm: InsertFirm): Promise<Firm> {
    const [firm] = await db
      .insert(firms)
      .values(insertFirm)
      .returning();
    return firm;
  }
}

// Use the DatabaseStorage implementation instead of MemStorage
export const storage = new DatabaseStorage();
