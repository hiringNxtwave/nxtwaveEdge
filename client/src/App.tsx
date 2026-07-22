import React, { lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { captureUtm, appendUtmToSearch } from "./lib/utm";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShortlistProvider } from "@/contexts/shortlist-context";
import { useAuth } from "@/hooks/useAuth";
import AppShell from "@/components/app-shell";

import Landing from "./pages/landing";
import LoginPage from "./pages/login";

const NotFound = lazy(() => import("./pages/not-found"));
const BrowseStudents = lazy(() => import("./pages/browse-students"));
const StudentProfile = lazy(() => import("./pages/student-profile"));
const ShortlistedCandidates = lazy(() => import("./pages/shortlisted-candidates"));
const ComparisonView = lazy(() => import("./pages/comparison-view"));
const ForColleges = lazy(() => import("./pages/for-colleges"));
const ForStudents = lazy(() => import("./pages/for-students"));
const StudentProfileForm = lazy(() => import("./pages/student-profile-form"));
const StudentDashboard = lazy(() => import("./pages/student-dashboard"));
const TalentDashboard = lazy(() => import("./pages/talent-dashboard"));
const ShortlistingPage = lazy(() => import("./pages/shortlisting"));
const MarketIntelligencePage = lazy(() => import("./pages/market-intelligence-page"));
const ExploreEdge = lazy(() => import("./pages/explore-edge"));
const AdminDashboard = lazy(() => import("./pages/admin"));
const CompanyProfileManager = lazy(() =>
  import("./components/company-profile-manager").then(m => ({ default: m.CompanyProfileManager }))
);

const BASE_URL = "https://nxtwaveedge.ccbp.tech";

// Routes whose canonical should point to the homepage (duplicate-content pages)
const CANONICAL_OVERRIDES: Record<string, string> = {
  "/talk-to-edge": "/",
};

function useCanonical() {
  const [location] = useLocation();
  useEffect(() => {
    const path = CANONICAL_OVERRIDES[location] ?? location;
    const canonical = `${BASE_URL}${path === "/" ? "" : path}`;
    let tag = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!tag) {
      tag = document.createElement("link");
      tag.rel = "canonical";
      document.head.appendChild(tag);
    }
    tag.href = canonical;
  }, [location]);
}

function useUtmPreservation() {
  const [location] = useLocation();

  // Capture on first load
  useEffect(() => {
    captureUtm();
  }, []);

  // Rehydrate on every route change — silently inject stored UTMs into the URL
  useEffect(() => {
    const currentSearch = window.location.search.slice(1);
    const enriched = appendUtmToSearch(currentSearch);
    if (enriched !== currentSearch) {
      const newUrl =
        window.location.pathname +
        (enriched ? `?${enriched}` : "") +
        window.location.hash;
      history.replaceState(null, "", newUrl);
    }
  }, [location]);
}

function Router() {
  useUtmPreservation();
  useCanonical();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Suspense fallback={null}>
      <Switch>
        {/* Always-public routes */}
        <Route path="/login" component={LoginPage} />
        <Route path="/login/profile" component={LoginPage} />
        <Route path="/for-colleges" component={ForColleges} />
        <Route path="/for-students" component={ForStudents} />
        <Route path="/explore-edge" component={ExploreEdge} />
        <Route path="/talk-to-edge">{() => <Landing showContactForm />}</Route>
        <Route path="/candidate-evaluation-process">{() => { window.location.replace("/explore-edge"); return null; }}</Route>

        {!isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            {/* Allow token-based browse without auth */}
            <Route path="/browse">{() => {
              const params = new URLSearchParams(window.location.search);
              if (params.get("token")) {
                return <BrowseStudents />;
              }
              window.location.replace("/login");
              return null;
            }}</Route>
            {!isLoading && (
              <>
                {/* Protected routes redirect to login, not landing */}
                <Route path="/candidates">{() => { window.location.replace("/login"); return null; }}</Route>
                {/* All other unknown routes fall back to landing */}
                <Route>
                  {() => {
                    window.location.replace("/");
                    return null;
                  }}
                </Route>
              </>
            )}
          </>
        ) : (
          <>
            <Route path="/" component={Landing} />
            <Route path="/browse" component={() => <AppShell><BrowseStudents /></AppShell>} />
            <Route path="/admin" component={() => <AppShell><AdminDashboard /></AppShell>} />
            <Route path="/student-dashboard" component={() => <AppShell><StudentDashboard /></AppShell>} />
            <Route path="/student/:id" component={() => <AppShell><StudentProfile /></AppShell>} />
            <Route path="/student-profile" component={() => <AppShell><StudentProfileForm /></AppShell>} />
            <Route path="/shortlist" component={() => <AppShell><ShortlistedCandidates /></AppShell>} />
            <Route path="/shortlist/compare" component={() => <AppShell><ComparisonView /></AppShell>} />
            <Route path="/talent-dashboard" component={() => <AppShell><TalentDashboard /></AppShell>} />
            <Route path="/talent" component={() => <AppShell><TalentDashboard /></AppShell>} />
            <Route path="/shortlisting" component={() => <AppShell><ShortlistingPage /></AppShell>} />
            <Route path="/market-intelligence" component={() => <AppShell><MarketIntelligencePage /></AppShell>} />
            <Route path="/jobs" component={() => (
              <AppShell>
                <div className="min-h-screen bg-[#F8FAFC]">
                  <div className="bg-white border-b border-slate-100 px-6 py-6">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Hiring</p>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Open Roles</h1>
                      </div>
                    </div>
                  </div>
                  <div className="max-w-5xl mx-auto px-6 py-6">
                    <CompanyProfileManager />
                  </div>
                </div>
              </AppShell>
            )} />
          </>
        )}
        {!isLoading && <Route component={NotFound} />}
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ShortlistProvider>
          <Router />
          <Toaster />
        </ShortlistProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
