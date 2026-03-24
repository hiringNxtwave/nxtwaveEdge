import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Users, Building2, TrendingUp, Star, Target, CheckCircle,
  ArrowRight, GraduationCap, Zap, BarChart3, Shield, Clock,
  Award, Search, Heart, ChevronRight, Briefcase, Globe2
} from "lucide-react";
import { SiTata, SiInfosys, SiWipro, SiGoogle, SiAmazon, SiFlipkart } from "react-icons/si";
import Header from "@/components/header";
import MarketIntelligence from "@/components/market-intelligence";
import { useShortlist } from "@/contexts/shortlist-context";

export default function Home() {
  useScrollToTop();

  const { user, isAuthenticated } = useAuth();
  const { shortlistCount } = useShortlist();

  const { data: stats } = useQuery({
    queryKey: ["/api/company/stats"],
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Emerald glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20 px-4 py-1.5 text-sm font-medium tracking-wide">
              India's #1 Verified Talent Marketplace
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
              Hire India's{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Top 10% Talent
              </span>
              <br />
              in Under 14 Days
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Pre-assessed engineers, analysts, and professionals from India's premier institutions — ready to contribute from day one.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/browse">
                <Button
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-4 text-base rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:-translate-y-0.5 min-h-[52px]"
                  data-testid="button-get-started-cta"
                >
                  Browse Verified Talent
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/for-colleges">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-base rounded-xl min-h-[52px] bg-transparent"
                >
                  Learn How It Works
                </Button>
              </Link>
            </div>

            {/* Hero Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800 rounded-2xl overflow-hidden border border-slate-800">
              {[
                { value: "50,000+", label: "Verified Candidates" },
                { value: "500+", label: "Hiring Companies" },
                { value: "14 Days", label: "Avg. Time to Hire" },
                { value: "₹0", label: "Platform Fee" },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-900/80 px-6 py-5 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted By Strip ── */}
      <section className="bg-slate-50 border-y border-slate-100 py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
            Trusted by India's leading employers
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-10 items-center justify-items-center opacity-60">
            <SiTata className="h-7 md:h-9 w-auto text-slate-700" data-testid="logo-tata" />
            <SiInfosys className="h-7 md:h-9 w-auto text-slate-700" data-testid="logo-infosys" />
            <SiWipro className="h-7 md:h-9 w-auto text-slate-700" data-testid="logo-wipro" />
            <SiGoogle className="h-7 md:h-9 w-auto text-slate-700" data-testid="logo-google" />
            <SiAmazon className="h-7 md:h-9 w-auto text-slate-700" data-testid="logo-amazon" />
            <SiFlipkart className="h-7 md:h-9 w-auto text-slate-700" data-testid="logo-flipkart" />
          </div>
        </div>
      </section>

      {/* ── Authenticated Dashboard ── */}
      {isAuthenticated && (
        <section className="bg-white py-10 md:py-14 border-b border-slate-100">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            {/* Greeting */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Welcome back</p>
                <h2
                  className="text-2xl md:text-3xl font-bold text-slate-900"
                  data-testid="text-welcome"
                >
                  {user?.firstName ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}` : "Recruiter"}
                </h2>
              </div>
              <Link href="/browse">
                <Button
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl min-h-[48px]"
                  data-testid="card-browse-candidates"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse Candidates
                </Button>
              </Link>
            </div>

            {/* Dashboard Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  icon: Users,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  border: "border-blue-100",
                  value: "24",
                  label: "Profiles Viewed",
                  sub: "This week",
                },
                {
                  icon: Clock,
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                  border: "border-emerald-100",
                  value: "12",
                  label: "Avg. Days to Hire",
                  sub: "Platform avg. 14",
                },
                {
                  icon: BarChart3,
                  color: "text-violet-600",
                  bg: "bg-violet-50",
                  border: "border-violet-100",
                  value: "87%",
                  label: "Response Rate",
                  sub: "Last 30 days",
                },
                {
                  icon: TrendingUp,
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                  border: "border-amber-100",
                  value: "₹45L",
                  label: "Hiring Cost Saved",
                  sub: "This quarter",
                },
              ].map((m) => (
                <div
                  key={m.label}
                  className={`rounded-2xl border ${m.border} ${m.bg} p-5`}
                >
                  <div className={`w-9 h-9 rounded-xl ${m.bg} flex items-center justify-center mb-3`}>
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${m.color} mb-0.5`}>{m.value}</div>
                  <div className="text-sm font-semibold text-slate-700">{m.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{m.sub}</div>
                </div>
              ))}
            </div>

            {/* Shortlist CTA */}
            {shortlistCount > 0 && (
              <Link href="/shortlist">
                <div
                  className="flex items-center justify-between rounded-2xl border border-rose-100 bg-rose-50 px-6 py-4 cursor-pointer hover:border-rose-200 transition-colors"
                  data-testid="card-your-shortlist"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Your Shortlist</p>
                      <p className="text-sm text-slate-500">
                        {shortlistCount} candidate{shortlistCount !== 1 ? "s" : ""} saved for review
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-rose-600">{shortlistCount}</span>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── Value Proposition Cards ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-slate-100 text-slate-600 border-slate-200">Why TalentConnect</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Built for serious hiring
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Not a job board. A curated talent pipeline with quality signals that matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                accent: "emerald",
                title: "Pre-Verified Profiles",
                desc: "Every candidate is assessed for technical ability, communication, and cultural fit. No unverified resumes.",
                badge: "Quality Assured",
              },
              {
                icon: Target,
                accent: "blue",
                title: "Precision Matching",
                desc: "Filter by NIRF rankings, CGPA, skills, salary expectations, and location. Your JD drives the match score.",
                badge: "AI-Powered",
              },
              {
                icon: Zap,
                accent: "amber",
                title: "Hire in 14 Days",
                desc: "Candidates are ready. No long notice periods or negotiations. Shortlist → Interview → Offer.",
                badge: "Fast Turnaround",
              },
            ].map((f) => {
              const accentMap: Record<string, string> = {
                emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
                blue: "bg-blue-50 text-blue-600 border-blue-100",
                amber: "bg-amber-50 text-amber-600 border-amber-100",
              };
              const badgeMap: Record<string, string> = {
                emerald: "bg-emerald-100 text-emerald-700",
                blue: "bg-blue-100 text-blue-700",
                amber: "bg-amber-100 text-amber-700",
              };
              const borderMap: Record<string, string> = {
                emerald: "border-t-emerald-500",
                blue: "border-t-blue-500",
                amber: "border-t-amber-500",
              };
              return (
                <Card
                  key={f.title}
                  className={`border border-slate-100 border-t-4 ${borderMap[f.accent]} shadow-sm hover:shadow-md transition-shadow rounded-2xl`}
                  data-testid={`card-feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <CardHeader className="p-6 pb-0">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${accentMap[f.accent]}`}
                    >
                      <f.icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg font-bold text-slate-900">{f.title}</CardTitle>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badgeMap[f.accent]}`}>
                      {f.badge}
                    </span>
                  </CardHeader>
                  <CardContent className="p-6 pt-4">
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-white text-slate-600 border-slate-200">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              From requirement to hire in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-slate-200 via-emerald-300 to-slate-200" />

            {[
              {
                step: "01",
                icon: Briefcase,
                title: "Upload Your JD",
                desc: "Paste your Job Description or upload a PDF. Our AI parses requirements and creates a match profile instantly.",
              },
              {
                step: "02",
                icon: Search,
                title: "Browse Matched Talent",
                desc: "See ranked candidates with match scores, NIRF college rankings, skills, and salary expectations.",
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "Shortlist & Hire",
                desc: "Save your favourites, schedule interviews, and extend offers — all from your dashboard.",
              },
            ].map((s, i) => (
              <div key={s.step} className="relative text-center">
                <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <s.icon className="w-7 h-7 text-slate-700" />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Step {s.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market Intelligence ── */}
      <section className="py-10 md:py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="mb-4 bg-slate-100 text-slate-600 border-slate-200">Market Intelligence</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Hiring insights at your fingertips
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Benchmark salaries, track competitor hiring, and understand the talent landscape before you post a role.
            </p>
          </div>
          <MarketIntelligence />
        </div>
      </section>

      {/* ── Social Proof ── */}
      <section className="py-16 md:py-24 bg-slate-950 text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Numbers that speak for themselves
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Real outcomes from companies that have hired through TalentConnect India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                metric: "75%",
                label: "Reduction in hiring time",
                detail: "Compared to traditional campus hiring",
                color: "emerald",
              },
              {
                metric: "4.8 / 5",
                label: "Average recruiter rating",
                detail: "Based on 1,200+ company reviews",
                color: "blue",
              },
              {
                metric: "92%",
                label: "Offer acceptance rate",
                detail: "Candidates are pre-qualified and motivated",
                color: "amber",
              },
            ].map((s) => {
              const colorMap: Record<string, string> = {
                emerald: "text-emerald-400",
                blue: "text-blue-400",
                amber: "text-amber-400",
              };
              const borderMap: Record<string, string> = {
                emerald: "border-emerald-500/30",
                blue: "border-blue-500/30",
                amber: "border-amber-500/30",
              };
              return (
                <div
                  key={s.label}
                  className={`bg-slate-900 border ${borderMap[s.color]} rounded-2xl p-8 text-center`}
                >
                  <div className={`text-5xl font-bold ${colorMap[s.color]} mb-3`}>{s.metric}</div>
                  <div className="text-lg font-semibold text-white mb-2">{s.label}</div>
                  <div className="text-sm text-slate-500">{s.detail}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-emerald-700">
                847 companies actively hiring right now
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Ready to build your{" "}
              <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                dream team?
              </span>
            </h2>

            <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Access 50,000+ pre-verified candidates from IITs, NITs, BITS, and India's top institutions. No placement fees. No hidden costs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/browse">
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 text-base rounded-xl shadow-lg min-h-[52px]"
                  data-testid="button-browse-now"
                >
                  Start Browsing Candidates
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-slate-400">
              {[
                { icon: CheckCircle, label: "Free to start" },
                { icon: Shield, label: "Verified profiles only" },
                { icon: Globe2, label: "Pan-India coverage" },
              ].map((t) => (
                <span key={t.label} className="flex items-center gap-2">
                  <t.icon className="w-4 h-4 text-emerald-500" />
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
