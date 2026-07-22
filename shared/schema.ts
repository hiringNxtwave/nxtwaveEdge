import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  mobile: varchar("mobile"), // Mobile number for SMS authentication
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  // Authentication preferences
  authMethod: varchar("auth_method").default("email"), // 'email', 'mobile', 'both'
  emailVerified: boolean("email_verified").default(false),
  mobileVerified: boolean("mobile_verified").default(false),
  // Recruiter-specific fields
  role: varchar("role").default("recruiter"), // 'recruiter', 'admin', 'student'
  collegesTier: varchar("colleges_tier"), // 'only-iits', 'iits-nits-bits', 'tier1-including-iits', 'tier2-colleges', 'tier3-colleges'
  annualFresherHires: varchar("annual_fresher_hires"), // '1-5', '6-15', '16-30', '31-50', '50+'
  budgetRange: varchar("budget_range"), // salary range they typically offer
  onboardingCompleted: boolean("onboarding_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// OTP Codes Table - manages OTP lifecycle for authentication
export const otpCodes = pgTable("otp_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Contact information (either email or mobile, not both)
  email: varchar("email"),
  mobile: varchar("mobile"),
  countryCode: varchar("country_code").default("+91"), // Country code for mobile numbers
  
  // OTP details
  code: varchar("code", { length: 6 }).notNull(), // 6-digit OTP code
  hashedCode: varchar("hashed_code").notNull(), // Hashed version for security
  purpose: varchar("purpose").notNull().default("login"), // 'login', 'registration', 'password_reset'
  
  // Security and lifecycle management
  isUsed: boolean("is_used").default(false),
  isExpired: boolean("is_expired").default(false),
  expiresAt: timestamp("expires_at").notNull(), // OTP expiry time (typically 5-10 minutes)
  
  // Rate limiting and fraud prevention
  attemptsCount: integer("attempts_count").default(0), // Number of verification attempts
  maxAttempts: integer("max_attempts").default(3), // Maximum allowed attempts
  isBlocked: boolean("is_blocked").default(false), // Block after max attempts exceeded
  blockedUntil: timestamp("blocked_until"), // Block duration for rate limiting
  
  // Request tracking
  requestIp: varchar("request_ip"), // IP address that requested OTP
  userAgent: varchar("user_agent"), // User agent string for fraud detection
  deviceFingerprint: varchar("device_fingerprint"), // Device fingerprint hash
  
  // Delivery tracking
  deliveryStatus: varchar("delivery_status").default("pending"), // 'pending', 'sent', 'delivered', 'failed'
  deliveryProvider: varchar("delivery_provider"), // 'sendgrid', 'twilio', 'aws_sns'
  deliveryAttempts: integer("delivery_attempts").default(0),
  deliveredAt: timestamp("delivered_at"),
  
  // Audit trail
  createdAt: timestamp("created_at").defaultNow(),
  verifiedAt: timestamp("verified_at"), // When OTP was successfully verified
  
  // Additional metadata for analytics
  sessionId: varchar("session_id"), // Browser session ID for tracking
  referrer: varchar("referrer"), // How user arrived at registration/login
}, (table) => [
  // Performance indexes
  index("IDX_otp_email").on(table.email),
  index("IDX_otp_mobile").on(table.mobile),
  index("IDX_otp_expires_at").on(table.expiresAt),
  index("IDX_otp_created_at").on(table.createdAt),
  index("IDX_otp_request_ip").on(table.requestIp),
  // Composite indexes for common queries
  index("IDX_otp_email_purpose").on(table.email, table.purpose),
  index("IDX_otp_mobile_purpose").on(table.mobile, table.purpose),
  index("IDX_otp_ip_created").on(table.requestIp, table.createdAt),
]);

