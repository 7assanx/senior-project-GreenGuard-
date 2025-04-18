# Local Development Environment Setup Guide

This guide helps you set up and run the Green Guard application in a local Visual Studio Code environment.

## Prerequisites

1. Node.js 18+ installed on your machine
2. Visual Studio Code or another code editor
3. Git installed (optional, for cloning the repository)

## Setup Steps

### 1. Clone or Download the Repository

```bash
git clone [repository-url]
cd [repository-folder]
```

### 2. Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and update the values:
   ```
   # Replace with your actual Neon Database URL
   DATABASE_URL=postgres://username:password@hostname:port/database
   
   # Set to development for local environment
   NODE_ENV=development
   
   # Set to false since you're not in Replit
   REPLIT=false
   
   # Set to 5000 or another available port
   PORT=5000
   
   # If you experience connection issues, try setting this to false
   USE_WEBSOCKET=false
   
   # Generate a random string for session security
   SESSION_SECRET=random_secure_string
   
   # Add your OpenAI API key if you plan to use AI features
   OPENAI_API_KEY=your_openai_api_key
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Install Required System Dependencies

If you're developing on Windows, you might need to install additional build tools:

```bash
npm install --global --production windows-build-tools
```

### 5. Database Setup

Ensure your Neon database is properly set up with required tables. If you're setting up a new database, run:

```bash
npm run db:push
```

### 6. Start the Development Server

```bash
npm run dev
```

## Troubleshooting Common Issues

### WebSocket Connection Errors

If you see errors related to WebSocket connections:

1. Open your `.env` file
2. Set `USE_WEBSOCKET=false`
3. Restart the server

### Database Connection Issues

If you experience database connection problems:

1. Verify your `DATABASE_URL` is correct in the `.env` file
2. Ensure your database server is accessible from your machine
3. Check firewall settings that might block database connections

### Port Binding Errors

If you see `ENOTSUP: operation not supported on socket` or similar errors:

1. Make sure no other application is using port 5000
2. Try changing the `PORT` value in your `.env` file
3. If using WSL on Windows, try running the application directly in Windows

### Authentication Problems

If login/authentication doesn't work:

1. Check if your database has been properly seeded with initial users
2. Default admin credentials are:
   - Username: `admin`
   - Password: `admin123`

## Database Schema

The application uses Drizzle ORM with a PostgreSQL database. The schema is defined in `shared/schema.ts`.

## Getting Help

If you continue to experience issues, please open an issue in the repository or contact the project maintainers.