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
import { db, pool } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import MemoryStore from 'memorystore';

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

// Database storage only - no more in-memory storage

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    const MemoryStoreClass = MemoryStore(session);
    this.sessionStore = new MemoryStoreClass({
      checkPeriod: 86400000 // prune expired entries every 24h
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
    // MySQL doesn't support returning clause, so we insert and then get the record
    const result = await db
      .insert(users)
      .values(insertUser);
    
    // Use type assertion to access insertId from MySQL result
    const id = Number((result as any).insertId);
    const [user] = await db.select().from(users).where(eq(users.id, id));
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
    // MySQL doesn't support returning clause, so we insert and then get the record
    const result = await db
      .insert(applications)
      .values(insertApplication);
      
    // Use type assertion to access insertId from MySQL result
    const id = Number((result as any).insertId);
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }
  
  async updateApplication(id: number, applicationUpdate: Partial<Application>): Promise<Application | undefined> {
    // Ensure we have valid data by handling potential field issues
    const safeUpdate: Record<string, any> = {};
    
    // Only copy fields that are defined and not undefined/null
    if (applicationUpdate.status !== undefined) safeUpdate.status = applicationUpdate.status;
    if (applicationUpdate.currentStep !== undefined) safeUpdate.currentStep = applicationUpdate.currentStep;
    if (applicationUpdate.feedbackMessage !== undefined) safeUpdate.feedbackMessage = applicationUpdate.feedbackMessage;
    
    // Ensure progress is always an integer
    if (applicationUpdate.progress !== undefined) {
      // Round any decimal values to integers
      safeUpdate.progress = Math.round(Number(applicationUpdate.progress));
      console.log('Processed progress value:', applicationUpdate.progress, '→', safeUpdate.progress);
    }
    
    // Always update the updatedAt timestamp
    safeUpdate.updatedAt = new Date();
    
    try {
      console.log('Updating application', id, 'with data:', safeUpdate);
      
      // MySQL doesn't support returning clause, so we update and then get the record
      await db
        .update(applications)
        .set(safeUpdate)
        .where(eq(applications.id, id));
      
      // Get the updated record
      const [updatedApplication] = await db
        .select()
        .from(applications)
        .where(eq(applications.id, id));
        
      console.log('Application updated successfully:', updatedApplication);
      return updatedApplication;
    } catch (error) {
      console.error('Failed to update application:', error);
      throw error;
    }
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
    // MySQL doesn't support returning clause, so we insert and then get the record
    const result = await db
      .insert(documents)
      .values(insertDocument);
      
    // Use type assertion to access insertId from MySQL result
    const id = Number((result as any).insertId);
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }
  
  async updateDocument(id: number, documentUpdate: Partial<Document>): Promise<Document | undefined> {
    // Ensure we have valid data by handling potential field issues
    const safeUpdate: Record<string, any> = {};
    
    // Only copy fields that are defined and not undefined
    if (documentUpdate.name !== undefined) safeUpdate.name = documentUpdate.name;
    if (documentUpdate.description !== undefined) safeUpdate.description = documentUpdate.description;
    if (documentUpdate.fileUrl !== undefined) safeUpdate.fileUrl = documentUpdate.fileUrl;
    if (documentUpdate.fileType !== undefined) safeUpdate.fileType = documentUpdate.fileType;
    if (documentUpdate.status !== undefined) safeUpdate.status = documentUpdate.status;
    if (documentUpdate.feedback !== undefined) safeUpdate.feedback = documentUpdate.feedback;
    
    // Always update the updatedAt timestamp
    safeUpdate.updatedAt = new Date();
    
    try {
      console.log('Updating document', id, 'with data:', safeUpdate);
      
      // MySQL doesn't support returning clause, so we update and then get the record
      await db
        .update(documents)
        .set(safeUpdate)
        .where(eq(documents.id, id));
      
      // Get the updated record
      const [updatedDocument] = await db
        .select()
        .from(documents)
        .where(eq(documents.id, id));
      
      console.log('Document updated successfully:', updatedDocument);
      return updatedDocument;
    } catch (error) {
      console.error('Failed to update document:', error);
      throw error;
    }
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
    // MySQL doesn't support returning clause, so we insert and then get the record
    const result = await db
      .insert(certifications)
      .values(insertCertification);
      
    // Use type assertion to access insertId from MySQL result
    const id = Number((result as any).insertId);
    const [certification] = await db.select().from(certifications).where(eq(certifications.id, id));
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
    // MySQL doesn't support returning clause, so we insert and then get the record
    const result = await db
      .insert(firms)
      .values(insertFirm);
      
    // Use type assertion to access insertId from MySQL result
    const id = Number((result as any).insertId);
    const [firm] = await db.select().from(firms).where(eq(firms.id, id));
    return firm;
  }
}

// Use the DatabaseStorage implementation instead of MemStorage
export const storage = new DatabaseStorage();
