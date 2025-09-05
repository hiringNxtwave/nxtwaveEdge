import { db } from "./db";
import { students, skills, studentSkills, projects } from "@shared/schema";
import { eq } from "drizzle-orm";

// Comprehensive list of 120+ Indian colleges across different tiers
const indianColleges = [
  // IITs (23)
  "IIT Madras", "IIT Delhi", "IIT Bombay", "IIT Kanpur", "IIT Kharagpur", "IIT Roorkee", "IIT Guwahati",
  "IIT Hyderabad", "IIT Indore", "IIT Mandi", "IIT Patna", "IIT Ropar", "IIT Bhubaneswar", "IIT Gandhinagar",
  "IIT Jodhpur", "IIT Varanasi", "IIT Palakkad", "IIT Tirupati", "IIT Bhilai", "IIT Goa", "IIT Jammu",
  "IIT Dharwad", "IIT Dhanbad",
  
  // NITs (31)
  "NIT Trichy", "NIT Warangal", "NIT Surathkal", "NIT Calicut", "NIT Durgapur", "NIT Rourkela",
  "NIT Kurukshetra", "NIT Jaipur", "NIT Nagpur", "NIT Allahabad", "NIT Bhopal", "NIT Jalandhar",
  "NIT Hamirpur", "NIT Patna", "NIT Raipur", "NIT Agartala", "NIT Arunachal Pradesh", "NIT Delhi",
  "NIT Goa", "NIT Manipur", "NIT Meghalaya", "NIT Mizoram", "NIT Nagaland", "NIT Puducherry",
  "NIT Sikkim", "NIT Srinagar", "NIT Uttarakhand", "NIT Andhra Pradesh", "NIT Karnataka", "NIT Tadepalligudem",
  "NIT Silchar",
  
  // IIITs (25)
  "IIIT Hyderabad", "IIIT Bangalore", "IIIT Delhi", "IIIT Allahabad", "IIIT Gwalior", "IIIT Jabalpur",
  "IIIT Kota", "IIIT Sri City", "IIIT Vadodara", "IIIT Nagpur", "IIIT Pune", "IIIT Kurnool",
  "IIIT Una", "IIIT Sonepat", "IIIT Kalyani", "IIIT Lucknow", "IIIT Dharwad", "IIIT Bhagalpur",
  "IIIT Bhopal", "IIIT Agartala", "IIIT Ranchi", "IIIT Manipur", "IIIT Kottayam", "IIIT Trichy",
  "IIIT Raichur",
  
  // Top State Universities & Private Colleges (50+)
  "Delhi Technological University", "Netaji Subhas University of Technology", "Jamia Millia Islamia",
  "Aligarh Muslim University", "Banaras Hindu University", "University of Delhi", "Jawaharlal Nehru University",
  "Anna University", "SRM Institute of Science and Technology", "VIT Vellore", "VIT Chennai", "VIT Bhopal",
  "Manipal Institute of Technology", "PES University", "RV College of Engineering", "BMS College of Engineering",
  "MS Ramaiah Institute of Technology", "Dayananda Sagar University", "Christ University", "JSS Science and Technology University",
  "SASTRA University", "Kalinga Institute of Industrial Technology", "Siksha O Anusandhan University",
  "Thapar Institute of Engineering and Technology", "Lovely Professional University", "Chitkara University",
  "Shiv Nadar University", "Amity University", "Bennett University", "Galgotias University", "JIIT Noida",
  "Birla Institute of Technology Mesra", "Birla Institute of Technology and Science Pilani", "BITS Goa", "BITS Hyderabad",
  "International Institute of Information Technology Bangalore", "PES Institute of Technology",
  "Ramaiah Institute of Technology", "PESIT South Campus", "New Horizon College of Engineering",
  "CMR Institute of Technology", "Atria Institute of Technology", "RNSIT", "RVCE", "BMSCE",
  "Coimbatore Institute of Technology", "PSG College of Technology", "Thiagarajar College of Engineering",
  "Kumaraguru College of Technology", "Sri Sivasubramaniya Nadar College of Engineering",
  "CEG Anna University", "MIT Chennai", "Hindustan Institute of Technology", "Sathyabama Institute of Science and Technology"
];

