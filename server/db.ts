import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

/**
 * Configures database connection based on environment
 * 
 * Visual Studio Code local development:
 * - Create a .env file based on .env.example
 * - Set USE_WEBSOCKET=false if experiencing connection issues
 * 
 * Replit environment:
 * - Will use WebSocket connection by default
 */
try {
  // Check if we should use WebSocket (default to true)
  const useWebSocket = process.env.USE_WEBSOCKET !== 'false';
  
  if (useWebSocket) {
    // When in Replit or if explicitly enabled, use WebSockets for Neon DB
    neonConfig.webSocketConstructor = ws;
    console.log("Using WebSocket connection for Neon database");
  } else {
    console.log("Using direct connection for Neon database (WebSockets disabled)");
  }
} catch (err) {
  console.error("Error configuring database connection:", err);
  // Fall back to WebSocket connection
  neonConfig.webSocketConstructor = ws;
  console.log("Falling back to WebSocket connection after error");
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Connection options with better defaults for both environments
const connectionOptions = {
  connectionString: process.env.DATABASE_URL,
  max: 20, // Increase connection pool size
  idleTimeoutMillis: 30000, // Increase timeout
  connectionTimeoutMillis: 10000, // Connection timeout
  keepAlive: true, // Keep connection alive
};

// Add event listeners for debugging
export const pool = new Pool(connectionOptions);

// Log pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on database client:', err);
  // Try to reconnect if this is a connection issue
  // Using type assertion as error code is not in TypeScript definitions
  const errorCode = (err as any).code;
  if (errorCode === 'ECONNREFUSED' || errorCode === 'ENOTFOUND') {
    console.log('Attempting to reconnect to database...');
  }
});

// Create Drizzle ORM instance with debug logging
export const db = drizzle({ 
  client: pool, 
  schema,
  logger: {
    logQuery: (query, params) => {
      // Only log query text in development to avoid exposing sensitive data
      if (process.env.NODE_ENV === 'development') {
        console.log('Executing query:', query, 'with params:', params);
      } else {
        console.log('Executing database query...');
      }
    }
  }
});