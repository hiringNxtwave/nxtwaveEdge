import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, GraduationCap, Building, Target, BarChart3, AlertCircle, CheckCircle, Clock, Award } from "lucide-react";

interface MarketIntelligenceProps {
  className?: string;
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

export default function MarketIntelligence({ className }: MarketIntelligenceProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            📊 Market Intelligence
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Based on 2025 Talent Report
            </Badge>
          </h2>
          <p className="text-gray-600 mt-1">
            Stay ahead with competitive hiring insights and market trends
          </p>
        </div>
      </div>

      {/* Salary Trends Overview */}
      <Card className="border-l-4 border-l-green-500" data-testid="card-salary-trends">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            Salary Trends & Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {marketData.salaryTrends.byExperience.map((level, idx) => (
              <div key={idx} className="bg-green-50 border border-green-100 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-1">{level.level}</div>
                <div className="text-xl font-bold text-green-600 mb-1">₹{level.median} LPA</div>
                <div className="text-xs text-green-700 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {level.change} growth
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
              <BarChart3 className="w-4 h-4" />
              Overall Market Growth: {marketData.salaryTrends.overall.change} {marketData.salaryTrends.overall.period}
            </div>
            <p className="text-sm text-green-700">
              💡 <strong>Insight:</strong> Tech salaries continue strong upward trend driven by digital transformation and skill shortages
            </p>
          </div>
        </CardContent>
      </Card>

      {/* College-wise Expectations */}
      <Card className="border-l-4 border-l-blue-500" data-testid="card-college-expectations">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-600">
            <GraduationCap className="w-5 h-5" />
            College-wise Salary Expectations & Joining Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketData.collegeExpectations.map((college, idx) => (
              <div key={idx} className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{college.name}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      parseFloat(college.joiningRate) >= 90 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {college.joiningRate} join rate
                  </Badge>
                </div>
                <div className="text-lg font-bold text-blue-600 mb-1">₹{college.avgExpected}</div>
                <p className="text-xs text-blue-700">Average expected salary range</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800 font-semibold mb-2">
              <Target className="w-4 h-4" />
              Strategic Recommendation
            </div>
            <p className="text-sm text-blue-700">
              💼 Premier institutes (IITs/BITS) command 50-80% salary premiums. Consider offering competitive packages or focus on tier-2 institutions for better cost-effectiveness.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <Card className="border-l-4 border-l-purple-500" data-testid="card-competitor-analysis">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <Building className="w-5 h-5" />
            Competitor Hiring Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {marketData.competitorHiring.map((competitor, idx) => (
              <div key={idx} className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-800 text-lg">{competitor.company}</h4>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-purple-600">{competitor.positions}</div>
                    <div className="text-xs text-gray-600">positions planned</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Focus Areas</div>
                    <div className="flex flex-wrap gap-1">
                      {competitor.focusAreas.map((area, areaIdx) => (
                        <Badge key={areaIdx} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600 mb-1">Average Offer</div>
                    <div className="text-lg font-bold text-purple-600">₹{competitor.avgOffer}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills Premium Analysis */}
      <Card className="border-l-4 border-l-orange-500" data-testid="card-skills-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <Award className="w-5 h-5" />
            Skills Premium & Market Demand
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.skillDemand.map((skill, idx) => (
              <div key={idx} className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{skill.skill}</h4>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      skill.demand === 'Extremely High' ? 'bg-red-100 text-red-800' :
                      skill.demand === 'Very High' ? 'bg-orange-100 text-orange-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {skill.demand}
                  </Badge>
                </div>
                <div className="text-lg font-bold text-orange-600">{skill.salaryPremium}</div>
                <p className="text-xs text-orange-700">salary premium</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Factors */}
      <Card className="border-l-4 border-l-indigo-500" data-testid="card-location-factors">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600">
            <DollarSign className="w-5 h-5" />
            Location-based Salary Multipliers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketData.locationFactors.map((location, idx) => (
              <div key={idx} className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">{location.city}</h4>
                  <div className="text-lg font-bold text-indigo-600">{location.multiplier}</div>
                </div>
                <p className="text-xs text-indigo-700">{location.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-indigo-800 font-semibold mb-2">
              <AlertCircle className="w-4 h-4" />
              Location Strategy Tip
            </div>
            <p className="text-sm text-indigo-700">
              🌍 Consider remote/hybrid options to access talent from cost-competitive locations while maintaining quality. Bangalore commands highest premiums but offers largest talent pool.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}