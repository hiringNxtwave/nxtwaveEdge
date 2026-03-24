import { Button } from "@/components/ui/button";
import { Check, Plus, Shield, Video, ChevronRight, MapPin, GraduationCap } from "lucide-react";
import type { StudentWithAssessments } from "@shared/schema";
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
  student: StudentWithAssessments;
  showFullInfo?: boolean;
}

const generateProfileImage = (studentId: string, firstName: string) => {
  const seed = parseInt(studentId.slice(-8), 16);
  const colors = ["3B82F6","1D4ED8","0369A1","4F46E5","7C3AED","6366F1","0284C7","2563EB","1E40AF","3730A3"];
  const backgrounds = ["EFF6FF","EEF2FF","F0F9FF","F5F3FF","EDE9FE","DBEAFE","E0E7FF","BFDBFE","C7D2FE","BAE6FD"];
  const colorIndex = seed % colors.length;
  const bgIndex = (seed + 3) % backgrounds.length;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName)}&size=200&background=${backgrounds[bgIndex]}&color=${colors[colorIndex]}&bold=true&font-size=0.4`;
};

const generateCSSAvatar = (firstName: string, studentId: string) => {
  const seed = parseInt(studentId.slice(-8), 16);
  const colors = ["#2563EB","#1D4ED8","#3B82F6","#4F46E5","#0369A1","#7C3AED","#0284C7","#6366F1","#1E40AF","#3730A3"];
  return { initials: firstName.charAt(0).toUpperCase(), backgroundColor: colors[seed % colors.length] };
};

const generateRealisticCGPA = (studentId: string, baseCGPA?: string) => {
  if (baseCGPA && baseCGPA !== "9.99" && parseFloat(baseCGPA) >= 6.0 && parseFloat(baseCGPA) <= 10.0) return baseCGPA;
  const seed = parseInt(studentId.slice(-8), 16);
  const variants = ["8.7","8.9","8.2","9.1","8.5","7.8","8.3","9.2","8.8","7.9","8.6","9.0","8.1","8.4","7.5","9.3","8.0","7.7","8.9","9.4","8.3","7.6","8.8","9.1","8.2","7.9","8.5","8.7","9.0","8.4"];
  return variants[seed % variants.length];
};

const SCORE_LABEL: Record<number, string> = { 5: "Excellent", 4: "Strong", 3: "Good", 2: "Fair", 1: "Basic" };

function ScoreBar({ label, score, onClick, testId }: { label: string; score: number; onClick: () => void; testId: string }) {
  const pct = (score / 5) * 100;
  const color = score >= 4 ? "bg-blue-500" : score >= 3 ? "bg-slate-400" : "bg-slate-300";
  return (
    <button
      className="w-full text-left group"
      onClick={onClick}
      data-testid={testId}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <span className={`text-xs font-bold ${score >= 4 ? "text-blue-600" : "text-slate-500"}`}>
          {score}/5 <span className="font-normal text-slate-400">· {SCORE_LABEL[score]}</span>
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 group-hover:bg-slate-200 transition-colors">
        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </button>
  );
}

function inferBestRole(dsa: number, comm: number, cs: number): string {
  if (dsa >= 5 && cs >= 4) return "Backend / Systems";
  if (dsa >= 4 && cs >= 4) return "Full-Stack Engineer";
  if (comm >= 4 && dsa >= 3) return "Full-Stack / Product";
  if (dsa >= 4) return "Software Engineering";
  return "Full-Stack Engineer";
}

export default function StudentCard({ student }: StudentCardProps) {
  const { isShortlisted, addToShortlist, removeFromShortlist } = useShortlist();
  const [selectedAssessment, setSelectedAssessment] = useState<{type: string; score: number; level: string} | null>(null);
  const [showRoleMatchRationale, setShowRoleMatchRationale] = useState(false);
  const [showCandidateFullReport, setShowCandidateFullReport] = useState(false);
  const [showCodeReplay, setShowCodeReplay] = useState(false);
  const [showCommunicationSample, setShowCommunicationSample] = useState(false);
  const [showExamFootage, setShowExamFootage] = useState(false);
  const [showInterviewPerformance, setShowInterviewPerformance] = useState(false);
  const [imageError, setImageError] = useState(false);

  const seed = parseInt(student.id.slice(-8), 16);
  const overallRating = 4;

  const skillScore = (offset: number) => {
    const variation = ((seed * 37 + offset) % 3) - 1;
    return Math.max(1, Math.min(5, overallRating + variation));
  };

  const dsaScore = skillScore(1);
  const aptitudeScore = skillScore(2);
  const communicationScore = skillScore(3);
  const csFundamentalsScore = skillScore(4);
  const avgSkill = (dsaScore + aptitudeScore + communicationScore + csFundamentalsScore) / 4;

  const displayCGPA = generateRealisticCGPA(student.id, student.cgpa || undefined);
  const cgpaRaw = typeof student.cgpa === "string" ? parseFloat(student.cgpa) : student.cgpa;
  const cgpaScore = ((cgpaRaw || 7.5) / 10) * 5;
  const rawMatch = avgSkill * 0.4 + cgpaScore * 0.3 + overallRating * 0.3;
  const matchPct = Math.min(95, Math.max(60, Math.round(rawMatch * 20) || 75));

  const bestRole = inferBestRole(dsaScore, communicationScore, csFundamentalsScore);
  const shortlisted = isShortlisted(student.id);
  const cssAvatar = generateCSSAvatar(student.firstName, student.id);

  const matchColor = matchPct >= 85 ? "text-blue-600" : matchPct >= 70 ? "text-slate-700" : "text-slate-600";
  const matchBarColor = matchPct >= 85 ? "bg-blue-500" : "bg-slate-400";

  return (
    <div
      className="bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200"
      data-testid={`card-student-${student.id}`}
    >
      <div className="p-5 flex gap-5">

        {/* ── LEFT: Identity ── */}
        <div className="flex flex-col items-start gap-3 w-[220px] shrink-0">
          {/* Avatar + verified */}
          <Link href={`/student/${student.id}`} className="flex items-center gap-3 w-full group">
            <div className="relative shrink-0">
              {imageError ? (
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base"
                  style={{ backgroundColor: cssAvatar.backgroundColor }}
                  data-testid={`div-student-avatar-fallback-${student.id}`}
                >
                  {cssAvatar.initials}
                </div>
              ) : (
                <img
                  src={student.profileImageUrl || generateProfileImage(student.id, student.firstName)}
                  alt={`${student.firstName} ${student.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                  data-testid={`img-student-avatar-${student.id}`}
                  onError={() => setImageError(true)}
                />
              )}
              {student.verified && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white" title="Verified Profile">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors truncate" data-testid={`text-student-name-${student.id}`}>
                {student.firstName} {student.lastName}
              </p>
              <p className="text-xs text-blue-600 font-medium truncate mt-0.5" data-testid={`text-student-university-${student.id}`}>
                {student.university}
              </p>
            </div>
          </Link>

          {/* Meta chips */}
          <div className="flex flex-col gap-1.5 w-full">
            {student.nirfRanking && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500">NIRF Rank <span className="font-semibold text-slate-700">#{student.nirfRanking}</span></span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">CGPA</span>
              <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded" data-testid={`text-student-cgpa-${student.id}`}>{displayCGPA}</span>
            </div>
            {student.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-500 truncate" data-testid={`text-student-location-${student.id}`}>{student.location.split(",")[0]}</span>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
              <Shield className="w-2.5 h-2.5" /> Offline Verified
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
              Best for: {bestRole}
            </span>
          </div>
        </div>

        {/* ── MIDDLE: Assessment Scores ── */}
        <div className="flex-1 min-w-0 border-l border-slate-100 pl-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Assessment Scores</p>
          <div className="space-y-3">
            <ScoreBar
              label="DSA & Problem Solving"
              score={dsaScore}
              onClick={() => setSelectedAssessment({ type: "DSA", score: dsaScore * 20, level: SCORE_LABEL[dsaScore] })}
              testId={`button-dsa-assessment-${student.id}`}
            />
            <ScoreBar
              label="Aptitude & Reasoning"
              score={aptitudeScore}
              onClick={() => setSelectedAssessment({ type: "Aptitude", score: aptitudeScore * 20, level: SCORE_LABEL[aptitudeScore] })}
              testId={`button-aptitude-assessment-${student.id}`}
            />
            <ScoreBar
              label="Verbal & Communication"
              score={communicationScore}
              onClick={() => setSelectedAssessment({ type: "Verbal Ability", score: communicationScore * 20, level: SCORE_LABEL[communicationScore] })}
              testId={`button-communication-assessment-${student.id}`}
            />
            <ScoreBar
              label="CS Fundamentals"
              score={csFundamentalsScore}
              onClick={() => setSelectedAssessment({ type: "CS Fundamentals", score: csFundamentalsScore * 20, level: SCORE_LABEL[csFundamentalsScore] })}
              testId={`button-cs-fundamentals-assessment-${student.id}`}
            />
          </div>

          {/* Interview row */}
          <button
            className="mt-3 w-full flex items-center justify-between bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 py-2 transition-colors"
            onClick={() => setShowInterviewPerformance(true)}
            data-testid={`performance-overall-${student.id}`}
          >
            <span className="flex items-center gap-2 text-xs font-semibold">
              <Video className="w-3.5 h-3.5 text-slate-300" />
              Live Interview Performance
            </span>
            <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
              {SCORE_LABEL[Math.round(avgSkill)]} <ChevronRight className="w-3 h-3" />
            </span>
          </button>
        </div>

        {/* ── RIGHT: Match + Actions ── */}
        <div className="w-[160px] shrink-0 border-l border-slate-100 pl-5 flex flex-col gap-4">
          {/* Match percentage */}
          <button
            className="text-left group"
            onClick={() => setShowRoleMatchRationale(true)}
            data-testid={`button-role-match-info-${student.id}`}
          >
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">JD Match</p>
            <p className={`text-4xl font-black leading-none mb-1 ${matchColor}`}>{matchPct}%</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1">
              <div className={`${matchBarColor} h-1.5 rounded-full`} style={{ width: `${matchPct}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 group-hover:text-blue-500 transition-colors">See breakdown →</p>
          </button>

          {/* Actions */}
          <div className="flex flex-col gap-2 mt-auto">
            <Link href={`/student/${student.id}`}>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-8"
                data-testid={`button-view-profile-${student.id}`}
              >
                View Full Profile
              </Button>
            </Link>
            <Button
              className={`w-full text-xs font-semibold h-8 ${
                shortlisted
                  ? "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
              variant="outline"
              onClick={() => shortlisted ? removeFromShortlist(student.id) : addToShortlist(student.id)}
              data-testid={`button-shortlist-${student.id}`}
            >
              {shortlisted ? (
                <><Check className="w-3 h-3 mr-1.5" />Shortlisted</>
              ) : (
                <><Plus className="w-3 h-3 mr-1.5" />Shortlist</>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedAssessment && (
        <AssessmentModal assessment={selectedAssessment} student={student} onClose={() => setSelectedAssessment(null)} />
      )}
      {showRoleMatchRationale && (
        <RoleMatchRationale student={student} matchPercentage={matchPct} onClose={() => setShowRoleMatchRationale(false)} />
      )}
      {showCandidateFullReport && (
        <CandidateFullReport student={student} isOpen={showCandidateFullReport} onClose={() => setShowCandidateFullReport(false)} />
      )}
      {showCodeReplay && (
        <CodeReplayModal student={student} isOpen={showCodeReplay} onClose={() => setShowCodeReplay(false)} />
      )}
      {showCommunicationSample && (
        <CommunicationSampleModal student={student} isOpen={showCommunicationSample} onClose={() => setShowCommunicationSample(false)} />
      )}
      {showExamFootage && (
        <ExamFootageModal student={student} isOpen={showExamFootage} onClose={() => setShowExamFootage(false)} />
      )}
      {showInterviewPerformance && (
        <InterviewPerformanceModal student={student} isOpen={showInterviewPerformance} onClose={() => setShowInterviewPerformance(false)} />
      )}
    </div>
  );
}
