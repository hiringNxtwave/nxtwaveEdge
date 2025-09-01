import {
  users,
  companies,
  students,
  skills,
  studentSkills,
  projects,
  contactRequests,
  type User,
  type UpsertUser,
  type Company,
  type InsertCompany,
  type Student,
  type InsertStudent,
  type Skill,
  type InsertSkill,
  type StudentSkill,
  type InsertStudentSkill,
  type Project,
  type InsertProject,
  type ContactRequest,
  type InsertContactRequest,
  type StudentWithSkills,
  type CompanyWithUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, gte, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Company operations
  getCompanyByUserId(userId: string): Promise<CompanyWithUser | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company>;
  
  // Student operations
  getStudents(filters?: {
    skills?: string[];
    location?: string;
    university?: string;
    minCgpa?: number;
    limit?: number;
    offset?: number;
  }): Promise<StudentWithSkills[]>;
  getStudentById(id: string): Promise<StudentWithSkills | undefined>;
  getStudentCount(filters?: {
    skills?: string[];
    location?: string;
    university?: string;
    minCgpa?: number;
  }): Promise<number>;
  
  // Skill operations
  getSkills(): Promise<Skill[]>;
  getSkillsByCategory(category: string): Promise<Skill[]>;
  
  // Contact request operations
  createContactRequest(request: InsertContactRequest): Promise<ContactRequest>;
  getContactRequestsByCompany(companyId: string): Promise<ContactRequest[]>;
  updateContactRequestStatus(id: string, status: string): Promise<ContactRequest>;
  
  // Initial data seeding
  seedInitialData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Company operations
  async getCompanyByUserId(userId: string): Promise<CompanyWithUser | undefined> {
    const [result] = await db
      .select()
      .from(companies)
      .innerJoin(users, eq(companies.userId, users.id))
      .where(eq(companies.userId, userId));
    
    if (!result) return undefined;
    
    return {
      ...result.companies,
      user: result.users,
    };
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db
      .insert(companies)
      .values(company)
      .returning();
    return newCompany;
  }

  async updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company> {
    const [updatedCompany] = await db
      .update(companies)
      .set({ ...company, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany;
  }

  // Student operations
  async getStudents(filters?: {
    skills?: string[];
    location?: string;
    university?: string;
    minCgpa?: number;
    limit?: number;
    offset?: number;
  }): Promise<StudentWithSkills[]> {
    let query = db
      .select()
      .from(students)
      .leftJoin(studentSkills, eq(students.id, studentSkills.studentId))
      .leftJoin(skills, eq(studentSkills.skillId, skills.id))
      .leftJoin(projects, eq(students.id, projects.studentId));

    if (filters?.location) {
      query = query.where(ilike(students.location, `%${filters.location}%`));
    }
    
    if (filters?.university) {
      query = query.where(ilike(students.university, `%${filters.university}%`));
    }
    
    if (filters?.minCgpa) {
      query = query.where(gte(students.cgpa, filters.minCgpa.toString()));
    }

    query = query
      .orderBy(desc(students.cgpa))
      .limit(filters?.limit || 20)
      .offset(filters?.offset || 0);

    const results = await query;
    
    // Group results by student
    const studentMap = new Map<string, StudentWithSkills>();
    
    for (const row of results) {
      const student = row.students;
      if (!studentMap.has(student.id)) {
        studentMap.set(student.id, {
          ...student,
          skills: [],
          projects: [],
        });
      }
      
      const studentData = studentMap.get(student.id)!;
      
      if (row.student_skills && row.skills) {
        const existingSkill = studentData.skills.find(s => s.skillId === row.student_skills!.skillId);
        if (!existingSkill) {
          studentData.skills.push({
            ...row.student_skills,
            skill: row.skills,
          });
        }
      }
      
      if (row.projects) {
        const existingProject = studentData.projects.find(p => p.id === row.projects!.id);
        if (!existingProject) {
          studentData.projects.push(row.projects);
        }
      }
    }
    
    return Array.from(studentMap.values());
  }

  async getStudentById(id: string): Promise<StudentWithSkills | undefined> {
    const results = await db
      .select()
      .from(students)
      .leftJoin(studentSkills, eq(students.id, studentSkills.studentId))
      .leftJoin(skills, eq(studentSkills.skillId, skills.id))
      .leftJoin(projects, eq(students.id, projects.studentId))
      .where(eq(students.id, id));

    if (results.length === 0) return undefined;

    const student = results[0].students;
    const studentData: StudentWithSkills = {
      ...student,
      skills: [],
      projects: [],
    };

    for (const row of results) {
      if (row.student_skills && row.skills) {
        const existingSkill = studentData.skills.find(s => s.skillId === row.student_skills!.skillId);
        if (!existingSkill) {
          studentData.skills.push({
            ...row.student_skills,
            skill: row.skills,
          });
        }
      }
      
      if (row.projects) {
        const existingProject = studentData.projects.find(p => p.id === row.projects!.id);
        if (!existingProject) {
          studentData.projects.push(row.projects);
        }
      }
    }

    return studentData;
  }

  async getStudentCount(filters?: {
    skills?: string[];
    location?: string;
    university?: string;
    minCgpa?: number;
  }): Promise<number> {
    let query = db.select({ count: sql`count(*)` }).from(students);

    if (filters?.location) {
      query = query.where(ilike(students.location, `%${filters.location}%`));
    }
    
    if (filters?.university) {
      query = query.where(ilike(students.university, `%${filters.university}%`));
    }
    
    if (filters?.minCgpa) {
      query = query.where(gte(students.cgpa, filters.minCgpa.toString()));
    }

    const [result] = await query;
    return Number(result.count);
  }

  // Skill operations
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(asc(skills.name));
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.category, category))
      .orderBy(asc(skills.name));
  }

  // Contact request operations
  async createContactRequest(request: InsertContactRequest): Promise<ContactRequest> {
    const [newRequest] = await db
      .insert(contactRequests)
      .values(request)
      .returning();
    return newRequest;
  }

  async getContactRequestsByCompany(companyId: string): Promise<ContactRequest[]> {
    return await db
      .select()
      .from(contactRequests)
      .where(eq(contactRequests.companyId, companyId))
      .orderBy(desc(contactRequests.createdAt));
  }

  async updateContactRequestStatus(id: string, status: string): Promise<ContactRequest> {
    const [updatedRequest] = await db
      .update(contactRequests)
      .set({ status, updatedAt: new Date() })
      .where(eq(contactRequests.id, id))
      .returning();
    return updatedRequest;
  }

  // Initial data seeding
  async seedInitialData(): Promise<void> {
    // Check if data already exists
    const existingSkills = await db.select().from(skills).limit(1);
    if (existingSkills.length > 0) return;

    // Seed skills
    const skillData = [
      { name: "JavaScript", category: "technical" },
      { name: "Python", category: "technical" },
      { name: "Java", category: "technical" },
      { name: "React", category: "technical" },
      { name: "Node.js", category: "technical" },
      { name: "Machine Learning", category: "technical" },
      { name: "Data Science", category: "technical" },
      { name: "AWS", category: "technical" },
      { name: "Docker", category: "technical" },
      { name: "MongoDB", category: "technical" },
      { name: "Communication", category: "soft" },
      { name: "Leadership", category: "soft" },
      { name: "Problem Solving", category: "soft" },
      { name: "Teamwork", category: "soft" },
      { name: "Time Management", category: "soft" },
    ];

    await db.insert(skills).values(skillData);

    // Seed sample students
    const studentData = [
      {
        firstName: "Arjun",
        lastName: "Sharma",
        email: "arjun.sharma@email.com",
        university: "IIT Delhi",
        degree: "Bachelor of Technology",
        major: "Computer Science",
        graduationYear: 2024,
        cgpa: "9.2",
        location: "New Delhi",
        bio: "Passionate software developer with expertise in full-stack development and machine learning.",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      },
      {
        firstName: "Priya",
        lastName: "Patel",
        email: "priya.patel@email.com",
        university: "BITS Pilani",
        degree: "Bachelor of Engineering",
        major: "Information Technology",
        graduationYear: 2024,
        cgpa: "8.8",
        location: "Bangalore",
        bio: "Backend developer specializing in Java and cloud technologies.",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200&h=200&fit=crop&crop=face",
      },
      {
        firstName: "Rahul",
        lastName: "Krishna",
        email: "rahul.krishna@email.com",
        university: "NIT Trichy",
        degree: "Bachelor of Technology",
        major: "Electronics Engineering",
        graduationYear: 2024,
        cgpa: "9.0",
        location: "Chennai",
        bio: "Electronics engineer with focus on IoT and embedded systems.",
        profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      },
    ];

    const insertedStudents = await db.insert(students).values(studentData).returning();
    const allSkills = await db.select().from(skills);

    // Seed student skills
    const studentSkillData = [];
    for (const student of insertedStudents) {
      // Add random skills for each student
      const studentSkillIds = allSkills.slice(0, Math.floor(Math.random() * 5) + 3);
      for (const skill of studentSkillIds) {
        studentSkillData.push({
          studentId: student.id,
          skillId: skill.id,
          proficiencyLevel: Math.floor(Math.random() * 3) + 3, // 3-5
          assessmentScore: Math.floor(Math.random() * 20) + 80, // 80-100
          verified: true,
        });
      }
    }

    await db.insert(studentSkills).values(studentSkillData);

    // Seed sample projects
    const projectData = [
      {
        studentId: insertedStudents[0].id,
        title: "AI-powered Recommendation System",
        description: "Built a machine learning recommendation engine using Python and TensorFlow",
        technologies: JSON.stringify(["Python", "TensorFlow", "Flask", "MongoDB"]),
        githubUrl: "https://github.com/arjun/recommendation-system",
        featured: true,
      },
      {
        studentId: insertedStudents[1].id,
        title: "Microservices E-commerce Platform",
        description: "Developed a scalable e-commerce platform using Spring Boot microservices",
        technologies: JSON.stringify(["Java", "Spring Boot", "Docker", "AWS"]),
        githubUrl: "https://github.com/priya/ecommerce-platform",
        featured: true,
      },
      {
        studentId: insertedStudents[2].id,
        title: "Smart Home Automation System",
        description: "IoT-based home automation using Arduino and Raspberry Pi",
        technologies: JSON.stringify(["C++", "Arduino", "Raspberry Pi", "IoT"]),
        githubUrl: "https://github.com/rahul/smart-home",
        featured: true,
      },
    ];

    await db.insert(projects).values(projectData);
  }
}

export const storage = new DatabaseStorage();
