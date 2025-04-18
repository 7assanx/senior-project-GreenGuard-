import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Enable enhanced logging
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Add event listeners for debugging
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // Increase connection pool size
  idleTimeoutMillis: 30000, // Increase timeout
});

// Log pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle database client', err);
});

// Create Drizzle ORM instance with debug logging
export const db = drizzle({ 
  client: pool, 
  schema,
  logger: {
    logQuery: (query, params) => {
      console.log('Executing query:', query, 'with params:', params);
    }
  }
});