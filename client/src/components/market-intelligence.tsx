import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, DollarSign, Users, GraduationCap, Building, Target, BarChart3, AlertCircle, CheckCircle, Clock, Award } from "lucide-react";

interface MarketIntelligenceProps {
  className?: string;
  compact?: boolean;
}

// Market data that would typically come from parsing the PDF report
const marketData = {
  salaryTrends: {
    overall: { change: "+12%", period: "YoY 2024-25" },
    byExperience: [
      { level: "Fresher (0-1 years)", median: "4.5-8.0", change: "+15%" },
      { level: "Junior (1-3 years)", median: "8.0-15.0", change: "+12%" },
      { level: "Mid-level (3-5 years)", median: "15.0-25.0", change: "+10%" },
      { level: "Senior (5+ years)", median: "25.0-45.0", change: "+8%" }
    ]
  },
  collegeExpectations: [
    { name: "IIT Delhi", avgExpected: "18-25 LPA", joiningRate: "92%" },
    { name: "IIT Bombay", avgExpected: "18-24 LPA", joiningRate: "94%" },
    { name: "BITS Pilani", avgExpected: "12-18 LPA", joiningRate: "87%" },
    { name: "NIT Trichy", avgExpected: "10-16 LPA", joiningRate: "89%" },
    { name: "IIIT Hyderabad", avgExpected: "14-20 LPA", joiningRate: "91%" },
    { name: "DTU Delhi", avgExpected: "8-14 LPA", joiningRate: "85%" }
  ],
  competitorHiring: [
    { company: "TCS", positions: "12,000+", focusAreas: ["Full-stack", "Cloud", "AI/ML"], avgOffer: "4.5-7.0 LPA" },
    { company: "Infosys", positions: "8,500+", focusAreas: ["Digital transformation", "Cloud"], avgOffer: "5.0-8.0 LPA" },
    { company: "Wipro", positions: "6,200+", focusAreas: ["Cloud", "Data Analytics"], avgOffer: "4.8-7.5 LPA" },
    { company: "Accenture", positions: "4,800+", focusAreas: ["Consulting", "Cloud", "AI"], avgOffer: "6.0-9.0 LPA" },
    { company: "HCL Tech", positions: "5,500+", focusAreas: ["Cloud", "Cybersecurity"], avgOffer: "5.2-8.2 LPA" }
  ],
  skillDemand: [
    { skill: "React/Node.js", demand: "Very High", salaryPremium: "+20%" },
    { skill: "Python/Django", demand: "High", salaryPremium: "+15%" },
    { skill: "Java/Spring", demand: "High", salaryPremium: "+12%" },
    { skill: "Cloud (AWS/Azure)", demand: "Very High", salaryPremium: "+25%" },
    { skill: "AI/ML", demand: "Extremely High", salaryPremium: "+35%" },
    { skill: "DevOps", demand: "High", salaryPremium: "+18%" }
  ],
  locationFactors: [
    { city: "Bangalore", multiplier: "1.2x", note: "Tech hub premium" },
    { city: "Hyderabad", multiplier: "1.1x", note: "Growing tech center" },
    { city: "Pune", multiplier: "1.0x", note: "Balanced market" },
    { city: "Chennai", multiplier: "0.95x", note: "Cost competitive" },
    { city: "NCR Delhi", multiplier: "1.15x", note: "Corporate premium" },
    { city: "Mumbai", multiplier: "1.25x", note: "Financial sector premium" }
  ]
};

