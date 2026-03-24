import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Target, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Star,
  Brain,
  MessageSquare,
  Code,
  Calculator
} from "lucide-react";

interface Assessment {
  id: string;
  status: string;
  overallScore?: number;
  aptitudeScore?: number;
  verbalScore?: number;
  dsaScore?: number;
  communicationScore?: number;
  strengths?: string;
  improvements?: string;
  reportGenerated: boolean;
  completedAt?: string;
  createdAt: string;
}

export default function StudentDashboard() {
  useScrollToTop();
  
  const { user } = useAuth();

  const { data: assessment, isLoading: assessmentLoading } = useQuery<Assessment>({
    queryKey: ["/api/student/assessment"],
    retry: false,
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const parseJsonSafely = (jsonString: string | null | undefined) => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.firstName || "Student"}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Track your assessment progress and skill development
              </p>
            </div>
            <div className="flex items-center gap-4">
              {user?.profileImageUrl && (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                  data-testid="img-student-profile"
                />
              )}
            </div>
          </div>
        </div>

        {assessmentLoading ? (
          <div className="grid gap-6">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>
          </div>
        ) : !assessment ? (
          // No Assessment Started
          <div className="text-center py-12">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Ready to Start Your Assessment?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Take our comprehensive skill assessment to unlock opportunities with India's top companies.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Calculator className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Aptitude</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">25 questions • 45 min</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <MessageSquare className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Verbal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">20 questions • 30 min</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Code className="w-8 h-8 text-purple-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">DSA</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">15 problems • 90 min</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <Brain className="w-8 h-8 text-orange-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Communication</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">5 responses • 30 min</p>
                </div>
              </div>
              
              <Button 
                size="lg" 
                className="px-8 py-4 text-lg"
                data-testid="button-start-assessment"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start Assessment
              </Button>
            </div>
          </div>
        ) : assessment.status === "completed" ? (
          // Assessment Completed - Show Results
          <div className="space-y-8">
            {/* Overall Score Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
                    <CardDescription>
                      Completed on {new Date(assessment.completedAt!).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {assessment.overallScore}%
                    </div>
                    <Badge className={getScoreBadge(assessment.overallScore!)}>
                      Overall Score
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Detailed Scores */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Calculator className="w-8 h-8 text-blue-600" />
                    <Badge variant="outline">Aptitude</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2 text-blue-600">
                    {assessment.aptitudeScore}%
                  </div>
                  <Progress value={assessment.aptitudeScore} className="mb-2" />
                  <p className="text-sm text-gray-600">Logical reasoning & quantitative skills</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <MessageSquare className="w-8 h-8 text-green-600" />
                    <Badge variant="outline">Verbal</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2 text-green-600">
                    {assessment.verbalScore}%
                  </div>
                  <Progress value={assessment.verbalScore} className="mb-2" />
                  <p className="text-sm text-gray-600">Reading comprehension & grammar</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Code className="w-8 h-8 text-purple-600" />
                    <Badge variant="outline">DSA</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2 text-purple-600">
                    {assessment.dsaScore}%
                  </div>
                  <Progress value={assessment.dsaScore} className="mb-2" />
                  <p className="text-sm text-gray-600">Data structures & algorithms</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Brain className="w-8 h-8 text-orange-600" />
                    <Badge variant="outline">Communication</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2 text-orange-600">
                    {assessment.communicationScore}%
                  </div>
                  <Progress value={assessment.communicationScore} className="mb-2" />
                  <p className="text-sm text-gray-600">Speaking & presentation skills</p>
                </CardContent>
              </Card>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-green-700">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Your Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {parseJsonSafely(assessment.strengths).map((strength: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-700">
                    <Target className="w-5 h-5 mr-2" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {parseJsonSafely(assessment.improvements).map((improvement: string, index: number) => (
                      <div key={index} className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-orange-600 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Steps */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <CardHeader>
                <CardTitle className="text-blue-900 dark:text-blue-100">🎯 What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Profile Shared</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your profile is now visible to 500+ hiring companies
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Interview Prep</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Get free mock interviews with top company engineers
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Job Offers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Expect interview calls for 8-18 LPA roles
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Assessment In Progress
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Assessment In Progress
              </CardTitle>
              <CardDescription>
                You can resume your assessment anytime
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Started on {new Date(assessment.createdAt).toLocaleDateString()}
                  </p>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    In Progress
                  </Badge>
                </div>
                <Button data-testid="button-resume-assessment">
                  Resume Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}