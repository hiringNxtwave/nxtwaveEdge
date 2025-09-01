import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, GraduationCap, Check, Plus } from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";
import { Link } from "wouter";
import { useShortlist } from "@/contexts/shortlist-context";

interface StudentCardProps {
  student: StudentWithSkills;
  showFullInfo?: boolean;
}

export default function StudentCard({ student, showFullInfo = false }: StudentCardProps) {
  const { isShortlisted, addToShortlist, removeFromShortlist } = useShortlist();
  
  // Use student ID as seed for consistent ratings
  const seed = student.id;
  
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
  const cgpaScore = (student.cgpa / 10) * 5; // Convert CGPA to 5-point scale
  
  // JD match percentage - weighted calculation
  const skillWeight = 0.4;
  const cgpaWeight = 0.3;
  const overallWeight = 0.3;
  
  const rawMatchScore = (averageSkillScore * skillWeight) + (cgpaScore * cgpaWeight) + (overallRating * overallWeight);
  const matchPercentage = Math.min(95, Math.max(60, Math.round(rawMatchScore * 20)));

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
          <div className="col-span-3 flex items-center space-x-4">
            <div className="relative">
              <img 
                src={student.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face`} 
                alt={`${student.firstName} ${student.lastName}`}
                className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-lg"
                data-testid={`img-student-avatar-${student.id}`}
              />
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full text-xs font-bold text-white flex items-center justify-center shadow-lg border-2 border-white ${
                matchPercentage >= 85 ? 'bg-green-500' : matchPercentage >= 70 ? 'bg-yellow-500' : 'bg-orange-500'
              }`}>
                {matchPercentage}%
              </div>
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
          </div>

          {/* Skills Section - 5 columns */}
          <div className="col-span-5">
            <div className="grid grid-cols-4 gap-4">
              {/* DSA */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">DSA</div>
                <div className="flex justify-center space-x-1 mb-1">
                  {renderStars(dsaScore)}
                </div>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {dsaScore}/5
                </div>
              </div>

              {/* Aptitude */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Aptitude</div>
                <div className="flex justify-center space-x-1 mb-1">
                  {renderStars(aptitudeScore)}
                </div>
                <div className="text-xs font-semibold text-green-600 dark:text-green-400">
                  {aptitudeScore}/5
                </div>
              </div>

              {/* Communication */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Communication</div>
                <div className="flex justify-center space-x-1 mb-1">
                  {renderStars(communicationScore)}
                </div>
                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                  {communicationScore}/5
                </div>
              </div>

              {/* CS Fundamentals */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center shadow-sm">
                <div className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">CS Fundamentals</div>
                <div className="flex justify-center space-x-1 mb-1">
                  {renderStars(csFundamentalsScore)}
                </div>
                <div className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                  {csFundamentalsScore}/5
                </div>
              </div>
            </div>
          </div>

          {/* Overall Rating Section - 2 columns */}
          <div className="col-span-2 text-center">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
              <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Overall Rating</div>
              <div className="flex justify-center space-x-1 mb-2">
                {renderStars(overallRating)}
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-1" data-testid={`text-student-rating-${student.id}`}>
                {overallRating}/5
              </div>
              <div className={`text-lg font-bold px-3 py-1 rounded-full ${
                matchPercentage >= 85 ? 'text-green-800 bg-green-100' : matchPercentage >= 70 ? 'text-yellow-800 bg-yellow-100' : 'text-orange-800 bg-orange-100'
              }`}>
                {matchPercentage}% JD Match
              </div>
            </div>
          </div>

          {/* Action Section - 2 columns */}
          <div className="col-span-2 flex flex-col space-y-3">
            {showFullInfo ? (
              <Link href={`/student/${student.id}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" size="sm" data-testid={`button-view-profile-${student.id}`}>
                  View Profile
                </Button>
              </Link>
            ) : (
              <Button className="w-full" variant="outline" size="sm" disabled data-testid={`button-view-profile-locked-${student.id}`}>
                View Profile
              </Button>
            )}
            <Button 
              variant="outline" 
              className={`w-full font-semibold ${
                isShortlisted(student.id) 
                  ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100' 
                  : 'border-green-500 text-green-600 hover:bg-green-50'
              }`} 
              size="sm" 
              onClick={() => isShortlisted(student.id) ? removeFromShortlist(student.id) : addToShortlist(student.id)}
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
    </Card>
  );
}
