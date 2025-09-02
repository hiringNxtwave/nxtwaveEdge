import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Users, Building2, MessageSquare, TrendingUp, Star, Award, Globe, Target, CheckCircle, ArrowRight, MapPin, GraduationCap, Heart, Zap, Calendar, BookOpen } from "lucide-react";
import { SiTata, SiInfosys, SiWipro, SiGoogle, SiAmazon, SiFlipkart } from "react-icons/si";
import Header from "@/components/header";
import { useShortlist } from "@/contexts/shortlist-context";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { shortlistCount } = useShortlist();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !!user,
  });

  // Sample recent activity for demo
  const recentActivity = [
    { type: "view", student: "Rahul Sharma", university: "IIT Delhi", time: "2 hours ago" },
    { type: "shortlist", student: "Priya Patel", university: "NIT Trichy", time: "5 hours ago" },
    { type: "contact", student: "Amit Kumar", university: "BITS Pilani", time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Welcome Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-900" data-testid="text-welcome">
              Welcome back, {user?.firstName || "there"}! 👋
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Ready to discover your next great hire? Your recruitment dashboard is here.
            </p>
          </div>

          {/* Primary Action */}
          <div className="mb-8">
            <Link href="/browse">
              <Card className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer text-white" data-testid="card-browse-candidates">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Find Your Next Great Hire</h2>
                      <p className="text-blue-100 mb-4">Browse pre-assessed candidates ready to join your team</p>
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4" />
                          <span>Top 10% talent</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4" />
                          <span>Pre-assessed</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span>Immediate hire</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-2">
                        <Users className="w-8 h-8" />
                      </div>
                      <ArrowRight className="w-6 h-6 mx-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Your Shortlist Card */}
          {shortlistCount > 0 && (
            <div className="mb-6">
              <Link href="/shortlist">
                <Card className="hover:shadow-md transition-shadow cursor-pointer bg-white border border-gray-200 hover:border-blue-300" data-testid="card-your-shortlist">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Your Shortlist</CardTitle>
                        <CardDescription>Saved candidates for review</CardDescription>
                      </div>
                      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                        <Heart className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-red-600">{shortlistCount}</p>
                    <p className="text-sm text-gray-600">Ready for interview</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )}

          {/* Hiring Insights - Full Width */}
          <Card className="bg-white border border-gray-200" data-testid="card-hiring-insights">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Hiring Insights</CardTitle>
                  <CardDescription>Your recruitment analytics and performance metrics</CardDescription>
                </div>
                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">24</div>
                  <div className="text-sm text-gray-600">Profiles viewed</div>
                  <div className="text-xs text-gray-500 mt-1">This week</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">12</div>
                  <div className="text-sm text-gray-600">Avg. time to hire</div>
                  <div className="text-xs text-gray-500 mt-1">Days</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">87%</div>
                  <div className="text-sm text-gray-600">Response rate</div>
                  <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 mb-1">₹45L</div>
                  <div className="text-sm text-gray-600">Cost saved</div>
                  <div className="text-xs text-gray-500 mt-1">This quarter</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Platform Overview */}
            <Card className="bg-white" data-testid="card-platform-overview">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  Why Choose NxtWave?
                </CardTitle>
                <CardDescription>Pre-assessed talent that saves time and money</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                    <Target className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Top 10% Talent Only</p>
                      <p className="text-sm text-gray-600">Rigorous offline assessment by Google, Microsoft, Amazon engineers</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <Zap className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Instant Hiring</p>
                      <p className="text-sm text-gray-600">Skip lengthy interviews - candidates are pre-verified and ready</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Save ₹50-70L Per Cycle</p>
                      <p className="text-sm text-gray-600">Reduce recruitment costs and time-to-hire significantly</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white" data-testid="card-recent-activity">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest hiring actions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === 'view' ? 'bg-blue-100' :
                            activity.type === 'shortlist' ? 'bg-green-100' : 'bg-purple-100'
                          }`}>
                            {activity.type === 'view' ? 
                              <Users className="w-4 h-4 text-blue-600" /> :
                              activity.type === 'shortlist' ? 
                              <Heart className="w-4 h-4 text-green-600" /> :
                              <MessageSquare className="w-4 h-4 text-purple-600" />
                            }
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{activity.student}</p>
                            <p className="text-xs text-gray-600">{activity.university}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={activity.type === 'shortlist' ? 'default' : 'secondary'} className="text-xs">
                            {activity.type === 'view' ? 'Viewed' : 
                             activity.type === 'shortlist' ? 'Shortlisted' : 'Contacted'}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        View All Activity
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500 mb-4">No activity yet</p>
                    <Link href="/browse">
                      <Button size="sm">Start Browsing Candidates</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trusted Companies Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900" data-testid="text-trusted-by">
              Trusted by India's leading companies
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of companies that have found their perfect hires through NxtWave
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-70">
            <div className="flex justify-center" data-testid="logo-tata">
              <SiTata className="h-8 w-auto text-gray-600" />
            </div>
            <div className="flex justify-center" data-testid="logo-infosys">
              <SiInfosys className="h-8 w-auto text-gray-600" />
            </div>
            <div className="flex justify-center" data-testid="logo-wipro">
              <SiWipro className="h-8 w-auto text-gray-600" />
            </div>
            <div className="flex justify-center" data-testid="logo-google">
              <SiGoogle className="h-8 w-auto text-gray-600" />
            </div>
            <div className="flex justify-center" data-testid="logo-amazon">
              <SiAmazon className="h-8 w-auto text-gray-600" />
            </div>
            <div className="flex justify-center" data-testid="logo-flipkart">
              <SiFlipkart className="h-8 w-auto text-gray-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Platform Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your recruitment process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-t-4 border-t-blue-500" data-testid="card-feature-search">
              <CardHeader>
                <Target className="w-10 h-10 text-blue-600 mb-4" />
                <CardTitle>Advanced Search</CardTitle>
                <CardDescription>
                  Filter by skills, location, university, CGPA, and coding ability to find exact matches
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-t-4 border-t-green-500" data-testid="card-feature-management">
              <CardHeader>
                <Star className="w-10 h-10 text-green-600 mb-4" />
                <CardTitle>Candidate Management</CardTitle>
                <CardDescription>
                  Save, compare, and organize candidates with our intuitive shortlisting system
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white border-t-4 border-t-purple-500" data-testid="card-feature-insights">
              <CardHeader>
                <Zap className="w-10 h-10 text-purple-600 mb-4" />
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Get intelligent recommendations and analytics to improve your hiring decisions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Get Started in 3 Easy Steps</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find your next hire quickly with our streamlined process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="step-search">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search & Filter</h3>
              <p className="text-gray-600">Use our advanced filters to find candidates that match your exact requirements</p>
            </div>

            <div className="text-center" data-testid="step-shortlist">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Shortlist & Compare</h3>
              <p className="text-gray-600">Save promising candidates and compare their skills side-by-side</p>
            </div>

            <div className="text-center" data-testid="step-contact">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Hire</h3>
              <p className="text-gray-600">Reach out to your top choices and make your hiring decision</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/browse">
              <Button size="lg" className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold" data-testid="button-start-browsing">
                Start Browsing Candidates
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}