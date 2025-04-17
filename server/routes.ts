import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertApplicationSchema, insertDocumentSchema, insertCertificationSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session handling middleware
  app.use(
    session({
      secret: "green-guard-secret",
      resave: false,
      saveUninitialized: false, // Changed from true to false
      cookie: { 
        secure: false, // Set to false for development, true in production
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        path: '/'
      },
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Authentication middleware
  const authenticate = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Admin middleware
  const isAdmin = async (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    next();
  };
  
  // Test route to verify HTML rendering
  app.get('/test', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Green Guard Test Page</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; background: #f0f8f0; padding: 20px; border-radius: 8px; }
            h1 { color: #10B981; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Green Guard Test Page</h1>
            <p>If you can see this page, the server is working correctly.</p>
            <p>Try accessing <a href="/">/</a> (home page) or <a href="/login">/login</a> (login page) next.</p>
          </div>
        </body>
      </html>
    `);
  });

  // USER ROUTES
  
  // Register new user
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      // Set the user session
      (req.session as any).userId = user.id;
      
      // Save the session explicitly
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  // Login
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string()
      }).parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Set the user session
      (req.session as any).userId = user.id;
      
      // Save the session explicitly
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Get current user
  app.get("/api/me", authenticate, async (req, res) => {
    try {
      const user = await storage.getUser((req.session as any).userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user information" });
    }
  });
  
  // Logout
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  // APPLICATION ROUTES
  
  // Get user applications
  app.get("/api/applications", authenticate, async (req, res) => {
    try {
      const applications = await storage.getApplicationsByUserId((req.session as any).userId);
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  
  // Create application
  app.post("/api/applications", authenticate, async (req, res) => {
    try {
      const applicationData = {
        ...insertApplicationSchema.parse(req.body),
        userId: (req.session as any).userId
      };
      
      const application = await storage.createApplication(applicationData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create application" });
    }
  });
  
  // Get single application
  app.get("/api/applications/:id", authenticate, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user owns the application or is admin
      const user = await storage.getUser((req.session as any).userId);
      if (application.userId !== (req.session as any).userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });
  
  // Update application
  app.patch("/api/applications/:id", authenticate, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user owns the application or is admin
      const user = await storage.getUser((req.session as any).userId);
      if (application.userId !== (req.session as any).userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const updateSchema = z.object({
        projectName: z.string().optional(),
        projectType: z.string().optional(),
        status: z.string().optional(),
        progress: z.number().optional(),
        currentStep: z.string().optional()
      });
      
      const applicationUpdate = updateSchema.parse(req.body);
      const updatedApplication = await storage.updateApplication(applicationId, applicationUpdate);
      
      res.json(updatedApplication);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to update application" });
    }
  });
  
  // DOCUMENT ROUTES
  
  // Get documents for an application
  app.get("/api/applications/:id/documents", authenticate, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user owns the application or is admin
      const user = await storage.getUser((req.session as any).userId);
      if (application.userId !== (req.session as any).userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const documents = await storage.getDocumentsByApplicationId(applicationId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  
  // Upload document
  app.post("/api/applications/:id/documents", authenticate, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user owns the application
      if (application.userId !== (req.session as any).userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Create a custom validation schema without requiring applicationId in body
      const uploadDocumentSchema = z.object({
        name: z.string(),
        description: z.string().optional(),
        fileUrl: z.string(),
        fileType: z.string(),
        status: z.string().default("pending"),
        feedback: z.any().optional()
      });
      
      const documentData = {
        ...uploadDocumentSchema.parse(req.body),
        applicationId
      };
      
      const document = await storage.createDocument(documentData);
      
      // Update application progress
      const allDocuments = await storage.getDocumentsByApplicationId(applicationId);
      // Assume each document represents a step in progress
      const progress = Math.min(Math.round((allDocuments.length / 12) * 100), 100);
      
      await storage.updateApplication(applicationId, { 
        progress,
        currentStep: "upload",
        updatedAt: new Date()
      });
      
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to upload document" });
    }
  });
  
  // Delete document
  app.delete("/api/documents/:id", authenticate, async (req, res) => {
    try {
      const documentId = parseInt(req.params.id);
      const document = await storage.getDocument(documentId);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Check if user owns the application
      const application = await storage.getApplication(document.applicationId);
      if (!application || application.userId !== (req.session as any).userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const deleted = await storage.deleteDocument(documentId);
      
      if (deleted) {
        // Update application progress
        const allDocuments = await storage.getDocumentsByApplicationId(document.applicationId);
        const progress = Math.min(Math.round((allDocuments.length / 12) * 100), 100);
        
        await storage.updateApplication(document.applicationId, { 
          progress,
          updatedAt: new Date()
        });
        
        res.json({ message: "Document deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete document" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete document" });
    }
  });
  
  // Get AI feedback (GET method to retrieve existing feedback)
  app.get("/api/applications/:id/feedback", authenticate, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user owns the application or is admin
      const user = await storage.getUser((req.session as any).userId);
      if (application.userId !== (req.session as any).userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get the documents for this application
      const documents = await storage.getDocumentsByApplicationId(applicationId);
      
      if (!documents || documents.length === 0) {
        return res.status(400).json({ 
          message: "No documents found", 
          status: "error",
          feedback: [] 
        });
      }
      
      // Collect feedback from documents that have it
      const feedback = documents
        .filter(doc => doc.feedback !== undefined && doc.feedback !== null)
        .map(doc => {
          // Handle different potential feedback formats
          const docFeedback = doc.feedback || {};
          const feedbackObj = typeof docFeedback === 'string' 
            ? JSON.parse(docFeedback as string) 
            : docFeedback;
          
          return {
            documentName: doc.name,
            strengths: Array.isArray(feedbackObj.strengths) ? feedbackObj.strengths : [],
            weaknesses: Array.isArray(feedbackObj.weaknesses) ? feedbackObj.weaknesses : [],
            recommendation: typeof feedbackObj.recommendation === 'string' ? feedbackObj.recommendation : "No recommendation available"
          };
        });
      
      if (feedback.length === 0) {
        return res.json({
          status: "success",
          feedback: []
        });
      }
      
      return res.json({
        status: "success",
        feedback
      });
    } catch (error) {
      console.error("Error getting AI feedback:", error);
      res.status(500).json({ 
        message: "Failed to get feedback", 
        status: "error",
        feedback: []
      });
    }
  });
  
  // Get AI feedback on documents (POST method to generate new feedback)
  app.post("/api/applications/:id/feedback", authenticate, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      const documentIds = req.body.documentIds || []; // Accept specific document IDs
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user owns the application or is admin
      const isAdmin = (req.session as any).userRole === 'admin';
      if (!isAdmin && application.userId !== (req.session as any).userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Get the documents for this application
      let documents = await storage.getDocumentsByApplicationId(applicationId);
      
      if (!documents || documents.length === 0) {
        return res.status(400).json({ 
          message: "No documents found for analysis", 
          status: "error" 
        });
      }
      
      // Filter documents if specific IDs were provided
      if (documentIds.length > 0) {
        documents = documents.filter(doc => documentIds.includes(doc.id));
        if (documents.length === 0) {
          return res.status(400).json({
            message: "Specified documents not found",
            status: "error"
          });
        }
      }
      
      // Import the OpenAI analysis functions
      const { analyzeDocument, getSimulatedDocumentContent } = await import('./openai');
      
      // Process each document with OpenAI
      const feedbackPromises = documents.map(async (doc) => {
        try {
          // In a real app, we would fetch the document content here
          // For this demo, we'll simulate document content based on name
          const simulatedContent = getSimulatedDocumentContent(doc.name);
          
          const analysis = await analyzeDocument({
            name: doc.name,
            content: simulatedContent
          });
          
          return {
            documentName: doc.name,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            recommendation: analysis.recommendation
          };
        } catch (error) {
          console.error(`Error analyzing document ${doc.name}:`, error);
          return {
            documentName: doc.name,
            strengths: ["Document processed"],
            weaknesses: ["Unable to perform detailed analysis with AI at this time"],
            recommendation: "Please ensure document follows Estidama guidelines for proper analysis."
          };
        }
      });
      
      const feedbackResults = await Promise.all(feedbackPromises);
      
      // Update document feedback in storage
      for (const feedback of feedbackResults) {
        const document = documents.find(d => d.name === feedback.documentName);
        if (document) {
          await storage.updateDocument(document.id, {
            feedback: {
              strengths: feedback.strengths,
              weaknesses: feedback.weaknesses,
              recommendation: feedback.recommendation
            },
            status: "reviewed"
          });
        }
      }
      
      // Update application status
      await storage.updateApplication(applicationId, {
        currentStep: "feedback",
        updatedAt: new Date()
      });
      
      res.json({
        status: "success",
        feedback: feedbackResults
      });
    } catch (error) {
      console.error("AI Feedback error:", error);
      res.status(500).json({ 
        message: "Failed to get feedback", 
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Submit application
  app.post("/api/applications/:id/submit", authenticate, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user owns the application
      if (application.userId !== (req.session as any).userId) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      // Check if there are enough documents
      const documents = await storage.getDocumentsByApplicationId(applicationId);
      if (documents.length < 3) { // Arbitrary minimum requirement
        return res.status(400).json({ message: "Not enough documents uploaded" });
      }
      
      // Update application status
      await storage.updateApplication(applicationId, {
        status: "pending",
        currentStep: "submitted",
        updatedAt: new Date()
      });
      
      res.json({ message: "Application submitted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit application" });
    }
  });
  
  // CERTIFICATION ROUTES
  
  // Get certification for an application
  app.get("/api/applications/:id/certification", authenticate, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user owns the application or is admin
      const user = await storage.getUser((req.session as any).userId);
      if (application.userId !== (req.session as any).userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const certification = await storage.getCertificationByApplicationId(applicationId);
      
      if (!certification) {
        return res.status(404).json({ message: "Certification not found" });
      }
      
      res.json(certification);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch certification" });
    }
  });
  
  // Download certification PDF
  app.get("/api/applications/:id/certification/download", authenticate, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      // Check if user owns the application or is admin
      const user = await storage.getUser((req.session as any).userId);
      if (application.userId !== (req.session as any).userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const certification = await storage.getCertificationByApplicationId(applicationId);
      
      if (!certification) {
        return res.status(404).json({ message: "Certification not found" });
      }
      
      // For demo purposes, we'll generate a simple PDF-like response
      const userName = user?.name || "User";
      const projectName = application.projectName;
      const projectType = application.projectType;
      const certLevel = certification.level;
      const score = certification.score;
      // Format the issue date, defaulting to current date if not available
      const issueDate = certification.issuedAt instanceof Date 
        ? certification.issuedAt.toLocaleDateString() 
        : new Date().toLocaleDateString();
      
      // Send certification details as JSON with a flag indicating it's for download
      res.json({
        fileName: `${projectName}_certification.pdf`,
        certificationData: {
          userName,
          projectName,
          projectType,
          certLevel,
          score,
          issueDate,
          downloadUrl: certification.pdfUrl || "#",
          isDownloadable: true
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to download certification" });
    }
  });
  
  // ADMIN ROUTES
  
  // Get all applications (admin only)
  app.get("/api/admin/applications", isAdmin, async (req, res) => {
    try {
      const applications = Array.from(
        (await Promise.all(Array.from({ length: 100 }, (_, i) => storage.getApplication(i + 1))))
          .filter(app => app !== undefined)
      ) as any[];
      
      // Fetch user details for each application
      const applicationDetails = await Promise.all(
        applications.map(async (app) => {
          const user = await storage.getUser(app.userId);
          return {
            ...app,
            userName: user?.name || "Unknown",
            userEmail: user?.email || "Unknown",
          };
        })
      );
      
      res.json(applicationDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });
  
  // Review and certify application (admin only)
  app.post("/api/admin/applications/:id/certify", isAdmin, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      const certificationData = insertCertificationSchema.parse({
        ...req.body,
        applicationId
      });
      
      // Create certification
      const certification = await storage.createCertification(certificationData);
      
      // Update application status
      await storage.updateApplication(applicationId, {
        status: "approved",
        updatedAt: new Date()
      });
      
      res.status(201).json(certification);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to certify application" });
    }
  });
  
  // Reject application (admin only)
  app.post("/api/admin/applications/:id/reject", isAdmin, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      const { feedback } = z.object({
        feedback: z.string()
      }).parse(req.body);
      
      // Update application status
      await storage.updateApplication(applicationId, {
        status: "rejected",
        updatedAt: new Date()
      });
      
      res.json({ message: "Application rejected successfully" });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to reject application" });
    }
  });
  
  // Request more information (admin only)
  app.post("/api/admin/applications/:id/request-info", isAdmin, async (req, res) => {
    try {
      const applicationId = parseInt(req.params.id);
      const application = await storage.getApplication(applicationId);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      const { feedback, status } = z.object({
        feedback: z.string(),
        status: z.string().default("needs_info")
      }).parse(req.body);
      
      // Update application status and include the feedback message
      await storage.updateApplication(applicationId, {
        status: status,
        updatedAt: new Date(),
        feedbackMessage: feedback // Store the feedback message from the admin
      });
      
      // Here you could also add notification logic to inform the user
      // e.g., store the feedback in a messages collection, send an email, etc.
      
      res.json({ 
        message: "Request for additional information sent successfully",
        feedback
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Error requesting more info:", error);
      res.status(500).json({ message: "Failed to request additional information" });
    }
  });
  
  // FIRM ROUTES
  
  // Get all approved firms
  app.get("/api/firms", async (req, res) => {
    try {
      const firms = await storage.getAllFirms();
      res.json(firms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch firms" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
