import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { ArrowRight, Shield, BarChart3, Clock, Target, ChevronRight, Star } from "lucide-react";

const ROTATING_POINTS = [
  "Verified shortlists delivered within minutes",
  "3,00,000+ freshers evaluated offline",
  "Final Year Students from Top 250+ NIRF campuses",
  "MAANG Standard Assessment & Interview",
];

const TESTIMONIALS = [
  {
    quote: "We haven't seen such quality in fresher hiring before — exceptional pool and coordination.",
    author: "Hiring Manager",
    company: "Anand Rathi",
  },
  {
    quote: "We highly appreciate the streamlined Tier-2 delivery model. It helped us meet our volume hiring goals faster than expected.",
    author: "Hiring Team",
    company: "One of the Big4 Firms",
  },
  {
    quote: "Your team saved us significant time and cost while delivering Tier-1 quality faster than any agency.",
    author: "HR Team",
    company: "Kotak Mahindra Bank",
  },
  {
    quote: "I've never seen such high-quality fresher talent from any vendor.",
    author: "Ansh",
    company: "Exotel",
  },
  {
    quote: "We appreciate the coordination and quality. We will continue to trust you for all our fresher hiring needs.",
    author: "Hiring Team",
    company: "LeadSquared",
  },
  {
    quote: "We're very happy with the quality of candidates shared and would love to receive more profiles from you.",
    author: "Hiring Manager",
    company: "Hyperfin",
  },
];

const FEATURE_CARDS = [
  {
    icon: Shield,
    title: "High-Integrity Offline Evaluation",
    desc: "MAANG-standard assessment conducted fully offline with 1:25 invigilation.",
  },
  {
    icon: BarChart3,
    title: "National Percentile Ranking",
    desc: "Top 1% talent across India's top 300 NIRF-ranked campuses.",
  },
  {
    icon: Clock,
    title: "Shortlists Delivered in 3 Hours",
    desc: "Only benchmark-cleared, high-trust candidates make it to your shortlist.",
  },
  {
    icon: Target,
    title: "Role-Aligned Talent Screening",
    desc: "Precision-filtered shortlist mapping for high-end DSA bars.",
  },
];

const EDGE_CARDS = [
  {
    problem: "Because online evaluation can't be trusted anymore",
    problemDesc: "Cheating and test inflation have made digital assessments unreliable.",
    solution: "With Edge: Reliable assessments built on proven offline integrity.",
    align: "left",
  },
  {
    problem: "Because 'tier' doesn't tell you who can actually code",
    problemDesc: "Readiness varies drastically even inside top NIRF campuses.",
    solution: "With Edge: Consistent evaluation of engineering talent across campuses.",
    align: "right",
  },
  {
    problem: "Because hiring teams don't need more resumes — they need answers",
    problemDesc: "Screening hundreds of profiles slows teams without improving quality.",
    solution: "With Edge: A clear way to identify truly job-ready freshers.",
    align: "left",
  },
];

const PARTNER_LOGOS = ["Kotak", "Lloyds", "ThoughtWorks", "Exotel", "Anand Rathi", "ADP"];

