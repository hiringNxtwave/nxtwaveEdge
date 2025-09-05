import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  User,
  MapPin,
  GraduationCap,
  DollarSign,
  Calendar,
  Clock,
  Code2,
  Play,
  Pause,
  Eye,
  CheckCircle,
  AlertCircle,
  Shield,
  Mic,
  FileText,
  Brain,
  Target,
  TrendingUp,
  Award,
  MessageSquare,
  Video,
  Star
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";

interface CandidateFullReportProps {
  student: StudentWithSkills;
  isOpen: boolean;
  onClose: () => void;
}

interface AssessmentData {
  category: string;
  score: number;
  completedAt: string;
  verificationStatus: 'verified' | 'pending' | 'expired';
  timeSpent: number; // in minutes
  accuracy: number;
}

interface CodePlayback {
  id: string;
  question: string;
  language: string;
  code: string;
  keystrokes: Array<{
    timestamp: number;
    action: 'type' | 'delete' | 'navigate';
    content: string;
    line: number;
  }>;
  executionTime: number;
  memoryUsed: number;
  testsPassed: number;
  totalTests: number;
}

interface InterviewTranscript {
  id: string;
  sessionType: 'technical' | 'behavioral' | 'communication';
  duration: number;
  transcript: Array<{
    speaker: 'ai' | 'candidate';
    timestamp: number;
    text: string;
    sentiment?: 'positive' | 'neutral' | 'negative';
  }>;
  evaluation: {
    communication: number;
    technicalDepth: number;
    problemSolving: number;
    overallScore: number;
  };
}

interface HackathonRanking {
  id: string;
  name: string;
  organizer: string;
  date: string;
  rank: number;
  totalParticipants: number;
  category: string;
  projectTitle: string;
  techStack: string[];
  score: number;
  achievements: string[];
}

interface EngagementSignal {
  type: 'practice' | 'contest' | 'project' | 'learning';
  title: string;
  streak: number;
  lastActive: string;
  totalCount: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  badgeEarned?: string;
}

