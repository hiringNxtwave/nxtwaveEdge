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
export async function runStartupMigrations() {
  try {
    await sql`
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
    `;
  } catch (error) {
    console.error("Migration error:", error);
    // Don't throw — migrations are best-effort
  }
}