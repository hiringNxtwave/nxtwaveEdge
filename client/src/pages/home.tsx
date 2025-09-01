import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Users, Building2, MessageSquare, TrendingUp, Star, Award, Globe, Target, CheckCircle, ArrowRight, MapPin, GraduationCap, Lock, Zap } from "lucide-react";
import { SiTata, SiInfosys, SiWipro, SiGoogle, SiAmazon, SiFlipkart } from "react-icons/si";
import Header from "@/components/header";
import StudentCard from "@/components/student-card";
import StudentFilters from "@/components/student-filters";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: "",
    university: "",
    minCgpa: undefined as number | undefined,
    maxCgpa: undefined as number | undefined,
    codingRating: undefined as number | undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  // Show limited results for non-authenticated users
  const studentsPerPage = isAuthenticated ? 48 : 6;

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !!user,
  });

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
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

  const students = studentsData?.students || studentsData || [];
  const totalCount = studentsData?.total || students.length;

  const { data: skills } = useQuery({
    queryKey: ["/api/skills"],
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Hero Section - Clean Professional Design */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          {/* Clean notification banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-blue-100 border border-blue-200 rounded-full px-4 py-2 text-blue-700 text-sm font-medium">
              🚀 Connect with India's brightest talent
            </div>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-tight text-gray-900" data-testid="text-hero-title">
              <span className="block mb-2">Where</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">students become</span>
              <span className="block">professionals</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              TalentConnect India is the recruitment platform where 2.5M+ students and recent grads 
              launch careers at companies they love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/shortlist">
                <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold" data-testid="button-view-shortlist">
                  View Your Shortlist
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold" data-testid="button-recruitment-analytics">
                  Recruitment Analytics
              </Button>
            </div>
          </div>

          {/* Key Statistics - Clean Design */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            <div data-testid="stat-students" className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-blue-600">2.5M+</div>
              <div className="text-gray-600 text-sm">Active Students</div>
            </div>
            <div data-testid="stat-universities" className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-blue-600">95%</div>
              <div className="text-gray-600 text-sm">Top Institutions</div>
            </div>
            <div data-testid="stat-companies" className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-blue-600">15K+</div>
              <div className="text-gray-600 text-sm">Employers</div>
            </div>
            <div data-testid="stat-partnerships" className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-blue-600">400+</div>
              <div className="text-gray-600 text-sm">University Partners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies Section - Consistent Design */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900" data-testid="text-trusted-by">
              Trusted by India's leading companies
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From Fortune 500 to fast-growing startups, companies trust TalentConnect to find exceptional talent
            </p>
          </div>

          {/* Company Logos Grid - Uniform Design */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center">
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-tcs">
              <div className="text-blue-900 font-bold text-xl">TCS</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-infosys">
              <div className="text-blue-700 font-bold text-lg">Infosys</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-wipro">
              <div className="text-green-700 font-bold text-lg">Wipro</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-hcl">
              <div className="text-blue-600 font-bold text-lg">HCL</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-google">
              <div className="text-gray-700 font-bold text-lg">Google</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-amazon">
              <div className="text-orange-600 font-bold text-lg">Amazon</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-microsoft">
              <div className="text-blue-600 font-bold text-lg">Microsoft</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-flipkart">
              <div className="text-orange-600 font-bold text-lg">Flipkart</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-paytm">
              <div className="text-blue-600 font-bold text-lg">Paytm</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-ola">
              <div className="text-green-600 font-bold text-lg">Ola</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-swiggy">
              <div className="text-orange-600 font-bold text-lg">Swiggy</div>
            </div>
            <div className="flex items-center justify-center h-16 w-32 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow" data-testid="logo-zomato">
              <div className="text-red-600 font-bold text-lg">Zomato</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Simplified and Consistent */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why choose TalentConnect India?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to find and hire exceptional entry-level software engineers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow" data-testid="feature-filter">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Filtering</h3>
              <p className="text-gray-600">
                Find the right candidates using advanced filters for skills, university, CGPA, and more.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow" data-testid="feature-assessment">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Skills Assessment</h3>
              <p className="text-gray-600">
                Evaluate candidates on coding, quantitative ability, verbal skills, and English proficiency.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow" data-testid="feature-hire">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Streamlined Hiring</h3>
              <p className="text-gray-600">
                Complete end-to-end hiring workflow from browsing to final selection and notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse Talent Section - Full Browse Experience */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse entry-level software engineers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover talented students from India's leading universities. Use filters to find the perfect candidates for your team.
            </p>
          </div>

          {/* Filters Section */}
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Filter Candidates</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Find the perfect candidates by using the filters below</p>
            </div>
            <StudentFilters
              filters={{
                skills: filters.skills.length > 0 ? filters.skills.join(",") : "all",
                location: filters.location || "all",
                university: filters.university || "all",
                minCgpa: filters.minCgpa?.toString() || "all",
                maxCgpa: filters.maxCgpa?.toString() || "all",
                codingRating: filters.codingRating?.toString() || "all"
              }}
              onFiltersChange={(newFilters) => {
                setFilters({
                  skills: newFilters.skills && newFilters.skills !== "all" ? newFilters.skills.split(",").filter(Boolean) : [],
                  location: newFilters.location === "all" ? "" : newFilters.location,
                  university: newFilters.university === "all" ? "" : newFilters.university,
                  minCgpa: newFilters.minCgpa && newFilters.minCgpa !== "all" ? parseFloat(newFilters.minCgpa) : undefined,
                  maxCgpa: newFilters.maxCgpa && newFilters.maxCgpa !== "all" ? parseFloat(newFilters.maxCgpa) : undefined,
                  codingRating: newFilters.codingRating && newFilters.codingRating !== "all" ? parseInt(newFilters.codingRating) : undefined
                });
              }}
              onSearch={() => setCurrentPage(1)}
              skills={(skills as any) || []}
              resultCount={students.length}
              totalCount={totalCount}
            />
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

          {/* Student Results */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {studentsLoading 
                  ? "Loading..." 
                  : isAuthenticated 
                    ? `${totalCount} Students Found`
                    : `Showing ${students.length} of 2.5M+ Students (Preview)`
                }
              </h3>
              {!isAuthenticated && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>2.5M+ total students available</span>
                </div>
              )}
            </div>

            {studentsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
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
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Full Access</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Browse all 2.5M+ student profiles</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-3">
                        <Star className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Shortlisting</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Save and compare candidates</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-3">
                        <Zap className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">AI Analysis</h4>
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
      </section>

      {/* Success Stories / Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Success Stories</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how leading companies are transforming their campus recruitment with TalentConnect India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow" data-testid="testimonial-1">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">TCS</span>
                </div>
                <CardTitle className="text-lg text-gray-900">Massive Scale</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  "Recruited 2,500 entry-level engineers across India in just 3 months"
                </p>
                <div className="text-xs text-gray-500 font-medium">TCS</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow" data-testid="testimonial-2">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-lg">Infosys</span>
                </div>
                <CardTitle className="text-lg text-gray-900">Quality First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  "90% of hires exceeded performance expectations in their first year"
                </p>
                <div className="text-xs text-gray-500 font-medium">Infosys</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow" data-testid="testimonial-3">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">Wipro</span>
                </div>
                <CardTitle className="text-lg text-gray-900">Efficient Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  "Reduced hiring time from 6 months to 6 weeks with better candidate quality"
                </p>
                <div className="text-xs text-gray-500 font-medium">Wipro</div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow" data-testid="testimonial-4">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-orange-600 font-bold text-lg">HCL</span>
                </div>
                <CardTitle className="text-lg text-gray-900">Perfect Match</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  "Found exactly the right candidates for our specialized technology teams"
                </p>
                <div className="text-xs text-gray-500 font-medium">HCL Technologies</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to find your next great hire?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of companies who trust TalentConnect India to build their teams
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-get-started"
              >
                Get Started Today
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600"
                data-testid="button-schedule-demo"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}