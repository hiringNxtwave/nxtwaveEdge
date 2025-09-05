import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  MessageSquare, 
  Mic, 
  Star, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  User,
  Bot
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";

interface CommunicationSampleModalProps {
  student: StudentWithSkills;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommunicationSampleModal({ student, isOpen, onClose }: CommunicationSampleModalProps) {
  const [activeTab, setActiveTab] = useState("written");

  const writtenSamples = [
    {
      title: "Problem Analysis: Binary Search Implementation",
      content: `I approached this problem by first understanding the requirements: implementing binary search with O(log n) time complexity.

My solution strategy:
1. Initialize left and right pointers
2. Calculate middle index using (left + right) / 2 to avoid overflow
3. Compare target with middle element
4. Adjust search space based on comparison

Key insights:
- Used integer division to handle edge cases
- Implemented iterative approach for better space complexity
- Added boundary checks to prevent index errors

The final solution is efficient and handles all edge cases including empty arrays and single elements.`,
      timestamp: "2 hours ago",
      context: "Technical Assessment - Data Structures",
      score: 9.2
    },
    {
      title: "Project Explanation: E-commerce React App",
      content: `This project demonstrates my full-stack development skills using React and Node.js.

Technical Implementation:
- Frontend: React with Redux for state management, Material-UI for components
- Backend: Express.js with PostgreSQL database
- Authentication: JWT tokens with secure refresh mechanism
- Payment: Stripe integration for secure transactions

Challenges Overcome:
- Implemented optimistic updates for better UX
- Added comprehensive error handling and loading states
- Optimized bundle size using code splitting and lazy loading

The application successfully handles 1000+ concurrent users and maintains 99.9% uptime.`,
      timestamp: "1 day ago",
      context: "Project Showcase Interview",
      score: 8.7
    }
  ];

  const chatSamples = [
    {
      type: "interviewer",
      message: "Can you explain the difference between REST and GraphQL?",
      timestamp: "10:32 AM"
    },
    {
      type: "candidate",
      message: "Great question! REST and GraphQL are both API design paradigms but with different approaches. REST follows a resource-based architecture where each endpoint represents a specific resource, while GraphQL uses a single endpoint with a query language that allows clients to request exactly the data they need.",
      timestamp: "10:33 AM"
    },
    {
      type: "interviewer",
      message: "What are the main advantages of GraphQL?",
      timestamp: "10:33 AM"
    },
    {
      type: "candidate",
      message: "The key advantages include: 1) No over-fetching or under-fetching of data, 2) Strong type system with schema validation, 3) Real-time subscriptions, 4) Single endpoint reduces network requests, and 5) Better developer experience with introspection and documentation. However, it does add complexity for caching and file uploads.",
      timestamp: "10:34 AM"
    },
    {
      type: "interviewer",
      message: "How would you handle authentication in GraphQL?",
      timestamp: "10:35 AM"
    },
    {
      type: "candidate",
      message: "I'd implement authentication at the resolver level using context. The approach would be: 1) Verify JWT token in middleware, 2) Pass user info through GraphQL context, 3) Check permissions in resolvers before executing queries/mutations, 4) Use directive-based authorization for cleaner code. This ensures security while maintaining the flexible nature of GraphQL.",
      timestamp: "10:36 AM"
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 9) return "text-green-600 bg-green-100";
    if (score >= 7.5) return "text-blue-600 bg-blue-100";
    if (score >= 6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getCommunicationInsights = () => {
    return {
      clarity: 9.1,
      technical_depth: 8.8,
      structure: 9.3,
      professionalism: 9.0,
      problem_solving: 8.9
    };
  };

  const insights = getCommunicationInsights();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Communication Samples: {student.fullName}</span>
            <Badge variant="secondary">Technical Communication</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="written">Written Samples</TabsTrigger>
              <TabsTrigger value="interview">Interview Chat</TabsTrigger>
              <TabsTrigger value="insights">Communication Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="written" className="space-y-4 max-h-[60vh] overflow-y-auto">
              {writtenSamples.map((sample, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{sample.title}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge className={getScoreColor(sample.score)}>
                          {sample.score}/10
                        </Badge>
                        <Badge variant="outline">{sample.context}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{sample.timestamp}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                        {sample.content}
                      </pre>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Clear Structure</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Technical Accuracy</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Professional Tone</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="interview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mic className="w-5 h-5" />
                    <span>Technical Interview Session</span>
                    <Badge variant="secondary">Live Q&A</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[50vh] overflow-y-auto space-y-3">
                    {chatSamples.map((chat, index) => (
                      <div key={index} className={`flex ${chat.type === 'candidate' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          chat.type === 'candidate' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            {chat.type === 'candidate' ? (
                              <User className="w-4 h-4" />
                            ) : (
                              <Bot className="w-4 h-4" />
                            )}
                            <span className="text-xs opacity-75">
                              {chat.type === 'candidate' ? 'Candidate' : 'Interviewer'}
                            </span>
                            <span className="text-xs opacity-75">{chat.timestamp}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{chat.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Strong Performance</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Demonstrated excellent technical knowledge with clear, well-structured responses. 
                      Shows ability to explain complex concepts in an accessible way.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Communication Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(insights).map(([key, score]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="capitalize text-sm font-medium">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="text-sm font-bold">{score}/10</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${score * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Strengths & Areas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Clear technical explanations</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Well-structured responses</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Professional communication</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Good problem-solving approach</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-yellow-600 mb-2">Growth Areas</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span>Could provide more examples</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span>Opportunity for more concise responses</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Star className="w-6 h-6 text-yellow-500 mt-1" />
                    <div>
                      <h4 className="font-medium mb-2">Overall Assessment</h4>
                      <p className="text-sm text-gray-700">
                        <strong>Excellent communicator</strong> with strong technical articulation skills. 
                        Demonstrates ability to explain complex concepts clearly and professionally. 
                        Shows good listening skills and provides thoughtful, well-structured responses. 
                        Would work well in collaborative environments and client-facing roles.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-700">
                Overall Score: {((insights.clarity + insights.technical_depth + insights.structure + insights.professionalism + insights.problem_solving) / 5).toFixed(1)}/10
              </Badge>
              <span className="text-sm text-gray-600">
                Based on {writtenSamples.length} written samples and 1 interview session
              </span>
            </div>
            <Button onClick={onClose} data-testid="button-close-communication">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}