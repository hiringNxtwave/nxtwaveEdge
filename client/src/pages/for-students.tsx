import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import { 
  CheckCircle, 
  Users, 
  TrendingUp, 
  Award, 
  BookOpen, 
  MessageSquare,
  Target,
  Zap,
  Clock,
  Star,
  Briefcase,
  ChevronRight
} from "lucide-react";

export default function ForStudents() {
  const benefits = [
    {
      icon: <Target className="w-6 h-6 text-blue-600" />,
      title: "Industry-Standard Assessment",
      description: "Take our comprehensive evaluation designed by engineers from top product companies",
      highlight: "One assessment. Multiple opportunities."
    },
    {
      icon: <Award className="w-6 h-6 text-green-600" />,
      title: "Skill Certification",
      description: "Get verified credentials in DSA, System Design, Quantitative Aptitude, and Communication",
      highlight: "Recognized by 500+ companies"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: "Company Visibility",
      description: "Your profile gets shared with multiple top-tier companies continuously",
      highlight: "No more individual applications"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-orange-600" />,
      title: "Free Mock Interviews",
      description: "Practice with senior engineers from prominent companies before real interviews",
      highlight: "100% Free. Real feedback."
    }
  ];

  const assessmentFeatures = [
    { title: "Data Structures & Algorithms", time: "90 minutes", questions: "15 problems" },
    { title: "System Design", time: "60 minutes", questions: "3 scenarios" },
    { title: "Quantitative Aptitude", time: "45 minutes", questions: "25 questions" },
    { title: "Communication Assessment", time: "30 minutes", questions: "Video responses" }
  ];

  const companyLogos = [
    "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple", "Uber", "Airbnb"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Trusted by 100K+ Students
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Get Assessed. Get
            <span className="text-blue-600"> Hired.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            One Assessment. Diagnosis & Report. Access roles from 8-18 LPA and diagnose your skills for top companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700">
              Start Free Assessment
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              View Sample Questions
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Students from these colleges trust us:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <span className="font-semibold">IIT Delhi</span>
              <span className="font-semibold">BITS Pilani</span>
              <span className="font-semibold">NIT Trichy</span>
              <span className="font-semibold">IIIT Hyderabad</span>
              <span className="font-semibold">VIT</span>
              <span className="font-semibold">SRM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Syllabus */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Assessment Program Syllabus</h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
              Meticulously designed assignments created by people working at top product companies.
              Get assessed for roles ranging from 8-18 LPA and diagnose your skills.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-xl">🧮</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Aptitude</h3>
              <ul className="text-sm opacity-90 space-y-2 text-left">
                <li>• Quantitative Analysis</li>
                <li>• Logical Reasoning</li>
                <li>• Problem Solving</li>
                <li>• Mathematical Concepts</li>
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-xl">📝</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">Verbal</h3>
              <ul className="text-sm opacity-90 space-y-2 text-left">
                <li>• Reading Comprehension</li>
                <li>• Grammar & Vocabulary</li>
                <li>• Sentence Correction</li>
                <li>• Critical Reasoning</li>
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-xl">💻</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">DSA</h3>
              <ul className="text-sm opacity-90 space-y-2 text-left">
                <li>• Arrays & Strings</li>
                <li>• Trees & Graphs</li>
                <li>• Dynamic Programming</li>
                <li>• System Design Basics</li>
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center border border-white/30">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-xl">🗣️</div>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-white">English Communication</h3>
              <ul className="text-sm opacity-90 space-y-2 text-left">
                <li>• Video Interview Skills</li>
                <li>• Professional Speaking</li>
                <li>• Presentation Abilities</li>
                <li>• Workplace Communication</li>
              </ul>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg mb-6 opacity-90">
              <strong>One Assessment. Diagnosis & Report.</strong> 
            </p>
            <p className="text-base opacity-80 mb-8">
              Designed by people from companies that are product developers - People working in top companies like Google, Microsoft, Amazon, Meta, Netflix, and Uber.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
              <h4 className="text-xl font-semibold mb-4">🎯 Multiple Top Tier Companies</h4>
              <p className="text-sm opacity-90 mb-4">
                Your profile gets shared with companies continuously. Multiple companies shortlist based on your assessment performance.
              </p>
              <p className="text-sm opacity-90">
                <strong>🎤 Free Mock Interviews:</strong> Practice with engineers from prominent companies before your actual interviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How NxtWave Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              One assessment opens doors to multiple opportunities
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Take Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete our industry-standard evaluation covering technical skills, problem-solving, and communication
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Get Certified</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Receive detailed performance report and industry-recognized skill certifications
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Get Hired</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Your profile gets shared with 500+ companies automatically. Interview calls start coming in
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment Details */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Meticulously Designed Assessment
            </h2>
            <p className="text-xl opacity-90">
              Created by senior engineers from top product companies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assessmentFeatures.map((feature, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{feature.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm">{feature.questions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-lg opacity-90 mb-6">
              Assessment designed by engineers from:
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/90">
              {companyLogos.map((company) => (
                <span key={company} className="font-bold text-lg px-4 py-2 bg-white/10 rounded-lg">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Students Choose TalentConnect
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                      <Badge variant="secondary" className="mb-3">{benefit.highlight}</Badge>
                      <p className="text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stats */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Students Love TalentConnect
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">100K+</div>
              <div className="text-gray-600 dark:text-gray-300">Students Assessed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">85%</div>
              <div className="text-gray-600 dark:text-gray-300">Placement Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Partner Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24h</div>
              <div className="text-gray-600 dark:text-gray-300">Average Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Launch Your Career?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who've landed their dream jobs through TalentConnect
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Start Free Assessment
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Schedule Mock Interview
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            Free assessment • No hidden fees • Instant results
          </p>
        </div>
      </section>
    </div>
  );
}