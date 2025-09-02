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
}`,
        correctAnswer: "Correct implementation with proper priority queue usage",
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
}`,
        correctAnswer: "Optimal O(n) solution using hash map",
        isCorrect: score >= 60,
        timeTaken: Math.floor(10 + rand(2) * 5), // 10-15 minutes
        difficulty: "Medium"
      }
    ],
    "Aptitude Test": [
      {
        id: "apt_1",
        question: "If a train travels 120 km in 2 hours, and then 180 km in 3 hours, what is the average speed for the entire journey?",
        studentAnswer: "Total distance = 120 + 180 = 300 km\nTotal time = 2 + 3 = 5 hours\nAverage speed = 300/5 = 60 km/h",
        correctAnswer: "60 km/h",
        isCorrect: score >= 75,
        timeTaken: Math.floor(3 + rand(3) * 2), // 3-5 minutes
        difficulty: "Medium"
      },
      {
        id: "apt_2",
        question: "A company's profit increased by 25% in the first quarter and then decreased by 20% in the second quarter. If the initial profit was $10,000, what is the profit after two quarters?",
        studentAnswer: "First quarter: $10,000 × 1.25 = $12,500\nSecond quarter: $12,500 × 0.80 = $10,000\nFinal profit: $10,000",
        correctAnswer: "$10,000",
        isCorrect: score >= 80,
        timeTaken: Math.floor(4 + rand(4) * 2), // 4-6 minutes
        difficulty: "Medium"
      }
    ],
    "Communication": [
      {
        id: "comm_1",
        question: "Describe a challenging project you worked on and how you overcame the difficulties. (Spoken response recorded)",
        studentAnswer: "I worked on developing a real-time chat application using React and Node.js. The main challenge was implementing WebSocket connections with proper error handling and reconnection logic. I overcame this by researching Socket.io documentation, breaking down the problem into smaller components, and implementing a robust retry mechanism. The project taught me the importance of proper error handling in real-time applications.",
        correctAnswer: "Clear communication with structured response covering challenge, solution, and learning",
        isCorrect: score >= 70,
        timeTaken: Math.floor(8 + rand(5) * 4), // 8-12 minutes
        difficulty: "Medium"
      },
      {
        id: "comm_2",
        question: "How would you explain a complex technical concept (like APIs) to a non-technical stakeholder?",
        studentAnswer: "I would use an analogy - APIs are like waiters in a restaurant. When you (the application) want to order food (request data), you don't go directly to the kitchen (database). Instead, you tell the waiter (API) what you want, and they bring back your order. The waiter knows how to communicate with the kitchen and brings back exactly what you need in a format you can understand.",
        correctAnswer: "Uses clear analogies and simple language to explain technical concepts",
        isCorrect: score >= 65,
        timeTaken: Math.floor(5 + rand(6) * 3), // 5-8 minutes
        difficulty: "Medium"
      }
    ],
    "System Design": [
      {
        id: "sys_1",
        question: "Design a URL shortening service like bit.ly. Consider scalability, database design, and caching strategies.",
        studentAnswer: `High-level design:
1. Database: Use hash-based approach with base62 encoding
2. Caching: Redis for frequently accessed URLs
3. Load balancing: Multiple application servers
4. Database sharding: Based on hash of short URL
5. Analytics: Separate service for click tracking
6. CDN: For global performance

Key considerations:
- Custom aliases support
- Expiration handling
- Rate limiting to prevent abuse
- Database cleanup for expired URLs`,
        correctAnswer: "Comprehensive system design covering scalability, caching, and database strategies",
        isCorrect: score >= 75,
        timeTaken: Math.floor(30 + rand(7) * 15), // 30-45 minutes
        difficulty: "Hard"
      }
    ]
  };

  return baseQuestions[type as keyof typeof baseQuestions] || [];
};

export default function AssessmentModal({ assessment, student, onClose }: AssessmentModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details'>('overview');
  
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