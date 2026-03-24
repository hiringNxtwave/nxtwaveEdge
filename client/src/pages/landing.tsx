import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useScrollToTop } from "@/hooks/useScrollToTop";
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

const PARTNER_LOGOS = ["Kotak", "Lloyds", "ThoughtWorks", "Exotel", "Anand Rathi", "ADP"];

const EDGE_CARDS = [
  { problem: "Because online evaluation can't be trusted anymore", problemDesc: "Cheating and test inflation have made digital assessments unreliable.", solution: "With Edge: Reliable assessments built on proven offline integrity.", align: "left" },
  { problem: "Because 'tier' doesn't tell you who can actually code", problemDesc: "Readiness varies drastically even inside top NIRF campuses.", solution: "With Edge: Consistent evaluation of engineering talent across campuses.", align: "right" },
  { problem: "Because hiring teams don't need more resumes — they need answers", problemDesc: "Screening hundreds of profiles slows teams without improving quality.", solution: "With Edge: A clear way to identify truly job-ready freshers.", align: "left" },
];

/* ── SVG Illustrations ─────────────────────────────────── */

function HeroIllustration() {
  return (
    <svg viewBox="0 0 480 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg">
      {/* Background circles */}
      <circle cx="240" cy="200" r="170" fill="#EFF6FF" />
      <circle cx="240" cy="200" r="120" fill="#DBEAFE" />

      {/* Central figure */}
      <rect x="195" y="140" width="90" height="110" rx="16" fill="#1D4ED8" />
      <circle cx="240" cy="120" r="28" fill="#1D4ED8" />
      {/* Face */}
      <circle cx="240" cy="120" r="24" fill="#FDE68A" />
      <circle cx="231" cy="117" r="3" fill="#1E293B" />
      <circle cx="249" cy="117" r="3" fill="#1E293B" />
      <path d="M233 126 Q240 131 247 126" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      {/* Shirt text */}
      <text x="240" y="200" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">NIRF</text>
      <text x="240" y="215" textAnchor="middle" fill="#BFDBFE" fontSize="9">Top 1%</text>

      {/* Verified badge — top right */}
      <rect x="320" y="80" width="110" height="52" rx="12" fill="white" stroke="#DBEAFE" strokeWidth="1.5" />
      <circle cx="345" cy="106" r="12" fill="#2563EB" />
      <path d="M339 106 l4 4 l7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="363" y="102" fill="#1E293B" fontSize="10" fontWeight="bold">Verified</text>
      <text x="363" y="116" fill="#64748B" fontSize="9">Top Candidate</text>

      {/* Score card — top left */}
      <rect x="58" y="90" width="108" height="60" rx="12" fill="white" stroke="#DBEAFE" strokeWidth="1.5" />
      <text x="112" y="115" textAnchor="middle" fill="#1D4ED8" fontSize="20" fontWeight="bold">96</text>
      <text x="112" y="130" textAnchor="middle" fill="#64748B" fontSize="9">MAANG Score</text>
      <rect x="70" y="138" width="84" height="4" rx="2" fill="#DBEAFE" />
      <rect x="70" y="138" width="73" height="4" rx="2" fill="#2563EB" />

      {/* Delivery badge — bottom right */}
      <rect x="315" y="255" width="120" height="52" rx="12" fill="#1D4ED8" />
      <text x="375" y="278" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">⚡ 3 Hours</text>
      <text x="375" y="295" textAnchor="middle" fill="#BFDBFE" fontSize="9">Delivery Guaranteed</text>

      {/* Offline badge — bottom left */}
      <rect x="55" y="262" width="118" height="52" rx="12" fill="white" stroke="#DBEAFE" strokeWidth="1.5" />
      <text x="114" y="284" textAnchor="middle" fill="#1E293B" fontSize="10" fontWeight="bold">🛡 Offline</text>
      <text x="114" y="298" textAnchor="middle" fill="#64748B" fontSize="9">Proctored Exam</text>

      {/* Connecting lines */}
      <line x1="190" y1="165" x2="166" y2="145" stroke="#BFDBFE" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="290" y1="165" x2="320" y2="130" stroke="#BFDBFE" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="280" y1="230" x2="315" y2="265" stroke="#BFDBFE" strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1="200" y1="235" x2="173" y2="265" stroke="#BFDBFE" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* NIRF campus dots around orbit */}
      {[{ cx: 110, cy: 200 }, { cx: 240, cy: 52 }, { cx: 370, cy: 200 }, { cx: 240, cy: 348 }].map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r="6" fill="#2563EB" opacity="0.3" />
      ))}
    </svg>
  );
}

