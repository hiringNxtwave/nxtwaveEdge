import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, GraduationCap, Check, Plus, Shield, Eye, Info, Target, Video, Clock, Award, Zap, TrendingUp, Users, DollarSign, CheckCircle } from "lucide-react";
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

// Generate diverse profile images using different photo sources
const generateProfileImage = (studentId: string, firstName: string) => {
  const seed = parseInt(studentId.slice(-8), 16);
  
  // Array of diverse professional headshot photos from Unsplash
  const photos = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", // Male
    "https://images.unsplash.com/photo-1494790108755-2616c6426e90?w=200&h=200&fit=crop&crop=face", // Female
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", // Male
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face", // Female
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", // Male
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face", // Female
    "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=200&h=200&fit=crop&crop=face", // Male
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face", // Female
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face", // Male
    "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&h=200&fit=crop&crop=face", // Female
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face", // Male
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face", // Female
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop&crop=face", // Male
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face", // Female
    "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face", // Male
    "https://images.unsplash.com/photo-1485893226505-9880b47cb3d9?w=200&h=200&fit=crop&crop=face", // Female
  ];
  
  // Select photo based on student ID for consistency
  const photoIndex = seed % photos.length;
  return photos[photoIndex];
};

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
  const communicationScore = generateSkillScore(3);
  const csFundamentalsScore = generateSkillScore(4);

  // Calculate match percentage based on skills, CGPA, and overall rating
  const averageSkillScore = (dsaScore + aptitudeScore + communicationScore + csFundamentalsScore) / 4;
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
        <div className="flex items-start gap-6 w-full">
          {/* Student Info Section */}
          <Link href={`/student/${student.id}`} className="flex items-center space-x-4 cursor-pointer flex-shrink-0">
            <div className="relative">
              <img 
                src={student.profileImageUrl || generateProfileImage(student.id, student.firstName)} 
                alt={`${student.firstName} ${student.lastName}`}
                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                data-testid={`img-student-avatar-${student.id}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = generateProfileImage(student.id, student.firstName);
                }}
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

          {/* Skills & Ratings Section */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Top Skills Display */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Top Skills</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {student.skills?.slice(0, 6).map((skill) => (
                  <Badge key={skill.name} variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer">
                    {skill.name}
                  </Badge>
                )) || [
                  <Badge key="js" variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer">JavaScript</Badge>,
                  <Badge key="react" variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer">React</Badge>,
                  <Badge key="node" variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer">Node.js</Badge>,
                  <Badge key="python" variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer">Python</Badge>,
                  <Badge key="mongo" variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer">MongoDB</Badge>,
                  <Badge key="system" variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer">System Design</Badge>
                ]}
                {(student.skills?.length || 6) > 6 && (
                  <Badge variant="outline" className="text-xs hover:bg-gray-50 cursor-pointer">
                    +{(student.skills?.length || 6) - 6} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Assessment Ratings with Clickable Stars */}
            <div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedAssessment({type: 'DSA', score: dsaScore * 20, level: dsaScore >= 4 ? 'Excellent' : dsaScore >= 3 ? 'Good' : 'Average'})}
                  data-testid={`button-dsa-assessment-${student.id}`}
                >
                  <span className="font-medium text-blue-800 dark:text-blue-200 min-w-[30px]">DSA</span>
                  <div className="flex">{renderStars(dsaScore)}</div>
                </div>
                
                <div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedAssessment({type: 'Aptitude', score: aptitudeScore * 20, level: aptitudeScore >= 4 ? 'Excellent' : aptitudeScore >= 3 ? 'Good' : 'Average'})}
                  data-testid={`button-aptitude-assessment-${student.id}`}
                >
                  <span className="font-medium text-green-800 dark:text-green-200 min-w-[30px]">APT</span>
                  <div className="flex">{renderStars(aptitudeScore)}</div>
                </div>
                
                <div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedAssessment({type: 'Communication', score: communicationScore * 20, level: communicationScore >= 4 ? 'Excellent' : communicationScore >= 3 ? 'Good' : 'Average'})}
                  data-testid={`button-communication-assessment-${student.id}`}
                >
                  <span className="font-medium text-purple-800 dark:text-purple-200 min-w-[30px]">COM</span>
                  <div className="flex">{renderStars(communicationScore)}</div>
                </div>
                
                <div 
                  className="flex items-center gap-2 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 cursor-pointer transition-colors"
                  onClick={() => setSelectedAssessment({type: 'CS Fundamentals', score: csFundamentalsScore * 20, level: csFundamentalsScore >= 4 ? 'Excellent' : csFundamentalsScore >= 3 ? 'Good' : 'Average'})}
                  data-testid={`button-cs-fundamentals-assessment-${student.id}`}
                >
                  <span className="font-medium text-orange-800 dark:text-orange-200 min-w-[30px]">CS</span>
                  <div className="flex">{renderStars(csFundamentalsScore)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Score & Match - Stacked Vertically */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600 dark:text-blue-400" data-testid={`text-student-rating-${student.id}`}>
                {Math.round(averageSkillScore * 20)}%
              </div>
              <div className="text-xs text-gray-600">Overall Score</div>
            </div>
            <div className={`text-sm font-bold px-3 py-1 rounded-full cursor-pointer ${
              matchPercentage >= 85 ? 'text-green-800 bg-green-100' : matchPercentage >= 70 ? 'text-yellow-800 bg-yellow-100' : 'text-orange-800 bg-orange-100'
            }`}
                 onClick={() => setShowRoleMatchRationale(true)}
                 data-testid={`button-role-match-info-${student.id}`}>
              {matchPercentage}% Match
            </div>
          </div>

          {/* Action Buttons - Stacked Vertically */}
          <div className="flex flex-col gap-2 flex-shrink-0 min-w-[100px]">
            <Link href={`/student/${student.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" size="sm" data-testid={`button-view-profile-${student.id}`}>
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