// Indian cities with their states for realistic location distribution
const indianLocations = [
  "Bangalore, Karnataka", "Mumbai, Maharashtra", "Delhi, Delhi", "Pune, Maharashtra", "Chennai, Tamil Nadu",
  "Hyderabad, Telangana", "Kolkata, West Bengal", "Ahmedabad, Gujarat", "Surat, Gujarat", "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh", "Nagpur, Maharashtra", "Indore, Madhya Pradesh",
  "Thane, Maharashtra", "Bhopal, Madhya Pradesh", "Visakhapatnam, Andhra Pradesh", "Pimpri-Chinchwad, Maharashtra",
  "Patna, Bihar", "Vadodara, Gujarat", "Ghaziabad, Uttar Pradesh", "Ludhiana, Punjab", "Agra, Uttar Pradesh",
  "Nashik, Maharashtra", "Faridabad, Haryana", "Meerut, Uttar Pradesh", "Rajkot, Gujarat", "Kalyan-Dombivali, Maharashtra",
  "Vasai-Virar, Maharashtra", "Varanasi, Uttar Pradesh", "Srinagar, Jammu and Kashmir", "Aurangabad, Maharashtra",
  "Dhanbad, Jharkhand", "Amritsar, Punjab", "Navi Mumbai, Maharashtra", "Allahabad, Uttar Pradesh",
  "Ranchi, Jharkhand", "Howrah, West Bengal", "Coimbatore, Tamil Nadu", "Jabalpur, Madhya Pradesh",
  "Gwalior, Madhya Pradesh", "Vijayawada, Andhra Pradesh", "Jodhpur, Rajasthan", "Madurai, Tamil Nadu",
  "Raipur, Chhattisgarh", "Kota, Rajasthan", "Guwahati, Assam", "Chandigarh, Chandigarh",
  "Solapur, Maharashtra", "Hubli-Dharwad, Karnataka", "Tiruchirappalli, Tamil Nadu", "Bareilly, Uttar Pradesh"
];

// Comprehensive skills database
const skillsDatabase = [
  { name: "JavaScript", category: "technical" },
  { name: "Python", category: "technical" },
  { name: "Java", category: "technical" },
  { name: "C++", category: "technical" },
  { name: "React", category: "technical" },
  { name: "Node.js", category: "technical" },
  { name: "Angular", category: "technical" },
  { name: "Vue.js", category: "technical" },
  { name: "Express.js", category: "technical" },
  { name: "Django", category: "technical" },
  { name: "Flask", category: "technical" },
  { name: "Spring Boot", category: "technical" },
  { name: "MySQL", category: "technical" },
  { name: "PostgreSQL", category: "technical" },
  { name: "MongoDB", category: "technical" },
  { name: "Redis", category: "technical" },
  { name: "Docker", category: "technical" },
  { name: "Kubernetes", category: "technical" },
  { name: "AWS", category: "technical" },
  { name: "Azure", category: "technical" },
  { name: "Google Cloud", category: "technical" },
  { name: "Git", category: "technical" },
  { name: "Linux", category: "technical" },
  { name: "Machine Learning", category: "technical" },
  { name: "Deep Learning", category: "technical" },
  { name: "Data Structures", category: "technical" },
  { name: "Algorithms", category: "technical" },
  { name: "System Design", category: "technical" },
  { name: "REST APIs", category: "technical" },
  { name: "GraphQL", category: "technical" },
  { name: "Microservices", category: "technical" },
  { name: "DevOps", category: "technical" },
  { name: "CI/CD", category: "technical" },
  { name: "Terraform", category: "technical" },
  { name: "Jenkins", category: "technical" },
  { name: "Problem Solving", category: "soft" },
  { name: "Communication", category: "soft" },
  { name: "Leadership", category: "soft" },
  { name: "Team Work", category: "soft" },
  { name: "Critical Thinking", category: "soft" },
  { name: "Adaptability", category: "soft" },
  { name: "Time Management", category: "soft" },
  { name: "Project Management", category: "soft" }
];