export const companies = pgTable("companies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: varchar("name").notNull(),
  industry: varchar("industry"),
  size: varchar("size"),
  location: varchar("location"),
  website: varchar("website"),
  description: text("description"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company Job Requirements - Enhanced profile for better matchmaking
export const companyRequirements = pgTable("company_requirements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  
  // Job Details
  jobTitle: varchar("job_title").notNull(),
  jobDescription: text("job_description").notNull(),
  department: varchar("department"),
  experienceLevel: varchar("experience_level").default("fresher"), // fresher, 0-1, 1-3, 3-5
  
  // Hiring Information
  hiresExpected: integer("hires_expected").notNull(),
  urgencyLevel: varchar("urgency_level").default("medium"), // low, medium, high, urgent
  applicationDeadline: timestamp("application_deadline"),
  
  // Location & Work Mode
  jobLocation: varchar("job_location").notNull(),
  remoteAllowed: boolean("remote_allowed").default(false),
  workMode: varchar("work_mode").default("onsite"), // onsite, hybrid, remote
  relocationAssistance: boolean("relocation_assistance").default(false),
  
  // Compensation
  salaryMin: integer("salary_min"), // in thousands (e.g., 800 for 8LPA)
  salaryMax: integer("salary_max"), // in thousands (e.g., 1200 for 12LPA)
  currency: varchar("currency").default("INR"),
  bonusStructure: text("bonus_structure"),
  benefits: text("benefits"), // JSON array of benefits
  
  // Parsed Requirements (extracted from JD)
  requiredSkills: text("required_skills"), // JSON array of skills
  preferredSkills: text("preferred_skills"), // JSON array of preferred skills
  technicalKeywords: text("technical_keywords"), // JSON array of parsed technical terms
  
  // Academic Requirements
  minimumCGPA: decimal("minimum_cgpa", { precision: 4, scale: 2 }),
  preferredColleges: text("preferred_colleges"), // JSON array of college names/tiers
  requiredDegrees: text("required_degrees"), // JSON array of degree types
  graduationYears: text("graduation_years"), // JSON array of allowed years
  
  // Assessment Criteria (weights for matching algorithm)
  dsaWeight: integer("dsa_weight").default(25), // 0-100
  csFundamentalsWeight: integer("cs_fundamentals_weight").default(25), // 0-100
  aptitudeWeight: integer("aptitude_weight").default(25), // 0-100
  communicationWeight: integer("communication_weight").default(25), // 0-100
  
  // Additional Requirements
  positionsOfResponsibility: boolean("positions_of_responsibility").default(false),
  portfolioRequired: boolean("portfolio_required").default(false),
  githubRequired: boolean("github_required").default(false),
  certificationPreferences: text("certification_preferences"), // JSON array
  
  // Company Culture Fit
  companyValues: text("company_values"), // JSON array
  workCulture: varchar("work_culture"), // startup, corporate, remote-first, etc.
  teamSize: varchar("team_size"),
  
  // Status
  isActive: boolean("is_active").default(true),
  status: varchar("status").default("active"), // 'active', 'closed', 'draft'
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone"),
  university: varchar("university").notNull(),
  nirfRanking: integer("nirf_ranking"), // NIRF ranking of the university
  degree: varchar("degree").notNull(),
  major: varchar("major").notNull(),
  graduationYear: integer("graduation_year").notNull(),
  cgpa: decimal("cgpa", { precision: 3, scale: 2 }),
  location: varchar("location").notNull(),
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  resumeUrl: varchar("resume_url"),
  portfolioUrl: varchar("portfolio_url"),
  linkedinUrl: varchar("linkedin_url"),
  githubUrl: varchar("github_url"),
  verified: boolean("verified").default(true),
  
  // Standardized Assessment Scores (Gold Standard Evaluation)
  dsaScore: integer("dsa_score"), // 0-100 - Data Structures & Algorithms
  csFundamentalsScore: integer("cs_fundamentals_score"), // 0-100 - Computer Science Fundamentals  
  aptitudeScore: integer("aptitude_score"), // 0-100 - Logical & Quantitative Aptitude
  verbalCommunicationScore: integer("verbal_communication_score"), // 0-100 - English & Communication Skills
  overallAssessmentScore: integer("overall_assessment_score"), // 0-100 - Weighted average of all scores
  assessmentCompleted: boolean("assessment_completed").default(false),
  assessmentDate: timestamp("assessment_date"),
  
  // Student preferences and salary expectations
  expectedSalaryMin: integer("expected_salary_min"), // in thousands (e.g., 800 for 8LPA)
  expectedSalaryMax: integer("expected_salary_max"), // in thousands (e.g., 1200 for 12LPA)
  preferredRoles: text("preferred_roles"), // JSON array of preferred roles
  preferredLocations: text("preferred_locations"), // JSON array of preferred locations
  preferredCompanySize: varchar("preferred_company_size"), // startup, mid-size, large, enterprise
  workMode: varchar("work_mode").default("hybrid"), // remote, hybrid, onsite
  noticePeriod: integer("notice_period").default(0), // in days
  availableFrom: timestamp("available_from"),
  recommendation: varchar("recommendation"), // 'Strong Hire', 'Hire', 'Weak Hire'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull().unique(),
  category: varchar("category").notNull(), // 'technical', 'soft', 'domain'
  createdAt: timestamp("created_at").defaultNow(),
});

export const studentSkills = pgTable("student_skills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  skillId: varchar("skill_id").notNull().references(() => skills.id),
  proficiencyLevel: integer("proficiency_level").notNull(), // 1-5 scale
  assessmentScore: integer("assessment_score"), // 0-100
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  title: varchar("title").notNull(),
  description: text("description"),
  technologies: text("technologies"), // JSON string of tech array
  projectUrl: varchar("project_url"),
  githubUrl: varchar("github_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactRequests = pgTable("contact_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  studentId: varchar("student_id").notNull().references(() => students.id),
  message: text("message"),
  status: varchar("status").default("pending"), // 'pending', 'accepted', 'declined'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Assessment tables
export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  status: varchar("status").notNull().default("not_started"), // not_started, in_progress, completed
  overallScore: integer("overall_score"), // 0-100
  aptitudeScore: integer("aptitude_score"), // 0-100
  verbalScore: integer("verbal_score"), // 0-100
  dsaScore: integer("dsa_score"), // 0-100
  communicationScore: integer("communication_score"), // 0-100
  strengths: text("strengths"), // JSON array of strength areas
  improvements: text("improvements"), // JSON array of improvement areas
  reportGenerated: boolean("report_generated").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessmentQuestions = pgTable("assessment_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: varchar("category").notNull(), // aptitude, verbal, dsa, communication
  question: text("question").notNull(),
  options: text("options"), // JSON array for MCQ
  correctAnswer: text("correct_answer"),
  difficulty: varchar("difficulty").notNull().default("medium"), // easy, medium, hard
  timeLimit: integer("time_limit").default(120), // seconds
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessmentResponses = pgTable("assessment_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id").notNull().references(() => assessments.id),
  questionId: varchar("question_id").notNull().references(() => assessmentQuestions.id),
  userAnswer: text("user_answer"),
  isCorrect: boolean("is_correct"),
  timeTaken: integer("time_taken"), // seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.id],
    references: [companies.userId],
  }),
  otpCodes: many(otpCodes),
  notifications: many(notifications),
  sharedCandidates: many(candidateShares),
}));

