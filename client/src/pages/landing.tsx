import { useState, useEffect } from "react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import nxtWaveLogo from "@assets/image_1774348454567.png";
import { ArrowRight, Star, CheckCircle, ChevronRight } from "lucide-react";

const ROTATING_POINTS = [
  "Verified shortlists delivered within minutes",
  "3,00,000+ freshers evaluated offline",
  "Final Year Students from Top 250+ NIRF campuses",
  "MAANG Standard Assessment & Interview",
];

const TESTIMONIALS = [
  { quote: "We haven't seen such quality in fresher hiring before — exceptional pool and coordination.", author: "Hiring Manager", company: "Anand Rathi" },
  { quote: "We highly appreciate the streamlined Tier-2 delivery model. It helped us meet our volume hiring goals faster than expected.", author: "Hiring Team", company: "One of the Big4 Firms" },
  { quote: "Your team saved us significant time and cost while delivering Tier-1 quality faster than any agency.", author: "HR Team", company: "Kotak Mahindra Bank" },
  { quote: "I've never seen such high-quality fresher talent from any vendor.", author: "Ansh", company: "Exotel" },
  { quote: "We appreciate the coordination and quality. We will continue to trust you for all our fresher hiring needs.", author: "Hiring Team", company: "LeadSquared" },
  { quote: "We're very happy with the quality of candidates shared and would love to receive more profiles from you.", author: "Hiring Manager", company: "Hyperfin" },
];

const PARTNER_LOGOS = [
  { name: "Lloyds Bank", url: "https://44403767.fs1.hubspotusercontent-na1.net/hubfs/44403767/Assets/Lloyds-Bank-Logo-New.png" },
  { name: "Thoughtworks", url: "https://44403767.fs1.hubspotusercontent-na1.net/hubfs/44403767/Assets/Thoughtworks_logo.png" },
  { name: "ADP", url: "https://44403767.fs1.hubspotusercontent-na1.net/hubfs/44403767/Assets/adp%20logo.png" },
  { name: "Arcon", url: "https://44403767.fs1.hubspotusercontent-na1.net/hubfs/44403767/Assets/arcon.png" },
  { name: "LeadSquared", url: "https://44403767.fs1.hubspotusercontent-na1.net/hubfs/44403767/Assets/leadsquared_logo.png" },
  { name: "Anand Rathi", url: "https://44403767.fs1.hubspotusercontent-na1.net/hubfs/44403767/Assets/anandrathi_logo.png" },
];

const EDGE_CARDS = [
  {
    num: "01",
    problem: "Online evaluation can't be trusted anymore",
    problemDesc: "Cheating and test inflation have made digital assessments unreliable. Scores no longer reflect real capability.",
    solution: "Reliable assessments built on proven offline integrity — proctored at physical centers with zero digital compromise.",
  },
  {
    num: "02",
    problem: "'Tier' doesn't tell you who can actually code",
    problemDesc: "Readiness varies drastically even inside top NIRF campuses. College name is not a hiring signal.",
    solution: "Consistent evaluation of engineering talent across all campuses — ranked on a national standard, not a tier list.",
  },
  {
    num: "03",
    problem: "Hiring teams need answers, not more resumes",
    problemDesc: "Screening hundreds of profiles slows teams without improving quality. The signal is buried in noise.",
    solution: "A clear, pre-validated shortlist of truly job-ready freshers — delivered in under 1 hour.",
  },
];

/* ── SVG Illustrations ─────────────────────────────────── */

