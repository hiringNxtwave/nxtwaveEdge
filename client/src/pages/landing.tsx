import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Target, TrendingUp, Star, Award, CheckCircle, ArrowRight, MapPin, GraduationCap, Handshake, Zap, Clock, Shield, Search, BarChart3, Check, Filter, Heart, Bookmark } from "lucide-react";
import { SiTata, SiInfosys, SiWipro, SiGoogle, SiAmazon, SiFlipkart, SiAccenture } from "react-icons/si";

export default function Landing() {
  useScrollToTop();
  
  return (
    <div className="min-h-screen hero-gradient dark:hero-gradient-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-ray floating-animation"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
      
      {/* Glass Morphism Navigation */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Handshake className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">NxtWave</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/for-students" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105">
                For Students
              </Link>
              <Link href="/for-colleges" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105">
                For Colleges
              </Link>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                data-testid="button-login"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium Hero Section */}
      <div className="relative container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          {/* Animated Badge */}
          <div className="inline-flex items-center glass-card rounded-full px-6 py-3 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 pulse-glow">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
            🚀 More than 3000 companies trust NxtWave for their hiring needs
          </div>
          
          {/* Premium Typography */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight">
            <span className="premium-gradient-text">Hire India's Top Freshers.</span>
            <br />
            <span className="text-gray-900 dark:text-white">In One Place.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Your <span className="premium-gradient-text font-semibold">"Uber for Talent"</span> to match your hiring needs with India's Top 10% Freshers
          </p>
          
          {/* Dual Premium CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <button 
              onClick={() => window.location.href = "/api/login"}
              className="btn-premium bg-gradient-to-r from-blue-600 to-indigo-600 text-white focus:ring-blue-500"
              data-testid="button-explore-talent"
            >
              Start Hiring Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
          </div>
          
          {/* Simple Dashboard Preview */}
          <div className="relative max-w-4xl mx-auto mb-16">
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200">
              {/* Simple Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Handshake className="text-white w-4 h-4" />
                  </div>
                  <span className="text-sm text-green-700 font-medium">AI Matching Active</span>
                </div>
                <span className="text-sm text-gray-600">127 matches found</span>
              </div>
              
              {/* Simplified Student Cards */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Card 1 */}
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mx-auto mb-2">
                    AR
                  </div>
                  <h4 className="text-xs font-semibold text-gray-900">Arjun R.</h4>
                  <p className="text-xs text-gray-600">IIT Delhi</p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <SiGoogle className="w-5 h-5 text-blue-600" />
                    <span className="text-xs text-gray-600">97% match</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mx-auto mb-2">
                    PS
                  </div>
                  <h4 className="text-xs font-semibold text-gray-900">Priya S.</h4>
                  <p className="text-xs text-gray-600">NIT Trichy</p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <SiAmazon className="w-5 h-5 text-orange-600" />
                    <span className="text-xs text-gray-600">94% match</span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-xs font-semibold mx-auto mb-2">
                    RK
                  </div>
                  <h4 className="text-xs font-semibold text-gray-900">Rohit K.</h4>
                  <p className="text-xs text-gray-600">BITS Pilani</p>
                  <div className="flex items-center justify-center space-x-1 mt-1">
                    <SiFlipkart className="w-5 h-5 text-blue-500" />
                    <span className="text-xs text-gray-600">91% match</span>
                  </div>
                </div>
              </div>
              
              {/* Simple Stats */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div>
                  <div className="font-bold text-blue-600">127</div>
                  <div className="text-gray-600">Matches</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">23</div>
                  <div className="text-gray-600">Shortlisted</div>
                </div>
                <div>
                  <div className="font-bold text-purple-600">94%</div>
                  <div className="text-gray-600">Avg Score</div>
                </div>
              </div>
            </div>
            
            {/* Simple Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-medium shadow-lg">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <span>AI-Powered Matching</span>
              </div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div data-testid="stat-students" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center h-28">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">200K+</div>
              <div className="text-gray-600 text-sm">Pre-Assessed Students</div>
            </div>
            <div data-testid="stat-universities" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center h-28">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">3000+</div>
              <div className="text-gray-600 text-sm">Partner Colleges</div>
            </div>
            <div data-testid="stat-companies" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center h-28">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">3000+</div>
              <div className="text-gray-600 text-sm">Companies Trust Us</div>
            </div>
            <div data-testid="stat-partnerships" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center h-28">
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
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            <div className="flex justify-center items-center h-16" data-testid="logo-tata">
              <SiTata className="h-8 w-auto text-gray-600 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center items-center h-16" data-testid="logo-infosys">
              <SiInfosys className="h-8 w-auto text-gray-600 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center items-center h-16" data-testid="logo-wipro">
              <SiWipro className="h-8 w-auto text-gray-600 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center items-center h-16" data-testid="logo-google">
              <SiGoogle className="h-8 w-auto text-gray-600 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center items-center h-16" data-testid="logo-amazon">
              <SiAmazon className="h-8 w-auto text-gray-600 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex justify-center items-center h-16" data-testid="logo-flipkart">
              <SiFlipkart className="h-8 w-auto text-gray-600 opacity-70 hover:opacity-100 transition-opacity" />
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

      {/* Recent Activity */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Recent Platform Activity
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Live updates from our talent marketplace showing real hiring activity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">2 min ago</span>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-gray-900 font-medium">TechCorp hired 3 React developers</p>
                <p className="text-sm text-gray-600">From IIT Delhi and NIT Trichy</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">5 min ago</span>
                  </div>
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-gray-900 font-medium">127 new students joined today</p>
                <p className="text-sm text-gray-600">From top engineering colleges</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">8 min ago</span>
                  </div>
                  <Target className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-gray-900 font-medium">FinanceStart completed 15 assessments</p>
                <p className="text-sm text-gray-600">For Data Science roles</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">12 min ago</span>
                  </div>
                  <Award className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-gray-900 font-medium">New hackathon results updated</p>
                <p className="text-sm text-gray-600">Smart India Hackathon 2024</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">15 min ago</span>
                  </div>
                  <TrendingUp className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-gray-900 font-medium">AI startup shortlisted 25 candidates</p>
                <p className="text-sm text-gray-600">ML Engineering positions</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-indigo-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-sm text-gray-500">18 min ago</span>
                  </div>
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                </div>
                <p className="text-gray-900 font-medium">450+ profile views this hour</p>
                <p className="text-sm text-gray-600">Peak hiring activity detected</p>
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
            <div className="text-center flex flex-col items-center justify-start h-40">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-blue-600 mb-2">70%</div>
              <div className="text-gray-600 text-center">Reduction in Screening Time</div>
            </div>
            <div className="text-center flex flex-col items-center justify-start h-40">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">10x</div>
              <div className="text-gray-600 text-center">Faster Time-to-Hire</div>
            </div>
            <div className="text-center flex flex-col items-center justify-start h-40">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-gray-600 text-center">Better Hire Quality</div>
            </div>
            <div className="text-center flex flex-col items-center justify-start h-40">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600 text-center">Client Satisfaction</div>
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