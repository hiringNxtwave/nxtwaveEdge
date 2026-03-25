import { Shield, MapPin, ArrowRight, Mail } from "lucide-react";
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

const generateCSSAvatar = (firstName: string, studentId: string) => {
  const seed = parseInt(studentId.slice(-8), 16);
  const colors = ["#2563EB","#1D4ED8","#3B82F6","#4F46E5","#0369A1","#7C3AED","#0284C7","#6366F1","#1E40AF","#3730A3"];
  return {
    initials: `${firstName.charAt(0)}`.toUpperCase(),
    backgroundColor: colors[seed % colors.length],
  };
};

function inferBestRole(dsa: number, comm: number, cs: number): string {
  if (dsa >= 80 && cs >= 70) return "Backend / Systems";
  if (dsa >= 70 && cs >= 70) return "Full-Stack";
  if (comm >= 70 && dsa >= 60) return "Full-Stack / Product";
  if (dsa >= 70) return "Software Eng.";
  return "Full-Stack";
}

// Resolve real scores (0-100 from DB) or fall back to computed
function resolveScores(student: StudentWithAssessments, seed: number) {
  const compute = (offset: number) => {
    const variation = ((seed * 37 + offset) % 3) - 1;
    return Math.max(1, Math.min(5, 4 + variation)) * 20;
  };
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
  const getColor = (v: number) =>
    v >= 80
      ? "text-blue-700 bg-blue-50 border-blue-200"
      : v >= 60
      ? "text-slate-700 bg-slate-50 border-slate-200"
      : "text-slate-500 bg-white border-slate-200";

  return (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all hover:scale-105 ${getColor(value)}`}
      data-testid={testId}
      title={`${label}: ${value}/100`}
    >
      {label}
      <span className="font-bold">{value}</span>
    </button>
  );
}

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
  const cssAvatar = generateCSSAvatar(student.firstName, student.id);
  const bestRole = inferBestRole(scores.dsa, scores.verbal, scores.csFund);

  // University abbreviation — use up to 3 words max
  const uniShort = (student.university || "")
    .replace(/\s*-\s*[A-Za-z\s,]+$/, "")  // strip city suffix
    .split(" ")
    .slice(0, 5)
    .join(" ");

  const scoreLabel = (v: number) =>
    v >= 80 ? "Excellent" : v >= 65 ? "Good" : v >= 50 ? "Fair" : "Basic";

  return (
    <Link href={`/student/${student.id}`}>
      <div
        className="group bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer overflow-hidden"
        data-testid={`card-student-${student.id}`}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
                style={{ backgroundColor: cssAvatar.backgroundColor }}
                data-testid={`div-student-avatar-fallback-${student.id}`}
              >
                {cssAvatar.initials}
              </div>
              {student.verified && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white"
                  title="NxtWave Edge Verified"
                >
                  <Shield className="w-2 h-2 text-white" />
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p
                    className="font-bold text-slate-900 text-sm leading-tight group-hover:text-blue-600 transition-colors truncate"
                    data-testid={`text-student-name-${student.id}`}
                  >
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-[11px] text-blue-600 font-semibold mt-0.5">{bestRole}</p>
                </div>

                {/* Overall score badge */}
                <div className="shrink-0 text-right">
                  <div className="text-2xl font-black text-slate-900 leading-none">{overall}</div>
                  <div className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">
                    {scoreLabel(overall)}
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400 flex-wrap">
                <span
                  className="truncate max-w-[160px]"
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
            </div>
          </div>

          {/* Score pills row */}
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
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

            {/* View Profile CTA — pushes to right */}
            <div className="ml-auto flex items-center gap-1">
              <button
                onClick={(e) => { e.preventDefault(); }}
                className="p-1.5 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                title="Contact team"
                data-testid={`button-contact-team-${student.id}`}
              >
                <Mail className="w-3.5 h-3.5" />
              </button>
              <div
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform"
                data-testid={`button-view-profile-${student.id}`}
              >
                View Profile
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent bar on hover */}
        <div className="h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
      </div>

      {/* Modals — outside the card Link to avoid nested anchors */}
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
