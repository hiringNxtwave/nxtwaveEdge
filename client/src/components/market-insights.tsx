import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  MapPin, 
  Building2, 
  Users, 
  DollarSign,
  AlertCircle,
  ChevronRight,
  Info
} from "lucide-react";

interface MarketInsightsProps {
  companyTier?: string;
  companyLocation?: string;
  companySize?: string;
  industry?: string;
}

export default function MarketInsights({ 
  companyTier = "Tier 1", 
  companyLocation = "Bangalore", 
  companySize = "Mid-size", 
  industry = "Technology" 
}: MarketInsightsProps) {

  // Market data based on real Indian job market trends
  const salaryBenchmarks = {
    "Tier 1": {
      range: "₹8-15 LPA",
      average: "₹12 LPA",
      joiningRate: 78,
      trend: "up",
      companies: ["Google", "Microsoft", "Amazon", "Flipkart"]
    },
    "Tier 2": {
      range: "₹5-10 LPA",
      average: "₹7.5 LPA", 
      joiningRate: 65,
      trend: "stable",
      companies: ["Accenture", "TCS", "Infosys", "Cognizant"]
    },
    "Tier 3": {
      range: "₹3-6 LPA",
      average: "₹4.5 LPA",
      joiningRate: 85,
      trend: "up",
      companies: ["Local startups", "Service companies"]
    }
  };

  const locationInsights = {
    "Bangalore": { acceptanceRate: 82, salaryPremium: "+15%", competition: "High" },
    "Hyderabad": { acceptanceRate: 88, salaryPremium: "+8%", competition: "Medium" },
    "Chennai": { acceptanceRate: 85, salaryPremium: "+5%", competition: "Medium" },
    "Pune": { acceptanceRate: 78, salaryPremium: "+12%", competition: "High" },
    "Delhi NCR": { acceptanceRate: 75, salaryPremium: "+18%", competition: "Very High" },
    "Mumbai": { acceptanceRate: 72, salaryPremium: "+22%", competition: "Very High" },
    "Tier 2 Cities": { acceptanceRate: 92, salaryPremium: "-10%", competition: "Low" }
  };

  const sectorBenchmarks = {
    "Technology": { avgSalary: "₹8.5 LPA", growth: "+12%", demand: "Very High" },
    "Banking": { avgSalary: "₹7.2 LPA", growth: "+8%", demand: "High" },
    "Healthcare": { avgSalary: "₹6.8 LPA", growth: "+15%", demand: "High" },
    "Manufacturing": { avgSalary: "₹5.5 LPA", growth: "+5%", demand: "Medium" },
    "Retail": { avgSalary: "₹4.8 LPA", growth: "+7%", demand: "Medium" },
    "Education": { avgSalary: "₹4.2 LPA", growth: "+3%", demand: "Low" }
  };

  const sizeBenchmarks = {
    "1-10": { range: "₹4-7 LPA", average: "₹5.5 LPA", perks: "Equity, Learning" },
    "11-50": { range: "₹5-9 LPA", average: "₹7 LPA", perks: "Growth, Flexibility" },
    "51-200": { range: "₹6-12 LPA", average: "₹9 LPA", perks: "Stability, Benefits" },
    "201-1000": { range: "₹8-15 LPA", average: "₹11.5 LPA", perks: "Brand, Structure" },
    "1000+": { range: "₹10-20 LPA", average: "₹15 LPA", perks: "Prestige, Security" }
  };

  const salaryAcceptanceData = [
    { range: "₹3-5 LPA", acceptance: 95, applications: "Very High" },
    { range: "₹5-7 LPA", acceptance: 88, applications: "High" },
    { range: "₹7-10 LPA", acceptance: 75, applications: "Medium" },
    { range: "₹10-15 LPA", acceptance: 65, applications: "Low" },
    { range: "₹15+ LPA", acceptance: 45, applications: "Very Low" }
  ];

  return (
    <Card data-testid="card-market-insights">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Market Insights
            </CardTitle>
            <CardDescription>
              Salary benchmarks and hiring trends to guide your recruitment strategy
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            <TrendingUp className="h-3 w-3 mr-1" />
            Market Benchmarks
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="salary" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="salary" data-testid="tab-salary">Salary Trends</TabsTrigger>
            <TabsTrigger value="location" data-testid="tab-location">Location Insights</TabsTrigger>
            <TabsTrigger value="competition" data-testid="tab-competition">Competition</TabsTrigger>
            <TabsTrigger value="recommendations" data-testid="tab-recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="salary" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Salary by Company Tier</h4>
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  {Object.entries(salaryBenchmarks).map(([tier, data]) => (
                    <div key={tier} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div>
                        <span className="font-medium text-sm">{tier} Companies</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{data.range}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600">{data.average}</span>
                        <div className="flex items-center gap-1 text-xs">
                          {data.trend === "up" ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-gray-400" />
                          )}
                          <span>{data.joiningRate}% join</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Acceptance by Salary Range</h4>
                  <Target className="h-4 w-4 text-blue-600" />
                </div>
                <div className="space-y-3">
                  {salaryAcceptanceData.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span>{item.range}</span>
                        <span className="font-medium">{item.acceptance}%</span>
                      </div>
                      <Progress value={item.acceptance} className="h-2" />
                      <p className="text-xs text-gray-500">Applications: {item.applications}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Your Industry Benchmark</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {industry} sector average: <strong>{sectorBenchmarks[industry as keyof typeof sectorBenchmarks]?.avgSalary || "₹7.5 LPA"}</strong>
                    <span className="ml-2 text-green-600">
                      {sectorBenchmarks[industry as keyof typeof sectorBenchmarks]?.growth || "+10%"} YoY growth
                    </span>
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Location Acceptance Rates</h4>
                </div>
                <div className="space-y-3">
                  {Object.entries(locationInsights).map(([location, data]) => (
                    <div key={location} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div>
                        <span className="font-medium text-sm">{location}</span>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Competition: {data.competition}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-green-600">{data.acceptanceRate}%</span>
                        <p className="text-xs text-blue-600">{data.salaryPremium}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Location Strategy Guide</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">Tier 2 Cities Advantage</h5>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      92% acceptance rate with 10% lower salary expectations
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <h5 className="font-medium text-orange-800 dark:text-orange-200 mb-1">Metro Premium</h5>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Expect 15-22% salary premium in Mumbai and Delhi NCR
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Your Location: {companyLocation}</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {locationInsights[companyLocation as keyof typeof locationInsights]?.acceptanceRate || "78"}% typical acceptance rate
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="competition" className="space-y-4 mt-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Competitor Analysis</h4>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Tier 1 Companies</span>
                      <Badge variant="destructive">High Competition</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Offering ₹8-15 LPA with 78% joining rate
                    </p>
                    <div className="flex gap-1 text-xs">
                      {salaryBenchmarks["Tier 1"].companies.map((company, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{company}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm">Tier 2 Companies</span>
                      <Badge variant="secondary">Medium Competition</Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      Offering ₹5-10 LPA with 65% joining rate
                    </p>
                    <div className="flex gap-1 text-xs">
                      {salaryBenchmarks["Tier 2"].companies.map((company, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{company}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Market Positioning</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Salary Competitiveness</span>
                      <span className="text-sm font-medium text-green-600">Above Average</span>
                    </div>
                    <Progress value={72} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Brand Recognition</span>
                      <span className="text-sm font-medium text-blue-600">Good</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Location Advantage</span>
                      <span className="text-sm font-medium text-orange-600">Moderate</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 mt-4">
            <div className="grid gap-4">
              <Card className="p-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Recommended Strategy</h4>
                    <div className="space-y-2 text-sm text-green-800 dark:text-green-200">
                      <p>• <strong>Optimal Salary Range:</strong> ₹6-9 LPA for 80%+ acceptance rate</p>
                      <p>• <strong>Target Locations:</strong> Consider Tier 2 cities for cost-effective hiring</p>
                      <p>• <strong>Competition Edge:</strong> Highlight growth opportunities and learning culture</p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Wins</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                      <span>Offer ₹7-8 LPA to match market standards</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                      <span>Target students in Tier 2 cities for better acceptance</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                      <span>Highlight remote work options to expand reach</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Market Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
                      <AlertCircle className="h-4 w-4" />
                      <span>Tech salaries up 12% this quarter</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                      <AlertCircle className="h-4 w-4" />
                      <span>High competition in Bangalore market</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                      <AlertCircle className="h-4 w-4" />
                      <span>Emerging talent pool in Tier 2 cities</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Data updated: Today • Based on 50,000+ placements across India
            </p>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800" data-testid="button-view-detailed-report">
              View Detailed Report
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}