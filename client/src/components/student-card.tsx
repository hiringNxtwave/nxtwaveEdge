import { Shield, ArrowRight, Sparkles, Mail } from "lucide-react";
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
  matchScore?: number;
}

const AVATAR_COLORS = [
  "#1D4ED8","#1E40AF","#2563EB","#0369A1","#0284C7",
  "#4F46E5","#3730A3","#6366F1","#7C3AED","#0F172A",
];

const generateAvatar = (firstName: string, studentId: string) => ({
  initials: firstName.charAt(0).toUpperCase(),
  backgroundColor: AVATAR_COLORS[parseInt(studentId.slice(-8), 16) % AVATAR_COLORS.length],
});

function inferBestRole(dsa: number, comm: number, cs: number): string {
  if (dsa >= 80 && cs >= 70) return "Backend / Systems";
  if (dsa >= 70 && cs >= 70) return "Full-Stack";
  if (comm >= 70 && dsa >= 60) return "Full-Stack / Product";
  if (dsa >= 70) return "Software Engineer";
  return "Full-Stack Engineer";
}

function resolveScores(student: StudentWithAssessments, seed: number) {
  const compute = (offset: number) =>
    Math.max(1, Math.min(5, 4 + ((seed * 37 + offset) % 3) - 1)) * 20;
  return {
    dsa: student.dsaScore ?? compute(1),
    aptitude: student.aptitudeScore ?? compute(2),
    verbal: student.verbalCommunicationScore ?? compute(3),
    csFund: student.csFundamentalsScore ?? compute(4),
  };
}

function ScorePill({
  label,
  value,
  onClick,
  testId,
}: {
  label: string;
  value: number;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-medium transition-colors hover:bg-slate-100"
      data-testid={testId}
      title={`${label}: ${value}/100`}
    >
      {label} <span className="font-bold tabular-nums">{value}</span>
      <span className="opacity-40 font-normal">/100</span>
    </button>
  );
}

const VERDICT_STYLE: Record<string, string> = {
  "Strong Hire": "bg-blue-600 text-white",
  "Hire":        "bg-slate-100 text-slate-700 border border-slate-200",
  "Weak Hire":   "bg-slate-50  text-slate-500 border border-slate-200",
};

export default function StudentCard({ student, matchScore }: StudentCardProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<{type: string; score: number; level: string} | null>(null);
  const [showRoleMatchRationale, setShowRoleMatchRationale] = useState(false);
  const [showCandidateFullReport, setShowCandidateFullReport] = useState(false);
  const [showCodeReplay, setShowCodeReplay] = useState(false);
  const [showCommunicationSample, setShowCommunicationSample] = useState(false);
  const [showExamFootage, setShowExamFootage] = useState(false);
  const [showInterviewPerformance, setShowInterviewPerformance] = useState(false);

  const seed = parseInt(student.id.slice(-8), 16);
  const scores = resolveScores(student, seed);
  const avg = Math.round((scores.dsa + scores.aptitude + scores.verbal + scores.csFund) / 4);
  const overall = student.overallAssessmentScore ?? avg;
  const avatar = generateAvatar(student.firstName, student.id);
  const bestRole = inferBestRole(scores.dsa, scores.verbal, scores.csFund);

  const uniShort = (student.university || "")
    .replace(/\s*-\s*[A-Za-z\s,]+$/, "")
    .split(" ")
    .slice(0, 5)
    .join(" ");

  const scoreLabel = (v: number) =>
    v >= 80 ? "Excellent" : v >= 65 ? "Good" : v >= 50 ? "Fair" : "Basic";

  const verdict = student.recommendation as string | undefined;

  return (
    <Link href={`/student/${student.id}`}>
      <div
        className="group bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all duration-150 cursor-pointer p-5 flex flex-col h-full"
        data-testid={`card-student-${student.id}`}
      >
        {/* Top: Avatar + Name + Verdict */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative shrink-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base"
              style={{ backgroundColor: avatar.backgroundColor }}
              data-testid={`div-student-avatar-fallback-${student.id}`}
            >
              {avatar.initials}
            </div>
            {student.verified && (
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white"
                title="NxtWave Edge Verified"
              >
                <Shield className="w-2 h-2 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div
              className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-blue-700 transition-colors truncate"
              data-testid={`text-student-name-${student.id}`}
            >
              {student.firstName} {student.lastName}
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-0.5 truncate">
              {bestRole}
            </div>
            <div
              className="text-[11px] text-slate-400 mt-0.5 truncate"
              data-testid={`text-student-university-${student.id}`}
            >
              {uniShort}
            </div>
          </div>

          {verdict && VERDICT_STYLE[verdict] && (
            <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${VERDICT_STYLE[verdict]}`}>
              {verdict}
            </span>
          )}
        </div>

        {/* Score pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <ScorePill
            label="DSA"
            value={scores.dsa}
            onClick={() => setSelectedAssessment({ type: "DSA", score: scores.dsa, level: scoreLabel(scores.dsa) })}
            testId={`button-dsa-assessment-${student.id}`}
          />
          <ScorePill
            label="CS"
            value={scores.csFund}
            onClick={() => setSelectedAssessment({ type: "CS Fundamentals", score: scores.csFund, level: scoreLabel(scores.csFund) })}
            testId={`button-cs-fundamentals-assessment-${student.id}`}
          />
          <ScorePill
            label="Verbal"
            value={scores.verbal}
            onClick={() => setSelectedAssessment({ type: "Verbal Ability", score: scores.verbal, level: scoreLabel(scores.verbal) })}
            testId={`button-communication-assessment-${student.id}`}
          />
          <ScorePill
            label="Coding"
            value={scores.aptitude}
            onClick={() => setSelectedAssessment({ type: "Aptitude", score: scores.aptitude, level: scoreLabel(scores.aptitude) })}
            testId={`button-aptitude-assessment-${student.id}`}
          />
        </div>

        {/* Match % badge — only when job match active */}
        {matchScore !== undefined && (
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              <Sparkles className="w-2.5 h-2.5" />
              {matchScore}% match
            </span>
          </div>
        )}

        {/* Bottom: Overall score + actions */}
        <div className="mt-auto pt-3 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 tabular-nums leading-none">{overall}</span>
              <span className="text-[10px] text-slate-400 font-medium">/100</span>
            </div>
            <div
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 group-hover:gap-1.5 transition-all"
              data-testid={`button-view-profile-${student.id}`}
            >
              View Profile <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <a
            href={`mailto:leadgenplacements@gmail.com?subject=${encodeURIComponent(`Interested in ${student.firstName} ${student.lastName} — NxtWave Edge`)}`}
            onClick={e => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Mail className="w-3 h-3" />
            Interested? Contact Us
          </a>
        </div>
      </div>

      {/* Modals — outside Link to avoid nested anchors */}
      {selectedAssessment && (
        <AssessmentModal assessment={selectedAssessment} student={student} onClose={() => setSelectedAssessment(null)} />
      )}
      {showRoleMatchRationale && (
        <RoleMatchRationale student={student} matchPercentage={80} onClose={() => setShowRoleMatchRationale(false)} />
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
    </Link>
  );
}
