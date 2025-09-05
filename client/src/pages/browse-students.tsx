import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Header from "@/components/header";
import StudentCard from "@/components/student-card";
import StudentFilters from "@/components/student-filters";
import FreshnessIndex from "@/components/freshness-index";
import CandidateComparison from "@/components/candidate-comparison";
import PredictiveInsights from "@/components/predictive-insights";
import TalentDiscoveryFilters from "@/components/talent-discovery-filters";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Lock, Users, Star, Zap, GitCompare, BarChart3, CheckSquare, Brain, Sparkles, Filter } from "lucide-react";

export default function BrowseStudents() {
  useScrollToTop();
  
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: "",
    university: "",
    minCgpa: undefined as number | undefined,
    maxCgpa: undefined as number | undefined,
    codingRating: undefined as number | undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  
  // New state for enhanced features
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showSmartDiscovery, setShowSmartDiscovery] = useState(false);
  const [smartResults, setSmartResults] = useState<any[]>([]);
  const [isUsingSmartResults, setIsUsingSmartResults] = useState(false);
  
  const queryClient = useQueryClient();
  // Show limited results for non-authenticated users
  const studentsPerPage = isAuthenticated ? 48 : 6;

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["/api/students", filters, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.skills.length > 0) params.append("skills", filters.skills.join(","));
      if (filters.location) params.append("location", filters.location);
      if (filters.university) params.append("university", filters.university);
      if (filters.minCgpa) params.append("minCgpa", filters.minCgpa.toString());
      if (filters.maxCgpa) params.append("maxCgpa", filters.maxCgpa.toString());
      if (filters.codingRating) params.append("codingRating", filters.codingRating.toString());
      params.append("limit", studentsPerPage.toString());
      params.append("offset", ((currentPage - 1) * studentsPerPage).toString());

      const response = await fetch(`/api/students?${params}`);
      if (!response.ok) throw new Error("Failed to fetch students");
      return response.json();
    },
  });

  // Use smart results if available, otherwise use regular students data
  const students = isUsingSmartResults ? smartResults : (studentsData?.students || studentsData || []);
  const totalCount = isUsingSmartResults ? smartResults.length : (studentsData?.total || students.length);

  const { data: skills } = useQuery({
    queryKey: ["/api/skills"],
  });

  // Smart discovery mutation
  const smartDiscoveryMutation = useMutation({
    mutationFn: async (requirements: any) => {
      return await apiRequest("/api/students/smart-discovery", {
        method: "POST",
        body: JSON.stringify(requirements),
      });
    },
    onSuccess: (data) => {
      setSmartResults(data);
      setIsUsingSmartResults(true);
      setShowSmartDiscovery(false);
    },
    onError: (error) => {
      console.error("Smart discovery failed:", error);
    },
  });

  // Get total student count for the smart discovery component
  const { data: totalCountData } = useQuery({
    queryKey: ["/api/students/count"],
    queryFn: async () => {
      const response = await fetch("/api/students/count");
      if (!response.ok) throw new Error("Failed to fetch count");
      return response.json();
    },
  });

  const totalStudentCount = totalCountData?.count || 12000;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header with Action Buttons */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {isLoading 
                  ? "Loading students..." 
                  : isAuthenticated 
                    ? `${totalCount} students found`
                    : `Showing ${students.length} of 2.5M+ students (Preview)`
                }
              </p>
            </div>
            
            {/* Enhanced Action Buttons */}
            {isAuthenticated && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowSmartDiscovery(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                  data-testid="button-smart-discovery"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Smart Discovery
                </Button>
                
                {isUsingSmartResults && (
                  <Button
                    onClick={() => {
                      setIsUsingSmartResults(false);
                      setSmartResults([]);
                      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
                    }}
                    variant="outline"
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    data-testid="button-clear-smart-results"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Smart Results
                  </Button>
                )}
                
                {compareList.length > 0 && (
                  <Button
                    onClick={() => setShowComparison(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                    data-testid="button-compare-candidates"
                  >
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare ({compareList.length})
                  </Button>
                )}
                <Button
                  onClick={() => setShowInsights(true)}
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                  data-testid="button-predictive-insights"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Hiring Insights
                </Button>
              </div>
            )}
          </div>
          
          {/* Compact Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <StudentFilters
              filters={{
                university: filters.university || "all",
                codingRating: filters.codingRating?.toString() || "all"
              }}
              onFiltersChange={(newFilters) => {
                setFilters({
                  skills: [],
                  location: "",
                  university: newFilters.university === "all" ? "" : newFilters.university,
                  minCgpa: undefined,
                  maxCgpa: undefined,
                  codingRating: newFilters.codingRating && newFilters.codingRating !== "all" ? parseInt(newFilters.codingRating) : undefined
                });
                setCurrentPage(1);
              }}
              skills={(skills as any) || []}
              resultCount={students.length}
              totalCount={totalCount}
            />
          </div>
        </div>

        {/* Limited Access Banner for Unauthenticated Users */}
        {!isAuthenticated && (
          <div className="mb-8">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Lock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900">Preview Mode - Limited Access</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        You're viewing a limited preview. Sign in to access full profiles, contact details, and hiring tools.
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                    onClick={() => window.location.href = "/api/login"}
                    data-testid="button-unlock-full-access"
                  >
                    Unlock Full Access
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Freshness Index for Authenticated Users */}
        {isAuthenticated && !isLoading && students.length > 0 && (
          <div className="mb-8">
            <FreshnessIndex totalCandidates={totalCount} />
          </div>
        )}

        {/* Student Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isLoading 
                  ? "Loading..." 
                  : isUsingSmartResults
                    ? `🧠 Smart Discovery Results`
                  : isAuthenticated 
                    ? `Student Profiles`
                    : `Showing ${students.length} of 2.5M+ Students (Preview)`
                }
              </h2>
              {isUsingSmartResults && (
                <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 border border-purple-200">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Top {students.length} AI-Curated Matches
                </Badge>
              )}
              {isAuthenticated && !isLoading && (
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                  <CheckSquare className="w-3 h-3 mr-1" />
                  {students.length} Candidates Ready to Compare
                </Badge>
              )}
            </div>
            {!isAuthenticated && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>2.5M+ total students available</span>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-6 flex-1">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-8 flex-1">
                      <div className="grid grid-cols-4 gap-6 flex-1">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="text-center space-y-1">
                            <Skeleton className="h-3 w-16 mx-auto" />
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center space-y-1">
                        <Skeleton className="h-3 w-12 mx-auto" />
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : students?.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700" data-testid="text-no-students">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No students found matching your criteria.
              </p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <div className="space-y-4" data-testid="list-students">
              {students?.map((student: any) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}

          {students && students.length > 0 && (
            <div className="mt-8 flex justify-center" data-testid="pagination-controls">
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    data-testid="button-prev-page"
                  >
                    Previous
                  </button>
                )}
                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400" data-testid="text-page-info">
                  Page {currentPage}
                </span>
                {students.length === studentsPerPage && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    data-testid="button-next-page"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Login Prompt for Non-Authenticated Users */}
        {!isAuthenticated && students && students.length > 0 && (
          <div className="mt-12">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-2">
                  <Lock className="w-6 h-6 text-blue-600" />
                  See More Talent
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  You've seen a preview of {students.length} candidates. Sign in to access our full database of 2.5M+ verified students.
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Full Access</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Browse all 2.5M+ student profiles</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-3">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Shortlisting</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Save and compare candidates</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-3">
                      <Zap className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">AI Analysis</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Get hiring recommendations</p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="px-8 py-3 text-lg"
                    onClick={() => window.location.href = "/api/login"}
                    data-testid="button-sign-in-to-continue"
                  >
                    Sign In to Continue
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="px-8 py-3 text-lg"
                    onClick={() => window.location.href = "/api/login"}
                    data-testid="button-start-free-trial"
                  >
                    Start Free Trial
                  </Button>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Join 15,000+ companies already using TalentConnect India
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Enhanced Feature Modals */}
      {showSmartDiscovery && (
        <TalentDiscoveryFilters
          onApplyFilters={(requirements) => {
            smartDiscoveryMutation.mutate(requirements);
          }}
          onAutoSuggest={(requirements) => {
            smartDiscoveryMutation.mutate(requirements);
          }}
          totalStudents={totalStudentCount}
          onClose={() => setShowSmartDiscovery(false)}
        />
      )}

      {showComparison && (
        <CandidateComparison
          candidates={compareList}
          onRemove={(candidateId) => {
            setCompareList(compareList.filter(c => c.id !== candidateId));
          }}
          onClose={() => setShowComparison(false)}
        />
      )}

      {showInsights && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-6xl w-full max-h-[90vh] overflow-auto">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  Predictive Hiring Insights
                </CardTitle>
                <Button variant="ghost" onClick={() => setShowInsights(false)} className="p-2">
                  <Lock className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-gray-600 dark:text-gray-300">AI-powered insights to optimize your hiring process</p>
            </CardHeader>
            <CardContent>
              <PredictiveInsights
                shortlistedCount={Math.max(20, students.length)}
                role="Software Engineer"
                location="Bangalore"
                salaryRange={{ min: 8, max: 15 }}
                urgency="medium"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}