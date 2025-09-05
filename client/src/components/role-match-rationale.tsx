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

  // Calculate specific assessment scores
  const quantitativeScore = aptitudeScore * 20;
  const verbalScore = generateSkillScore(5) * 20;
  const dsaAssessmentScore = dsaScore * 20;
  const interviewScore = generateSkillScore(6) * 20;
  const englishSpeakingScore = generateSkillScore(7) * 20;

  // Assessment sections with gradient colors
  const assessmentSections = [
    {
      name: "Quantitative & Aptitude",
      score: quantitativeScore,
      description: quantitativeScore >= 80 ? "Exceptional mathematical reasoning" : quantitativeScore >= 60 ? "Good analytical skills" : "Basic problem solving"
    },
    {
      name: "Verbal Ability",
      score: verbalScore,
      description: verbalScore >= 80 ? "Strong written communication" : verbalScore >= 60 ? "Clear expression" : "Developing writing skills"
    },
    {
      name: "DSA Assessments",
      score: dsaAssessmentScore,
      description: dsaAssessmentScore >= 80 ? "Advanced coding proficiency" : dsaAssessmentScore >= 60 ? "Solid technical foundation" : "Learning programming concepts"
    },
    {
      name: "Interview Performance",
      score: interviewScore,
      description: interviewScore >= 80 ? "Confident presentation" : interviewScore >= 60 ? "Good interaction skills" : "Improving interview skills"
    },
    {
      name: "English Speaking",
      score: englishSpeakingScore,
      description: englishSpeakingScore >= 80 ? "Fluent communication" : englishSpeakingScore >= 60 ? "Clear verbal skills" : "Developing speaking ability"
    }
  ];

  // Generate hiring insights focused on decision-making
  const hiringInsights: HiringInsight[] = assessmentSections.slice(0, 3).map(section => ({
    category: section.name,
    score: section.score,
    strength: section.description,
    risk: section.score < 50 ? `Low ${section.name.toLowerCase()} performance` : undefined,
    recommendation: section.score >= 80 ? "Strong performer" : section.score >= 60 ? "Good fit" : "Needs development"
  }));

  const overallRecommendation = matchPercentage >= 85 ? "Strong Hire" : 
                                matchPercentage >= 70 ? "Hire with Confidence" : 
                                "Consider with Support Plan";
  
  const riskFactors = hiringInsights.filter(insight => insight.risk).map(insight => insight.risk).filter(Boolean);
  const keyStrengths = hiringInsights.filter(insight => insight.score >= 80).map(insight => insight.strength);

  // Function to get gradient color based on score
  const getGradientClass = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-green-100 to-green-200 border-green-300 text-green-800";
    if (score >= 60) return "bg-gradient-to-r from-yellow-100 to-green-100 border-yellow-300 text-yellow-800";
    if (score >= 40) return "bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-300 text-orange-800";
    return "bg-gradient-to-r from-red-100 to-orange-100 border-red-300 text-red-800";
  };

  const getScoreLevel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

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

          {/* Assessment Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-600" />
                Assessment Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 gap-3">
                {assessmentSections.map((section, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-2 ${getGradientClass(section.score)} transition-all hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{section.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-white/70 text-gray-700">
                          {getScoreLevel(section.score)}
                        </Badge>
                        <span className="text-lg font-bold">
                          {Math.round(section.score)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-2 mb-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-current to-current opacity-80"
                        style={{ width: `${Math.min(section.score, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs opacity-90">{section.description}</p>
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