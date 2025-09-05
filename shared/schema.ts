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
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

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

export const students = pgTable("students", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone"),
  university: varchar("university").notNull(),
  degree: varchar("degree").notNull(),
  major: varchar("major").notNull(),
  graduationYear: integer("graduation_year").notNull(),
  cgpa: decimal("cgpa", { precision: 3, scale: 2 }),
  codingRating: integer("coding_rating").notNull().default(3), // 1-5 stars
  location: varchar("location").notNull(),
  bio: text("bio"),
  profileImageUrl: varchar("profile_image_url"),
  resumeUrl: varchar("resume_url"),
  portfolioUrl: varchar("portfolio_url"),
  linkedinUrl: varchar("linkedin_url"),
  githubUrl: varchar("github_url"),
  verified: boolean("verified").default(true),
  // Student preferences and salary expectations
  expectedSalaryMin: integer("expected_salary_min"), // in thousands (e.g., 800 for 8LPA)
  expectedSalaryMax: integer("expected_salary_max"), // in thousands (e.g., 1200 for 12LPA)
  preferredRoles: text("preferred_roles"), // JSON array of preferred roles
  preferredLocations: text("preferred_locations"), // JSON array of preferred locations
  preferredCompanySize: varchar("preferred_company_size"), // startup, mid-size, large, enterprise
  workMode: varchar("work_mode").default("hybrid"), // remote, hybrid, onsite
  noticePeriod: integer("notice_period").default(0), // in days
  availableFrom: timestamp("available_from"),
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
export const usersRelations = relations(users, ({ one }) => ({
  company: one(companies, {
    fields: [users.id],
    references: [companies.userId],
  }),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, {
    fields: [companies.userId],
    references: [users.id],
  }),
  contactRequests: many(contactRequests),
  interviews: many(interviews),
}));

export const studentsRelations = relations(students, ({ many }) => ({
  skills: many(studentSkills),
  projects: many(projects),
  contactRequests: many(contactRequests),
  codeSubmissions: many(codeSubmissions),
  interviews: many(interviews),
  idVerifications: many(idVerifications),
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

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;
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

// Extended types for joined data
export type StudentWithSkills = Student & {
  skills: (StudentSkill & { skill: Skill })[];
  projects: Project[];
};

export type CompanyWithUser = Company & {
  user: User;
};

export type AssessmentWithResponses = typeof assessments.$inferSelect & {
  responses: (typeof assessmentResponses.$inferSelect & {
    question: typeof assessmentQuestions.$inferSelect;
  })[];
};
