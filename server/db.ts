import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

/**
 * Database configuration for MySQL
 * 
 * Visual Studio Code local development with MySQL:
 * - Create a .env file based on .env.example
 * - Set DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME
 * 
 * Replit environment:
 * - Will use the provided DATABASE_URL if available, otherwise fall back to default MySQL config
 */

// Default connection configuration based on the screenshot
const DEFAULT_MYSQL_CONFIG = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '3306', 10),
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || 'root',
  database: process.env.DATABASE_NAME || 'green_guard',
};

// Determine if we're using a connection string or individual parameters
let connectionConfig: mysql.ConnectionOptions;

if (process.env.DATABASE_URL) {
  // Parse the connection string if available
  try {
    const url = new URL(process.env.DATABASE_URL);
    connectionConfig = {
      host: url.hostname,
      port: parseInt(url.port, 10) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.replace(/^\//, ''),
      ssl: url.searchParams.get('ssl') === 'true' ? {} : undefined,
    };
    console.log(`Using database connection string with host ${url.hostname}`);
  } catch (err) {
    console.warn(`Invalid DATABASE_URL, falling back to default configuration: ${err}`);
    connectionConfig = DEFAULT_MYSQL_CONFIG;
  }
} else {
  // Use individual parameters
  connectionConfig = DEFAULT_MYSQL_CONFIG;
  console.log(`Using MySQL database at ${connectionConfig.host}:${connectionConfig.port}`);
}

// Log connection details (without sensitive information)
console.log(`Connecting to MySQL database '${connectionConfig.database}' as user '${connectionConfig.user}'`);

// Create connection pool with better defaults
const connectionOptions: mysql.PoolOptions = {
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
};

// Create connection pool
export let pool: mysql.Pool;

try {
  pool = mysql.createPool(connectionOptions);
  console.log("MySQL connection pool created successfully");
} catch (err) {
  console.error("Error creating MySQL connection pool:", err);
  throw new Error("Failed to create database connection pool");
}

// Test the connection
pool.query('SELECT 1')
  .then(() => console.log("Database connection successful"))
  .catch(err => console.error("Database connection failed:", err));

// Create Drizzle ORM instance with debug logging
export const db = drizzle(pool, {
  schema: schema as any, // Type cast to avoid TypeScript errors
  mode: 'default', // Required for MySQL configuration
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