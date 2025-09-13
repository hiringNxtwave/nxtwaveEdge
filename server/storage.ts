import {
  users,
  companies,
  students,
  skills,
  studentSkills,
  projects,
  contactRequests,
  assessments,
  assessmentQuestions,
  assessmentResponses,
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
  type StudentWithAssessments,
  type CompanyWithUser,
  type Assessment,
  type InsertAssessment,
  type AssessmentQuestion,
  type InsertAssessmentQuestion,
  type AssessmentResponse,
  type InsertAssessmentResponse,
  type AssessmentWithResponses,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, gte, desc, asc, sql, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, user: Partial<UpsertUser>): Promise<User>;
  
  // Company operations
  getCompanyByUserId(userId: string): Promise<CompanyWithUser | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company>;
  
  // Student operations
  getStudents(filters?: {
    skills?: string[];
    assessmentCriteria?: {
      minDsaScore?: number;
      minCsFundamentalsScore?: number;
      minAptitudeScore?: number;
      minVerbalScore?: number;
      minOverallScore?: number;
    };
    location?: string;
    university?: string;
    minCgpa?: number;
    limit?: number;
    offset?: number;
  }): Promise<StudentWithAssessments[]>;
  getStudentById(id: string): Promise<StudentWithAssessments | undefined>;
  getStudentCount(filters?: {
    skills?: string[];
    assessmentCriteria?: {
      minDsaScore?: number;
      minCsFundamentalsScore?: number;
      minAptitudeScore?: number;
      minVerbalScore?: number;
      minOverallScore?: number;
    };
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
  
  // Assessment operations
  getUserAssessment(userId: string): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: string, assessment: Partial<InsertAssessment>): Promise<Assessment>;
  getAssessmentQuestions(category?: string): Promise<AssessmentQuestion[]>;
  createAssessmentResponse(response: InsertAssessmentResponse): Promise<AssessmentResponse>;
  getAssessmentWithResponses(id: string): Promise<AssessmentWithResponses | undefined>;
  
  // Interview operations
  createInterview(data: any): Promise<any>;
  getInterviewsByCompany(companyId: string): Promise<any[]>;

  // Message operations
  createMessage(data: any): Promise<any>;
  getMessages(userId: string, conversationId?: string): Promise<any[]>;

  // Code submission operations
  getCodeSubmissions(studentId: string): Promise<any[]>;
  getCodeSubmission(id: string): Promise<any>;

  // Role matching operations
  calculateRoleMatch(companyId: string, studentId: string, jobRequirements?: {
    assessmentCriteria?: {
      minDsaScore?: number;
      minCsFundamentalsScore?: number;
      minAptitudeScore?: number;
      minVerbalScore?: number;
      minOverallScore?: number;
    };
    skills?: string[]; // For backward compatibility
    salaryRange?: { min: number; max: number };
    location?: string;
    role?: string;
  }): Promise<{
    matchPercentage: number;
    salaryRecommendation: { min: number; max: number };
    preferenceMatches: {
      salary: boolean;
      location: boolean;
      role: boolean;
    };
    explanation: string;
  }>;

  // Smart talent discovery operations
  getSmartCuratedCandidates(requirements: {
    role: string;
    experience: string;
    assessmentCriteria?: {
      minDsaScore?: number;
      minCsFundamentalsScore?: number;
      minAptitudeScore?: number;
      minVerbalScore?: number;
      minOverallScore?: number;
    };
    skills?: string[]; // For backward compatibility
    minCGPA: number;
    salaryRange: [number, number];
    locations: string[];
    collegePreference: string;
    urgency: string;
    teamSize: number;
    workMode: string;
    maxResults: number;
  }): Promise<StudentWithAssessments[]>;

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

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
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

  // Helper function to determine assessment level based on scores
  private getAssessmentLevel(overallScore?: number | null, dsaScore?: number | null, csFundamentalsScore?: number | null, aptitudeScore?: number | null, verbalScore?: number | null): 'Excellent' | 'Strong' | 'Good' | 'Needs Improvement' | 'Not Assessed' {
    const score = overallScore ?? ((dsaScore || 0) + (csFundamentalsScore || 0) + (aptitudeScore || 0) + (verbalScore || 0)) / 4;
    
    if (!score || score === 0) return 'Not Assessed';
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Strong';
    if (score >= 55) return 'Good';
    return 'Needs Improvement';
  }

  // Student operations
  async getStudents(filters?: {
    skills?: string[];
    assessmentCriteria?: {
      minDsaScore?: number;
      minCsFundamentalsScore?: number;
      minAptitudeScore?: number;
      minVerbalScore?: number;
      minOverallScore?: number;
    };
    location?: string;
    university?: string;
    minCgpa?: number;
    limit?: number;
    offset?: number;
  }): Promise<StudentWithAssessments[]> {
    try {
      console.log("🔍 getStudents called with filters:", JSON.stringify(filters, null, 2));
    const whereConditions = [];
    
    if (filters?.location) {
      whereConditions.push(ilike(students.location, `%${filters.location}%`));
    }
    
    if (filters?.university) {
      whereConditions.push(ilike(students.university, `%${filters.university}%`));
    }
    
    if (filters?.minCgpa) {
      whereConditions.push(sql`${students.cgpa} ~ '^[0-9]+(\.[0-9]+)?$' AND NULLIF(${students.cgpa}, '')::numeric >= ${filters.minCgpa}`);
    }

    let baseQuery = db
      .select()
      .from(students)
      .leftJoin(projects, eq(students.id, projects.studentId));

    // Add skills filtering by joining with studentSkills table
    if (filters?.skills && filters.skills.length > 0) {
      baseQuery = baseQuery
        .leftJoin(studentSkills, eq(students.id, studentSkills.studentId))
        .leftJoin(skills, eq(studentSkills.skillId, skills.id));
      whereConditions.push(inArray(skills.name, filters.skills));
    }

    const results = whereConditions.length > 0
      ? await baseQuery
          .where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions))
          .orderBy(sql`NULLIF(${students.cgpa}, '')::numeric DESC NULLS LAST`)
          .limit(filters?.limit || 20)
          .offset(filters?.offset || 0)
      : await baseQuery
          .orderBy(sql`NULLIF(${students.cgpa}, '')::numeric DESC NULLS LAST`)
          .limit(filters?.limit || 20)
          .offset(filters?.offset || 0);

    
    // Group results by student
    const studentMap = new Map<string, StudentWithAssessments>();
    
    for (const row of results) {
      const student = row.students;
      if (!studentMap.has(student.id)) {
        studentMap.set(student.id, {
          ...student,
          projects: [],
          fullName: `${student.firstName} ${student.lastName}`,
          institution: student.university || 'Unknown Institution',
          course: `${student.degree || 'Unknown'} in ${student.major || 'Unknown'}`,
          assessmentLevel: this.getAssessmentLevel(
            student.overallAssessmentScore, 
            student.dsaScore, 
            student.csFundamentalsScore, 
            student.aptitudeScore, 
            student.verbalCommunicationScore
          ),
        });
      }
      
      const studentData = studentMap.get(student.id)!;
      
      if (row.projects) {
        const existingProject = studentData.projects.find(p => p.id === row.projects!.id);
        if (!existingProject) {
          studentData.projects.push(row.projects);
        }
      }
    }
    
    const result = Array.from(studentMap.values());
    console.log(`✅ getStudents returning ${result.length} students`);
    return result;
    } catch (error) {
      console.error("❌ Error in getStudents:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
  }

  async getStudentById(id: string): Promise<StudentWithAssessments | undefined> {
    const results = await db
      .select()
      .from(students)
      .leftJoin(projects, eq(students.id, projects.studentId))
      .where(eq(students.id, id));

    if (results.length === 0) return undefined;

    const student = results[0].students;
    const studentData: StudentWithAssessments = {
      ...student,
      projects: [],
      fullName: `${student.firstName} ${student.lastName}`,
      institution: student.university || 'Unknown Institution',
      course: `${student.degree || 'Unknown'} in ${student.major || 'Unknown'}`,
      assessmentLevel: this.getAssessmentLevel(
        student.overallAssessmentScore, 
        student.dsaScore, 
        student.csFundamentalsScore, 
        student.aptitudeScore, 
        student.verbalCommunicationScore
      ),
    };

    for (const row of results) {
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
    const whereConditions = [];
    
    if (filters?.location) {
      whereConditions.push(ilike(students.location, `%${filters.location}%`));
    }
    
    if (filters?.university) {
      whereConditions.push(ilike(students.university, `%${filters.university}%`));
    }
    
    if (filters?.minCgpa) {
      whereConditions.push(sql`${students.cgpa} ~ '^[0-9]+(\.[0-9]+)?$' AND NULLIF(${students.cgpa}, '')::numeric >= ${filters.minCgpa}`);
    }

    // Add skills filtering by joining with studentSkills table
    if (filters?.skills && filters.skills.length > 0) {
      const baseCountQuery = db
        .select({ count: sql`count(distinct ${students.id})` })
        .from(students)
        .leftJoin(studentSkills, eq(students.id, studentSkills.studentId))
        .leftJoin(skills, eq(studentSkills.skillId, skills.id));
      whereConditions.push(inArray(skills.name, filters.skills));
      
      const [result] = whereConditions.length > 0
        ? await baseCountQuery.where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions))
        : await baseCountQuery;
      return Number(result.count);
    }

    // Simple count query without skills filtering
    const baseCountQuery = db.select({ count: sql`count(*)` }).from(students);
    
    const [result] = whereConditions.length > 0
      ? await baseCountQuery.where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions))
      : await baseCountQuery;
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

  // Assessment operations
  async getUserAssessment(userId: string): Promise<Assessment | undefined> {
    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt))
      .limit(1);
    return assessment;
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db
      .insert(assessments)
      .values(assessment)
      .returning();
    return newAssessment;
  }

  async updateAssessment(id: string, assessment: Partial<InsertAssessment>): Promise<Assessment> {
    const [updatedAssessment] = await db
      .update(assessments)
      .set({ ...assessment, updatedAt: new Date() })
      .where(eq(assessments.id, id))
      .returning();
    return updatedAssessment;
  }

  async getAssessmentQuestions(category?: string): Promise<AssessmentQuestion[]> {
    return category
      ? await db.select().from(assessmentQuestions).where(eq(assessmentQuestions.category, category))
      : await db.select().from(assessmentQuestions);
  }

  async createAssessmentResponse(response: InsertAssessmentResponse): Promise<AssessmentResponse> {
    const [newResponse] = await db
      .insert(assessmentResponses)
      .values(response)
      .returning();
    return newResponse;
  }

  async getAssessmentWithResponses(id: string): Promise<AssessmentWithResponses | undefined> {
    const results = await db
      .select()
      .from(assessments)
      .leftJoin(assessmentResponses, eq(assessments.id, assessmentResponses.assessmentId))
      .leftJoin(assessmentQuestions, eq(assessmentResponses.questionId, assessmentQuestions.id))
      .where(eq(assessments.id, id));

    if (results.length === 0) return undefined;

    const assessment = results[0].assessments;
    const assessmentData: AssessmentWithResponses = {
      ...assessment,
      responses: [],
    };

    for (const row of results) {
      if (row.assessment_responses && row.assessment_questions) {
        assessmentData.responses.push({
          ...row.assessment_responses,
          question: row.assessment_questions,
        });
      }
    }

    return assessmentData;
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
      { name: "Angular", category: "technical" },
      { name: "Vue.js", category: "technical" },
      { name: "TypeScript", category: "technical" },
      { name: "C++", category: "technical" },
      { name: "C#", category: "technical" },
      { name: "Go", category: "technical" },
      { name: "Rust", category: "technical" },
      { name: "Kotlin", category: "technical" },
      { name: "Swift", category: "technical" },
      { name: "Flutter", category: "technical" },
      { name: "React Native", category: "technical" },
      { name: "Django", category: "technical" },
      { name: "Flask", category: "technical" },
      { name: "Spring Boot", category: "technical" },
      { name: "Express.js", category: "technical" },
      { name: "PostgreSQL", category: "technical" },
      { name: "MySQL", category: "technical" },
      { name: "Redis", category: "technical" },
      { name: "Elasticsearch", category: "technical" },
      { name: "Kubernetes", category: "technical" },
      { name: "Azure", category: "technical" },
      { name: "GCP", category: "technical" },
      { name: "DevOps", category: "technical" },
      { name: "CI/CD", category: "technical" },
      { name: "Git", category: "technical" },
      { name: "Blockchain", category: "technical" },
      { name: "Cybersecurity", category: "technical" },
      { name: "IoT", category: "technical" },
      { name: "Android Development", category: "technical" },
      { name: "iOS Development", category: "technical" },
      { name: "Web Development", category: "technical" },
      { name: "UI/UX Design", category: "technical" },
      { name: "Communication", category: "soft" },
      { name: "Leadership", category: "soft" },
      { name: "Problem Solving", category: "soft" },
      { name: "Teamwork", category: "soft" },
      { name: "Time Management", category: "soft" },
      { name: "Project Management", category: "soft" },
      { name: "Critical Thinking", category: "soft" },
      { name: "Adaptability", category: "soft" },
    ];

    await db.insert(skills).values(skillData);

    // Generate 100+ diverse student profiles
    const firstNames = [
      "Arjun", "Priya", "Rahul", "Ananya", "Vikash", "Shreya", "Karthik", "Aditi", "Rohan", "Meera",
      "Aryan", "Divya", "Siddharth", "Kavya", "Aarav", "Neha", "Aditya", "Pooja", "Varun", "Sneha",
      "Aman", "Ritika", "Nikhil", "Ishita", "Abhishek", "Sakshi", "Harsh", "Nidhi", "Rajesh", "Swati",
      "Gaurav", "Kritika", "Amit", "Deepika", "Ravi", "Preeti", "Ajay", "Shweta", "Suresh", "Sunita",
      "Dev", "Isha", "Akash", "Pallavi", "Vinay", "Bhavya", "Mohit", "Tanvi", "Sameer", "Riya",
      "Ashish", "Megha", "Manoj", "Sonal", "Rohit", "Kavita", "Sandeep", "Priyanka", "Yogesh", "Shradha",
      "Vivek", "Anjali", "Naveen", "Sapna", "Ramesh", "Geeta", "Arun", "Madhu", "Jatin", "Rekha",
      "Deepak", "Nisha", "Sanjay", "Lata", "Rakesh", "Veena", "Mukesh", "Kiran", "Pankaj", "Suman",
      "Sunil", "Usha", "Vishal", "Jyoti", "Anil", "Sunaina", "Pramod", "Vandana", "Manish", "Ritu",
      "Kamal", "Seema", "Rajeev", "Pinki", "Sachin", "Monika", "Narayan", "Laxmi", "Dinesh", "Radha"
    ];

    const lastNames = [
      "Sharma", "Patel", "Singh", "Kumar", "Gupta", "Agarwal", "Verma", "Joshi", "Reddy", "Nair",
      "Iyer", "Chopra", "Malhotra", "Rao", "Shah", "Bansal", "Saxena", "Tiwari", "Pandey", "Mishra",
      "Srivastava", "Mathur", "Jain", "Aggarwal", "Goel", "Mittal", "Singhal", "Goyal", "Arora", "Kapoor",
      "Mehta", "Dutta", "Bhattacharya", "Mukherjee", "Ghosh", "Roy", "Das", "Bose", "Saha", "Sen",
      "Chatterjee", "Banerjee", "Chakraborty", "Majumdar", "Sarkar", "Ganguly", "Paul", "Biswas", "Mitra", "Dey"
    ];

    const universities = [
      "IIT Delhi", "IIT Bombay", "IIT Madras", "IIT Kanpur", "IIT Kharagpur", "IIT Roorkee", "IIT Guwahati", "IIT Hyderabad",
      "BITS Pilani", "BITS Goa", "BITS Hyderabad", "NIT Trichy", "NIT Warangal", "NIT Surathkal", "NIT Calicut", "NIT Durgapur",
      "IIIT Hyderabad", "IIIT Bangalore", "IIIT Delhi", "IIIT Allahabad", "Delhi University", "Mumbai University", "Pune University",
      "Anna University", "Jadavpur University", "Calcutta University", "Bangalore University", "Osmania University",
      "VIT Vellore", "VIT Chennai", "SRM University", "Manipal Institute", "PES University", "RV College", "BMS College",
      "PSG College", "Coimbatore Institute", "Thapar University", "LPU", "Amity University", "Shiv Nadar University"
    ];

    const locations = [
      "New Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Kolkata", "Ahmedabad", "Surat", "Jaipur",
      "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Vadodara", "Firozabad", "Ludhiana",
      "Rajkot", "Agra", "Siliguri", "Nashik", "Faridabad", "Patiala", "Ghaziabad", "Kalyan", "Dombivli", "Howrah",
      "Ranchi", "Raipur", "Kota", "Gwalior", "Chandigarh", "Noida", "Gurgaon", "Coimbatore", "Madurai", "Kochi"
    ];

    const majors = [
      "Computer Science", "Information Technology", "Electronics Engineering", "Mechanical Engineering", "Civil Engineering",
      "Electrical Engineering", "Chemical Engineering", "Biotechnology", "Data Science", "Artificial Intelligence",
      "Cybersecurity", "Software Engineering", "Aerospace Engineering", "Automobile Engineering", "Industrial Engineering",
      "Environmental Engineering", "Materials Science", "Telecommunications", "Robotics", "Biomedical Engineering"
    ];

    const degrees = [
      "Bachelor of Technology", "Bachelor of Engineering", "Bachelor of Computer Applications", "Bachelor of Science",
      "Master of Technology", "Master of Computer Applications", "Master of Science"
    ];

    const profileImages = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=200&h=200&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face"
    ];

    const bioTemplates = [
      "Passionate software developer with expertise in full-stack development and machine learning.",
      "Backend developer specializing in microservices and cloud technologies.",
      "Front-end enthusiast with focus on React and modern web development.",
      "Data scientist with expertise in ML, AI, and big data analytics.",
      "Mobile app developer passionate about creating user-friendly applications.",
      "DevOps engineer with experience in containerization and CI/CD pipelines.",
      "Cybersecurity specialist focusing on network security and ethical hacking.",
      "AI researcher with interest in computer vision and natural language processing.",
      "Blockchain developer with experience in smart contracts and DeFi applications.",
      "IoT engineer specializing in embedded systems and sensor networks."
    ];

    // Create high-quality targeted profiles first (these will have high JD match)
    const highMatchProfiles = [
      {
        firstName: "Arjun", lastName: "Sharma", university: "IIT Delhi", degree: "B.Tech", major: "Computer Science",
        cgpa: "9.2", codingRating: 5, location: "Delhi", graduationYear: 2024,
        bio: "Full-stack developer with 2+ years of experience in React, Node.js, and cloud technologies. Strong problem-solving skills and passionate about building scalable applications.",
        profileImageUrl: profileImages[0]
      },
      {
        firstName: "Priya", lastName: "Patel", university: "IIT Bombay", degree: "B.Tech", major: "Computer Science",
        cgpa: "9.0", codingRating: 5, location: "Mumbai", graduationYear: 2024,
        bio: "Software engineer specializing in backend development, microservices, and DevOps. Experience with Java, Spring Boot, Docker, and Kubernetes.",
        profileImageUrl: profileImages[1]
      },
      {
        firstName: "Rahul", lastName: "Kumar", university: "BITS Pilani", degree: "B.Tech", major: "Computer Science",
        cgpa: "8.8", codingRating: 5, location: "Bangalore", graduationYear: 2024,
        bio: "Frontend specialist with expertise in React, TypeScript, and modern web technologies. Strong focus on user experience and performance optimization.",
        profileImageUrl: profileImages[2]
      },
      {
        firstName: "Sneha", lastName: "Reddy", university: "IIT Madras", degree: "B.Tech", major: "Computer Science",
        cgpa: "9.1", codingRating: 5, location: "Chennai", graduationYear: 2024,
        bio: "Data engineer with experience in Python, Apache Spark, and cloud platforms. Skilled in building data pipelines and machine learning systems.",
        profileImageUrl: profileImages[3]
      },
      {
        firstName: "Vikram", lastName: "Singh", university: "IIT Kanpur", degree: "B.Tech", major: "Computer Science",
        cgpa: "8.9", codingRating: 4, location: "Pune", graduationYear: 2024,
        bio: "Mobile app developer with expertise in React Native and Flutter. Experience in building cross-platform applications with clean architecture.",
        profileImageUrl: profileImages[4]
      },
      {
        firstName: "Ananya", lastName: "Joshi", university: "NIT Trichy", degree: "B.Tech", major: "Computer Science",
        cgpa: "8.7", codingRating: 4, location: "Bangalore", graduationYear: 2024,
        bio: "AI/ML enthusiast with hands-on experience in TensorFlow, PyTorch, and computer vision. Strong mathematical background and research experience.",
        profileImageUrl: profileImages[5]
      }
    ];

    const studentData = [];
    
    // Add high-match profiles
    for (let i = 0; i < highMatchProfiles.length; i++) {
      const profile = highMatchProfiles[i];
      studentData.push({
        ...profile,
        email: `${profile.firstName.toLowerCase()}.${profile.lastName.toLowerCase()}@email.com`,
        cgpa: profile.cgpa,
      });
    }

    // Generate remaining random profiles
    for (let i = highMatchProfiles.length; i < 520; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const university = universities[Math.floor(Math.random() * universities.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const major = majors[Math.floor(Math.random() * majors.length)];
      const degree = degrees[Math.floor(Math.random() * degrees.length)];
      const profileImage = profileImages[Math.floor(Math.random() * profileImages.length)];
      const bio = bioTemplates[Math.floor(Math.random() * bioTemplates.length)];
      
      // Generate CGPA between 7.0 and 9.8
      const cgpa = (Math.random() * 2.8 + 7.0).toFixed(2);
      
      // Generate coding rating (1-5 stars), with bias towards higher ratings
      const codingRating = Math.floor(Math.random() * 5) + 1;
      
      // Graduation years between 2023-2025
      const graduationYear = 2023 + Math.floor(Math.random() * 3);

      studentData.push({
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
        university,
        degree,
        major,
        graduationYear,
        cgpa,
        codingRating,
        location,
        bio,
        profileImageUrl: profileImage,
      });
    }

    const insertedStudents = await db.insert(students).values(studentData).returning();
    const allSkills = await db.select().from(skills);

    // Seed student skills
    const studentSkillData = [];
    
    // Define high-demand skills for better matching
    const highDemandSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'Git',
      'TypeScript', 'Docker', 'AWS', 'Spring Boot', 'MongoDB', 'PostgreSQL'
    ];
    
    for (let i = 0; i < insertedStudents.length; i++) {
      const student = insertedStudents[i];
      
      if (i < highMatchProfiles.length) {
        // For high-match profiles, assign specific high-demand skills with high proficiency
        const targetSkills = allSkills.filter(skill => 
          highDemandSkills.includes(skill.name)
        ).slice(0, 8); // Give them 8 high-demand skills
        
        for (const skill of targetSkills) {
          studentSkillData.push({
            studentId: student.id,
            skillId: skill.id,
            proficiencyLevel: 5, // Expert level
            assessmentScore: Math.floor(Math.random() * 10) + 90, // 90-100
            verified: true,
          });
        }
      } else {
        // For other students, add random skills
        const randomSkills = allSkills.slice(0, Math.floor(Math.random() * 5) + 3);
        for (const skill of randomSkills) {
          studentSkillData.push({
            studentId: student.id,
            skillId: skill.id,
            proficiencyLevel: Math.floor(Math.random() * 3) + 3, // 3-5
            assessmentScore: Math.floor(Math.random() * 20) + 80, // 80-100
            verified: true,
          });
        }
      }
    }

    await db.insert(studentSkills).values(studentSkillData);

    // Seed sample projects
    const projectData = [];
    
    // High-quality projects for top candidates
    const topProjects = [
      {
        title: "E-commerce Platform with Microservices",
        description: "Built a scalable e-commerce platform using React, Node.js, and Docker. Implemented payment integration, real-time notifications, and deployed on AWS with CI/CD pipeline.",
        technologies: JSON.stringify(["React", "Node.js", "MongoDB", "Docker", "AWS", "PayPal API"]),
        githubUrl: "https://github.com/arjun/ecommerce-platform"
      },
      {
        title: "AI-Powered Recommendation System",
        description: "Developed a machine learning recommendation engine using Python, TensorFlow, and deployed as REST API. Achieved 94% accuracy in user preference prediction.",
        technologies: JSON.stringify(["Python", "TensorFlow", "Flask", "PostgreSQL", "Docker"]),
        githubUrl: "https://github.com/priya/recommendation-ai"
      },
      {
        title: "Real-time Chat Application",
        description: "Created a responsive chat app with real-time messaging, file sharing, and group chat features using React, Socket.io, and MongoDB. Supports 1000+ concurrent users.",
        technologies: JSON.stringify(["React", "TypeScript", "Socket.io", "Node.js", "MongoDB"]),
        githubUrl: "https://github.com/rahul/realtime-chat"
      },
      {
        title: "Data Analytics Dashboard",
        description: "Built an interactive dashboard for business analytics using React, D3.js, and Apache Spark. Processes 10M+ records with real-time visualization and insights.",
        technologies: JSON.stringify(["React", "D3.js", "Python", "Apache Spark", "PostgreSQL"]),
        githubUrl: "https://github.com/sneha/analytics-dashboard"
      },
      {
        title: "Cross-Platform Mobile Banking App",
        description: "Developed a secure banking application using React Native with biometric authentication, QR payments, and offline transaction support.",
        technologies: JSON.stringify(["React Native", "TypeScript", "Firebase", "Redux", "Secure Storage"]),
        githubUrl: "https://github.com/vikram/mobile-banking"
      },
      {
        title: "Computer Vision Object Detection",
        description: "Implemented real-time object detection system using PyTorch and OpenCV. Achieved 92% accuracy on custom dataset with 30+ object classes.",
        technologies: JSON.stringify(["Python", "PyTorch", "OpenCV", "TensorFlow", "Flask"]),
        githubUrl: "https://github.com/ananya/object-detection"
      }
    ];
    
    // Add projects for high-match candidates
    for (let i = 0; i < Math.min(topProjects.length, highMatchProfiles.length); i++) {
      projectData.push({
        studentId: insertedStudents[i].id,
        ...topProjects[i],
        featured: true,
      });
    }
    
    // Add regular projects for other students
    for (let i = highMatchProfiles.length; i < Math.min(25, insertedStudents.length); i++) {
      projectData.push({
        studentId: insertedStudents[i].id,
        title: `Project ${i + 1} - ${["AI System", "Web App", "Mobile App", "Data Pipeline", "IoT Device"][Math.floor(Math.random() * 5)]}`,
        description: `Innovative project showcasing technical skills and problem-solving abilities`,
        technologies: JSON.stringify(["JavaScript", "Python", "React", "Node.js"].slice(0, Math.floor(Math.random() * 4) + 1)),
        githubUrl: `https://github.com/student${i}/project${i}`,
        featured: Math.random() > 0.8,
      });
    }

    await db.insert(projects).values(projectData);
  }

  // Interview operations
  async createInterview(data: any): Promise<any> {
    // For now return a mock interview - in real implementation would use DB
    return {
      id: `interview_${Date.now()}`,
      companyId: data.companyId,
      studentId: data.studentId,
      scheduledAt: data.scheduledAt,
      duration: data.duration,
      interviewType: data.interviewType,
      notes: data.notes,
      meetingLink: data.meetingLink,
      status: data.status,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async getInterviewsByCompany(companyId: string): Promise<any[]> {
    // For now return empty array - in real implementation would use DB
    return [];
  }

  // Message operations
  async createMessage(data: any): Promise<any> {
    // For now return a mock message - in real implementation would use DB
    return {
      id: `msg_${Date.now()}`,
      senderId: data.senderId,
      receiverId: data.receiverId,
      messageType: data.messageType,
      content: data.content,
      conversationId: data.conversationId,
      isRead: false,
      createdAt: new Date()
    };
  }

  async getMessages(userId: string, conversationId?: string): Promise<any[]> {
    // For now return empty array - in real implementation would use DB
    return [];
  }

  // Code submission operations
  async getCodeSubmissions(studentId: string): Promise<any[]> {
    // Return mock code submissions for demonstration
    const mockSubmissions = [
      {
        id: `code_${studentId}_1`,
        studentId: studentId,
        questionId: "q1",
        code: `// Two Sum Problem Solution
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
        language: "JavaScript",
        score: 95,
        executionTime: 42,
        memoryUsed: 1024,
        testCasesPassed: 12,
        totalTestCases: 12,
        idVerified: true,
        webcamVerified: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        submittedAt: new Date(Date.now() - 86400000 + 1800000).toISOString(), // 30 minutes later
        question: {
          question: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
        }
      },
      {
        id: `code_${studentId}_2`,
        studentId: studentId,
        questionId: "q2",
        code: `// Binary Tree Inorder Traversal
class TreeNode {
    constructor(val, left, right) {
        this.val = (val === undefined ? 0 : val);
        this.left = (left === undefined ? null : left);
        this.right = (right === undefined ? null : right);
    }
}

function inorderTraversal(root) {
    const result = [];
    
    function inorder(node) {
        if (!node) return;
        
        inorder(node.left);
        result.push(node.val);
        inorder(node.right);
    }
    
    inorder(root);
    return result;
}`,
        language: "JavaScript",
        score: 88,
        executionTime: 68,
        memoryUsed: 2048,
        testCasesPassed: 8,
        totalTestCases: 10,
        idVerified: true,
        webcamVerified: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        submittedAt: new Date(Date.now() - 172800000 + 2700000).toISOString(), // 45 minutes later
        question: {
          question: "Given the root of a binary tree, return the inorder traversal of its nodes' values."
        }
      }
    ];
    
    return mockSubmissions;
  }

  async getCodeSubmission(id: string): Promise<any> {
    const submissions = await this.getCodeSubmissions("mock_student");
    return submissions.find(s => s.id === id) || null;
  }

  // Role matching algorithm with salary recommendation engine
  async calculateRoleMatch(companyId: string, studentId: string, jobRequirements?: {
    skills: string[];
    salaryRange?: { min: number; max: number };
    location?: string;
    role?: string;
  }): Promise<{
    matchPercentage: number;
    salaryRecommendation: { min: number; max: number };
    preferenceMatches: {
      salary: boolean;
      location: boolean;
      role: boolean;
    };
    explanation: string;
  }> {
    // Get student data with skills and assessment scores
    const student = await this.getStudentById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Get assessment data for salary recommendation
    const assessment = await this.getUserAssessment(student.email); // Using email as userId

    // Calculate assessment-based salary recommendation
    const salaryRecommendation = this.calculateSalaryRecommendation(assessment, student);

    // Default job requirements if not provided
    const requirements = jobRequirements || {
      skills: ["JavaScript", "React", "Node.js"],
      salaryRange: { min: 600, max: 1200 },
      location: "Bangalore",
      role: "Software Engineer"
    };

    // Note: Skills match would require a separate skills endpoint since StudentWithAssessments doesn't include skills
    const skillsMatchScore = 75; // Default skills match score

    // Calculate preference matches
    const preferenceMatches = {
      salary: this.checkSalaryMatch(student, salaryRecommendation, requirements.salaryRange),
      location: this.checkLocationMatch(student, requirements.location),
      role: this.checkRoleMatch(student, requirements.role)
    };

    // Calculate overall match percentage
    let matchPercentage = 0;

    // Skills match (40% weight)
    matchPercentage += skillsMatchScore * 0.4;

    // CGPA score (20% weight)
    const cgpaScore = Math.min(100, (parseFloat(student.cgpa?.toString() || "7") / 10) * 100);
    matchPercentage += cgpaScore * 0.2;

    // Assessment scores (30% weight)  
    const assessmentScore = assessment ? this.calculateOverallAssessmentScore(assessment) : 75;
    matchPercentage += assessmentScore * 0.3;

    // Preference alignment bonus (10% weight)
    const preferenceBonus = (
      (preferenceMatches.salary ? 1 : 0) +
      (preferenceMatches.location ? 1 : 0) + 
      (preferenceMatches.role ? 1 : 0)
    ) * (100 / 3) * 0.1;
    matchPercentage += preferenceBonus;

    // Cap at 95% max, minimum 60%
    matchPercentage = Math.min(95, Math.max(60, Math.round(matchPercentage)));

    // Generate explanation
    const explanation = this.generateMatchExplanation(
      matchPercentage, 
      skillsMatchScore, 
      preferenceMatches, 
      salaryRecommendation,
      requirements
    );

    return {
      matchPercentage,
      salaryRecommendation,
      preferenceMatches,
      explanation
    };
  }

  private calculateSalaryRecommendation(assessment: Assessment | undefined, student: Student): { min: number; max: number } {
    if (!assessment) {
      // Base salary recommendation without assessment
      const baseSalary = 600; // 6 LPA base
      return { min: baseSalary, max: baseSalary + 400 };
    }

    // Calculate weighted assessment score
    const assessmentScore = this.calculateOverallAssessmentScore(assessment);
    
    // Base salary tiers based on assessment performance
    let baseSalary = 500; // 5 LPA minimum
    let maxSalary = 700;   // 7 LPA for average performance

    if (assessmentScore >= 90) {
      baseSalary = 1000; // 10 LPA for excellent
      maxSalary = 1500;  // 15 LPA upper range
    } else if (assessmentScore >= 80) {
      baseSalary = 800;  // 8 LPA for good
      maxSalary = 1200;  // 12 LPA upper range
    } else if (assessmentScore >= 70) {
      baseSalary = 650;  // 6.5 LPA for decent
      maxSalary = 900;   // 9 LPA upper range
    } else if (assessmentScore >= 60) {
      baseSalary = 550;  // 5.5 LPA for fair
      maxSalary = 750;   // 7.5 LPA upper range
    }

    // CGPA bonus (up to 10% increase)
    const cgpa = parseFloat(student.cgpa?.toString() || "7");
    const cgpaBonus = Math.max(0, (cgpa - 7) / 3) * 0.1; // 10% max bonus for 10 CGPA
    
    baseSalary = Math.round(baseSalary * (1 + cgpaBonus));
    maxSalary = Math.round(maxSalary * (1 + cgpaBonus));

    return { min: baseSalary, max: maxSalary };
  }

  private calculateOverallAssessmentScore(assessment: Assessment): number {
    const aptitude = assessment.aptitudeScore || 0;
    const verbal = assessment.verbalScore || 0;
    const dsa = assessment.dsaScore || 0;
    const communication = assessment.communicationScore || 0;
    
    // Weighted average: DSA 40%, Aptitude 25%, Communication 25%, Verbal 10%
    return Math.round((dsa * 0.4) + (aptitude * 0.25) + (communication * 0.25) + (verbal * 0.1));
  }

  private calculateSkillsMatch(studentSkills: any[], requiredSkills: string[]): number {
    if (!requiredSkills.length) return 80; // Default good match if no specific skills required
    
    const matchedSkills = studentSkills.filter(ss => 
      requiredSkills.some(rs => ss.skill.name.toLowerCase().includes(rs.toLowerCase()))
    );

    const matchRatio = matchedSkills.length / requiredSkills.length;
    return Math.round(Math.min(100, matchRatio * 100 + 20)); // Add 20 base points
  }

  private checkSalaryMatch(student: Student, recommendation: { min: number; max: number }, offerRange?: { min: number; max: number }): boolean {
    if (!student.expectedSalaryMin || !student.expectedSalaryMax || !offerRange) return true;
    
    // Check if there's overlap between expected and offered salary ranges
    return !(student.expectedSalaryMax < offerRange.min || student.expectedSalaryMin > offerRange.max);
  }

  private checkLocationMatch(student: Student, jobLocation?: string): boolean {
    if (!jobLocation || !student.preferredLocations) return true;
    
    try {
      const preferredLocations = JSON.parse(student.preferredLocations);
      return preferredLocations.some((loc: string) => 
        loc.toLowerCase().includes(jobLocation.toLowerCase()) ||
        jobLocation.toLowerCase().includes(loc.toLowerCase())
      );
    } catch {
      return student.location.toLowerCase().includes(jobLocation.toLowerCase());
    }
  }

  private checkRoleMatch(student: Student, jobRole?: string): boolean {
    if (!jobRole || !student.preferredRoles) return true;
    
    try {
      const preferredRoles = JSON.parse(student.preferredRoles);
      return preferredRoles.some((role: string) => 
        role.toLowerCase().includes(jobRole.toLowerCase()) ||
        jobRole.toLowerCase().includes(role.toLowerCase())
      );
    } catch {
      return true; // Default to match if no preferences set
    }
  }

  private generateMatchExplanation(
    matchPercentage: number,
    skillsScore: number,
    preferenceMatches: { salary: boolean; location: boolean; role: boolean },
    salaryRec: { min: number; max: number },
    requirements: any
  ): string {
    const level = matchPercentage >= 85 ? "Strong Hire" : matchPercentage >= 70 ? "Hire with Confidence" : "Consider with Support";
    
    const strengths = [];
    const considerations = [];

    if (skillsScore >= 80) strengths.push("strong technical skills match");
    if (preferenceMatches.salary) strengths.push("salary expectations aligned");
    if (preferenceMatches.location) strengths.push("location preference match");
    if (preferenceMatches.role) strengths.push("role preference alignment");

    if (skillsScore < 70) considerations.push("skill gap analysis recommended");
    if (!preferenceMatches.salary) considerations.push("salary negotiation may be needed");
    if (!preferenceMatches.location) considerations.push("location flexibility to discuss");

    return `${level}: ${strengths.length > 0 ? strengths.join(', ') + '. ' : ''}${considerations.length > 0 ? 'Consider: ' + considerations.join(', ') + '. ' : ''}Recommended salary: ${salaryRec.min / 100}-${salaryRec.max / 100} LPA.`;
  }

  // Smart talent discovery implementation
  async getSmartCuratedCandidates(requirements: {
    role: string;
    experience: string;
    skills: string[];
    minCGPA: number;
    salaryRange: [number, number];
    locations: string[];
    collegePreference: string;
    urgency: string;
    teamSize: number;
    workMode: string;
    maxResults: number;
  }): Promise<StudentWithAssessments[]> {
    try {
      // Build dynamic query based on requirements
      let query = db
        .select({
          student: students,
          skills: sql<string>`STRING_AGG(DISTINCT ${skills.name}, ', ') AS skills`,
          skillsArray: sql<any>`JSON_AGG(DISTINCT jsonb_build_object(
            'id', ${skills.id},
            'name', ${skills.name},
            'category', ${skills.category},
            'proficiencyLevel', ${studentSkills.proficiencyLevel},
            'assessmentScore', ${studentSkills.assessmentScore}
          )) AS skillsArray`
        })
        .from(students)
        .leftJoin(studentSkills, eq(students.id, studentSkills.studentId))
        .leftJoin(skills, eq(studentSkills.skillId, skills.id))
        .groupBy(students.id);

      // Apply filters based on requirements
      const conditions = [];
      
      // CGPA filter
      if (requirements.minCGPA > 6.0) {
        conditions.push(gte(students.cgpa, requirements.minCGPA.toString()));
      }
      
      // College tier preference filter
      if (requirements.collegePreference !== "any") {
        switch (requirements.collegePreference) {
          case "iit-only":
            conditions.push(ilike(students.university, "%IIT%"));
            break;
          case "iit-nit-only":
            conditions.push(sql`(${students.university} ILIKE '%IIT%' OR ${students.university} ILIKE '%NIT%')`);
            break;
          case "tier1-plus":
            conditions.push(sql`(${students.university} ILIKE '%IIT%' OR ${students.university} ILIKE '%NIT%' OR ${students.university} ILIKE '%IIIT%' OR ${students.university} ILIKE '%BITS%' OR ${students.university} ILIKE '%VIT%' OR ${students.university} ILIKE '%SRM%' OR ${students.university} ILIKE '%DTU%' OR ${students.university} ILIKE '%Manipal%')`);
            break;
        }
      }
      
      // Location preference filter (if locations specified)
      if (requirements.locations.length > 0) {
        const locationConditions = requirements.locations.map(loc => 
          sql`(${students.location} ILIKE ${'%' + loc + '%'} OR ${students.preferredLocations} ILIKE ${'%' + loc + '%'})`
        );
        conditions.push(sql`(${sql.join(locationConditions, sql` OR `)})`);
      }

      // Apply all conditions
      if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
      }

      // Execute query with limit
      const rawResults = await query.limit(Math.min(requirements.maxResults * 3, 1000)); // Get more to rank

      // Transform and calculate fit scores
      const studentsWithScores = rawResults
        .filter(result => result.student) // Ensure student exists
        .map(result => {
          const student = result.student;
          const studentSkillsArray = result.skillsArray || [];
          
          // Calculate comprehensive fit score
          const fitScore = this.calculateSmartFitScore(student, studentSkillsArray, requirements);
          
          return {
            ...student,
            skills: result.skills || "",
            skillsArray: studentSkillsArray,
            fitScore,
            projects: [] // Will be populated separately if needed
          };
        });

      // Sort by fit score (highest first) and take top results
      const sortedResults = studentsWithScores
        .sort((a, b) => b.fitScore - a.fitScore)
        .slice(0, requirements.maxResults);

      // Format the results to match StudentWithAssessments interface
      return sortedResults.map(student => ({
        ...student,
        projects: [], // Can be populated later if needed
        cgpa: student.cgpa?.toString() || "7.0",
        fullName: `${student.firstName} ${student.lastName}`,
        institution: student.university || 'Unknown Institution',
        course: `${student.degree || 'Unknown'} in ${student.major || 'Unknown'}`,
        assessmentLevel: this.getAssessmentLevel(
          student.overallAssessmentScore, 
          student.dsaScore, 
          student.csFundamentalsScore, 
          student.aptitudeScore, 
          student.verbalCommunicationScore
        ),
      })) as StudentWithAssessments[];

    } catch (error) {
      console.error("Error in smart candidate curation:", error);
      // Fallback to basic student search if smart search fails
      return this.getStudents({
        minCgpa: requirements.minCGPA,
        limit: requirements.maxResults
      });
    }
  }

  private calculateSmartFitScore(
    student: any, 
    studentSkills: any[], 
    requirements: {
      role: string;
      skills: string[];
      minCGPA: number;
      salaryRange: [number, number];
      locations: string[];
      collegePreference: string;
      urgency: string;
      workMode: string;
    }
  ): number {
    let score = 0;
    
    // 1. CGPA Score (25% weight)
    const cgpa = parseFloat(student.cgpa?.toString() || "7");
    const cgpaScore = Math.min(100, (cgpa / 10) * 100);
    score += cgpaScore * 0.25;
    
    // 2. Skills Match (35% weight) 
    const skillsMatchScore = this.calculateSkillsMatchAdvanced(studentSkills, requirements.skills);
    score += skillsMatchScore * 0.35;
    
    // 3. College Reputation (15% weight)
    const collegeScore = this.calculateCollegeScore(student.university);
    score += collegeScore * 0.15;
    
    // 4. Salary Alignment (10% weight)
    const salaryScore = this.calculateSalaryAlignment(student, requirements.salaryRange);
    score += salaryScore * 0.10;
    
    // 5. Location Preference (10% weight)
    const locationScore = this.calculateLocationAlignment(student, requirements.locations);
    score += locationScore * 0.10;
    
    // 6. Work Mode Match (5% weight)
    const workModeScore = this.calculateWorkModeAlignment(student, requirements.workMode);
    score += workModeScore * 0.05;
    
    // Urgency bonus: if urgent, prefer freshers with higher availability
    if (requirements.urgency === "urgent" || requirements.urgency === "high") {
      if (student.noticePeriod <= 7) {
        score += 5; // Immediate availability bonus
      }
    }
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateSkillsMatchAdvanced(studentSkills: any[], requiredSkills: string[]): number {
    if (!requiredSkills.length) return 85;
    
    const exactMatches = studentSkills.filter(ss => 
      requiredSkills.some(rs => 
        ss.name && ss.name.toLowerCase() === rs.toLowerCase()
      )
    ).length;
    
    const partialMatches = studentSkills.filter(ss => 
      requiredSkills.some(rs => 
        ss.name && (ss.name.toLowerCase().includes(rs.toLowerCase()) || rs.toLowerCase().includes(ss.name.toLowerCase()))
      )
    ).length - exactMatches;
    
    const matchScore = (exactMatches * 100 + partialMatches * 60) / requiredSkills.length;
    return Math.min(100, matchScore);
  }

  private calculateCollegeScore(university: string): number {
    if (!university) return 70;
    
    const uni = university.toLowerCase();
    
    if (uni.includes("iit")) return 100;
    if (uni.includes("nit") || uni.includes("iiit")) return 95;
    if (uni.includes("bits") || uni.includes("vit") || uni.includes("srm") || uni.includes("manipal")) return 90;
    if (uni.includes("dtu") || uni.includes("nsut") || uni.includes("anna") || uni.includes("delhi")) return 85;
    if (uni.includes("university") || uni.includes("institute") || uni.includes("college")) return 75;
    
    return 70; // Default for other colleges
  }

  private calculateSalaryAlignment(student: any, salaryRange: [number, number]): number {
    const studentMin = (student.expectedSalaryMin || 400) / 100; // Convert to LPA
    const studentMax = (student.expectedSalaryMax || 800) / 100;
    const companyMin = salaryRange[0];
    const companyMax = salaryRange[1];
    
    // Check for overlap
    if (studentMax < companyMin) {
      // Student expects less - great for company
      return 100;
    } else if (studentMin > companyMax) {
      // Student expects more - poor match
      return 30;
    } else {
      // There's overlap - good match
      const overlapSize = Math.min(studentMax, companyMax) - Math.max(studentMin, companyMin);
      const totalRange = Math.max(studentMax, companyMax) - Math.min(studentMin, companyMin);
      return 60 + (overlapSize / totalRange) * 40;
    }
  }

  private calculateLocationAlignment(student: any, preferredLocations: string[]): number {
    if (!preferredLocations.length) return 85;
    
    // Check student's current location
    const currentLocation = student.location?.toLowerCase() || "";
    const hasCurrentMatch = preferredLocations.some(loc => 
      currentLocation.includes(loc.toLowerCase()) || loc.toLowerCase().includes(currentLocation)
    );
    
    if (hasCurrentMatch) return 100;
    
    // Check student's preferred locations
    try {
      const studentPreferences = JSON.parse(student.preferredLocations || "[]");
      const hasPreferenceMatch = studentPreferences.some((loc: string) =>
        preferredLocations.some(pref => 
          loc.toLowerCase().includes(pref.toLowerCase()) || pref.toLowerCase().includes(loc.toLowerCase())
        )
      );
      
      if (hasPreferenceMatch) return 90;
    } catch {
      // Ignore JSON parse errors
    }
    
    return 60; // Neutral if no clear match
  }

  private calculateWorkModeAlignment(student: any, preferredWorkMode: string): number {
    const studentWorkMode = student.workMode?.toLowerCase() || "hybrid";
    const companyWorkMode = preferredWorkMode.toLowerCase();
    
    if (studentWorkMode === companyWorkMode) return 100;
    if (studentWorkMode === "hybrid" || companyWorkMode === "hybrid") return 90;
    if ((studentWorkMode === "remote" && companyWorkMode === "onsite") || 
        (studentWorkMode === "onsite" && companyWorkMode === "remote")) return 60;
    
    return 80; // Default moderate match
  }
}

export const storage = new DatabaseStorage();
