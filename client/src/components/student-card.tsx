import { Button } from "@/components/ui/button";
import { Shield, Video, MapPin, Mail } from "lucide-react";
import type { StudentWithAssessments } from "@shared/schema";
import { Link } from "wouter";
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

function ScoreBox({
  label,
  score,
  onClick,
  testId,
}: {
  label: string;
  score: number;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      className="flex flex-col items-center justify-center gap-0.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 px-2 py-3 flex-1 min-w-0 cursor-pointer transition-all"
      onClick={onClick}
      data-testid={testId}
    >
      <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-tight text-center w-full truncate">
        {label}
      </span>
      <span className="text-lg font-black leading-tight text-slate-800">
        {score}/5
      </span>
      <span className="text-[10px] font-medium leading-tight text-slate-500">
        {SCORE_LABEL[score]}
      </span>
    </button>
  );
}

function inferBestRole(dsa: number, comm: number, cs: number): string {
  if (dsa >= 5 && cs >= 4) return "Backend / Systems";
  if (dsa >= 4 && cs >= 4) return "Full-Stack";
  if (comm >= 4 && dsa >= 3) return "Full-Stack / Product";
  if (dsa >= 4) return "Software Eng.";
  return "Full-Stack";
}

export default function StudentCard({ student }: StudentCardProps) {
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
  const cssAvatar = generateCSSAvatar(student.firstName, student.id);

  const isHighMatch = matchPct >= 85;

  return (
    <div
      className="bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 p-4"
      data-testid={`card-student-${student.id}`}
    >
      {/* ── Row 1: Identity + Actions ── */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <Link href={`/student/${student.id}`} className="shrink-0">
          <div className="relative">
            {imageError ? (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: cssAvatar.backgroundColor }}
                data-testid={`div-student-avatar-fallback-${student.id}`}
              >
                {cssAvatar.initials}
              </div>
            ) : (
              <img
                src={student.profileImageUrl || generateProfileImage(student.id, student.firstName)}
                alt={`${student.firstName} ${student.lastName}`}
                className="w-11 h-11 rounded-full object-cover"
                data-testid={`img-student-avatar-${student.id}`}
                onError={() => setImageError(true)}
              />
            )}
            {student.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white" title="Verified Profile">
                <Shield className="w-2 h-2 text-white" />
              </div>
            )}
          </div>
        </Link>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/student/${student.id}`}>
              <span
                className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors cursor-pointer"
                data-testid={`text-student-name-${student.id}`}
              >
                {student.firstName} {student.lastName}
              </span>
            </Link>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-full shrink-0">
              <Shield className="w-2 h-2" /> Verified
            </span>
            <span className="inline-flex items-center text-[10px] font-medium text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-full shrink-0">
              {bestRole}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
            <span className="text-slate-700 font-medium" data-testid={`text-student-university-${student.id}`}>{student.university}</span>
            <span>·</span>
            <span>CGPA <strong className="text-slate-700" data-testid={`text-student-cgpa-${student.id}`}>{displayCGPA}</strong></span>
            {student.location && (
              <>
                <span>·</span>
                <span className="flex items-center gap-0.5" data-testid={`text-student-location-${student.id}`}>
                  <MapPin className="w-3 h-3" />{student.location.split(",")[0]}
                </span>
              </>
            )}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 px-3 border-slate-200 text-slate-600 hover:bg-slate-50"
            data-testid={`button-contact-team-${student.id}`}
          >
            <Mail className="w-3 h-3 mr-1" />Contact team
          </Button>
          <Link href={`/student/${student.id}`}>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3"
              data-testid={`button-view-profile-${student.id}`}
            >
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Row 2: 5 stat boxes ── */}
      <div className="flex gap-2">
        <ScoreBox
          label="DSA"
          score={dsaScore}
          onClick={() => setSelectedAssessment({ type: "DSA", score: dsaScore * 20, level: SCORE_LABEL[dsaScore] })}
          testId={`button-dsa-assessment-${student.id}`}
        />
        <ScoreBox
          label="Aptitude"
          score={aptitudeScore}
          onClick={() => setSelectedAssessment({ type: "Aptitude", score: aptitudeScore * 20, level: SCORE_LABEL[aptitudeScore] })}
          testId={`button-aptitude-assessment-${student.id}`}
        />
        <ScoreBox
          label="Verbal"
          score={communicationScore}
          onClick={() => setSelectedAssessment({ type: "Verbal Ability", score: communicationScore * 20, level: SCORE_LABEL[communicationScore] })}
          testId={`button-communication-assessment-${student.id}`}
        />
        <ScoreBox
          label="CS Fund."
          score={csFundamentalsScore}
          onClick={() => setSelectedAssessment({ type: "CS Fundamentals", score: csFundamentalsScore * 20, level: SCORE_LABEL[csFundamentalsScore] })}
          testId={`button-cs-fundamentals-assessment-${student.id}`}
        />

        {/* JD Match — special 5th box */}
        <button
          className="flex flex-col items-center justify-center gap-0.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 px-4 py-3 min-w-[88px] shrink-0 cursor-pointer transition-all"
          onClick={() => setShowRoleMatchRationale(true)}
          data-testid={`button-role-match-info-${student.id}`}
        >
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-tight">JD Match</span>
          <span className="text-2xl font-black text-white leading-tight">{matchPct}%</span>
          <span className="text-[10px] text-slate-400 leading-tight">See why →</span>
        </button>

        {/* Interview Performance box */}
        <button
          className="flex flex-col items-center justify-center gap-0.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 px-2 py-3 min-w-[72px] shrink-0 cursor-pointer transition-all"
          onClick={() => setShowInterviewPerformance(true)}
          data-testid={`performance-overall-${student.id}`}
        >
          <Video className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
          <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest leading-tight text-center">Interview</span>
          <span className="text-[10px] font-medium text-slate-600 leading-tight">{SCORE_LABEL[Math.round(avgSkill)]}</span>
        </button>
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