function HeroIllustration() {
  const poolDots = [
    { cx: 58,  cy: 88  }, { cx: 88,  cy: 78  }, { cx: 116, cy: 92  },
    { cx: 48,  cy: 122 }, { cx: 78,  cy: 114 }, { cx: 108, cy: 128 },
    { cx: 132, cy: 108 }, { cx: 62,  cy: 158 }, { cx: 92,  cy: 148 },
    { cx: 122, cy: 162 }, { cx: 48,  cy: 192 }, { cx: 80,  cy: 184 },
    { cx: 112, cy: 196 }, { cx: 136, cy: 176 }, { cx: 58,  cy: 226 },
    { cx: 90,  cy: 218 }, { cx: 120, cy: 232 }, { cx: 68,  cy: 262 },
    { cx: 100, cy: 254 }, { cx: 128, cy: 268 }, { cx: 52,  cy: 292 },
  ];
  const cards = [
    { y: 82,  initials: "AK", name: "Arjun Kumar",  campus: "IIT Delhi",    score: "98" },
    { y: 182, initials: "PS", name: "Priya Sharma",  campus: "NIT Trichy",   score: "96" },
    { y: 282, initials: "RV", name: "Rahul Verma",   campus: "BITS Pilani",  score: "94" },
  ];
  return (
    <svg viewBox="0 0 490 410" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
      {/* Soft background */}
      <rect width="490" height="410" rx="24" fill="#F0F5FF" />

      {/* ── LEFT: Candidate pool ── */}
      <text x="90" y="42" textAnchor="middle" fill="#2563EB" fontSize="8.5" fontWeight="bold" letterSpacing="0.8">3,00,000+ ASSESSED</text>
      {poolDots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={i % 4 === 0 ? 10 : 7}
          fill={i % 5 === 0 ? "#DBEAFE" : i % 3 === 0 ? "#BFDBFE" : "#EFF6FF"}
          stroke="#C7D7F5" strokeWidth="1" />
      ))}
      {/* tiny "person" silhouette in each dot */}
      {poolDots.slice(0, 7).map((d, i) => (
        <g key={`p${i}`} opacity="0.5">
          <circle cx={d.cx} cy={d.cy - 2} r="2.5" fill="#93C5FD" />
          <path d={`M${d.cx - 3} ${d.cy + 5} Q${d.cx} ${d.cy + 3} ${d.cx + 3} ${d.cy + 5}`}
            stroke="#93C5FD" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </g>
      ))}

      {/* Funnel lines: pool → filter */}
      {[110, 190, 270].map((y, i) => (
        <line key={i} x1="148" y1={y} x2="188" y2={190} stroke="#BFDBFE" strokeWidth="1.5" strokeDasharray="4 3" />
      ))}

      {/* ── CENTER: NxtWave filter engine ── */}
      <rect x="182" y="148" width="96" height="100" rx="20" fill="#1D4ED8" />
      {/* lightning bolt */}
      <path d="M232 168 l-10 20 h8 l-10 22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <text x="230" y="262" textAnchor="middle" fill="#93C5FD" fontSize="7.5" fontWeight="bold" letterSpacing="0.5">NxtWave</text>

      {/* Filter lines: filter → cards */}
      {[120, 220, 320].map((y, i) => (
        <line key={i} x1="278" y1={190} x2="300" y2={y} stroke="#BFDBFE" strokeWidth="1.5" strokeDasharray="4 3" />
      ))}

      {/* ── RIGHT: Verified shortlist cards ── */}
      {cards.map(({ y, initials, name, campus, score }) => (
        <g key={initials}>
          <rect x="298" y={y} width="168" height="72" rx="14" fill="white" stroke="#DBEAFE" strokeWidth="1.5" />
          {/* Avatar */}
          <circle cx="326" cy={y + 36} r="20" fill="#EFF6FF" />
          <text x="326" y={y + 41} textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="bold">{initials}</text>
          {/* Name & campus */}
          <text x="356" y={y + 24} fill="#0F172A" fontSize="9.5" fontWeight="bold">{name}</text>
          <text x="356" y={y + 38} fill="#64748B" fontSize="8">{campus}</text>
          {/* Score pill */}
          <rect x="355" y={y + 46} width="52" height="14" rx="7" fill="#EFF6FF" />
          <text x="381" y={y + 57} textAnchor="middle" fill="#1D4ED8" fontSize="7.5" fontWeight="bold">MAANG {score}</text>
          {/* Verified tick */}
          <circle cx="450" cy={y + 18} r="11" fill="#2563EB" />
          <path d={`M445 ${y + 18} l3.5 3.5 l6.5-7`} stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}

      {/* ── BOTTOM: Speed badge ── */}
      <rect x="155" y="364" width="180" height="36" rx="18" fill="#1D4ED8" />
      <text x="245" y="387" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">⚡ Under 1 Hour</text>

      {/* Top-1% label above cards */}
      <rect x="318" y="56" width="118" height="20" rx="10" fill="#DBEAFE" />
      <text x="377" y="70" textAnchor="middle" fill="#1D4ED8" fontSize="8.5" fontWeight="bold">✓ Top 1% Shortlist</text>
    </svg>
  );
}

