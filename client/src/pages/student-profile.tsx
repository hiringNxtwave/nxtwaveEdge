import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, GraduationCap, Calendar, Github, ExternalLink, Mail, Phone } from "lucide-react";

export default function StudentProfile() {
  const { id } = useParams() as { id: string };

  const { data: student, isLoading, error } = useQuery({
    queryKey: ["/api/students", id],
    queryFn: async () => {
      const response = await fetch(`/api/students/${id}`);
      if (!response.ok) throw new Error("Failed to fetch student");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12" data-testid="text-error">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Student not found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card data-testid="card-profile-header">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={student.profileImageUrl} alt={`${student.firstName} ${student.lastName}`} />
                    <AvatarFallback className="text-xl">
                      {student.firstName[0]}{student.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-student-name">
                      {student.firstName} {student.lastName}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-3" data-testid="text-student-degree">
                      {student.degree} in {student.major}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center gap-1" data-testid="text-student-university">
                        <GraduationCap className="h-4 w-4" />
                        {student.university}
                      </div>
                      <div className="flex items-center gap-1" data-testid="text-student-location">
                        <MapPin className="h-4 w-4" />
                        {student.location}
                      </div>
                      <div className="flex items-center gap-1" data-testid="text-student-graduation">
                        <Calendar className="h-4 w-4" />
                        Graduating {student.graduationYear}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button data-testid="button-contact-student">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Student
                      </Button>
                      <Button variant="outline" data-testid="button-view-resume">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Resume
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card data-testid="card-about">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300" data-testid="text-student-bio">
                  {student.bio}
                </p>
              </CardContent>
            </Card>

            {/* Projects */}
            {student.projects && student.projects.length > 0 && (
              <Card data-testid="card-projects">
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Featured work and contributions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {student.projects.map((project: any) => (
                    <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4" data-testid={`project-${project.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white" data-testid={`text-project-title-${project.id}`}>
                          {project.title}
                        </h3>
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            data-testid={`link-project-github-${project.id}`}
                          >
                            <Github className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3" data-testid={`text-project-description-${project.id}`}>
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(project.technologies || "[]").map((tech: string) => (
                          <Badge key={tech} variant="secondary" data-testid={`badge-tech-${tech}`}>
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {/* Academic Details */}
            <Card data-testid="card-academic-details">
              <CardHeader>
                <CardTitle>Academic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">CGPA</span>
                  <p className="text-lg font-semibold" data-testid="text-student-cgpa">{student.cgpa}/10.0</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">University</span>
                  <p data-testid="text-academic-university">{student.university}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Degree</span>
                  <p data-testid="text-academic-degree">{student.degree}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Major</span>
                  <p data-testid="text-academic-major">{student.major}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Graduation Year</span>
                  <p data-testid="text-academic-graduation">{student.graduationYear}</p>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            {student.skills && student.skills.length > 0 && (
              <Card data-testid="card-skills">
                <CardHeader>
                  <CardTitle>Skills</CardTitle>
                  <CardDescription>Technical and soft skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {student.skills.map((skillEntry: any) => (
                      <div key={skillEntry.skillId} className="space-y-2" data-testid={`skill-${skillEntry.skillId}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium" data-testid={`text-skill-name-${skillEntry.skillId}`}>
                            {skillEntry.skill.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <Badge variant={skillEntry.verified ? "default" : "secondary"} data-testid={`badge-skill-verified-${skillEntry.skillId}`}>
                              {skillEntry.verified ? "Verified" : "Self-reported"}
                            </Badge>
                            <span className="text-sm text-gray-500" data-testid={`text-skill-score-${skillEntry.skillId}`}>
                              {skillEntry.assessmentScore}/100
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(skillEntry.proficiencyLevel / 5) * 100}%` }}
                            data-testid={`progress-skill-${skillEntry.skillId}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}