import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Handshake, ArrowRight, Users, Target, CheckCircle, Zap } from "lucide-react";

export default function Landing() {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Handshake className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">TalentBridge</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/for-students" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                For Students
              </Link>
              <Link href="/for-colleges" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                For Colleges
              </Link>
              <Button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6"
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
          <div className="inline-flex items-center bg-indigo-100 border border-indigo-200 rounded-full px-4 py-2 text-indigo-700 text-sm font-medium mb-6">
            🚀 More than 3000 companies trust TalentBridge for their hiring needs
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Hire India's Top Freshers.</span> In One Place.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto">
            Your "Uber for Talent" to match your hiring needs with India's Top 10% Freshers
          </p>
          
          <div className="flex justify-center mb-12">
            <Button 
              size="lg" 
              className="px-8 py-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" 
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-explore-talent"
            >
              Start Hiring Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mb-16">
            <div data-testid="stat-students" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">200K+</div>
              <div className="text-gray-600 text-sm">Pre-Assessed Students</div>
            </div>
            <div data-testid="stat-companies" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-indigo-600">3000+</div>
              <div className="text-gray-600 text-sm">Trusted Companies</div>
            </div>
            <div data-testid="stat-colleges" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-green-600">500+</div>
              <div className="text-gray-600 text-sm">Partner Colleges</div>
            </div>
            <div data-testid="stat-success" className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <div className="text-3xl md:text-4xl font-bold mb-2 text-purple-600">95%</div>
              <div className="text-gray-600 text-sm">Placement Success</div>
            </div>
          </div>

          {/* Value Proposition Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Top 10% Talent</h3>
              <p className="text-gray-600 text-sm">Access pre-screened candidates from India's premier institutions with verified skills.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Pre-Assessed</h3>
              <p className="text-gray-600 text-sm">All candidates undergo rigorous technical and aptitude assessments before joining our platform.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Hiring</h3>
              <p className="text-gray-600 text-sm">Reduce time-to-hire from months to weeks with our streamlined recruitment process.</p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Hiring?</h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of companies that have found their ideal candidates through TalentBridge
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="px-8 py-4 text-lg bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
                onClick={() => window.location.href = "/api/login"}
                data-testid="button-start-free-trial"
              >
                Start Hiring Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}