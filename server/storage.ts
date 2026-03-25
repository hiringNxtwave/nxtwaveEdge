import {
  users,
  companies,
  companyRequirements,
  students,
  skills,
  studentSkills,
  projects,
  contactRequests,
  assessments,
  assessmentQuestions,
  assessmentResponses,
  otpCodes,
  type User,
  type UpsertUser,
  type Company,
  type InsertCompany,
  type CompanyRequirements,
  type InsertCompanyRequirements,
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
  type CompanyWithRequirements,
  type Assessment,
  type InsertAssessment,
  type AssessmentQuestion,
  type InsertAssessmentQuestion,
  type AssessmentResponse,
  type InsertAssessmentResponse,
  type AssessmentWithResponses,
  type OtpCode,
  type InsertOtpCode,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, gte, desc, asc, sql, inArray, lt } from "drizzle-orm";
import bcrypt from "bcrypt";
import seedDataJson from "./student-seed-data.json";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, user: Partial<UpsertUser>): Promise<User>;
  
  // Company operations
  getCompanyByUserId(userId: string): Promise<CompanyWithUser | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company>;
  
  // Company Requirements operations
  getCompanyRequirements(companyId: string): Promise<CompanyRequirements[]>;
  getCompanyRequirementById(id: string): Promise<CompanyRequirements | undefined>;
  createCompanyRequirements(requirements: InsertCompanyRequirements): Promise<CompanyRequirements>;
  updateCompanyRequirements(id: string, requirements: Partial<InsertCompanyRequirements>): Promise<CompanyRequirements>;
  deleteCompanyRequirements(id: string): Promise<void>;
  parseJobDescription(jd: string): Promise<{
    requiredSkills: string[];
    preferredSkills: string[];
    technicalKeywords: string[];
    salaryRange?: { min: number; max: number };
    location?: string;
    experienceLevel?: string;
    academicRequirements?: {
      minimumCGPA?: number;
      requiredDegrees?: string[];
      graduationYears?: string[];
    };
    assessmentWeights?: {
      dsaWeight: number;
      csFundamentalsWeight: number;
      aptitudeWeight: number;
      communicationWeight: number;
    };
  }>;
  
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
    recommendation?: string;
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

  // OTP operations
  createOtpCode(otpData: InsertOtpCode): Promise<OtpCode>;
  getOtpCode(id: string): Promise<OtpCode | undefined>;
  getOtpByEmailOrMobile(email?: string, mobile?: string, purpose?: string): Promise<OtpCode | undefined>;
  verifyOtpCode(id: string, code: string, requestIp?: string): Promise<{
    success: boolean;
    message: string;
    otpCode?: OtpCode;
  }>;
  updateOtpStatus(id: string, updates: Partial<InsertOtpCode>): Promise<OtpCode>;
  invalidateOtpCode(id: string): Promise<void>;
  cleanupExpiredOtpCodes(): Promise<number>;
  checkRateLimit(email?: string, mobile?: string, requestIp?: string): Promise<{
    allowed: boolean;
    remainingAttempts: number;
    resetTime?: Date;
  }>;

  // Initial data seeding
  seedInitialData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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

  // Company Requirements operations
  async getCompanyRequirements(companyId: string): Promise<CompanyRequirements[]> {
    return await db
      .select()
      .from(companyRequirements)
      .where(eq(companyRequirements.companyId, companyId))
      .orderBy(desc(companyRequirements.createdAt));
  }

  async getCompanyRequirementById(id: string): Promise<CompanyRequirements | undefined> {
    const [result] = await db
      .select()
      .from(companyRequirements)
      .where(eq(companyRequirements.id, id));
    return result;
  }

  async createCompanyRequirements(requirements: InsertCompanyRequirements): Promise<CompanyRequirements> {
    const [newRequirements] = await db
      .insert(companyRequirements)
      .values(requirements)
      .returning();
    return newRequirements;
  }

  async updateCompanyRequirements(id: string, requirements: Partial<InsertCompanyRequirements>): Promise<CompanyRequirements> {
    const [updatedRequirements] = await db
      .update(companyRequirements)
      .set({ ...requirements, lastUpdated: new Date() })
      .where(eq(companyRequirements.id, id))
      .returning();
    return updatedRequirements;
  }

  async deleteCompanyRequirements(id: string): Promise<void> {
    await db
      .delete(companyRequirements)
      .where(eq(companyRequirements.id, id));
  }

  async parseJobDescription(jd: string): Promise<{
    requiredSkills: string[];
    preferredSkills: string[];
    technicalKeywords: string[];
    salaryRange?: { min: number; max: number };
    location?: string;
    experienceLevel?: string;
    academicRequirements?: {
      minimumCGPA?: number;
      requiredDegrees?: string[];
      graduationYears?: string[];
    };
    assessmentWeights?: {
      dsaWeight: number;
      csFundamentalsWeight: number;
      aptitudeWeight: number;
      communicationWeight: number;
    };
  }> {
    // Comprehensive JD parsing logic
    const result: {
      requiredSkills: string[];
      preferredSkills: string[];
      technicalKeywords: string[];
      salaryRange?: { min: number; max: number };
      location?: string;
      experienceLevel?: string;
      academicRequirements?: {
        minimumCGPA?: number;
        requiredDegrees?: string[];
        graduationYears?: string[];
      };
      assessmentWeights?: {
        dsaWeight: number;
        csFundamentalsWeight: number;
        aptitudeWeight: number;
        communicationWeight: number;
      };
    } = {
      requiredSkills: [],
      preferredSkills: [],
      technicalKeywords: [],
    };
    
    const jdLower = jd.toLowerCase();
    
    // Extract technical skills
    const technicalSkills = [
      'javascript', 'typescript', 'python', 'java', 'react', 'angular', 'vue', 'node.js', 'nodejs',
      'express', 'django', 'flask', 'spring', 'mongodb', 'postgresql', 'mysql', 'redis',
      'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'html', 'css', 'scss', 'sass',
      'machine learning', 'ml', 'ai', 'data science', 'tensorflow', 'pytorch', 'pandas',
      'numpy', 'spark', 'hadoop', 'kafka', 'elasticsearch', 'graphql', 'rest api', 'microservices',
      'c++', 'c#', 'go', 'rust', 'kotlin', 'swift', 'flutter', 'react native', 'android', 'ios',
      'devops', 'ci/cd', 'jenkins', 'github actions', 'terraform', 'ansible'
    ];
    
    const foundSkills = technicalSkills.filter(skill => 
      jdLower.includes(skill) || 
      jdLower.includes(skill.replace(/[^a-z]/g, ''))
    );
    
    // Categorize as required vs preferred based on context
    const requiredIndicators = ['required', 'must have', 'essential', 'mandatory', 'experience in'];
    const preferredIndicators = ['preferred', 'nice to have', 'good to have', 'bonus', 'plus'];
    
    foundSkills.forEach(skill => {
      const skillContext = this.extractContextAroundSkill(jdLower, skill);
      
      if (requiredIndicators.some(indicator => skillContext.includes(indicator))) {
        result.requiredSkills.push(skill);
      } else if (preferredIndicators.some(indicator => skillContext.includes(indicator))) {
        result.preferredSkills.push(skill);
      } else {
        result.requiredSkills.push(skill); // Default to required
      }
      
      result.technicalKeywords.push(skill);
    });
    
    // Extract salary range
    const salaryRegex = /(₹|inr|rs\.?)\s*([0-9]+(?:\.[0-9]+)?)\s*(?:to|-)\s*([0-9]+(?:\.[0-9]+)?)\s*(lpa|lakhs?|l)/gi;
    const salaryMatch = salaryRegex.exec(jd);
    
    if (salaryMatch) {
      const min = parseFloat(salaryMatch[2]) * 100; // Convert LPA to thousands
      const max = parseFloat(salaryMatch[3]) * 100;
      result.salaryRange = { min, max };
    }
    
    // Extract location
    const locationKeywords = [
      'bangalore', 'bengaluru', 'mumbai', 'delhi', 'ncr', 'gurgaon', 'gurugram', 'noida',
      'hyderabad', 'chennai', 'pune', 'kolkata', 'ahmedabad', 'jaipur', 'kochi', 'remote'
    ];
    
    const foundLocation = locationKeywords.find(loc => jdLower.includes(loc));
    if (foundLocation) {
      result.location = foundLocation;
    }
    
    // Extract experience level
    const experienceRegex = /(?:fresher|0[\s-]*(?:to|-)\s*[0-9]+|[0-9]+[\s-]*(?:to|-)\s*[0-9]+)\s*(?:years?|yrs?)/gi;
    const experienceMatch = experienceRegex.exec(jd);
    
    if (experienceMatch || jdLower.includes('fresher') || jdLower.includes('entry level')) {
      result.experienceLevel = 'fresher';
    }
    
    // Extract academic requirements
    const cgpaRegex = /(?:cgpa|gpa)\s*(?:of|:)?\s*([0-9]+(?:\.[0-9]+)?)/gi;
    const cgpaMatch = cgpaRegex.exec(jd);
    
    const academicRequirements: any = {};
    
    if (cgpaMatch) {
      academicRequirements.minimumCGPA = parseFloat(cgpaMatch[1]);
    }
    
    const degreeKeywords = ['b.tech', 'btech', 'b.e', 'be', 'mtech', 'm.tech', 'mca', 'bca', 'cs', 'computer science'];
    const foundDegrees = degreeKeywords.filter(degree => jdLower.includes(degree));
    
    if (foundDegrees.length > 0) {
      academicRequirements.requiredDegrees = foundDegrees;
    }
    
    if (Object.keys(academicRequirements).length > 0) {
      result.academicRequirements = academicRequirements;
    }
    
    // Generate assessment weights based on role type
    const assessmentWeights = this.generateAssessmentWeights(jd, result.requiredSkills);
    if (assessmentWeights) {
      result.assessmentWeights = assessmentWeights;
    }
    
    return result;
  }
  
  private extractContextAroundSkill(text: string, skill: string): string {
    const index = text.indexOf(skill);
    if (index === -1) return '';
    
    const start = Math.max(0, index - 100);
    const end = Math.min(text.length, index + skill.length + 100);
    
    return text.substring(start, end);
  }
  
  private generateAssessmentWeights(jd: string, skills: string[]): {
    dsaWeight: number;
    csFundamentalsWeight: number;
    aptitudeWeight: number;
    communicationWeight: number;
  } | null {
    const jdLower = jd.toLowerCase();
    
    // Default weights
    let dsaWeight = 25;
    let csFundamentalsWeight = 25;
    let aptitudeWeight = 25;
    let communicationWeight = 25;
    
    // Backend/Algorithm heavy roles
    if (skills.some(skill => ['algorithms', 'data structures', 'backend', 'java', 'python', 'c++'].includes(skill)) ||
        jdLower.includes('backend') || jdLower.includes('algorithm') || jdLower.includes('data structure')) {
      dsaWeight = 40;
      csFundamentalsWeight = 30;
      aptitudeWeight = 20;
      communicationWeight = 10;
    }
    
    // Frontend roles
    else if (skills.some(skill => ['react', 'angular', 'vue', 'javascript', 'typescript', 'html', 'css'].includes(skill)) ||
             jdLower.includes('frontend') || jdLower.includes('ui') || jdLower.includes('ux')) {
      dsaWeight = 15;
      csFundamentalsWeight = 35;
      aptitudeWeight = 25;
      communicationWeight = 25;
    }
    
    // Full-stack roles
    else if (jdLower.includes('full stack') || jdLower.includes('fullstack')) {
      dsaWeight = 30;
      csFundamentalsWeight = 30;
      aptitudeWeight = 25;
      communicationWeight = 15;
    }
    
    // Client-facing/Product roles
    else if (jdLower.includes('client') || jdLower.includes('product') || jdLower.includes('customer')) {
      dsaWeight = 15;
      csFundamentalsWeight = 20;
      aptitudeWeight = 25;
      communicationWeight = 40;
    }
    
    return { dsaWeight, csFundamentalsWeight, aptitudeWeight, communicationWeight };
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
    recommendation?: string;
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

    if (filters?.recommendation) {
      whereConditions.push(eq(students.recommendation, filters.recommendation));
    }
    
    // TODO: Re-enable minCgpa filter with proper casting
    // if (filters?.minCgpa) {
    //   whereConditions.push(sql`CASE WHEN ${students.cgpa} ~ '^[0-9]+(\.[0-9]+)?$' THEN (${students.cgpa}::numeric >= ${filters.minCgpa}) ELSE false END`);
    // }

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

    const recPriority = sql`CASE WHEN ${students.recommendation} = 'Strong Hire' THEN 3 WHEN ${students.recommendation} = 'Hire' THEN 2 WHEN ${students.recommendation} = 'Weak Hire' THEN 1 ELSE 0 END`;

    const results = whereConditions.length > 0
      ? await baseQuery
          .where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions))
          .orderBy(desc(recPriority), desc(students.overallAssessmentScore))
          .limit(filters?.limit || 20)
          .offset(filters?.offset || 0)
      : await baseQuery
          .orderBy(desc(recPriority), desc(students.overallAssessmentScore))
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

  // DB health check method  
  async dbHealthCheck(): Promise<any> {
    try {
      const result = await db.execute(sql`select 1 as ok`);
      return { status: 'ok', result };
    } catch (error) {
      console.error('Database health check failed:', error);
      return { status: 'error', message: error instanceof Error ? error.message : String(error) };
    }
  }

  async getStudentCount(filters?: {
    skills?: string[];
    location?: string;
    university?: string;
    minCgpa?: number;
    recommendation?: string;
  }): Promise<number> {
    try {
      console.log("🔍 getStudentCount called with filters:", JSON.stringify(filters, null, 2));
      
      const whereConditions = [];
      
      if (filters?.location) {
        whereConditions.push(ilike(students.location, `%${filters.location}%`));
      }
      
      if (filters?.university) {
        whereConditions.push(ilike(students.university, `%${filters.university}%`));
      }

      if (filters?.recommendation) {
        whereConditions.push(eq(students.recommendation, filters.recommendation));
      }
      
      // Add skills filtering by joining with studentSkills table
      if (filters?.skills && filters.skills.length > 0) {
        console.log("📊 Counting students with skills filter");
        const results = await db
          .select({ count: sql`count(distinct ${students.id})` })
          .from(students)
          .leftJoin(studentSkills, eq(students.id, studentSkills.studentId))
          .leftJoin(skills, eq(studentSkills.skillId, skills.id))
          .where(and(
            inArray(skills.name, filters.skills),
            ...(whereConditions.length > 0 ? whereConditions : [])
          ));
        
        console.log("📊 Skills count query results:", results);
        return Number(results[0]?.count || 0);
      }

      // Simple count query without skills filtering
      if (whereConditions.length === 0) {
        console.log("📊 Getting total student count (no filters)");
        const results = await db.select({ count: sql`count(*)` }).from(students);
        console.log("📊 Total count results:", results);
        return Number(results[0]?.count || 0);
      }
      
      // Count with location/university filters only
      console.log("📊 Counting students with location/university filters");
      const results = await db
        .select({ count: sql`count(*)` })
        .from(students)
        .where(whereConditions.length === 1 ? whereConditions[0] : and(...whereConditions));
      
      console.log("📊 Filtered count results:", results);
      return Number(results[0]?.count || 0);
    } catch (error) {
      console.error("❌ Error in getStudentCount:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      throw error;
    }
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

  // OTP operations
  async createOtpCode(otpData: InsertOtpCode): Promise<OtpCode> {
    // Hash the OTP code for security
    const hashedCode = await bcrypt.hash(otpData.code, 10);
    
    const [newOtp] = await db
      .insert(otpCodes)
      .values({
        ...otpData,
        hashedCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
        deliveryStatus: 'pending'
      })
      .returning();
    return newOtp;
  }

  async getOtpCode(id: string): Promise<OtpCode | undefined> {
    const [otp] = await db.select().from(otpCodes).where(eq(otpCodes.id, id));
    return otp;
  }

  async getOtpByEmailOrMobile(email?: string, mobile?: string, purpose?: string): Promise<OtpCode | undefined> {
    const conditions = [];
    
    if (email) {
      conditions.push(eq(otpCodes.email, email));
    }
    if (mobile) {
      conditions.push(eq(otpCodes.mobile, mobile));
    }
    if (purpose) {
      conditions.push(eq(otpCodes.purpose, purpose));
    }
    
    // Get the most recent non-expired, non-used OTP
    conditions.push(eq(otpCodes.isUsed, false));
    conditions.push(eq(otpCodes.isExpired, false));
    conditions.push(gte(otpCodes.expiresAt, new Date()));
    
    const [otp] = await db
      .select()
      .from(otpCodes)
      .where(and(...conditions))
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);
    
    return otp;
  }

  async verifyOtpCode(id: string, code: string, requestIp?: string): Promise<{
    success: boolean;
    message: string;
    otpCode?: OtpCode;
  }> {
    const otp = await this.getOtpCode(id);
    
    if (!otp) {
      return { success: false, message: 'OTP not found' };
    }

    // Check if OTP is already used
    if (otp.isUsed) {
      return { success: false, message: 'OTP has already been used' };
    }

    // Check if OTP is expired
    if (otp.isExpired || new Date() > otp.expiresAt) {
      await this.updateOtpStatus(id, { isExpired: true });
      return { success: false, message: 'OTP has expired' };
    }

    // Check if blocked due to too many attempts
    if (otp.isBlocked) {
      if (otp.blockedUntil && new Date() < otp.blockedUntil) {
        return { success: false, message: 'Too many incorrect attempts. Please try again later.' };
      } else {
        // Unblock if block period has expired
        await this.updateOtpStatus(id, { 
          isBlocked: false, 
          blockedUntil: null, 
          attemptsCount: 0 
        });
      }
    }

    // Verify the OTP code
    const isValidCode = await bcrypt.compare(code, otp.hashedCode);
    
    if (!isValidCode) {
      const newAttemptsCount = (otp.attemptsCount || 0) + 1;
      const maxAttempts = otp.maxAttempts || 3;
      
      if (newAttemptsCount >= maxAttempts) {
        // Block the OTP for 15 minutes
        await this.updateOtpStatus(id, {
          attemptsCount: newAttemptsCount,
          isBlocked: true,
          blockedUntil: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
        });
        return { success: false, message: 'Too many incorrect attempts. OTP blocked for 15 minutes.' };
      } else {
        await this.updateOtpStatus(id, { attemptsCount: newAttemptsCount });
        return { 
          success: false, 
          message: `Invalid OTP. ${maxAttempts - newAttemptsCount} attempts remaining.` 
        };
      }
    }

    // Mark OTP as used
    const updatedOtp = await this.updateOtpStatus(id, { 
      isUsed: true, 
      verifiedAt: new Date() 
    });
    
    return { 
      success: true, 
      message: 'OTP verified successfully', 
      otpCode: updatedOtp 
    };
  }

  async updateOtpStatus(id: string, updates: Partial<InsertOtpCode>): Promise<OtpCode> {
    const [updatedOtp] = await db
      .update(otpCodes)
      .set(updates)
      .where(eq(otpCodes.id, id))
      .returning();
    return updatedOtp;
  }

  async invalidateOtpCode(id: string): Promise<void> {
    await db
      .update(otpCodes)
      .set({ isUsed: true, isExpired: true })
      .where(eq(otpCodes.id, id));
  }

  async cleanupExpiredOtpCodes(): Promise<number> {
    const result = await db
      .delete(otpCodes)
      .where(lt(otpCodes.expiresAt, new Date()));
    
    return result.rowCount || 0;
  }

  async checkRateLimit(email?: string, mobile?: string, requestIp?: string): Promise<{
    allowed: boolean;
    remainingAttempts: number;
    resetTime?: Date;
  }> {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const conditions = [];
    
    if (email) {
      conditions.push(eq(otpCodes.email, email));
    }
    if (mobile) {
      conditions.push(eq(otpCodes.mobile, mobile));
    }
    if (requestIp) {
      conditions.push(eq(otpCodes.requestIp, requestIp));
    }
    
    conditions.push(gte(otpCodes.createdAt, oneHourAgo));
    
    const recentOtps = await db
      .select()
      .from(otpCodes)
      .where(and(...conditions))
      .orderBy(desc(otpCodes.createdAt));
    
    const maxAttemptsPerHour = 5; // Allow 5 OTP requests per hour
    const currentAttempts = recentOtps.length;
    
    if (currentAttempts >= maxAttemptsPerHour) {
      // Find the oldest OTP in the current hour to determine reset time
      const oldestOtp = recentOtps[recentOtps.length - 1];
      const resetTime = new Date(oldestOtp.createdAt.getTime() + 60 * 60 * 1000);
      
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime
      };
    }
    
    return {
      allowed: true,
      remainingAttempts: maxAttemptsPerHour - currentAttempts
    };
  }

  // Initial data seeding
  async seedInitialData(): Promise<void> {
    // Seed skills if missing
    const existingSkills = await db.select().from(skills).limit(1);
    if (existingSkills.length === 0) {

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
    } // end skills seeding

    // Seed real students if not already loaded (or if recording URLs are missing)
    const FIRST_REAL_ID = "48309455-3700-4cf1-8356-9cf43477fcdf";
    const existingReal = await db.select().from(students).where(eq(students.id, FIRST_REAL_ID)).limit(1);
    if (existingReal.length > 0 && existingReal[0].linkedinUrl && existingReal[0].recommendation) return; // already seeded with full data

    // Clear any existing fake students (cascade to studentSkills + projects)
    await db.delete(studentSkills);
    await db.delete(projects);
    await db.delete(students);

    // Load real student data (bundled at compile time via top-level import)
    const realStudents: any[] = seedDataJson as any[];

    // Insert in batches of 50 to avoid payload limits
    const BATCH = 50;
    const insertedIds: string[] = [];
    for (let i = 0; i < realStudents.length; i += BATCH) {
      const batch = realStudents.slice(i, i + BATCH).map((s: any) => ({
        id: s.id,
        firstName: s.firstName,
        lastName: s.lastName || "",
        email: s.email,
        phone: s.phone || null,
        university: s.university,
        degree: s.degree || "B.Tech",
        major: s.major || "Computer Science",
        graduationYear: s.graduationYear || 2026,
        location: s.location || "India",
        bio: s.bio || null,
        verified: true,
        dsaScore: s.dsaScore ?? null,
        csFundamentalsScore: s.csFundamentalsScore ?? null,
        aptitudeScore: s.aptitudeScore ?? null,
        verbalCommunicationScore: s.verbalCommunicationScore ?? null,
        overallAssessmentScore: s.overallAssessmentScore ?? null,
        assessmentCompleted: true,
        assessmentDate: s.assessmentDate ? new Date(s.assessmentDate) : null,
        resumeUrl: s.resumeUrl || null,
        portfolioUrl: s.portfolioUrl || null,
        linkedinUrl: s.linkedinUrl || null,
        githubUrl: s.githubUrl || null,
        preferredRoles: s.preferredRoles || null,
        preferredLocations: s.preferredLocations || null,
        recommendation: s.recommendation || null,
        noticePeriod: 0,
        workMode: "hybrid",
        expectedSalaryMin: 600,
        expectedSalaryMax: 1200,
      }));
      const inserted = await db.insert(students).values(batch).returning({ id: students.id });
      insertedIds.push(...inserted.map(r => r.id));
    }

    // Assign skills to each real student
    const allSkills = await db.select().from(skills);
    const techSkills = allSkills.filter(s => s.category === "technical");
    const skillAssignments: any[] = [];

    const TECH_MAP: Record<string, string[]> = {
      "JavaScript": ["JavaScript", "React", "Node.js", "TypeScript", "Express.js", "Web Development"],
      "Python": ["Python", "Django", "Flask", "Machine Learning", "Data Science"],
      "Java": ["Java", "Spring Boot"],
      "React": ["React", "JavaScript", "TypeScript"],
      "Node.js": ["Node.js", "JavaScript", "Express.js"],
      "MongoDB": ["MongoDB"],
      "MySQL": ["MySQL", "PostgreSQL"],
      "AWS": ["AWS"],
      "Docker": ["Docker", "Kubernetes", "DevOps"],
    };

    for (const studentId of insertedIds) {
      const student = realStudents.find(s => s.id === studentId);
      if (!student) continue;

      // Assign 4-7 random technical skills
      const shuffled = [...techSkills].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 4);
      for (const skill of shuffled) {
        skillAssignments.push({
          studentId,
          skillId: skill.id,
          proficiencyLevel: Math.min(5, Math.max(3, Math.round((student.overallAssessmentScore || 70) / 20))),
          assessmentScore: student.overallAssessmentScore || 75,
          verified: true,
        });
      }
    }

    // Insert skills in batches
    for (let i = 0; i < skillAssignments.length; i += 200) {
      await db.insert(studentSkills).values(skillAssignments.slice(i, i + 200));
    }

    console.log(`✅ Seeded ${insertedIds.length} real students`);
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