export default function Landing() {
  useScrollToTop();

  const [rotatingIdx, setRotatingIdx] = useState(0);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setRotatingIdx((i) => (i + 1) % ROTATING_POINTS.length);
        setFade(true);
      }, 200);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length);
    }, 4500);
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
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="text-lg font-bold text-slate-900">NxtWave <span className="text-emerald-600">Edge</span></span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/for-students" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                For Students
              </Link>
              <Link href="/for-colleges" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                For Colleges
              </Link>
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 h-9 rounded-lg"
                data-testid="button-login"
              >
                Log in
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-[#0B1628] text-white">
        <div className="container mx-auto px-6 py-24 md:py-32">
          {/* Kicker */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 text-sm font-medium text-emerald-400 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            India's 'Uber' for Hiring Entry Level Talent
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 max-w-4xl">
            Hire India's Top 1%<br />Engineers.
            <span className="block text-emerald-400 mt-1">From a National Standard Assessment.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
            An offline, proctored, fool-proof tech hiring system built for scale and certainty.
          </p>

          {/* Rotating point */}
          <div className="flex items-center gap-3 mb-12 h-7">
            <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0" />
            <span
              className="text-base text-white font-medium transition-opacity duration-200"
              style={{ opacity: fade ? 1 : 0 }}
            >
              {ROTATING_POINTS[rotatingIdx]}
            </span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.location.href = "/api/login"}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-7 py-3.5 rounded-lg transition-colors"
              data-testid="button-explore-talent"
            >
              Request Top Candidates
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.location.href = "/api/login"}
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm px-7 py-3.5 rounded-lg transition-colors"
              data-testid="button-explore-edge"
            >
              Explore Edge
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-4">Delivered within 3 hours.</p>

          {/* Social proof strip below hero */}
          <div className="mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: "2,300+", label: "Hiring Partners" },
              { val: "16,000+", label: "Engineers Placed" },
              { val: "WEF Tech Pioneer", label: "2024" },
              { val: "$33M Series A", label: "Backed" },
            ].map(({ val, label }) => (
              <div key={val}>
                <div className="text-xl font-bold text-white">{val}</div>
                <div className="text-sm text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Cards ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {FEATURE_CARDS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-slate-100 rounded-xl p-6 hover:border-emerald-200 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.href = "/api/login"}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-8 py-3.5 rounded-lg transition-colors"
            >
              Get Top Candidates
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Trusted By ── */}
      <section className="py-20 bg-slate-950 text-white">
        <div className="container mx-auto px-6">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-10">
            Trusted by India's Leading Engineering Hiring Teams
          </p>

          {/* Logo strip */}
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mb-16">
            {PARTNER_LOGOS.map((name) => (
              <span key={name} className="text-slate-300 font-semibold text-lg tracking-tight opacity-80 hover:opacity-100 transition-opacity">
                {name}
              </span>
            ))}
          </div>

          {/* Rotating testimonial */}
          <div className="max-w-2xl mx-auto text-center min-h-[120px]">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-lg text-slate-200 leading-relaxed mb-5 italic">
              "{t.quote}"
            </p>
            <div className="text-sm text-slate-400">
              — {t.author}, <span className="text-emerald-400 font-medium">{t.company}</span>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-1.5 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === testimonialIdx ? "bg-emerald-400" : "bg-slate-600"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Micro-Metric Strip ── */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row gap-10 md:gap-16">
              {[
                { val: "2,500+", label: "Companies hiring with NxtWave" },
                { val: "16,000+", label: "Engineers placed in high-quality roles" },
                { val: "WEF 2024", label: "Technology Pioneer" },
              ].map(({ val, label }) => (
                <div key={val} className="text-center md:text-left">
                  <div className="text-2xl font-extrabold text-slate-900">{val}</div>
                  <div className="text-sm text-slate-500 mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = "/api/login"}
              className="inline-flex items-center gap-2 border border-slate-200 hover:border-slate-400 text-slate-800 font-semibold text-sm px-6 py-3 rounded-lg transition-colors shrink-0"
            >
              Explore Edge
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── India's First National Engineering Hiring Standard ── */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-1.5 mb-4 uppercase tracking-wider">
              Need for NxtWave Edge
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              India's First National<br />Engineering Hiring Standard
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            {EDGE_CARDS.map(({ problem, problemDesc, solution, align }, idx) => (
              <div
                key={idx}
                className={`bg-white border border-slate-100 rounded-2xl p-8 shadow-sm ${align === "right" ? "ml-auto" : ""}`}
                style={{ maxWidth: "520px", marginLeft: align === "right" ? "auto" : undefined }}
              >
                <p className="text-base font-bold text-slate-900 mb-2">{problem}</p>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">{problemDesc}</p>
                <div className="flex items-start gap-3 pt-4 border-t border-slate-50">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 10">
                      <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-emerald-700">{solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-24 bg-[#0B1628] text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Ready to Hire India's<br />Top 1% Engineering Talent?
          </h2>
          <p className="text-slate-400 mb-10 text-base">Verified. Assessed. Delivered in 3 hours.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = "/api/login"}
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-8 py-4 rounded-lg transition-colors"
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
            <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="text-sm font-semibold text-white">NxtWave Edge</span>
          </div>
          <p className="text-xs text-slate-500">© 2025 NxtWave. Built for India's Best Engineers.</p>
          <div className="flex gap-6">
            <Link href="/for-students" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">For Students</Link>
            <Link href="/for-colleges" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">For Colleges</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