function AssessmentOrbitIllustration() {
  return (
    <svg viewBox="0 0 460 562" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
      {/* Background */}
      <rect width="460" height="562" rx="20" fill="#F0F5FF" />

      {/* Vertical dashed rail */}
      <line x1="33" y1="58" x2="33" y2="506" stroke="#BFDBFE" strokeWidth="2" strokeDasharray="6 5" />

      {/* ══ STAGE 1: Offline-Monitored Exam ══ */}
      <circle cx="33" cy="45" r="14" fill="#2563EB" />
      <text x="33" y="50" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">1</text>

      <rect x="60" y="16" width="384" height="140" rx="12" fill="white" stroke="#DBEAFE" strokeWidth="1.5" />
      {/* shield icon */}
      <path d="M76 31 l6-3 l6 3 v6c0 4-6 6.5-6 6.5s-6-2.5-6-6.5z" fill="#DBEAFE" />
      <path d="M79 37 l2 2 l3.5-3.5" stroke="#2563EB" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <text x="94" y="31" fill="#0F172A" fontSize="9.5" fontWeight="bold">Offline-Monitored Exam</text>
      <text x="94" y="43" fill="#64748B" fontSize="7">NxtWave team present in-person · Online proctored</text>
      {/* 1:25 badge */}
      <rect x="74" y="49" width="104" height="15" rx="7.5" fill="#EFF6FF" />
      <text x="126" y="60" textAnchor="middle" fill="#2563EB" fontSize="7" fontWeight="bold">🛡 1:25 Invigilation Ratio</text>

      {/* Divider */}
      <line x1="74" y1="72" x2="432" y2="72" stroke="#F1F5F9" strokeWidth="1.5" />
      <text x="74" y="84" fill="#94A3B8" fontSize="6.5" fontWeight="bold" letterSpacing="0.8">SCORE BREAKDOWN</text>

      {/* Score chips — 4 equal columns */}
      {[
        { label: "Overall",    score: "169",     x: 72  },
        { label: "Coding",     score: "120/120", x: 160 },
        { label: "DSA",        score: "10/10",   x: 250 },
        { label: "CS Funda.",  score: "39/40",   x: 338 },
      ].map(({ label, score, x }) => (
        <g key={label}>
          <rect x={x} y="90" width="82" height="48" rx="8" fill="#EFF6FF" />
          <text x={x + 41} y="112" textAnchor="middle" fill="#1D4ED8" fontSize="13" fontWeight="bold">{score}</text>
          <text x={x + 41} y="128" textAnchor="middle" fill="#94A3B8" fontSize="6.5">{label}</text>
        </g>
      ))}

      {/* ══ STAGE 2: Interview 1 — DSA ══ */}
      <circle cx="33" cy="185" r="14" fill="#2563EB" />
      <text x="33" y="190" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">2</text>

      <rect x="60" y="160" width="384" height="116" rx="12" fill="white" stroke="#DBEAFE" strokeWidth="1.5" />
      <rect x="72" y="172" width="12" height="12" rx="3" fill="#DBEAFE" />
      <path d="M74.5 178 l2 2 l3.5-3.5" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="91" y="181" fill="#0F172A" fontSize="9.5" fontWeight="bold">Interview 1: DSA</text>
      <text x="91" y="193" fill="#64748B" fontSize="7">Problem Solving · 2 coding problems · Live panel</text>
      {/* Audited badge */}
      <rect x="332" y="167" width="94" height="15" rx="7.5" fill="#DBEAFE" />
      <text x="379" y="178" textAnchor="middle" fill="#1D4ED8" fontSize="7" fontWeight="bold">✓ Audited</text>

      <line x1="72" y1="200" x2="432" y2="200" stroke="#F1F5F9" strokeWidth="1.5" />

      {/* Score chips — 4 across */}
      {[
        { label: "Problem 1", score: "5/5", x: 72  },
        { label: "Problem 2", score: "4/5", x: 160 },
        { label: "DSA Theory",score: "5/5", x: 250 },
        { label: "Core CS",   score: "5/5", x: 338 },
      ].map(({ label, score, x }) => (
        <g key={label}>
          <rect x={x} y="206" width="82" height="56" rx="8" fill="#EFF6FF" />
          <text x={x + 41} y="230" textAnchor="middle" fill="#1D4ED8" fontSize="14" fontWeight="bold">{score}</text>
          <text x={x + 41} y="248" textAnchor="middle" fill="#94A3B8" fontSize="6.5">{label}</text>
        </g>
      ))}

      {/* ══ STAGE 3: Interview 2 — Projects ══ */}
      <circle cx="33" cy="312" r="14" fill="#2563EB" />
      <text x="33" y="317" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">3</text>

      <rect x="60" y="286" width="384" height="116" rx="12" fill="white" stroke="#DBEAFE" strokeWidth="1.5" />
      <rect x="72" y="298" width="12" height="12" rx="3" fill="#DBEAFE" />
      <path d="M74.5 304 l2 2 l3.5-3.5" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="91" y="307" fill="#0F172A" fontSize="9.5" fontWeight="bold">Interview 2: Projects</text>
      <text x="91" y="319" fill="#64748B" fontSize="7">Full-stack project review · Architecture · Live demo</text>
      <rect x="332" y="293" width="94" height="15" rx="7.5" fill="#DBEAFE" />
      <text x="379" y="304" textAnchor="middle" fill="#1D4ED8" fontSize="7" fontWeight="bold">✓ Audited</text>

      <line x1="72" y1="327" x2="432" y2="327" stroke="#F1F5F9" strokeWidth="1.5" />

      {[
        { label: "Frontend",   score: "40", x: 72  },
        { label: "Backend",    score: "20", x: 160 },
        { label: "Project",    score: "75", x: 250 },
        { label: "Overall",    score: "59", x: 338 },
      ].map(({ label, score, x }) => (
        <g key={label}>
          <rect x={x} y="333" width="82" height="54" rx="8" fill="#EFF6FF" />
          <text x={x + 41} y="356" textAnchor="middle" fill="#1D4ED8" fontSize="14" fontWeight="bold">{score}</text>
          <text x={x + 41} y="374" textAnchor="middle" fill="#94A3B8" fontSize="6.5">{label}</text>
        </g>
      ))}

      {/* ══ FINAL SHORTLIST ══ */}
      <circle cx="33" cy="432" r="14" fill="#1D4ED8" />
      <path d="M27.5 432 l3.5 3.5 l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="60" y="408" width="384" height="130" rx="12" fill="#1D4ED8" />
      <text x="280" y="426" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" letterSpacing="1.2">FINAL SHORTLIST</text>

      {/* Candidate card */}
      <rect x="72" y="432" width="226" height="90" rx="9" fill="white" />
      <circle cx="100" cy="471" r="20" fill="#EFF6FF" />
      <text x="100" y="476" textAnchor="middle" fill="#1D4ED8" fontSize="9" fontWeight="bold">AP</text>
      <text x="132" y="455" fill="#0F172A" fontSize="8.5" fontWeight="bold">Aditya Patidar</text>
      <text x="132" y="467" fill="#64748B" fontSize="7">NIT Bhopal (MANIT)</text>
      <text x="132" y="479" fill="#94A3B8" fontSize="6.5">NIRF Rank: #81</text>
      <rect x="130" y="485" width="58" height="13" rx="6.5" fill="#DBEAFE" />
      <text x="159" y="495" textAnchor="middle" fill="#1D4ED8" fontSize="6.5" fontWeight="bold">VERY STRONG</text>

      {/* Best fit role */}
      <rect x="312" y="434" width="118" height="84" rx="9" fill="white" fillOpacity="0.12" />
      <text x="371" y="455" textAnchor="middle" fill="white" fillOpacity="0.65" fontSize="6.5" fontWeight="bold" letterSpacing="0.5">BEST FIT ROLE</text>
      <text x="371" y="471" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Frontend Dev</text>
      <text x="371" y="484" textAnchor="middle" fill="white" fillOpacity="0.7" fontSize="7">(Entry Level)</text>
      <circle cx="371" cy="504" r="7" fill="white" fillOpacity="0.15" />
      <path d="M367.5 504 l3 3 l5.5-5.5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Landing() {
  useScrollToTop();

  const [rotatingIdx, setRotatingIdx] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => { setRotatingIdx(i => (i + 1) % ROTATING_POINTS.length); setFade(true); }, 200);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => { setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length); }, 4500);
    return () => clearInterval(interval);
  }, []);

  const t = TESTIMONIALS[testimonialIdx];

  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={nxtWaveLogo} alt="NxtWave" className="h-10 w-auto" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => window.location.href = "/api/login"}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 h-9 rounded-lg transition-colors"
                data-testid="button-login"
              >
                Login →
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* ── Announcement Bar ── */}
      <div className="bg-blue-600 text-white text-center text-xs font-medium py-2.5 px-4">
        <span className="bg-white text-blue-600 font-bold px-2 py-0.5 rounded text-[11px] mr-2">NEW</span>
        NxtWave Edge — India's First National Engineering Hiring Standard is live.{" "}
        <button onClick={() => window.location.href = "/api/login"} className="underline font-semibold ml-1">Get early access →</button>
      </div>
      {/* ── Hero ── */}
      <section className="bg-[#F0F5FF] overflow-hidden">
        <div className="container mx-auto px-6 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div className="pt-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-4">
                India's <span className="text-blue-600">'Uber'</span> for Hiring Entry Level Talent
              </h1>

              <p className="text-base md:text-lg text-slate-700 font-medium mb-8 max-w-lg leading-relaxed">
                Hire Top <span className="text-blue-600 font-bold">1%</span> Engineers in{" "}
                <span className="text-[#334155]">Under an Hour</span> — Filtered Through National Standard Assessments,{" "}
                <span className="text-[#334155]">Offline Assessed</span> &amp; Nationally Ranked.
              </p>

              {/* Rotating point */}
              <div className="flex items-center gap-3 mb-8 h-6">
                <ChevronRight className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-sm font-medium text-slate-700 transition-opacity duration-200" style={{ opacity: fade ? 1 : 0 }}>
                  {ROTATING_POINTS[rotatingIdx]}
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={() => window.location.href = "/api/login"}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-7 py-3.5 rounded-lg transition-colors shadow-sm"
                  data-testid="button-explore-talent"
                >
                  Request Top Candidates
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => window.location.href = "/explore-edge"}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm px-7 py-3.5 rounded-lg transition-colors"
                  data-testid="button-explore-edge"
                >
                  Explore Edge
                </button>
              </div>
            </div>

            {/* Right — Hero illustration */}
            <div className="hidden lg:flex justify-center items-start">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>
      {/* ── Social Proof Strip ── */}
      <section className="bg-white border-b border-slate-100 py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {/* Hiring Partners */}
            <div>
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
                    <path d="M4 20c0-3 2.5-5 6-5h8c3.5 0 6 2 6 5" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="14" cy="9" r="4" stroke="#2563EB" strokeWidth="2"/>
                    <path d="M19 14l2 2 4-4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">2,300+</div>
              <div className="text-sm text-slate-500 mt-1">Hiring Partners</div>
            </div>

            {/* Engineers Placed */}
            <div>
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
                    <rect x="7" y="13" width="14" height="10" rx="2" stroke="#D97706" strokeWidth="2"/>
                    <path d="M10 13V10a4 4 0 018 0v3" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M11 18h6" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="20" cy="8" r="3" fill="#2563EB"/>
                    <path d="M18.5 8l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">16,000+</div>
              <div className="text-sm text-slate-500 mt-1">Engineers Placed</div>
            </div>

            {/* WEF 2024 */}
            <div>
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden p-1">
                  <img
                    src="https://44403767.fs1.hubspotusercontent-na1.net/hubfs/44403767/wo8138w5cb-world-economic-forum-logo-world-economic-forum-liblogo.png"
                    alt="World Economic Forum"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">WEF 2024</div>
              <div className="text-sm text-slate-500 mt-1">Tech Pioneer</div>
            </div>

            {/* Series A */}
            <div>
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                  <svg viewBox="0 0 28 28" className="w-6 h-6" fill="none">
                    <path d="M14 4 L14 6M14 22 L14 24M4 14 L6 14M22 14 L24 14" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="14" cy="14" r="7" stroke="#7C3AED" strokeWidth="2"/>
                    <path d="M11 14.5c0 1.5 1.3 2.5 3 2.5s3-1 3-2.5-1.3-2-3-2-3-1-3-2.5S12.3 8 14 8s3 1 3 2.5" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">$33M</div>
              <div className="text-sm text-slate-500 mt-1">Series A</div>
            </div>
          </div>
        </div>
      </section>
      {/* ── Feature Cards ── */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Why companies choose Edge</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Every shortlist is pre-screened, offline-evaluated, and benchmark-cleared — before it reaches you.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              {
                icon: (
                  <svg viewBox="0 0 56 56" className="w-14 h-14">
                    <rect width="56" height="56" rx="14" fill="#EFF6FF"/>
                    {/* clipboard body */}
                    <rect x="14" y="16" width="28" height="30" rx="4" fill="#BFDBFE"/>
                    <rect x="14" y="16" width="28" height="30" rx="4" fill="url(#clip-g1)"/>
                    <defs><linearGradient id="clip-g1" x1="14" y1="16" x2="42" y2="46" gradientUnits="userSpaceOnUse"><stop stopColor="#BFDBFE"/><stop offset="1" stopColor="#93C5FD"/></linearGradient></defs>
                    {/* clip top */}
                    <rect x="22" y="13" width="12" height="7" rx="3" fill="#2563EB"/>
                    {/* shield overlay */}
                    <path d="M28 24 l7 3 v5 c0 4-7 7-7 7s-7-3-7-7v-5z" fill="#1D4ED8"/>
                    {/* checkmark */}
                    <path d="M24 33 l2.5 2.5 L32 30" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                ),
                title: "High-Integrity Offline Evaluation",
                desc: "MAANG-standard assessment conducted fully offline with 1:25 invigilation.",
              },
              {
                icon: (
                  <svg viewBox="0 0 56 56" className="w-14 h-14">
                    <rect width="56" height="56" rx="14" fill="#FEF3C7"/>
                    {/* bars */}
                    <rect x="12" y="32" width="8" height="12" rx="2.5" fill="#F59E0B"/>
                    <rect x="24" y="24" width="8" height="20" rx="2.5" fill="#D97706"/>
                    <rect x="36" y="16" width="8" height="28" rx="2.5" fill="#2563EB"/>
                    {/* star on tallest bar */}
                    <circle cx="40" cy="12" r="5" fill="#1D4ED8"/>
                    <path d="M40 9.5 l0.7 1.4 1.6 0.2 -1.15 1.1 0.27 1.6 -1.42-0.75 -1.42 0.75 0.27-1.6 -1.15-1.1 1.6-0.2z" fill="#FFF"/>
                    {/* baseline */}
                    <rect x="10" y="44" width="36" height="2" rx="1" fill="#E2E8F0"/>
                  </svg>
                ),
                title: "National Percentile Ranking",
                desc: "Top 0.1% talent across India's top 300 NIRF-ranked campuses.",
              },
              {
                icon: (
                  <svg viewBox="0 0 56 56" className="w-14 h-14">
                    <rect width="56" height="56" rx="14" fill="#F0FDF4"/>
                    {/* clock face */}
                    <circle cx="28" cy="30" r="14" fill="#BBF7D0"/>
                    <circle cx="28" cy="30" r="10" fill="white"/>
                    <path d="M28 22 v8 l5 3" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="28" cy="30" r="1.5" fill="#16A34A"/>
                    {/* lightning bolt */}
                    <path d="M34 12 l-3 6 h3 l-3 6" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    {/* clock top knob */}
                    <rect x="25" y="15" width="6" height="3" rx="1.5" fill="#6EE7B7"/>
                  </svg>
                ),
                title: "Shortlists in Under 1 Hour",
                desc: "Only benchmark-cleared, high-trust candidates make it to your shortlist.",
              },
              {
                icon: (
                  <svg viewBox="0 0 56 56" className="w-14 h-14">
                    <rect width="56" height="56" rx="14" fill="#FDF2F8"/>
                    {/* target rings */}
                    <circle cx="28" cy="30" r="14" fill="#FBCFE8"/>
                    <circle cx="28" cy="30" r="9" fill="#F9A8D4"/>
                    <circle cx="28" cy="30" r="4.5" fill="#EC4899"/>
                    {/* arrow */}
                    <line x1="14" y1="16" x2="25" y2="27" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round"/>
                    <polygon points="12,12 18,14 14,20" fill="#2563EB"/>
                    {/* person icon on centre */}
                    <circle cx="28" cy="28.5" r="2" fill="white"/>
                    <path d="M24.5 33 Q28 31 31.5 33" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </svg>
                ),
                title: "Role-Aligned Talent Screening",
                desc: "Precision-filtered shortlist mapping for high-end DSA bars.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white border border-slate-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="mb-5">{icon}</div>
                <h3 className="text-sm font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.href = "/api/login"}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-3.5 rounded-lg transition-colors shadow-sm"
            >
              Get Top Candidates
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
      {/* ── Assessment orbit illustration + stats ── */}
      <section className="py-20 bg-[#F0F5FF]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Illustration */}
            <div className="hidden lg:flex justify-center">
              <AssessmentOrbitIllustration />
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                Hire trained developers<br />
                who create impact from day 1
              </h2>
              <p className="text-slate-500 mb-10 leading-relaxed">
                We recommend the best-fit candidates from our pool of rigorously trained and technically assessed developers.
              </p>

              <div className="grid grid-cols-2 gap-x-10 gap-y-8 mb-10">
                {[
                  { val: "3,00,000+", label: "Freshers evaluated offline" },
                  { val: "750+ Hrs", label: "Developer curriculum" },
                  { val: "250+", label: "NIRF campuses covered" },
                  { val: "MAANG", label: "Standard assessment bar" },
                ].map(({ val, label }) => (
                  <div key={val}>
                    <div className="text-2xl font-extrabold text-slate-900">{val}</div>
                    <div className="text-sm text-slate-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => window.location.href = "/api/login"}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-7 py-3.5 rounded-lg transition-colors shadow-sm"
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-slate-400 mt-3">300+ trained developers ready for hire</p>
            </div>
          </div>
        </div>
      </section>
      {/* ── Trusted By ── */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">
            Trusted by India's Leading Engineering Hiring Teams
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 mb-16">
            {PARTNER_LOGOS.map(logo => (
              <div
                key={logo.name}
                className="bg-white rounded-lg px-5 py-3 flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity"
              >
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>

          {/* Rotating testimonial */}
          <div className="max-w-2xl mx-auto text-center min-h-[130px]">
            <div className="flex justify-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
            </div>
            <p className="text-lg text-slate-200 leading-relaxed mb-5 italic">"{t.quote}"</p>
            <div className="text-sm text-slate-400">
              — {t.author}, <span className="text-blue-400 font-semibold">{t.company}</span>
            </div>
            <div className="flex justify-center gap-1.5 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === testimonialIdx ? "bg-blue-400" : "bg-slate-600"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ── India's First National Engineering Hiring Standard ── */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">

          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-5 uppercase tracking-widest">
              Why NxtWave Edge
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
              India's First National<br className="hidden sm:block" /> Engineering Hiring Standard
            </h2>
            <p className="text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
              Traditional hiring is broken. Here's why — and how Edge fixes every part of it.
            </p>
          </div>

          {/* 3-column cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {EDGE_CARDS.map(({ num, problem, problemDesc, solution }) => (
              <div key={num} className="relative bg-[#F8FAFC] rounded-2xl p-7 overflow-hidden flex flex-col">
                {/* Large decorative number */}
                <span className="absolute top-4 right-5 text-6xl font-black text-slate-900/[0.04] select-none leading-none">
                  {num}
                </span>

                {/* Number pill */}
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center mb-5 shrink-0">
                  {num}
                </div>

                {/* Problem */}
                <h3 className="text-base font-bold text-slate-900 leading-snug mb-3 pr-8">{problem}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{problemDesc}</p>

                {/* Solution */}
                <div className="flex items-start gap-2.5 mt-6 pt-5 border-t border-slate-200/60">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-blue-700 leading-snug">{solution}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>
      {/* ── Final CTA ── */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          {/* Illustration above CTA */}
          <div className="flex justify-center mb-8">
            <svg viewBox="0 0 280 120" fill="none" className="w-64 h-24">
              {/* Three candidate cards */}
              {[
                { x: 10, fill: "#1D4ED8", initials: "AK" },
                { x: 100, fill: "#2563EB", initials: "PS" },
                { x: 190, fill: "#1D4ED8", initials: "RV" },
              ].map(({ x, fill, initials }) => (
                <g key={initials}>
                  <rect x={x} y="20" width="80" height="90" rx="12" fill="white" opacity="0.08" />
                  <rect x={x} y="20" width="80" height="90" rx="12" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
                  <circle cx={x + 40} cy="48" r="16" fill={fill} />
                  <text x={x + 40} y="53" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{initials}</text>
                  <rect x={x + 14} y="72" width="52" height="5" rx="2.5" fill="white" opacity="0.2" />
                  <rect x={x + 20} y="82" width="40" height="4" rx="2" fill="white" opacity="0.12" />
                  {/* Checkmark badge */}
                  <circle cx={x + 64} cy="28" r="9" fill="#2563EB" />
                  <path d={`M${x+60} 28 l3 3 l6-6`} stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              ))}
              {/* Bolt */}
              <rect x="124" y="0" width="32" height="18" rx="9" fill="#2563EB" />
              <text x="140" y="13" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">⚡ 1h</text>
            </svg>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Ready to Hire India's<br />Top 1% Engineering Talent?
          </h2>
          <p className="text-slate-400 mb-10 text-base">Verified. Assessed. Delivered in under 1 hour.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = "/api/login"}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-8 py-4 rounded-lg transition-colors shadow-lg"
              data-testid="button-start-free-trial"
            >
              Get Top Candidates
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.location.href = "/explore-edge"}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm px-8 py-4 rounded-lg transition-colors"
              data-testid="button-book-demo"
            >
              Explore Edge
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4">Delivered within 1 hour.</p>
        </div>
      </section>
      {/* ── Footer strip ── */}
      <footer className="bg-slate-950 border-t border-white/5 py-6">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center">
            <img src={nxtWaveLogo} alt="NxtWave" className="h-7 w-auto brightness-0 invert" />
          </div>
          <p className="text-xs text-slate-500">© 2025 NxtWave. Built for India's Best Engineers.</p>
          <div className="flex gap-6">
            <button onClick={() => window.location.href = "/api/login"} className="text-xs text-slate-500 hover:text-slate-300 transition-colors">Login</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
