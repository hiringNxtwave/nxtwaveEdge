import { Link } from "wouter";
import { useEffect } from "react";
import {
  ArrowRight,
  Shield,
  CheckCircle,
  Video,
  Search,
  ClipboardCheck,
  BarChart3,
  Award,
  Lock,
  Eye,
  Zap,
} from "lucide-react";
import nxtWaveLogo from "@assets/image_1774348454567.png";

const PHASES = [
  {
    phase: "Phase 1",
    label: "Initial Screening",
    stages: [
      {
        num: 1,
        icon: ClipboardCheck,
        kind: "evaluation",
        title: "Offline Proctored Assessment",
        tagline: "Conducted at controlled campuses to ensure 100% integrity.",
        points: [
          "4 Coding Problems benchmarked vs CodeForces (800–1900 rating)",
          "AI-enabled Topin.Tech proctoring — no phones, no external access",
          "Format: DSA Coding, MCQs, CS Fundamentals",
        ],
      },
      {
        num: 2,
        icon: Search,
        kind: "audit",
        title: "Assessment Audit",
        tagline: "Integrity Quality Control to filter out any violations.",
        points: [
          "Manual & AI review of screen recordings",
          "Plagiarism & AI-code detection",
          "Remote access and tab-switch checks",
        ],
      },
    ],
  },
  {
    phase: "Phase 2",
    label: "Technical Depth",
    stages: [
      {
        num: 3,
        icon: Video,
        kind: "evaluation",
        title: "Technical Interview — Round 1",
        tagline: "Live DSA problem-solving with MAANG+ industry experts.",
        points: [
          "Dual-camera monitoring: screen + room environment",
          "Thought process & reasoning under pressure",
          "Non-standard DSA questions (1300–1500 rating)",
        ],
      },
      {
        num: 4,
        icon: Eye,
        kind: "audit",
        title: "TR1 Audit",
        tagline: "Verification of interviewer scoring and process adherence.",
        points: [
          "Confirm questions met difficulty standards",
          "Review of interview recordings & dual-camera feed",
          "Calibration of candidate strengths / weaknesses",
        ],
      },
      {
        num: 5,
        icon: BarChart3,
        kind: "evaluation",
        title: "Technical Interview — Round 2",
        tagline: "60-minute real-world engineering readiness check.",
        points: [
          "Projects (40 min) — deployed systems, trade-offs, ownership",
          "Core CS (20 min) — OOPS, DBMS, Networks, OS, Cloud / AI",
          "Outcome: Skill Category & Readiness Level assigned",
        ],
      },
      {
        num: 6,
        icon: Shield,
        kind: "audit",
        title: "TR2 Audit — Final QC",
        tagline: "Final validation of skill category and readiness level.",
        points: [
          "Confirm all mandatory areas were covered",
          "Validate interview evidence matches the rating",
          "Final integrity check before shortlisting",
        ],
      },
    ],
  },
  {
    phase: "Phase 3",
    label: "Verified",
    stages: [
      {
        num: 7,
        icon: Award,
        kind: "final",
        title: "Final Shortlisting",
        tagline:
          "Only candidates who clear every stage and every audit gate are shared with hiring companies.",
        points: [],
      },
    ],
  },
];

const ALL_STAGES = PHASES.flatMap((p) => p.stages);

const INTEGRITY_PILLARS = [
  {
    icon: Lock,
    title: "Zero Digital Access",
    body: "Assessments are fully offline. No internet, no phones, no screen tools — only real skill.",
  },
  {
    icon: Eye,
    title: "Triple Audit Gates",
    body: "Three independent audit checkpoints verify every evaluation before a candidate can advance.",
  },
  {
    icon: Zap,
    title: "AI + Human Review",
    body: "Recordings, code, and interview footage are analysed by both AI models and senior reviewers.",
  },
];

