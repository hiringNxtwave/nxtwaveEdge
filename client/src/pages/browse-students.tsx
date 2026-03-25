import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import StudentCard from "@/components/student-card";
import StudentFilters from "@/components/student-filters";
import CandidateComparison from "@/components/candidate-comparison";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Link } from "wouter";
import {
  Lock, Users, Star, GitCompare, Shield, Briefcase,
  ChevronLeft, ChevronRight, X, Sparkles, MapPin,
  DollarSign, Search as SearchIcon,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function BrowseStudents() {
  const { isAuthenticated, user } = useAuth();
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
    : "Recruiter";

  // Extract jobId from URL query params
  const searchParams = new URLSearchParams(window.location.search);
  const jobIdFromUrl = searchParams.get("jobId");

  const [filters, setFilters] = useState({ university: "all", recommendation: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  // Job popup state
  const [showJobPopup, setShowJobPopup] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const [activeJob, setActiveJob] = useState<{ role: string; location: string; salary: string; jobTitle?: string } | null>(null);
  const [matchedStudents, setMatchedStudents] = useState<any[] | null>(null);
  const popupShownRef = useRef(false);
  const jobIdMatchTriggeredRef = useRef<string | null>(null);

  const studentsPerPage = isAuthenticated ? 48 : 12;

  // Auto-trigger job match when jobId is in URL (once per jobId)
  const jobMatchByIdMutation = useMutation({
    mutationFn: async (jobId: string) =>
      apiRequest("POST", "/api/students/job-match-by-id", { jobId }).then(r => r.json()),
    onSuccess: (data) => {
      setMatchedStudents(data.students ?? data);
      setShowJobPopup(false);
      const job = data.job;
      if (job) {
        setActiveJob({
          role: job.jobTitle,
          location: job.jobLocation,
          salary: job.salaryMax ? String(Math.round(Number(job.salaryMax) / 100)) : "",
          jobTitle: job.jobTitle,
        });
      }
    },
  });

  useEffect(() => {
    if (
      jobIdFromUrl &&
      isAuthenticated &&
      jobIdMatchTriggeredRef.current !== jobIdFromUrl
    ) {
      jobIdMatchTriggeredRef.current = jobIdFromUrl;
      jobMatchByIdMutation.mutate(jobIdFromUrl);
    }
  }, [jobIdFromUrl, isAuthenticated]);

  // 15-second popup trigger — once per session, authenticated users only, skip if job context exists
  useEffect(() => {
    if (!isAuthenticated || popupShownRef.current || jobIdFromUrl) return;
    const alreadyShown = sessionStorage.getItem("jobPopupShown");
    if (alreadyShown) return;
    const timer = setTimeout(() => {
      popupShownRef.current = true;
      sessionStorage.setItem("jobPopupShown", "1");
      setShowJobPopup(true);
    }, 15000);
    return () => clearTimeout(timer);
  }, [isAuthenticated, jobIdFromUrl]);

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["/api/students", filters, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.university && filters.university !== "all") params.append("university", filters.university);
      if (filters.recommendation && filters.recommendation !== "all") params.append("recommendation", filters.recommendation);
      params.append("limit", studentsPerPage.toString());
      params.append("offset", ((currentPage - 1) * studentsPerPage).toString());
      const response = await fetch(`/api/students?${params}`, { credentials: "include" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    enabled: !matchedStudents,
  });

  const { data: totalCountData } = useQuery({
    queryKey: ["/api/students/count", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.university && filters.university !== "all") params.append("university", filters.university);
      if (filters.recommendation && filters.recommendation !== "all") params.append("recommendation", filters.recommendation);
      const response = await fetch(`/api/students/count?${params}`, { credentials: "include" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    enabled: !matchedStudents,
  });

  const matchMutation = useMutation({
    mutationFn: async (data: { role: string; location: string; salary: number }) =>
      apiRequest("POST", "/api/students/job-match", data).then(r => r.json()),
    onSuccess: (data) => {
      setMatchedStudents(data);
      setShowJobPopup(false);
    },
  });

  function handleJobSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!jobRole.trim()) return;
    setActiveJob({ role: jobRole.trim(), location: jobLocation.trim(), salary: jobSalary });
    matchMutation.mutate({
      role: jobRole.trim(),
      location: jobLocation.trim(),
      salary: parseFloat(jobSalary) || 0,
    });
  }

  function clearJobMatch() {
    setMatchedStudents(null);
    setActiveJob(null);
    setJobRole("");
    setJobLocation("");
    setJobSalary("");
    // Remove jobId from URL without reload
    if (jobIdFromUrl) {
      window.history.replaceState({}, "", "/browse");
      jobIdMatchTriggeredRef.current = null;
    }
  }

  function openJobDialog() {
    setShowJobPopup(true);
  }

  const isPendingMatch = matchMutation.isPending || jobMatchByIdMutation.isPending;
  const students = matchedStudents ?? studentsData ?? [];
  const totalCount = matchedStudents ? matchedStudents.length : (totalCountData?.count ?? students.length);
  const totalStudentCount = 327;
  const totalPages = matchedStudents ? 1 : Math.ceil(totalCount / studentsPerPage);
  const showPagination = isAuthenticated && !matchedStudents && totalPages > 1;

  return (
    <div className="flex flex-col bg-[#F8FAFC]" style={{ height: "100vh", overflow: "hidden" }}>

      {/* ── Sticky top: Welcome header (auth only) ── */}
      {isAuthenticated && (
        <div className="shrink-0 bg-white border-b border-slate-100 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">Welcome back</p>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight" data-testid="text-welcome">
                {displayName}
              </h1>
            </div>
            <button
              onClick={openJobDialog}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <Briefcase className="w-3.5 h-3.5" />
              Post a Job
            </button>
          </div>
        </div>
      )}

      {/* ── Active job match banner ── */}
      {activeJob && matchedStudents && (
        <div className="shrink-0 bg-blue-600 px-6 py-2.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-white text-sm">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span className="font-semibold">Job Match:</span>
              <span className="font-medium">{activeJob.role}</span>
              {activeJob.location && <><span className="opacity-60">·</span><span>{activeJob.location}</span></>}
              {activeJob.salary && <><span className="opacity-60">·</span><span>₹{activeJob.salary} LPA</span></>}
              <span className="opacity-70 text-xs ml-1">— showing top {matchedStudents.length} matches</span>
            </div>
            <button
              onClick={clearJobMatch}
              className="flex items-center gap-1.5 text-white/80 hover:text-white text-xs font-medium transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>
      )}

      {/* ── Sticky: Filter bar ── */}
      {!matchedStudents && (
        <div className="shrink-0 bg-white border-b border-slate-100 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Talent Directory</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isLoading ? "Loading..." : `${totalCount.toLocaleString()} candidates`}
                {filters.recommendation && filters.recommendation !== "all" ? ` · ${filters.recommendation}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StudentFilters
                filters={filters}
                onFiltersChange={(newFilters) => { setFilters(newFilters); setCurrentPage(1); }}
              />
              {isAuthenticated && compareList.length > 0 && (
                <>
                  <div className="h-5 w-px bg-slate-200" />
                  <Button
                    onClick={() => setShowComparison(true)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    data-testid="button-compare-candidates"
                  >
                    <GitCompare className="w-3.5 h-3.5 mr-1.5" />
                    Compare ({compareList.length})
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Scrollable student list ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">

          {/* Limited Access Banner */}
          {!isAuthenticated && (
            <div className="mb-4 bg-blue-600 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    Preview Mode — {students.length} of {totalStudentCount.toLocaleString()}+ candidates shown
                  </p>
                  <p className="text-xs text-blue-200">Sign in to unlock full profiles, assessment details, and hiring tools.</p>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm shrink-0 border-0"
                onClick={() => (window.location.href = "/api/login")}
                data-testid="button-unlock-full-access"
              >
                Sign In Free →
              </Button>
            </div>
          )}

          {/* Results info */}
          {!isLoading && students.length > 0 && !matchedStudents && (
            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                All offline-verified
              </span>
              {currentPage > 1 && (
                <>
                  <span className="h-3 w-px bg-slate-200" />
                  <span>Page {currentPage} of {totalPages}</span>
                </>
              )}
            </div>
          )}

          {/* Match loading state */}
          {isPendingMatch && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                    <Skeleton className="h-5 w-20 rounded-full shrink-0" />
                  </div>
                  <Skeleton className="h-4 w-24 rounded-full" />
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <Skeleton className="h-7 w-12" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Student Cards */}
          {!isPendingMatch && (
            isLoading && !matchedStudents ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-11 h-11 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                      <Skeleton className="h-5 w-20 rounded-full shrink-0" />
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <Skeleton className="h-5 w-16 rounded" />
                      <Skeleton className="h-5 w-14 rounded" />
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <Skeleton className="h-7 w-12" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-100" data-testid="text-no-students">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 text-base font-semibold">No candidates match your criteria</p>
                <p className="text-slate-400 text-sm mt-1">Try adjusting the filters above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4" data-testid="grid-students">
                {students.map((student: any) => (
                  <div key={student.id} className="relative">
                    {matchedStudents && student.matchScore !== undefined && (
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" />
                        {student.matchScore}% match
                      </div>
                    )}
                    <StudentCard student={student} />
                  </div>
                ))}
              </div>
            )
          )}

          {/* Login CTA at bottom for unauthenticated */}
          {!isAuthenticated && students.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-center mt-4">
              <Lock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Access {totalStudentCount.toLocaleString()}+ Verified Engineers
              </h3>
              <p className="text-slate-500 text-sm mb-5">
                Sign in to view full assessment reports, contact details, and hiring tools.
              </p>
              <div className="flex justify-center gap-6 mb-5 text-sm text-slate-600">
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Full profile access</span>
                <span className="flex items-center gap-2"><Star className="w-4 h-4 text-blue-500" /> Shortlist & compare</span>
                <span className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-500" /> Verified assessments</span>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                onClick={() => (window.location.href = "/api/login")}
                data-testid="button-sign-in-to-continue"
              >
                Sign In Free →
              </Button>
            </div>
          )}

          {showPagination && <div className="h-4" />}
        </div>
      </div>

      {/* ── Sticky bottom: Pagination ── */}
      {showPagination && (
        <div className="shrink-0 bg-white border-t border-slate-100 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between" data-testid="pagination-controls">
            <span className="text-xs text-slate-500">
              {students.length > 0
                ? `Showing ${((currentPage - 1) * studentsPerPage) + 1}–${Math.min(currentPage * studentsPerPage, totalCount)} of ${totalCount}`
                : "No results"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="button-prev-page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) page = i + 1;
                  else if (currentPage <= 4) page = i + 1;
                  else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                  else page = currentPage - 3 + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 text-xs rounded font-medium transition-colors ${
                        page === currentPage ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                      }`}
                      data-testid={page === currentPage ? "text-page-info" : undefined}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                data-testid="button-next-page"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-xs text-slate-400">Page {currentPage} of {totalPages}</span>
          </div>
        </div>
      )}

      {/* ── Comparison Modal ── */}
      {showComparison && (
        <CandidateComparison
          candidates={compareList}
          onRemove={(candidateId) => setCompareList(compareList.filter((c) => c.id !== candidateId))}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* ── Job Posting Popup ── */}
      <Dialog open={showJobPopup} onOpenChange={setShowJobPopup}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 pt-6 pb-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-white text-lg font-bold leading-tight">
                  Find matching candidates
                </DialogTitle>
                <DialogDescription className="text-blue-100 text-sm mt-0.5">
                  Tell us about the role and we'll rank the best-fit engineers from 327 assessed candidates.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleJobSubmit} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="jobRole" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <SearchIcon className="w-3.5 h-3.5 text-blue-500" />
                Role Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobRole"
                placeholder="e.g. Python Developer, Data Analyst"
                value={jobRole}
                onChange={e => setJobRole(e.target.value)}
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-sm"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobLocation" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                Location
              </Label>
              <Input
                id="jobLocation"
                placeholder="e.g. Hyderabad, Bangalore, Remote"
                value={jobLocation}
                onChange={e => setJobLocation(e.target.value)}
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobSalary" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-blue-500" />
                Salary Budget (LPA)
              </Label>
              <Input
                id="jobSalary"
                type="number"
                min="1"
                max="50"
                placeholder="e.g. 8"
                value={jobSalary}
                onChange={e => setJobSalary(e.target.value)}
                className="border-slate-200 focus:border-blue-400 focus:ring-blue-400/20 text-sm"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={!jobRole.trim() || matchMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
              >
                {matchMutation.isPending ? (
                  <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Matching…</span>
                ) : (
                  <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" />Show Matches</span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowJobPopup(false)}
                className="px-4 border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium"
              >
                Not now
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
