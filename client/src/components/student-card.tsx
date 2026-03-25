import { Shield, MapPin, ArrowRight } from "lucide-react";
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
      {label} <span className="font-bold tabular-nums">{value}</span><span className="opacity-40 font-normal">/100</span>
    </button>
  );
}

const VERDICT_STYLE: Record<string, string> = {
  "Strong Hire": "bg-blue-600 text-white",
  "Hire":        "bg-slate-100 text-slate-700 border border-slate-200",
  "Weak Hire":   "bg-slate-50  text-slate-500 border border-slate-200",
};

export default function StudentCard({ student }: StudentCardProps) {
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
        className="group bg-white border border-slate-100 rounded-lg hover:border-blue-200 hover:shadow-md transition-all duration-150 cursor-pointer"
        data-testid={`card-student-${student.id}`}
      >
        <div className="px-4 py-3 flex items-center gap-4">

          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-base"
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

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Row 1: Name + verdict + score */}
            <div className="flex items-center gap-2">
              <span
                className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-blue-700 transition-colors truncate"
                data-testid={`text-student-name-${student.id}`}
              >
                {student.firstName} {student.lastName}
              </span>
              {verdict && VERDICT_STYLE[verdict] && (
                <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${VERDICT_STYLE[verdict]}`}>
                  {verdict}
                </span>
              )}
            </div>

            {/* Row 2: Role · University · Location */}
            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400 flex-wrap">
              <span className="text-blue-600 font-medium">{bestRole}</span>
              <span>·</span>
              <span
                className="truncate max-w-[180px]"
                data-testid={`text-student-university-${student.id}`}
              >
                {uniShort}
              </span>
              {student.location && (
                <>
                  <span>·</span>
                  <span
                    className="flex items-center gap-0.5"
                    data-testid={`text-student-location-${student.id}`}
                  >
                    <MapPin className="w-2.5 h-2.5" />
                    {student.location.split(",")[0]}
                  </span>
                </>
              )}
            </div>

            {/* Row 3: Score pills */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
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
          </div>

          {/* Right: Overall score + View Profile */}
          <div className="shrink-0 flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-xl font-black text-slate-900 leading-none tabular-nums">{overall}</div>
              <div className="text-[9px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">Score</div>
            </div>
            <div
              className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 group-hover:gap-1.5 transition-all"
              data-testid={`button-view-profile-${student.id}`}
            >
              View Profile <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

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