// Engineering majors/branches
const engineeringMajors = [
  "Computer Science and Engineering",
  "Information Technology", 
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Biotechnology",
  "Data Science and Engineering",
  "Artificial Intelligence and Machine Learning",
  "Cybersecurity",
  "Software Engineering",
  "Computer Engineering"
];

// Indian first and last names for diversity
const indianFirstNames = {
  male: [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Krishna", "Ishaan", "Shaurya",
    "Atharva", "Aadhya", "Rudra", "Aarush", "Rishabh", "Eklavya", "Aaditya", "Shivansh", "Moksh", "Veer",
    "Abhimanyu", "Karan", "Dev", "Yash", "Harsh", "Rohan", "Aryan", "Ayush", "Ansh", "Dhruv",
    "Ravi", "Suresh", "Vikram", "Rajesh", "Amit", "Pradeep", "Santosh", "Manoj", "Vinod", "Ashok",
    "Ramesh", "Gopal", "Kishore", "Mahesh", "Naresh", "Prakash", "Sunil", "Anil", "Mukesh", "Dinesh"
  ],
  female: [
    "Aadhya", "Saanvi", "Diya", "Ananya", "Navya", "Pari", "Aaradhya", "Kavya", "Sara", "Kiara",
    "Avni", "Riya", "Myra", "Aanya", "Ishita", "Shanvi", "Prisha", "Zara", "Vamika", "Arya",
    "Aditi", "Shreya", "Priya", "Pooja", "Neha", "Kavita", "Sunita", "Geeta", "Meera", "Deepika",
    "Anjali", "Rekha", "Sushma", "Shanti", "Lakshmi", "Sarita", "Nisha", "Usha", "Radha", "Sita",
    "Kamala", "Savita", "Pushpa", "Sudha", "Asha", "Maya", "Devi", "Shobha", "Lata", "Kiran"
  ]
};

const indianLastNames = [
  "Sharma", "Verma", "Gupta", "Agarwal", "Patel", "Singh", "Kumar", "Jain", "Bansal", "Goyal",
  "Shah", "Mehta", "Joshi", "Malhotra", "Arora", "Chopra", "Kapoor", "Khanna", "Bhatia", "Garg",
  "Mittal", "Aggarwal", "Singhal", "Jindal", "Sachdeva", "Sethi", "Kapur", "Saxena", "Tiwari", "Pandey",
  "Mishra", "Chandra", "Prasad", "Yadav", "Reddy", "Nair", "Menon", "Iyer", "Rao", "Raju",
  "Krishnan", "Subramanian", "Venkatesh", "Srinivasan", "Ramachandran", "Mukherjee", "Chatterjee", "Banerjee", "Ghosh", "Dutta",
  "Das", "Roy", "Sen", "Bose", "Khan", "Ahmed", "Ali", "Hussain", "Ansari", "Qureshi",
  "Siddiqui", "Shaikh", "Pathan", "Desai", "Bhatt", "Thakkar", "Parikh", "Trivedi", "Vyas", "Modi"
];

