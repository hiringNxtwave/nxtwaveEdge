import { drizzle as drizzleNeonHttp } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const isVercel = process.env.VERCEL === "true";

// Neon HTTP driver — works on both Vercel and local
const sql = neon(process.env.DATABASE_URL);
export const db = drizzleNeonHttp({ client: sql, schema });

// For local dev, we also export a pool-compatible interface if needed
// But prefer using `db` directly everywhere

// Run lightweight startup migrations for any new columns added since initial deploy
// Neon HTTP driver requires one statement per sql call (no multi-statement)
export async function runStartupMigrations() {
  const statements = [
    `ALTER TABLE company_requirements ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP`,
    `ALTER TABLE company_requirements ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS nirf_ranking INTEGER`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS dsa_score INTEGER`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS cs_fundamentals_score INTEGER`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS aptitude_score INTEGER`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS verbal_communication_score INTEGER`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS overall_assessment_score INTEGER`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS assessment_completed BOOLEAN DEFAULT false`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS assessment_date TIMESTAMP`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS expected_salary_min INTEGER`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS expected_salary_max INTEGER`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS preferred_roles TEXT`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS preferred_locations TEXT`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS preferred_company_size VARCHAR(255)`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS work_mode VARCHAR(255) DEFAULT 'hybrid'`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS notice_period INTEGER DEFAULT 0`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS available_from TIMESTAMP`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS recommendation VARCHAR(255)`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255)`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS github_url VARCHAR(255)`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS resume_url VARCHAR(255)`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(255)`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(255)`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS bio TEXT`,
    `ALTER TABLE students ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT true`,
    // New tables for hiring workflow
    `CREATE TABLE IF NOT EXISTS candidate_shares (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id VARCHAR NOT NULL,
      student_id VARCHAR NOT NULL,
      company_id VARCHAR NOT NULL,
      token VARCHAR NOT NULL UNIQUE,
      shared_by VARCHAR,
      expires_at TIMESTAMP NOT NULL,
      status VARCHAR(50) DEFAULT 'active',
      viewed_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS company_interest (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      job_id VARCHAR NOT NULL,
      student_id VARCHAR NOT NULL,
      company_id VARCHAR NOT NULL,
      notes TEXT,
      status VARCHAR(50) DEFAULT 'interested',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`,
    `CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR NOT NULL,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT,
      link VARCHAR(500),
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      read_at TIMESTAMP
    )`,
  ];
  for (const stmt of statements) {
    try {
      await sql(stmt);
    } catch (error) {
      // Column already exists or other non-critical error — skip silently
    }
  }
}