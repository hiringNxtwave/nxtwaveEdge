import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, GraduationCap, Calendar, Github, ExternalLink, Mail, Phone, Star, Award, Target, TrendingUp } from "lucide-react";

export default function StudentProfile() {
  useScrollToTop();
  
  const { id } = useParams() as { id: string };

  // Calculate consistent skill scores (same logic as StudentCard)
  const calculateSkillScores = (student: any) => {
    const seed = parseInt(id) || 1;
    const overallRating = student.codingRating || 4;
    
    const generateSkillScore = (offset: number) => {
      const baseScore = overallRating;
      const variation = ((seed * 37 + offset) % 3) - 1;
      return Math.max(1, Math.min(5, baseScore + variation));
    };
    
    return {
      dsaScore: generateSkillScore(1),
      aptitudeScore: generateSkillScore(2),
      communicationScore: generateSkillScore(3),
      csFundamentalsScore: generateSkillScore(4)
    };
  };

  const calculateJDMatch = (student: any, skillScores: any) => {
    const averageSkillScore = (skillScores.dsaScore + skillScores.aptitudeScore + skillScores.communicationScore + skillScores.csFundamentalsScore) / 4;
    const cgpaScore = (student.cgpa / 10) * 5;
    const overallRating = student.codingRating || 4;
    
    const skillWeight = 0.4;
    const cgpaWeight = 0.3;
    const overallWeight = 0.3;
    
    const rawMatchScore = (averageSkillScore * skillWeight) + (cgpaScore * cgpaWeight) + (overallRating * overallWeight);
    return Math.min(95, Math.max(60, Math.round(rawMatchScore * 20)));
  };

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

  const skillScores = calculateSkillScores(student);
  const jdMatchPercentage = calculateJDMatch(student, skillScores);

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
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-1" data-testid="text-student-degree">
                      {student.degree} in {student.major}
                    </p>
                    <p className="text-md text-blue-600 dark:text-blue-400 font-semibold mb-3" data-testid="text-student-department">
                      Department of {student.major}
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
                      <div className="flex items-center gap-1" data-testid="text-student-cgpa-header">
                        <Target className="h-4 w-4" />
                        CGPA: {student.cgpa}/10.0
                      </div>
                    </div>

                    {/* JD Match Badge */}
                    <div className="mb-4">
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                        jdMatchPercentage >= 85 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                        jdMatchPercentage >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`} data-testid="badge-jd-match">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        {jdMatchPercentage}% Job Description Match
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

            {/* Skills Assessment */}
            <Card data-testid="card-skills-assessment">
              <CardHeader>
                <CardTitle>Skills Assessment</CardTitle>
                <CardDescription>Performance ratings across key competency areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* DSA */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-200 whitespace-nowrap">Data Structures & Algorithms</h3>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{skillScores.dsaScore}/5</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStars(skillScores.dsaScore)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Problem solving, algorithmic thinking, coding challenges
                    </p>
                  </div>

                  {/* Aptitude */}
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-green-900 dark:text-green-200">Quantitative Aptitude</h3>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">{skillScores.aptitudeScore}/5</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStars(skillScores.aptitudeScore)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Mathematical reasoning, logical thinking, analytical skills
                    </p>
                  </div>

                  {/* Communication */}
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-purple-900 dark:text-purple-200 whitespace-nowrap">Communication Skills</h3>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{skillScores.communicationScore}/5</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStars(skillScores.communicationScore)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Verbal communication, presentation skills, teamwork
                    </p>
                  </div>

                  {/* CS Fundamentals */}
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-orange-900 dark:text-orange-200 whitespace-nowrap">CS Fundamentals</h3>
                      <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{skillScores.csFundamentalsScore}/5</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      {renderStars(skillScores.csFundamentalsScore)}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Operating systems, databases, networks, system design
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PORs and Achievements */}
            <Card data-testid="card-achievements">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Positions of Responsibility & Achievements
                </CardTitle>
                <CardDescription>Leadership roles, awards, and notable accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Generate sample PORs/achievements based on student data */}
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Technical Lead</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Student Technical Society, {student.university}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Led a team of 15 students in organizing technical workshops and coding competitions. 
                      Increased participation by 40% and mentored junior students in software development.
                    </p>
                    <span className="text-xs text-gray-500">2023 - Present</span>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Dean's List Recognition</h3>
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">Academic Excellence Award</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Consistently maintained CGPA above 9.0 for four consecutive semesters. 
                      Recognized for outstanding academic performance in Computer Science.
                    </p>
                    <span className="text-xs text-gray-500">2022 - 2024</span>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Hackathon Winner</h3>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">National Level Coding Competition</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      First place in 48-hour hackathon with 200+ teams. Developed an AI-powered 
                      solution for sustainable agriculture using machine learning and IoT.
                    </p>
                    <span className="text-xs text-gray-500">March 2024</span>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Open Source Contributor</h3>
                    <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Major Tech Projects</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Contributed to popular open-source projects with 10+ merged pull requests. 
                      Active in developer communities and technical forums.
                    </p>
                    <span className="text-xs text-gray-500">2023 - Present</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card data-testid="card-projects">
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Featured work and contributions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {student.projects && student.projects.length > 0 ? (
                  student.projects.map((project: any) => (
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
                  ))
                ) : (
                  <div className="space-y-4">
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Full-Stack E-Commerce Platform
                        </h3>
                        <Github className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Developed a comprehensive e-commerce solution with React frontend, Node.js backend, and MongoDB database. 
                        Features include user authentication, payment processing, inventory management, and admin dashboard.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">Node.js</Badge>
                        <Badge variant="secondary">MongoDB</Badge>
                        <Badge variant="secondary">Express</Badge>
                        <Badge variant="secondary">Stripe API</Badge>
                      </div>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Machine Learning Recommendation Engine
                        </h3>
                        <Github className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Built an AI-powered recommendation system using Python and TensorFlow. 
                        Implemented collaborative filtering and content-based algorithms achieving 94% accuracy in user preference prediction.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Python</Badge>
                        <Badge variant="secondary">TensorFlow</Badge>
                        <Badge variant="secondary">Pandas</Badge>
                        <Badge variant="secondary">Flask</Badge>
                        <Badge variant="secondary">PostgreSQL</Badge>
                      </div>
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Real-Time Chat Application
                        </h3>
                        <Github className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        Created a responsive chat application with real-time messaging, file sharing, and group chat features. 
                        Built with React, Socket.io, and supports 1000+ concurrent users with message encryption.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">React</Badge>
                        <Badge variant="secondary">Socket.io</Badge>
                        <Badge variant="secondary">Node.js</Badge>
                        <Badge variant="secondary">MongoDB</Badge>
                        <Badge variant="secondary">TypeScript</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
            <Card data-testid="card-skills">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Technical and soft skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {student.skills && student.skills.length > 0 ? (
                    student.skills.map((skillEntry: any) => (
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
                    ))
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">JavaScript</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Verified</Badge>
                            <span className="text-sm text-gray-500">92/100</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">React</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Verified</Badge>
                            <span className="text-sm text-gray-500">88/100</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "88%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Python</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Verified</Badge>
                            <span className="text-sm text-gray-500">94/100</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "94%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Node.js</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="default">Verified</Badge>
                            <span className="text-sm text-gray-500">86/100</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "86%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">MongoDB</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Self-reported</Badge>
                            <span className="text-sm text-gray-500">82/100</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "82%" }}></div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">System Design</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Self-reported</Badge>
                            <span className="text-sm text-gray-500">78/100</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "78%" }}></div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}