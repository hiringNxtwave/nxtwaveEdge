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
  type?: 'mcq' | 'text';
  options?: string[];
  selectedOption?: string;
  correctOption?: string;
}

// Sample assessment data based on assessment type
const generateAssessmentData = (type: string, score: number, studentId: string): AssessmentQuestion[] => {
  // Use student ID for consistent mock data
  const seed = parseInt(studentId.slice(-8), 16);
  const rand = (offset: number) => ((seed * 37 + offset) % 100) / 100;
  
  // Make first student (Rahul Sharma) have some incorrect answers for realism
  const isFirstStudent = studentId.includes('student-1');

  const baseQuestions: Record<string, AssessmentQuestion[]> = {
    "Aptitude": [
      {
        id: "quant_1",
        type: "mcq",
        question: "A train traveling at 60 km/hr crosses a platform 200m long in 30 seconds. What is the length of the train?",
        options: ["200 meters", "250 meters", "300 meters", "350 meters"],
        selectedOption: isFirstStudent ? "250 meters" : "300 meters",
        correctOption: "300 meters",
        studentAnswer: isFirstStudent ? "250 meters" : "300 meters",
        correctAnswer: isFirstStudent ? "Incorrect. The correct answer is 300 meters. Using Distance = Speed × Time: Total distance = (60 × 5/18) × 30 = 500m. Train length = 500m - 200m = 300m." : "Correct! The train length is 300 meters. Using Distance = Speed × Time: Total distance = (60 × 5/18) × 30 = 500m. Train length = 500m - 200m = 300m.",
        isCorrect: isFirstStudent ? false : score >= 70,
        timeTaken: Math.floor(2 + rand(1) * 2), // 2-4 minutes
        difficulty: "Medium"
      },
      {
        id: "quant_2",
        type: "mcq", 
        question: "In a company, 60% of employees are men and 40% are women. If 25% of men and 50% of women have MBA degrees, what percentage of total employees have MBA degrees?",
        options: ["30%", "35%", "40%", "45%"],
        selectedOption: isFirstStudent ? "40%" : "35%",
        correctOption: "35%",
        studentAnswer: isFirstStudent ? "40%" : "35%",
        correctAnswer: isFirstStudent ? "Incorrect. The correct answer is 35%. Men with MBA: 60% × 25% = 15%. Women with MBA: 40% × 50% = 20%. Total: 15% + 20% = 35%." : "Correct! 35% of total employees have MBA degrees. Men with MBA: 60% × 25% = 15%. Women with MBA: 40% × 50% = 20%. Total: 15% + 20% = 35%.",
        isCorrect: isFirstStudent ? false : score >= 70,
        timeTaken: Math.floor(2 + rand(2) * 2), // 2-4 minutes
        difficulty: "Easy"
      },
      {
        id: "quant_3",
        type: "mcq",
        question: "If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?",
        options: ["8", "10", "12", "15"],
        selectedOption: rand(3) > 0.7 ? "12" : "10",
        correctOption: "10",
        studentAnswer: rand(3) > 0.7 ? "12" : "10",
        correctAnswer: "Correct! There are 10 girls. If boys:girls = 3:2 and boys = 15, then 3x = 15, so x = 5. Therefore girls = 2x = 2×5 = 10.",
        isCorrect: (rand(3) > 0.7 ? "12" : "10") === "10",
        timeTaken: Math.floor(1 + rand(4) * 2), // 1-3 minutes
        difficulty: "Easy"
      },
      {
        id: "quant_4",
        type: "mcq",
        question: "What is 15% of 80?",
        options: ["10", "12", "15", "20"],
        selectedOption: score >= 60 ? "12" : "15",
        correctOption: "12",
        studentAnswer: score >= 60 ? "12" : "15",
        correctAnswer: "Correct! 15% of 80 = (15/100) × 80 = 0.15 × 80 = 12.",
        isCorrect: score >= 60,
        timeTaken: Math.floor(1 + rand(5) * 1), // 1-2 minutes
        difficulty: "Easy"
      }
    ],
    "CS Fundamentals": [
      {
        id: "cs_1",
        type: "mcq",
        question: "What is the main advantage of using a hash table over an array for data storage?",
        options: ["Faster insertion at end", "O(1) average lookup time", "Uses less memory", "Maintains sorted order"],
        selectedOption: score >= 70 ? "O(1) average lookup time" : "Uses less memory",
        correctOption: "O(1) average lookup time",
        studentAnswer: score >= 70 ? "O(1) average lookup time" : "Uses less memory",
        correctAnswer: score >= 70 ? "Correct! Hash tables provide O(1) average lookup time through direct key-to-index mapping, making them ideal for fast data retrieval." : "Incorrect. The correct answer is O(1) average lookup time. Hash tables use a hash function to map keys directly to array indices, providing constant-time lookups on average.",
        isCorrect: score >= 70,
        timeTaken: Math.floor(2 + rand(1) * 2),
        difficulty: "Medium"
      },
      {
        id: "cs_2", 
        type: "mcq",
        question: "In object-oriented programming, what is the main purpose of encapsulation?",
        options: ["Code reusability", "Data hiding and access control", "Multiple inheritance", "Dynamic binding"],
        selectedOption: isFirstStudent ? "Code reusability" : "Data hiding and access control",
        correctOption: "Data hiding and access control", 
        studentAnswer: isFirstStudent ? "Code reusability" : "Data hiding and access control",
        correctAnswer: isFirstStudent ? "Incorrect. The main purpose of encapsulation is data hiding and access control. While code reusability is a benefit of OOP, encapsulation specifically refers to bundling data and methods together and controlling access to them." : "Correct! Encapsulation is about data hiding and access control, bundling data with methods and restricting direct access to internal object details.",
        isCorrect: isFirstStudent ? false : score >= 65,
        timeTaken: Math.floor(1.5 + rand(2) * 1.5),
        difficulty: "Easy"
      },
      {
        id: "cs_3",
        type: "mcq", 
        question: "Which of the following best describes the purpose of a database index?",
        options: ["Stores backup data", "Speeds up query operations", "Encrypts sensitive data", "Manages user permissions"],
        selectedOption: score >= 75 ? "Speeds up query operations" : "Stores backup data",
        correctOption: "Speeds up query operations",
        studentAnswer: score >= 75 ? "Speeds up query operations" : "Stores backup data", 
        correctAnswer: score >= 75 ? "Correct! Database indexes create additional data structures that allow faster query operations by providing quick paths to locate specific rows." : "Incorrect. Database indexes are used to speed up query operations by creating efficient data structures for quick data retrieval, not for storing backup data.",
        isCorrect: score >= 75,
        timeTaken: Math.floor(2 + rand(3) * 1),
        difficulty: "Medium"
      },
      {
        id: "cs_4",
        type: "mcq",
        question: "What is the time complexity of binary search on a sorted array of n elements?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        selectedOption: "O(log n)",
        correctOption: "O(log n)",
        studentAnswer: "O(log n)",
        correctAnswer: "Correct! Binary search has O(log n) time complexity because it eliminates half of the remaining elements in each iteration.",
        isCorrect: true,
        timeTaken: Math.floor(1 + rand(4) * 1),
        difficulty: "Easy"
      }
    ],
    "Verbal Ability": [
      {
        id: "comm_1",
        type: "mcq",
        question: "When giving a presentation to stakeholders, what is the most important factor for maintaining audience engagement?",
        options: ["Using complex technical terminology", "Tailoring content to audience knowledge level", "Speaking as quickly as possible", "Including as many slides as possible"],
        selectedOption: isFirstStudent ? "Using complex technical terminology" : "Tailoring content to audience knowledge level",
        correctOption: "Tailoring content to audience knowledge level",
        studentAnswer: isFirstStudent ? "Using complex technical terminology" : "Tailoring content to audience knowledge level",
        correctAnswer: isFirstStudent ? "Incorrect. The correct answer is tailoring content to audience knowledge level. Using complex technical terminology can alienate non-technical stakeholders and reduce engagement." : "Correct! Tailoring content to your audience's knowledge level ensures they can follow along, stay engaged, and make informed decisions.",
        isCorrect: isFirstStudent ? false : score >= 80,
        timeTaken: Math.floor(2 + rand(1) * 2),
        difficulty: "Medium"
      },
      {
        id: "comm_2",
        type: "mcq",
        question: "In a team conflict situation, what is the most effective first step?",
        options: ["Take sides with the person who seems right", "Ignore the conflict until it resolves itself", "Listen to all parties involved", "Escalate to management immediately"],
        selectedOption: score >= 85 ? "Listen to all parties involved" : "Escalate to management immediately",
        correctOption: "Listen to all parties involved",
        studentAnswer: score >= 85 ? "Listen to all parties involved" : "Escalate to management immediately",
        correctAnswer: score >= 85 ? "Correct! Active listening to all parties helps understand the root cause and different perspectives before taking action." : "Incorrect. The most effective first step is to listen to all parties involved. This helps you understand the situation fully before deciding on the best course of action.",
        isCorrect: score >= 85,
        timeTaken: Math.floor(3 + rand(2) * 2),
        difficulty: "Medium"
      },
      {
        id: "comm_3",
        type: "mcq",
        question: "What is the key principle of effective written communication in a professional environment?",
        options: ["Use as many words as possible for clarity", "Be concise while maintaining completeness", "Always use formal language regardless of context", "Include personal opinions to show engagement"],
        selectedOption: "Be concise while maintaining completeness",
        correctOption: "Be concise while maintaining completeness",
        studentAnswer: "Be concise while maintaining completeness", 
        correctAnswer: "Correct! Effective professional writing balances brevity with completeness, ensuring the message is clear without unnecessary words.",
        isCorrect: true,
        timeTaken: Math.floor(2 + rand(3) * 1.5),
        difficulty: "Easy"
      },
      {
        id: "comm_4",
        type: "mcq",
        question: "When receiving constructive feedback, what is the most professional response?",
        options: ["Defend your actions immediately", "Ask clarifying questions to understand better", "Agree with everything to avoid conflict", "Change the subject to something positive"],
        selectedOption: rand(5) > 0.3 ? "Ask clarifying questions to understand better" : "Agree with everything to avoid conflict",
        correctOption: "Ask clarifying questions to understand better",
        studentAnswer: rand(5) > 0.3 ? "Ask clarifying questions to understand better" : "Agree with everything to avoid conflict",
        correctAnswer: (rand(5) > 0.3 ? "Ask clarifying questions to understand better" : "Agree with everything to avoid conflict") === "Ask clarifying questions to understand better" ? 
          "Correct! Asking clarifying questions shows professionalism and genuine interest in improvement." : 
          "Incorrect. The most professional response is to ask clarifying questions to understand the feedback better, showing you're open to growth.",
        isCorrect: (rand(5) > 0.3 ? "Ask clarifying questions to understand better" : "Agree with everything to avoid conflict") === "Ask clarifying questions to understand better",
        timeTaken: Math.floor(2 + rand(4) * 2),
        difficulty: "Medium"
      }
    ],
    "Tech Fundamentals": [
      {
        id: "tech_1",
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
   - Protects against data tampering`,
        correctAnswer: "Excellent understanding of HTTP/HTTPS protocols and SSL/TLS encryption. Shows strong grasp of web security fundamentals and network communication protocols.",
        isCorrect: score >= 75,
        timeTaken: Math.floor(30 + rand(7) * 15), // 30-45 minutes
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
- Integration problems between mobile frontend and backend services
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
- Strong foundation in full-stack development and modern programming
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
    "DSA": [
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
    "System Design": [
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
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'code-recording'>('overview');
  
  // Define which assessments involve coding
  const codingAssessments = ['DSA', 'CS Fundamentals', 'Tech Fundamentals', 'System Design'];
  const hasCodeRecording = codingAssessments.includes(assessment.type);
  
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
          {hasCodeRecording && (
            <button
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'code-recording' 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('code-recording')}
            >
              Code Recording
            </button>
          )}
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Score Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{assessment.score}%</div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                    <Badge variant="secondary" className="mt-2">{assessment.level}</Badge>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-50">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{correctAnswers}/{totalQuestions}</div>
                    <div className="text-sm text-gray-600">Questions Correct</div>
                    <Badge variant="secondary" className="mt-2">
                      {Math.round((correctAnswers/totalQuestions) * 100)}% Accuracy
                    </Badge>
                  </CardContent>
                </Card>
                
                <Card className="bg-purple-50">
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

          {activeTab === 'code-recording' && hasCodeRecording && (
            <div className="space-y-6">
              {/* Code Recording Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Code Recording - Line by Line Analysis</h3>
                      <p className="text-gray-600">Watch how {student.firstName} wrote the code with timeline seeking</p>
                    </div>
                  </div>

                  {/* Code Player */}
                  <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
                    <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-gray-300 text-sm">solution.js</span>
                      </div>
                      <div className="text-gray-300 text-sm">Recording: 24:32 total</div>
                    </div>
                    
                    <div className="p-4">
                      <pre className="text-green-400 text-sm font-mono leading-relaxed">
                        <code>{`// Binary Search Implementation - Two Sum Problem
// Started at 00:15

function twoSum(nums, target) {                    // 00:45
    const map = new Map();                         // 01:12
    
    for (let i = 0; i < nums.length; i++) {       // 01:45
        const complement = target - nums[i];       // 02:30
        
        if (map.has(complement)) {                 // 03:15
            return [map.get(complement), i];       // 03:45
        }                                          // 04:00
        
        map.set(nums[i], i);                       // 04:30
    }                                              // 04:45
    
    return [];                                     // 05:00
}

// Test cases - Added at 06:30
console.log(twoSum([2, 7, 11, 15], 9));          // 07:00
console.log(twoSum([3, 2, 4], 6));               // 07:15
console.log(twoSum([3, 3], 6));                  // 07:30

// Time Complexity: O(n) - Single pass         // 08:15
// Space Complexity: O(n) - Hash map storage   // 08:45`}</code>
                      </pre>
                    </div>

                    {/* Timeline Controls */}
                    <div className="bg-gray-800 p-4 border-t border-gray-700">
                      <div className="flex items-center gap-4 mb-3">
                        <button className="p-2 bg-green-600 rounded-full hover:bg-green-700 transition-colors">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </button>
                        <span className="text-white text-sm font-mono">05:23 / 24:32</span>
                        <div className="flex-1 bg-gray-600 rounded-full h-2 relative cursor-pointer">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                          <div className="absolute top-0 left-0 w-full h-2 flex">
                            {/* Code checkpoints */}
                            <div className="absolute bg-blue-400 w-1 h-4 -mt-1" style={{ left: '3%' }} title="00:45 - Function declaration"></div>
                            <div className="absolute bg-blue-400 w-1 h-4 -mt-1" style={{ left: '5%' }} title="01:12 - Map initialization"></div>
                            <div className="absolute bg-blue-400 w-1 h-4 -mt-1" style={{ left: '7%' }} title="01:45 - For loop"></div>
                            <div className="absolute bg-yellow-400 w-1 h-4 -mt-1" style={{ left: '12%' }} title="02:30 - Complement calculation"></div>
                            <div className="absolute bg-green-400 w-1 h-4 -mt-1" style={{ left: '18%' }} title="03:45 - Return statement"></div>
                            <div className="absolute bg-purple-400 w-1 h-4 -mt-1" style={{ left: '27%' }} title="06:30 - Test cases"></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600">0.5x</button>
                          <button className="px-3 py-1 bg-green-600 text-white text-xs rounded">1x</button>
                          <button className="px-3 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600">2x</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code Timeline Events */}
                  <div>
                    <h4 className="font-semibold text-lg mb-4">Code Development Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-mono text-sm text-blue-800">00:45</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Function declaration</p>
                          <p className="text-xs text-gray-600">function twoSum(nums, target) &#123;</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Clock className="w-4 h-4 mr-1" />
                          Seek
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="font-mono text-sm text-blue-800">01:12</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Map initialization</p>
                          <p className="text-xs text-gray-600">const map = new Map();</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Clock className="w-4 h-4 mr-1" />
                          Seek
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-mono text-sm text-yellow-800">02:30</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Core logic implementation</p>
                          <p className="text-xs text-gray-600">const complement = target - nums[i];</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Clock className="w-4 h-4 mr-1" />
                          Seek
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-mono text-sm text-green-800">03:45</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Solution found condition</p>
                          <p className="text-xs text-gray-600">return [map.get(complement), i];</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Clock className="w-4 h-4 mr-1" />
                          Seek
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="font-mono text-sm text-purple-800">06:30</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Test cases added</p>
                          <p className="text-xs text-gray-600">console.log(twoSum([2, 7, 11, 15], 9));</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Clock className="w-4 h-4 mr-1" />
                          Seek
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <span className="font-mono text-sm text-gray-800">08:45</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Complexity analysis comments</p>
                          <p className="text-xs text-gray-600">// Time Complexity: O(n) - Single pass</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Clock className="w-4 h-4 mr-1" />
                          Seek
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Coding Statistics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">24:32</div>
                        <div className="text-sm text-gray-600">Total Time</div>
                        <Badge variant="secondary" className="mt-1">Efficient</Badge>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">15</div>
                        <div className="text-sm text-gray-600">Lines of Code</div>
                        <Badge variant="secondary" className="mt-1">Clean</Badge>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">3</div>
                        <div className="text-sm text-gray-600">Test Cases</div>
                        <Badge variant="secondary" className="mt-1">Thorough</Badge>
                      </CardContent>
                    </Card>
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
                      {question.type === 'mcq' && question.options ? (
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-3">Answer Options:</h5>
                          <div className="space-y-2">
                            {question.options.map((option: string, optionIndex: number) => {
                              const isSelected = option === question.selectedOption;
                              const isCorrect = option === question.correctOption;
                              const isSelectedAndWrong = isSelected && !isCorrect;
                              
                              return (
                                <div 
                                  key={optionIndex}
                                  className={`p-3 rounded-lg border-2 flex items-center justify-between ${
                                    isCorrect 
                                      ? 'border-green-500 bg-green-50' 
                                      : isSelectedAndWrong 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-200 bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                      isCorrect 
                                        ? 'bg-green-500 text-white' 
                                        : isSelectedAndWrong 
                                          ? 'bg-red-500 text-white' 
                                          : 'bg-gray-300 text-gray-600'
                                    }`}>
                                      {String.fromCharCode(65 + optionIndex)}
                                    </div>
                                    <span className={`text-sm font-medium ${
                                      isCorrect 
                                        ? 'text-green-800' 
                                        : isSelectedAndWrong 
                                          ? 'text-red-800' 
                                          : 'text-gray-700'
                                    }`}>
                                      {option}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {isSelected && (
                                      <Badge variant="outline" className="text-xs">
                                        Selected
                                      </Badge>
                                    )}
                                    {isCorrect && (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    )}
                                    {isSelectedAndWrong && (
                                      <XCircle className="w-5 h-5 text-red-600" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Student's Answer:</h5>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-800">{question.studentAnswer}</pre>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h5 className="font-semibold text-gray-700 mb-2">Assessment Notes:</h5>
                        <div className={`p-4 rounded-lg ${question.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                          <p className={`text-sm ${question.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
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