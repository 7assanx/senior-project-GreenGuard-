import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Add CORS headers for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Get port from environment variable or use default 5000
  const port = process.env.PORT || 5000;
  
  // Determine if we're running in Replit or local environment
  // Check both NODE_ENV and the explicit REPLIT flag that might be in .env
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const isReplit = process.env.REPLIT === 'true' || 
                   !isDevelopment ||
                   (typeof process.env.REPLIT === 'undefined' && isProduction);
  
  // In Replit: bind to 0.0.0.0
  // In local development: bind to localhost to avoid ENOTSUP errors
  const host = isReplit ? '0.0.0.0' : 'localhost';
  
  // Log the environment for debugging
  log(`Starting server in ${isReplit ? 'Replit' : 'local'} environment`);
  
  // Configure server options based on environment
  const serverOptions: any = {
    port: Number(port),
    host: host,
  };
  
  // Only use reusePort in Replit environment
  if (isReplit) {
    serverOptions.reusePort = true;
  }
  
  try {
    server.listen(serverOptions, () => {
      // Always display localhost in the URL for clarity
      const displayHost = host === '0.0.0.0' ? 'localhost' : host;
      log(`Server running at http://${displayHost}:${port}`);
      
      // Additional environment information
      log(`Database connection: ${process.env.USE_WEBSOCKET !== 'false' ? 'WebSocket' : 'Direct'}`);
      log(`Node environment: ${process.env.NODE_ENV || 'not set'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    
    // If binding to 0.0.0.0 fails, try binding to localhost as fallback
    if (host === '0.0.0.0') {
      log('Binding to 0.0.0.0 failed, trying fallback to localhost...');
      try {
        server.listen(Number(port), 'localhost', () => {
          log(`Server running at http://localhost:${port} (fallback)`);
        });
      } catch (fallbackError) {
        console.error('Fallback to localhost also failed:', fallbackError);
        log('CRITICAL: Unable to start server on any interface');
      }
    }
  }
})();
