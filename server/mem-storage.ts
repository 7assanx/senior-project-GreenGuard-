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
} from "@shared/schema";
import { sessionStore } from "./db";
import session from "express-session";
import { IStorage } from "./storage";

// In-memory storage implementation
export class MemStorage implements IStorage {
  sessionStore: session.Store;
  private users: User[] = [];
  private applications: Application[] = [];
  private documents: Document[] = [];
  private certifications: Certification[] = [];
  private firms: Firm[] = [];
  private nextIds = {
    user: 1,
    application: 1,
    document: 1,
    certification: 1,
    firm: 1
  };

  constructor() {
    this.sessionStore = sessionStore;
    
    // Add default admin user
    this.users.push({
      id: this.nextIds.user++,
      username: 'admin',
      password: '$2b$10$3fJ4ouqOUHukQU2hRcJcTuw0/EoZh1PwnRz2nVE5AdnD5qOQ9h2p2', // admin123
      name: 'Admin User',
      email: 'admin@example.com',
      company: null,
      role: 'admin',
      createdAt: new Date()
    });
    
    // Add a demo user
    this.users.push({
      id: this.nextIds.user++,
      username: 'user',
      password: '$2b$10$3fJ4ouqOUHukQU2hRcJcTuw0/EoZh1PwnRz2nVE5AdnD5qOQ9h2p2', // admin123
      name: 'Demo User',
      email: 'user@example.com',
      company: 'Demo Company',
      role: 'user',
      createdAt: new Date()
    });
    
    // Add sample firms
    this.firms.push({
      id: this.nextIds.firm++,
      name: 'Green Building Consultants',
      specialization: 'PBRS Certification',
      description: 'Specialists in sustainable building design and Pearl certification.',
      contactEmail: 'info@greenbuilding.com',
      contactPhone: '+971-55-123-4567',
      website: 'https://www.greenbuilding.com'
    });
    
    this.firms.push({
      id: this.nextIds.firm++,
      name: 'Sustainable Architecture LLC',
      specialization: 'Sustainable Design',
      description: 'Award-winning sustainable architecture and design firm.',
      contactEmail: 'contact@sustainablearchitecture.com',
      contactPhone: '+971-55-987-6543',
      website: 'https://www.sustainablearchitecture.com'
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = {
      ...insertUser,
      id: this.nextIds.user++,
      createdAt: new Date()
    } as User;
    this.users.push(user);
    return user;
  }

  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.find(app => app.id === id);
  }

  async getApplicationsByUserId(userId: number): Promise<Application[]> {
    return this.applications.filter(app => app.userId === userId);
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const application = {
      ...insertApplication,
      id: this.nextIds.application++,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Application;
    this.applications.push(application);
    return application;
  }

  async updateApplication(id: number, applicationUpdate: Partial<Application>): Promise<Application | undefined> {
    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) return undefined;
    
    const updatedApplication = {
      ...this.applications[index],
      ...applicationUpdate,
      updatedAt: new Date()
    };
    this.applications[index] = updatedApplication;
    return updatedApplication;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.find(doc => doc.id === id);
  }

  async getDocumentsByApplicationId(applicationId: number): Promise<Document[]> {
    return this.documents.filter(doc => doc.applicationId === applicationId);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const document = {
      ...insertDocument,
      id: this.nextIds.document++,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Document;
    this.documents.push(document);
    return document;
  }

  async updateDocument(id: number, documentUpdate: Partial<Document>): Promise<Document | undefined> {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) return undefined;
    
    const updatedDocument = {
      ...this.documents[index],
      ...documentUpdate,
      updatedAt: new Date()
    };
    this.documents[index] = updatedDocument;
    return updatedDocument;
  }

  async deleteDocument(id: number): Promise<boolean> {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index === -1) return false;
    
    this.documents.splice(index, 1);
    return true;
  }

  async getCertification(id: number): Promise<Certification | undefined> {
    return this.certifications.find(cert => cert.id === id);
  }

  async getCertificationByApplicationId(applicationId: number): Promise<Certification | undefined> {
    return this.certifications.find(cert => cert.applicationId === applicationId);
  }

  async createCertification(insertCertification: InsertCertification): Promise<Certification> {
    const certification = {
      ...insertCertification,
      id: this.nextIds.certification++,
      issuedAt: new Date()
    } as Certification;
    this.certifications.push(certification);
    return certification;
  }

  async getFirm(id: number): Promise<Firm | undefined> {
    return this.firms.find(firm => firm.id === id);
  }

  async getAllFirms(): Promise<Firm[]> {
    return [...this.firms];
  }

  async createFirm(insertFirm: InsertFirm): Promise<Firm> {
    const firm = {
      ...insertFirm,
      id: this.nextIds.firm++
    } as Firm;
    this.firms.push(firm);
    return firm;
  }
}