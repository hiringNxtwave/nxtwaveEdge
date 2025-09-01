import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Building2, MessageSquare, TrendingUp, Star, Award, Globe, Target, CheckCircle, ArrowRight } from "lucide-react";
import { SiTata, SiInfosys, SiWipro, SiGoogle, SiAmazon, SiFlipkart } from "react-icons/si";
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
              <Link href="/browse">
                <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold" data-testid="button-browse-candidates">
                  Browse Candidates
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold" data-testid="button-request-demo">
                Request a Demo
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

        </div>
      </section>

      {/* Call to Action - Clean Design */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6" data-testid="text-cta-title">
            Ready to find your next star engineer?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of companies using TalentConnect India to hire exceptional entry-level software engineers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button size="lg" className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-semibold" data-testid="button-start-hiring">
                Start Hiring Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600 font-semibold" data-testid="button-contact-sales">
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