export const otpCodesRelations = relations(otpCodes, ({ one }) => ({
  // Note: OTP codes don't directly reference users since they can be used for registration
  // The relationship is implicit through email/mobile matching
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, {
    fields: [companies.userId],
    references: [users.id],
  }),
  contactRequests: many(contactRequests),
  interviews: many(interviews),
  requirements: many(companyRequirements),
  candidateShares: many(candidateShares),
  companyInterest: many(companyInterest),
}));

export const companyRequirementsRelations = relations(companyRequirements, ({ one, many }) => ({
  company: one(companies, {
    fields: [companyRequirements.companyId],
    references: [companies.id],
  }),
  candidateShares: many(candidateShares),
  companyInterest: many(companyInterest),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  skills: many(studentSkills),
  projects: many(projects),
  contactRequests: many(contactRequests),
  codeSubmissions: many(codeSubmissions),
  interviews: many(interviews),
  idVerifications: many(idVerifications),
  candidateShares: many(candidateShares),
  companyInterest: many(companyInterest),
}));

export const skillsRelations = relations(skills, ({ many }) => ({
  studentSkills: many(studentSkills),
}));

export const studentSkillsRelations = relations(studentSkills, ({ one }) => ({
  student: one(students, {
    fields: [studentSkills.studentId],
    references: [students.id],
  }),
  skill: one(skills, {
    fields: [studentSkills.skillId],
    references: [skills.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  student: one(students, {
    fields: [projects.studentId],
    references: [students.id],
  }),
}));

export const contactRequestsRelations = relations(contactRequests, ({ one }) => ({
  company: one(companies, {
    fields: [contactRequests.companyId],
    references: [companies.id],
  }),
  student: one(students, {
    fields: [contactRequests.studentId],
    references: [students.id],
  }),
}));

// Relations for assessments
export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  user: one(users, {
    fields: [assessments.userId],
    references: [users.id],
  }),
  responses: many(assessmentResponses),
}));

export const assessmentQuestionsRelations = relations(assessmentQuestions, ({ many }) => ({
  responses: many(assessmentResponses),
}));

export const assessmentResponsesRelations = relations(assessmentResponses, ({ one }) => ({
  assessment: one(assessments, {
    fields: [assessmentResponses.assessmentId],
    references: [assessments.id],
  }),
  question: one(assessmentQuestions, {
    fields: [assessmentResponses.questionId],
    references: [assessmentQuestions.id],
  }),
}));


