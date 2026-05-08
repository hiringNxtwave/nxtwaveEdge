import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Run lightweight startup migrations for any new columns added since initial deploy
export async function runStartupMigrations() {
  const client = await pool.connect();
  try {
    await client.query(`
      ALTER TABLE company_requirements
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

      ALTER TABLE students
        ADD COLUMN IF NOT EXISTS nirf_ranking INTEGER,
        ADD COLUMN IF NOT EXISTS dsa_score INTEGER,
        ADD COLUMN IF NOT EXISTS cs_fundamentals_score INTEGER,
        ADD COLUMN IF NOT EXISTS aptitude_score INTEGER,
        ADD COLUMN IF NOT EXISTS verbal_communication_score INTEGER,
        ADD COLUMN IF NOT EXISTS overall_assessment_score INTEGER,
        ADD COLUMN IF NOT EXISTS assessment_completed BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS assessment_date TIMESTAMP,
        ADD COLUMN IF NOT EXISTS expected_salary_min INTEGER,
        ADD COLUMN IF NOT EXISTS expected_salary_max INTEGER,
        ADD COLUMN IF NOT EXISTS preferred_roles TEXT,
        ADD COLUMN IF NOT EXISTS preferred_locations TEXT,
        ADD COLUMN IF NOT EXISTS preferred_company_size VARCHAR(255),
        ADD COLUMN IF NOT EXISTS work_mode VARCHAR(255) DEFAULT 'hybrid',
        ADD COLUMN IF NOT EXISTS notice_period INTEGER DEFAULT 0,
        ADD COLUMN IF NOT EXISTS available_from TIMESTAMP,
        ADD COLUMN IF NOT EXISTS recommendation VARCHAR(255),
        ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255),
        ADD COLUMN IF NOT EXISTS github_url VARCHAR(255),
        ADD COLUMN IF NOT EXISTS resume_url VARCHAR(255),
        ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(255),
        ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(255),
        ADD COLUMN IF NOT EXISTS bio TEXT,
        ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT true;
    `);
  } finally {
    client.release();
  }
}