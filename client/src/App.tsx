import React, { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShortlistProvider } from "@/contexts/shortlist-context";
import { useAuth } from "@/hooks/useAuth";
import { RecruiterOnboarding } from "@/components/recruiter-onboarding";
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
import Header from "./components/header";
import { CompanyProfileManager } from "./components/company-profile-manager";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Show onboarding for authenticated users who haven't completed it
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
            <Route path="/" component={Home} />
            <Route path="/student-dashboard" component={StudentDashboard} />
            <Route path="/browse" component={BrowseStudents} />
            <Route path="/student/:id" component={StudentProfile} />
            <Route path="/student-profile" component={StudentProfileForm} />
            <Route path="/shortlist" component={ShortlistedCandidates} />
            <Route path="/shortlist/compare" component={ComparisonView} />
            <Route path="/talent-dashboard" component={TalentDashboard} />
            <Route path="/talent" component={TalentDashboard} />
            <Route path="/shortlisting" component={ShortlistingPage} />
            <Route path="/company-profile" component={() => (
              <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-8">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Profile & Hiring Requirements</h1>
                    <p className="text-gray-600">Manage your hiring requirements and job descriptions</p>
                  </div>
                  <CompanyProfileManager />
                </div>
              </div>
            )} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>

      {/* Recruiter Onboarding Modal */}
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
