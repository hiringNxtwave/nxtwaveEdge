import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Target, Eye, Shield } from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";
import { useState } from "react";

interface AssessmentModalProps {
  assessment: {
    type: string;
    score: number;
    level: string;
  };
  student: StudentWithSkills;
  onClose: () => void;
}

interface AssessmentQuestion {
  id: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  timeTaken: number;
  difficulty: string;
}

// Sample assessment data based on assessment type
const generateAssessmentData = (type: string, score: number, studentId: string): AssessmentQuestion[] => {
  // Use student ID for consistent mock data
  const seed = parseInt(studentId.slice(-8), 16);
  const rand = (offset: number) => ((seed * 37 + offset) % 100) / 100;

  const baseQuestions: Record<string, AssessmentQuestion[]> = {
    "Quantitative & Aptitude": [
      {
        id: "quant_1",
        question: "A train traveling at 60 km/hr crosses a platform 200m long in 30 seconds. What is the length of the train?",
        studentAnswer: `Solution:

Let the length of train = L meters

Speed of train = 60 km/hr = 60 × (5/18) m/s = 50/3 m/s

Total distance covered = Length of train + Length of platform
Total distance = L + 200 meters

Time taken = 30 seconds

Using: Distance = Speed × Time
L + 200 = (50/3) × 30
L + 200 = 500
L = 300 meters

Therefore, the length of the train is 300 meters.

Verification: 
Total distance = 300 + 200 = 500m
Speed = 500m ÷ 30s = 16.67 m/s = 60 km/hr ✓`,
        correctAnswer: "Correct answer: 300 meters. Student showed proper conversion of units, clear step-by-step solution, and verification of the answer.",
        isCorrect: score >= 70,
        timeTaken: Math.floor(3 + rand(1) * 2), // 3-5 minutes
        difficulty: "Medium"
      },
      {
        id: "quant_2", 
        question: "In a company, 60% of employees are men and 40% are women. If 25% of men and 50% of women have MBA degrees, what percentage of total employees have MBA degrees?",
        studentAnswer: `Solution:

Let total employees = 100 (for easy calculation)

Men = 60% of 100 = 60
Women = 40% of 100 = 40

Men with MBA = 25% of 60 = 15
Women with MBA = 50% of 40 = 20

Total employees with MBA = 15 + 20 = 35

Percentage of employees with MBA = (35/100) × 100 = 35%

Answer: 35% of total employees have MBA degrees.`,
        correctAnswer: "Correct answer: 35%. Student demonstrated clear understanding of percentage calculations and systematic problem-solving approach.",
        isCorrect: score >= 80,
        timeTaken: Math.floor(4 + rand(2) * 3), // 4-7 minutes
        difficulty: "Easy"
      }
    ],
    "Verbal Ability": [
      {
        id: "verbal_1",
        question: "Choose the word that best completes the sentence: 'The scientist's ______ approach to research yielded groundbreaking results.' (Options: meticulous, haphazard, superficial, careless)",
        studentAnswer: `Selected Answer: meticulous

Reasoning:
The sentence structure indicates a positive outcome ("yielded groundbreaking results"), so we need a positive adjective to describe the scientist's approach.

- Meticulous: Showing great attention to detail; very careful and precise
- Haphazard: Lacking any obvious principle of organization; random
- Superficial: Existing or occurring at or on the surface; shallow
- Careless: Not giving sufficient attention or thought

Since groundbreaking results typically come from careful, detailed, and systematic research, "meticulous" is the most appropriate choice. The other options (haphazard, superficial, careless) would contradict the positive outcome mentioned in the sentence.`,
        correctAnswer: "Correct answer: meticulous. Student showed excellent reasoning and understanding of context clues.",
        isCorrect: score >= 85,
        timeTaken: Math.floor(2 + rand(3) * 2), // 2-4 minutes  
        difficulty: "Medium"
      },
      {
        id: "verbal_2",
        question: "Identify the error in this sentence: 'Neither the manager nor the employees was aware of the policy changes.' Explain the correction.",
        studentAnswer: `Error Identified: Subject-verb disagreement

The error is with the verb "was" which should be "were".

Rule: When using "neither...nor" construction, the verb agrees with the subject closest to it.

In this sentence:
- "Neither the manager nor the employees" - the subject closest to the verb is "employees" (plural)
- Therefore, the verb should be plural: "were"

Corrected sentence: "Neither the manager nor the employees were aware of the policy changes."

Additional examples:
- "Neither the students nor the teacher was ready." (singular - agrees with "teacher")  
- "Neither the teacher nor the students were ready." (plural - agrees with "students")`,
        correctAnswer: "Correct identification: Subject-verb disagreement. The verb should be 'were' to agree with the plural subject 'employees' which is closer to the verb in the neither...nor construction.",
        isCorrect: score >= 90,
        timeTaken: Math.floor(3 + rand(4) * 2), // 3-5 minutes
        difficulty: "Hard"
      }
    ],
    "Interview Performance": [
      {
        id: "interview_1", 
        question: "Tell me about a challenging project you worked on and how you overcame the difficulties.",
        studentAnswer: `Project: E-commerce Mobile App Development (Final Year Project)

**Challenge:** 
Our team of 4 had to build a full-stack e-commerce mobile app in 4 months. Midway through, we faced major issues:
- Integration problems between React Native frontend and Node.js backend
- Database performance issues with complex queries
- Team member dropped out due to personal reasons

**My Approach:**
1. **Technical Problem-Solving:**
   - Redesigned API structure to be more efficient
   - Optimized database queries and added proper indexing
   - Implemented caching layer with Redis

2. **Team Management:**
   - Redistributed work among remaining 3 members
   - Set up daily standups to track progress
   - Created detailed documentation for smoother collaboration

3. **Time Management:**
   - Prioritized core features over nice-to-have features
   - Created realistic timeline with buffer for testing
   - Worked extra hours during critical phases

**Results:**
- Successfully delivered the app on time
- Achieved 95% functionality of original scope
- Received 'Best Project' award in our department
- App handled 1000+ concurrent users during demo

**What I Learned:**
- Importance of thorough planning and risk assessment
- Value of clear communication in team projects
- How to make tough decisions under pressure
- Technical skills in performance optimization`,
        correctAnswer: "Excellent response: Specific example, clear challenge description, detailed solution approach, quantified results, and meaningful lessons learned. Shows leadership, problem-solving, and technical skills.",
        isCorrect: score >= 85,
        timeTaken: Math.floor(8 + rand(5) * 4), // 8-12 minutes
        difficulty: "Medium"
      },
      {
        id: "interview_2",
        question: "Why do you want to work at our company, and how do you see yourself contributing to our team?",
        studentAnswer: `**Why I Want to Work Here:**

1. **Company Mission Alignment:**
Your company's focus on using technology to solve real-world problems resonates with my values. I'm particularly excited about your recent healthcare AI initiatives, which align with my passion for using tech to make a meaningful impact.

2. **Growth Opportunities:**
The company's rapid expansion and investment in R&D shows commitment to innovation. I see opportunities to learn from experienced professionals and work on cutting-edge projects.

3. **Company Culture:**
From my research and conversations with employees on LinkedIn, I appreciate the collaborative culture and emphasis on continuous learning. The flexible work environment and focus on work-life balance are important to me.

**How I Can Contribute:**

1. **Technical Skills:**
- Strong foundation in full-stack development (React, Node.js, Python)
- Experience with cloud platforms (AWS) and DevOps practices
- Problem-solving approach that I've demonstrated through hackathons and projects

2. **Fresh Perspective:**
As a recent graduate, I bring current knowledge of latest technologies and different approaches to problem-solving that could complement the team's experience.

3. **Enthusiasm & Adaptability:**
- Eager to learn and take on challenging tasks
- Quick to adapt to new technologies and methodologies
- Strong work ethic and commitment to quality

4. **Specific Value-Add:**
Based on your job description, I noticed you're expanding the mobile development team. My experience building React Native apps and understanding of mobile-first design principles would be directly applicable.

I'm excited about the possibility of growing with the company while contributing to projects that have real impact.`,
        correctAnswer: "Outstanding response: Well-researched company knowledge, clear personal motivations, specific ways to contribute, and genuine enthusiasm. Shows preparation and strong cultural fit.",
        isCorrect: score >= 90,
        timeTaken: Math.floor(10 + rand(6) * 5), // 10-15 minutes
        difficulty: "Hard"
      }
    ],
    "DSA Assessment": [
      {
        id: "dsa_1",
        question: "Implement a function to find the shortest path between two nodes in a weighted graph using Dijkstra's algorithm.",
        studentAnswer: `function dijkstra(graph, start, end) {
  const distances = {};
  const visited = new Set();
  const pq = new PriorityQueue();
  
  // Initialize distances
  for (let node in graph) {
    distances[node] = node === start ? 0 : Infinity;
  }
  
  pq.enqueue(start, 0);
  
  while (!pq.isEmpty()) {
    const current = pq.dequeue().element;
    
    if (visited.has(current)) continue;
    visited.add(current);
    
    if (current === end) break;
    
    for (let neighbor of graph[current]) {
      const distance = distances[current] + neighbor.weight;
      if (distance < distances[neighbor.node]) {
        distances[neighbor.node] = distance;
        pq.enqueue(neighbor.node, distance);
      }
    }
  }
  
  return distances[end];
}

// Priority Queue implementation
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element, priority) {
    this.items.push({element, priority});
    this.items.sort((a, b) => a.priority - b.priority);
  }
  
  dequeue() {
    return this.items.shift();
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}`,
        correctAnswer: "Excellent implementation with proper priority queue class. Shows deep understanding of graph algorithms and optimal time complexity O((V + E) log V).",
        isCorrect: score >= 70,
        timeTaken: Math.floor(25 + rand(1) * 10), // 25-35 minutes
        difficulty: "Hard"
      },
      {
        id: "dsa_2", 
        question: "Given an array of integers, find all pairs that sum to a target value. Return the indices of the pairs.",
        studentAnswer: `function twoSum(nums, target) {
  const map = new Map();
  const result = [];
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      result.push([map.get(complement), i]);
    }
    
    map.set(nums[i], i);
  }
  
  return result;
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // [[0, 1]]
console.log(twoSum([3, 2, 4], 6)); // [[1, 2]]
console.log(twoSum([3, 3], 6)); // [[0, 1]]`,
        correctAnswer: "Perfect O(n) solution using hash map approach. Student included test cases showing thorough understanding.",
        isCorrect: score >= 60,
        timeTaken: Math.floor(10 + rand(2) * 5), // 10-15 minutes
        difficulty: "Medium"
      },
      {
        id: "dsa_3",
        question: "Implement a binary search algorithm for a sorted array. Handle edge cases.",
        studentAnswer: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Element not found
}

// Edge case handling
function safeBinarySearch(arr, target) {
  if (!arr || arr.length === 0) return -1;
  if (typeof target === 'undefined') return -1;
  
  return binarySearch(arr, target);
}`,
        correctAnswer: "Clean binary search implementation with proper edge case handling. Shows attention to detail.",
        isCorrect: score >= 75,
        timeTaken: Math.floor(12 + rand(3) * 6), // 12-18 minutes
        difficulty: "Medium"
      }
    ],
    "Aptitude Test": [
      {
        id: "apt_1",
        question: "If a train travels 120 km in 2 hours, and then 180 km in 3 hours, what is the average speed for the entire journey?\n\nA) 55 km/h\nB) 60 km/h\nC) 65 km/h\nD) 70 km/h",
        studentAnswer: "Selected Answer: B) 60 km/h\n\nWorking:\nTotal distance = 120 + 180 = 300 km\nTotal time = 2 + 3 = 5 hours\nAverage speed = Total distance / Total time\nAverage speed = 300/5 = 60 km/h",
        correctAnswer: "Correct answer: B) 60 km/h. Student showed clear step-by-step calculation and proper understanding of average speed formula.",
        isCorrect: score >= 75,
        timeTaken: Math.floor(3 + rand(3) * 2), // 3-5 minutes
        difficulty: "Medium"
      },
      {
        id: "apt_2",
        question: "A company's profit increased by 25% in the first quarter and then decreased by 20% in the second quarter. If the initial profit was $10,000, what is the profit after two quarters?\n\nA) $9,000\nB) $10,000\nC) $11,000\nD) $12,000",
        studentAnswer: "Selected Answer: B) $10,000\n\nCalculation:\nInitial profit: $10,000\nAfter Q1 increase (25%): $10,000 × 1.25 = $12,500\nAfter Q2 decrease (20%): $12,500 × 0.80 = $10,000\nFinal profit: $10,000",
        correctAnswer: "Correct answer: B) $10,000. Excellent work showing compound percentage calculations step by step.",
        isCorrect: score >= 80,
        timeTaken: Math.floor(4 + rand(4) * 2), // 4-6 minutes
        difficulty: "Medium"
      },
      {
        id: "apt_3",
        question: "In a class of 40 students, 60% are boys. If 25% of the boys and 20% of the girls play cricket, how many students play cricket?\n\nA) 8 students\nB) 9 students\nC) 10 students\nD) 11 students",
        studentAnswer: "Selected Answer: C) 10 students\n\nSolution:\nTotal students = 40\nBoys = 60% of 40 = 24 boys\nGirls = 40 - 24 = 16 girls\n\nBoys playing cricket = 25% of 24 = 6 boys\nGirls playing cricket = 20% of 16 = 3.2 ≈ 3 girls\n\nTotal cricket players = 6 + 3 = 9 students\n\nNote: I made an error in my selection. The correct answer should be B) 9 students.",
        correctAnswer: "Correct answer: B) 9 students. Student showed good problem-solving approach but made a calculation error in final selection. Self-correction noted shows good analytical thinking.",
        isCorrect: score >= 70,
        timeTaken: Math.floor(5 + rand(5) * 3), // 5-8 minutes
        difficulty: "Medium"
      },
      {
        id: "apt_4",
        question: "If the ratio of ages of A and B is 3:4, and the sum of their ages is 35 years, what will be A's age after 5 years?\n\nA) 15 years\nB) 18 years\nC) 20 years\nD) 22 years",
        studentAnswer: "Selected Answer: D) 22 years\n\nMethod:\nLet A's current age = 3x and B's current age = 4x\nSum of ages = 3x + 4x = 7x = 35\nSo x = 35/7 = 5\n\nA's current age = 3x = 3 × 5 = 15 years\nB's current age = 4x = 4 × 5 = 20 years\n\nA's age after 5 years = 15 + 5 = 20 years\n\nWait, I think I selected wrong. Answer should be C) 20 years.",
        correctAnswer: "Correct answer: C) 20 years. Student demonstrated excellent problem-solving using ratio method. Self-correction shows good verification skills.",
        isCorrect: score >= 85,
        timeTaken: Math.floor(6 + rand(6) * 2), // 6-8 minutes
        difficulty: "Hard"
      }
    ],
    "Communication": [
      {
        id: "comm_1",
        question: "Describe a challenging project you worked on and how you overcame the difficulties. (Spoken response - 3 minutes)",
        studentAnswer: "Audio Transcript:\n\n\"So, I worked on developing a real-time chat application using React and Node.js during my internship. The main challenge I faced was implementing WebSocket connections with proper error handling and reconnection logic.\n\nInitially, I was getting frequent disconnections and the chat would just stop working. Users were losing messages and getting frustrated. I spent days trying to debug this.\n\nWhat I did was:\n1. First, I researched Socket.io documentation thoroughly\n2. I broke down the problem into smaller components\n3. I implemented a robust retry mechanism with exponential backoff\n4. I added proper error logging to understand what was happening\n5. I created a fallback system using long polling when WebSockets failed\n\nThe hardest part was testing edge cases like network drops and server restarts. I had to simulate these conditions.\n\nIn the end, the application became much more stable. The project taught me the importance of proper error handling in real-time applications and how to approach complex debugging systematically.\"\n\nDelivery Assessment:\n- Clear structure and logical flow\n- Good use of specific technical details\n- Confident speaking pace\n- Minimal filler words (um, uh)\n- Strong conclusion with key learnings",
        correctAnswer: "Excellent communication: structured response, technical depth, clear problem-solution narrative, confident delivery. Shows good storytelling ability and reflection on learning.",
        isCorrect: score >= 70,
        timeTaken: Math.floor(8 + rand(5) * 4), // 8-12 minutes
        difficulty: "Medium"
      },
      {
        id: "comm_2",
        question: "How would you explain a complex technical concept (like APIs) to a non-technical stakeholder? (Written + Verbal explanation)",
        studentAnswer: "Written Response:\n\n\"I would use the restaurant analogy to explain APIs:\n\nAPIs are like waiters in a restaurant. When you (the application) want to order food (request data), you don't go directly to the kitchen (database or server). Instead, you tell the waiter (API) what you want from the menu (available endpoints).\n\nThe waiter takes your order, goes to the kitchen, and brings back exactly what you asked for in a nice, presentable format. The waiter knows how to communicate with the kitchen staff and translates your request into something they understand.\n\nSimilarly, APIs act as intermediaries between different software applications, allowing them to communicate and share data without knowing the internal complexities of each other.\"\n\nVerbal Explanation (Recorded):\n\"Let me give you a simple example everyone can relate to. Think about when you use a food delivery app like Zomato...\n\n[Student proceeded to explain using real-world examples, checking for understanding, and adapting language based on stakeholder feedback]\"\n\nCommunication Skills Demonstrated:\n- Clear analogies\n- Checked for understanding\n- Adapted explanation style\n- Used relatable examples",
        correctAnswer: "Strong technical communication: effective analogies, clear written and verbal skills, stakeholder awareness. Good adaptation and verification of understanding.",
        isCorrect: score >= 65,
        timeTaken: Math.floor(5 + rand(6) * 3), // 5-8 minutes
        difficulty: "Medium"
      },
      {
        id: "comm_3",
        question: "You need to present quarterly results to senior management. The project was delayed and over budget. How do you communicate this? (Role-play scenario)",
        studentAnswer: "Presentation Approach (Recorded):\n\n\"Good morning, team. I want to start by acknowledging that our Q3 project didn't meet our original timeline and budget targets. Let me walk you through what happened, what we've learned, and our path forward.\n\nKey Points Covered:\n\n1. **Transparent Problem Statement**\n   - Project delivered 2 weeks late\n   - 15% over budget ($45K additional)\n   - Core functionality complete, 2 features postponed\n\n2. **Root Cause Analysis**\n   - Underestimated API integration complexity\n   - Third-party service changes mid-project\n   - Required additional security compliance review\n\n3. **Actions Taken**\n   - Negotiated extended timeline with stakeholders\n   - Prioritized critical features for go-live\n   - Implemented daily standups for better tracking\n\n4. **Value Delivered**\n   - Core platform operational and generating revenue\n   - User feedback positive (4.2/5 rating)\n   - Foundation built for future enhancements\n\n5. **Lessons Learned & Future Prevention**\n   - Better vendor risk assessment\n   - 20% buffer for complex integrations\n   - Earlier stakeholder alignment on scope\n\nNext quarter, we're implementing these process improvements...\"\n\nDelivery Assessment:\n- Owned the problem immediately\n- Data-driven communication\n- Solution-focused approach\n- Professional demeanor under pressure",
        correctAnswer: "Outstanding crisis communication: accountability, transparency, data-backed analysis, forward-looking solutions. Demonstrates leadership communication skills under pressure.",
        isCorrect: score >= 80,
        timeTaken: Math.floor(10 + rand(7) * 5), // 10-15 minutes
        difficulty: "Hard"
      },
      {
        id: "comm_4",
        question: "Explain your approach to giving constructive feedback to a team member whose code quality has been inconsistent. (Situational question)",
        studentAnswer: "My Approach:\n\n**1. Preparation & Context**\nI would first review specific examples of the inconsistent code quality, noting both good and problematic instances. I'd choose a private, comfortable setting for the conversation.\n\n**2. Opening the Conversation**\n\"Hey [Name], I wanted to have a quick chat about our recent code reviews. I've noticed some inconsistency in our coding patterns, and I'd love to understand what's happening and how we can support you better.\"\n\n**3. Specific Examples (Not Personal Attacks)**\n- \"In the user authentication module, the error handling was really well structured\"\n- \"However, in the payment processing code, I noticed some missing validations and inconsistent naming conventions\"\n- \"This creates potential security risks and makes it harder for the team to maintain\"\n\n**4. Listen & Understand**\n\"What's your perspective on this? Are there any blockers or challenges you're facing?\"\n\n**5. Collaborative Solution**\n- Pair programming sessions\n- Code review checklist\n- Share resources on best practices\n- Regular check-ins\n\n**6. Follow-up Plan**\n\"Let's check in again next week to see how things are going. I'm here to support you.\"\n\n**Communication Principles Applied:**\n- Start with empathy\n- Use specific examples, not generalizations\n- Focus on behavior/code, not personality\n- Collaborative problem-solving\n- Clear follow-up plan\n- Supportive tone throughout",
        correctAnswer: "Excellent feedback approach: structured, empathetic, specific, solution-oriented. Shows strong interpersonal and leadership communication skills.",
        isCorrect: score >= 75,
        timeTaken: Math.floor(7 + rand(8) * 4), // 7-11 minutes
        difficulty: "Hard"
      }
    ],
    "Tech Fundamentals": [
      {
        id: "sys_1",
        question: "Explain the differences between HTTP and HTTPS, and describe how SSL/TLS handshake works.",
        studentAnswer: `HTTP vs HTTPS Analysis:

1. **HTTP (HyperText Transfer Protocol)**
   - Port 80 (default)
   - Data transmitted in plain text
   - No encryption - vulnerable to eavesdropping
   - Faster (no encryption overhead)
   - Stateless protocol

2. **HTTPS (HTTP Secure)**
   - Port 443 (default)
   - HTTP over SSL/TLS
   - End-to-end encryption
   - Data integrity verification
   - Server authentication

3. **SSL/TLS Handshake Process**

Step 1: Client Hello
- Client sends supported cipher suites
- Random number for session
- Supported SSL/TLS versions

Step 2: Server Hello
- Server selects cipher suite
- Server random number
- Server certificate (public key)

Step 3: Certificate Verification
- Client validates certificate chain
- Checks certificate authority (CA)
- Verifies domain name matches

Step 4: Key Exchange
- Client generates pre-master secret
- Encrypts with server's public key
- Sends to server

Step 5: Session Keys Generation
- Both parties derive session keys
- From pre-master secret + random numbers
- Using agreed key derivation function

Step 6: Finished Messages
- Both send encrypted "finished" messages
- Verifies handshake integrity
- Secure communication begins

4. **Security Benefits**
   - Prevents man-in-the-middle attacks
   - Ensures data confidentiality
   - Verifies server authenticity
   - Protects against data tampering
`,
        correctAnswer: "Excellent understanding of HTTP/HTTPS protocols and SSL/TLS encryption. Shows strong grasp of web security fundamentals and network communication protocols.",
        isCorrect: score >= 75,
        timeTaken: Math.floor(30 + rand(7) * 15), // 30-45 minutes
        difficulty: "Hard"
      },
      {
        id: "sys_2",
        question: "Design a real-time chat application that can handle 1 million concurrent users. Include message delivery, user presence, and notification systems.",
        studentAnswer: `Real-Time Chat System Design

1. Architecture Overview
Mobile/Web Clients -> Load Balancer -> API Gateway
                                   -> WebSocket Servers (Socket.io)
                                   -> Message Queue (Apache Kafka)
                                   -> Microservices
                                   -> Database Cluster

2. Core Services
- Connection Service: Manages WebSocket connections
- Message Service: Handles message routing and storage
- Presence Service: Tracks user online/offline status
- Notification Service: Push notifications for offline users
- User Service: Authentication and user management

3. Database Schema
-- Messages table (sharded by chat_room_id)
CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chat_room_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    message_type ENUM('text', 'image', 'file') DEFAULT 'text',
    created_at TIMESTAMP,
    INDEX idx_room_timestamp (chat_room_id, created_at)
);

-- User presence (Redis)
SET user:123:presence "online"
EXPIRE user:123:presence 300  -- 5 minute TTL

4. Message Flow
// Message handling pipeline
1. Client sends message via WebSocket
2. Validate and authenticate user
3. Store message in database
4. Publish to Kafka topic
5. Kafka consumers deliver to connected users
6. Store in Redis for recent message cache
7. Send push notification if user offline

5. Scalability Solutions
- WebSocket Server Scaling: Sticky sessions with Redis
- Database Sharding: By chat_room_id for even distribution
- Message Queuing: Kafka partitions for parallel processing
- Caching: Redis for recent messages and user sessions

6. Real-time Features Implementation
// Presence system
io.on('connection', (socket) => {
    // User comes online
    redis.set('user:' + userId + ':presence', 'online', 'EX', 300);
    socket.broadcast.emit('user_online', userId);
    
    // Heartbeat to maintain presence
    setInterval(() => {
        socket.emit('ping');
    }, 30000);
});

7. Performance Optimizations
- Message pagination with cursor-based approach
- Lazy loading of chat history
- Image/file compression and CDN storage
- Connection pooling and keep-alive`,
        correctAnswer: "Exceptional system design: complete architecture for high-scale real-time system, detailed implementation strategies, proper use of technologies, and performance considerations. Demonstrates senior-level system design skills.",
        isCorrect: score >= 85,
        timeTaken: Math.floor(45 + rand(8) * 20), // 45-65 minutes
        difficulty: "Hard"
      }
    ]
  };

  return baseQuestions[type as keyof typeof baseQuestions] || [];
};

export default function AssessmentModal({ assessment, student, onClose }: AssessmentModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('details');
  
  const assessmentData = generateAssessmentData(assessment.type, assessment.score, student.id);
  const correctAnswers = assessmentData.filter((q: AssessmentQuestion) => q.isCorrect).length;
  const totalQuestions = assessmentData.length;
  const totalTime = assessmentData.reduce((sum: number, q: AssessmentQuestion) => sum + q.timeTaken, 0);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-600" />
                {assessment.type} - {student.firstName} {student.lastName}
              </DialogTitle>
              <DialogDescription className="text-lg mt-2">
                Detailed assessment breakdown and student responses
              </DialogDescription>
            </div>
            {student.verified && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">Verified Profile</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'overview' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Assessment Overview
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'details' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Detailed Responses
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{assessment.score}%</div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                    <Badge variant="secondary" className="mt-2">{assessment.level}</Badge>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{correctAnswers}/{totalQuestions}</div>
                    <div className="text-sm text-gray-600">Questions Correct</div>
                    <Badge variant="secondary" className="mt-2">
                      {Math.round((correctAnswers/totalQuestions) * 100)}% Accuracy
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{totalTime}m</div>
                    <div className="text-sm text-gray-600">Total Time</div>
                    <Badge variant="secondary" className="mt-2">
                      {Math.round(totalTime/totalQuestions)}m avg/question
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Insights */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Performance Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-700">Strengths</h4>
                      <ul className="space-y-2">
                        {assessment.score >= 80 && (
                          <li className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Excellent problem-solving approach
                          </li>
                        )}
                        {assessment.score >= 70 && (
                          <li className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Good understanding of core concepts
                          </li>
                        )}
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          Consistent performance across questions
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-orange-700">Areas for Growth</h4>
                      <ul className="space-y-2">
                        {assessment.score < 80 && (
                          <li className="flex items-center gap-2 text-sm">
                            <XCircle className="w-4 h-4 text-orange-600" />
                            Could improve time efficiency
                          </li>
                        )}
                        {assessment.score < 70 && (
                          <li className="flex items-center gap-2 text-sm">
                            <XCircle className="w-4 h-4 text-orange-600" />
                            Need more practice with complex scenarios
                          </li>
                        )}
                        <li className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-blue-600" />
                          Continue practicing advanced concepts
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              {assessmentData.map((question: AssessmentQuestion, index: number) => (
                <Card key={question.id} className={`border-l-4 ${question.isCorrect ? 'border-l-green-500' : 'border-l-orange-500'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline">Question {index + 1}</Badge>
                          <Badge variant={question.difficulty === 'Hard' ? 'destructive' : question.difficulty === 'Medium' ? 'default' : 'secondary'}>
                            {question.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {question.timeTaken}m
                          </div>
                        </div>
                        <h4 className="font-semibold text-lg mb-3">{question.question}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        {question.isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Student's Answer:</h5>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{question.studentAnswer}</pre>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Assessment Notes:</h5>
                        <div className={`p-4 rounded-lg ${question.isCorrect ? 'bg-green-50' : 'bg-orange-50'}`}>
                          <p className={`text-sm ${question.isCorrect ? 'text-green-800' : 'text-orange-800'}`}>
                            {question.correctAnswer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Download Assessment Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}