// Project titles and descriptions for portfolio generation
const projectTemplates = [
  {
    titles: ["E-commerce Platform", "Online Marketplace", "Shopping Cart System", "Retail Management System"],
    description: "A full-stack e-commerce application with user authentication, product catalog, shopping cart, payment integration, and order management features.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Stripe API", "JWT Authentication"]
  },
  {
    titles: ["Chat Application", "Real-time Messaging App", "Social Media Platform", "Communication System"],
    description: "Real-time messaging application with group chats, file sharing, user profiles, and notification system using WebSocket technology.",
    tech: ["React", "Socket.io", "Node.js", "Express.js", "MongoDB", "JWT Authentication"]
  },
  {
    titles: ["Weather Forecasting System", "Climate Data Analytics", "Weather Prediction App", "Meteorological Dashboard"],
    description: "Weather application that provides real-time weather data, forecasts, historical data analysis, and interactive weather maps.",
    tech: ["Python", "Django", "PostgreSQL", "OpenWeather API", "Chart.js", "Bootstrap"]
  },
  {
    titles: ["Task Management System", "Project Tracker", "Team Collaboration Tool", "Productivity Dashboard"],
    description: "Comprehensive project management tool with task assignment, progress tracking, team collaboration, and deadline management features.",
    tech: ["Angular", "Spring Boot", "MySQL", "REST APIs", "Angular Material", "JWT Authentication"]
  },
  {
    titles: ["Machine Learning Price Predictor", "ML Classification System", "Data Analytics Platform", "Predictive Model"],
    description: "Machine learning application for data analysis and prediction with feature engineering, model training, and interactive visualization.",
    tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Flask", "SQLite"]
  },
  {
    titles: ["Food Delivery App", "Restaurant Management System", "Online Food Ordering", "Delivery Tracking System"],
    description: "Complete food delivery platform with restaurant listings, menu management, order tracking, payment integration, and delivery optimization.",
    tech: ["React Native", "Node.js", "Express.js", "MongoDB", "Google Maps API", "Stripe API"]
  },
  {
    titles: ["Library Management System", "Book Inventory System", "Digital Library Platform", "Academic Resource Manager"],
    description: "Digital library management system with book cataloging, user management, lending tracking, and fine calculation features.",
    tech: ["Java", "Spring Boot", "MySQL", "Thymeleaf", "Bootstrap", "JPA/Hibernate"]
  },
  {
    titles: ["Travel Planning App", "Tourism Management System", "Trip Planner", "Travel Booking Platform"],
    description: "Travel application with itinerary planning, booking management, expense tracking, and location-based recommendations.",
    tech: ["Vue.js", "Node.js", "Express.js", "PostgreSQL", "Google Maps API", "Travel APIs"]
  },
  {
    titles: ["Expense Tracker", "Personal Finance Manager", "Budget Planning App", "Financial Dashboard"],
    description: "Personal finance application with expense categorization, budget planning, financial goal tracking, and spending analysis.",
    tech: ["React", "Node.js", "Express.js", "MongoDB", "Chart.js", "Material-UI"]
  },
  {
    titles: ["Student Information System", "Academic Management Portal", "University Management System", "Educational Platform"],
    description: "Academic management system with student records, course management, grade tracking, and administrative features.",
    tech: ["PHP", "Laravel", "MySQL", "Bootstrap", "jQuery", "Chart.js"]
  }
];

// Utility functions for data generation
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateRandomCGPA(): number {
  // Generate CGPA with realistic distribution (6.5-9.8 range, weighted towards 7.5-8.5)
  const random = Math.random();
  if (random < 0.05) return parseFloat((6.5 + Math.random() * 0.8).toFixed(2)); // 6.5-7.3 (5%)
  if (random < 0.25) return parseFloat((7.3 + Math.random() * 0.5).toFixed(2)); // 7.3-7.8 (20%)
  if (random < 0.60) return parseFloat((7.8 + Math.random() * 0.7).toFixed(2)); // 7.8-8.5 (35%)
  if (random < 0.85) return parseFloat((8.5 + Math.random() * 0.6).toFixed(2)); // 8.5-9.1 (25%)
  return parseFloat((9.1 + Math.random() * 0.7).toFixed(2)); // 9.1-9.8 (15%)
}

function generateCodingRating(cgpa: number): number {
  // Coding rating correlated with CGPA but with some randomness
  if (cgpa >= 9.0) return Math.random() < 0.8 ? (Math.random() < 0.5 ? 5 : 4) : 3;
  if (cgpa >= 8.5) return Math.random() < 0.6 ? (Math.random() < 0.4 ? 5 : 4) : 3;
  if (cgpa >= 8.0) return Math.random() < 0.4 ? 4 : (Math.random() < 0.7 ? 3 : 2);
  if (cgpa >= 7.5) return Math.random() < 0.3 ? 4 : (Math.random() < 0.6 ? 3 : 2);
  return Math.random() < 0.2 ? 3 : (Math.random() < 0.6 ? 2 : 1);
}

