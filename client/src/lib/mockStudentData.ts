import { type StudentWithAssessments } from "@shared/schema";

// Mock student data that matches the real schema
export const mockStudents: StudentWithAssessments[] = [
  {
    id: "mock-1",
    firstName: "Arjun",
    lastName: "Sharma",
    email: "arjun.sharma@example.com",
    phone: "+91-9876543210",
    university: "IIT Delhi",
    degree: "Bachelor of Technology",
    major: "Computer Science",
    graduationYear: 2024,
    cgpa: "8.7",
    location: "New Delhi",
    bio: "Passionate full-stack developer with experience in React, Node.js, and AWS. Built 3 production-level web applications during internships.",
    profileImageUrl: null,
    resumeUrl: null,
    portfolioUrl: "https://arjunsharma.dev",
    linkedinUrl: "https://linkedin.com/in/arjunsharma",
    githubUrl: "https://github.com/arjunsharma",
    verified: true,
    dsaScore: 87,
    csFundamentalsScore: 91,
    aptitudeScore: 84,
    verbalCommunicationScore: 78,
    overallAssessmentScore: 85,
    assessmentCompleted: true,
    assessmentDate: new Date("2024-08-15"),
    expectedSalaryMin: 800,
    expectedSalaryMax: 1200,
    preferredRoles: JSON.stringify(["Software Engineer", "Full Stack Developer", "Backend Developer"]),
    preferredLocations: JSON.stringify(["Bangalore", "Hyderabad", "Remote"]),
    preferredCompanySize: "mid-size",
    workMode: "hybrid",
    noticePeriod: 0,
    availableFrom: new Date("2024-09-01"),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-08-20"),
    // Computed fields
    fullName: "Arjun Sharma",
    institution: "IIT Delhi",
    course: "Bachelor of Technology in Computer Science",
    assessmentLevel: "Excellent" as const,
    projects: [
      {
        id: "proj-1",
        studentId: "mock-1",
        title: "E-commerce Platform",
        description: "Full-stack e-commerce platform with React, Node.js, and MongoDB",
        technologies: JSON.stringify(["React", "Node.js", "MongoDB", "AWS"]),
        projectUrl: "https://ecommerce-demo.com",
        githubUrl: "https://github.com/arjunsharma/ecommerce",
        featured: true,
        createdAt: new Date("2024-06-01")
      }
    ]
  },
  {
    id: "mock-2",
    firstName: "Priya",
    lastName: "Patel",
    email: "priya.patel@example.com",
    phone: "+91-9876543211",
    university: "IIT Bombay",
    degree: "Bachelor of Technology",
    major: "Information Technology",
    graduationYear: 2024,
    cgpa: "9.1",
    location: "Mumbai",
    bio: "Data science enthusiast with expertise in machine learning and Python. Published research papers and won multiple hackathons.",
    profileImageUrl: null,
    resumeUrl: null,
    portfolioUrl: "https://priyapatel.io",
    linkedinUrl: "https://linkedin.com/in/priyapatel",
    githubUrl: "https://github.com/priyapatel",
    verified: true,
    dsaScore: 93,
    csFundamentalsScore: 89,
    aptitudeScore: 91,
    verbalCommunicationScore: 85,
    overallAssessmentScore: 90,
    assessmentCompleted: true,
    assessmentDate: new Date("2024-08-10"),
    expectedSalaryMin: 900,
    expectedSalaryMax: 1400,
    preferredRoles: JSON.stringify(["Data Scientist", "ML Engineer", "Software Engineer"]),
    preferredLocations: JSON.stringify(["Bangalore", "Mumbai", "Pune"]),
    preferredCompanySize: "large",
    workMode: "hybrid",
    noticePeriod: 0,
    availableFrom: new Date("2024-09-01"),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-08-20"),
    // Computed fields
    fullName: "Priya Patel",
    institution: "IIT Bombay",
    course: "Bachelor of Technology in Information Technology",
    assessmentLevel: "Excellent" as const,
    projects: [
      {
        id: "proj-2",
        studentId: "mock-2",
        title: "ML-based Recommendation System",
        description: "Netflix-style recommendation system using collaborative filtering",
        technologies: JSON.stringify(["Python", "TensorFlow", "Flask", "PostgreSQL"]),
        projectUrl: "https://ml-recommendations.com",
        githubUrl: "https://github.com/priyapatel/ml-recommendations",
        featured: true,
        createdAt: new Date("2024-05-15")
      }
    ]
  },
  {
    id: "mock-3",
    firstName: "Rahul",
    lastName: "Singh",
    email: "rahul.singh@example.com",
    phone: "+91-9876543212",
    university: "BITS Pilani",
    degree: "Bachelor of Engineering",
    major: "Electronics Engineering",
    graduationYear: 2024,
    cgpa: "8.4",
    location: "Bangalore",
    bio: "Mobile app developer specializing in React Native and Flutter. Created apps with 10K+ downloads.",
    profileImageUrl: null,
    resumeUrl: null,
    portfolioUrl: null,
    linkedinUrl: "https://linkedin.com/in/rahulsingh",
    githubUrl: "https://github.com/rahulsingh",
    verified: true,
    dsaScore: 81,
    csFundamentalsScore: 86,
    aptitudeScore: 79,
    verbalCommunicationScore: 82,
    overallAssessmentScore: 82,
    assessmentCompleted: true,
    assessmentDate: new Date("2024-08-12"),
    expectedSalaryMin: 700,
    expectedSalaryMax: 1100,
    preferredRoles: JSON.stringify(["Mobile Developer", "React Native Developer", "Frontend Developer"]),
    preferredLocations: JSON.stringify(["Bangalore", "Chennai", "Hyderabad"]),
    preferredCompanySize: "startup",
    workMode: "onsite",
    noticePeriod: 0,
    availableFrom: new Date("2024-09-15"),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-08-20"),
    // Computed fields
    fullName: "Rahul Singh",
    institution: "BITS Pilani",
    course: "Bachelor of Engineering in Electronics Engineering",
    assessmentLevel: "Strong" as const,
    projects: [
      {
        id: "proj-3",
        studentId: "mock-3",
        title: "Food Delivery App",
        description: "Cross-platform food delivery app built with React Native",
        technologies: JSON.stringify(["React Native", "Node.js", "MongoDB", "Socket.io"]),
        projectUrl: null,
        githubUrl: "https://github.com/rahulsingh/food-delivery",
        featured: true,
        createdAt: new Date("2024-04-20")
      }
    ]
  },
  {
    id: "mock-4",
    firstName: "Ananya",
    lastName: "Reddy",
    email: "ananya.reddy@example.com",
    phone: "+91-9876543213",
    university: "NIT Trichy",
    degree: "Bachelor of Technology",
    major: "Computer Science",
    graduationYear: 2024,
    cgpa: "8.8",
    location: "Chennai",
    bio: "Cloud computing enthusiast with AWS certifications. Experienced in DevOps and microservices architecture.",
    profileImageUrl: null,
    resumeUrl: null,
    portfolioUrl: "https://ananyareddy.dev",
    linkedinUrl: "https://linkedin.com/in/ananyareddy",
    githubUrl: "https://github.com/ananyareddy",
    verified: true,
    dsaScore: 88,
    csFundamentalsScore: 92,
    aptitudeScore: 86,
    verbalCommunicationScore: 81,
    overallAssessmentScore: 87,
    assessmentCompleted: true,
    assessmentDate: new Date("2024-08-18"),
    expectedSalaryMin: 850,
    expectedSalaryMax: 1300,
    preferredRoles: JSON.stringify(["DevOps Engineer", "Cloud Engineer", "Backend Developer"]),
    preferredLocations: JSON.stringify(["Bangalore", "Chennai", "Hyderabad"]),
    preferredCompanySize: "mid-size",
    workMode: "remote",
    noticePeriod: 0,
    availableFrom: new Date("2024-08-30"),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-08-20"),
    // Computed fields
    fullName: "Ananya Reddy",
    institution: "NIT Trichy",
    course: "Bachelor of Technology in Computer Science",
    assessmentLevel: "Excellent" as const,
    projects: [
      {
        id: "proj-4",
        studentId: "mock-4",
        title: "Microservices Platform",
        description: "Scalable microservices platform with Docker and Kubernetes",
        technologies: JSON.stringify(["Node.js", "Docker", "Kubernetes", "AWS", "PostgreSQL"]),
        projectUrl: "https://microservices-demo.com",
        githubUrl: "https://github.com/ananyareddy/microservices",
        featured: true,
        createdAt: new Date("2024-06-10")
      }
    ]
  },
  {
    id: "mock-5",
    firstName: "Vikash",
    lastName: "Kumar",
    email: "vikash.kumar@example.com",
    phone: "+91-9876543214",
    university: "Delhi University",
    degree: "Bachelor of Computer Applications",
    major: "Computer Applications",
    graduationYear: 2024,
    cgpa: "7.9",
    location: "New Delhi",
    bio: "Frontend specialist with expertise in React and Vue.js. Strong focus on user experience and responsive design.",
    profileImageUrl: null,
    resumeUrl: null,
    portfolioUrl: "https://vikashkumar.portfolio.com",
    linkedinUrl: "https://linkedin.com/in/vikashkumar",
    githubUrl: "https://github.com/vikashkumar",
    verified: true,
    dsaScore: 75,
    csFundamentalsScore: 78,
    aptitudeScore: 73,
    verbalCommunicationScore: 76,
    overallAssessmentScore: 76,
    assessmentCompleted: true,
    assessmentDate: new Date("2024-08-14"),
    expectedSalaryMin: 600,
    expectedSalaryMax: 900,
    preferredRoles: JSON.stringify(["Frontend Developer", "UI Developer", "React Developer"]),
    preferredLocations: JSON.stringify(["Delhi", "Noida", "Gurgaon"]),
    preferredCompanySize: "startup",
    workMode: "hybrid",
    noticePeriod: 0,
    availableFrom: new Date("2024-09-10"),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-08-20"),
    // Computed fields
    fullName: "Vikash Kumar",
    institution: "Delhi University",
    course: "Bachelor of Computer Applications in Computer Applications",
    assessmentLevel: "Strong" as const,
    projects: [
      {
        id: "proj-5",
        studentId: "mock-5",
        title: "Portfolio Website Builder",
        description: "No-code portfolio builder for developers and designers",
        technologies: JSON.stringify(["React", "TypeScript", "Tailwind CSS", "Firebase"]),
        projectUrl: "https://portfolio-builder.com",
        githubUrl: "https://github.com/vikashkumar/portfolio-builder",
        featured: true,
        createdAt: new Date("2024-05-01")
      }
    ]
  },
  {
    id: "mock-6",
    firstName: "Shreya",
    lastName: "Gupta",
    email: "shreya.gupta@example.com",
    phone: "+91-9876543215",
    university: "VIT Vellore",
    degree: "Bachelor of Technology",
    major: "Biotechnology",
    graduationYear: 2024,
    cgpa: "8.6",
    location: "Pune",
    bio: "Biotech graduate transitioning to data science. Strong analytical skills with Python and R programming experience.",
    profileImageUrl: null,
    resumeUrl: null,
    portfolioUrl: null,
    linkedinUrl: "https://linkedin.com/in/shreyagupta",
    githubUrl: "https://github.com/shreyagupta",
    verified: true,
    dsaScore: 77,
    csFundamentalsScore: 71,
    aptitudeScore: 83,
    verbalCommunicationScore: 79,
    overallAssessmentScore: 78,
    assessmentCompleted: true,
    assessmentDate: new Date("2024-08-16"),
    expectedSalaryMin: 650,
    expectedSalaryMax: 950,
    preferredRoles: JSON.stringify(["Data Analyst", "Business Analyst", "Research Analyst"]),
    preferredLocations: JSON.stringify(["Pune", "Mumbai", "Bangalore"]),
    preferredCompanySize: "large",
    workMode: "hybrid",
    noticePeriod: 0,
    availableFrom: new Date("2024-09-20"),
    createdAt: new Date("2024-07-01"),
    updatedAt: new Date("2024-08-20"),
    // Computed fields
    fullName: "Shreya Gupta",
    institution: "VIT Vellore",
    course: "Bachelor of Technology in Biotechnology",
    assessmentLevel: "Strong" as const,
    projects: [
      {
        id: "proj-6",
        studentId: "mock-6",
        title: "Genomic Data Analysis Tool",
        description: "Python-based tool for analyzing genomic sequences and patterns",
        technologies: JSON.stringify(["Python", "Pandas", "NumPy", "Matplotlib", "Jupyter"]),
        projectUrl: null,
        githubUrl: "https://github.com/shreyagupta/genomic-analysis",
        featured: false,
        createdAt: new Date("2024-03-15")
      }
    ]
  }
];