// Insert schemas
export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanyRequirementsSchema = createInsertSchema(companyRequirements).omit({
  id: true,
  createdAt: true,
  lastUpdated: true,
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertStudentSkillSchema = createInsertSchema(studentSkills).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOtpCodeSchema = createInsertSchema(otpCodes).omit({
  id: true,
  createdAt: true,
  verifiedAt: true,
  deliveredAt: true,
}).extend({
  // Additional validation for OTP fields
  code: z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits"),
  mobile: z.string().regex(/^\+[1-9]\d{1,14}$/, "Invalid mobile number format").optional(),
  email: z.string().email("Invalid email format").optional(),
  purpose: z.enum(["login", "registration", "password_reset"]),
  authMethod: z.enum(["email", "mobile"]),
}).refine(
  (data) => (data.email && !data.mobile) || (!data.email && data.mobile),
  {
    message: "Either email or mobile must be provided, but not both",
    path: ["email", "mobile"],
  }
);

// Code Submissions Table - stores coding solutions with timestamp tracking
export const codeSubmissions = pgTable("code_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  questionId: varchar("question_id").notNull().references(() => assessmentQuestions.id),
  code: text("code").notNull(),
  language: varchar("language").notNull().default("javascript"),
  executionTime: integer("execution_time"), // milliseconds
  memoryUsed: integer("memory_used"), // KB
  testCasesPassed: integer("test_cases_passed"),
  totalTestCases: integer("total_test_cases"),
  score: integer("score"), // 0-100
  idVerified: boolean("id_verified").default(false), // ID verification status
  webcamVerified: boolean("webcam_verified").default(false),
  keystrokePattern: text("keystroke_pattern"), // JSON data for keystroke analysis
  submittedAt: timestamp("submitted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Interviews Table - manages interview scheduling and tracking
export const interviews = pgTable("interviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  studentId: varchar("student_id").notNull().references(() => students.id),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60), // minutes
  interviewType: varchar("interview_type").notNull().default("technical"), // technical, hr, final
  status: varchar("status").default("scheduled"), // scheduled, in_progress, completed, cancelled
  meetingLink: varchar("meeting_link"),
  notes: text("notes"),
  rating: integer("rating"), // 1-5 scale
  feedback: text("feedback"),
  nextRound: boolean("next_round").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages Table - handles communication between companies and students
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  receiverId: varchar("receiver_id").notNull().references(() => users.id),
  conversationId: varchar("conversation_id").notNull(), // groups related messages
  messageType: varchar("message_type").default("text"), // text, file, interview_invite
  content: text("content").notNull(),
  fileUrl: varchar("file_url"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ID Verification Table - tracks verification process
export const idVerifications = pgTable("id_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  studentId: varchar("student_id").notNull().references(() => students.id),
  documentType: varchar("document_type").notNull(), // aadhar, pan, driving_license
  documentNumber: varchar("document_number").notNull(),
  documentImageUrl: varchar("document_image_url"),
  faceImageUrl: varchar("face_image_url"),
  verificationStatus: varchar("verification_status").default("pending"), // pending, verified, rejected
  verifiedBy: varchar("verified_by"), // admin user id
  verifiedAt: timestamp("verified_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Candidate Shares - token-based access for company portal
export const candidateShares = pgTable("candidate_shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => companyRequirements.id),
  studentId: varchar("student_id").notNull().references(() => students.id),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  token: varchar("token").notNull().unique(),
  sharedBy: varchar("shared_by").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  status: varchar("status").default("active"), // 'active', 'expired', 'viewed'
  viewedAt: timestamp("viewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Company Interest - track which candidates a company marks interested in
export const companyInterest = pgTable("company_interest", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => companyRequirements.id),
  studentId: varchar("student_id").notNull().references(() => students.id),
  companyId: varchar("company_id").notNull().references(() => companies.id),
  notes: text("notes"),
  status: varchar("status").default("interested"), // 'interested', 'shortlisted', 'interviewed', 'hired'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications - in-app notification bell
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: varchar("type").notNull(), // 'interest', 'share', 'update', 'interview'
  title: varchar("title").notNull(),
  message: text("message"),
  link: varchar("link"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  readAt: timestamp("read_at"),
});

// New Relations (after table definitions)
export const codeSubmissionsRelations = relations(codeSubmissions, ({ one }) => ({
  student: one(students, {
    fields: [codeSubmissions.studentId],
    references: [students.id],
  }),
  question: one(assessmentQuestions, {
    fields: [codeSubmissions.questionId],
    references: [assessmentQuestions.id],
  }),
}));

export const interviewsRelations = relations(interviews, ({ one }) => ({
  company: one(companies, {
    fields: [interviews.companyId],
    references: [companies.id],
  }),
  student: one(students, {
    fields: [interviews.studentId],
    references: [students.id],
  }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
  }),
}));

export const idVerificationsRelations = relations(idVerifications, ({ one }) => ({
  student: one(students, {
    fields: [idVerifications.studentId],
    references: [students.id],
  }),
}));

export const candidateSharesRelations = relations(candidateShares, ({ one }) => ({
  job: one(companyRequirements, {
    fields: [candidateShares.jobId],
    references: [companyRequirements.id],
  }),
  student: one(students, {
    fields: [candidateShares.studentId],
    references: [students.id],
  }),
  company: one(companies, {
    fields: [candidateShares.companyId],
    references: [companies.id],
  }),
  sharedByUser: one(users, {
    fields: [candidateShares.sharedBy],
    references: [users.id],
  }),
}));

export const companyInterestRelations = relations(companyInterest, ({ one }) => ({
  job: one(companyRequirements, {
    fields: [companyInterest.jobId],
    references: [companyRequirements.id],
  }),
  student: one(students, {
    fields: [companyInterest.studentId],
    references: [students.id],
  }),
  company: one(companies, {
    fields: [companyInterest.companyId],
    references: [companies.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const insertAssessmentQuestionSchema = createInsertSchema(assessmentQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentResponseSchema = createInsertSchema(assessmentResponses).omit({
  id: true,
  createdAt: true,
});

export const insertCodeSubmissionSchema = createInsertSchema(codeSubmissions).omit({
  id: true,
  createdAt: true,
  submittedAt: true,
});

export const insertInterviewSchema = createInsertSchema(interviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertIdVerificationSchema = createInsertSchema(idVerifications).omit({
  id: true,
  createdAt: true,
});

export const insertCandidateShareSchema = createInsertSchema(candidateShares).omit({
  id: true,
  createdAt: true,
  viewedAt: true,
});

export const insertCompanyInterestSchema = createInsertSchema(companyInterest).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  readAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertOtpCode = z.infer<typeof insertOtpCodeSchema>;
export type OtpCode = typeof otpCodes.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
export type InsertCompanyRequirements = z.infer<typeof insertCompanyRequirementsSchema>;
export type CompanyRequirements = typeof companyRequirements.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof students.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertStudentSkill = z.infer<typeof insertStudentSkillSchema>;
export type StudentSkill = typeof studentSkills.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type ContactRequest = typeof contactRequests.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessmentQuestion = z.infer<typeof insertAssessmentQuestionSchema>;
export type AssessmentQuestion = typeof assessmentQuestions.$inferSelect;
export type InsertAssessmentResponse = z.infer<typeof insertAssessmentResponseSchema>;
export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type InsertCodeSubmission = z.infer<typeof insertCodeSubmissionSchema>;
export type CodeSubmission = typeof codeSubmissions.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type Interview = typeof interviews.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertIdVerification = z.infer<typeof insertIdVerificationSchema>;
export type IdVerification = typeof idVerifications.$inferSelect;

export type InsertCandidateShare = z.infer<typeof insertCandidateShareSchema>;
export type CandidateShare = typeof candidateShares.$inferSelect;
export type InsertCompanyInterest = z.infer<typeof insertCompanyInterestSchema>;
export type CompanyInterest = typeof companyInterest.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Extended types for joined data
export type StudentWithAssessments = Student & {
  projects: Project[];
  fullName: string;
  institution: string;
  course: string;
  assessmentLevel: 'Excellent' | 'Strong' | 'Good' | 'Needs Improvement' | 'Not Assessed';
};

export type StudentWithSkills = Student & {
  skills: (typeof studentSkills.$inferSelect & { skill: typeof skills.$inferSelect })[];
  projects: Project[];
};

export type CompanyWithUser = Company & {
  user: User;
};

export type CompanyWithRequirements = Company & {
  requirements: CompanyRequirements[];
};

export type AssessmentWithResponses = typeof assessments.$inferSelect & {
  responses: (typeof assessmentResponses.$inferSelect & {
    question: typeof assessmentQuestions.$inferSelect;
  })[];
};
