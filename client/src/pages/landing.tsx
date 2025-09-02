import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Handshake, ArrowRight, Target, CheckCircle, Zap } from "lucide-react";

export default function Landing() {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Handshake className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">TalentBridge</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/for-students" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                For Students
              </Link>
              <Link href="/for-colleges" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                For Colleges
              </Link>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
              >
                Start Hiring
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          {/* Trust Badge */}
          <div className="inline-flex items-center bg-indigo-100 border border-indigo-200 rounded-full px-4 py-2 text-indigo-700 text-sm font-medium mb-8">
            🚀 Trusted by 3000+ companies for hiring needs
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Hire India's <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Top Freshers</span>
            <br />In One Place
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Access pre-assessed candidates from India's top institutions. 
            Filter by skills, interview fast, and hire with confidence.
          </p>
          
          {/* CTA Button */}
          <div className="mb-16">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" 
              onClick={() => window.location.href = "/api/login"}
            >
              Start Hiring Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-gray-900 mb-2">200K+</div>
              <div className="text-sm text-gray-600">Pre-Assessed Students</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-indigo-600 mb-2">3000+</div>
              <div className="text-sm text-gray-600">Trusted Companies</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Partner Colleges</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Top 10% Talent</h3>
              <p className="text-gray-600">Pre-screened candidates from premier institutions</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pre-Assessed</h3>
              <p className="text-gray-600">Rigorous technical and aptitude evaluations</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Hiring</h3>
              <p className="text-gray-600">Reduce time-to-hire from months to weeks</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}