import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Always use WebSocket for Neon DB connection
// This is required for Replit and recommended for all environments
try {
  // Configure WebSocket for Neon DB
  neonConfig.webSocketConstructor = ws;
  console.log("WebSocket configured for Neon database connection");
} catch (err) {
  console.error("Error configuring WebSocket for database:", err);
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