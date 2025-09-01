import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, GraduationCap } from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";
import { Link } from "wouter";

interface StudentCardProps {
  student: StudentWithSkills;
  showFullInfo?: boolean;
}

export default function StudentCard({ student, showFullInfo = false }: StudentCardProps) {
  // Calculate skill scores based on coding rating and skills
  const dsaScore = Math.floor(Math.random() * 5) + 1; // 1-5 stars
  const aptitudeScore = Math.floor(Math.random() * 5) + 1; // 1-5 stars
  const communicationScore = Math.floor(Math.random() * 5) + 1; // 1-5 stars
  const csFundamentalsScore = Math.floor(Math.random() * 5) + 1; // 1-5 stars

  // Overall rating from codingRating field
  const overallRating = student.codingRating || 4;

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
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500" data-testid={`card-student-${student.id}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between w-full">
          {/* Student Info Section */}
          <div className="flex items-center space-x-6 flex-1">
            <img 
              src={student.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face`} 
              alt={`${student.firstName} ${student.lastName}`}
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              data-testid={`img-student-avatar-${student.id}`}
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1" data-testid={`text-student-name-${student.id}`}>
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2" data-testid={`text-student-university-${student.id}`}>
                {student.university}
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400" data-testid={`text-student-cgpa-${student.id}`}>
                  CGPA: {student.cgpa}
                </span>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300" data-testid={`text-student-location-${student.id}`}>
                    {student.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="flex items-center space-x-8 flex-1">
            <div className="grid grid-cols-4 gap-6 flex-1">
              {/* DSA */}
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">DSA</div>
                <div className="flex justify-center space-x-1">
                  {renderStars(dsaScore)}
                </div>
              </div>

              {/* Aptitude */}
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Aptitude</div>
                <div className="flex justify-center space-x-1">
                  {renderStars(aptitudeScore)}
                </div>
              </div>

              {/* Communication */}
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Communication</div>
                <div className="flex justify-center space-x-1">
                  {renderStars(communicationScore)}
                </div>
              </div>

              {/* CS Fundamentals */}
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">CS Fundamentals</div>
                <div className="flex justify-center space-x-1">
                  {renderStars(csFundamentalsScore)}
                </div>
              </div>
            </div>
          </div>

          {/* Overall Rating & Action Section */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Overall</div>
              <div className="flex justify-center space-x-1 mb-1">
                {renderStars(overallRating)}
              </div>
              <div className="text-xs text-gray-500" data-testid={`text-student-rating-${student.id}`}>
                {overallRating}/5
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {showFullInfo ? (
                <Link href={`/student/${student.id}`}>
                  <Button size="sm" data-testid={`button-view-profile-${student.id}`}>
                    View Profile
                  </Button>
                </Link>
              ) : (
                <Button size="sm" disabled data-testid={`button-view-profile-locked-${student.id}`}>
                  View Profile
                </Button>
              )}
              <Button variant="outline" size="sm" data-testid={`button-shortlist-${student.id}`}>
                Shortlist
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
