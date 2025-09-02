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
  Clock,
  Building2,
  CheckCircle,
  Star,
  Filter,
  Eye,
  MessageSquare,
  ChevronRight,
  Shield,
  Lightbulb
} from "lucide-react";

export default function ForCompanies() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Pre-Assessed Talent Pool",
      description: "Access 100K+ students who've completed our rigorous industry-standard assessments",
      benefits: ["No more screening calls", "Verified technical skills", "Consistent evaluation criteria"]
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Precision Matching",
      description: "AI-powered candidate matching based on role requirements and assessment scores",
      benefits: ["95% role compatibility", "Reduced time-to-hire", "Higher retention rates"]
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-600" />,
      title: "Comprehensive Analytics",
      description: "Detailed insights into candidate performance across multiple skill dimensions",
      benefits: ["Technical assessment scores", "Communication evaluation", "Problem-solving ability"]
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Streamlined Hiring",
      description: "Reduce your hiring timeline from months to weeks with pre-qualified candidates",
      benefits: ["50% faster hiring", "Lower cost per hire", "Better candidate experience"]
    }
  ];

  const assessmentCategories = [
    {
      title: "Data Structures & Algorithms",
      description: "Industry-standard coding challenges designed by engineers from FAANG companies",
      assessment: "90-minute evaluation with 15 problems of varying difficulty"
    },
    {
      title: "System Design",
      description: "Real-world architecture problems used in actual company interviews",
      assessment: "60-minute scenarios covering scalability, performance, and design patterns"
    },
    {
      title: "Quantitative Aptitude",
      description: "Logical reasoning and analytical thinking evaluation",
      assessment: "45-minute test with 25 questions covering mathematical and logical reasoning"
    },
    {
      title: "Communication Skills",
      description: "Video-based assessment of English proficiency and presentation skills",
      assessment: "30-minute evaluation with structured responses and scenario-based questions"
    }
  ];

  const companyLogos = [
    "Google", "Microsoft", "Amazon", "Meta", "Netflix", "Apple", "Uber", "Swiggy"
  ];

  const stats = [
    { number: "500+", label: "Companies Trust Us", color: "text-blue-600" },
    { number: "85%", label: "Successful Placements", color: "text-green-600" },
    { number: "50%", label: "Faster Hiring", color: "text-purple-600" },
    { number: "2.5M+", label: "Student Database", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-sm px-4 py-2">
              <Building2 className="w-4 h-4 mr-2" />
              Trusted by 500+ Companies
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Hire Pre-Assessed
            <span className="text-blue-600"> Top Talent</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Skip the screening. Access 100K+ students who've completed rigorous assessments 
            designed by engineers from top product companies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="px-8 py-4 text-lg bg-blue-600 hover:bg-blue-700">
              Browse Candidates Now
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Companies hiring through TalentConnect:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              {companyLogos.map((company) => (
                <span key={company} className="font-bold text-lg">{company}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Quality */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meticulously Designed Assessments
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Created by engineers from top product companies who understand what really matters
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {assessmentCategories.map((category, index) => (
              <Card key={index} className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl mb-3">{category.title}</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {category.description}
                  </p>
                  <Badge variant="secondary" className="w-fit">
                    {category.assessment}
                  </Badge>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Card className="bg-blue-50 border border-blue-200">
              <CardContent className="p-8">
                <Lightbulb className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Designed by Industry Experts
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our assessment framework is created and continuously updated by senior engineers 
                  currently working at top product companies. Every question reflects real-world challenges.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Companies Choose TalentConnect
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
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

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Proven Results for Hiring Teams
            </h2>
            <p className="text-xl opacity-90">
              Data-driven outcomes from 500+ companies
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
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Streamlined Hiring Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              From search to hire in record time
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Filter & Search</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Use advanced filters to find candidates matching your exact requirements
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Review Profiles</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Detailed assessment scores, projects, and academic background
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Shortlist & Compare</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Build your candidate pipeline and compare assessment results
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect & Hire</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Direct contact with candidates through WhatsApp and email
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Hiring Managers Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Priya Sharma</div>
                    <div className="text-sm text-gray-600">Head of Engineering, Swiggy</div>
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
                  "TalentConnect cut our hiring time by 60%. The assessment quality is exceptional."
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Rahul Agarwal</div>
                    <div className="text-sm text-gray-600">CTO, Zomato</div>
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
                  "The pre-assessment saves us countless hours. We only interview qualified candidates now."
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Neha Gupta</div>
                    <div className="text-sm text-gray-600">VP Engineering, Flipkart</div>
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
                  "Quality of candidates is consistently high. Our hiring success rate improved dramatically."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Assessment Deep Dive */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Assessment Framework
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Each candidate undergoes comprehensive evaluation across key competencies
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {assessmentCategories.map((category, index) => (
              <Card key={index} className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
                    {category.title}
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    {category.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-900 dark:text-blue-100">
                        {category.assessment}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Multiple Companies Feature */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Multiple Companies, One Assessment
            </h2>
            <p className="text-xl opacity-90">
              Students are continuously shared with your competitors. Here's why that's good for you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <Users className="w-12 h-12 mb-4" />
                <CardTitle>Higher Quality Pool</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="opacity-90">
                  Only serious candidates take our rigorous assessment, ensuring you get motivated, qualified talent.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <TrendingUp className="w-12 h-12 mb-4" />
                <CardTitle>Competitive Advantage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="opacity-90">
                  Access the same talent pool as top companies. Level the playing field with better hiring processes.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <Zap className="w-12 h-12 mb-4" />
                <CardTitle>Faster Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="opacity-90">
                  Pre-qualified candidates mean faster decision-making and reduced time-to-hire.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Hiring Success Metrics
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Hiring Smarter Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join 500+ companies already using TalentConnect for their engineering recruitment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Browse Candidates Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-75">
            Free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}