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
  const topSkills = student.skills
    .sort((a, b) => (b.assessmentScore || 0) - (a.assessmentScore || 0))
    .slice(0, 3);

  const averageRating = student.skills.length > 0 
    ? student.skills.reduce((sum, skill) => sum + (skill.assessmentScore || 0), 0) / (student.skills.length * 20)
    : 4.5;

  const featuredProjects = student.projects.filter(p => p.featured).slice(0, 2);

  return (
    <Card className="hover:shadow-md transition-shadow" data-testid={`card-student-${student.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4 mb-4">
          <img 
            src={student.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face`} 
            alt={`${student.firstName} ${student.lastName}`}
            className="w-16 h-16 rounded-full object-cover"
            data-testid={`img-student-avatar-${student.id}`}
          />
          <div className="flex-1">
            <h3 className="font-semibold text-foreground" data-testid={`text-student-name-${student.id}`}>
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-student-education-${student.id}`}>
              {student.university} • {student.major}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm font-medium text-primary" data-testid={`text-student-cgpa-${student.id}`}>
                CGPA: {student.cgpa}
              </span>
              <span className="w-2 h-2 bg-secondary rounded-full"></span>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground" data-testid={`text-student-location-${student.id}`}>
                  {student.location}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Top Skills</h4>
            <div className="flex flex-wrap gap-2">
              {topSkills.map((studentSkill) => (
                <Badge 
                  key={studentSkill.id} 
                  variant="secondary" 
                  className="text-xs"
                  data-testid={`badge-skill-${studentSkill.skill.name}-${student.id}`}
                >
                  {studentSkill.skill.name}
                </Badge>
              ))}
              {topSkills.length === 0 && (
                <span className="text-xs text-muted-foreground">No skills listed</span>
              )}
            </div>
          </div>
          
          {featuredProjects.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Projects</h4>
              <p className="text-sm text-muted-foreground" data-testid={`text-student-projects-${student.id}`}>
                {featuredProjects.map(p => p.title).join(", ")}
              </p>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(averageRating) 
                        ? "text-yellow-400 fill-current" 
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground" data-testid={`text-student-rating-${student.id}`}>
                {averageRating.toFixed(1)}/5
              </span>
            </div>
            
            {showFullInfo ? (
              <Link href={`/student/${student.id}`}>
                <Button variant="link" size="sm" data-testid={`button-view-profile-${student.id}`}>
                  View Profile
                </Button>
              </Link>
            ) : (
              <Button variant="link" size="sm" disabled data-testid={`button-view-profile-locked-${student.id}`}>
                View Profile
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
