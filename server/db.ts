import * as schema from "@shared/schema";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

// Set up PostgreSQL with Neon
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

// Create connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Test connection
pool.query('SELECT 1')
  .then(() => console.log("PostgreSQL database connection successful"))
  .catch(err => console.error("PostgreSQL database connection failed:", err));

// Create Drizzle ORM instance
const db = drizzle(pool, {
  schema,
  logger: {
    logQuery: (query, params) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('Executing query:', query, 'with params:', params);
      } else {
        console.log('Executing database query...');
      }
    }
  }
});

export { pool, db };