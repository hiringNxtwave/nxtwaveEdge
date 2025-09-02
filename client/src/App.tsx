import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ShortlistProvider } from "@/contexts/shortlist-context";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "./pages/not-found";
import Landing from "./pages/landing";
import Home from "./pages/home";
import BrowseStudents from "./pages/browse-students";
import StudentProfile from "./pages/student-profile";
import ShortlistedCandidates from "./pages/shortlisted-candidates";
import ComparisonView from "./pages/comparison-view";
import ForCompanies from "./pages/for-companies";
import ForColleges from "./pages/for-colleges";
import ForStudents from "./pages/for-students";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/browse" component={BrowseStudents} />
          <Route path="/for-companies" component={ForCompanies} />
          <Route path="/for-colleges" component={ForColleges} />
          <Route path="/for-students" component={ForStudents} />
        </>
      ) : (
        <>
          <Route path="/" component={BrowseStudents} />
          <Route path="/browse" component={BrowseStudents} />
          <Route path="/student/:id" component={StudentProfile} />
          <Route path="/shortlist" component={ShortlistedCandidates} />
          <Route path="/shortlist/compare" component={ComparisonView} />
          <Route path="/for-companies" component={ForCompanies} />
          <Route path="/for-colleges" component={ForColleges} />
          <Route path="/for-students" component={ForStudents} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
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
