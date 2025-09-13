import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Users, Building2, TrendingUp, Star, Award, Globe, Target, CheckCircle, ArrowRight, MapPin, GraduationCap, Heart, Zap, BookOpen } from "lucide-react";
import { SiTata, SiInfosys, SiWipro, SiGoogle, SiAmazon, SiFlipkart } from "react-icons/si";
import Header from "@/components/header";
import MarketIntelligence from "@/components/market-intelligence";
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
    queryKey: ["/api/company/stats"],
    enabled: !!user,
  });


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


          {/* Quick Stats - Clean Layout */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
              <div className="text-sm font-medium text-gray-700">Profiles viewed</div>
              <div className="text-xs text-gray-500 mt-1">This week</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-100">
              <div className="text-3xl font-bold text-green-600 mb-2">12</div>
              <div className="text-sm font-medium text-gray-700">Avg. time to hire</div>
              <div className="text-xs text-gray-500 mt-1">Days</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">87%</div>
              <div className="text-sm font-medium text-gray-700">Response rate</div>
              <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-100">
              <div className="text-3xl font-bold text-orange-600 mb-2">₹45L</div>
              <div className="text-sm font-medium text-gray-700">Cost saved</div>
              <div className="text-xs text-gray-500 mt-1">This quarter</div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Intelligence Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <MarketIntelligence />
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