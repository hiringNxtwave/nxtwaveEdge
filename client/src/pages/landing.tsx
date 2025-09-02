import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Target, TrendingUp, Star, Award, Globe, CheckCircle, ArrowRight, MapPin, GraduationCap, Handshake, Zap, Clock, Shield, Search, BarChart3 } from "lucide-react";
import { SiTata, SiInfosys, SiWipro, SiGoogle, SiAmazon, SiFlipkart, SiAccenture } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Handshake className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">NxtWave</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/for-students" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                For Students
              </Link>
              <Link href="/for-colleges" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                For Colleges
              </Link>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                data-testid="button-login"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 border border-blue-200 rounded-full px-4 py-2 text-blue-700 text-sm font-medium mb-6">
🚀 More than 3000 companies trust NxtWave for their hiring needs
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Hire India's Best <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Freshers.</span> In One Platform.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
            Your "Uber for Talent" to match your hiring needs with India's Top 10% Freshers
          </p>
          
          <div className="flex justify-center mb-12">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold" 
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-explore-talent"
            >
              Start Hiring Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div data-testid="stat-students" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">200K+</div>
              <div className="text-gray-600 text-sm">Pre-Assessed Students</div>
            </div>
            <div data-testid="stat-universities" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">3000+</div>
              <div className="text-gray-600 text-sm">Partner Colleges</div>
            </div>
            <div data-testid="stat-companies" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">3000+</div>
              <div className="text-gray-600 text-sm">Companies Trust Us</div>
            </div>
            <div data-testid="stat-partnerships" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">₹50-70L</div>
              <div className="text-gray-600 text-sm">Saved Per Hiring Cycle</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted Companies Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900" data-testid="text-trusted-by">
              Trusted by India's Leading Companies
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From Fortune 500 companies to innovative startups, organizations trust TalentConnect India to find exceptional talent
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-70 mb-12">
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

          {/* Customer Success Stories */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "TalentConnect India helped us hire 50+ software engineers in just 3 months. The quality of candidates is exceptional."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    A
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Anil Kumar</p>
                    <p className="text-sm text-gray-600">Head of Talent, Tech Mahindra</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "The AI-powered matching saved us 70% of screening time. We found our perfect candidates within days, not weeks."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                    P
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Priya Sharma</p>
                    <p className="text-sm text-gray-600">Talent Acquisition, Flipkart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">5.0/5</span>
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "Best platform for campus recruitment. The talent pool from IITs and NITs is unmatched. Highly recommend!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    R
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">Rajesh Gupta</p>
                    <p className="text-sm text-gray-600">Director HR, Accenture</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment Quality Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why NxtWave for Fresher Hiring?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-xl">🚀</div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">One Platform. Unlimited Talent.</h3>
              <p className="text-sm opacity-90">200,000+ pre-assessed students from 3,000+ colleges, refreshed every 90 days. Filter by skills, CTC, year, or traits — and hire in minutes.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-xl">🎯</div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Pre-Assessed & Job-Ready</h3>
              <p className="text-sm opacity-90">Rigorous offline tests in coding, DSA, aptitude & communication. Get data-driven profiles matched to your roles.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-xl">🔍</div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Matchmaking, Not Mass Hiring</h3>
              <p className="text-sm opacity-90">AI-powered filters surface only the right-fit candidates — no noise, no wasted cycles.</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-xl">💰</div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Save Time & Costs</h3>
              <p className="text-sm opacity-90">Skip 1,000 campus visits. One dashboard = instant shortlists. ₹50–70 lakhs saved per hiring cycle.</p>
            </div>
          </div>
          
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Students Assessed</h3>
              <p className="text-gray-600">Every 90 days across 3000+ colleges.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Data Updated</h3>
              <p className="text-gray-600">Skills, scores, and job-fit insights refreshed continuously.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dashboard Access</h3>
              <p className="text-gray-600">Filter by package range (6–8 LPA, 8–12 LPA, 12–24 LPA+), skills, or region.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Match & Hire</h3>
              <p className="text-gray-600">Shortlist, schedule interviews, and close hires seamlessly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Free Hiring Tools Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">🎯 Free Hiring Tools, Included</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Assessment Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Test candidates at scale with no extra effort</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">AI Mock Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Ensure students practice before facing your panel</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Student Insights Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">See real performance, not just résumés</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition for Companies */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Trusted by Leading Companies
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              From startups to Fortune 500 companies, organizations choose NxtWave for reliable fresher hiring.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border-t-4 border-t-blue-500 hover:shadow-lg transition-shadow" data-testid="card-feature-access">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Exclusive Access to Top Talent</CardTitle>
                <CardDescription className="text-base">
                  Connect with students from IITs, NITs, and 400+ top universities. Access candidates that aren't available on other platforms.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-blue-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  95% from Tier-1 & Tier-2 institutions
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-t-4 border-t-green-500 hover:shadow-lg transition-shadow" data-testid="card-feature-ai">
              <CardHeader>
                <Zap className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle className="text-xl">AI-Powered Smart Matching</CardTitle>
                <CardDescription className="text-base">
                  Our advanced algorithms match candidates based on skills, experience, and cultural fit. Reduce screening time by 70%.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-green-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  85% improvement in hire quality
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-t-4 border-t-purple-500 hover:shadow-lg transition-shadow" data-testid="card-feature-speed">
              <CardHeader>
                <Clock className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle className="text-xl">10x Faster Hiring Process</CardTitle>
                <CardDescription className="text-base">
                  From posting to hiring in days, not months. Streamlined workflows and automated communications accelerate your hiring.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-purple-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Average time-to-hire: 7 days
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-t-4 border-t-orange-500 hover:shadow-lg transition-shadow" data-testid="card-feature-verified">
              <CardHeader>
                <Shield className="w-12 h-12 text-orange-600 mb-4" />
                <CardTitle className="text-xl">100% Verified Profiles</CardTitle>
                <CardDescription className="text-base">
                  Every candidate is verified with academic records, skill assessments, and background checks. Hire with confidence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-orange-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Zero fake profiles guaranteed
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-t-4 border-t-red-500 hover:shadow-lg transition-shadow" data-testid="card-feature-assessment">
              <CardHeader>
                <Target className="w-12 h-12 text-red-600 mb-4" />
                <CardTitle className="text-xl">Comprehensive Skill Assessment</CardTitle>
                <CardDescription className="text-base">
                  Built-in coding tests, aptitude assessments, and soft skill evaluations. Make data-driven hiring decisions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-red-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  4 assessment categories included
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-t-4 border-t-indigo-500 hover:shadow-lg transition-shadow" data-testid="card-feature-support">
              <CardHeader>
                <Handshake className="w-12 h-12 text-indigo-600 mb-4" />
                <CardTitle className="text-xl">Dedicated Success Manager</CardTitle>
                <CardDescription className="text-base">
                  Get personalized support from our hiring experts. From strategy to execution, we're with you every step.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-indigo-600 font-medium">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  24/7 priority support included
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI and Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Measurable Impact on Your Hiring
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Companies using TalentConnect India see immediate improvements in their recruitment metrics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">70%</div>
              <div className="text-gray-600">Reduction in Screening Time</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">10x</div>
              <div className="text-gray-600">Faster Time-to-Hire</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Better Hire Quality</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join 15,000+ companies that have revolutionized their recruitment with TalentConnect India
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 font-semibold"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-start-free-trial"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600 font-semibold"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-book-demo"
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}