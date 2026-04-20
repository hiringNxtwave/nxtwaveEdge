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
const CompanyProfileManager = lazy(() =>
  import("./components/company-profile-manager").then(m => ({ default: m.CompanyProfileManager }))
);

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
        <Route path="/talk-to-edge" component={Landing} />
        <Route path="/candidate-evaluation-process">{() => { window.location.replace("/explore-edge"); return null; }}</Route>

        {!isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            {!isLoading && (
              <>
                {/* Protected routes redirect to login, not landing */}
                <Route path="/browse">{() => { window.location.replace("/login"); return null; }}</Route>
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
