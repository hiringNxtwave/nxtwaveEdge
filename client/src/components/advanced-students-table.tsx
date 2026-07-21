import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  Star, 
  Trophy, 
  Code, 
  MessageSquare, 
  Calendar,
  Shield,
  Eye,
  Video,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Award,
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import AssessmentModal from "@/components/assessment-modal";
import RoleMatchRationale from "@/components/role-match-rationale";
import type { StudentWithSkills } from "@shared/schema";

interface AdvancedStudentsTableProps {
  limit?: number;
  onInterviewSchedule?: (studentId: string, studentName: string) => void;
  onCodeView?: (studentId: string, studentName: string) => void;
  onMessage?: (studentId: string, studentName: string) => void;
  onSelectForFinalConsideration?: (studentId: string, studentName: string) => void;
}

export default function AdvancedStudentsTable({ 
  limit = 100, 
  onInterviewSchedule,
  onCodeView,
  onMessage,
  onSelectForFinalConsideration 
}: AdvancedStudentsTableProps) {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("dsaScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [universityFilter, setUniversityFilter] = useState("all");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [skillFilter, setSkillFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssessment, setSelectedAssessment] = useState<{
    type: string; 
    score: number; 
    level: string; 
    student: StudentWithSkills;
  } | null>(null);
  const [roleMatchRationaleStudent, setRoleMatchRationaleStudent] = useState<{
    student: StudentWithSkills;
    matchPercentage: number;
  } | null>(null);

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["/api/students/advanced", {
      search: searchTerm,
      sortField,
      sortOrder,
      university: universityFilter === "all" ? "" : universityFilter,
      verification: verificationFilter === "all" ? "" : verificationFilter,
      skill: skillFilter,
      limit,
      offset: (currentPage - 1) * 20
    }],
    enabled: isAuthenticated,
  });

  const students = Array.isArray(studentsData) ? studentsData : ((studentsData as any)?.students || []);
  const totalStudents = (studentsData as any)?.total || students?.length || 0;

  // Calculate assessment scores consistently
  const calculateAssessmentScores = (student: any) => {
    const seed = parseInt(student.id.slice(-4), 16) || 1;
    const baseRating = student.codingRating || 4;
    
    const generateScore = (offset: number) => {
      const variation = ((seed * 37 + offset) % 30) - 15; // -15 to +15 variation
      return Math.max(40, Math.min(100, (baseRating * 18) + variation));
    };
    
    return {
      dsaScore: generateScore(1),
      aptitudeScore: generateScore(2),
      verbalScore: generateScore(3),
      communicationScore: generateScore(4),
      overallScore: generateScore(0)
    };
  };

  // Calculate role match percentage
  const calculateRoleMatch = (student: any, scores: any) => {
    const cgpaValue = typeof student.cgpa === 'string' ? parseFloat(student.cgpa) : student.cgpa || 7.5;
    const averageAssessmentScore = (scores.dsaScore + scores.aptitudeScore + scores.communicationScore) / 3;
    
    // Weighted calculation
    const skillWeight = 0.4;
    const cgpaWeight = 0.3;
    const overallWeight = 0.3;
    
    const rawScore = (averageAssessmentScore * skillWeight) + ((cgpaValue/10)*100 * cgpaWeight) + (scores.overallScore * overallWeight);
    return Math.min(95, Math.max(60, Math.round(rawScore) || 75));
  };

  const sortedStudents = students.map((student: any) => {
    const scores = calculateAssessmentScores(student);
    const roleMatch = calculateRoleMatch(student, scores);
    return {
      ...student,
      ...scores,
      roleMatch
    };
  }).sort((a: any, b: any) => {
    const aValue = a[sortField] || 0;
    const bValue = b[sortField] || 0;
    return sortOrder === "desc" ? bValue - aValue : aValue - bValue;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 80) return "text-blue-600 bg-blue-50";
    if (score >= 70) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getRankIcon = (score: number) => {
    if (score >= 95) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (score >= 90) return <Award className="w-4 h-4 text-blue-500" />;
    if (score >= 85) return <Target className="w-4 h-4 text-green-500" />;
    return <Zap className="w-4 h-4 text-gray-500" />;
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Access Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Please log in to access the advanced students table.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-blue-600" />
          Top Performers Dashboard
        </CardTitle>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-students"
            />
          </div>
          <Select value={universityFilter} onValueChange={setUniversityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by University" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Universities</SelectItem>
              <SelectItem value="IIT Delhi">IIT Delhi</SelectItem>
              <SelectItem value="IIT Mumbai">IIT Mumbai</SelectItem>
              <SelectItem value="NIT Trichy">NIT Trichy</SelectItem>
              <SelectItem value="BITS Pilani">BITS Pilani</SelectItem>
            </SelectContent>
          </Select>
          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="ID Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Students</SelectItem>
              <SelectItem value="verified">ID Verified Only</SelectItem>
              <SelectItem value="pending">Verification Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="w-48">Student</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 px-4 py-2"
                  onClick={() => handleSort('dsaScore')}
                >
                  <div className="flex items-center gap-1">
                    DSA Score
                    {sortField === 'dsaScore' && (
                      sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 px-4 py-2"
                  onClick={() => handleSort('aptitudeScore')}
                >
                  <div className="flex items-center gap-1">
                    Aptitude
                    {sortField === 'aptitudeScore' && (
                      sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 px-4 py-2"
                  onClick={() => handleSort('communicationScore')}
                >
                  <div className="flex items-center gap-1">
                    Communication
                    {sortField === 'communicationScore' && (
                      sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 px-4 py-2"
                  onClick={() => handleSort('cgpa')}
                >
                  <div className="flex items-center gap-1">
                    CGPA
                    {sortField === 'cgpa' && (
                      sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50 px-4 py-2"
                  onClick={() => handleSort('roleMatch')}
                >
                  <div className="flex items-center gap-1">
                    Role Match
                    {sortField === 'roleMatch' && (
                      sortOrder === 'desc' ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={9}>
                      <div className="flex items-center space-x-4">
                        <div className="skeleton h-10 w-10 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="skeleton h-4 w-48"></div>
                          <div className="skeleton h-3 w-32"></div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : sortedStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-gray-500">
                      <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>No students found matching your criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedStudents.map((student: any, index: number) => (
                  <TableRow key={student.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">
                      {((currentPage - 1) * 20) + index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={student.profileImageUrl} />
                            <AvatarFallback>
                              {student.firstName?.[0]}{student.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          {student.verified && (
                            <div className="absolute -top-1 -right-1">
                              <Shield className="w-4 h-4 text-green-500 fill-current" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {student.firstName} {student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.university} • {student.major}
                          </div>
                          <div className="text-xs text-gray-400">
                            Grad: {student.graduationYear}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(student.dsaScore)}
                        <Badge 
                          className={cn("font-mono cursor-pointer hover:shadow-md transition-shadow", getScoreColor(student.dsaScore))}
                          onClick={() => setSelectedAssessment({
                            type: 'DSA',
                            score: student.dsaScore,
                            level: student.dsaScore >= 90 ? 'Expert' : student.dsaScore >= 80 ? 'Advanced' : student.dsaScore >= 70 ? 'Intermediate' : 'Basic',
                            student: student as StudentWithSkills
                          })}
                          data-testid={`assessment-dsa-${student.id}`}
                        >
                          {student.dsaScore}
                          <Eye className="w-3 h-3 ml-1" />
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn("font-mono cursor-pointer hover:shadow-md transition-shadow", getScoreColor(student.aptitudeScore))}
                        onClick={() => setSelectedAssessment({
                          type: 'Aptitude and QA',
                          score: student.aptitudeScore,
                          level: student.aptitudeScore >= 90 ? 'Excellent' : student.aptitudeScore >= 80 ? 'Very Good' : student.aptitudeScore >= 70 ? 'Good' : 'Fair',
                          student: student as StudentWithSkills
                        })}
                        data-testid={`assessment-quantitative-${student.id}`}
                      >
                        {student.aptitudeScore}
                        <Eye className="w-3 h-3 ml-1" />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn("font-mono cursor-pointer hover:shadow-md transition-shadow", getScoreColor(student.communicationScore))}
                        onClick={() => setSelectedAssessment({
                          type: 'Interview Performance',
                          score: student.communicationScore,
                          level: student.communicationScore >= 90 ? 'Excellent' : student.communicationScore >= 80 ? 'Very Good' : student.communicationScore >= 70 ? 'Good' : 'Basic',
                          student: student as StudentWithSkills
                        })}
                        data-testid={`assessment-communication-${student.id}`}
                      >
                        {student.communicationScore}
                        <Eye className="w-3 h-3 ml-1" />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {student.cgpa?.toFixed(2) || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={cn("font-mono cursor-pointer hover:shadow-md transition-shadow flex items-center gap-1", 
                          student.roleMatch >= 85 ? 'text-green-800 bg-green-50' : 
                          student.roleMatch >= 70 ? 'text-yellow-800 bg-yellow-50' : 
                          'text-orange-800 bg-orange-50'
                        )}
                        onClick={() => setRoleMatchRationaleStudent({
                          student: student as StudentWithSkills,
                          matchPercentage: student.roleMatch
                        })}
                        data-testid={`role-match-${student.id}`}
                      >
                        {student.roleMatch}%
                        <Target className="w-3 h-3" />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge 
                          variant={student.verified ? "default" : "secondary"}
                          className="text-xs w-fit"
                        >
                          {student.verified ? "ID Verified" : "Pending"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {/* Primary Action - Select for Final Consideration */}
                        <Button
                          size="sm"
                          onClick={() => onSelectForFinalConsideration?.(student.id, `${student.firstName} ${student.lastName}`)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          data-testid={`button-select-final-${student.id}`}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Select for Final Consideration
                        </Button>
                        
                        
                        {/* Secondary Actions */}
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCodeView?.(student.id, `${student.firstName} ${student.lastName}`)}
                            data-testid={`button-view-code-${student.id}`}
                            className="flex-1"
                          >
                            <Code className="w-3 h-3 mr-1" />
                            Code
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onInterviewSchedule?.(student.id, `${student.firstName} ${student.lastName}`)}
                            data-testid={`button-schedule-interview-${student.id}`}
                            className="flex-1"
                          >
                            <Video className="w-3 h-3 mr-1" />
                            Interview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onMessage?.(student.id, `${student.firstName} ${student.lastName}`)}
                            data-testid={`button-message-${student.id}`}
                            className="flex-1"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalStudents)} of {totalStudents} students
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Badge variant="outline" className="px-3 py-1">
              {currentPage} / {Math.ceil(totalStudents / 20)}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= Math.ceil(totalStudents / 20)}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
      
      {/* Assessment Modal */}
      {selectedAssessment && (
        <AssessmentModal 
          assessment={{
            type: selectedAssessment.type,
            score: selectedAssessment.score,
            level: selectedAssessment.level
          }}
          student={selectedAssessment.student}
          onClose={() => setSelectedAssessment(null)}
        />
      )}
      
      {/* Role Match Rationale Modal */}
      {roleMatchRationaleStudent && (
        <RoleMatchRationale 
          student={roleMatchRationaleStudent.student}
          matchPercentage={roleMatchRationaleStudent.matchPercentage}
          onClose={() => setRoleMatchRationaleStudent(null)}
        />
      )}
    </Card>
  );
}