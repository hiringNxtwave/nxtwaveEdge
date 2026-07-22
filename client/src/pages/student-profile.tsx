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
  MapPin, Building2, Award, TrendingUp, Code2,
  Globe, Github,
} from "lucide-react";

type Tab = "assessment" | "interview1" | "interview2" | "verdict";

const AVATAR_COLORS = [
  "#1D4ED8","#1E40AF","#2563EB","#0369A1","#0284C7",
  "#4F46E5","#3730A3","#6366F1","#7C3AED","#0F172A",
];

const VERDICT_MAP: Record<string, { label: string; className: string }> = {
  "Strong Hire": { label: "VERY STRONG", className: "bg-primary text-primary-foreground" },
  "Hire":        { label: "HIRE",        className: "bg-primary/10 text-primary" },
  "Weak Hire":   { label: "WEAK HIRE",   className: "bg-muted text-muted-foreground" },
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
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card px-6 py-3">
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="h-[600px] w-full md:w-80 rounded-xl flex-shrink-0" />
            <Skeleton className="h-[600px] flex-1 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="empty-state" data-testid="text-error">
            <div className="empty-state-icon">
              <GraduationCap className="w-6 h-6" />
            </div>
            <p className="empty-state-title">Student not found</p>
            <p className="empty-state-description">The profile you're looking for doesn't exist or has been removed.</p>
            <Button variant="outline" onClick={() => window.history.back()} className="mt-2">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Go Back
            </Button>
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
    { label: "DSA & Problem Solving",   score: student.dsaScore as number | null, icon: Code2 },
    { label: "CS Fundamentals",          score: student.csFundamentalsScore as number | null, icon: Building2 },
    { label: "Coding",                   score: student.aptitudeScore as number | null, icon: TrendingUp },
    { label: "Communication",            score: student.verbalCommunicationScore as number | null, icon: Globe },
  ].filter(m => m.score != null) as { label: string; score: number; icon: any }[];

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
    <div className="min-h-screen bg-background">

      <div className="border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-2 h-8 text-xs"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Talent Pool
          </Button>
          <span className="text-border">|</span>
          <span className="text-sm font-medium text-foreground">
            {student.firstName} {student.lastName}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          <div className="lg:w-80 flex-shrink-0 flex flex-col gap-4 lg:sticky lg:top-6">

            <div className="bg-card border border-border rounded-xl p-6" data-testid="card-profile-header">
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl"
                  style={{ backgroundColor: bgColor }}
                  data-testid={`div-student-avatar-fallback-${student.id}`}
                >
                  {initials}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground leading-tight tracking-tight" data-testid="text-student-name">
                    {student.firstName} {student.lastName}
                  </h1>
                  <p className="text-xs font-medium text-primary mt-1" data-testid="text-student-degree">
                    {student.degree || "B.Tech"} · {student.major || "Computer Science"}
                  </p>
                  {student.university && (
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-center gap-1" data-testid="text-student-university">
                      <GraduationCap className="w-3 h-3 shrink-0" />
                      {student.university}
                    </p>
                  )}
                </div>

                {verdict && (
                  <span className={`text-2xs font-bold px-3 py-1 rounded-full tracking-wider ${verdict.className}`}>
                    {verdict.label}
                  </span>
                )}

                {student.assessmentCompleted && (
                  <span className="inline-flex items-center gap-1 text-2xs text-primary font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    NxtWave Edge Assessed
                  </span>
                )}
              </div>

              {student.overallAssessmentScore != null && (
                <div className="mt-5 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Overall Score</span>
                    <span className="text-2xl font-black text-foreground tabular-nums leading-none">
                      {student.overallAssessmentScore}
                      <span className="text-xs font-medium text-muted-foreground">/100</span>
                    </span>
                  </div>
                  <div className="score-bar">
                    <div
                      className="score-bar-fill bg-primary"
                      style={{ width: `${Math.min(student.overallAssessmentScore, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {metrics.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-5" data-testid="card-skills-assessment">
                <p className="text-2xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Performance Metrics
                </p>
                <div className="space-y-3.5">
                  {metrics.map(m => {
                    const Icon = m.icon;
                    return (
                      <div key={m.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                            <Icon className="w-3 h-3 text-muted-foreground" />
                            {m.label}
                          </span>
                          <span className="text-xs font-bold text-foreground tabular-nums">{m.score}</span>
                        </div>
                        <div className="score-bar">
                          <div
                            className="score-bar-fill bg-primary"
                            style={{ width: `${Math.min(m.score, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {strengths.length > 0 && (
              <div className="bg-foreground rounded-xl p-5">
                <p className="text-2xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Best Fit Roles
                </p>
                <div className="flex flex-wrap gap-2">
                  {strengths.slice(0, 4).map((s, i) => (
                    <span key={i} className="text-2xs bg-muted text-muted-foreground px-2.5 py-1 rounded-lg font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleContactUs}
              disabled={isSendingContact || contactSent}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
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

          <div className="flex-1 min-w-0 flex flex-col gap-4">

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex border-b border-border overflow-x-auto">
                {tabs.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-3 text-xs font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.key
                        ? "text-primary border-b-2 border-primary -mb-px bg-card"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">

                {activeTab === "assessment" && (
                  <div>
                    <h2 className="text-base font-bold text-foreground mb-5 flex items-center gap-2">
                      <span className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </span>
                      Detailed Score Breakdown
                    </h2>

                    <div className="rounded-xl border border-border overflow-hidden mb-5">
                      <div className="grid grid-cols-2 bg-muted/50 px-5 py-2.5">
                        <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground">Assessment</span>
                        <span className="text-2xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Score</span>
                      </div>
                      {scoreRows.map((row, i) => (
                        <div key={i} className="grid grid-cols-2 px-5 py-3 border-t border-border">
                          <span className="text-sm text-foreground">{row.label}</span>
                          <span className="text-sm font-semibold text-foreground text-right tabular-nums">{row.value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {student.resumeUrl && student.resumeUrl.includes("topin.tech") && (
                        <a
                          href={student.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                              <FileText className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">Assessment Report</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                      {student.linkedinUrl && (
                        <a
                          href={student.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                          data-testid="button-tr1-recording"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center shrink-0">
                              <span className="font-mono text-2xs font-bold text-muted-foreground">&lt;/&gt;</span>
                            </div>
                            <span className="text-sm font-medium text-foreground">TR1 Recording</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                      {student.githubUrl && (
                        <a
                          href={student.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                          data-testid="button-tr2-recording"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center shrink-0">
                              <Github className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-medium text-foreground">TR2 Recording</span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "interview1" && (
                  <div>
                    <h2 className="text-base font-bold text-foreground mb-1">Interview 1: DSA</h2>
                    <p className="text-sm text-muted-foreground mb-6">Technical Round 1: Communication & Problem Solving</p>
                    {student.linkedinUrl ? (
                      <a
                        href={student.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        View Recording
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="py-14 text-center">
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <Video className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Recording not available</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "interview2" && (
                  <div>
                    <h2 className="text-base font-bold text-foreground mb-1">Interview 2: Projects</h2>
                    <p className="text-sm text-muted-foreground mb-6">Technical Round 2: Deep Technical & Domain Skills</p>
                    {student.githubUrl ? (
                      <a
                        href={student.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                      >
                        <Video className="w-4 h-4" />
                        View Recording
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <div className="py-14 text-center">
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                          <Video className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground">Recording not available</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "verdict" && (
                  <div>
                    <h2 className="text-base font-bold text-foreground mb-5">Final Verdict</h2>
                    <div className="rounded-xl border border-border p-5 bg-muted/30 space-y-3">
                      <div className="flex items-center gap-3">
                        {verdict && (
                          <span className={`text-sm font-bold px-3 py-1 rounded-full ${verdict.className}`}>
                            {verdict.label}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">NxtWave Edge Recommendation</span>
                      </div>
                      {student.bio && (
                        <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-student-bio">
                          {student.bio}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {student.bio && activeTab !== "verdict" && (
              <div className="bg-card border border-border rounded-xl p-5" data-testid="card-about">
                <h3 className="text-sm font-semibold text-foreground mb-2">Candidate Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{student.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
