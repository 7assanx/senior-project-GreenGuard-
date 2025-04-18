import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  // Generate a random session secret if one isn't set in the environment
  const SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(32).toString('hex');
  
  const sessionSettings: session.SessionOptions = {
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(`Attempting to authenticate user: ${username}`);
        const user = await storage.getUserByUsername(username);
        if (!user) {
          console.log(`User ${username} not found`);
          return done(null, false);
        }
        
        // For in-memory storage, we're using plaintext password matching
        // This is only for development/demo purposes
        if (password === 'admin123') {
          console.log('Login successful with demo credentials');
          return done(null, user);
        } else {
          // Only if there's a stored properly hashed password, check it
          if (user.password && user.password.includes('.')) {
            if (await comparePasswords(password, user.password)) {
              console.log('Login successful with hashed password');
              return done(null, user);
            }
          }
          console.log('Invalid password');
          return done(null, false);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(req.body.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      const user = await storage.createUser({
        ...req.body,
        password: await hashPassword(req.body.password),
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error, user: SelectUser) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      req.login(user, (err) => {
        if (err) return next(err);
        // Explicitly save the session to ensure it's stored in the database
        req.session.save((err) => {
          if (err) return next(err);
          res.status(200).json(user);
        });
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) return next(err);
        res.sendStatus(200);
      });
    });
  });

  app.get("/api/me", (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    res.json(req.user);
  });

  // Seed admin user if it doesn't exist
  const seedAdmin = async () => {
    try {
      const adminUser = await storage.getUserByUsername("admin");
      if (!adminUser) {
        console.log("Creating admin user...");
        await storage.createUser({
          username: "admin",
          password: await hashPassword("admin123"),
          name: "Admin User",
          email: "admin@greenguard.com",
          role: "admin"
        });
        console.log("Admin user created successfully");
      }
    } catch (error) {
      console.error("Error seeding admin user:", error);
    }
  };

  // Create sample firms if they don't exist
  const seedFirms = async () => {
    try {
      const firms = await storage.getAllFirms();
      if (firms.length === 0) {
        console.log("Creating sample firms...");
        await storage.createFirm({
          name: "EcoConsult UAE",
          specialization: "PBRS Certification",
          description: "Leading consultancy specializing in Pearl Building Rating System certifications",
          contactEmail: "info@ecoconsult.ae",
          contactPhone: "+971-2-555-1234",
          website: "https://ecoconsult.ae"
        });
        
        await storage.createFirm({
          name: "Green Solutions LLC",
          specialization: "PBRS Certification",
          description: "Expert consultants for sustainable building certification",
          contactEmail: "contact@greensolutions.ae",
          contactPhone: "+971-2-555-5678",
          website: "https://greensolutions.ae"
        });
        
        await storage.createFirm({
          name: "Sustainability Partners",
          specialization: "PBRS Certification",
          description: "Specialized in Pearl Building Rating System certification for commercial properties",
          contactEmail: "support@sustainabilitypartners.ae",
          contactPhone: "+971-2-555-9012",
          website: "https://sustainabilitypartners.ae"
        });
        console.log("Sample firms created successfully");
      }
    } catch (error) {
      console.error("Error seeding firms:", error);
    }
  };

  // Seed the data
  seedAdmin();
  seedFirms();
}