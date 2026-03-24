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

const STAGES = [
  {
    num: 1,
    kind: "evaluation",
    title: "Offline Proctored Assessment",
    tagline: "Conducted at controlled campuses/centers to ensure 100% integrity.",
    points: [
      { label: "4 Coding Problems:", detail: "Benchmarked vs CodeForces (800–1900 rating)." },
      { label: "Security:", detail: "AI-enabled Topin.Tech tool, no mobile phones allowed." },
      { label: "Format:", detail: "DSA Coding, MCQs, CS Fundamentals." },
    ],
  },
  {
    num: 2,
    kind: "audit",
    title: "Assessment Audit",
    tagline: "Integrity Quality Control to filter out any violations.",
    points: [
      { label: "", detail: "Manual & AI review of screen recordings." },
      { label: "", detail: "Plagiarism & AI-code detection." },
      { label: "", detail: "Remote access checks." },
    ],
  },
  {
    num: 3,
    kind: "evaluation",
    title: "Technical Interview — Round 1",
    tagline: "Live DSA problem-solving with MAANG+ industry experts.",
    points: [
      { label: "Monitoring:", detail: "Dual-camera: screen + room environment." },
      { label: "Focus:", detail: "Thought process & reasoning under pressure." },
      { label: "Questions:", detail: "Non-standard DSA (1300–1500 rating)." },
    ],
  },
  {
    num: 4,
    kind: "audit",
    title: "TR1 Audit",
    tagline: "Verification of interviewer scoring and process adherence.",
    points: [
      { label: "", detail: "Confirm questions met difficulty standards." },
      { label: "", detail: "Review of interview recordings & dual-camera feed." },
      { label: "", detail: "Calibration of candidate strengths / weaknesses." },
    ],
  },
  {
    num: 5,
    kind: "evaluation",
    title: "Technical Interview — Round 2",
    tagline: "60-minute real-world engineering readiness check.",
    points: [
      { label: "Projects (40 min):", detail: "Deployed systems, trade-offs, ownership." },
      { label: "Core CS (20 min):", detail: "OOPS, DBMS, Networks, OS, Cloud / AI." },
      { label: "Outcome:", detail: "Skill Category & Readiness Level assigned." },
    ],
  },
  {
    num: 6,
    kind: "audit",
    title: "TR2 Audit — Final QC",
    tagline: "Final validation of skill category and readiness level.",
    points: [
      { label: "", detail: "Confirm all mandatory areas were covered." },
      { label: "", detail: "Validate interview evidence matches the rating." },
      { label: "", detail: "Final integrity check before shortlisting." },
    ],
  },
  {
    num: 7,
    kind: "final",
    title: "Final Shortlisting",
    tagline: "Only candidates who clear every stage and every audit gate are shared with hiring companies.",
    points: [],
  },
];

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

function StageCircleColor(kind: string) {
  if (kind === "audit") return { bg: "bg-blue-500", text: "text-white" };
  if (kind === "final") return { bg: "bg-blue-600", text: "text-white" };
  return { bg: "bg-blue-600", text: "text-white" };
}

function BadgeColors(kind: string) {
  if (kind === "audit") return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" };
  if (kind === "final") return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" };
  return { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" };
}

export default function ExploreEdge() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#EEF2F7]">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/60 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/">
            <img src={nxtWaveLogo} alt="NxtWave Edge" className="h-7 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/explore-edge">
              <span className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer">
                Explore Edge
              </span>
            </Link>
            <Link href="/">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
                View Shortlisted Profiles
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-16 pb-10 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-5">
          End-to-End{" "}
          <span className="text-blue-600">Evaluation Process</span>
        </h1>
        <p className="text-slate-500 text-base max-w-xl mx-auto leading-relaxed">
          Our rigorous multi-stage process ensures only the top 0.1% talent makes it through. From
          AI-proctored assessments to deep-dive technical interviews, we validate every skill.
        </p>
      </section>

      {/* ── Alternating Timeline ── */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Vertical center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-blue-200/60" />

            <div className="space-y-0">
              {STAGES.filter(s => s.kind !== "final").map((stage, idx) => {
                const isLeft = idx % 2 === 0;
                const isAudit = stage.kind === "audit";

                return (
                  <div key={stage.num} className="relative flex items-center">
                    {/* Left slot */}
                    <div className="w-[calc(50%-32px)] pr-8">
                      {isLeft && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                          {/* Badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                isAudit
                                  ? "bg-orange-100 text-orange-500"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {stage.num}
                            </div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">
                              {stage.title}
                            </h3>
                          </div>
                          <p className="text-sm text-slate-500 mb-3 leading-relaxed">
                            {stage.tagline}
                          </p>
                          {stage.points.length > 0 && (
                            <ul className="space-y-1.5">
                              {stage.points.map((pt, pi) => (
                                <li key={pi} className="flex items-start gap-2 text-sm text-slate-600">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                  <span>
                                    {pt.label && (
                                      <span className="font-semibold">{pt.label} </span>
                                    )}
                                    {pt.detail}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Center circle */}
                    <div className="relative z-10 w-16 h-16 flex items-center justify-center shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md ${
                          isAudit ? "bg-orange-400" : "bg-blue-600"
                        }`}
                      >
                        {stage.num}
                      </div>
                    </div>

                    {/* Right slot */}
                    <div className="w-[calc(50%-32px)] pl-8">
                      {!isLeft && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                          {/* Badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                                isAudit
                                  ? "bg-orange-100 text-orange-500"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {stage.num}
                            </div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">
                              {stage.title}
                            </h3>
                          </div>
                          <p className="text-sm text-slate-500 mb-3 leading-relaxed">
                            {stage.tagline}
                          </p>
                          {stage.points.length > 0 && (
                            <ul className="space-y-1.5">
                              {stage.points.map((pt, pi) => (
                                <li key={pi} className="flex items-start gap-2 text-sm text-slate-600">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                                  <span>
                                    {pt.label && (
                                      <span className="font-semibold">{pt.label} </span>
                                    )}
                                    {pt.detail}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Final stage — full width */}
              <div className="relative flex items-center">
                <div className="w-[calc(50%-32px)]" />
                <div className="relative z-10 w-16 h-16 flex items-center justify-center shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 shadow-md">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="w-[calc(50%-32px)]" />
              </div>
            </div>
          </div>

          {/* Final shortlisting card — full width below timeline */}
          <div className="mt-8 bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-4 right-6 text-[120px] font-black text-white/5 leading-none select-none">
              7
            </div>
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-white/70" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                    Final Stage
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mb-2">Final Shortlisting</h3>
                <p className="text-white/75 text-sm leading-relaxed max-w-xl">
                  Only candidates who clear every evaluation stage and pass all audit gates are added to the verified talent pool and shared with hiring companies.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <div className="flex items-center gap-2.5 bg-white/15 rounded-xl px-4 py-3">
                  <Award className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">Top 0.1% Talent</span>
                </div>
                <Link href="/">
                  <button className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm px-5 py-3 rounded-xl transition-colors w-full">
                    Browse Verified Profiles <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Integrity pillars ── */}
      <section className="bg-slate-950 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-3 block">
              Why it matters
            </span>
            <h2 className="text-3xl font-extrabold text-white">
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
                <div key={p.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
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
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Ready to Hire from the Top 0.1%?
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Access 1,920+ pre-verified engineers who've cleared every stage of
            this process — no screening required on your end.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-colors">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
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
