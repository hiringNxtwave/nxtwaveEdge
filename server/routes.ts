import type { Express } from "express";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { db } from "./db";
import { otpCodes } from "@shared/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import OpenAI from 'openai';
import multer from 'multer';
import { upsertContact, upsertCompany, associateContactWithCompany, createDeal } from "./hubspot";
import { 
  insertCompanySchema,
  insertCompanyRequirementsSchema,
  insertContactRequestSchema,
  type Student,
  type StudentWithAssessments,
} from "@shared/schema";
import { z } from "zod";

// Lazy-loaded pdf-parse (avoids createRequire issues in ESM bundles)
let _pdfParse: ((buffer: Buffer) => Promise<{ text: string }>) | null = null;
async function getPdfParse() {
  if (!_pdfParse) {
    const mod = await import('pdf-parse');
    _pdfParse = (mod as any).default || mod;
  }
  return _pdfParse;
}

export async function registerRoutes(app: Express): Promise<void> {
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

  // Personal / free / academic email domains to block
  const BLOCKED_DOMAINS = new Set([
    // Gmail — exact + common typos
    "gmail.com", "gmail.co", "gmail.net", "gmail.co.in",
    "gmai.com", "gmal.com", "gmial.com", "gmali.com", "gmall.com",
    "gmeil.com", "gemail.com", "googmail.com", "googlemail.com",
    // Yahoo — exact + common typos
    "yahoo.com", "yahoo.in", "yahoo.co.in", "yahoo.co.uk",
    "yaho.com", "yahooo.com", "yahoomail.com", "yahoo.com.in",
    "ymail.com", "rocketmail.com",
    // Outlook / Hotmail / Live / MSN / Windows
    "outlook.com", "outlook.in", "outlook.co.in",
    "hotmail.com", "hotmail.in", "hotmail.co.in", "hotmail.co.uk",
    "live.com", "live.in", "live.co.in", "live.co.uk",
    "msn.com", "windowslive.com",
    // Other major free providers
    "rediffmail.com", "rediff.com",
    "aol.com", "aim.com",
    "icloud.com", "me.com", "mac.com",
    "protonmail.com", "protonmail.ch", "pm.me",
    "tutanota.com", "tutanota.de", "tutamail.com", "tuta.io",
    "inbox.com", "mail.com", "gmx.com", "gmx.in", "gmx.net", "gmx.de",
    "zohomail.com", "zoho.com",
    "yandex.com", "yandex.ru",
    "fastmail.com", "fastmail.fm",
    "guerrillamail.com", "tempmail.com", "throwam.com",
  ]);

  // Academic + government TLD suffixes to block
  const BLOCKED_SUFFIXES = [
    ".edu", ".ac.in", ".edu.in", ".ac.uk", ".edu.au",
    ".ac.nz", ".edu.sg", ".ac.id", ".edu.pk", ".ac.za",
    ".gov.in", ".gov.com", ".nic.in",
  ];

  function isBlockedEmail(email: string): string | null {
    const d = email.trim().toLowerCase().split("@")[1] || "";
    if (BLOCKED_DOMAINS.has(d)) {
      return "Personal email addresses are not accepted. Please use your company email.";
    }
    for (const suffix of BLOCKED_SUFFIXES) {
      if (d === suffix.slice(1) || d.endsWith(suffix)) {
        return "Academic and government email addresses are not accepted. Please use your company email.";
      }
    }
    return null;
  }

  // ── Database-backed OTP store ──────────────────────────────────────────────
  // Uses the otp_codes table for persistence across serverless cold starts

  // Cleanup expired OTPs (best-effort, runs periodically)
  setInterval(async () => {
    try {
      await db.delete(otpCodes).where(
        and(
          eq(otpCodes.isUsed, false),
          gt(new Date(), otpCodes.expiresAt)
        )
      );
    } catch (err) {
      // Ignore cleanup errors
    }
  }, 15 * 60 * 1000);

  // SendGrid suppression cleaner — removes an email from bounce/block lists before sending
  async function clearSendGridSuppression(email: string, apiKey: string): Promise<void> {
    const headers = { Authorization: `Bearer ${apiKey}` };
    const encoded = encodeURIComponent(email);
    // Clear bounces and blocks in parallel; 404 = not suppressed, which is fine
    await Promise.allSettled([
      fetch(`https://api.sendgrid.com/v3/suppression/bounces/${encoded}`, { method: "DELETE", headers }),
      fetch(`https://api.sendgrid.com/v3/suppression/blocks/${encoded}`,  { method: "DELETE", headers }),
      fetch(`https://api.sendgrid.com/v3/suppression/invalid_emails/${encoded}`, { method: "DELETE", headers }),
    ]);
  }

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

    // Clear any prior bounce/block suppression so the email can be delivered
    await clearSendGridSuppression(toEmail, apiKey);

    const sgMail = (await import("@sendgrid/mail")).default;
    sgMail.setApiKey(apiKey);
    try {
      await sgMail.send({
        to: toEmail,
        from: {
          email: "girish@nxtwave.info",
          name: "NxtWave Edge",
        },
        replyTo: {
          email: "girish@nxtwave.info",
          name: "NxtWave Edge Support",
        },
        subject: "Your NxtWave Edge verification code: " + otp,
        headers: {
          "X-Priority": "1",
          "X-Mailer": "NxtWave Edge Mailer",
          "List-Unsubscribe": "<mailto:girish@nxtwave.info?subject=unsubscribe>",
        },
        text: `Hi,\n\nYour NxtWave Edge verification code is: ${otp}\n\nThis code is valid for 10 minutes. Do not share it with anyone.\n\nIf you did not request this code, you can safely ignore this email.\n\n---\nNxtWave Edge — India's Pre-Assessed Talent Marketplace\nhttps://nxtwave.info`,
        html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0">
    <tr><td align="center">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden">
        <!-- Header -->
        <tr>
          <td style="background:#1d4ed8;padding:24px 32px">
            <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px">NxtWave Edge</p>
            <p style="margin:4px 0 0;color:#bfdbfe;font-size:12px">India's Pre-Assessed Talent Marketplace</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a">Verification Code</p>
            <p style="margin:0 0 24px;font-size:14px;color:#64748b;line-height:1.6">
              Use the code below to sign in to your NxtWave Edge account. This code expires in <strong>10 minutes</strong>.
            </p>
            <div style="background:#eff6ff;border:2px dashed #bfdbfe;border-radius:12px;padding:28px 24px;text-align:center;margin-bottom:24px">
              <p style="margin:0 0 4px;font-size:11px;font-weight:600;color:#3b82f6;letter-spacing:1px;text-transform:uppercase">Your one-time code</p>
              <p style="margin:0;font-size:40px;font-weight:800;color:#1d4ed8;letter-spacing:14px;font-variant-numeric:tabular-nums">${otp}</p>
            </div>
            <p style="margin:0 0 24px;font-size:13px;color:#64748b;line-height:1.6">
              Enter this code on the NxtWave Edge sign-in page. Do not share this code with anyone.
            </p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px">
            <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6">
              If you didn't request this code, someone may have entered your email by mistake. You can safely ignore this email — your account remains secure.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0">
            <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center">
              NxtWave Edge &bull; This is an automated transactional email &bull; Please do not reply
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      });
    } catch (sgErr: any) {
      const errBody = sgErr?.response?.body;
      console.error("SendGrid error body:", JSON.stringify(errBody, null, 2));
      throw sgErr;
    }
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

  // Step 1 — validate email and send OTP (name/mobile optional; captured post-login)
  app.post('/api/auth/send-otp', async (req: any, res) => {
    try {
      const { name, email, mobile } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Work email is required." });
      }

      const emailLower = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailLower)) {
        return res.status(400).json({ message: "Please enter a valid email address." });
      }

      const emailError = isBlockedEmail(emailLower);
      if (emailError) {
        return res.status(400).json({ message: emailError });
      }

      const mobileClean = mobile ? mobile.replace(/\D/g, "") : "";

      // Check for recent OTP (resend throttle — 30 seconds between sends)
      const now = new Date();
      const recentOtp = await db.select().from(otpCodes)
        .where(
          and(
            eq(otpCodes.email, emailLower),
            eq(otpCodes.isUsed, false)
          )
        )
        .orderBy(desc(otpCodes.createdAt))
        .limit(1);

      if (recentOtp.length > 0) {
        const lastSent = recentOtp[0].createdAt?.getTime() || 0;
        const timeSinceLastSent = now.getTime() - lastSent;
        if (timeSinceLastSent < 30_000) {
          const waitSec = Math.ceil((30_000 - timeSinceLastSent) / 1000);
          return res.status(429).json({ message: `Please wait ${waitSec} seconds before requesting a new code.` });
        }
      }

      // Generate 6-digit OTP
      const otp = String(Math.floor(100000 + Math.random() * 900000));

      // Store OTP in database
      await db.insert(otpCodes).values({
        email: emailLower,
        code: otp,
        hashedCode: otp, // In production, hash this with bcrypt
        purpose: "login",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        attemptsCount: 0,
        maxAttempts: 5,
        deliveryStatus: "pending",
      });

      await sendOtpEmail(emailLower, otp);

      res.json({ sent: true, email: emailLower });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send verification code. Please try again." });
    }
  });

  // Profile update — called after OTP verification to capture name/company/mobile
  app.patch('/api/auth/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { name, mobile, company } = req.body;
      const nameParts = (name || "").trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      const mobileClean = mobile ? mobile.replace(/\D/g, "") : undefined;
      const updated = await storage.updateUser(userId, {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(mobileClean && { mobile: mobileClean }),
        onboardingCompleted: true,
      });
      // Store company name in session for display
      if (company) {
        (req.session as any).companyName = company.trim();
        await new Promise<void>(r => req.session.save(() => r()));
      }

      // Sync to HubSpot CRM — errors are logged but do not block the response
      try {
        const userRecord = await storage.getUser(userId);
        if (userRecord?.email) {
          const domain = userRecord.email.split("@")[1];
          const companyName = company?.trim() || domain;
          const [contactId, companyId] = await Promise.all([
            upsertContact(userRecord.email, firstName || userRecord.firstName || "", lastName || userRecord.lastName || "", mobileClean || userRecord.mobile || undefined),
            upsertCompany(domain, companyName),
          ]);
          await associateContactWithCompany(contactId, companyId);
        }
      } catch (hubspotErr) {
        console.error("HubSpot profile sync error:", hubspotErr);
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating profile:", error?.message || error);
      res.status(500).json({ message: "Failed to save profile.", detail: String(error?.message || error) });
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

      // Find the latest unused OTP for this email
      const otpRecord = await db.select().from(otpCodes)
        .where(
          and(
            eq(otpCodes.email, emailLower),
            eq(otpCodes.isUsed, false),
            eq(otpCodes.purpose, "login")
          )
        )
        .orderBy(desc(otpCodes.createdAt))
        .limit(1);

      if (otpRecord.length === 0) {
        return res.status(400).json({ message: "No verification code found for this email. Please request a new one." });
      }

      const entry = otpRecord[0];

      // Check if OTP has expired
      if (entry.expiresAt && new Date() > entry.expiresAt) {
        await db.delete(otpCodes).where(eq(otpCodes.id, entry.id));
        return res.status(400).json({ message: "Verification code has expired. Please request a new one." });
      }

      // Check attempts limit
      const currentAttempts = entry.attemptsCount || 0;
      const maxAttempts = entry.maxAttempts || 5;

      if (currentAttempts >= maxAttempts) {
        await db.delete(otpCodes).where(eq(otpCodes.id, entry.id));
        return res.status(429).json({ message: "Too many incorrect attempts. Please request a new code." });
      }

      // Increment attempts
      await db.update(otpCodes)
        .set({ attemptsCount: currentAttempts + 1 })
        .where(eq(otpCodes.id, entry.id));

      // Verify OTP code
      if (otp.trim() !== entry.code) {
        const remaining = maxAttempts - currentAttempts - 1;
        return res.status(400).json({
          message: remaining > 0
            ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
            : "Incorrect code. Please request a new one.",
        });
      }

      // OTP verified — delete the OTP record and create/update user
      await db.delete(otpCodes).where(eq(otpCodes.id, entry.id));

      // Extract name from email or use default
      const nameParts = (entry.email || "").split("@")[0].split(/[._-]/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      let user = await storage.getUserByEmail(emailLower);
      if (user) {
        user = await storage.updateUser(user.id, {
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          emailVerified: true,
        });
      } else {
        user = await storage.upsertUser({
          email: emailLower,
          firstName,
          lastName,
          role: "recruiter",
          emailVerified: true,
          onboardingCompleted: false,
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

  // Resend OTP — delete old OTPs and create new one
  app.post('/api/auth/resend-otp', async (req: any, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email is required." });

      const emailLower = email.trim().toLowerCase();

      // Find the latest OTP for this email
      const recentOtp = await db.select().from(otpCodes)
        .where(
          and(
            eq(otpCodes.email, emailLower),
            eq(otpCodes.isUsed, false)
          )
        )
        .orderBy(desc(otpCodes.createdAt))
        .limit(1);

      if (recentOtp.length === 0) {
        return res.status(400).json({ message: "Session expired. Please start over." });
      }

      // Check resend throttle (30 seconds)
      const now = new Date();
      const lastSent = recentOtp[0].createdAt?.getTime() || 0;
      const timeSinceLastSent = now.getTime() - lastSent;
      if (timeSinceLastSent < 30_000) {
        const waitSec = Math.ceil((30_000 - timeSinceLastSent) / 1000);
        return res.status(429).json({ message: `Please wait ${waitSec} seconds before requesting a new code.` });
      }

      // Delete old OTPs for this email
      await db.delete(otpCodes).where(
        and(
          eq(otpCodes.email, emailLower),
          eq(otpCodes.isUsed, false)
        )
      );

      // Generate new OTP
      const otp = String(Math.floor(100000 + Math.random() * 900000));

      // Store new OTP in database
      await db.insert(otpCodes).values({
        email: emailLower,
        code: otp,
        hashedCode: otp, // In production, hash this with bcrypt
        purpose: "login",
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        attemptsCount: 0,
        maxAttempts: 5,
        deliveryStatus: "pending",
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
        return res.json([]);
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
      let company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        const user = await storage.getUser(userId);
        const email = user?.email || '';
        const domain = email.split('@')[1] || 'unknown.com';
        const domainRoot = domain.split('.')[0] || 'Company';
        const companyName = domainRoot.charAt(0).toUpperCase() + domainRoot.slice(1);
        company = await storage.createCompany({ userId, name: companyName });
      }

      // Auto-fill required fields that the simplified form does not collect
      const rawBody = {
        jobDescription: req.body.jobTitle || 'Open position',
        hiresExpected: 1,
        ...req.body,
        companyId: company.id,
      };
      if (rawBody.minimumCGPA != null && rawBody.minimumCGPA !== "") {
        rawBody.minimumCGPA = String(rawBody.minimumCGPA);
      } else {
        delete rawBody.minimumCGPA;
      }
      const requirementsData = insertCompanyRequirementsSchema.parse(rawBody);
      
      const requirements = await storage.createCompanyRequirements(requirementsData);

      // Sync deal to HubSpot CRM — errors are logged but do not block the response
      try {
        const userRecord = await storage.getUser(userId);
        if (userRecord?.email) {
          const domain = userRecord.email.split("@")[1];
          const companyName = company.name || domain;
          const [contactId, companyId] = await Promise.all([
            upsertContact(userRecord.email, userRecord.firstName || "", userRecord.lastName || "", userRecord.mobile || undefined),
            upsertCompany(domain, companyName),
          ]);
          await associateContactWithCompany(contactId, companyId);
          await createDeal(requirements.jobTitle, contactId, companyId);
        }
      } catch (hubspotErr) {
        console.error("HubSpot deal sync error:", hubspotErr);
      }

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
      const rawUpdate = { ...req.body };
      if (rawUpdate.minimumCGPA != null && rawUpdate.minimumCGPA !== "") {
        rawUpdate.minimumCGPA = String(rawUpdate.minimumCGPA);
      } else {
        delete rawUpdate.minimumCGPA;
      }
      const updateData = updateSchema.parse(rawUpdate);
      
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

  // Contact inquiry — send notification email to NxtWave team
  app.post('/api/contact-inquiry', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const { studentId, jobContext } = req.body;

      const [user, student] = await Promise.all([
        storage.getUser(userId),
        studentId ? storage.getStudentById(studentId) : Promise.resolve(null),
      ]);

      const recruiterName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Unknown';
      const recruiterEmail = user?.email || 'Unknown';
      const recruiterPhone = user?.mobile || 'Not provided';
      const recruiterCompany = recruiterEmail.includes('@') ? recruiterEmail.split('@')[1] : 'Unknown';
      const candidateName = student ? `${student.firstName} ${student.lastName}` : `Student #${studentId}`;
      const candidateUniversity = (student as any)?.university || 'N/A';
      const candidateRecommendation = (student as any)?.recommendation || 'N/A';
      const candidateScore = (student as any)?.overallAssessmentScore ?? 'N/A';

      const subject = `NxtWave Edge: Interest in ${candidateName}`;
      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#0f172a">
          <h2 style="font-size:20px;font-weight:700;margin:0 0 4px">New Candidate Interest — NxtWave Edge</h2>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px">A recruiter has expressed interest in a candidate on the platform.</p>

          <div style="background:#f8fafc;border-radius:10px;padding:18px;margin-bottom:16px">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;margin:0 0 12px">Recruiter</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:3px 0;color:#64748b;width:130px">Name</td><td style="padding:3px 0;font-weight:600">${recruiterName}</td></tr>
              <tr><td style="padding:3px 0;color:#64748b">Email</td><td style="padding:3px 0;font-weight:600">${recruiterEmail}</td></tr>
              <tr><td style="padding:3px 0;color:#64748b">Phone</td><td style="padding:3px 0;font-weight:600">${recruiterPhone}</td></tr>
              <tr><td style="padding:3px 0;color:#64748b">Company</td><td style="padding:3px 0;font-weight:600">${recruiterCompany}</td></tr>
            </table>
          </div>

          <div style="background:#eff6ff;border-radius:10px;padding:18px;margin-bottom:16px">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#93c5fd;margin:0 0 12px">Candidate</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:3px 0;color:#64748b;width:130px">Name</td><td style="padding:3px 0;font-weight:600">${candidateName}</td></tr>
              <tr><td style="padding:3px 0;color:#64748b">University</td><td style="padding:3px 0;font-weight:600">${candidateUniversity}</td></tr>
              <tr><td style="padding:3px 0;color:#64748b">Recommendation</td><td style="padding:3px 0;font-weight:600">${candidateRecommendation}</td></tr>
              <tr><td style="padding:3px 0;color:#64748b">Score</td><td style="padding:3px 0;font-weight:600">${candidateScore}/100</td></tr>
            </table>
          </div>

          ${jobContext ? `
          <div style="background:#f0fdf4;border-radius:10px;padding:18px;margin-bottom:16px">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#86efac;margin:0 0 8px">Job</p>
            <p style="font-size:14px;margin:0;font-weight:600">${jobContext}</p>
          </div>
          ` : ''}

          <p style="color:#94a3b8;font-size:12px;margin:24px 0 0">Sent from NxtWave Edge · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
      `;

      const apiKey = process.env.SENDGRID_API_KEY;
      if (apiKey) {
        const sgMail = (await import("@sendgrid/mail")).default;
        sgMail.setApiKey(apiKey);
        await sgMail.send({
          to: 'sagar.mood@nxtwave.co.in',
          from: { email: 'girish@nxtwave.info', name: 'NxtWave Edge' },
          subject,
          html,
          text: `Recruiter ${recruiterName} (${recruiterEmail}, ${recruiterPhone}) is interested in ${candidateName} from ${candidateUniversity}. Recommendation: ${candidateRecommendation}. Score: ${candidateScore}/100.${jobContext ? ` Job: ${jobContext}` : ''}`,
        });
      } else {
        console.log(`[DEV] Contact inquiry: ${recruiterName} (${recruiterEmail}) → ${candidateName}`);
      }

      res.json({ sent: true });
    } catch (error) {
      console.error("Error sending contact inquiry:", error);
      res.status(500).json({ message: "Failed to send inquiry" });
    }
  });

  // General "Contact Us" from sidebar — sends recruiter info to Sagar automatically
  app.post('/api/contact-general', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.session.userId;
      const user = await storage.getUser(userId);

      const recruiterName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Unknown';
      const recruiterEmail = user?.email || 'Unknown';
      const recruiterPhone = user?.mobile || 'Not provided';
      const recruiterCompany = recruiterEmail.includes('@') ? recruiterEmail.split('@')[1] : 'Unknown';

      const subject = `NxtWave Edge: General Enquiry from ${recruiterName}`;
      const html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#0f172a">
          <h2 style="font-size:20px;font-weight:700;margin:0 0 4px">General Enquiry — NxtWave Edge</h2>
          <p style="color:#64748b;font-size:14px;margin:0 0 24px">A recruiter has clicked <strong>Contact Us</strong> on the platform and wants to get in touch.</p>
          <div style="background:#f8fafc;border-radius:10px;padding:18px;margin-bottom:16px">
            <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;margin:0 0 12px">Recruiter Details</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:4px 0;color:#64748b;width:130px">Name</td><td style="padding:4px 0;font-weight:600">${recruiterName}</td></tr>
              <tr><td style="padding:4px 0;color:#64748b">Email</td><td style="padding:4px 0;font-weight:600">${recruiterEmail}</td></tr>
              <tr><td style="padding:4px 0;color:#64748b">Phone</td><td style="padding:4px 0;font-weight:600">${recruiterPhone}</td></tr>
              <tr><td style="padding:4px 0;color:#64748b">Company Domain</td><td style="padding:4px 0;font-weight:600">${recruiterCompany}</td></tr>
            </table>
          </div>
          <p style="color:#94a3b8;font-size:12px;margin:24px 0 0">Sent from NxtWave Edge · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
      `;

      const apiKey = process.env.SENDGRID_API_KEY;
      if (apiKey) {
        const sgMail = (await import("@sendgrid/mail")).default;
        sgMail.setApiKey(apiKey);
        await sgMail.send({
          to: 'sagar.mood@nxtwave.co.in',
          from: { email: 'girish@nxtwave.info', name: 'NxtWave Edge' },
          subject,
          html,
          text: `General enquiry from ${recruiterName} (${recruiterEmail}, ${recruiterPhone}) at ${recruiterCompany}. Please follow up.`,
        });
      } else {
        console.log(`[DEV] General contact: ${recruiterName} (${recruiterEmail})`);
      }

      res.json({ sent: true });
    } catch (error) {
      console.error("Error sending general contact inquiry:", error);
      res.status(500).json({ message: "Failed to send enquiry" });
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
        try {
          const pdfData = await (await getPdfParse())(req.file.buffer);
          jobDescription = pdfData.text;
        } catch (pdfErr) {
          console.error("PDF parse error:", pdfErr);
          return res.status(400).json({ message: "Could not read the PDF. Please ensure it is a text-based PDF (not scanned) or paste the JD manually." });
        }
      } else if (
        req.file.mimetype === 'application/msword' || 
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        return res.status(400).json({ 
          message: "Word documents are not supported yet. Please upload a PDF or paste the JD text manually." 
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

  // Public sample student endpoint — no auth required
  app.get('/api/public/sample-student', async (req, res) => {
    try {
      // Pin to a specific top-scoring student for a consistent, high-quality preview
      const SAMPLE_ID = '44fcef27-f630-4430-a126-1356916b97c3';
      let student = await storage.getStudentById(SAMPLE_ID);
      if (!student) {
        const results = await storage.getStudents({ recommendation: 'Strong Hire', limit: 1, offset: 0 });
        student = results[0] ?? null;
      }
      if (!student) return res.status(404).json({ message: "No sample available" });
      // Return a curated subset — no contact info
      res.json({
        id: student.id,
        fullName: `${student.firstName} ${student.lastName.charAt(0)}.`,
        university: student.university,
        location: student.location,
        major: student.major,
        recommendation: student.recommendation,
        overallAssessmentScore: student.overallAssessmentScore,
        dsaScore: student.dsaScore,
        csFundamentalsScore: student.csFundamentalsScore,
        aptitudeScore: student.aptitudeScore,
        preferredRoles: student.preferredRoles,
        cgpa: student.cgpa,
        graduationYear: student.graduationYear,
      });
    } catch (error) {
      console.error("Error fetching sample student:", error);
      res.status(500).json({ message: "Failed to fetch sample student" });
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
        recommendation,
        name,
        minScore,
        limit = 20, 
        offset = 0 
      } = req.query;

      const filters = {
        skills: skills ? (skills as string).split(',') : undefined,
        location: location as string,
        university: university as string,
        minCgpa: minCgpa ? parseFloat(minCgpa as string) : undefined,
        recommendation: recommendation as string || undefined,
        name: name as string || undefined,
        minScore: minScore ? parseInt(minScore as string) : undefined,
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
      const { skills, location, university, minCgpa, recommendation, name, minScore } = req.query;

      const filters = {
        skills: skills ? (skills as string).split(',') : undefined,
        location: location as string,
        university: university as string,
        minCgpa: minCgpa ? parseFloat(minCgpa as string) : undefined,
        recommendation: recommendation as string || undefined,
        name: name as string || undefined,
        minScore: minScore ? parseInt(minScore as string) : undefined,
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

  // Universities list for filter dropdown
  app.get('/api/universities', async (req, res) => {
    try {
      const { db } = await import('./db');
      const { students: studentsTable } = await import('@shared/schema');
      const results = await db
        .selectDistinct({ university: studentsTable.university })
        .from(studentsTable)
        .orderBy(studentsTable.university);
      const unis = results.map(r => r.university).filter(Boolean).sort();
      res.json(unis);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch universities' });
    }
  });

  // Job match endpoint — scores all 327 students against a job posting
  app.post('/api/students/job-match', isAuthenticated, async (req: any, res) => {
    try {
      const { role, location, salary } = req.body as { role: string; location: string; salary: number };
      if (!role) return res.status(400).json({ message: "role is required" });

      const allStudents = await storage.getStudents({ limit: 500, offset: 0 });

      const roleTokens = role.toLowerCase().split(/[\s,/\-_]+/).filter(t => t.length > 1);
      const salaryNum = Number(salary) || 0;

      const scored = allStudents.map((s: any) => {
        // 1. Assessment base score (0–40 pts)
        const assessBase = Math.round((s.overallAssessmentScore ?? 50) * 0.4);

        // 2. Recommendation tier (0–30 pts)
        const recScore =
          s.recommendation === "Strong Hire" ? 30 :
          s.recommendation === "Hire"        ? 20 :
          s.recommendation === "Weak Hire"   ? 10 : 5;

        // 3. Salary tier adjustment (–15 to 0)
        let salaryAdj = 0;
        if (salaryNum >= 10) {
          if (s.recommendation === "Weak Hire") salaryAdj = -15;
          else if (s.recommendation === "Hire")  salaryAdj = -5;
        } else if (salaryNum >= 6) {
          if (s.recommendation === "Weak Hire") salaryAdj = -5;
        }

        // 4. Role keyword match against preferredRoles/strengths (0–20 pts)
        let roleScore = 0;
        try {
          const pRoles: string[] = JSON.parse(s.preferredRoles || "[]");
          const combined = pRoles.join(" ").toLowerCase();
          const hits = roleTokens.filter(t => combined.includes(t));
          roleScore = Math.min(20, hits.length * 6);
        } catch { /* ignore */ }

        // 5. Location match against student's actual city (0–10 pts)
        // Normalise both sides: bangalore = bengaluru, lowercase, trim
        const normalize = (c: string) => c.toLowerCase().trim()
          .replace("bengaluru", "bangalore")
          .replace("visakhapatnam", "vizag");
        const locLower = normalize(location || "");
        const studentCity = normalize(s.location || "");
        let locScore = 0;
        if (locLower === "" || locLower === "remote" || locLower === "anywhere") {
          locScore = 10; // no city preference → everyone qualifies fully
        } else if (studentCity === "india" || studentCity === "") {
          locScore = 5; // student open to anywhere / city not specified
        } else if (studentCity === locLower) {
          locScore = 10; // exact city match
        } else if (studentCity.includes(locLower) || locLower.includes(studentCity)) {
          locScore = 5; // partial match (e.g. "new delhi" vs "delhi")
        }

        const total = Math.max(0, Math.min(100, assessBase + recScore + salaryAdj + roleScore + locScore));
        return { ...s, matchScore: total };
      });

      scored.sort((a: any, b: any) => b.matchScore - a.matchScore);
      res.json(scored.slice(0, 60));
    } catch (error) {
      console.error("Job match error:", error);
      res.status(500).json({ message: "Failed to match candidates" });
    }
  });

  // Job match by job requirement ID — extends the existing job-match scoring engine
  // with the full requirement fields (skills, minCGPA, preferredColleges, experienceLevel).
  app.post('/api/students/job-match-by-id', isAuthenticated, async (req: any, res) => {
    try {
      const { jobId } = req.body as { jobId: string };
      if (!jobId) return res.status(400).json({ message: "jobId is required" });

      const jobReq = await storage.getCompanyRequirementById(jobId);
      if (!jobReq) return res.status(404).json({ message: "Job requirement not found" });

      // Verify that the job requirement belongs to the authenticated recruiter's company
      const userId = req.session.userId;
      const company = await storage.getCompanyByUserId(userId);
      if (!company || jobReq.companyId !== company.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const allStudents = await storage.getStudents({ limit: 500, offset: 0 });

      // Build the same role/location/salary inputs used by the existing job-match engine
      const role = jobReq.jobTitle || "";
      const location = jobReq.jobLocation || "";
      // salaryMax is stored in thousands (e.g. 800 = 8 LPA); existing engine expects LPA
      const salary = jobReq.salaryMax ? Number(jobReq.salaryMax) / 100 : 0;

      // Extended fields — additional to the basic job-match engine
      let requiredSkills: string[] = [];
      try { requiredSkills = JSON.parse(jobReq.requiredSkills || "[]"); } catch { /* ignore */ }

      let preferredColleges: string[] = [];
      try {
        const raw = jobReq.preferredColleges || "";
        if (raw.startsWith("[")) {
          preferredColleges = JSON.parse(raw);
        } else if (raw.trim()) {
          preferredColleges = raw.split(/[,;]+/).map((s: string) => s.trim().toLowerCase()).filter(Boolean);
        }
      } catch { /* ignore */ }

      const minCGPA = jobReq.minimumCGPA ? Number(jobReq.minimumCGPA) : 0;
      const experienceLevel = jobReq.experienceLevel || "fresher";

      // ── Reuse the same scoring algorithm as /api/students/job-match ──
      const roleTokens = role.toLowerCase().split(/[\s,/\-_]+/).filter((t: string) => t.length > 1);
      // Extend role tokens with required skills for keyword matching
      const skillTokens = requiredSkills.map((s: string) => s.toLowerCase());
      const allRoleTokens = [...new Set([...roleTokens, ...skillTokens])];
      const salaryNum = Number(salary) || 0;
      const locLower = location.toLowerCase().trim();

      const scored = allStudents.map((s: any) => {
        // 1. Assessment base score (0–40 pts) — same as existing job-match
        const assessBase = Math.round((s.overallAssessmentScore ?? 50) * 0.4);

        // 2. Recommendation tier (0–30 pts) — same as existing job-match
        const recScore =
          s.recommendation === "Strong Hire" ? 30 :
          s.recommendation === "Hire"        ? 20 :
          s.recommendation === "Weak Hire"   ? 10 : 5;

        // 3. Salary tier adjustment (–15 to 0) — same as existing job-match
        let salaryAdj = 0;
        if (salaryNum >= 10) {
          if (s.recommendation === "Weak Hire") salaryAdj = -15;
          else if (s.recommendation === "Hire")  salaryAdj = -5;
        } else if (salaryNum >= 6) {
          if (s.recommendation === "Weak Hire") salaryAdj = -5;
        }

        // 4. Role + skills keyword match against preferredRoles (0–20 pts)
        // Extended: includes requiredSkills tokens alongside role name tokens
        let roleScore = 0;
        try {
          const pRoles: string[] = JSON.parse(s.preferredRoles || "[]");
          const combined = pRoles.join(" ").toLowerCase();
          const hits = allRoleTokens.filter((t: string) => combined.includes(t));
          roleScore = Math.min(20, hits.length * 6);
        } catch { /* ignore */ }

        // 5. Location match against student's actual city (0–10 pts)
        const normalizeCity = (c: string) => c.toLowerCase().trim()
          .replace("bengaluru", "bangalore")
          .replace("visakhapatnam", "vizag");
        const studentCity2 = normalizeCity(s.location || "");
        const jobCity2 = normalizeCity(locLower);
        let locScore = 0;
        if (jobCity2 === "" || jobCity2 === "remote" || jobCity2 === "anywhere") {
          locScore = 10;
        } else if (studentCity2 === "india" || studentCity2 === "") {
          locScore = 5;
        } else if (studentCity2 === jobCity2) {
          locScore = 10;
        } else if (studentCity2.includes(jobCity2) || jobCity2.includes(studentCity2)) {
          locScore = 5;
        }

        // Extended: CGPA filter — applied as a bonus/penalty on top of existing score
        let cgpaAdj = 0;
        if (minCGPA > 0 && s.cgpa) {
          const studentCgpa = Number(s.cgpa);
          if (studentCgpa < minCGPA) {
            cgpaAdj = -15; // penalty for not meeting minimum CGPA
          } else if (studentCgpa >= minCGPA + 0.5) {
            cgpaAdj = 3; // small bonus for exceeding threshold
          }
        }

        // Extended: Preferred colleges match — additional bonus
        let collegeAdj = 0;
        if (preferredColleges.length > 0 && s.university) {
          const univLower = s.university.toLowerCase();
          if (preferredColleges.some((c: string) => univLower.includes(c) || c.includes(univLower.split(" ")[0]))) {
            collegeAdj = 5;
          }
        }

        // Extended: Experience level — bonus for fresher roles since students are fresh grads
        let expAdj = 0;
        if (experienceLevel === "fresher" || experienceLevel === "0-1") {
          expAdj = 2;
        }

        const total = Math.max(0, Math.min(100,
          assessBase + recScore + salaryAdj + roleScore + locScore + cgpaAdj + collegeAdj + expAdj
        ));
        return { ...s, matchScore: total };
      });

      scored.sort((a: any, b: any) => b.matchScore - a.matchScore);
      res.json({
        students: scored.slice(0, 60),
        job: {
          id: jobReq.id,
          jobTitle: jobReq.jobTitle,
          jobLocation: jobReq.jobLocation,
          salaryMin: jobReq.salaryMin,
          salaryMax: jobReq.salaryMax,
          experienceLevel: jobReq.experienceLevel,
        },
      });
    } catch (error) {
      console.error("Job match by ID error:", error);
      res.status(500).json({ message: "Failed to match candidates" });
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

  // Chatbot endpoint
  app.post('/api/chatbot', isAuthenticated, async (req: any, res) => {
    try {
      const { message, context } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Lazy-init OpenAI client (only needed when chatbot is called)
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

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

}