export default function ExploreEdge() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
                ← Back
              </button>
            </Link>
            <a href="/api/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                Get Access
              </button>
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-slate-950 px-6 pt-20 pb-24 overflow-hidden relative">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Pill badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
              <Shield className="w-3 h-3" /> India's First National Engineering Hiring Standard
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-center text-5xl md:text-6xl font-black text-white leading-tight mb-5">
            7 Stages.{" "}
            <span className="text-blue-400">Zero Compromise.</span>
          </h1>
          <p className="text-center text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12">
            Every engineer in our talent pool has survived a rigorous
            multi-stage gauntlet — offline proctored assessments, live
            technical interviews, and three independent audit gates.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-x-14 gap-y-6 mb-14">
            {[
              { value: "7", label: "Evaluation Stages" },
              { value: "3", label: "Independent Audit Gates" },
              { value: "0.1%", label: "Overall Pass Rate" },
              { value: "1,920+", label: "Verified Engineers" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-white tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline strip — 7 steps */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
            <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-5">
              Candidate Journey
            </p>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
              {ALL_STAGES.map((stage, idx) => {
                const isAudit = stage.kind === "audit";
                const isFinal = stage.kind === "final";
                const Icon = stage.icon;
                return (
                  <div key={stage.num} className="flex items-center gap-1 shrink-0">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black border ${
                          isFinal
                            ? "bg-blue-600 border-blue-500 text-white"
                            : isAudit
                            ? "bg-slate-800 border-slate-700 text-slate-400"
                            : "bg-slate-900 border-slate-700 text-white"
                        }`}
                      >
                        {isFinal ? <CheckCircle className="w-4 h-4" /> : stage.num}
                      </div>
                      <span
                        className={`text-[9px] font-semibold uppercase tracking-wide text-center leading-tight max-w-[56px] ${
                          isFinal
                            ? "text-blue-400"
                            : isAudit
                            ? "text-slate-600"
                            : "text-slate-400"
                        }`}
                      >
                        {isAudit ? "Audit" : isFinal ? "Verified" : `Stage ${stage.num}`}
                      </span>
                    </div>
                    {idx < ALL_STAGES.length - 1 && (
                      <div className="w-5 h-px bg-slate-700 shrink-0 mt-[-12px]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Phase breakdown ── */}
      <section className="bg-[#F8FAFC] px-6 py-20">
        <div className="max-w-5xl mx-auto space-y-16">
          {PHASES.map((phase) => (
            <div key={phase.phase}>
              {/* Phase header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                    {phase.phase}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                    {phase.label}
                  </h2>
                </div>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Stage cards */}
              {phase.stages[0].kind === "final" ? (
                /* Final stage — full width */
                <div className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-4 right-6 text-[120px] font-black text-white/5 leading-none select-none">
                    7
                  </div>
                  <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-white/70" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                          Final Stage
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">
                        Final Shortlisting
                      </h3>
                      <p className="text-white/75 text-sm leading-relaxed max-w-xl">
                        Only candidates who clear every evaluation stage and pass all three audit gates are added to the verified talent pool and shared with hiring companies.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 shrink-0">
                      <div className="flex items-center gap-2.5 bg-white/15 rounded-xl px-4 py-3">
                        <Award className="w-4 h-4 text-white" />
                        <span className="text-sm font-bold text-white">
                          Top 0.1% Talent
                        </span>
                      </div>
                      <Link href="/browse">
                        <button className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm px-5 py-3 rounded-xl transition-colors w-full">
                          Browse Verified Profiles{" "}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* Evaluation + Audit grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.stages.map((stage) => {
                    const Icon = stage.icon;
                    const isAudit = stage.kind === "audit";
                    return (
                      <div
                        key={stage.num}
                        className={`relative rounded-2xl overflow-hidden border ${
                          isAudit
                            ? "bg-slate-900 border-slate-800"
                            : "bg-white border-slate-100 shadow-sm"
                        }`}
                      >
                        {/* Ghost number */}
                        <div
                          className={`absolute top-4 right-5 text-[72px] font-black leading-none select-none ${
                            isAudit ? "text-white/5" : "text-slate-100"
                          }`}
                        >
                          {stage.num}
                        </div>

                        <div className="relative p-6">
                          {/* Kind badge */}
                          <div className="flex items-center gap-2 mb-4">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                isAudit
                                  ? "bg-slate-800"
                                  : "bg-blue-50"
                              }`}
                            >
                              <Icon
                                className={`w-3.5 h-3.5 ${
                                  isAudit ? "text-slate-400" : "text-blue-600"
                                }`}
                              />
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-widest ${
                                isAudit ? "text-slate-500" : "text-blue-500"
                              }`}
                            >
                              {isAudit ? "Audit Gate" : `Stage ${stage.num}`}
                            </span>
                          </div>

                          <h3
                            className={`text-lg font-black mb-2 leading-snug ${
                              isAudit ? "text-white" : "text-slate-900"
                            }`}
                          >
                            {stage.title}
                          </h3>
                          <p
                            className={`text-sm leading-relaxed mb-0 ${
                              isAudit ? "text-slate-400" : "text-slate-500"
                            }`}
                          >
                            {stage.tagline}
                          </p>

                          {stage.points.length > 0 && (
                            <ul className="mt-4 space-y-2">
                              {stage.points.map((pt, pi) => (
                                <li
                                  key={pi}
                                  className={`flex items-start gap-2.5 text-sm ${
                                    isAudit ? "text-slate-300" : "text-slate-600"
                                  }`}
                                >
                                  <span
                                    className={`w-1 h-1 rounded-full mt-2 shrink-0 ${
                                      isAudit ? "bg-slate-600" : "bg-blue-400"
                                    }`}
                                  />
                                  {pt}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Integrity pillars ── */}
      <section className="bg-slate-950 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-3 block">
              Why it matters
            </span>
            <h2 className="text-3xl font-black text-white">
              Built on Uncompromising Integrity
            </h2>
            <p className="text-slate-400 mt-3 text-sm max-w-xl mx-auto">
              Every layer of the process is designed to eliminate shortcuts, gaming, and misrepresentation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INTEGRITY_PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-blue-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{p.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-slate-950 border-t border-slate-800/50 px-6 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Ready to Hire from the Top 0.1%?
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Access 1,920+ pre-verified engineers who've cleared every stage of
            this process — no screening required on your end.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/api/login">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-colors">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </a>
            <Link href="/">
              <button className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold text-sm px-8 py-3.5 rounded-xl transition-colors">
                Browse Talent
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
