import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, GraduationCap, Check, Plus, Shield, Eye, Info, Target } from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";
import { Link } from "wouter";
import { useShortlist } from "@/contexts/shortlist-context";
import { useState } from "react";
import AssessmentModal from "@/components/assessment-modal";
import RoleMatchRationale from "@/components/role-match-rationale";
import Candidate360View from "@/components/candidate-360-view";

interface StudentCardProps {
  student: StudentWithSkills;
  showFullInfo?: boolean;
}

export default function StudentCard({ student, showFullInfo = false }: StudentCardProps) {
  const { isShortlisted, addToShortlist, removeFromShortlist } = useShortlist();
  const [selectedAssessment, setSelectedAssessment] = useState<{type: string, score: number, level: string} | null>(null);
  const [showRoleMatchRationale, setShowRoleMatchRationale] = useState(false);
  const [showCandidate360, setShowCandidate360] = useState(false);
  
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
        <div className="grid grid-cols-12 gap-6 items-center w-full">
          {/* Student Info Section - 3 columns */}
          <Link href={`/student/${student.id}`} className="col-span-3 flex items-center space-x-4 cursor-pointer">
            <div className="relative">
              {/* Role Match Badge - Top Center */}
              <div 
                className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform shadow-lg border-2 border-white ${
                  matchPercentage >= 85 ? 'bg-green-500 hover:bg-green-600' : 
                  matchPercentage >= 70 ? 'bg-yellow-500 hover:bg-yellow-600' : 
                  'bg-orange-500 hover:bg-orange-600'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  setShowRoleMatchRationale(true);
                }}
                data-testid={`button-role-match-top-${student.id}`}
              >
                {matchPercentage}% MATCH
                <Target className="w-3 h-3" />
              </div>
              
              <img 
                src={student.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face`} 
                alt={`${student.firstName} ${student.lastName}`}
                className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg"
                data-testid={`img-student-avatar-${student.id}`}
              />
              {student.verified && (
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white" title="Verified Profile">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 truncate" data-testid={`text-student-name-${student.id}`}>
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1 truncate" data-testid={`text-student-university-${student.id}`}>
                {student.university}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium" data-testid={`text-student-cgpa-${student.id}`}>
                  CGPA: {student.cgpa}
                </span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span data-testid={`text-student-location-${student.id}`}>
                    {student.location}
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Skills Section - 5 columns */}
          <div className="col-span-5">
            <div className="grid grid-cols-4 gap-4">
              {/* DSA */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all duration-200 group" 
                   onClick={() => setSelectedAssessment({type: 'DSA Assessment', score: dsaScore * 20, level: dsaScore >= 4 ? 'Advanced' : dsaScore >= 3 ? 'Intermediate' : 'Basic'})}
                   data-testid={`assessment-dsa-${student.id}`}>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap flex items-center justify-center">
                  DSA Assessment
                  <Eye className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {(dsaScore * 20)}%
                </div>
                <div className="text-xs text-gray-500">
                  {dsaScore >= 4 ? 'Advanced' : dsaScore >= 3 ? 'Intermediate' : 'Basic'}
                </div>
              </div>

              {/* Aptitude */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm border border-gray-100 cursor-pointer hover:border-green-300 hover:shadow-md transition-all duration-200 group" 
                   onClick={() => setSelectedAssessment({type: 'Aptitude Test', score: aptitudeScore * 20, level: aptitudeScore >= 4 ? 'Excellent' : aptitudeScore >= 3 ? 'Good' : 'Fair'})}
                   data-testid={`assessment-aptitude-${student.id}`}>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap flex items-center justify-center">
                  Quantitative Test
                  <Eye className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400 mb-1">
                  {(aptitudeScore * 20)}%
                </div>
                <div className="text-xs text-gray-500">
                  {aptitudeScore >= 4 ? 'Excellent' : aptitudeScore >= 3 ? 'Good' : 'Fair'}
                </div>
              </div>

              {/* Communication */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm border border-gray-100 cursor-pointer hover:border-purple-300 hover:shadow-md transition-all duration-200 group" 
                   onClick={() => setSelectedAssessment({type: 'Communication', score: communicationScore * 20, level: communicationScore >= 4 ? 'Fluent' : communicationScore >= 3 ? 'Good' : 'Basic'})}
                   data-testid={`assessment-communication-${student.id}`}>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap flex items-center justify-center">
                  Communication
                  <Eye className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {(communicationScore * 20)}%
                </div>
                <div className="text-xs text-gray-500">
                  {communicationScore >= 4 ? 'Fluent' : communicationScore >= 3 ? 'Good' : 'Basic'}
                </div>
              </div>

              {/* CS Fundamentals */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm border border-gray-100 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all duration-200 group" 
                   onClick={() => setSelectedAssessment({type: 'System Design', score: csFundamentalsScore * 20, level: csFundamentalsScore >= 4 ? 'Expert' : csFundamentalsScore >= 3 ? 'Solid' : 'Learning'})}
                   data-testid={`assessment-system-design-${student.id}`}>
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap flex items-center justify-center">
                  System Design
                  <Eye className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-lg font-bold text-orange-600 dark:text-orange-400 mb-1">
                  {(csFundamentalsScore * 20)}%
                </div>
                <div className="text-xs text-gray-500">
                  {csFundamentalsScore >= 4 ? 'Expert' : csFundamentalsScore >= 3 ? 'Solid' : 'Learning'}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Summary - 2 columns */}
          <div className="col-span-2 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 shadow-sm border border-blue-100">
              <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Assessment Score</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1" data-testid={`text-student-rating-${student.id}`}>
                {Math.round(averageSkillScore * 20)}%
              </div>
              <div className="text-xs text-gray-600 mb-3">
                Industry-level Assessment
              </div>
              <div className={`text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-2 cursor-pointer hover:shadow-md transition-all duration-200 ${
                matchPercentage >= 85 ? 'text-green-800 bg-green-100 hover:bg-green-200' : matchPercentage >= 70 ? 'text-yellow-800 bg-yellow-100 hover:bg-yellow-200' : 'text-orange-800 bg-orange-100 hover:bg-orange-200'
              }`}
                   onClick={() => setShowRoleMatchRationale(true)}
                   data-testid={`button-role-match-info-${student.id}`}>
                {matchPercentage}% Role Match
                <Info className="w-3 h-3 opacity-60 hover:opacity-100" />
              </div>
            </div>
          </div>

          {/* Action Section - 2 columns */}
          <div className="col-span-2 flex flex-col space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Link href={`/student/${student.id}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" size="sm" data-testid={`button-view-profile-${student.id}`}>
                  View Profile
                </Button>
              </Link>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold" 
                size="sm" 
                onClick={() => setShowCandidate360(true)}
                data-testid={`button-360-view-${student.id}`}
              >
                <Eye className="w-4 h-4 mr-1" />
                360° View
              </Button>
            </div>
            <Button 
              variant="outline" 
              className={`w-full font-semibold ${
                isShortlisted(student.id) 
                  ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100' 
                  : 'border-green-500 text-green-600 hover:bg-green-50'
              }`} 
              size="sm" 
              onClick={() => {
                isShortlisted(student.id) ? removeFromShortlist(student.id) : addToShortlist(student.id);
              }}
              data-testid={`button-shortlist-${student.id}`}
            >
              {isShortlisted(student.id) ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Shortlisted
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  Shortlist
                </>
              )}
            </Button>
            <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-800" size="sm" data-testid={`button-contact-${student.id}`}>
              Message
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

      {/* Candidate 360 View Modal */}
      {showCandidate360 && (
        <Candidate360View 
          student={student}
          onClose={() => setShowCandidate360(false)}
        />
      )}
    </Card>
  );
}
