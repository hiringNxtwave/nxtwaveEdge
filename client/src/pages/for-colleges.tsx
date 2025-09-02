import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { 
  Users, 
  TrendingUp, 
  Award, 
  BarChart3,
  Target,
  Zap,
  GraduationCap,
  Building2,
  CheckCircle,
  Star,
  Calendar,
  Phone,
  ChevronRight,
  Shield
} from "lucide-react";

export default function ForColleges() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Placement Analytics",
      description: "Comprehensive dashboards showing student performance, company preferences, and placement trends",
      benefits: ["Real-time placement tracking", "Industry demand insights", "Skill gap analysis"]
    },
    {
      icon: <Award className="w-8 h-8 text-green-600" />,
      title: "Industry Validation",
      description: "Students get industry-recognized certifications that enhance your college's reputation",
      benefits: ["Verified skill credentials", "Enhanced college ranking", "Industry partnership recognition"]
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Corporate Connections",
      description: "Direct partnerships with 500+ companies for exclusive recruitment opportunities",
      benefits: ["Exclusive company access", "Priority job opportunities", "Industry networking events"]
    },
    {
      icon: <Target className="w-8 h-8 text-orange-600" />,
      title: "Curriculum Insights",
      description: "Data-driven recommendations to improve curriculum based on industry demands",
      benefits: ["Industry-aligned curriculum", "Skill development focus", "Future-ready graduates"]
    }
  ];

  const stats = [
    { number: "95%", label: "Placement Rate Improvement", color: "text-white" },
    { number: "500+", label: "Partner Companies", color: "text-white" },
    { number: "2.4x", label: "Higher Package Offers", color: "text-white" },
    { number: "85%", label: "Student Satisfaction", color: "text-white" }
  ];

  const partnerColleges = [
    "IIT Delhi", "BITS Pilani", "NIT Trichy", "IIIT Hyderabad", 
    "VIT University", "SRM University", "Manipal Institute", "NSIT Delhi"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 text-sm px-4 py-2">
              <GraduationCap className="w-4 h-4 mr-2" />
              Trusted by 200+ Colleges
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Transform Your 
            <span className="text-green-600"> Placement Success</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Partner with NxtWave to provide students with meticulously designed assessments by industry experts. 
            One Assessment. Diagnosis & Report. Multiple company opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="px-8 py-4 text-lg bg-green-600 hover:bg-green-700">
              Schedule Partnership Call
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              View Success Stories
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Trusted by leading institutions:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              {partnerColleges.slice(0, 6).map((college) => (
                <span key={college} className="font-semibold">{college}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Partner with TalentConnect?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Comprehensive placement solution designed for modern educational institutions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-3">{feature.title}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {feature.description}
                      </p>
                      <div className="space-y-2">
                        {feature.benefits.map((benefit, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Excellence Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">One Assessment. Diagnosis & Report.</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Meticulously designed assignments created by people working at top product companies.
              Your students get assessed for roles ranging from 8-18 LPA.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-xl">🧮</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Aptitude Assessment</h3>
              <p className="text-sm opacity-90">Quantitative analysis, logical reasoning, and problem-solving evaluation</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-xl">📝</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Verbal Skills</h3>
              <p className="text-sm opacity-90">Reading comprehension, grammar, vocabulary, and critical reasoning</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-xl">💻</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">DSA Evaluation</h3>
              <p className="text-sm opacity-90">Industry-standard coding challenges and system design concepts</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-xl">🗣️</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">English Communication</h3>
              <p className="text-sm opacity-90">Video-based assessment of professional communication skills</p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-base opacity-80 mb-8">
              Designed by people from companies that are product developers - People working in top companies like Google, Microsoft, Amazon, Meta, Netflix, and Uber.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-3xl mx-auto">
              <h4 className="text-xl font-semibold mb-4">🎯 Multiple Top Tier Companies</h4>
              <p className="text-sm opacity-90 mb-4">
                Student profiles get shared with companies continuously. Multiple companies shortlist based on assessment performance.
              </p>
              <p className="text-sm opacity-90">
                <strong>🎤 Free Mock Interviews:</strong> Your students practice with engineers from prominent companies before actual interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Proven Results for Partner Colleges
            </h2>
            <p className="text-xl opacity-90">
              Real outcomes from our educational partnerships
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Partnership Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Initial Consultation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Schedule a call to discuss your placement goals
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Customize Solution</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tailor the platform to your specific needs
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Student Onboarding</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Help students create profiles and take assessments
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Track Results</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor placements and student progress
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Comprehensive Partnership Benefits
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <Building2 className="w-12 h-12 text-green-600 mb-4" />
                <CardTitle>Institution Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Real-time placement analytics</li>
                  <li>• Student performance insights</li>
                  <li>• Company engagement metrics</li>
                  <li>• Curriculum gap analysis</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <Award className="w-12 h-12 text-blue-600 mb-4" />
                <CardTitle>Industry Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Verified skill certifications</li>
                  <li>• Industry partnership badge</li>
                  <li>• Enhanced college reputation</li>
                  <li>• Media recognition opportunities</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <Calendar className="w-12 h-12 text-purple-600 mb-4" />
                <CardTitle>Ongoing Support</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li>• Dedicated account manager</li>
                  <li>• Regular training sessions</li>
                  <li>• 24/7 technical support</li>
                  <li>• Quarterly business reviews</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Partner Colleges Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Rajesh Kumar</div>
                    <div className="text-sm text-gray-600">Placement Head, NIT Trichy</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "TalentConnect transformed our placement process. 95% placement rate this year!"
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Prof. Anita Sharma</div>
                    <div className="text-sm text-gray-600">Director, IIIT Hyderabad</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "The industry connections and assessment quality are exceptional. Highly recommend."
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Dr. Vikram Singh</div>
                    <div className="text-sm text-gray-600">Dean, VIT University</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  "Students love the platform. Package offers increased by 2.4x this year!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Placements?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 200+ colleges already partnering with TalentConnect India
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Schedule Partnership Call
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg">
              Request Demo
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            Free consultation • Custom solutions • Proven results
          </p>
        </div>
      </section>
    </div>
  );
}