import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Building2, MessageSquare, TrendingUp, Star, Award, Globe, Target, CheckCircle, ArrowRight } from "lucide-react";
import { SiTata, SiInfosys, SiWipro, SiMicrosoft, SiGoogle, SiAmazon, SiFlipkart } from "react-icons/si";
import Header from "@/components/header";

export default function Home() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      {/* Hero Section with Key Stats */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-hero-title">
              Hire top talent from India's best universities
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Connect with skilled students and recent graduates from premier Indian institutions. 
              Streamline your campus recruiting with advanced tools and verified profiles.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <Link href="/browse">
                <Button size="lg" className="px-8 py-3" data-testid="button-browse-talent">
                  Browse Talent
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-3" data-testid="button-request-demo">
                Request Demo
              </Button>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" data-testid="stat-students">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">2.5M+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Students & Alumni</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" data-testid="stat-universities">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-300">Top Engineering Colleges</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" data-testid="stat-companies">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">15,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Hiring Partners</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg" data-testid="stat-partnerships">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">400+</div>
              <div className="text-gray-600 dark:text-gray-300">Official University Partnerships</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-trusted-by">
              100% of India's top companies use TalentConnect to find their next generation of talent
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join leading Indian companies and global multinationals who trust our platform for campus recruitment
            </p>
          </div>

          {/* Company Logos Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-8 items-center justify-items-center mb-8">
            <div className="flex items-center justify-center h-16 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-testid="logo-tata">
              <SiTata size={60} />
            </div>
            <div className="flex items-center justify-center h-16 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-testid="logo-infosys">
              <SiInfosys size={60} />
            </div>
            <div className="flex items-center justify-center h-16 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-testid="logo-wipro">
              <SiWipro size={60} />
            </div>
            <div className="flex items-center justify-center h-16 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-testid="logo-microsoft">
              <SiMicrosoft size={60} />
            </div>
            <div className="flex items-center justify-center h-16 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-testid="logo-google">
              <SiGoogle size={60} />
            </div>
            <div className="flex items-center justify-center h-16 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-testid="logo-amazon">
              <SiAmazon size={60} />
            </div>
            <div className="flex items-center justify-center h-16 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" data-testid="logo-flipkart">
              <SiFlipkart size={60} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
              <Building2 className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fortune 500 Companies</h3>
              <p className="text-gray-600 dark:text-gray-300">All top 100 Indian companies actively recruit through our platform</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
              <Globe className="h-12 w-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Global MNCs</h3>
              <p className="text-gray-600 dark:text-gray-300">International companies expanding their Indian operations</p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
              <TrendingUp className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Fast-Growing Startups</h3>
              <p className="text-gray-600 dark:text-gray-300">Unicorns and emerging startups building their tech teams</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to hire top talent from India
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Streamline your campus recruitment process with tools designed specifically for the Indian talent ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-testid="feature-brand">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Build Your Brand</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Stay top of mind for 2.5M+ verified candidates and drive engagement through targeted outreach
              </p>
            </div>

            <div className="text-center" data-testid="feature-filter">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Find Right Candidates</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advanced filtering by university, skills, coding ratings, CGPA, and location across 400+ institutions
              </p>
            </div>

            <div className="text-center" data-testid="feature-connect">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connect with Students</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Build meaningful relationships with India's brightest minds through direct messaging and engagement
              </p>
            </div>

            <div className="text-center" data-testid="feature-hire">
              <div className="bg-orange-100 dark:bg-orange-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Reduce Time to Hire</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Streamlined recruiting process with integrated tools for campus visits, interviews, and offer management
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories / Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Success Stories</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how leading companies are transforming their campus recruitment with TalentConnect India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow" data-testid="case-study-tcs">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">TCS</div>
                  <div>
                    <CardTitle className="text-lg">Tata Consultancy Services</CardTitle>
                    <p className="text-sm text-gray-500">Global IT Services</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "TalentConnect helped us hire 12,000+ engineering graduates across 200+ campuses with 40% faster processing"
                </p>
                <div className="flex items-center text-orange-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow" data-testid="case-study-swiggy">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">SW</div>
                  <div>
                    <CardTitle className="text-lg">Swiggy</CardTitle>
                    <p className="text-sm text-gray-500">Food Delivery Unicorn</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Built our entire tech team of 500+ engineers from top-tier colleges with 60% improved diversity metrics"
                </p>
                <div className="flex items-center text-orange-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow" data-testid="case-study-paytm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center text-white font-bold">PM</div>
                  <div>
                    <CardTitle className="text-lg">Paytm</CardTitle>
                    <p className="text-sm text-gray-500">FinTech Leader</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Scaled our engineering team by 300% in 18 months with campus hires from 150+ engineering colleges"
                </p>
                <div className="flex items-center text-orange-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow" data-testid="case-study-ola">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">OL</div>
                  <div>
                    <CardTitle className="text-lg">Ola Cabs</CardTitle>
                    <p className="text-sm text-gray-500">Mobility Platform</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "Reduced campus hiring costs by 50% while increasing quality of hires from Tier-1 and Tier-2 colleges"
                </p>
                <div className="flex items-center text-orange-500">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" size="lg" data-testid="button-all-case-studies">
              Explore All Success Stories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4" data-testid="text-cta-title">
            Ready to transform your campus recruitment?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of companies already using TalentConnect India to build exceptional teams from India's top universities.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/browse">
              <Button size="lg" variant="secondary" className="px-8 py-3" data-testid="button-get-started">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600" data-testid="button-contact-sales">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Dashboard Preview for Logged In Users */}
      {user && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome back, {user?.firstName}!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Here's your quick overview and actions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card data-testid="card-stat-students">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-students">
                    {(stats as any)?.totalStudents || "120"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-companies">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-companies">
                    {(stats as any)?.totalCompanies || "45"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-contacts">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Contact Requests</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-contacts">
                    {(stats as any)?.totalContacts || "89"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +8% from last month
                  </p>
                </CardContent>
              </Card>

              <Card data-testid="card-stat-placements">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Successful Placements</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold" data-testid="text-total-placements">
                    {(stats as any)?.totalPlacements || "156"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +15% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card data-testid="card-quick-actions">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Get started with common tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/browse">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-browse-students">
                      <Users className="mr-2 h-4 w-4" />
                      Browse Students
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button className="w-full justify-start" variant="outline" data-testid="button-company-dashboard">
                      <Building2 className="mr-2 h-4 w-4" />
                      Company Dashboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card data-testid="card-recent-activity">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates in the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">• New student from IIT Delhi registered</p>
                    <p className="mb-2">• TechCorp updated their company profile</p>
                    <p className="mb-2">• 5 new contact requests this week</p>
                    <p>• Updated skill categories available</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}