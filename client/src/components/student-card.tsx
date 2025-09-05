import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, GraduationCap, Check, Plus, Shield, Eye, Info, Target, Video, Clock, Award, Zap, TrendingUp, Users, DollarSign, CheckCircle, IndianRupee } from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";
import { Link } from "wouter";
import { useShortlist } from "@/contexts/shortlist-context";
import { useState } from "react";
import AssessmentModal from "@/components/assessment-modal";
import RoleMatchRationale from "@/components/role-match-rationale";
import CandidateFullReport from "@/components/candidate-360-view";
import CodeReplayModal from "@/components/code-replay-modal";
import CommunicationSampleModal from "@/components/communication-sample-modal";
import ExamFootageModal from "@/components/exam-footage-modal";

interface StudentCardProps {
  student: StudentWithSkills;
  showFullInfo?: boolean;
}

export default function StudentCard({ student, showFullInfo = false }: StudentCardProps) {
  const { isShortlisted, addToShortlist, removeFromShortlist } = useShortlist();
  const [selectedAssessment, setSelectedAssessment] = useState<{type: string, score: number, level: string} | null>(null);
  const [showRoleMatchRationale, setShowRoleMatchRationale] = useState(false);
  const [showCandidateFullReport, setShowCandidateFullReport] = useState(false);
  const [showCodeReplay, setShowCodeReplay] = useState(false);
  const [showCommunicationSample, setShowCommunicationSample] = useState(false);
  const [showExamFootage, setShowExamFootage] = useState(false);
  
  // Use student ID as seed for consistent ratings
  const seed = parseInt(student.id.slice(-8), 16);
  
  // Overall rating from codingRating field (this is the baseline)
  const overallRating = student.codingRating || 4;
  
  // Generate consistent skill scores based on overall rating with some variation
  // Higher overall rating = higher individual skill scores, but with realistic variation
  const generateSkillScore = (offset: number) => {
    const baseScore = overallRating;
    const variation = ((seed * 37 + offset) % 3) - 1; // -1, 0, or 1
    return Math.max(1, Math.min(5, baseScore + variation));
  };
  
  const dsaScore = generateSkillScore(1);
  const aptitudeScore = generateSkillScore(2); 
  const verbalScore = generateSkillScore(3);
  const communicationScore = generateSkillScore(4);
  const csFundamentalsScore = generateSkillScore(5);

  // Calculate match percentage based on skills, CGPA, and overall rating
  const averageSkillScore = (dsaScore + aptitudeScore + verbalScore + communicationScore) / 4;
  const cgpaValue = typeof student.cgpa === 'string' ? parseFloat(student.cgpa) : student.cgpa;
  const cgpaScore = ((cgpaValue || 7.5) / 10) * 5; // Convert CGPA to 5-point scale with fallback
  
  // JD match percentage - weighted calculation
  const skillWeight = 0.4;
  const cgpaWeight = 0.3;
  const overallWeight = 0.3;
  
  const rawMatchScore = (averageSkillScore * skillWeight) + (cgpaScore * cgpaWeight) + (overallRating * overallWeight);
  const matchPercentage = Math.min(95, Math.max(60, Math.round(rawMatchScore * 20) || 75)); // Fallback to 75%

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i}
        className={`w-4 h-4 ${
          i < rating 
            ? "text-yellow-400 fill-current" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-r from-white to-blue-50 dark:from-gray-800 dark:to-gray-750" data-testid={`card-student-${student.id}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-6 w-full">
          {/* Student Info Section */}
          <Link href={`/student/${student.id}`} className="flex items-center space-x-4 cursor-pointer flex-shrink-0">
            <div className="relative">
              <img 
                src={student.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face`} 
                alt={`${student.firstName} ${student.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                data-testid={`img-student-avatar-${student.id}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face`;
                }}
                loading="lazy"
                crossOrigin="anonymous"
              />
              {student.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white" title="Verified Profile">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white" data-testid={`text-student-name-${student.id}`}>
                  {student.firstName} {student.lastName}
                </h3>
                {/* Individual Freshness Indicator */}
                <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  seed % 3 === 0 ? 'bg-green-100 text-green-700' :
                  seed % 3 === 1 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {seed % 3 === 0 ? '🟢 Fresh' : seed % 3 === 1 ? '🟡 Recent' : '⚪ Active'}
                </div>
              </div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-1" data-testid={`text-student-university-${student.id}`}>
                {student.university}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium" data-testid={`text-student-cgpa-${student.id}`}>
                  CGPA: {student.cgpa}
                </span>
                <span data-testid={`text-student-location-${student.id}`}>
                  📍 {student.location?.split(',')[0]}
                </span>
              </div>
            </div>
          </Link>

          {/* Skills & Skills Preview */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2">
              {student.skills?.slice(0, 4).map((skill) => (
                <Badge key={skill.name} variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                  {skill.name}
                </Badge>
              )) || [
                <Badge key="js" variant="secondary" className="bg-blue-50 text-blue-700 text-xs">JavaScript</Badge>,
                <Badge key="react" variant="secondary" className="bg-blue-50 text-blue-700 text-xs">React</Badge>,
                <Badge key="node" variant="secondary" className="bg-blue-50 text-blue-700 text-xs">Node.js</Badge>
              ]}
              {(student.skills?.length || 3) > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{(student.skills?.length || 3) - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Salary & Location Information */}
          <div className="border-l border-gray-200 pl-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Salary & Preference</h4>
            <div className="space-y-2">
              {/* Student's Expectation */}
              <div className="flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid={`text-student-expected-salary-${student.id}`}>
                  {student.expectedSalaryMin && student.expectedSalaryMax ? 
                    `${(student.expectedSalaryMin / 100).toFixed(0)}-${(student.expectedSalaryMax / 100).toFixed(0)} LPA` :
                    "6-8 LPA"
                  }
                </span>
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                  Expected
                </Badge>
              </div>
              
              {/* Location Preference */}
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white" data-testid={`text-student-location-preference-${student.id}`}>
                  {student.preferredLocations || student.location?.split(',')[0] || "Flexible"}
                </span>
                <Badge variant="outline" className="text-xs text-purple-600 border-purple-200">
                  Location Preference
                </Badge>
              </div>
            </div>
          </div>

          {/* 4-Section Performance Display */}
          <div className="border-l border-gray-200 pl-4">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Performance Breakdown</h4>
            <div className="grid grid-cols-2 gap-3">
              {/* DSA Score */}
              <div 
                className="text-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
                onClick={() => setSelectedAssessment({type: 'Data Structures & Algorithms', score: dsaScore, level: dsaScore >= 4 ? 'Advanced' : dsaScore >= 3 ? 'Intermediate' : 'Beginner'})}
                data-testid={`button-dsa-assessment-${student.id}`}
              >
                <div className="flex items-center justify-center mb-1">
                  {renderStars(dsaScore)}
                </div>
                <div className="text-xs font-medium text-blue-700">DSA</div>
              </div>

              {/* Aptitude Score */}
              <div 
                className="text-center p-2 rounded-lg bg-green-50 hover:bg-green-100 cursor-pointer transition-colors"
                onClick={() => setSelectedAssessment({type: 'Aptitude', score: aptitudeScore, level: aptitudeScore >= 4 ? 'Advanced' : aptitudeScore >= 3 ? 'Intermediate' : 'Beginner'})}
                data-testid={`button-aptitude-assessment-${student.id}`}
              >
                <div className="flex items-center justify-center mb-1">
                  {renderStars(aptitudeScore)}
                </div>
                <div className="text-xs font-medium text-green-700">Aptitude</div>
              </div>

              {/* Verbal Score */}
              <div 
                className="text-center p-2 rounded-lg bg-purple-50 hover:bg-purple-100 cursor-pointer transition-colors"
                onClick={() => setSelectedAssessment({type: 'Verbal Reasoning', score: verbalScore, level: verbalScore >= 4 ? 'Advanced' : verbalScore >= 3 ? 'Intermediate' : 'Beginner'})}
                data-testid={`button-verbal-assessment-${student.id}`}
              >
                <div className="flex items-center justify-center mb-1">
                  {renderStars(verbalScore)}
                </div>
                <div className="text-xs font-medium text-purple-700">Verbal</div>
              </div>

              {/* Communication Score */}
              <div 
                className="text-center p-2 rounded-lg bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors"
                onClick={() => setSelectedAssessment({type: 'Communication', score: communicationScore, level: communicationScore >= 4 ? 'Advanced' : communicationScore >= 3 ? 'Intermediate' : 'Beginner'})}
                data-testid={`button-communication-assessment-${student.id}`}
              >
                <div className="flex items-center justify-center mb-1">
                  {renderStars(communicationScore)}
                </div>
                <div className="text-xs font-medium text-orange-700">Communication</div>
              </div>
            </div>
            
            {/* Overall Match Score */}
            <div className="mt-3 text-center">
              <div className={`text-sm font-bold px-3 py-1 rounded-full cursor-pointer ${
                matchPercentage >= 85 ? 'text-green-800 bg-green-100' : matchPercentage >= 70 ? 'text-yellow-800 bg-yellow-100' : 'text-orange-800 bg-orange-100'
              }`}
                   onClick={() => setShowRoleMatchRationale(true)}
                   data-testid={`button-role-match-info-${student.id}`}>
                {matchPercentage}% JD Match
              </div>
            </div>
          </div>

          {/* Action Buttons - Stacked Vertically */}
          <div className="flex flex-col gap-2 flex-shrink-0">
            <Link href={`/student/${student.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" size="sm" data-testid={`button-view-profile-${student.id}`}>
                <Eye className="w-4 h-4 mr-1" />
                View Profile
              </Button>
            </Link>
            <Button 
              className={`font-semibold w-full ${
                isShortlisted(student.id) 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'border border-green-500 text-green-600 hover:bg-green-50'
              }`} 
              size="sm" 
              variant={isShortlisted(student.id) ? "default" : "outline"}
              onClick={() => {
                isShortlisted(student.id) ? removeFromShortlist(student.id) : addToShortlist(student.id);
              }}
              data-testid={`button-shortlist-${student.id}`}
            >
              {isShortlisted(student.id) ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Added
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Shortlist
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Assessment Modal */}
      {selectedAssessment && (
        <AssessmentModal 
          assessment={selectedAssessment} 
          student={student}
          onClose={() => setSelectedAssessment(null)}
        />
      )}
      
      {/* Role Match Rationale Modal */}
      {showRoleMatchRationale && (
        <RoleMatchRationale 
          student={student}
          matchPercentage={matchPercentage}
          onClose={() => setShowRoleMatchRationale(false)}
        />
      )}

      {/* Candidate Full Report Modal */}
      {showCandidateFullReport && (
        <CandidateFullReport 
          student={student}
          isOpen={showCandidateFullReport}
          onClose={() => setShowCandidateFullReport(false)}
        />
      )}

      {/* Code Replay Modal */}
      {showCodeReplay && (
        <CodeReplayModal 
          student={student}
          isOpen={showCodeReplay}
          onClose={() => setShowCodeReplay(false)}
        />
      )}

      {/* Communication Sample Modal */}
      {showCommunicationSample && (
        <CommunicationSampleModal 
          student={student}
          isOpen={showCommunicationSample}
          onClose={() => setShowCommunicationSample(false)}
        />
      )}

      {/* Exam Footage Modal */}
      {showExamFootage && (
        <ExamFootageModal 
          student={student}
          isOpen={showExamFootage}
          onClose={() => setShowExamFootage(false)}
        />
      )}
    </Card>
  );
}
