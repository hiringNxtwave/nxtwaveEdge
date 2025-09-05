import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Clock, DollarSign, AlertTriangle, Users, Target, Calendar, Zap } from "lucide-react";

interface PredictiveInsightsProps {
  shortlistedCount: number;
  role: string;
  location: string;
  salaryRange: { min: number; max: number };
  urgency: 'low' | 'medium' | 'high';
}

export default function PredictiveInsights({ 
  shortlistedCount, 
  role, 
  location, 
  salaryRange,
  urgency = 'medium'
}: PredictiveInsightsProps) {
  
  // Calculate OJR (Offer-to-Join Ratio) based on various factors
  const baseOJR = 0.65; // Base 65% join rate
  const locationMultiplier = location.toLowerCase().includes('bangalore') ? 1.1 : 
                           location.toLowerCase().includes('mumbai') ? 1.05 : 
                           location.toLowerCase().includes('delhi') ? 1.0 : 0.95;
  
  const salaryMultiplier = salaryRange.min >= 12 ? 1.15 : 
                          salaryRange.min >= 8 ? 1.05 : 
                          salaryRange.min >= 5 ? 1.0 : 0.9;
  
  const urgencyMultiplier = urgency === 'high' ? 0.9 : urgency === 'medium' ? 1.0 : 1.05;
  
  const predictedOJR = Math.min(0.85, Math.max(0.45, baseOJR * locationMultiplier * salaryMultiplier * urgencyMultiplier));
  const expectedJoins = Math.round(shortlistedCount * predictedOJR);
  
  // Time to fill calculation
  const baseTimeToFill = urgency === 'high' ? 18 : urgency === 'medium' ? 25 : 35;
  const adjustedTimeToFill = Math.max(15, baseTimeToFill + (shortlistedCount > 50 ? -5 : shortlistedCount < 20 ? 5 : 0));

  // Market insights
  const marketSalary = Math.floor(salaryRange.min * 1.2);
  const salaryGap = marketSalary - salaryRange.max;
  const needsAdjustment = salaryGap > 1;

  // Drop-off insights
  const commonDropOffReasons = [
    { reason: "Better offer received", percentage: 35, trend: "stable" },
    { reason: "Location mismatch", percentage: 20, trend: "increasing" },
    { reason: "Role expectations gap", percentage: 18, trend: "stable" },
    { reason: "Salary expectations", percentage: 15, trend: "decreasing" },
    { reason: "Company culture fit", percentage: 12, trend: "stable" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Offer-to-Join Simulator */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="w-5 h-5 text-blue-600" />
            Offer-to-Join Simulator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Shortlisted Candidates</span>
              <span className="font-bold text-lg">{shortlistedCount}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">Predicted OJR</span>
              <Badge className={`${predictedOJR >= 0.7 ? 'bg-green-100 text-green-800' : 
                                predictedOJR >= 0.6 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-orange-100 text-orange-800'}`}>
                {Math.round(predictedOJR * 100)}%
              </Badge>
            </div>

            <Progress value={predictedOJR * 100} className="h-3" />

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-800 dark:text-blue-200">Expected Joins</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-1">{expectedJoins}</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                candidates likely to join
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Location Factor:</span>
                <span className={locationMultiplier > 1 ? 'text-green-600' : 'text-gray-600'}>
                  {locationMultiplier > 1 ? '+' : ''}{Math.round((locationMultiplier - 1) * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Salary Factor:</span>
                <span className={salaryMultiplier > 1 ? 'text-green-600' : 'text-gray-600'}>
                  {salaryMultiplier > 1 ? '+' : ''}{Math.round((salaryMultiplier - 1) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time-to-Fill Calculator */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-green-600" />
            Time-to-Fill Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{adjustedTimeToFill}</div>
              <div className="text-sm text-green-600 dark:text-green-400">days to close this role</div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Screening & Interviews</span>
                <span className="font-medium">12-15 days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Offer Process</span>
                <span className="font-medium">3-5 days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Decision & Onboarding</span>
                <span className="font-medium">7-12 days</span>
              </div>
            </div>

            <div className="pt-3 border-t">
              <Badge className={`w-full justify-center ${
                urgency === 'high' ? 'bg-red-100 text-red-800' :
                urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                <Calendar className="w-4 h-4 mr-1" />
                {urgency.toUpperCase()} URGENCY ROLE
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mismatch Nudges */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Optimization Nudges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {needsAdjustment && (
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-orange-600" />
                  <span className="font-bold text-orange-800 dark:text-orange-200">Salary Adjustment Needed</span>
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                  Your comp band is ₹{salaryGap} LPA below market rate
                </div>
                <div className="text-xs text-orange-600 dark:text-orange-400 mb-3">
                  Market rate: ₹{marketSalary} LPA • Your max: ₹{salaryRange.max} LPA
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +25% OJR if adjusted to market
                </Badge>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-800 dark:text-blue-200">Quick Wins</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-blue-700 dark:text-blue-300">
                  • Highlight remote/hybrid flexibility for +15% acceptance
                </div>
                <div className="text-blue-700 dark:text-blue-300">
                  • Fast-track top 3 candidates to reduce drop-off
                </div>
                <div className="text-blue-700 dark:text-blue-300">
                  • Mention learning opportunities for fresher appeal
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drop-Off Insights */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Drop-Off Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commonDropOffReasons.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.reason}
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div 
                      className="bg-purple-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-3 text-right">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {item.percentage}%
                  </div>
                  <Badge 
                    className={`text-xs ${
                      item.trend === 'increasing' ? 'bg-red-100 text-red-700' :
                      item.trend === 'decreasing' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {item.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Recommendation:</strong> Address salary expectations early in the process and clarify remote work policy to reduce top drop-off reasons.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}