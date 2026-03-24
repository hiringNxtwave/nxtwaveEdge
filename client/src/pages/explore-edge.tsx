import { Link } from "wouter";
import { useEffect } from "react";
import { ArrowRight, Shield, CheckCircle, Video, Search, ClipboardCheck, BarChart3, Award } from "lucide-react";
import nxtWaveLogo from "@assets/image_1774348454567.png";

const STAGES = [
  {
    num: 1,
    icon: ClipboardCheck,
    title: "Offline Proctored Assessment",
    tagline: "Conducted at controlled campuses/centers to ensure 100% integrity.",
    points: [
      "4 Coding Problems — benchmarked vs CodeForces (800–1900 rating)",
      "Security: AI-enabled Topin.Tech tool, no mobile phones allowed",
      "Format: DSA Coding, MCQs, CS Fundamentals",
    ],
    audit: false,
  },
  {
    num: 2,
    icon: Search,
    title: "Assessment Audit",
    tagline: "Integrity Quality Control to filter out any violations.",
    points: [
      "Manual & AI review of screen recordings",
      "Plagiarism & AI-code detection",
      "Remote access checks",
    ],
    audit: true,
  },
  {
    num: 3,
    icon: Video,
    title: "Technical Interview — Round 1",
    tagline: "Live DSA problem solving with industry experts (MAANG+ experience).",
    points: [
      "Setup: Dual-camera monitoring (Screen + Environment)",
      "Thought process & reasoning focus",
      "Non-standard DSA questions (1300–1500 rating)",
    ],
    audit: false,
  },
  {
    num: 4,
    icon: ClipboardCheck,
    title: "TR1 Audit",
    tagline: "Verification of interviewer scoring and process adherence.",
    points: [
      "Check if questions met difficulty standards",
      "Review of interview recordings & dual-camera feed",
      "Calibration of candidate strengths/weaknesses",
    ],
    audit: true,
  },
  {
    num: 5,
    icon: BarChart3,
    title: "Technical Interview — Round 2",
    tagline: "60-min real-world engineering readiness check.",
    points: [
      "Projects (40m) — deep dive into deployed systems, trade-offs, and ownership",
      "Core CS (20m) — OOPS, DBMS, Networks, OS, & Cloud/AI exposure",
      "Outcome: Skill Category (Frontend/Backend/Full-stack) & Readiness Level",
    ],
    audit: false,
  },
  {
    num: 6,
    icon: Shield,
    title: "TR2 Audit — Final QC",
    tagline: "Final validation of skill category and readiness level.",
    points: [
      "Confirm all mandatory areas were covered",
      "Validate interview evidence matches rating",
      "Final integrity check",
    ],
    audit: true,
  },
  {
    num: 7,
    icon: Award,
    title: "Final Shortlisting",
    tagline: "Only candidates who clear all stages and audit gates are shared with companies.",
    points: [],
    audit: false,
    final: true,
  },
];

export default function ExploreEdge() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors">← Back</button>
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
      <section className="bg-slate-950 text-white px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-8">
            <Shield className="w-3 h-3" /> Verified Process
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
            End-to-End Evaluation<br />
            <span className="text-blue-400">Process</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Our rigorous multi-stage process ensures only the top 0.1% talent makes it through. From AI-proctored assessments to deep-dive technical interviews, we validate every skill.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {[
              { value: "7", label: "Evaluation Stages" },
              { value: "0.1%", label: "Pass Rate" },
              { value: "100%", label: "Offline Verified" },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black text-white">{stat.value}</div>
                <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-100" />

            <div className="space-y-0">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon;
                const isLast = idx === STAGES.length - 1;
                const isAudit = stage.audit;

                return (
                  <div key={stage.num} className="relative flex gap-6">
                    {/* Number bubble */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 font-black text-sm shadow-sm ${
                      isLast
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isAudit
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-slate-200 text-slate-800"
                    }`}>
                      {isLast ? <CheckCircle className="w-5 h-5" /> : stage.num}
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 pb-10 ${isLast ? "pb-0" : ""}`}>
                      <div className={`rounded-xl border p-5 ${
                        isLast
                          ? "bg-blue-600 border-blue-600 text-white"
                          : isAudit
                          ? "bg-slate-900 border-slate-800"
                          : "bg-white border-slate-100 shadow-sm"
                      }`}>
                        {/* Stage label */}
                        <div className={`flex items-center gap-2 mb-2`}>
                          <Icon className={`w-4 h-4 shrink-0 ${isLast ? "text-white/80" : isAudit ? "text-slate-400" : "text-blue-600"}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${
                            isLast ? "text-white/70" : isAudit ? "text-slate-500" : "text-blue-500"
                          }`}>
                            {isAudit ? "Audit Gate" : isLast ? "Final Stage" : `Stage ${stage.num}`}
                          </span>
                        </div>

                        <h3 className={`text-lg font-bold mb-1 ${isLast ? "text-white" : isAudit ? "text-white" : "text-slate-900"}`}>
                          {stage.title}
                        </h3>
                        <p className={`text-sm mb-0 ${isLast ? "text-white/80" : isAudit ? "text-slate-400" : "text-slate-500"}`}>
                          {stage.tagline}
                        </p>

                        {stage.points.length > 0 && (
                          <ul className="mt-3 space-y-1.5">
                            {stage.points.map((point, pi) => (
                              <li key={pi} className={`flex items-start gap-2 text-sm ${
                                isAudit ? "text-slate-300" : "text-slate-600"
                              }`}>
                                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${isAudit ? "bg-slate-500" : "bg-blue-400"}`} />
                                {point}
                              </li>
                            ))}
                          </ul>
                        )}

                        {isLast && (
                          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
                              <Award className="w-4 h-4 text-white" />
                              <span className="text-sm font-semibold text-white">Top 0.1% Talent Verified</span>
                            </div>
                            <Link href="/browse">
                              <button className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm px-5 py-2 rounded-lg transition-colors">
                                View Shortlisted Profiles <ArrowRight className="w-4 h-4" />
                              </button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-slate-950 py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-3">
            Ready to hire from the top 0.1%?
          </h2>
          <p className="text-slate-400 mb-8 text-sm">
            Access 1,920+ pre-verified engineers who've cleared every stage of this process.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/api/login">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-7 py-3.5 rounded-lg transition-colors">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
            </a>
            <Link href="/browse">
              <button className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold text-sm px-7 py-3.5 rounded-lg transition-colors">
                Browse Talent
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
