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
      
      {/* Hero Section - Handshake Style */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-slate-800/50 opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Top notification banner */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 text-green-300 text-sm">
              → Connect with India's brightest talent
            </div>
          </div>

          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight" data-testid="text-hero-title">
              <span className="block mb-2">Where</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400 mb-2">students become</span>
              <span className="block">professionals</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              TalentConnect India is the recruitment platform where 2.5M+ students and recent grads 
              launch careers at companies they love.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/browse">
                <Button size="lg" className="px-8 py-4 text-lg bg-green-500 hover:bg-green-600 text-black font-semibold" data-testid="button-browse-candidates">
                  Browse Candidates
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-semibold" data-testid="button-request-demo">
                Request a Demo
              </Button>
            </div>
          </div>

          {/* Key Statistics - Handshake Style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center">
            <div data-testid="stat-students">
              <div className="text-5xl md:text-6xl font-bold mb-2">2.5M</div>
              <div className="text-gray-300 text-lg">active college students and recent alumni</div>
            </div>
            <div data-testid="stat-universities">
              <div className="text-5xl md:text-6xl font-bold mb-2">95%</div>
              <div className="text-gray-300 text-lg">top ranked institutions in India</div>
            </div>
            <div data-testid="stat-companies">
              <div className="text-5xl md:text-6xl font-bold mb-2">15K</div>
              <div className="text-gray-300 text-lg">employers</div>
            </div>
            <div data-testid="stat-partnerships">
              <div className="text-5xl md:text-6xl font-bold mb-2">400+</div>
              <div className="text-gray-300 text-lg">official partnerships with colleges and universities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Companies Section - Handshake Style */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-trusted-by">
              100% of India's Fortune 100 companies use TalentConnect<br />
              to find their next generation of talent
            </h2>
          </div>

          {/* Company Logos Grid - Handshake Style */}
          <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-8 items-center justify-items-center mb-16">
            {/* Row 1 - Indian IT Giants */}
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-tcs">
              <div className="text-blue-900 font-bold text-xl">TCS</div>
            </div>
            <div className="flex items-center justify-center h-16 w-24 text-white hover:text-blue-400 transition-colors" data-testid="logo-infosys">
              <SiInfosys size={50} />
            </div>
            <div className="flex items-center justify-center h-16 w-24 text-white hover:text-green-400 transition-colors" data-testid="logo-wipro">
              <SiWipro size={50} />
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-hcl">
              <div className="text-blue-600 font-bold text-lg">HCL</div>
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-tech-mahindra">
              <div className="text-red-600 font-bold text-sm">Tech Mahindra</div>
            </div>

            {/* Row 2 - Global Tech */}
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-microsoft">
              <div className="text-blue-600 font-bold text-lg">MSFT</div>
            </div>
            <div className="flex items-center justify-center h-16 w-24 text-white hover:text-blue-400 transition-colors" data-testid="logo-google">
              <SiGoogle size={50} />
            </div>
            <div className="flex items-center justify-center h-16 w-24 text-white hover:text-orange-400 transition-colors" data-testid="logo-amazon">
              <SiAmazon size={50} />
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-ibm">
              <div className="text-blue-600 font-bold text-xl">IBM</div>
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-oracle">
              <div className="text-red-600 font-bold text-lg">Oracle</div>
            </div>

            {/* Row 3 - Indian Unicorns */}
            <div className="flex items-center justify-center h-16 w-24 text-white hover:text-orange-400 transition-colors" data-testid="logo-flipkart">
              <SiFlipkart size={50} />
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-paytm">
              <div className="text-blue-600 font-bold text-lg">Paytm</div>
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-ola">
              <div className="text-green-600 font-bold text-xl">OLA</div>
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-swiggy">
              <div className="text-orange-600 font-bold text-lg">Swiggy</div>
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-zomato">
              <div className="text-red-600 font-bold text-lg">Zomato</div>
            </div>

            {/* Row 4 - Financial & Conglomerates */}
            <div className="flex items-center justify-center h-16 w-24 text-white hover:text-blue-400 transition-colors" data-testid="logo-tata">
              <SiTata size={50} />
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-reliance">
              <div className="text-blue-600 font-bold text-lg">Reliance</div>
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-hdfc">
              <div className="text-blue-800 font-bold text-lg">HDFC</div>
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-icici">
              <div className="text-orange-600 font-bold text-lg">ICICI</div>
            </div>
            <div className="flex items-center justify-center h-16 w-24 bg-white rounded-lg p-2" data-testid="logo-sbi">
              <div className="text-blue-700 font-bold text-xl">SBI</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">to hire top talent</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center group" data-testid="feature-brand">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-300 group-hover:scale-105">
                  <Award className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Build your brand</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Stay top of mind for 2.5M+ verified candidates and drive consistent touch points to boost engagement.
              </p>
            </div>

            <div className="text-center group" data-testid="feature-filter">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-green-500/25 transition-all duration-300 group-hover:scale-105">
                  <Target className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Find the right candidates</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Refine your talent pool using enhanced filtering and targeting capabilities across India's top institutions.
              </p>
            </div>

            <div className="text-center group" data-testid="feature-connect">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300 group-hover:scale-105">
                  <MessageSquare className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Connect with Gen Z</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Build meaningful relationships by posting and engaging with candidates on the feed.
              </p>
            </div>

            <div className="text-center group" data-testid="feature-hire">
              <div className="relative mb-8">
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-orange-500/25 transition-all duration-300 group-hover:scale-105">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Reduce time to hire</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Create a seamless hiring experience for your team with tools for end-to-end recruiting.
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

        </div>
      </section>

      {/* Call to Action - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-blue-900/20 opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6" data-testid="text-cta-title">
            Ready to transform your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">campus recruitment?</span>
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-300 leading-relaxed">
            Join thousands of companies already using TalentConnect India to build exceptional teams from India's top universities.
          </p>
          <div className="flex justify-center">
            <Button size="lg" variant="outline" className="px-12 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-slate-900 transition-all duration-300" data-testid="button-contact-sales">
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