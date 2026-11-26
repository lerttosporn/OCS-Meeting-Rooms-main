import postgres from 'postgres';
import { execSync } from 'child_process';

export default async () => {
  console.log('\n[E2E] Setting up test database...');
  
  // Default postgres database to manage other databases
  const adminDbUrl = process.env.ADMIN_DB_URL || 'postgresql://admin:mysecretpassword@localhost:5432/postgres';
  const sql = postgres(adminDbUrl);
  
  try {
    // Terminate existing connections to the test DB
    await sql`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = 'OCS_meeting_test'
        AND pid <> pg_backend_pid();
    `;
    
    await sql`DROP DATABASE IF EXISTS "OCS_meeting_test"`;
    await sql`CREATE DATABASE "OCS_meeting_test"`;
  } catch (error) {
    console.error('Error creating test database:', error);
    throw error;
  } finally {
    await sql.end();
  }
  
  // Inject the test DB URL into the environment for the scripts and tests
  process.env.DB_URL = 'postgresql://admin:mysecretpassword@localhost:5432/OCS_meeting_test';
  
  console.log('[E2E] Running database migrations on test database...');
  execSync('npx ts-node -r tsconfig-paths/register src/database/setup.ts', { 
    stdio: 'inherit', 
    env: { ...process.env, DB_URL: process.env.DB_URL } 
  });
  
  console.log('[E2E] Seeding test database...');
  execSync('npx ts-node -r tsconfig-paths/register src/database/seed.ts', { 
    stdio: 'inherit', 
    env: { ...process.env, DB_URL: process.env.DB_URL } 
  });
};
