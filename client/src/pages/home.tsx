import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Users, TrendingUp, Clock, BarChart3,
  ArrowRight, Shield, Target, Zap,
  Search, Heart, ChevronRight, CheckCircle,
  Globe2, Briefcase, Sparkles, Star, ArrowUpRight,
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

  if (isAuthenticated) {
    return <RecruiterDashboard user={user} shortlistCount={shortlistCount} />;
  }

  return <MarketingHome />;
}

function RecruiterDashboard({ user, shortlistCount }: { user: any; shortlistCount: number }) {
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
    : "Recruiter";

  const metrics = [
    {
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      value: "24",
      label: "Profiles Viewed",
      sub: "This week",
      trend: "+8 vs last week",
      trendUp: true,
    },
    {
      icon: Clock,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      value: "12",
      label: "Avg. Days to Hire",
      sub: "Platform avg. 14",
      trend: "2 days faster",
      trendUp: true,
    },
    {
      icon: BarChart3,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
      value: "87%",
      label: "Response Rate",
      sub: "Last 30 days",
      trend: "+3% vs last month",
      trendUp: true,
    },
    {
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      value: "₹45L",
      label: "Hiring Cost Saved",
      sub: "This quarter",
      trend: "vs agency fees",
      trendUp: true,
    },
  ];

  const quickActions = [
    {
      href: "/browse",
      icon: Search,
      label: "Browse Talent",
      desc: "Search 50k+ verified candidates",
      color: "bg-slate-900 text-white hover:bg-slate-800",
    },
    {
      href: "/company-profile",
      icon: Briefcase,
      label: "Upload JD",
      desc: "AI-parse your job description",
      color: "bg-blue-500 text-white hover:bg-blue-400",
    },
    {
      href: "/talent-dashboard",
      icon: BarChart3,
      label: "Talent Analytics",
      desc: "View market insights & benchmarks",
      color: "bg-blue-600 text-white hover:bg-blue-500",
    },
  ];

  const recentActivity = [
    { action: "Profile viewed", name: "Aryan Mehta", detail: "IIT Bombay · CSE", time: "2m ago", dot: "bg-blue-500" },
    { action: "Added to shortlist", name: "Priya Nair", detail: "NIT Trichy · ECE", time: "14m ago", dot: "bg-rose-500" },
    { action: "Profile viewed", name: "Rahul Singh", detail: "BITS Pilani · CS", time: "1h ago", dot: "bg-blue-500" },
    { action: "Offer sent", name: "Sneha Iyer", detail: "IIT Madras · CS", time: "3h ago", dot: "bg-blue-500" },
    { action: "Added to shortlist", name: "Karan Gupta", detail: "IIT Delhi · CSE", time: "5h ago", dot: "bg-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
              Welcome back
            </p>
            <h1 className="text-xl font-bold text-slate-900" data-testid="text-welcome">
              {displayName}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/company-profile">
              <Button
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-600 hover:bg-slate-50 text-sm"
              >
                <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                Upload JD
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm"
                data-testid="card-browse-candidates"
              >
                <Search className="w-3.5 h-3.5 mr-1.5" />
                Browse Candidates
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className={`rounded-xl border ${m.border} bg-white p-5 shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`w-8 h-8 rounded-lg ${m.bg} flex items-center justify-center mb-3`}>
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div className={`text-2xl font-bold ${m.color} mb-0.5`}>{m.value}</div>
              <div className="text-sm font-semibold text-slate-700">{m.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{m.sub}</div>
              <div className={`flex items-center gap-1 mt-2 text-[11px] font-medium ${m.trendUp ? "text-blue-600" : "text-red-500"}`}>
                <ArrowUpRight className="w-3 h-3" />
                {m.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Quick Actions - 2/3 */}
          <div className="lg:col-span-2 space-y-5">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-3 gap-3">
                {quickActions.map((a) => (
                  <Link key={a.href} href={a.href}>
                    <div className={`rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${a.color}`}>
                      <a.icon className="w-5 h-5 mb-2.5 opacity-90" />
                      <div className="font-semibold text-sm mb-0.5">{a.label}</div>
                      <div className="text-xs opacity-75 leading-snug">{a.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Shortlist CTA */}
            {shortlistCount > 0 && (
              <Link href="/shortlist">
                <div
                  className="flex items-center justify-between rounded-xl border border-rose-100 bg-rose-50 px-5 py-4 cursor-pointer hover:border-rose-200 hover:shadow-sm transition-all"
                  data-testid="card-your-shortlist"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-rose-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">Your Shortlist</p>
                      <p className="text-xs text-slate-500">
                        {shortlistCount} candidate{shortlistCount !== 1 ? "s" : ""} saved for review
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-rose-600">{shortlistCount}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </Link>
            )}

            {/* Market Intelligence */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-800">Market Intelligence</h2>
                <Link href="/talent-dashboard">
                  <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-slate-900 h-7 px-2">
                    View all <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
              <MarketIntelligence compact />
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-5">
            {/* Platform Stats */}
            <div className="bg-slate-950 rounded-xl p-5 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Platform Stats
                </span>
              </div>
              {[
                { label: "Verified Candidates", value: "50,000+", color: "text-blue-400" },
                { label: "Hiring Companies", value: "500+", color: "text-blue-400" },
                { label: "Avg. Time to Hire", value: "14 days", color: "text-amber-400" },
                { label: "Offer Acceptance", value: "92%", color: "text-violet-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-2.5 border-b border-slate-800 last:border-0">
                  <span className="text-xs text-slate-400">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.dot} mt-1.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 truncate">
                        {a.action} — <span className="text-slate-900">{a.name}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{a.detail}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{a.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hire In Steps */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h2 className="text-sm font-semibold text-slate-800 mb-4">Hiring Checklist</h2>
              {[
                { done: true, label: "Set up company profile" },
                { done: false, label: "Upload a Job Description" },
                { done: false, label: "Shortlist 5+ candidates" },
                { done: false, label: "Schedule interviews" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 py-2 border-b border-slate-50 last:border-0">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-blue-500" : "border-2 border-slate-200"}`}>
                    {item.done && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className={`text-xs font-medium ${item.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketingHome() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/20 px-4 py-1.5 text-sm font-medium tracking-wide">
              India's #1 Verified Talent Marketplace
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
              Hire India's{" "}
              <span className="text-blue-500">
                Top 10% Talent
              </span>
              <br />
              in Under 14 Days
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Pre-assessed engineers, analysts, and professionals from India's premier institutions — ready to contribute from day one.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold px-8 py-4 text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:-translate-y-0.5 min-h-[52px]"
                onClick={() => (window.location.href = "/api/login")}
                data-testid="button-get-started-cta"
              >
                Browse Verified Talent
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white px-8 py-4 text-base rounded-xl min-h-[52px] bg-transparent"
                onClick={() => (window.location.href = "/for-colleges")}
              >
                Learn How It Works
              </Button>
            </div>

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

      {/* Trusted By */}
      <section className="bg-slate-50 border-y border-slate-100 py-10 md:py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
            Trusted by India's leading employers
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-10 items-center justify-items-center opacity-60">
            <SiTata className="h-7 md:h-9 w-auto text-slate-700" />
            <SiInfosys className="h-7 md:h-9 w-auto text-slate-700" />
            <SiWipro className="h-7 md:h-9 w-auto text-slate-700" />
            <SiGoogle className="h-7 md:h-9 w-auto text-slate-700" />
            <SiAmazon className="h-7 md:h-9 w-auto text-slate-700" />
            <SiFlipkart className="h-7 md:h-9 w-auto text-slate-700" />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-slate-100 text-slate-600 border-slate-200">Why TalentConnect</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Built for serious hiring</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Not a job board. A curated talent pipeline with quality signals that matter.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, accent: "blue", title: "Pre-Verified Profiles", desc: "Every candidate is assessed for technical ability, communication, and cultural fit.", badge: "Quality Assured" },
              { icon: Target, accent: "blue", title: "Precision Matching", desc: "Filter by NIRF rankings, CGPA, skills, salary expectations, and location.", badge: "AI-Powered" },
              { icon: Zap, accent: "amber", title: "Hire in 14 Days", desc: "Candidates are ready. No long notice periods or negotiations.", badge: "Fast Turnaround" },
            ].map((f) => {
              const accent: Record<string, string> = {
                blue: "bg-blue-50 text-blue-600 border-blue-100",
                amber: "bg-amber-50 text-amber-600 border-amber-100",
              };
              const badge: Record<string, string> = {
                blue: "bg-blue-100 text-blue-700",
                amber: "bg-amber-100 text-amber-700",
              };
              const top: Record<string, string> = {
                blue: "border-t-blue-500",
                amber: "border-t-amber-500",
              };
              return (
                <div key={f.title} className={`border border-slate-100 border-t-4 ${top[f.accent]} shadow-sm hover:shadow-md transition-shadow rounded-2xl p-6`}>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${accent[f.accent]}`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${badge[f.accent]}`}>{f.badge}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-white text-slate-600 border-slate-200">Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">From requirement to hire in 3 steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: Briefcase, title: "Upload Your JD", desc: "Paste your Job Description or upload a PDF. Our AI parses requirements instantly." },
              { step: "02", icon: Search, title: "Browse Matched Talent", desc: "See ranked candidates with match scores, NIRF rankings, skills, and salary expectations." },
              { step: "03", icon: CheckCircle, title: "Shortlist & Hire", desc: "Save favourites, schedule interviews, and extend offers — all from your dashboard." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <s.icon className="w-6 h-6 text-slate-700" />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Step {s.step}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 md:py-24 bg-slate-950 text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Numbers that speak for themselves</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Real outcomes from companies that have hired through TalentConnect India</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { metric: "75%", label: "Reduction in hiring time", detail: "Compared to traditional campus hiring", color: "blue" },
              { metric: "4.8 / 5", label: "Average recruiter rating", detail: "Based on 1,200+ company reviews", color: "blue" },
              { metric: "92%", label: "Offer acceptance rate", detail: "Candidates are pre-qualified and motivated", color: "amber" },
            ].map((s) => {
              const c: Record<string, string> = { blue: "text-blue-400", amber: "text-amber-400" };
              const b: Record<string, string> = { blue: "border-blue-500/30", amber: "border-amber-500/30" };
              return (
                <div key={s.label} className={`bg-slate-900 border ${b[s.color]} rounded-2xl p-8 text-center`}>
                  <div className={`text-5xl font-bold ${c[s.color]} mb-3`}>{s.metric}</div>
                  <div className="text-lg font-semibold text-white mb-2">{s.label}</div>
                  <div className="text-sm text-slate-500">{s.detail}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-blue-700">847 companies actively hiring right now</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Ready to build your{" "}
              <span className="text-blue-600">dream team?</span>
            </h2>
            <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Access 50,000+ pre-verified candidates from IITs, NITs, BITS, and India's top institutions. No placement fees.
            </p>
            <Button
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 text-base rounded-xl shadow-lg min-h-[52px]"
              onClick={() => (window.location.href = "/api/login")}
              data-testid="button-browse-now"
            >
              Start Browsing Candidates
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-slate-400">
              {[
                { icon: CheckCircle, label: "Free to start" },
                { icon: Shield, label: "Verified profiles only" },
                { icon: Globe2, label: "Pan-India coverage" },
              ].map((t) => (
                <span key={t.label} className="flex items-center gap-2">
                  <t.icon className="w-4 h-4 text-blue-500" />
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