function AssessmentOrbitIllustration() {
  const skills = [
    { label: "DSA", x: 420, y: 130, color: "#2563EB" },
    { label: "SQL", x: 490, y: 200, color: "#3B82F6" },
    { label: "CS", x: 455, y: 285, color: "#1D4ED8" },
    { label: "React", x: 360, y: 330, color: "#2563EB" },
    { label: "Python", x: 260, y: 340, color: "#3B82F6" },
    { label: "DSA+", x: 175, y: 295, color: "#1D4ED8" },
    { label: "Aptitude", x: 145, y: 200, color: "#2563EB" },
    { label: "Comm.", x: 200, y: 115, color: "#3B82F6" },
  ];
  return (
    <svg viewBox="0 0 640 460" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xl">
      <ellipse cx="320" cy="230" rx="180" ry="155" stroke="#DBEAFE" strokeWidth="1.5" strokeDasharray="5 4" />
      <ellipse cx="320" cy="230" rx="110" ry="95" stroke="#BFDBFE" strokeWidth="1.5" strokeDasharray="5 4" />

      {/* Central engineer figure */}
      <circle cx="320" cy="230" r="52" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="2" />
      <circle cx="320" cy="210" r="16" fill="#FDE68A" />
      <circle cx="313" cy="207" r="2.5" fill="#1E293B" />
      <circle cx="327" cy="207" r="2.5" fill="#1E293B" />
      <path d="M314 216 Q320 221 326 216" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <rect x="305" y="228" width="30" height="36" rx="8" fill="#2563EB" />
      <text x="320" y="252" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">IIT</text>

      {/* Skill badges around orbit */}
      {skills.map(({ label, x, y, color }) => (
        <g key={label}>
          <rect x={x - 26} y={y - 14} width="52" height="28" rx="8" fill="white" stroke="#DBEAFE" strokeWidth="1.5" />
          <text x={x} y={y + 5} textAnchor="middle" fill={color} fontSize="9.5" fontWeight="bold">{label}</text>
        </g>
      ))}

      {/* Score badges inside orbit */}
      <rect x="245" y="150" width="75" height="36" rx="10" fill="#2563EB" />
      <text x="283" y="172" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">96 / 100</text>

      <rect x="300" y="290" width="68" height="30" rx="8" fill="white" stroke="#DBEAFE" strokeWidth="1.5" />
      <text x="334" y="309" textAnchor="middle" fill="#1D4ED8" fontSize="10" fontWeight="bold">1:25 ratio</text>
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
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">N</span>
              </div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                Nxt<span className="text-blue-600">Wave</span> <span className="font-semibold text-slate-500 text-base">Edge</span>
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/for-colleges" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">For Colleges</Link>
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.15] mb-4">
                India's <span className="text-blue-600">'Uber'</span> for Hiring Entry Level Talent
              </h1>

              <p className="text-base md:text-lg text-slate-700 font-medium mb-8 max-w-lg leading-relaxed">
                Hire top <span className="text-blue-600 font-bold">1%</span> engineers filtered through National Standard Assessment —{" "}
                <span className="text-slate-900">Offline Assessed</span>, nationally ranked{" "}
                <span className="text-slate-900">under an hour</span>.
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
                  onClick={() => window.location.href = "/api/login"}
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm px-7 py-3.5 rounded-lg transition-colors"
                  data-testid="button-explore-edge"
                >
                  Explore Edge
                </button>
              </div>
              <p className="text-xs text-slate-400">Shortlists delivered within 3 hours.</p>
            </div>

            {/* Right — Hero illustration */}
            <div className="hidden lg:flex justify-center items-center">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof Strip ── */}
      <section className="bg-white border-b border-slate-100 py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { val: "2,300+", label: "Hiring Partners" },
              { val: "16,000+", label: "Engineers Placed" },
              { val: "WEF 2024", label: "Tech Pioneer" },
              { val: "$33M", label: "Series A" },
            ].map(({ val, label }) => (
              <div key={val}>
                <div className="text-2xl font-extrabold text-slate-900">{val}</div>
                <div className="text-sm text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="py-20 bg-white">
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
                title: "Shortlists in 3 Hours",
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

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-5 mb-16">
            {PARTNER_LOGOS.map(name => (
              <span key={name} className="text-slate-300 font-bold text-xl tracking-tight opacity-75 hover:opacity-100 transition-opacity">
                {name}
              </span>
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

      {/* ── Micro-Metric Strip ── */}
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col sm:flex-row justify-center gap-10 md:gap-20 mb-8">
            {[
              { val: "2,500+", label: "Companies hiring with NxtWave" },
              { val: "16,000+", label: "Engineers placed in high-quality roles" },
              { val: "WEF 2024", label: "Technology Pioneer" },
            ].map(({ val, label }) => (
              <div key={val}>
                <div className="text-2xl font-extrabold text-slate-900">{val}</div>
                <div className="text-sm text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => window.location.href = "/api/login"}
            className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-400 text-slate-800 font-semibold text-sm px-6 py-3 rounded-lg transition-colors"
          >
            Explore Edge <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── India's First National Engineering Hiring Standard ── */}
      <section className="py-24 bg-[#F0F5FF]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block text-xs font-bold text-blue-700 bg-blue-100 border border-blue-200 rounded-full px-4 py-1.5 mb-4 uppercase tracking-wider">
              Need for NxtWave Edge
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              India's First National<br />Engineering Hiring Standard
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-5">
            {EDGE_CARDS.map(({ problem, problemDesc, solution, align }, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm"
                style={{ maxWidth: "520px", marginLeft: align === "right" ? "auto" : undefined }}
              >
                <p className="text-base font-bold text-slate-900 mb-2">{problem}</p>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">{problemDesc}</p>
                <div className="flex items-start gap-3 pt-4 border-t border-slate-50">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-sm font-semibold text-blue-700">{solution}</p>
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
              <text x="140" y="13" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">⚡ 3h</text>
            </svg>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Ready to Hire India's<br />Top 1% Engineering Talent?
          </h2>
          <p className="text-slate-400 mb-10 text-base">Verified. Assessed. Delivered in 3 hours.</p>

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
              onClick={() => window.location.href = "/api/login"}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm px-8 py-4 rounded-lg transition-colors"
              data-testid="button-book-demo"
            >
              Explore Edge
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-4">Delivered within 3 hours.</p>
        </div>
      </section>

      {/* ── Footer strip ── */}
      <footer className="bg-slate-950 border-t border-white/5 py-6">
        <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="text-sm font-bold text-white">NxtWave Edge</span>
          </div>
          <p className="text-xs text-slate-500">© 2025 NxtWave. Built for India's Best Engineers.</p>
          <div className="flex gap-6">
            <Link href="/for-colleges" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">For Colleges</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
