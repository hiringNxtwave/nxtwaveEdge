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
    "Aptitude and QA": [
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
    "System Design": [
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
    "Communication": [
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
    "Interview Performance": [
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
              activeTab === 'ai-interview' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('ai-interview')}
          >
            AI Interview Recording
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

          {activeTab === 'ai-interview' && (
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">AI Mock Interview Recording</h3>
                      <p className="text-gray-600">30-minute behavioral and technical interview session</p>
                    </div>
                  </div>

                  {/* Mock Video Player */}
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-6">
                    <div className="aspect-video flex items-center justify-center">
                      <div className="text-center">
                        <div className="p-4 bg-black/20 rounded-full mb-4 inline-block">
                          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-white text-lg">AI Interview Recording - 28:45</p>
                        <p className="text-gray-300">Click to play interview session</p>
                      </div>
                    </div>
                    {/* Video Controls */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <div className="flex items-center gap-4">
                        <button className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </button>
                        <div className="flex-1 bg-white/20 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <span className="text-white text-sm">10:02 / 28:45</span>
                      </div>
                    </div>
                  </div>

                  {/* Interview Performance Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-green-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">8.2/10</div>
                        <div className="text-sm text-gray-600">Communication</div>
                        <Badge variant="secondary" className="mt-1">Excellent</Badge>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">7.8/10</div>
                        <div className="text-sm text-gray-600">Problem Solving</div>
                        <Badge variant="secondary" className="mt-1">Good</Badge>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">8.5/10</div>
                        <div className="text-sm text-gray-600">Cultural Fit</div>
                        <Badge variant="secondary" className="mt-1">Excellent</Badge>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Key Moments / Timestamps */}
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Key Interview Moments</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">02:15</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Excellent explanation of React concepts</p>
                          <p className="text-xs text-gray-600">Demonstrated strong understanding of component lifecycle and state management</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-1a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Seek
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-blue-800">08:30</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Problem-solving approach discussion</p>
                          <p className="text-xs text-gray-600">Walked through systematic debugging methodology with clear reasoning</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-1a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Seek
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-orange-600" />
                          <span className="font-medium text-orange-800">15:45</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Hesitation on advanced algorithms</p>
                          <p className="text-xs text-gray-600">Could benefit from more practice with dynamic programming concepts</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-1a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Seek
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="font-medium text-green-800">22:10</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Great cultural fit responses</p>
                          <p className="text-xs text-gray-600">Showed enthusiasm for learning and team collaboration values</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-1a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Seek
                        </Button>
                      </div>
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