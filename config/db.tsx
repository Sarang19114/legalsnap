import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Check if DATABASE_URL is provided
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Please create a .env.local file with your database connection string.');
  console.error('Example: DATABASE_URL=postgresql://username:password@host:port/database');
}

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
