import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertCompanySchema,
  insertContactRequestSchema,
  type Student,
  type StudentWithSkills,
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

  // Company routes
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
      res.status(500).json({ message: "Failed to fetch students" });
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

  const httpServer = createServer(app);
  return httpServer;
}
