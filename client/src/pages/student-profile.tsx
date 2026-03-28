import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap, ExternalLink, ArrowLeft, Video,
  FileText, CheckCircle2, Star, Mail, Check,
} from "lucide-react";

type Tab = "assessment" | "interview1" | "interview2" | "verdict";

const AVATAR_COLORS = [
  "#1D4ED8","#1E40AF","#2563EB","#0369A1","#0284C7",
  "#4F46E5","#3730A3","#6366F1","#7C3AED","#0F172A",
];

const VERDICT_MAP: Record<string, { label: string; className: string }> = {
  "Strong Hire": { label: "VERY STRONG", className: "bg-blue-700 text-white" },
  "Hire":        { label: "HIRE",        className: "bg-blue-100 text-blue-800" },
  "Weak Hire":   { label: "WEAK HIRE",   className: "bg-slate-100 text-slate-600" },
};

export default function StudentProfile() {
  useScrollToTop();

  const { id } = useParams() as { id: string };
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("assessment");
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  async function handleContactUs() {
    if (isSendingContact || contactSent) return;
    setIsSendingContact(true);
    try {
      const res = await fetch("/api/contact-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: id }),
      });
      if (!res.ok) throw new Error("Failed");
      setContactSent(true);
      toast({ title: "Request sent!", description: "Our team will reach out to you shortly." });
    } catch {
      toast({ title: "Error", description: "Could not send request. Please try again.", variant: "destructive" });
    } finally {
      setIsSendingContact(false);
    }
  }

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
      <div className="min-h-screen bg-[#F4F6F8]">
        <div className="bg-white border-b border-slate-100 px-6 py-4">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex gap-6">
            <Skeleton className="h-[560px] w-72 rounded-2xl flex-shrink-0" />
            <Skeleton className="h-[560px] flex-1 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-[#F4F6F8]">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12" data-testid="text-error">
            <p className="text-slate-500 text-lg">Student not found.</p>
          </div>
        </div>
      </div>
    );
  }

  let strengths: string[] = [];
  try { strengths = JSON.parse(student.preferredRoles || "[]"); } catch {}

  const initials = `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase();
  const bgColor = AVATAR_COLORS[parseInt(student.id.slice(-8), 16) % AVATAR_COLORS.length];
  const verdict = VERDICT_MAP[student.recommendation as string];

  const metrics = [
    { label: "DSA & Problem Solving",   score: student.dsaScore as number | null },
    { label: "CS Fundamentals",          score: student.csFundamentalsScore as number | null },
    { label: "Coding",                   score: student.aptitudeScore as number | null },
    { label: "Communication",            score: student.verbalCommunicationScore as number | null },
  ].filter(m => m.score != null) as { label: string; score: number }[];

  const tabs: { key: Tab; label: string }[] = [
    { key: "assessment",  label: "Assessment" },
    { key: "interview1",  label: "Interview 1: DSA" },
    { key: "interview2",  label: "Interview 2: Projects" },
    { key: "verdict",     label: "Final Verdict" },
  ];

  const scoreRows = [
    { label: "Overall Score",   value: student.overallAssessmentScore != null ? String(student.overallAssessmentScore) : null },
    { label: "Coding Score",    value: student.aptitudeScore != null ? `${student.aptitudeScore}/100` : null },
    { label: "DSA Score",       value: student.dsaScore != null ? `${student.dsaScore}/100` : null },
    { label: "CS Fundamentals", value: student.csFundamentalsScore != null ? `${student.csFundamentalsScore}/100` : null },
    { label: "Communication",   value: student.verbalCommunicationScore != null ? `${student.verbalCommunicationScore}/100` : null },
  ].filter(r => r.value != null) as { label: string; value: string }[];


  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-800 -ml-2"
            onClick={() => window.history.back()}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT PANEL ── */}
          <div className="lg:w-72 flex-shrink-0 flex flex-col gap-4">

            {/* Identity */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm" data-testid="card-profile-header">
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm"
                  style={{ backgroundColor: bgColor }}
                >
                  {initials}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900 leading-tight" data-testid="text-student-name">
                    {student.firstName} {student.lastName}
                  </h1>
                  <p className="text-xs font-medium text-blue-600 mt-0.5" data-testid="text-student-degree">
                    {student.degree || "B.Tech"} · {student.major || "Computer Science"}
                  </p>
                  {student.university && (
                    <p className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1" data-testid="text-student-university">
                      <GraduationCap className="w-3 h-3 shrink-0" />
                      {student.university}
                    </p>
                  )}
                </div>

                {verdict && (
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full tracking-wide ${verdict.className}`}>
                    {verdict.label}
                  </span>
                )}

                {student.assessmentCompleted && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    NxtWave Edge Assessed
                  </span>
                )}
              </div>
            </div>

            {/* Performance Metrics */}
            {metrics.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm" data-testid="card-skills-assessment">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                  Performance Metrics
                </p>
                <div className="space-y-4">
                  {metrics.map(m => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-slate-700">{m.label}</span>
                        <span className="text-xs font-bold text-slate-900 tabular-nums">{m.score}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full transition-all"
                          style={{ width: `${Math.min(m.score, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {student.overallAssessmentScore != null && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Overall Score</span>
                      <span className="text-sm font-black text-blue-600">
                        {student.overallAssessmentScore}/100
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Best Fit Roles */}
            {strengths.length > 0 && (
              <div className="bg-slate-900 rounded-2xl p-5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  Best Fit Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {strengths.slice(0, 4).map((s, i) => (
                    <span key={i} className="text-[11px] bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact CTA */}
            <button
              onClick={handleContactUs}
              disabled={isSendingContact || contactSent}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-3 rounded-xl transition-colors shadow-sm"
            >
              {contactSent ? (
                <><Check className="w-4 h-4" /> Request Sent</>
              ) : isSendingContact ? (
                <><Mail className="w-4 h-4 animate-pulse" /> Sending…</>
              ) : (
                <><Mail className="w-4 h-4" /> Interested? Contact Us</>
              )}
            </button>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Tabbed card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Tab bar */}
              <div className="flex border-b border-slate-100 overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-3.5 text-[13px] font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.key
                        ? "text-blue-600 border-b-2 border-blue-600 -mb-px bg-white"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">

                {/* ── Assessment ── */}
                {activeTab === "assessment" && (
                  <div>
                    <h2 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      </span>
                      Detailed Score Breakdown
                    </h2>

                    <div className="rounded-xl border border-slate-100 overflow-hidden mb-5">
                      <div className="grid grid-cols-2 bg-slate-50 px-5 py-2.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Assessment</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-right">Score</span>
                      </div>
                      {scoreRows.map((row, i) => (
                        <div key={i} className="grid grid-cols-2 px-5 py-3.5 border-t border-slate-100">
                          <span className="text-sm text-slate-700">{row.label}</span>
                          <span className="text-sm font-semibold text-slate-900 text-right tabular-nums">{row.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Resource links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {student.resumeUrl && student.resumeUrl.includes("topin.tech") && (
                        <a
                          href={student.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Assessment Report</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </a>
                      )}
                      {student.linkedinUrl && (
                        <a
                          href={student.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group"
                          data-testid="button-tr1-recording"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                              <span className="font-mono text-[10px] font-bold text-slate-600">&lt;/&gt;</span>
                            </div>
                            <span className="text-sm font-medium text-slate-700">TR1 Recording</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </a>
                      )}
                      {student.githubUrl && (
                        <a
                          href={student.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group"
                          data-testid="button-tr2-recording"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                              <span className="font-mono text-[10px] font-bold text-slate-600">&lt;/&gt;</span>
                            </div>
                            <span className="text-sm font-medium text-slate-700">TR2 Recording</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* ── Interview 1 ── */}
                {activeTab === "interview1" && (
                  <div>
                    <h2 className="text-base font-bold text-slate-900 mb-1">Interview 1: DSA</h2>
                    <p className="text-sm text-slate-500 mb-6">Technical Round 1: Communication & Problem Solving</p>
                    {student.linkedinUrl ? (
                      <a
                        href={student.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        View Recording
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="py-14 text-center text-slate-300">
                        <Video className="w-12 h-12 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">Recording not available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Interview 2 ── */}
                {activeTab === "interview2" && (
                  <div>
                    <h2 className="text-base font-bold text-slate-900 mb-1">Interview 2: Projects</h2>
                    <p className="text-sm text-slate-500 mb-6">Technical Round 2: Deep Technical & Domain Skills</p>
                    {student.githubUrl ? (
                      <a
                        href={student.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        View Recording
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="py-14 text-center text-slate-300">
                        <Video className="w-12 h-12 mx-auto mb-3" />
                        <p className="text-sm text-slate-400">Recording not available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Final Verdict ── */}
                {activeTab === "verdict" && (
                  <div>
                    <h2 className="text-base font-bold text-slate-900 mb-5">Final Verdict</h2>
                    <div className="rounded-xl border border-slate-100 p-5 bg-slate-50 space-y-3">
                      <div className="flex items-center gap-3">
                        {verdict && (
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${verdict.className}`}>
                            {verdict.label}
                          </span>
                        )}
                        <span className="text-sm text-slate-500">NxtWave Edge Recommendation</span>
                      </div>
                      {student.bio && (
                        <p className="text-sm text-slate-600 leading-relaxed" data-testid="text-student-bio">
                          {student.bio}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Candidate summary (shown outside verdict tab) */}
            {student.bio && activeTab !== "verdict" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5" data-testid="card-about">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Candidate Summary</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{student.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