export default function CandidateFullReport({ student, isOpen, onClose }: CandidateFullReportProps) {
  const [activePlayback, setActivePlayback] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentLine, setCurrentLine] = useState(0);

  // Mock data for comprehensive candidate view
  const assessmentData: AssessmentData[] = [
    {
      category: "DSA",
      score: 92,
      completedAt: "2024-12-01",
      verificationStatus: "verified",
      timeSpent: 75,
      accuracy: 89
    },
    {
      category: "Tech Fundamentals",
      score: 85,
      completedAt: "2024-11-28",
      verificationStatus: "verified",
      timeSpent: 90,
      accuracy: 82
    },
    {
      category: "Interview Performance",
      score: 88,
      completedAt: "2024-11-25",
      verificationStatus: "verified",
      timeSpent: 45,
      accuracy: 91
    }
  ];

  const codePlaybacks: CodePlayback[] = [
    {
      id: "two-sum",
      question: "Two Sum - Given an array of integers, return indices of two numbers that add up to target",
      language: "JavaScript",
      code: `function twoSum(nums, target) {
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
      keystrokes: [
        { timestamp: 0, action: 'type', content: 'function twoSum(nums, target) {', line: 1 },
        { timestamp: 2000, action: 'type', content: '    const map = new Map();', line: 2 },
        { timestamp: 8000, action: 'type', content: '    for (let i = 0; i < nums.length; i++) {', line: 4 }
      ],
      executionTime: 45,
      memoryUsed: 2048,
      testsPassed: 12,
      totalTests: 12
    }
  ];

  const interviewTranscripts: InterviewTranscript[] = [
    {
      id: "technical-round-1",
      sessionType: "technical",
      duration: 45,
      transcript: [
        {
          speaker: "ai",
          timestamp: 0,
          text: "Let's start with a coding question. Can you explain how you would approach finding the longest common subsequence?",
          sentiment: "neutral"
        },
        {
          speaker: "candidate",
          timestamp: 5,
          text: "I would use dynamic programming for this problem. The key insight is that we can break it down into subproblems...",
          sentiment: "positive"
        }
      ],
      evaluation: {
        communication: 88,
        technicalDepth: 92,
        problemSolving: 89,
        overallScore: 90
      }
    }
  ];

  const writtenAnswers = [
    {
      question: "Describe a challenging technical problem you solved and your approach",
      answer: "During my internship, I optimized a database query that was causing 30-second page load times. I analyzed the execution plan, identified missing indexes, and restructured the query to reduce complexity from O(n²) to O(n log n). This improved performance by 95% and enhanced user experience significantly.",
      evaluation: {
        clarity: 92,
        technicalDepth: 88,
        problemSolving: 94,
        communication: 90
      }
    }
  ];

  const hackathonRankings: HackathonRanking[] = [
    {
      id: "hackathon-1",
      name: "TechFest 2024 Hackathon",
      organizer: "IIT Bombay",
      date: "2024-03-15",
      rank: 3,
      totalParticipants: 250,
      category: "AI/ML",
      projectTitle: "EcoTrack - Smart Waste Management System",
      techStack: ["Frontend Development", "Data Analysis", "Machine Learning", "Cloud Systems"],
      score: 92,
      achievements: ["Best Innovation Award", "People's Choice Award"]
    },
    {
      id: "hackathon-2", 
      name: "CodeStorm 2024",
      organizer: "Google Developer Student Clubs",
      date: "2024-02-20",
      rank: 1,
      totalParticipants: 180,
      category: "Full Stack Development",
      projectTitle: "StudyBuddy - Collaborative Learning Platform",
      techStack: ["Web Development", "Backend Architecture", "Database Design", "Real-time Systems"],
      score: 98,
      achievements: ["First Place Winner", "Best Technical Implementation"]
    }
  ];

  const engagementSignals: EngagementSignal[] = [
    {
      type: "practice",
      title: "Daily Coding Practice",
      streak: 45,
      lastActive: "2 hours ago",
      totalCount: 287,
      level: "expert",
      badgeEarned: "Coding Ninja"
    },
    {
      type: "contest",
      title: "Weekly Programming Contests",
      streak: 12,
      lastActive: "3 days ago", 
      totalCount: 52,
      level: "advanced",
      badgeEarned: "Contest Master"
    },
    {
      type: "project",
      title: "GitHub Contributions",
      streak: 89,
      lastActive: "1 day ago",
      totalCount: 156,
      level: "expert"
    },
    {
      type: "learning",
      title: "Course Completions",
      streak: 6,
      lastActive: "1 week ago",
      totalCount: 14,
      level: "intermediate",
      badgeEarned: "Learning Champion"
    }
  ];

  const getVerificationBadge = (status: string, daysOld: number) => {
    if (status === 'verified' && daysOld <= 90) {
      return <Badge className="bg-green-100 text-green-800"><Shield className="w-3 h-3 mr-1" />Fresh & Verified</Badge>;
    }
    if (status === 'verified' && daysOld > 90) {
      return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Verified (Old)</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Needs Verification</Badge>;
  };

  const calculateDaysOld = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0">
        <div className="flex h-full">
          {/* Sidebar - Student Summary */}
          <div className="w-80 bg-gradient-to-b from-blue-50 to-white p-6 border-r">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={student.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`} 
                alt={`${student.firstName} ${student.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {student.firstName} {student.lastName}
                </h3>
                <p className="text-sm text-blue-600 font-medium">{student.university}</p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{student.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-lg font-bold text-blue-600">92%</div>
                <div className="text-xs text-gray-500">Overall Score</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-lg font-bold text-green-600">{student.cgpa}</div>
                <div className="text-xs text-gray-500">CGPA</div>
              </div>
            </div>

            {/* Salary Expectations */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  Salary Expectations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-base font-semibold text-gray-900">₹8-12 LPA</div>
                <div className="text-xs text-gray-500">Based on skills & market</div>
              </CardContent>
            </Card>

            {/* Availability */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm font-semibold text-gray-900">Available Immediately</div>
                <div className="text-xs text-gray-500">No notice period</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="p-6 pb-4 border-b">
              <DialogTitle className="flex items-center justify-between">
                <span>Candidate 360° View</span>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </DialogTitle>
            </DialogHeader>

            <div className="p-6">
              <Tabs defaultValue="assessments" className="w-full">
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="assessments" className="text-xs">Verified Assessments</TabsTrigger>
                  <TabsTrigger value="code-playback" className="text-xs">Code Replay</TabsTrigger>
                  <TabsTrigger value="interviews" className="text-xs">AI Interviews</TabsTrigger>
                  <TabsTrigger value="written" className="text-xs">Written Responses</TabsTrigger>
                  <TabsTrigger value="hackathons" className="text-xs">Hackathons</TabsTrigger>
                  <TabsTrigger value="engagement" className="text-xs">Engagement</TabsTrigger>
                  <TabsTrigger value="fit-check" className="text-xs">Fit Check</TabsTrigger>
                </TabsList>

                {/* Verified Assessments */}
                <TabsContent value="assessments" className="mt-6">
                  <div className="grid gap-4">
                    {assessmentData.map((assessment, index) => {
                      const daysOld = calculateDaysOld(assessment.completedAt);
                      return (
                        <Card key={index} className="border-l-4 border-l-blue-500">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{assessment.category}</CardTitle>
                              {getVerificationBadge(assessment.verificationStatus, daysOld)}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-4 gap-4 mb-4">
                              <div>
                                <div className="text-2xl font-bold text-green-600">{assessment.score}%</div>
                                <div className="text-xs text-gray-500">Score</div>
                              </div>
                              <div>
                                <div className="text-base font-semibold">{assessment.accuracy}%</div>
                                <div className="text-xs text-gray-500">Accuracy</div>
                              </div>
                              <div>
                                <div className="text-base font-semibold">{assessment.timeSpent}m</div>
                                <div className="text-xs text-gray-500">Time Spent</div>
                              </div>
                              <div>
                                <div className="text-base font-semibold">{daysOld}d</div>
                                <div className="text-xs text-gray-500">Days Old</div>
                              </div>
                            </div>
                            <Progress value={assessment.score} className="h-2" />
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Code Playback */}
                <TabsContent value="code-playback" className="mt-6">
                  <div className="space-y-4">
                    {codePlaybacks.map((playback) => (
                      <Card key={playback.id} className="border-l-4 border-l-green-500">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{playback.question}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{playback.language}</Badge>
                              <Button
                                size="sm"
                                onClick={() => setActivePlayback(activePlayback === playback.id ? null : playback.id)}
                                data-testid={`button-playback-${playback.id}`}
                              >
                                {activePlayback === playback.id ? (
                                  <><Pause className="w-4 h-4 mr-1" />Pause</>
                                ) : (
                                  <><Play className="w-4 h-4 mr-1" />Watch Code</>
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {activePlayback === playback.id && (
                            <div className="mb-4 p-4 bg-gray-900 rounded-lg text-green-400 font-mono text-sm">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white">Code Playback - Line by Line</span>
                                <div className="flex items-center gap-2">
                                  <Button size="sm" variant="outline" onClick={() => setPlaybackSpeed(0.5)}>0.5x</Button>
                                  <Button size="sm" variant="outline" onClick={() => setPlaybackSpeed(1)}>1x</Button>
                                  <Button size="sm" variant="outline" onClick={() => setPlaybackSpeed(2)}>2x</Button>
                                </div>
                              </div>
                              <pre className="whitespace-pre-wrap">{playback.code}</pre>
                            </div>
                          )}
                          <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-600">{playback.executionTime}ms</div>
                              <div className="text-xs text-gray-500">Execution Time</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-600">{playback.memoryUsed} KB</div>
                              <div className="text-xs text-gray-500">Memory Used</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">{playback.testsPassed}/{playback.totalTests}</div>
                              <div className="text-xs text-gray-500">Tests Passed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-600">100%</div>
                              <div className="text-xs text-gray-500">Code Quality</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* AI Interview Transcripts */}
                <TabsContent value="interviews" className="mt-6">
                  <div className="space-y-4">
                    {interviewTranscripts.map((interview) => (
                      <Card key={interview.id} className="border-l-4 border-l-purple-500">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base capitalize">{interview.sessionType} Interview</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{interview.duration}min</Badge>
                              <Badge className="bg-purple-100 text-purple-800">
                                Score: {interview.evaluation.overallScore}%
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="text-base font-semibold">{interview.evaluation.communication}%</div>
                              <div className="text-xs text-gray-500">Communication</div>
                              <Progress value={interview.evaluation.communication} className="h-1 mt-1" />
                            </div>
                            <div>
                              <div className="text-base font-semibold">{interview.evaluation.technicalDepth}%</div>
                              <div className="text-xs text-gray-500">Technical Depth</div>
                              <Progress value={interview.evaluation.technicalDepth} className="h-1 mt-1" />
                            </div>
                            <div>
                              <div className="text-base font-semibold">{interview.evaluation.problemSolving}%</div>
                              <div className="text-xs text-gray-500">Problem Solving</div>
                              <Progress value={interview.evaluation.problemSolving} className="h-1 mt-1" />
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                            <h4 className="font-semibold mb-3 flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              Interview Transcript
                            </h4>
                            {interview.transcript.map((entry, i) => (
                              <div key={i} className={`mb-3 p-2 rounded ${entry.speaker === 'ai' ? 'bg-blue-50' : 'bg-green-50'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant={entry.speaker === 'ai' ? 'default' : 'secondary'} className="text-xs">
                                    {entry.speaker === 'ai' ? 'AI Interviewer' : 'Candidate'}
                                  </Badge>
                                  <span className="text-xs text-gray-500">{Math.floor(entry.timestamp / 60)}:{String(entry.timestamp % 60).padStart(2, '0')}</span>
                                </div>
                                <p className="text-sm">{entry.text}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Written Answers */}
                <TabsContent value="written" className="mt-6">
                  <div className="space-y-4">
                    {writtenAnswers.map((answer, index) => (
                      <Card key={index} className="border-l-4 border-l-orange-500">
                        <CardHeader>
                          <CardTitle className="text-base">{answer.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm leading-relaxed">{answer.answer}</p>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <div className="text-base font-semibold">{answer.evaluation.clarity}%</div>
                              <div className="text-xs text-gray-500">Clarity</div>
                              <Progress value={answer.evaluation.clarity} className="h-1 mt-1" />
                            </div>
                            <div>
                              <div className="text-base font-semibold">{answer.evaluation.technicalDepth}%</div>
                              <div className="text-xs text-gray-500">Technical Depth</div>
                              <Progress value={answer.evaluation.technicalDepth} className="h-1 mt-1" />
                            </div>
                            <div>
                              <div className="text-base font-semibold">{answer.evaluation.problemSolving}%</div>
                              <div className="text-xs text-gray-500">Problem Solving</div>
                              <Progress value={answer.evaluation.problemSolving} className="h-1 mt-1" />
                            </div>
                            <div>
                              <div className="text-base font-semibold">{answer.evaluation.communication}%</div>
                              <div className="text-xs text-gray-500">Communication</div>
                              <Progress value={answer.evaluation.communication} className="h-1 mt-1" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Direct Fit Check */}
                <TabsContent value="fit-check" className="mt-6">
                  <div className="grid gap-6">
                    <Card className="border-l-4 border-l-green-500">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Target className="w-5 h-5 text-green-600" />
                          Direct Fit Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3 text-green-700">Perfect Matches</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm">Salary expectations align (₹8-12 LPA)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm">Location preference: Bangalore</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm">Immediate availability</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm">Fresh assessments (≤30 days)</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3 text-orange-700">Areas to Discuss</h4>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                <span className="text-sm">System design experience: Intermediate</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                                <span className="text-sm">Leadership experience: Limited</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Recruiter Recommendation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Award className="w-5 h-5 text-blue-600" />
                            <span className="font-semibold text-blue-900">Strong Hire Recommendation</span>
                          </div>
                          <p className="text-sm text-blue-800 mb-4">
                            This candidate demonstrates exceptional technical skills with verified recent assessments. 
                            Direct salary and location alignment makes this a low-risk hire with high potential impact.
                          </p>
                          <div className="flex gap-3">
                            <Button className="bg-green-600 hover:bg-green-700">
                              <Video className="w-4 h-4 mr-2" />
                              Schedule Interview
                            </Button>
                            <Button variant="outline">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Send Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Hackathon Rankings */}
                <TabsContent value="hackathons" className="mt-6">
                  <div className="grid gap-4">
                    {hackathonRankings.map((hackathon) => (
                      <Card key={hackathon.id} className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{hackathon.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Badge className={`${
                                hackathon.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                                hackathon.rank <= 3 ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                #{hackathon.rank} / {hackathon.totalParticipants}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            {hackathon.organizer} • {hackathon.date} • {hackathon.category}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{hackathon.projectTitle}</h4>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {hackathon.techStack.map((tech, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <div className="text-2xl font-bold text-purple-600">{hackathon.score}/100</div>
                              <div className="text-xs text-gray-500">Final Score</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-gray-900">Rank {hackathon.rank}</div>
                              <div className="text-xs text-gray-500">Final Position</div>
                            </div>
                          </div>

                          {hackathon.achievements.length > 0 && (
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <h5 className="text-sm font-semibold text-purple-800 mb-2">Achievements</h5>
                              <div className="space-y-1">
                                {hackathon.achievements.map((achievement, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <Award className="w-3 h-3 text-purple-600" />
                                    <span className="text-sm text-purple-800">{achievement}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Engagement Signals */}
                <TabsContent value="engagement" className="mt-6">
                  <div className="grid gap-4">
                    {engagementSignals.map((signal, index) => (
                      <Card key={index} className={`border-l-4 ${
                        signal.type === 'practice' ? 'border-l-green-500' :
                        signal.type === 'contest' ? 'border-l-blue-500' :
                        signal.type === 'project' ? 'border-l-purple-500' :
                        'border-l-orange-500'
                      }`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{signal.title}</CardTitle>
                            <Badge className={`${
                              signal.level === 'expert' ? 'bg-red-100 text-red-800' :
                              signal.level === 'advanced' ? 'bg-purple-100 text-purple-800' :
                              signal.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {signal.level.toUpperCase()}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <div className="text-2xl font-bold text-blue-600">{signal.streak}</div>
                              <div className="text-xs text-gray-500">Day Streak</div>
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-gray-900">{signal.totalCount}</div>
                              <div className="text-xs text-gray-500">Total Count</div>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-green-600">{signal.lastActive}</div>
                              <div className="text-xs text-gray-500">Last Active</div>
                            </div>
                          </div>

                          {signal.badgeEarned && (
                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                              <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-semibold text-yellow-800">Badge Earned</span>
                              </div>
                              <p className="text-sm text-yellow-700 mt-1">{signal.badgeEarned}</p>
                            </div>
                          )}

                          <div className="mt-3">
                            <Progress value={Math.min(100, (signal.streak / 100) * 100)} className="h-2" />
                            <div className="text-xs text-gray-500 mt-1">
                              Consistency Score: {Math.min(100, Math.round((signal.streak / 100) * 100))}%
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}