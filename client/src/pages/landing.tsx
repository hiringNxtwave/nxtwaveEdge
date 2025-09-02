import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Target, TrendingUp, Star, Award, Globe, CheckCircle, ArrowRight, MapPin, GraduationCap, Handshake, Zap, Clock, Shield, Search } from "lucide-react";
import { SiTata, SiInfosys, SiWipro, SiGoogle, SiAmazon, SiFlipkart, SiAccenture } from "react-icons/si";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-blue-100 border border-blue-200 rounded-full px-4 py-2 text-blue-700 text-sm font-medium mb-6">
            🚀 Trusted by 15,000+ companies across India
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            India's Premier <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Talent Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
            Connect with 2.5M+ verified students and recent graduates from India's top universities. 
            Streamline your hiring with AI-powered matching, comprehensive assessments, and seamless candidate management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold" 
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-explore-talent"
            >
              Start Hiring Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold"
              onClick={() => window.location.href = "/api/login"}
            >
              Schedule Demo
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div data-testid="stat-students" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-blue-600">2.5M+</div>
              <div className="text-gray-600 text-sm">Verified Students</div>
            </div>
            <div data-testid="stat-universities" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-green-600">400+</div>
              <div className="text-gray-600 text-sm">Partner Universities</div>
            </div>
            <div data-testid="stat-companies" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-purple-600">15K+</div>
              <div className="text-gray-600 text-sm">Active Employers</div>
            </div>
            <div data-testid="stat-partnerships" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-orange-600">95%</div>
              <div className="text-gray-600 text-sm">Hiring Success Rate</div>
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

      {/* Value Proposition for Companies */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Why Companies Choose TalentConnect India
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Get access to India's largest pool of verified talent with powerful tools to streamline your entire hiring process
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