export default function MarketIntelligence({ className, compact }: MarketIntelligenceProps) {
  if (compact) {
    return (
      <div className={`space-y-2 ${className ?? ""}`}>
        {marketData.salaryTrends.byExperience.map((row) => (
          <div key={row.level} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
            <span className="text-xs text-slate-600 truncate flex-1">{row.level}</span>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <span className="text-xs font-semibold text-slate-800">₹{row.median}L</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{row.change}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-6 px-4 md:px-0 ${className ?? ""}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span>📊 Market Intelligence</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs md:text-sm w-fit">
              Based on 2025 Talent Report
            </Badge>
          </h2>
          <p className="text-sm md:text-base text-gray-600 mt-2">
            Stay ahead with competitive hiring insights and market trends
          </p>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="salary-trends" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1" data-testid="tabs-market-intelligence">
          <TabsTrigger value="salary-trends" className="text-xs md:text-sm p-2 md:p-3" data-testid="tab-salary-trends">
            <TrendingUp className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Salary</span>
            <span className="sm:hidden">💰</span>
          </TabsTrigger>
          <TabsTrigger value="college-expectations" className="text-xs md:text-sm p-2 md:p-3" data-testid="tab-college-expectations">
            <GraduationCap className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Colleges</span>
            <span className="sm:hidden">🎓</span>
          </TabsTrigger>
          <TabsTrigger value="competitors" className="text-xs md:text-sm p-2 md:p-3" data-testid="tab-competitors">
            <Building className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Competitors</span>
            <span className="sm:hidden">🏢</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-xs md:text-sm p-2 md:p-3" data-testid="tab-skills">
            <Award className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Skills</span>
            <span className="sm:hidden">🏆</span>
          </TabsTrigger>
          <TabsTrigger value="locations" className="text-xs md:text-sm p-2 md:p-3" data-testid="tab-locations">
            <DollarSign className="w-4 h-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Locations</span>
            <span className="sm:hidden">📍</span>
          </TabsTrigger>
        </TabsList>

        {/* Salary Trends Tab */}
        <TabsContent value="salary-trends" className="space-y-4 mt-6">

          <Card className="border-l-4 border-l-green-500" data-testid="card-salary-trends">
            <CardHeader className="p-3 md:p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-green-600 text-lg md:text-xl">
                <TrendingUp className="w-5 h-5" />
                Salary Trends & Market Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6">
                {marketData.salaryTrends.byExperience.map((level, idx) => (
                  <div key={idx} className="bg-green-50 border border-green-100 rounded-lg p-3 md:p-4 lg:p-5 min-h-[100px] flex flex-col justify-between">
                    <div className="text-xs md:text-sm font-medium text-gray-700 mb-1 leading-tight">{level.level}</div>
                    <div className="text-lg md:text-xl font-bold text-green-600 mb-1">₹{level.median} LPA</div>
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 flex-shrink-0" />
                      <span>{level.change} growth</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-green-50 border border-green-100 rounded-lg p-3 md:p-4 lg:p-5">
                <div className="flex items-start md:items-center gap-2 text-green-600 font-semibold mb-2">
                  <BarChart3 className="w-4 h-4 flex-shrink-0 mt-0.5 md:mt-0" />
                  <span className="text-sm md:text-base leading-tight">
                    Overall Market Growth: {marketData.salaryTrends.overall.change} {marketData.salaryTrends.overall.period}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-green-600 leading-relaxed">
                  💡 <strong>Insight:</strong> Tech salaries continue strong upward trend driven by digital transformation and skill shortages
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* College Expectations Tab */}
        <TabsContent value="college-expectations" className="space-y-4 mt-6">

          <Card className="border-l-4 border-l-blue-500" data-testid="card-college-expectations">
            <CardHeader className="p-3 md:p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-blue-600 text-lg md:text-xl">
                <GraduationCap className="w-5 h-5" />
                College-wise Salary Expectations & Joining Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-6">
                {marketData.collegeExpectations.map((college, idx) => (
                  <div key={idx} className="bg-blue-50 border border-blue-100 rounded-lg p-3 md:p-4 lg:p-5 min-h-[120px]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm md:text-base">{college.name}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs w-fit ${
                          parseFloat(college.joiningRate) >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {college.joiningRate} join rate
                      </Badge>
                    </div>
                    <div className="text-lg md:text-xl font-bold text-blue-600 mb-1">₹{college.avgExpected}</div>
                    <p className="text-xs md:text-sm text-blue-600">Average expected salary range</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-3 md:p-4 lg:p-5">
                <div className="flex items-start md:items-center gap-2 text-blue-600 font-semibold mb-2">
                  <Target className="w-4 h-4 flex-shrink-0 mt-0.5 md:mt-0" />
                  <span className="text-sm md:text-base">Strategic Recommendation</span>
                </div>
                <p className="text-xs md:text-sm text-blue-600 leading-relaxed">
                  💼 Premier institutes (IITs/BITS) command 50-80% salary premiums. Consider offering competitive packages or focus on tier-2 institutions for better cost-effectiveness.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitors Tab */}
        <TabsContent value="competitors" className="space-y-4 mt-6">

          <Card className="border-l-4 border-l-purple-500" data-testid="card-competitor-analysis">
            <CardHeader className="p-3 md:p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-purple-600 text-lg md:text-xl">
                <Building className="w-5 h-5" />
                Competitor Hiring Patterns
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 lg:p-6">
              <div className="space-y-3 md:space-y-4">
                {marketData.competitorHiring.map((competitor, idx) => (
                  <div key={idx} className="bg-purple-50 border border-purple-100 rounded-lg p-3 md:p-4 lg:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                      <h4 className="font-bold text-gray-800 text-base md:text-lg">{competitor.company}</h4>
                      <div className="text-left sm:text-right">
                        <div className="text-sm font-semibold text-purple-600">{competitor.positions}</div>
                        <div className="text-xs text-gray-600">positions planned</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div className="order-2 sm:order-1">
                        <div className="text-xs font-medium text-gray-600 mb-2">Focus Areas</div>
                        <div className="flex flex-wrap gap-1">
                          {competitor.focusAreas.map((area, areaIdx) => (
                            <Badge key={areaIdx} variant="outline" className="text-xs min-h-[32px] px-2">
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="order-1 sm:order-2">
                        <div className="text-xs font-medium text-gray-600 mb-1">Average Offer</div>
                        <div className="text-lg md:text-xl font-bold text-purple-600">₹{competitor.avgOffer}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-4 mt-6">

          <Card className="border-l-4 border-l-orange-500" data-testid="card-skills-premium">
            <CardHeader className="p-3 md:p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-orange-600 text-lg md:text-xl">
                <Award className="w-5 h-5" />
                Skills Premium & Market Demand
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                {marketData.skillDemand.map((skill, idx) => (
                  <div key={idx} className="bg-orange-50 border border-orange-100 rounded-lg p-3 md:p-4 lg:p-5 min-h-[110px]">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm md:text-base leading-tight">{skill.skill}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs w-fit min-h-[24px] ${
                          skill.demand === 'Extremely High' ? 'bg-red-100 text-red-800' :
                          skill.demand === 'Very High' ? 'bg-orange-100 text-orange-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {skill.demand}
                      </Badge>
                    </div>
                    <div className="text-lg md:text-xl font-bold text-orange-600">{skill.salaryPremium}</div>
                    <p className="text-xs md:text-sm text-orange-600">salary premium</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations" className="space-y-4 mt-6">

          <Card className="border-l-4 border-l-indigo-500" data-testid="card-location-factors">
            <CardHeader className="p-3 md:p-4 lg:p-6">
              <CardTitle className="flex items-center gap-2 text-indigo-600 text-lg md:text-xl">
                <DollarSign className="w-5 h-5" />
                Location-based Salary Multipliers
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 lg:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                {marketData.locationFactors.map((location, idx) => (
                  <div key={idx} className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 md:p-4 lg:p-5 min-h-[90px]">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm md:text-base">{location.city}</h4>
                      <div className="text-lg md:text-xl font-bold text-indigo-600">{location.multiplier}</div>
                    </div>
                    <p className="text-xs md:text-sm text-indigo-600 leading-relaxed">{location.note}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3 md:p-4 lg:p-5">
                <div className="flex items-start md:items-center gap-2 text-indigo-600 font-semibold mb-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 md:mt-0" />
                  <span className="text-sm md:text-base">Location Strategy Tip</span>
                </div>
                <p className="text-xs md:text-sm text-indigo-600 leading-relaxed">
                  🌍 Consider remote/hybrid options to access talent from cost-competitive locations while maintaining quality. Bangalore commands highest premiums but offers largest talent pool.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}