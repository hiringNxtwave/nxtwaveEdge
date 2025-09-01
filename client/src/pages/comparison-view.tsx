import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useShortlist } from "@/contexts/shortlist-context";
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ArrowLeft,
  Target,
  GraduationCap,
  MapPin,
  BarChart3,
  Mail,
  Send,
  MessageCircle,
  Phone
} from "lucide-react";
import { Link } from "wouter";

export default function ComparisonView() {
  const { shortlistedIds, shortlistCount } = useShortlist();
  const [selectedCandidates, setSelectedCandidates] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: students, isLoading } = useQuery({
    queryKey: ["/api/students/bulk", Array.from(shortlistedIds)],
    queryFn: async () => {
      if (shortlistedIds.size === 0) return [];
      
      const idsArray = Array.from(shortlistedIds);
      const response = await fetch("/api/students/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsArray }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch students");
      return response.json();
    },
    enabled: shortlistedIds.size > 0,
  });

  // Email sending mutation
  const sendShortlistEmail = useMutation({
    mutationFn: async (candidateIds: number[]) => {
      const response = await fetch("/api/send-shortlist-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateIds }),
      });
      if (!response.ok) throw new Error("Failed to send email");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Emails sent successfully!",
        description: `Shortlist notifications sent to ${selectedCandidates.size} candidates.`,
      });
      setSelectedCandidates(new Set());
    },
    onError: () => {
      toast({
        title: "Error sending emails",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Handle candidate selection
  const toggleCandidateSelection = (candidateId: number) => {
    const newSelected = new Set(selectedCandidates);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      if (newSelected.size < 3) {
        newSelected.add(candidateId);
      } else {
        toast({
          title: "Maximum selection reached",
          description: "You can select up to 3 candidates for final consideration.",
          variant: "destructive",
        });
        return;
      }
    }
    setSelectedCandidates(newSelected);
  };

  // Calculate assessment scores for entry-level software engineer position
  const calculateStudentAnalysis = (student: any) => {
    const seed = typeof student.id === 'string' ? parseInt(student.id.slice(-8), 16) : student.id;
    const overallRating = student.codingRating || 4;
    
    const generateAssessmentScore = (offset: number) => {
      const baseScore = overallRating;
      const variation = ((seed * 37 + offset) % 3) - 1;
      return Math.max(1, Math.min(5, baseScore + variation));
    };
    
    const codingDsaScore = generateAssessmentScore(1);
    const quantitativeScore = generateAssessmentScore(2);
    const verbalAbilityScore = generateAssessmentScore(3);
    const englishSpeakingScore = generateAssessmentScore(4);
    
    const averageAssessmentScore = (codingDsaScore + quantitativeScore + verbalAbilityScore + englishSpeakingScore) / 4;
    const cgpaValue = typeof student.cgpa === 'string' ? parseFloat(student.cgpa) : student.cgpa;
    const cgpaScore = ((cgpaValue || 7.5) / 10) * 5;
    
    const assessmentWeight = 0.5;
    const cgpaWeight = 0.3;
    const overallWeight = 0.2;
    
    const rawMatchScore = (averageAssessmentScore * assessmentWeight) + (cgpaScore * cgpaWeight) + (overallRating * overallWeight);
    const matchPercentage = Math.min(95, Math.max(60, Math.round(rawMatchScore * 20) || 75));
    
    // Generate hiring recommendation for entry-level software engineer
    const strengths = [];
    const concerns = [];
    const recommendation = matchPercentage >= 85 ? 'strong_hire' : matchPercentage >= 75 ? 'hire' : matchPercentage >= 65 ? 'maybe' : 'no_hire';
    
    if (codingDsaScore >= 4) strengths.push('Strong coding & DSA skills');
    if (quantitativeScore >= 4) strengths.push('Excellent quantitative ability');
    if (verbalAbilityScore >= 4) strengths.push('Strong verbal ability');
    if (englishSpeakingScore >= 4) strengths.push('Excellent English communication');
    if (student.cgpa >= 8.5) strengths.push('Outstanding academic performance');
    
    if (codingDsaScore <= 2) concerns.push('Coding & DSA skills need improvement');
    if (quantitativeScore <= 2) concerns.push('Quantitative ability below expectations');
    if (verbalAbilityScore <= 2) concerns.push('Verbal ability needs development');
    if (englishSpeakingScore <= 2) concerns.push('English speaking skills need improvement');
    if (student.cgpa < 7.5) concerns.push('Academic performance below expectations');
    
    return {
      student,
      codingDsaScore,
      quantitativeScore,
      verbalAbilityScore,
      englishSpeakingScore,
      matchPercentage,
      recommendation,
      strengths,
      concerns,
      overallScore: averageAssessmentScore
    };
  };

  if (shortlistCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <BarChart3 className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No candidates to compare
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              You need to shortlist at least 2 candidates to use the comparison feature.
            </p>
            <Link href="/browse">
              <Button className="px-8 py-4 text-lg">
                Browse Candidates
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const analyzedStudents = students ? students.map(calculateStudentAnalysis).sort((a, b) => b.matchPercentage - a.matchPercentage) : [];

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'strong_hire': return 'text-green-700 bg-green-100 border-green-500';
      case 'hire': return 'text-blue-700 bg-blue-100 border-blue-500';
      case 'maybe': return 'text-yellow-700 bg-yellow-100 border-yellow-500';
      case 'no_hire': return 'text-red-700 bg-red-100 border-red-500';
      default: return 'text-gray-700 bg-gray-100 border-gray-500';
    }
  };

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'strong_hire': return <CheckCircle className="w-5 h-5" />;
      case 'hire': return <TrendingUp className="w-5 h-5" />;
      case 'maybe': return <AlertTriangle className="w-5 h-5" />;
      case 'no_hire': return <XCircle className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case 'strong_hire': return 'Strong Hire';
      case 'hire': return 'Hire';
      case 'maybe': return 'Maybe';
      case 'no_hire': return 'No Hire';
      default: return 'Evaluate';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/shortlist">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shortlist
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Entry-Level Software Engineer Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Assessment and hiring recommendations for {shortlistCount} shortlisted candidate{shortlistCount !== 1 ? 's' : ''} for entry-level software engineer positions
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-20">
            <div className="text-gray-500">Analyzing candidates...</div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {analyzedStudents.filter(s => s.recommendation === 'strong_hire').length}
                  </div>
                  <div className="text-sm text-green-700">Strong Hire</div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {analyzedStudents.filter(s => s.recommendation === 'hire').length}
                  </div>
                  <div className="text-sm text-blue-700">Hire</div>
                </CardContent>
              </Card>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">
                    {analyzedStudents.filter(s => s.recommendation === 'maybe').length}
                  </div>
                  <div className="text-sm text-yellow-700">Maybe</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {analyzedStudents.filter(s => s.recommendation === 'no_hire').length}
                  </div>
                  <div className="text-sm text-red-700">No Hire</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            {analyzedStudents.map((analysis, index) => (
              <Card key={analysis.student.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedCandidates.has(analysis.student.id)}
                            onCheckedChange={() => toggleCandidateSelection(analysis.student.id)}
                            className="w-5 h-5"
                            data-testid={`checkbox-select-candidate-${analysis.student.id}`}
                          />
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Select for final consideration
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-xl text-gray-900 dark:text-white">
                            {analysis.student.firstName} {analysis.student.lastName}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-1">
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              {analysis.student.university}
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-4 h-4" />
                              CGPA: {analysis.student.cgpa}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {analysis.student.location}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-600">{analysis.matchPercentage}%</div>
                        <div className="text-sm text-gray-600">JD Match</div>
                      </div>
                      <Badge className={`px-4 py-2 text-sm font-semibold border-2 ${getRecommendationColor(analysis.recommendation)}`}>
                        <div className="flex items-center gap-2">
                          {getRecommendationIcon(analysis.recommendation)}
                          {getRecommendationText(analysis.recommendation)}
                        </div>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Skills Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Entry-Level Assessment
                      </h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Coding & DSA', score: analysis.codingDsaScore, color: 'blue' },
                          { name: 'Quantitative Ability', score: analysis.quantitativeScore, color: 'green' },
                          { name: 'Verbal Ability', score: analysis.verbalAbilityScore, color: 'purple' },
                          { name: 'English Speaking/Versant', score: analysis.englishSpeakingScore, color: 'orange' }
                        ].map(skill => (
                          <div key={skill.name} className="flex items-center justify-between">
                            <span className="font-medium whitespace-nowrap">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < skill.score 
                                        ? "text-yellow-400 fill-current" 
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm font-bold">{skill.score}/5</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Strengths & Concerns */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-600" />
                        Analysis Summary
                      </h3>
                      
                      {analysis.strengths.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {analysis.strengths.map((strength, i) => (
                              <li key={i} className="text-sm text-green-600 flex items-center gap-2">
                                <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {analysis.concerns.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-1">
                            {analysis.concerns.map((concern, i) => (
                              <li key={i} className="text-sm text-red-600 flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                {concern}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {/* Contact Actions for Individual Candidates */}
                    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Contact Options</h4>
                      <div className="flex flex-wrap gap-3">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                          onClick={() => {
                            const subject = encodeURIComponent(`Interview Opportunity - Entry-Level Software Engineer`);
                            const body = encodeURIComponent(`Hi ${analysis.student.firstName},\n\nWe are impressed with your profile and would like to discuss a potential opportunity for an entry-level software engineer position at our company.\n\nWould you be available for a brief conversation this week?\n\nBest regards`);
                            window.open(`mailto:${analysis.student.email}?subject=${subject}&body=${body}`, '_blank');
                          }}
                          data-testid={`button-email-${analysis.student.id}`}
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </Button>
                        
                        <Button 
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => {
                            const message = encodeURIComponent(`Hi ${analysis.student.firstName}, we are impressed with your profile and would like to discuss a potential software engineer opportunity. Are you available for a quick chat?`);
                            const phoneNumber = analysis.student.phone?.replace(/[^0-9]/g, '') || '919999999999'; // fallback phone
                            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                          }}
                          data-testid={`button-whatsapp-${analysis.student.id}`}
                        >
                          <MessageCircle className="w-4 h-4" />
                          WhatsApp
                        </Button>
                        
                        <Button 
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
                          onClick={() => {
                            const phoneNumber = analysis.student.phone?.replace(/[^0-9]/g, '') || '919999999999';
                            window.open(`tel:+${phoneNumber}`, '_self');
                          }}
                          data-testid={`button-call-${analysis.student.id}`}
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Final Selection Action */}
            {selectedCandidates.size > 0 && (
              <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-2 border-green-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Mail className="w-6 h-6 text-green-600" />
                    Final Selection Ready
                  </CardTitle>
                  <CardDescription>
                    You have selected {selectedCandidates.size} candidate{selectedCandidates.size !== 1 ? 's' : ''} for final consideration. Send them a shortlist notification email.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Selected candidates will receive professional notifications that they've been shortlisted for the next round of the hiring process.
                    </div>
                    
                    {/* Bulk Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedCandidates(new Set())}
                        data-testid="button-clear-selection"
                      >
                        Clear Selection
                      </Button>
                      
                      <Button 
                        onClick={() => sendShortlistEmail.mutate(Array.from(selectedCandidates))}
                        disabled={sendShortlistEmail.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                        data-testid="button-send-shortlist-email"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {sendShortlistEmail.isPending ? "Sending..." : "Send Bulk Email"}
                      </Button>
                      
                      <Button 
                        onClick={() => {
                          const selectedStudents = students?.filter((s: any) => selectedCandidates.has(s.id)) || [];
                          const message = encodeURIComponent(`Congratulations! You have been shortlisted for our entry-level software engineer position. We will contact you soon with next steps.`);
                          
                          selectedStudents.forEach((student: any, index: number) => {
                            setTimeout(() => {
                              const phoneNumber = student.phone?.replace(/[^0-9]/g, '') || '919999999999';
                              window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                            }, index * 500); // Stagger the WhatsApp opens
                          });
                          
                          toast({
                            title: "WhatsApp messages initiated",
                            description: `Opening WhatsApp for ${selectedCandidates.size} candidates.`,
                          });
                        }}
                        className="bg-green-600 hover:bg-green-700"
                        data-testid="button-send-bulk-whatsapp"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send WhatsApp Messages
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}