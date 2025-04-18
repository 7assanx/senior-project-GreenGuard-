// Instead of using a real database, we'll create an in-memory implementation
// This will help avoid connectivity issues in Replit

// Import session related modules
import session from "express-session";
import createMemoryStore from "memorystore";

// Create memory store for sessions
const MemoryStore = createMemoryStore(session);
export const sessionStore = new MemoryStore({
  checkPeriod: 86400000, // Clear expired sessions every day
});

// Export a dummy pool for compatibility
export const pool = {
  query: async () => ({ rows: [{ '?column?': 1 }] }),
  end: async () => {},
};

// Log our database choice
console.log("Using in-memory storage for the application");

// We'll export a dummy db object to maintain compatibility with the rest of the app
// The actual storage implementation will be in storage.ts
export const db = {
  query: () => {},
  select: () => ({
    from: () => ({
      where: () => [],
    }),
  }),
  insert: () => ({
    values: () => ({
      returning: () => [],
    }),
  }),
  update: () => ({
    set: () => ({
      where: () => ({
        returning: () => [],
      }),
    }),
  }),
  delete: () => ({
    where: () => ({
      returning: () => [],
    }),
  }),
};