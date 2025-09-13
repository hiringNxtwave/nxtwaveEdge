import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import OpenAI from 'openai';
import { 
  insertCompanySchema,
  insertContactRequestSchema,
  type Student,
  type StudentWithAssessments,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Initialize database with sample data
  await storage.seedInitialData();

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Complete recruiter onboarding
  app.put('/api/auth/complete-onboarding', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.get('/api/company/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post('/api/company/register', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  // Debug/reload endpoints (unguarded for debugging)
  const BUILD_TS = Date.now();
  
  // Removed _crash endpoint for safety
  
  app.get('/api/_version', (req, res) => {
    res.json({ buildTs: BUILD_TS, env: process.env.NODE_ENV });
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

      const count = await storage.getStudentCount(filters);
      res.json({ count });
    } catch (error) {
      console.error("Error counting students:", error);
      res.status(500).json({ message: "Failed to count students" });
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const assessment = await storage.getUserAssessment(userId);
      res.json(assessment);
    } catch (error) {
      console.error("Error fetching student assessment:", error);
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  app.post('/api/student/assessment', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const companyId = req.user.claims.sub;
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
      const companyId = req.user.claims.sub;
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
      const senderId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
