import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Brain, 
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Zap
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";

interface RoleMatchRationaleProps {
  student: StudentWithSkills;
  matchPercentage: number;
  onClose: () => void;
}

interface HiringInsight {
  category: string;
  score: number;
  strength: string;
  risk?: string;
  recommendation: string;
}

export default function RoleMatchRationale({ student, matchPercentage, onClose }: RoleMatchRationaleProps) {
  // Calculate individual assessment scores (same logic as student card)
  const seed = parseInt(student.id.slice(-8), 16);
  const generateSkillScore = (offset: number) => {
    const baseScore = student.codingRating || 4;
    const variation = ((seed * 37 + offset) % 3) - 1;
    return Math.max(1, Math.min(5, baseScore + variation));
  };
  
  const dsaScore = generateSkillScore(1);
  const aptitudeScore = generateSkillScore(2); 
  const communicationScore = generateSkillScore(3);
  const systemDesignScore = generateSkillScore(4);
  const cgpaValue = typeof student.cgpa === 'string' ? parseFloat(student.cgpa) : student.cgpa || 7.5;

  // Generate hiring insights focused on decision-making
  const hiringInsights: HiringInsight[] = [
    {
      category: "Technical Skills",
      score: dsaScore * 20,
      strength: dsaScore >= 4 ? "Strong algorithmic thinking" : dsaScore >= 3 ? "Solid programming fundamentals" : "Basic coding ability",
      risk: dsaScore < 3 ? "May need technical mentoring" : undefined,
      recommendation: dsaScore >= 4 ? "Ready for complex projects" : dsaScore >= 3 ? "Good for mid-level tasks" : "Consider for junior role with support"
    },
    {
      category: "Communication",
      score: communicationScore * 20,
      strength: communicationScore >= 4 ? "Excellent stakeholder interaction" : communicationScore >= 3 ? "Clear technical communication" : "Basic communication skills",
      risk: communicationScore < 3 ? "May struggle with client-facing roles" : undefined,
      recommendation: communicationScore >= 4 ? "Suitable for leadership roles" : communicationScore >= 3 ? "Good for team collaboration" : "Better for individual contributor roles"
    },
    {
      category: "Problem Solving",
      score: aptitudeScore * 20,
      strength: aptitudeScore >= 4 ? "Exceptional analytical thinking" : aptitudeScore >= 3 ? "Good logical reasoning" : "Standard problem-solving",
      recommendation: aptitudeScore >= 4 ? "Can handle complex business logic" : aptitudeScore >= 3 ? "Suitable for structured problems" : "Works well with clear requirements"
    }
  ];

  const overallRecommendation = matchPercentage >= 85 ? "Strong Hire" : 
                                matchPercentage >= 70 ? "Hire with Confidence" : 
                                "Consider with Support Plan";
  
  const riskFactors = hiringInsights.filter(insight => insight.risk).map(insight => insight.risk).filter(Boolean);
  const keyStrengths = hiringInsights.filter(insight => insight.score >= 80).map(insight => insight.strength);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Hiring Decision for {student.firstName} {student.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overall Recommendation */}
          <Card className={`border-l-4 ${
            matchPercentage >= 85 ? 'border-l-green-500 bg-green-50' :
            matchPercentage >= 70 ? 'border-l-blue-500 bg-blue-50' : 
            'border-l-yellow-500 bg-yellow-50'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{overallRecommendation}</h3>
                  <p className="text-sm text-gray-600">Match Score: {matchPercentage}%</p>
                </div>
                <div className="text-right">
                  {matchPercentage >= 85 ? (
                    <ThumbsUp className="w-8 h-8 text-green-600" />
                  ) : matchPercentage >= 70 ? (
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-yellow-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Strengths */}
          {keyStrengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {keyStrengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Risk Factors */}
          {riskFactors.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  Consider These Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {riskFactors.map((risk, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Specific Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-600" />
                Specific Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {hiringInsights.map((insight, index) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-sm">{insight.category}</h4>
                      <Badge variant="outline" className="text-xs">
                        {insight.score}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{insight.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">{Math.round((dsaScore + aptitudeScore + communicationScore) / 3 * 20)}%</div>
              <div className="text-xs text-gray-500">Skill Average</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{cgpaValue?.toFixed(1)}</div>
              <div className="text-xs text-gray-500">CGPA</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">{Math.floor(seed % 100 + 20)}d</div>
              <div className="text-xs text-gray-500">Time to Hire</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}