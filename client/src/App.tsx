import React, { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShortlistProvider } from "@/contexts/shortlist-context";
import { useAuth } from "@/hooks/useAuth";
import { RecruiterOnboarding } from "@/components/recruiter-onboarding";
import AppShell from "@/components/app-shell";
import NotFound from "./pages/not-found";
import Landing from "./pages/landing";
import Home from "./pages/home";
import BrowseStudents from "./pages/browse-students";
import StudentProfile from "./pages/student-profile";
import ShortlistedCandidates from "./pages/shortlisted-candidates";
import ComparisonView from "./pages/comparison-view";
import ForColleges from "./pages/for-colleges";
import ForStudents from "./pages/for-students";
import StudentProfileForm from "./pages/student-profile-form";
import StudentDashboard from "./pages/student-dashboard";
import TalentDashboard from "./pages/talent-dashboard";
import ShortlistingPage from "./pages/shortlisting";
import { CompanyProfileManager } from "./components/company-profile-manager";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated && user && !user.onboardingCompleted) {
      setShowOnboarding(true);
    } else {
      setShowOnboarding(false);
    }
  }, [isAuthenticated, user]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  return (
    <>
      <Switch>
        {isLoading || !isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/for-companies">
              {() => {
                window.location.href = "/";
                return null;
              }}
            </Route>
            <Route path="/for-colleges" component={ForColleges} />
            <Route path="/for-students" component={ForStudents} />
          </>
        ) : (
          <>
            <Route path="/" component={() => <AppShell><Home /></AppShell>} />
            <Route path="/student-dashboard" component={() => <AppShell><StudentDashboard /></AppShell>} />
            <Route path="/browse" component={() => <AppShell><BrowseStudents /></AppShell>} />
            <Route path="/student/:id" component={() => <AppShell><StudentProfile /></AppShell>} />
            <Route path="/student-profile" component={() => <AppShell><StudentProfileForm /></AppShell>} />
            <Route path="/shortlist" component={() => <AppShell><ShortlistedCandidates /></AppShell>} />
            <Route path="/shortlist/compare" component={() => <AppShell><ComparisonView /></AppShell>} />
            <Route path="/talent-dashboard" component={() => <AppShell><TalentDashboard /></AppShell>} />
            <Route path="/talent" component={() => <AppShell><TalentDashboard /></AppShell>} />
            <Route path="/shortlisting" component={() => <AppShell><ShortlistingPage /></AppShell>} />
            <Route path="/company-profile" component={() => (
              <AppShell>
                <div className="min-h-screen bg-[#F8FAFC]">
                  {/* Page header */}
                  <div className="bg-white border-b border-slate-100 px-6 py-4">
                    <div className="max-w-5xl mx-auto">
                      <h1 className="text-xl font-bold text-slate-900">Job Requirements</h1>
                      <p className="text-slate-500 text-sm mt-0.5">
                        Add and manage open roles. Our team will match pre-assessed candidates to each requirement.
                      </p>
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
        <Route component={NotFound} />
      </Switch>

      <RecruiterOnboarding
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        userEmail={user?.email || undefined}
        userName={user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user?.email || undefined}
      />
    </>
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