// Mock skills data
export const mockSkills = [
  { id: "skill-1", name: "JavaScript", category: "technical", createdAt: new Date() },
  { id: "skill-2", name: "Python", category: "technical", createdAt: new Date() },
  { id: "skill-3", name: "Java", category: "technical", createdAt: new Date() },
  { id: "skill-4", name: "React", category: "technical", createdAt: new Date() },
  { id: "skill-5", name: "Node.js", category: "technical", createdAt: new Date() },
  { id: "skill-6", name: "Machine Learning", category: "technical", createdAt: new Date() },
  { id: "skill-7", name: "Data Science", category: "technical", createdAt: new Date() },
  { id: "skill-8", name: "AWS", category: "technical", createdAt: new Date() },
  { id: "skill-9", name: "Docker", category: "technical", createdAt: new Date() },
  { id: "skill-10", name: "MongoDB", category: "technical", createdAt: new Date() },
];

// Function to generate more mock students if needed
export function generateAdditionalMockStudents(count: number): StudentWithAssessments[] {
  const baseStudents = mockStudents;
  const additional: StudentWithAssessments[] = [];
  
  for (let i = 0; i < count; i++) {
    const base = baseStudents[i % baseStudents.length];
    const newStudent: StudentWithAssessments = {
      ...base,
      id: `mock-generated-${i + 7}`,
      firstName: `${base.firstName}${i + 1}`,
      lastName: `${base.lastName}${i + 1}`,
      email: `${base.firstName.toLowerCase()}${i + 1}.${base.lastName.toLowerCase()}@example.com`,
      cgpa: (Math.random() * 2 + 7).toFixed(1), // Random CGPA between 7.0-9.0
      dsaScore: Math.floor(Math.random() * 40 + 60), // Random score 60-100
      csFundamentalsScore: Math.floor(Math.random() * 40 + 60),
      aptitudeScore: Math.floor(Math.random() * 40 + 60),
      verbalCommunicationScore: Math.floor(Math.random() * 40 + 60),
      overallAssessmentScore: Math.floor(Math.random() * 40 + 60),
      fullName: `${base.firstName}${i + 1} ${base.lastName}${i + 1}`,
      projects: []
    };
    
    // Determine assessment level based on overall score
    if (newStudent.overallAssessmentScore! >= 85) {
      newStudent.assessmentLevel = "Excellent";
    } else if (newStudent.overallAssessmentScore! >= 70) {
      newStudent.assessmentLevel = "Strong";
    } else if (newStudent.overallAssessmentScore! >= 55) {
      newStudent.assessmentLevel = "Good";
    } else {
      newStudent.assessmentLevel = "Needs Improvement";
    }
    
    additional.push(newStudent);
  }
  
  return additional;
}

// Function to filter mock students based on criteria
export function filterMockStudents(
  students: StudentWithAssessments[],
  filters: {
    university?: string;
    codingRating?: number;
    location?: string;
    skills?: string[];
    minCgpa?: number;
    limit?: number;
    offset?: number;
  }
): StudentWithAssessments[] {
  let filtered = [...students];
  
  if (filters.university && filters.university !== "all") {
    filtered = filtered.filter(student => 
      student.university.toLowerCase().includes(filters.university!.toLowerCase())
    );
  }
  
  if (filters.codingRating) {
    const minScore = filters.codingRating * 20; // Convert 1-5 scale to 20-100
    filtered = filtered.filter(student => 
      (student.dsaScore || 0) >= minScore
    );
  }
  
  if (filters.location) {
    filtered = filtered.filter(student => 
      student.location.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  
  if (filters.minCgpa) {
    filtered = filtered.filter(student => 
      parseFloat(student.cgpa || "0") >= filters.minCgpa!
    );
  }
  
  // Apply pagination
  const startIndex = filters.offset || 0;
  const endIndex = startIndex + (filters.limit || 20);
  
  return filtered.slice(startIndex, endIndex);
}