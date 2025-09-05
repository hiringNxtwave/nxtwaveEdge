import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Users, Building2, MessageSquare, TrendingUp, Star, Award, Globe, Target, CheckCircle, ArrowRight, MapPin, GraduationCap, Heart, Zap, Calendar, BookOpen } from "lucide-react";
import { SiTata, SiInfosys, SiWipro, SiGoogle, SiAmazon, SiFlipkart } from "react-icons/si";
import Header from "@/components/header";
import { useShortlist } from "@/contexts/shortlist-context";

// Helper functions for personalized dashboard
const getCollegeTierDisplay = (tier: string) => {
  const displays = {
    'only-iits': 'Only IITs',
    'iits-nits-bits': 'IITs, NITs & BITS', 
    'tier1-including-iits': 'Tier 1 Colleges',
    'tier2-colleges': 'Tier 2 Colleges',
    'tier3-colleges': 'Tier 3 Colleges'
  };
  return displays[tier as keyof typeof displays] || tier;
};

const getHiringVolumeDisplay = (volume: string) => {
  const displays = {
    '1-5': '1-5 freshers/year',
    '6-15': '6-15 freshers/year',
    '16-30': '16-30 freshers/year', 
    '31-50': '31-50 freshers/year',
    '50+': '50+ freshers/year'
  };
  return displays[volume as keyof typeof displays] || volume;
};

const getNewProfilesCount = (volume: string) => {
  const counts = {
    '1-5': 3,
    '6-15': 8,
    '16-30': 15,
    '31-50': 22,
    '50+': 35
  };
  return counts[volume as keyof typeof counts] || 8;
};

export default function Home() {
  useScrollToTop();
  
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

          {/* Personalized Talent Curation */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              🎯 Curated for Your Needs
            </h2>
            <p className="text-gray-600 mb-6">
              Based on your preferences: {user?.collegesTier && getCollegeTierDisplay(user.collegesTier)} • {user?.annualFresherHires && getHiringVolumeDisplay(user.annualFresherHires)} • {user?.budgetRange} LPA
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Premium Talent Bundle */}
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-blue-900">
                      🏆 Premium Bundle
                    </CardTitle>
                    <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                      Top 5%
                    </Badge>
                  </div>
                  <CardDescription>
                    {user?.collegesTier === 'only-iits' ? 'IIT graduates' : 
                     user?.collegesTier === 'iits-nits-bits' ? 'IIT/NIT/BITS graduates' :
                     'Top-tier college graduates'} matching your requirements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available Candidates</span>
                      <span className="font-semibold text-blue-700">12 profiles</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg. Assessment Score</span>
                      <span className="font-semibold text-green-700">92/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Expected Salary</span>
                      <span className="font-semibold text-gray-700">{user?.budgetRange} LPA</span>
                    </div>
                    <Link href="/browse?bundle=premium">
                      <Button className="w-full mt-4" size="sm">
                        <Zap className="w-4 h-4 mr-2" />
                        View Bundle
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* High Potential Bundle */}
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-green-900">
                      🚀 Rising Stars
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-200 text-green-800">
                      High Growth
                    </Badge>
                  </div>
                  <CardDescription>
                    High-potential candidates with exceptional project portfolios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available Candidates</span>
                      <span className="font-semibold text-green-700">18 profiles</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg. Project Score</span>
                      <span className="font-semibold text-green-700">88/100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Open Source Contrib.</span>
                      <span className="font-semibold text-purple-700">85%</span>
                    </div>
                    <Link href="/browse?bundle=rising-stars">
                      <Button className="w-full mt-4" size="sm" variant="outline">
                        <Star className="w-4 h-4 mr-2" />
                        View Bundle
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Hire Bundle */}
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-orange-900">
                      ⚡ Immediate Available
                    </CardTitle>
                    <Badge variant="secondary" className="bg-orange-200 text-orange-800">
                      0-30 days
                    </Badge>
                  </div>
                  <CardDescription>
                    Ready to join immediately with flexible notice periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available Candidates</span>
                      <span className="font-semibold text-orange-700">25 profiles</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Avg. Notice Period</span>
                      <span className="font-semibold text-orange-700">15 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Interview Ready</span>
                      <span className="font-semibold text-green-700">100%</span>
                    </div>
                    <Link href="/browse?bundle=immediate">
                      <Button className="w-full mt-4" size="sm" variant="outline">
                        <Calendar className="w-4 h-4 mr-2" />
                        View Bundle
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Talent Drop */}
            <Card className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">📦 Weekly Talent Drop</h3>
                    <p className="text-purple-100 mb-4">
                      Fresh profiles added every Monday based on your hiring pattern
                    </p>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>+{getNewProfilesCount(user?.annualFresherHires || '')} new this week</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Matched to your criteria</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/browse?latest=true">
                    <Button variant="outline" className="bg-white text-purple-700 hover:bg-purple-50">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Browse All
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

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
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-900" data-testid="text-trusted-by">
              Trusted by Industry Leaders
            </h2>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
              <div className="flex justify-center" data-testid="logo-tata">
                <SiTata className="h-12 w-auto text-gray-700 hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex justify-center" data-testid="logo-infosys">
                <SiInfosys className="h-12 w-auto text-gray-700 hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex justify-center" data-testid="logo-wipro">
                <SiWipro className="h-12 w-auto text-gray-700 hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex justify-center" data-testid="logo-google">
                <SiGoogle className="h-12 w-auto text-gray-700 hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex justify-center" data-testid="logo-amazon">
                <SiAmazon className="h-12 w-auto text-gray-700 hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex justify-center" data-testid="logo-flipkart">
                <SiFlipkart className="h-12 w-auto text-gray-700 hover:text-blue-600 transition-colors" />
              </div>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
              <h2 className="text-5xl font-bold text-white mb-6">
                Start Hiring Excellence
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                Access India's top pre-assessed talent pool and reduce your hiring time by 75%
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/browse">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-5 text-xl font-bold shadow-xl"
                    data-testid="button-get-started-cta"
                  >
                    Browse Candidates Now
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                </Link>
                <p className="text-blue-200 text-sm">
                  Free to start • No setup fees
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}