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
    const whereConditions = [];
    
    if (filters?.location) {
      whereConditions.push(ilike(students.location, `%${filters.location}%`));
    }
    
    if (filters?.university) {
      whereConditions.push(ilike(students.university, `%${filters.university}%`));
    }
    
    if (filters?.minCgpa) {
      whereConditions.push(gte(students.cgpa, filters.minCgpa.toString()));
    }

    let query = db
      .select()
      .from(students)
      .leftJoin(studentSkills, eq(students.id, studentSkills.studentId))
      .leftJoin(skills, eq(studentSkills.skillId, skills.id))
      .leftJoin(projects, eq(students.id, projects.studentId));

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    const results = await query
      .orderBy(desc(students.cgpa))
      .limit(filters?.limit || 20)
      .offset(filters?.offset || 0);

    
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
    const whereConditions = [];
    
    if (filters?.location) {
      whereConditions.push(ilike(students.location, `%${filters.location}%`));
    }
    
    if (filters?.university) {
      whereConditions.push(ilike(students.university, `%${filters.university}%`));
    }
    
    if (filters?.minCgpa) {
      whereConditions.push(gte(students.cgpa, filters.minCgpa.toString()));
    }

    let query = db.select({ count: sql`count(*)` }).from(students);
    
    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
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

    const studentData = [];
    for (let i = 0; i < 120; i++) {
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
    const projectData = [];
    for (let i = 0; i < Math.min(20, insertedStudents.length); i++) {
      projectData.push({
        studentId: insertedStudents[i].id,
        title: `Project ${i + 1} - ${["AI System", "Web App", "Mobile App", "Data Pipeline", "IoT Device"][Math.floor(Math.random() * 5)]}`,
        description: `Innovative project showcasing technical skills and problem-solving abilities`,
        technologies: JSON.stringify(["JavaScript", "Python", "React", "Node.js"].slice(0, Math.floor(Math.random() * 4) + 1)),
        githubUrl: `https://github.com/student${i}/project${i}`,
        featured: Math.random() > 0.7,
      });
    }

    await db.insert(projects).values(projectData);
  }
}

export const storage = new DatabaseStorage();
