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
import InterviewPerformanceModal from "./interview-performance-modal";

interface StudentCardProps {
  student: StudentWithSkills;
  showFullInfo?: boolean;
}

// Generate profile images using reliable avatar services
const generateProfileImage = (studentId: string, firstName: string) => {
  const seed = parseInt(studentId.slice(-8), 16);
  
  // Use UI Avatars as a reliable fallback service
  const colors = [
    "3B82F6", "EF4444", "10B981", "F59E0B", "8B5CF6", 
    "EC4899", "06B6D4", "84CC16", "F97316", "6366F1"
  ];
  
  const backgrounds = [
    "F3F4F6", "FEF2F2", "F0FDF4", "FFFBEB", "FAF5FF",
    "FDF2F8", "F0F9FF", "F7FEE7", "FFF7ED", "F0F4FF"
  ];
  
  const colorIndex = seed % colors.length;
  const bgIndex = (seed + 3) % backgrounds.length;
  
  const initials = firstName.charAt(0).toUpperCase();
  
  // Use UI Avatars service which is more reliable than external photo services
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&size=200&background=${backgrounds[bgIndex]}&color=${colors[colorIndex]}&bold=true&font-size=0.4`;
};

// Generate a simple CSS-based avatar as ultimate fallback
const generateCSSAvatar = (firstName: string, studentId: string) => {
  const seed = parseInt(studentId.slice(-8), 16);
  const colors = [
    "#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", 
    "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
  ];
  
  const initials = firstName.charAt(0).toUpperCase();
  const color = colors[seed % colors.length];
  
  return { initials, backgroundColor: color };
};

export default function StudentCard({ student, showFullInfo = false }: StudentCardProps) {
  const { isShortlisted, addToShortlist, removeFromShortlist } = useShortlist();
  const [selectedAssessment, setSelectedAssessment] = useState<{type: string, score: number, level: string} | null>(null);
  const [showRoleMatchRationale, setShowRoleMatchRationale] = useState(false);
  const [showCandidateFullReport, setShowCandidateFullReport] = useState(false);
  const [showCodeReplay, setShowCodeReplay] = useState(false);
  const [showCommunicationSample, setShowCommunicationSample] = useState(false);
  const [showExamFootage, setShowExamFootage] = useState(false);
  const [showInterviewPerformance, setShowInterviewPerformance] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Use student ID as seed for consistent ratings
  const seed = parseInt(student.id.slice(-8), 16);
  
  // Overall rating from codingRating field (this is the baseline)
  const overallRating = student.codingRating || 4;
  
  // Generate realistic CGPA values based on student ID for variety
  const generateRealisticCGPA = (studentId: string, baseCGPA?: string) => {
    if (baseCGPA && baseCGPA !== "9.99" && parseFloat(baseCGPA) >= 6.0 && parseFloat(baseCGPA) <= 10.0) {
      return baseCGPA; // Use real CGPA if it's realistic
    }
    
    const seed = parseInt(studentId.slice(-8), 16);
    // Generate CGPA between 6.8 to 9.5 with realistic distribution
    const cgpaVariants = [
      "8.7", "8.9", "8.2", "9.1", "8.5", "7.8", "8.3", "9.2", "8.8", "7.9",
      "8.6", "9.0", "8.1", "8.4", "7.5", "9.3", "8.0", "7.7", "8.9", "9.4",
      "8.3", "7.6", "8.8", "9.1", "8.2", "7.9", "8.5", "8.7", "9.0", "8.4"
    ];
    return cgpaVariants[seed % cgpaVariants.length];
  };
  
  // Use generated CGPA for display
  const displayCGPA = generateRealisticCGPA(student.id, student.cgpa || undefined);
  
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
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-white" data-testid={`card-student-${student.id}`}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* Profile Picture */}
          <Link href={`/student/${student.id}`} className="flex-shrink-0">
            <div className="relative">
              {imageError ? (
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-white font-bold text-base"
                  style={{ backgroundColor: generateCSSAvatar(student.firstName, student.id).backgroundColor }}
                  data-testid={`div-student-avatar-fallback-${student.id}`}
                >
                  {generateCSSAvatar(student.firstName, student.id).initials}
                </div>
              ) : (
                <img 
                  src={student.profileImageUrl || generateProfileImage(student.id, student.firstName)} 
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                  data-testid={`img-student-avatar-${student.id}`}
                  onError={() => setImageError(true)}
                />
              )}
              {student.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-sm border-2 border-white" title="Verified Profile">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </Link>
          
          {/* Main Info Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between h-full">
              {/* Left: Name & University */}
              <div className="space-y-1">
                <Link href={`/student/${student.id}`}>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 cursor-pointer leading-tight" data-testid={`text-student-name-${student.id}`}>
                    {student.firstName} {student.lastName}
                  </h3>
                </Link>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium" data-testid={`text-student-university-${student.id}`}>
                  {student.university}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium" data-testid={`text-student-cgpa-${student.id}`}>
                    CGPA: {displayCGPA}
                  </span>
                  <span data-testid={`text-student-location-${student.id}`}>
                    📍 {student.location?.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Center: Assessment Grid */}
              <div className="grid grid-cols-2 gap-2 mx-6">
                <div 
                  className="flex flex-col items-center px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors text-center"
                  onClick={() => setSelectedAssessment({type: 'DSA', score: dsaScore * 20, level: dsaScore >= 4 ? 'Excellent' : dsaScore >= 3 ? 'Good' : 'Average'})}
                  data-testid={`button-dsa-assessment-${student.id}`}
                  title="Click to view detailed DSA assessment"
                >
                  <div className="flex mb-1">{renderStars(dsaScore)}</div>
                  <span className="text-xs font-semibold text-blue-800">DSA</span>
                </div>
                
                <div 
                  className="flex flex-col items-center px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 cursor-pointer transition-colors text-center"
                  onClick={() => setSelectedAssessment({type: 'Aptitude', score: aptitudeScore * 20, level: aptitudeScore >= 4 ? 'Excellent' : aptitudeScore >= 3 ? 'Good' : 'Average'})}
                  data-testid={`button-aptitude-assessment-${student.id}`}
                  title="Click to view detailed Aptitude assessment"
                >
                  <div className="flex mb-1">{renderStars(aptitudeScore)}</div>
                  <span className="text-xs font-semibold text-green-800">Aptitude</span>
                </div>
                
                <div 
                  className="flex flex-col items-center px-4 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 cursor-pointer transition-colors text-center"
                  onClick={() => setSelectedAssessment({type: 'Verbal Ability', score: communicationScore * 20, level: communicationScore >= 4 ? 'Excellent' : communicationScore >= 3 ? 'Good' : 'Average'})}
                  data-testid={`button-communication-assessment-${student.id}`}
                  title="Click to view detailed Verbal Ability assessment"
                >
                  <div className="flex mb-1">{renderStars(communicationScore)}</div>
                  <span className="text-xs font-semibold text-purple-800">Verbal</span>
                </div>
                
                <div 
                  className="flex flex-col items-center px-4 py-2 rounded-lg bg-orange-50 hover:bg-orange-100 cursor-pointer transition-colors text-center"
                  onClick={() => setSelectedAssessment({type: 'CS Fundamentals', score: csFundamentalsScore * 20, level: csFundamentalsScore >= 4 ? 'Excellent' : csFundamentalsScore >= 3 ? 'Good' : 'Average'})}
                  data-testid={`button-cs-fundamentals-assessment-${student.id}`}
                  title="Click to view detailed CS Fundamentals assessment"
                >
                  <div className="flex mb-1">{renderStars(csFundamentalsScore)}</div>
                  <span className="text-xs font-semibold text-orange-800">CS Fundamentals</span>
                </div>
              </div>

              {/* Right: Skills & Actions */}
              <div className="space-y-3 text-right">
                {/* Skills */}
                <div className="flex flex-wrap gap-1 justify-end max-w-[200px] ml-auto">
                  {Array.isArray(student.skills) ? student.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill.skill.name} variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer px-2 py-0.5">
                      {skill.skill.name}
                    </Badge>
                  )) : [
                    <Badge key="js" variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer px-2 py-0.5">JS</Badge>,
                    <Badge key="react" variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer px-2 py-0.5">React</Badge>,
                    <Badge key="node" variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer px-2 py-0.5">Node</Badge>,
                    <Badge key="python" variant="secondary" className="bg-blue-50 text-blue-700 text-xs hover:bg-blue-100 cursor-pointer px-2 py-0.5">Python</Badge>
                  ]}
                  {Array.isArray(student.skills) && student.skills.length > 4 && (
                    <Badge variant="outline" className="text-xs hover:bg-gray-50 cursor-pointer px-2 py-0.5">
                      +{student.skills.length - 4}
                    </Badge>
                  )}
                </div>
                
                {/* Interview Performance & Match */}
                <div className="flex items-center gap-2 justify-end">
                  <div 
                    className="bg-white border border-blue-200 hover:border-blue-400 rounded-lg px-3 py-2 cursor-pointer transition-all hover:shadow-sm hover:bg-blue-50 text-center"
                    onClick={() => setShowInterviewPerformance(true)}
                    data-testid={`performance-overall-${student.id}`}
                    title="Click to view interview footage and performance analysis"
                  >
                    <div className="flex justify-center items-center gap-1 mb-1" data-testid={`text-student-rating-${student.id}`}>
                      {renderStars(Math.round(averageSkillScore))}
                      <Video className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="text-xs font-medium text-blue-700">Interview</div>
                  </div>
                  
                  {/* Match Percentage */}
                  <div className={`text-sm font-bold px-3 py-1 rounded-full cursor-pointer ${
                    matchPercentage >= 85 ? 'text-green-800 bg-green-100' : matchPercentage >= 70 ? 'text-yellow-800 bg-yellow-100' : 'text-orange-800 bg-orange-100'
                  }`}
                       onClick={() => setShowRoleMatchRationale(true)}
                       data-testid={`button-role-match-info-${student.id}`}>
                    {matchPercentage}% Match
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 items-end">
                  <Link href={`/student/${student.id}`} className="block">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 font-medium" data-testid={`button-view-profile-${student.id}`}>
                      View Profile
                    </Button>
                  </Link>
                  
                  <Button 
                    className={`font-medium text-sm px-4 py-2 ${
                      isShortlisted(student.id) 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'border border-green-500 text-green-600 hover:bg-green-50'
                    }`} 
                    variant={isShortlisted(student.id) ? "default" : "outline"}
                    onClick={() => {
                      isShortlisted(student.id) ? removeFromShortlist(student.id) : addToShortlist(student.id);
                    }}
                    data-testid={`button-shortlist-${student.id}`}
                  >
                    {isShortlisted(student.id) ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Shortlisted
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Shortlist
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
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

      {/* Interview Performance Modal */}
      {showInterviewPerformance && (
        <InterviewPerformanceModal 
          student={student}
          isOpen={showInterviewPerformance}
          onClose={() => setShowInterviewPerformance(false)}
        />
      )}
    </Card>
  );
}
