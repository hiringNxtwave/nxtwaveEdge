import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  GraduationCap,
  Mail,
  Phone,
  ExternalLink,
  ArrowLeft,
  Video,
  FileText,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

export default function StudentProfile() {
  useScrollToTop();

  const { id } = useParams() as { id: string };
  const [, navigate] = useLocation();

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
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-white border-b border-slate-100 px-6 py-4">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <Skeleton className="h-52 w-full rounded-xl" />
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12" data-testid="text-error">
            <p className="text-slate-500 text-lg">Student not found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Parse JSON insight fields
  let strengths: string[] = [];
  let devAreas: string[] = [];
  try { strengths = JSON.parse(student.preferredRoles || "[]"); } catch {}
  try { devAreas = JSON.parse(student.preferredLocations || "[]"); } catch {}

  // Score bar helper (value 0-100)
  const ScoreBar = ({ label, score, testId }: { label: string; score: number | null; testId?: string }) => {
    if (score == null) return null;
    return (
      <div data-testid={testId}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className="text-sm font-bold text-blue-600">{score}/100</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };

  const initials = `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase();

  const hasRecordings = student.linkedinUrl || student.githubUrl;
  const hasReport = student.resumeUrl;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-800 -ml-2"
            onClick={() => navigate("/browse")}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Talent Pool
          </Button>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-700">
            {student.firstName} {student.lastName}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero card */}
        <Card className="mb-6 border-slate-200" data-testid="card-profile-header">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <Avatar className="w-20 h-20 border-2 border-blue-100">
                <AvatarFallback className="text-xl font-bold bg-blue-50 text-blue-700">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h1
                  className="text-2xl font-bold text-slate-900 mb-1"
                  data-testid="text-student-name"
                >
                  {student.firstName} {student.lastName}
                </h1>
                <p
                  className="text-sm font-medium text-blue-600 mb-3"
                  data-testid="text-student-degree"
                >
                  {student.degree || "B.Tech"} · {student.major || "Computer Science"}
                </p>

                <div className="flex flex-wrap gap-3 text-sm text-slate-500 mb-4">
                  {student.university && (
                    <div className="flex items-center gap-1.5" data-testid="text-student-university">
                      <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                      {student.university}
                    </div>
                  )}
                  {student.location && (
                    <div className="flex items-center gap-1.5" data-testid="text-student-location">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {student.location}
                    </div>
                  )}
                  {student.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      {student.email}
                    </div>
                  )}
                  {student.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      {student.phone}
                    </div>
                  )}
                </div>

                {student.assessmentCompleted && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 border font-medium hover:bg-blue-50">
                    <CheckCircle2 className="w-3 h-3 mr-1.5" />
                    NxtWave Edge Assessed
                  </Badge>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex sm:flex-col gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                  data-testid="button-contact-student"
                >
                  <Mail className="w-4 h-4 mr-1.5" />
                  Contact
                </Button>
                {hasReport && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50"
                    onClick={() => window.open(student.resumeUrl, "_blank")}
                    data-testid="button-view-resume"
                  >
                    <FileText className="w-4 h-4 mr-1.5" />
                    Report
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column – main content */}
          <div className="lg:col-span-2 space-y-6">

            {/* AI Summary */}
            {student.bio && (
              <Card className="border-slate-200" data-testid="card-about">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Candidate Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="text-sm text-slate-600 leading-relaxed"
                    data-testid="text-student-bio"
                  >
                    {student.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Assessment Scores */}
            {(student.dsaScore != null ||
              student.csFundamentalsScore != null ||
              student.aptitudeScore != null ||
              student.verbalCommunicationScore != null) && (
              <Card className="border-slate-200" data-testid="card-skills-assessment">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Assessment Scores
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Based on NxtWave Edge standardised evaluation
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ScoreBar
                      label="Data Structures & Algorithms"
                      score={student.dsaScore}
                      testId="score-dsa"
                    />
                    <ScoreBar
                      label="CS Fundamentals"
                      score={student.csFundamentalsScore}
                      testId="score-cs-fund"
                    />
                    <ScoreBar
                      label="Coding"
                      score={student.aptitudeScore}
                      testId="score-aptitude"
                    />
                    <ScoreBar
                      label="Verbal Communication"
                      score={student.verbalCommunicationScore}
                      testId="score-verbal"
                    />
                    {student.overallAssessmentScore != null && (
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-slate-800">
                            Overall Score
                          </span>
                          <span className="text-lg font-bold text-blue-600">
                            {student.overallAssessmentScore}/100
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Interview Recordings */}
            {hasRecordings && (
              <Card className="border-slate-200" data-testid="card-interview-performance">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Interview Recordings
                  </CardTitle>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Conducted by NxtWave Edge panelists
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {student.linkedinUrl && (
                      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <Video className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">TR1 — Technical Round 1</p>
                            <p className="text-xs text-slate-400">Communication & Problem Solving</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 shrink-0"
                          onClick={() => window.open(student.linkedinUrl, "_blank")}
                          data-testid="button-tr1-recording"
                        >
                          View Recording
                          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </div>
                    )}
                    {student.githubUrl && (
                      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <Video className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">TR2 — Technical Round 2</p>
                            <p className="text-xs text-slate-400">Deep Technical & Domain Skills</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-200 text-blue-700 hover:bg-blue-50 shrink-0"
                          onClick={() => window.open(student.githubUrl, "_blank")}
                          data-testid="button-tr2-recording"
                        >
                          View Recording
                          <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right column – insights */}
          <div className="space-y-6">

            {/* AI Strengths */}
            {strengths.length > 0 && (
              <Card className="border-slate-200" data-testid="card-strengths">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-600 leading-snug">{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Development Areas */}
            {devAreas.length > 0 && (
              <Card className="border-slate-200" data-testid="card-dev-areas">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Development Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {devAreas.map((d, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span className="text-sm text-slate-600 leading-snug">{d}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Assessment Report */}
            {hasReport && (
              <Card className="border-slate-200" data-testid="card-report">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Assessment Report
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => window.open(student.resumeUrl, "_blank")}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Full Report
                    <ExternalLink className="w-3.5 h-3.5 ml-2" />
                  </Button>
                  <p className="text-xs text-slate-400 text-center mt-2">
                    Detailed NxtWave Edge evaluation
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