function generateSalaryExpectation(cgpa: number, codingRating: number, college: string): { min: number; max: number } {
  let baseMin = 400; // 4 LPA base
  let baseMax = 600; // 6 LPA base
  
  // College tier multiplier
  if (college.includes("IIT")) {
    baseMin = 1200; baseMax = 2000;
  } else if (college.includes("NIT") || college.includes("IIIT")) {
    baseMin = 800; baseMax = 1500;
  } else if (college.includes("BITS") || college.includes("VIT") || college.includes("SRM") || college.includes("Manipal")) {
    baseMin = 600; baseMax = 1200;
  } else if (college.includes("DTU") || college.includes("NSUT") || college.includes("Delhi") || college.includes("Anna University")) {
    baseMin = 500; baseMax = 1000;
  }
  
  // CGPA multiplier
  const cgpaMultiplier = Math.max(0.7, cgpa / 10);
  
  // Coding rating multiplier
  const codingMultiplier = codingRating * 0.2;
  
  const finalMin = Math.round(baseMin * cgpaMultiplier * (1 + codingMultiplier));
  const finalMax = Math.round(baseMax * cgpaMultiplier * (1 + codingMultiplier));
  
  return { min: finalMin, max: finalMax };
}

function generateEmail(firstName: string, lastName: string, college: string): string {
  const collegeDomains = {
    "IIT": "iitd.ac.in",
    "NIT": "student.nitc.ac.in", 
    "IIIT": "students.iiit.ac.in",
    "DTU": "dtu.ac.in",
    "VIT": "vitstudent.ac.in",
    "SRM": "srmist.edu.in"
  };
  
  let domain = "gmail.com";
  for (const [key, value] of Object.entries(collegeDomains)) {
    if (college.includes(key)) {
      domain = value;
      break;
    }
  }
  
  const random = Math.floor(Math.random() * 9999);
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${random}@${domain}`;
}

export async function seedLargeDataset() {
  console.log("🌱 Starting to seed large dataset...");
  
  try {
    // First, seed skills
    console.log("📚 Seeding skills...");
    const skillsData = await Promise.all(
      skillsDatabase.map(async (skill) => {
        try {
          const [insertedSkill] = await db.insert(skills)
            .values(skill)
            .onConflictDoNothing()
            .returning();
          return insertedSkill;
        } catch {
          // Skill might already exist
          const existingSkill = await db.select().from(skills).where(eq(skills.name, skill.name)).limit(1);
          return existingSkill[0];
        }
      })
    );
    
    const validSkills = skillsData.filter(Boolean);
    console.log(`✅ Seeded ${validSkills.length} skills`);

    // Generate and insert students in batches
    const BATCH_SIZE = 1000;
    const TOTAL_STUDENTS = 12000;
    const TOTAL_BATCHES = Math.ceil(TOTAL_STUDENTS / BATCH_SIZE);
    
    console.log(`👥 Generating ${TOTAL_STUDENTS} students across ${indianColleges.length} colleges...`);
    
    for (let batch = 0; batch < TOTAL_BATCHES; batch++) {
      const studentsInThisBatch = Math.min(BATCH_SIZE, TOTAL_STUDENTS - (batch * BATCH_SIZE));
      const studentsToInsert = [];
      
      for (let i = 0; i < studentsInThisBatch; i++) {
        const gender = Math.random() > 0.3 ? 'male' : 'female'; // 70% male, 30% female (reflecting actual engineering demographics)
        const firstName = getRandomElement(indianFirstNames[gender]);
        const lastName = getRandomElement(indianLastNames);
        const college = getRandomElement(indianColleges);
        const location = getRandomElement(indianLocations);
        const major = getRandomElement(engineeringMajors);
        const graduationYear = 2024 + Math.floor(Math.random() * 2); // 2024 or 2025
        const cgpa = generateRandomCGPA();
        const codingRating = generateCodingRating(cgpa);
        const salaryRange = generateSalaryExpectation(cgpa, codingRating, college);
        
        const student = {
          firstName,
          lastName,
          email: generateEmail(firstName, lastName, college),
          phone: `+91${Math.floor(7000000000 + Math.random() * 2999999999)}`,
          university: college,
          degree: "Bachelor of Technology",
          major,
          graduationYear,
          cgpa: cgpa.toString(),
          codingRating,
          location,
          bio: `${major} student at ${college} with strong analytical and problem-solving skills. Passionate about technology and innovation.`,
          expectedSalaryMin: salaryRange.min,
          expectedSalaryMax: salaryRange.max,
          preferredRoles: JSON.stringify([
            major.includes("Computer") || major.includes("IT") || major.includes("Software") ? 
              getRandomElements(["Software Engineer", "Full Stack Developer", "Backend Developer", "Frontend Developer", "DevOps Engineer"], 2) :
            major.includes("Data") || major.includes("AI") || major.includes("ML") ?
              getRandomElements(["Data Scientist", "ML Engineer", "AI Engineer", "Data Analyst"], 2) :
              getRandomElements(["Software Engineer", "System Engineer", "Technical Consultant"], 2)
          ]),
          preferredLocations: JSON.stringify(getRandomElements(
            ["Bangalore", "Mumbai", "Delhi", "Pune", "Chennai", "Hyderabad"], 
            Math.floor(Math.random() * 3) + 2
          )),
          preferredCompanySize: getRandomElement(["startup", "mid-size", "large", "enterprise"]),
          workMode: getRandomElement(["hybrid", "remote", "onsite"]),
          noticePeriod: 0, // Freshers have no notice period
          availableFrom: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000) // Available within next 3 months
        };
        
        studentsToInsert.push(student);
      }
      
      // Insert batch of students
      const insertedStudents = await db.insert(students).values(studentsToInsert).returning();
      
      // Add skills for each student
      const studentSkillsToInsert = [];
      const projectsToInsert = [];
      
      for (const insertedStudent of insertedStudents) {
        // Add 3-8 random skills per student
        const studentSkillCount = Math.floor(Math.random() * 6) + 3;
        const selectedSkills = getRandomElements(validSkills, studentSkillCount);
        
        for (const skill of selectedSkills) {
          if (skill) {
            const proficiencyLevel = Math.floor(Math.random() * 3) + Math.max(1, insertedStudent.codingRating - 2);
            const assessmentScore = Math.min(100, proficiencyLevel * 20 + Math.floor(Math.random() * 20));
            
            studentSkillsToInsert.push({
              studentId: insertedStudent.id,
              skillId: skill.id,
              proficiencyLevel: Math.min(5, proficiencyLevel),
              assessmentScore,
              verified: Math.random() > 0.3 // 70% verified skills
            });
          }
        }
        
        // Add 1-3 projects per student
        const projectCount = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < projectCount; j++) {
          const projectTemplate = getRandomElement(projectTemplates);
          const title = getRandomElement(projectTemplate.titles);
          const technologies = getRandomElements(projectTemplate.tech, Math.floor(Math.random() * 4) + 3);
          
          projectsToInsert.push({
            studentId: insertedStudent.id,
            title,
            description: projectTemplate.description,
            technologies: JSON.stringify(technologies),
            projectUrl: Math.random() > 0.7 ? `https://github.com/${insertedStudent.firstName.toLowerCase()}${insertedStudent.lastName.toLowerCase()}/${title.toLowerCase().replace(/\s+/g, '-')}` : null,
            githubUrl: Math.random() > 0.4 ? `https://github.com/${insertedStudent.firstName.toLowerCase()}${insertedStudent.lastName.toLowerCase()}/${title.toLowerCase().replace(/\s+/g, '-')}` : null,
            featured: j === 0 && Math.random() > 0.6 // First project has 40% chance to be featured
          });
        }
      }
      
      // Insert skills and projects in batches
      if (studentSkillsToInsert.length > 0) {
        await db.insert(studentSkills).values(studentSkillsToInsert);
      }
      
      if (projectsToInsert.length > 0) {
        await db.insert(projects).values(projectsToInsert);
      }
      
      console.log(`✅ Batch ${batch + 1}/${TOTAL_BATCHES} completed (${insertedStudents.length} students)`);
    }
    
    console.log("🎉 Large dataset seeding completed!");
    console.log(`📊 Summary:`);
    console.log(`   - ${TOTAL_STUDENTS} students across ${indianColleges.length} colleges`);
    console.log(`   - ${validSkills.length} skills`);
    console.log(`   - Estimated ${TOTAL_STUDENTS * 2} projects`);
    console.log(`   - Estimated ${TOTAL_STUDENTS * 5} skill assignments`);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}