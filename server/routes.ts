import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import OpenAI from 'openai';
import multer from 'multer';
import { 
  insertCompanySchema,
  insertCompanyRequirementsSchema,
  insertContactRequestSchema,
  type Student,
  type StudentWithAssessments,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      // Allow PDF, Word docs, and text files
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type. Only PDF, Word documents, and text files are allowed.'));
      }
    }
  });

  // Auth middleware
  await setupAuth(app);

  // Initialize database with sample data
  await storage.seedInitialData();

  // Personal email domains to block (companies must use work email)
  const PERSONAL_DOMAINS = new Set([
    "gmail.com", "yahoo.com", "yahoo.in", "yahoo.co.in", "yahoo.co.uk",
    "hotmail.com", "hotmail.in", "hotmail.co.in", "outlook.com", "live.com",
    "live.in", "rediffmail.com", "aol.com", "icloud.com", "me.com",
    "ymail.com", "protonmail.com", "tutanota.com", "rocketmail.com",
    "inbox.com", "mail.com", "gmx.com", "gmx.in", "gmail.co.in",
    "msn.com", "pm.me",
  ]);

  // ── In-memory OTP store ──────────────────────────────────────────────
  interface OtpEntry {
    otp: string;
    name: string;
    mobile: string;
    expires: number;   // Unix ms
    attempts: number;
    lastSent: number;  // Unix ms — for resend throttle
  }
  const otpStore = new Map<string, OtpEntry>();

  // Cleanup expired OTPs every 15 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [email, entry] of otpStore.entries()) {
      if (entry.expires < now) otpStore.delete(email);
    }
  }, 15 * 60 * 1000);

  // SendGrid email helper — falls back to console in dev
  async function sendOtpEmail(toEmail: string, otp: string): Promise<void> {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      // Development fallback — print OTP to server console
      console.log(`\n╔══════════════════════════════════════════╗`);
      console.log(`║  [DEV] OTP for ${toEmail.padEnd(26)}║`);
      console.log(`║  Code: ${otp}                              ║`);
      console.log(`╚══════════════════════════════════════════╝\n`);
      return;
    }
    const sgMail = (await import("@sendgrid/mail")).default;
    sgMail.setApiKey(apiKey);
    await sgMail.send({
      to: toEmail,
      from: {
        email: "noreply@nxtwave.tech",
        name: "NxtWave Edge",
      },
      subject: "Your NxtWave Edge access code",
      text: `Your NxtWave Edge verification code is: ${otp}\n\nThis code is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
          <img src="https://nxtwave.tech/logo.png" alt="NxtWave Edge" style="height:32px;margin-bottom:24px" />
          <h2 style="font-size:20px;font-weight:700;color:#0f172a;margin:0 0 8px">Your verification code</h2>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px">Enter this code to access NxtWave Edge. It expires in 10 minutes.</p>
          <div style="background:#f1f5f9;border-radius:12px;padding:24px;text-align:center;letter-spacing:12px;font-size:32px;font-weight:800;color:#1e40af;margin-bottom:24px">
            ${otp}
          </div>
          <p style="color:#94a3b8;font-size:12px;margin:0">If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `,
    });
  }

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Step 1 — validate details and send OTP
  app.post('/api/auth/send-otp', async (req: any, res) => {
    try {
      const { name, email, mobile } = req.body;

      if (!name || !email || !mobile) {
        return res.status(400).json({ message: "Name, work email, and mobile are required." });
      }

      const emailLower = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailLower)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
      }

      const domain = emailLower.split("@")[1];
      if (PERSONAL_DOMAINS.has(domain)) {
        return res.status(400).json({ message: "Please use your company email address. Personal emails are not allowed." });
      }

      const mobileClean = mobile.replace(/\D/g, "");
      if (mobileClean.length < 10) {
        return res.status(400).json({ message: "Please enter a valid 10-digit mobile number." });
      }

      // Resend throttle — 30 seconds between sends
      const existing = otpStore.get(emailLower);
      const now = Date.now();
      if (existing && now - existing.lastSent < 30_000) {
        const waitSec = Math.ceil((30_000 - (now - existing.lastSent)) / 1000);
        return res.status(429).json({ message: `Please wait ${waitSec} seconds before requesting a new code.` });
      }

      // Generate 6-digit OTP
      const otp = String(Math.floor(100000 + Math.random() * 900000));

      otpStore.set(emailLower, {
        otp,
        name: name.trim(),
        mobile: mobileClean,
        expires: now + 10 * 60 * 1000, // 10 minutes
        attempts: 0,
        lastSent: now,
      });

      await sendOtpEmail(emailLower, otp);

      res.json({ sent: true, email: emailLower });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send verification code. Please try again." });
    }
  });

  // Step 2 — verify OTP and create session
  app.post('/api/auth/verify-otp', async (req: any, res) => {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ message: "Email and verification code are required." });
      }

      const emailLower = email.trim().toLowerCase();
      const entry = otpStore.get(emailLower);

      if (!entry) {
        return res.status(400).json({ message: "No verification code found for this email. Please request a new one." });
      }

      if (Date.now() > entry.expires) {
        otpStore.delete(emailLower);
        return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
      }

      entry.attempts += 1;
      if (entry.attempts > 5) {
        otpStore.delete(emailLower);
        return res.status(429).json({ message: "Too many incorrect attempts. Please request a new code." });
      }

      if (otp.trim() !== entry.otp) {
        const remaining = 5 - entry.attempts;
        return res.status(400).json({
          message: remaining > 0
            ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
            : "Incorrect code. Please request a new one.",
        });
      }

      // OTP verified — create/update user and set session
      otpStore.delete(emailLower);

      const nameParts = entry.name.split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      let user = await storage.getUserByEmail(emailLower);
      if (user) {
        user = await storage.updateUser(user.id, {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          mobile: entry.mobile,
          emailVerified: true,
        });
      } else {
        user = await storage.upsertUser({
          email: emailLower,
          firstName,
          lastName,
          mobile: entry.mobile,
          role: "recruiter",
          emailVerified: true,
          onboardingCompleted: true,
        });
      }

      req.session.userId = user.id;
      req.session.save(() => {
        res.json({ user });
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Verification failed. Please try again." });
    }
  });

  // Resend OTP — reuses stored name/mobile, just regenerates and resends
  app.post('/api/auth/resend-otp', async (req: any, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required." });

      const emailLower = email.trim().toLowerCase();
      const existing = otpStore.get(emailLower);

      if (!existing) {
        return res.status(400).json({ message: "Session expired. Please start over." });
      }

      const now = Date.now();
      if (now - existing.lastSent < 30_000) {
        const waitSec = Math.ceil((30_000 - (now - existing.lastSent)) / 1000);
        return res.status(429).json({ message: `Please wait ${waitSec} seconds before requesting a new code.` });
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));
      otpStore.set(emailLower, {
        ...existing,
        otp,
        expires: now + 10 * 60 * 1000,
        attempts: 0,
        lastSent: now,
      });

      await sendOtpEmail(emailLower, otp);
      res.json({ sent: true });
    } catch (error) {
      console.error("Error resending OTP:", error);
      res.status(500).json({ message: "Failed to resend code. Please try again." });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Error during logout:", err);
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Complete recruiter onboarding
  app.put('/api/auth/complete-onboarding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const updateData = {
        collegesTier: req.body.collegesTier,
        annualFresherHires: req.body.annualFresherHires,
        budgetRange: req.body.budgetRange,
        onboardingCompleted: true,
      };
      
      const updatedUser = await storage.updateUser(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Company routes
  app.get('/api/company', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.get('/api/company/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post('/api/company/register', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const companyData = insertCompanySchema.parse({
        ...req.body,
        userId,
      });
      
      const company = await storage.createCompany(companyData);
      res.json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(400).json({ message: "Invalid company data" });
    }
  });

  // Company Requirements routes
  app.get('/api/company/requirements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const requirements = await storage.getCompanyRequirements(company.id);
      res.json(requirements);
    } catch (error) {
      console.error("Error fetching company requirements:", error);
      res.status(500).json({ message: "Failed to fetch company requirements" });
    }
  });

  app.get('/api/company/requirements/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const requirements = await storage.getCompanyRequirementById(id);
      
      if (!requirements) {
        return res.status(404).json({ message: "Requirements not found" });
      }
      
      res.json(requirements);
    } catch (error) {
      console.error("Error fetching company requirements:", error);
      res.status(500).json({ message: "Failed to fetch company requirements" });
    }
  });

  app.post('/api/company/requirements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const requirementsData = insertCompanyRequirementsSchema.parse({
        ...req.body,
        companyId: company.id,
      });
      
      const requirements = await storage.createCompanyRequirements(requirementsData);
      res.json(requirements);
    } catch (error) {
      console.error("Error creating company requirements:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid requirements data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create company requirements" });
      }
    }
  });

  app.put('/api/company/requirements/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Verify that the requirement belongs to this company
      const existingRequirement = await storage.getCompanyRequirementById(id);
      if (!existingRequirement || existingRequirement.companyId !== company.id) {
        return res.status(404).json({ message: "Requirements not found" });
      }

      // Validate the update data using partial schema
      const updateSchema = insertCompanyRequirementsSchema.omit({ companyId: true }).partial();
      const updateData = updateSchema.parse(req.body);
      
      const updatedRequirements = await storage.updateCompanyRequirements(id, updateData);
      res.json(updatedRequirements);
    } catch (error) {
      console.error("Error updating company requirements:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid requirements data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update company requirements" });
      }
    }
  });

  app.delete('/api/company/requirements/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Verify that the requirement belongs to this company
      const existingRequirement = await storage.getCompanyRequirementById(id);
      if (!existingRequirement || existingRequirement.companyId !== company.id) {
        return res.status(404).json({ message: "Requirements not found" });
      }

      await storage.deleteCompanyRequirements(id);
      res.json({ message: "Requirements deleted successfully" });
    } catch (error) {
      console.error("Error deleting company requirements:", error);
      res.status(500).json({ message: "Failed to delete company requirements" });
    }
  });

  // JD Parsing endpoint
  app.post('/api/company/parse-jd', isAuthenticated, async (req: any, res) => {
    try {
      const { jobDescription } = req.body;
      
      if (!jobDescription || typeof jobDescription !== 'string') {
        return res.status(400).json({ message: "Job description is required" });
      }

      const parsedData = await storage.parseJobDescription(jobDescription);
      res.json(parsedData);
    } catch (error) {
      console.error("Error parsing job description:", error);
      res.status(500).json({ message: "Failed to parse job description" });
    }
  });

  // JD File Parsing endpoint
  app.post('/api/company/parse-jd-file', isAuthenticated, upload.single('jdFile'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Extract text content from the uploaded file
      let jobDescription = '';
      
      if (req.file.mimetype === 'text/plain') {
        // Plain text file
        jobDescription = req.file.buffer.toString('utf8');
      } else if (req.file.mimetype === 'application/pdf') {
        // For PDF files, we'd need a PDF parser (like pdf-parse)
        // For now, return an error suggesting text upload
        return res.status(400).json({ 
          message: "PDF parsing not yet implemented. Please copy the text content and use the manual entry option." 
        });
      } else if (
        req.file.mimetype === 'application/msword' || 
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        // For Word docs, we'd need a doc parser (like mammoth)
        // For now, return an error suggesting text upload
        return res.status(400).json({ 
          message: "Word document parsing not yet implemented. Please copy the text content and use the manual entry option." 
        });
      }

      if (!jobDescription || jobDescription.trim().length < 50) {
        return res.status(400).json({ 
          message: "Job description content is too short or empty. Please ensure the file contains a detailed job description." 
        });
      }

      // Parse the extracted job description
      const parsedData = await storage.parseJobDescription(jobDescription.trim());
      
      // Include the original job description in the response
      res.json({
        ...parsedData,
        jobDescription: jobDescription.trim()
      });
    } catch (error) {
      console.error("Error parsing JD file:", error);
      
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ message: "File is too large. Maximum size is 10MB." });
        }
        return res.status(400).json({ message: `File upload error: ${error.message}` });
      }
      
      res.status(500).json({ message: "Failed to parse job description file" });
    }
  });

  // Debug/reload endpoints (unguarded for debugging)
  const BUILD_TS = Date.now();
  
  // Removed _crash endpoint for safety
  
  app.get('/api/_version', (req, res) => {
    res.json({ buildTs: BUILD_TS, env: process.env.NODE_ENV });
  });

  // DB health check endpoint
  app.get('/api/_dbcheck', async (req, res) => {
    try {
      const result = await storage.dbHealthCheck();
      res.json({ status: 'ok', result });
    } catch (error) {
      res.status(500).json({ 
        status: 'error', 
        message: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Student routes (public for preview, protected for full access)
  app.get('/api/students', async (req, res) => {
    try {
      const { 
        skills, 
        location, 
        university, 
        minCgpa, 
        limit = 20, 
        offset = 0 
      } = req.query;

      const filters = {
        skills: skills ? (skills as string).split(',') : undefined,
        location: location as string,
        university: university as string,
        minCgpa: minCgpa ? parseFloat(minCgpa as string) : undefined,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      };

      const students = await storage.getStudents(filters);
      
      // If user is not authenticated, limit the data shown
      const isAuth = req.isAuthenticated?.() || false;
      const limitedStudents = isAuth ? students : students.map(student => ({
        ...student,
        email: undefined,
        phone: undefined,
        resumeUrl: undefined,
        linkedinUrl: undefined,
        githubUrl: undefined,
        bio: student.bio?.substring(0, 100) + "...",
      }));

      res.json(limitedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      
      if (req.query._debug === '1') {
        res.status(500).json({ 
          message: "Failed to fetch students", 
          dev: { 
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : 'No stack trace'
          }
        });
      } else {
        res.status(500).json({ message: "Failed to fetch students" });
      }
    }
  });

  app.get('/api/students/count', async (req, res) => {
    try {
      const { skills, location, university, minCgpa } = req.query;

      const filters = {
        skills: skills ? (skills as string).split(',') : undefined,
        location: location as string,
        university: university as string,
        minCgpa: minCgpa ? parseFloat(minCgpa as string) : undefined,
      };

      console.log("🔍 Count API called with filters:", JSON.stringify(filters, null, 2));
      const count = await storage.getStudentCount(filters);
      res.json({ count });
    } catch (error) {
      console.error("Error counting students:", error);
      
      if (req.query._debug === '1') {
        res.status(500).json({ 
          message: "Failed to count students", 
          dev: { 
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : 'No stack trace'
          }
        });
      } else {
        res.status(500).json({ message: "Failed to count students" });
      }
    }
  });

  // Smart talent discovery endpoint
  app.post('/api/students/smart-discovery', isAuthenticated, async (req, res) => {
    try {
      const {
        role,
        experience = "0-1",
        skills = [],
        minCGPA = 7.0,
        salaryRange = [6, 15],
        locations = [],
        collegePreference = "any",
        urgency = "normal",
        teamSize = 5,
        workMode = "hybrid"
      } = req.body;

      // Log the request for debugging
      console.log("Smart discovery request:", { 
        role, experience, skills, minCGPA, salaryRange, 
        locations, collegePreference, urgency, teamSize, workMode 
      });

      const curatedCandidates = await storage.getSmartCuratedCandidates({
        role,
        experience,
        skills,
        minCGPA,
        salaryRange,
        locations,
        collegePreference,
        urgency,
        teamSize,
        workMode,
        maxResults: 50
      });

      res.json(curatedCandidates);
    } catch (error) {
      console.error("Error in smart discovery:", error);
      res.status(500).json({ message: "Failed to get smart discovery results" });
    }
  });

  // Seed large dataset endpoint (development only)
  app.post('/api/admin/seed-large-dataset', isAuthenticated, async (req, res) => {
    try {
      // Only allow in development environment
      if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ message: "Not allowed in production" });
      }

      // Import and run the seeding function
      const { seedLargeDataset } = await import('./seed-large-dataset');
      await seedLargeDataset();

      res.json({ message: "Large dataset seeded successfully", count: 12000 });
    } catch (error) {
      console.error("Error seeding large dataset:", error);
      res.status(500).json({ message: "Failed to seed large dataset" });
    }
  });

  app.get('/api/students/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const student = await storage.getStudentById(id);
      
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      
      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Failed to fetch student" });
    }
  });

  // Bulk students endpoint for comparison page
  app.post('/api/students/bulk', isAuthenticated, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: "Student IDs are required" });
      }

      if (ids.length > 10) {
        return res.status(400).json({ message: "Maximum 10 students can be fetched at once" });
      }

      // Get student details
      const students = await Promise.all(
        ids.map(id => storage.getStudentById(id.toString()))
      );

      // Filter out any null/undefined students
      const validStudents = students.filter(Boolean);

      res.json(validStudents);
    } catch (error) {
      console.error("Error fetching students in bulk:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Skill routes
  app.get('/api/skills', async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.get('/api/skills/category/:category', async (req, res) => {
    try {
      const { category } = req.params;
      const skills = await storage.getSkillsByCategory(category);
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills by category:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  // Contact request routes
  app.post('/api/contact-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile required" });
      }

      const requestData = insertContactRequestSchema.parse({
        ...req.body,
        companyId: company.id,
      });
      
      const contactRequest = await storage.createContactRequest(requestData);
      res.json(contactRequest);
    } catch (error) {
      console.error("Error creating contact request:", error);
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.get('/api/contact-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile required" });
      }

      const requests = await storage.getContactRequestsByCompany(company.id);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching contact requests:", error);
      res.status(500).json({ message: "Failed to fetch contact requests" });
    }
  });

  app.get('/api/company/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile required" });
      }

      // Return mock stats for now
      const stats = {
        totalViews: 142,
        contactsSent: 28,
        responseRate: 67,
        activeSearches: 5
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching company stats:", error);
      res.status(500).json({ message: "Failed to fetch company stats" });
    }
  });

  // Role matching route
  app.post('/api/role-match/:studentId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile required" });
      }

      const { studentId } = req.params;
      const jobRequirements = req.body; // Optional: { skills, salaryRange, location, role }

      const roleMatch = await storage.calculateRoleMatch(company.id, studentId, jobRequirements);
      res.json(roleMatch);
    } catch (error) {
      console.error("Error calculating role match:", error);
      res.status(500).json({ message: "Failed to calculate role match" });
    }
  });

  // Email sending route for shortlist notifications
  app.post('/api/send-shortlist-email', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile required" });
      }

      const { candidateIds } = req.body;
      
      if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
        return res.status(400).json({ message: "Candidate IDs are required" });
      }

      if (candidateIds.length > 3) {
        return res.status(400).json({ message: "Maximum 3 candidates can be selected" });
      }

      // Get candidate details
      const candidates = await Promise.all(
        candidateIds.map(id => storage.getStudentById(id.toString()))
      );

      // Filter out any null candidates
      const validCandidates = candidates.filter(Boolean);

      if (validCandidates.length === 0) {
        return res.status(404).json({ message: "No valid candidates found" });
      }

      // For now, we'll simulate email sending and log the action
      // In a real implementation, you would integrate with SendGrid or another email service
      console.log(`Sending shortlist emails to ${validCandidates.length} candidates:`);
      validCandidates.forEach((candidate: any) => {
        console.log(`- ${candidate.firstName} ${candidate.lastName} (${candidate.email})`);
      });

      // Create a simple success response
      const emailResults = validCandidates.map((candidate: any) => ({
        candidateId: candidate.id,
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        email: candidate.email,
        status: 'sent',
        message: 'Shortlist notification sent successfully'
      }));

      res.json({
        success: true,
        message: `Shortlist notifications sent to ${validCandidates.length} candidates`,
        results: emailResults
      });
    } catch (error) {
      console.error("Error sending shortlist emails:", error);
      res.status(500).json({ message: "Failed to send shortlist emails" });
    }
  });

  // Student assessment routes
  app.get('/api/student/assessment', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const assessment = await storage.getUserAssessment(userId);
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching student assessment:", error);
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  app.post('/api/student/assessment', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const assessment = await storage.createAssessment({
        userId,
        status: 'in_progress'
      });
      res.json(assessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  app.patch('/api/student/assessment/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const assessment = await storage.updateAssessment(id, updateData);
      res.json(assessment);
    } catch (error) {
      console.error("Error updating assessment:", error);
      res.status(500).json({ message: "Failed to update assessment" });
    }
  });

  // Interview scheduling routes
  app.post("/api/interviews", isAuthenticated, async (req: any, res) => {
    try {
      const companyId = req.session.userId;
      const { studentId, scheduledAt, duration, interviewType, notes, meetingLink } = req.body;
      
      const interview = await storage.createInterview({
        companyId,
        studentId,
        scheduledAt: new Date(scheduledAt),
        duration,
        interviewType,
        notes,
        meetingLink,
        status: "scheduled"
      });
      
      res.status(201).json(interview);
    } catch (error) {
      console.error("Error creating interview:", error);
      res.status(500).json({ message: "Failed to schedule interview" });
    }
  });

  app.get("/api/interviews", isAuthenticated, async (req: any, res) => {
    try {
      const companyId = req.session.userId;
      const interviews = await storage.getInterviewsByCompany(companyId);
      res.json(interviews);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      res.status(500).json({ message: "Failed to fetch interviews" });
    }
  });

  // Message routes
  app.post("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.session.userId;
      const { receiverId, messageType, content, conversationId } = req.body;
      
      const message = await storage.createMessage({
        senderId,
        receiverId,
        messageType,
        content,
        conversationId
      });
      
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { conversationId } = req.query as any;
      
      const messages = await storage.getMessages(userId, conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Code submission routes
  app.get("/api/code-submissions", isAuthenticated, async (req, res) => {
    try {
      const { studentId } = req.query as any;
      
      if (!studentId) {
        return res.status(400).json({ message: "Student ID is required" });
      }
      
      const submissions = await storage.getCodeSubmissions(studentId);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching code submissions:", error);
      res.status(500).json({ message: "Failed to fetch code submissions" });
    }
  });

  app.get("/api/code-submissions/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const submission = await storage.getCodeSubmission(id);
      
      if (!submission) {
        return res.status(404).json({ message: "Code submission not found" });
      }
      
      res.json(submission);
    } catch (error) {
      console.error("Error fetching code submission:", error);
      res.status(500).json({ message: "Failed to fetch code submission" });
    }
  });

  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Chatbot endpoint
  app.post('/api/chatbot', isAuthenticated, async (req: any, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Build system prompt with platform context
      const systemPrompt = `You are NxtWave Assistant, an AI helper for India's premier talent marketplace connecting companies with top 10% freshers.

Platform Overview:
- 1,900+ verified student profiles with comprehensive assessments
- Skills: DSA, Aptitude, Verbal Ability, CS Fundamentals (rated 1-5 stars)
- Smart Discovery: AI-powered talent curation and matching
- Assessment Details: MCQ breakdowns, coding solutions, interview footage
- Role Matching: Percentage-based compatibility analysis

Your Role:
- Help recruiters navigate talent profiles and assessments
- Explain assessment scores and performance metrics
- Guide users through Smart Discovery features
- Provide recruitment insights and candidate selection advice
- Answer questions about platform features

Key Features to Help With:
1. Smart Discovery - AI talent curation based on job requirements
2. Assessment Analysis - DSA, Aptitude, Verbal, CS Fundamentals scores
3. Interview Performance - Video analysis and key checkpoints
4. Role Match Analysis - Why candidates are X% match for roles
5. Candidate Comparison - Side-by-side profile analysis

Context: ${context ? JSON.stringify(context) : 'General platform assistance'}

Be helpful, professional, and focus on recruitment and talent discovery assistance.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that request.";

      res.json({ 
        reply,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({ 
        error: "Sorry, I'm having trouble right now. Please try again in a moment." 
      });
    }
  });

  // Chatbot suggestions endpoint
  app.get('/api/chatbot/suggestions', isAuthenticated, async (req, res) => {
    try {
      const suggestions = [
        "How do I use Smart Discovery to find Java developers?",
        "What does a 72% role match mean?",
        "Explain DSA assessment scores",
        "Show me candidates with 8+ CGPA",
        "How to interpret interview performance?",
        "What makes a strong hire candidate?",
        "Find React developers in Bangalore",
        "Explain Verbal Ability assessment"
      ];

      res.json({ suggestions });
    } catch (error) {
      console.error("Error fetching chatbot suggestions:", error);
      res.status(500).json({ error: "Failed to load suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
