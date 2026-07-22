import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { sendGTMEvent } from "@/lib/gtm";
import StudentCard from "@/components/student-card";
import StudentFilters, { type FilterState } from "@/components/student-filters";
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
  DollarSign, Search as SearchIcon, Video, FileCheck, ClipboardList,
  SlidersHorizontal, RotateCcw,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function BrowseStudents() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
    : "Recruiter";

  const searchParams = new URLSearchParams(window.location.search);
  const jobIdFromUrl = searchParams.get("jobId");
  const tokenFromUrl = searchParams.get("token");
  const isTokenMode = !!tokenFromUrl;

  const [tokenData, setTokenData] = useState<{
    job: any;
    company: any;
    candidates: any[];
    expiresAt: string;
  } | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [interestedStudents, setInterestedStudents] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState<FilterState>({ university: "all", recommendation: "all", name: "", minScore: "all" });
  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showFeatureHint, setShowFeatureHint] = useState(() => {
    try { return sessionStorage.getItem("featureHintDismissed") !== "1"; } catch { return true; }
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [showJobPopup, setShowJobPopup] = useState(false);
  const [jobRole, setJobRole] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobSalary, setJobSalary] = useState("");
  const sessionKey = jobIdFromUrl ?? "inline";
  const [activeJob, setActiveJob] = useState<{ role: string; location: string; salary: string; jobTitle?: string } | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(`activeJob:${sessionKey}`) || "null"); } catch { return null; }
  });
  const [matchedStudents, setMatchedStudents] = useState<any[] | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(`jobMatch:${sessionKey}`) || "null"); } catch { return null; }
  });
  const popupShownRef = useRef(false);
  const jobIdMatchTriggeredRef = useRef<string | null>(null);

  useEffect(() => {
    if (isTokenMode && tokenFromUrl && jobIdFromUrl) {
      setTokenLoading(true);
      fetch(`/api/company/candidates?jobId=${jobIdFromUrl}&token=${tokenFromUrl}`)
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to load candidates");
          }
          return res.json();
        })
        .then((data) => {
          setTokenData(data);
          setTokenLoading(false);
        })
        .catch((err) => {
          setTokenError(err.message);
          setTokenLoading(false);
        });
    }
  }, [isTokenMode, tokenFromUrl, jobIdFromUrl]);

  const markInterestMutation = useMutation({
    mutationFn: async (studentId: string) => {
      return apiRequest("POST", "/api/company/interest", {
        token: tokenFromUrl,
        studentId,
        jobId: jobIdFromUrl,
      });
    },
    onSuccess: (_, studentId) => {
      setInterestedStudents((prev) => {
        const next = new Set(prev);
        next.add(studentId);
        return next;
      });
      toast({
        title: "Interest recorded",
        description: "The NxtWave team has been notified",
      });
    },
    onError: () => {
      toast({
        title: "Failed to record interest",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const studentsPerPage = isAuthenticated ? 24 : 12;

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
    if (matchedStudents) {
      sessionStorage.setItem(`jobMatch:${sessionKey}`, JSON.stringify(matchedStudents));
    }
  }, [matchedStudents, sessionKey]);

  useEffect(() => {
    if (activeJob) {
      sessionStorage.setItem(`activeJob:${sessionKey}`, JSON.stringify(activeJob));
    }
  }, [activeJob, sessionKey]);

  useEffect(() => {
    if (
      jobIdFromUrl &&
      isAuthenticated &&
      jobIdMatchTriggeredRef.current !== jobIdFromUrl &&
      !matchedStudents
    ) {
      jobIdMatchTriggeredRef.current = jobIdFromUrl;
      jobMatchByIdMutation.mutate(jobIdFromUrl);
    } else if (jobIdFromUrl && matchedStudents) {
      jobIdMatchTriggeredRef.current = jobIdFromUrl;
    }
  }, [jobIdFromUrl, isAuthenticated]);

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
      if (filters.name && filters.name.trim()) params.append("name", filters.name.trim());
      if (filters.minScore && filters.minScore !== "all") params.append("minScore", filters.minScore);
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
      if (filters.name && filters.name.trim()) params.append("name", filters.name.trim());
      if (filters.minScore && filters.minScore !== "all") params.append("minScore", filters.minScore);
      const response = await fetch(`/api/students/count?${params}`, { credentials: "include" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    },
    enabled: !matchedStudents,
  });

  const matchMutation = useMutation({
    mutationFn: async (data: { role: string; location: string; salary: number }) =>
      apiRequest("POST", "/api/students/job-match", data).then(r => r.json()),
    onSuccess: (data, variables) => {
      setMatchedStudents(data);
      setShowJobPopup(false);
      apiRequest("POST", "/api/company/requirements", {
        jobTitle: variables.role,
        jobLocation: variables.location,
        salaryMax: Math.round(variables.salary * 100),
      }).then(() => {
        queryClient.invalidateQueries({ queryKey: ["/api/company/requirements"] });
      }).catch(() => {});
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
    sessionStorage.removeItem(`jobMatch:${sessionKey}`);
    sessionStorage.removeItem(`activeJob:${sessionKey}`);
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

  const hasAnyFilter =
    (filters.name && filters.name.trim()) ||
    (filters.university && filters.university !== "all") ||
    (filters.recommendation && filters.recommendation !== "all") ||
    (filters.minScore && filters.minScore !== "all");

  return (
    <div className="flex h-screen overflow-hidden bg-background">

      {isTokenMode && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-r from-primary/90 to-primary px-6 py-3 border-b border-primary/20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-primary-foreground">
              <div className="flex items-center gap-2 mb-0.5">
                <Shield className="w-4 h-4 opacity-80" />
                <span className="text-2xs font-semibold uppercase tracking-widest opacity-80">NxtWave Edge</span>
              </div>
              {tokenLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/40 border-t-white"></div>
                  <span className="text-sm opacity-90">Loading candidates...</span>
                </div>
              ) : tokenError ? (
                <div>
                  <h1 className="text-lg font-bold">Link Error</h1>
                  <p className="text-xs opacity-90">{tokenError}</p>
                </div>
              ) : tokenData ? (
                <div>
                  <h1 className="text-lg font-bold">{tokenData.job?.title}</h1>
                  <p className="text-xs opacity-90">
                    {tokenData.company?.name} · {tokenData.candidates?.length || 0} candidates
                  </p>
                </div>
              ) : null}
            </div>
            {tokenData?.expiresAt && (
              <div className="text-right text-primary-foreground">
                <p className="text-2xs opacity-60">Link expires</p>
                <p className="text-xs font-semibold">
                  {new Date(tokenData.expiresAt).toLocaleDateString()} {new Date(tokenData.expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {isTokenMode && (
        <div className="h-20" />
      )}

      {isAuthenticated && showFeatureHint && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-primary/5 border-b border-primary/10 px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-1.5 text-primary text-2xs font-semibold">
                <Video className="w-3 h-3 shrink-0" />
                Interview recordings inside each profile
              </div>
              <div className="hidden sm:block w-px h-3 bg-primary/15" />
              <div className="flex items-center gap-1.5 text-primary text-2xs font-semibold">
                <ClipboardList className="w-3 h-3 shrink-0" />
                Full assessment audit trail
              </div>
              <div className="hidden sm:block w-px h-3 bg-primary/15" />
              <div className="flex items-center gap-1.5 text-primary text-2xs font-semibold">
                <FileCheck className="w-3 h-3 shrink-0" />
                Verified score reports
              </div>
            </div>
            <button
              onClick={() => {
                sendGTMEvent("browse_page_hint_dismiss_click");
                setShowFeatureHint(false);
                try { sessionStorage.setItem("featureHintDismissed", "1"); } catch {}
              }}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {!isTokenMode && showFeatureHint && (
        <div className="h-10" />
      )}

      {activeJob && matchedStudents && (
        <div className="absolute top-0 left-0 right-0 z-30 bg-primary px-6 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-primary-foreground text-sm">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span className="font-semibold">Job Match:</span>
              <span className="font-medium">{activeJob.role}</span>
              {activeJob.location && <><span className="opacity-60">·</span><span>{activeJob.location}</span></>}
              {activeJob.salary && <><span className="opacity-60">·</span><span>₹{activeJob.salary} LPA</span></>}
              <span className="opacity-70 text-xs ml-1">(top {matchedStudents.length} matches)</span>
            </div>
            <button
              onClick={() => { sendGTMEvent("browse_page_job_match_clear_click"); clearJobMatch(); }}
              className="flex items-center gap-1.5 text-primary-foreground/80 hover:text-primary-foreground text-xs font-medium transition-colors shrink-0"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          </div>
        </div>
      )}

      {activeJob && matchedStudents && (
        <div className="h-10" />
      )}

      <aside
        className={`${
          sidebarOpen ? "w-[280px]" : "w-0"
        } flex-shrink-0 border-r border-border bg-card overflow-hidden transition-all duration-200 flex flex-col ${
          isTokenMode ? "hidden lg:flex" : "hidden md:flex"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Filters</span>
          </div>
          {hasAnyFilter && (
            <button
              onClick={() => {
                setFilters({ university: "all", recommendation: "all", name: "", minScore: "all" });
                setCurrentPage(1);
              }}
              className="text-2xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <div className="space-y-2">
            <Label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Search</Label>
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search by name..."
                value={filters.name || ""}
                onChange={(e) => {
                  setFilters({ ...filters, name: e.target.value });
                  setCurrentPage(1);
                }}
                className="h-8 text-sm pl-8 pr-7 bg-muted/50 border-border focus:bg-card"
              />
              {filters.name && (
                <button
                  onClick={() => { setFilters({ ...filters, name: "" }); setCurrentPage(1); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-2">
            <Label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Verdict</Label>
            <div className="flex flex-wrap gap-1.5">
              {["all", "Strong Hire", "Hire", "Weak Hire"].map((value) => (
                <button
                  key={value}
                  onClick={() => { setFilters({ ...filters, recommendation: value }); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                    filters.recommendation === value
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {value === "all" ? "All" : value}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-2">
            <Label className="text-2xs font-medium text-muted-foreground uppercase tracking-wider">Min Score</Label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { value: "all", label: "Any" },
                { value: "60", label: "60+" },
                { value: "70", label: "70+" },
                { value: "80", label: "80+" },
                { value: "85", label: "85+" },
                { value: "90", label: "90+" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setFilters({ ...filters, minScore: opt.value }); setCurrentPage(1); }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors border ${
                    filters.minScore === opt.value
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          <StudentFilters
            filters={filters}
            onFiltersChange={(newFilters) => { setFilters(newFilters); setCurrentPage(1); }}
          />
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <div className="flex-shrink-0 border-b border-border bg-card px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:flex lg:hidden items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-muted transition-colors"
                aria-label="Toggle filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-foreground tracking-tight">
                  {isTokenMode && tokenData ? tokenData.job?.title : "Talent Directory"}
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isLoading ? "Loading..." : `${totalCount.toLocaleString()} candidates`}
                  {filters.recommendation && filters.recommendation !== "all" ? ` · ${filters.recommendation}` : ""}
                  {matchedStudents ? " · Job match" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && compareList.length > 0 && (
                <Button
                  onClick={() => { sendGTMEvent("browse_page_filter_compare_click", { count: compareList.length }); setShowComparison(true); }}
                  size="sm"
                  className="bg-primary text-primary-foreground text-xs h-8"
                  data-testid="button-compare-candidates"
                >
                  <GitCompare className="w-3.5 h-3.5 mr-1.5" />
                  Compare ({compareList.length})
                </Button>
              )}

              {isAuthenticated && !isTokenMode && (
                <Button
                  id="browse_page_header_post_job_click"
                  onClick={() => { sendGTMEvent("browse_page_header_post_job_click"); openJobDialog(); }}
                  size="sm"
                  className="bg-primary text-primary-foreground text-xs h-8"
                >
                  <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                  Post a Job
                </Button>
              )}

              {!isAuthenticated && (
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground text-xs h-8"
                  onClick={() => { sendGTMEvent("browse_page_banner_sign_in_click"); window.location.href = "/api/login"; }}
                  data-testid="button-unlock-full-access"
                >
                  Sign In Free
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {!isAuthenticated && (
              <div className="mb-4 bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      Preview Mode: {students.length} of {totalStudentCount.toLocaleString()}+ candidates shown
                    </p>
                    <p className="text-xs text-muted-foreground">Sign in to unlock full profiles, assessment details, and hiring tools.</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground text-xs shrink-0"
                  onClick={() => { sendGTMEvent("browse_page_cta_sign_in_click"); window.location.href = "/api/login"; }}
                  data-testid="button-sign-in-to-continue"
                >
                  Sign In Free
                </Button>
              </div>
            )}

            {!isLoading && students.length > 0 && !matchedStudents && (
              <div className="flex items-center gap-3 text-2xs text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-primary" />
                  All offline-verified
                </span>
                {currentPage > 1 && (
                  <>
                    <span className="h-3 w-px bg-border" />
                    <span>Page {currentPage} of {totalPages}</span>
                  </>
                )}
              </div>
            )}

            {isPendingMatch && (
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            )}

            {!isPendingMatch && (
              (isTokenMode && tokenLoading) ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-8 w-28 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : (isTokenMode && tokenError) ? (
                <div className="empty-state">
                  <div className="empty-state-icon bg-destructive/10">
                    <Lock className="w-6 h-6 text-destructive" />
                  </div>
                  <p className="empty-state-title text-destructive">Unable to load candidates</p>
                  <p className="empty-state-description">{tokenError}</p>
                </div>
              ) : isTokenMode && tokenData ? (
                <div className="space-y-3">
                  {tokenData.candidates.map((student: any) => (
                    <div key={student.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover-lift">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-sm">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">{student.firstName} {student.lastName}</h3>
                        <p className="text-xs text-muted-foreground truncate">{student.university}</p>
                        <p className="text-2xs text-muted-foreground">{student.degree} · {student.major}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {student.overallAssessmentScore && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
                            Score: {student.overallAssessmentScore}
                          </span>
                        )}
                        {student.cgpa && (
                          <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs font-medium rounded-md">
                            CGPA: {student.cgpa}
                          </span>
                        )}
                      </div>
                      <div className="shrink-0">
                        {interestedStudents.has(student.id) ? (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 text-accent rounded-lg text-xs font-medium">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Interested
                          </div>
                        ) : (
                          <button
                            onClick={() => markInterestMutation.mutate(student.id)}
                            disabled={markInterestMutation.isPending}
                            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                          >
                            {markInterestMutation.isPending ? "Recording..." : "Mark Interested"}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : isLoading && !matchedStudents ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-14 rounded" />
                        <Skeleton className="h-5 w-14 rounded" />
                      </div>
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                  ))}
                </div>
              ) : students.length === 0 ? (
                <div className="empty-state" data-testid="text-no-students">
                  <div className="empty-state-icon">
                    <Users className="w-6 h-6" />
                  </div>
                  <p className="empty-state-title">No candidates match your criteria</p>
                  <p className="empty-state-description">Try adjusting the filters on the left.</p>
                </div>
              ) : (
                <div className="space-y-3" data-testid="grid-students">
                  {students.map((student: any) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      matchScore={matchedStudents && student.matchScore !== undefined ? student.matchScore : undefined}
                    />
                  ))}
                </div>
              )
            )}

            {!isAuthenticated && students.length > 0 && (
              <div className="border border-border rounded-xl p-6 text-center mt-4 bg-card">
                <Lock className="w-7 h-7 text-primary mx-auto mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Access {totalStudentCount.toLocaleString()}+ Verified Engineers
                </h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Sign in to view full assessment reports, contact details, and hiring tools.
                </p>
                <div className="flex justify-center gap-6 mb-5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-primary" /> Full profile access</span>
                  <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-primary" /> Shortlist & compare</span>
                  <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-primary" /> Verified assessments</span>
                </div>
                <Button
                  className="bg-primary text-primary-foreground px-8"
                  onClick={() => { sendGTMEvent("browse_page_cta_sign_in_click"); window.location.href = "/api/login"; }}
                  data-testid="button-sign-in-to-continue"
                >
                  Sign In Free
                </Button>
              </div>
            )}

            {showPagination && <div className="h-4" />}
          </div>
        </div>

        {showPagination && (
          <div className="flex-shrink-0 border-t border-border bg-card px-6 py-2.5">
            <div className="flex items-center justify-between" data-testid="pagination-controls">
              <span className="text-2xs text-muted-foreground">
                {students.length > 0
                  ? `Showing ${((currentPage - 1) * studentsPerPage) + 1}–${Math.min(currentPage * studentsPerPage, totalCount)} of ${totalCount}`
                  : "No results"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { sendGTMEvent("browse_page_pagination_prev_click", { page: currentPage - 1 }); setCurrentPage(Math.max(1, currentPage - 1)); }}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2 py-1 text-2xs bg-card border border-border rounded-md text-muted-foreground hover:bg-muted font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  data-testid="button-prev-page"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Prev
                </button>
                <div className="flex items-center gap-0.5 mx-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 7) page = i + 1;
                    else if (currentPage <= 4) page = i + 1;
                    else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                    else page = currentPage - 3 + i;
                    return (
                      <button
                        key={page}
                        onClick={() => { sendGTMEvent("browse_page_pagination_page_click", { page }); setCurrentPage(page); }}
                        className={`w-6 h-6 text-2xs rounded font-medium transition-colors ${
                          page === currentPage ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                        }`}
                        data-testid={page === currentPage ? "text-page-info" : undefined}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => { sendGTMEvent("browse_page_pagination_next_click", { page: currentPage + 1 }); setCurrentPage(Math.min(totalPages, currentPage + 1)); }}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-2 py-1 text-2xs bg-card border border-border rounded-md text-muted-foreground hover:bg-muted font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  data-testid="button-next-page"
                >
                  Next
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <span className="text-2xs text-muted-foreground">Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        )}
      </div>

      {showComparison && (
        <CandidateComparison
          candidates={compareList}
          onRemove={(candidateId) => setCompareList(compareList.filter((c) => c.id !== candidateId))}
          onClose={() => setShowComparison(false)}
        />
      )}

      <Dialog open={showJobPopup} onOpenChange={setShowJobPopup}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border">
          <div className="bg-primary px-6 pt-6 pb-5">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5 text-primary-foreground" />
              </div>
              <DialogHeader>
                <DialogTitle className="text-primary-foreground text-lg font-bold leading-tight">
                  Find matching candidates
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/70 text-sm mt-0.5">
                  Tell us about the role and we'll rank the best-fit engineers from our pre-assessed talent pool.
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>

          <form onSubmit={handleJobSubmit} className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="jobRole" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <SearchIcon className="w-3.5 h-3.5 text-primary" />
                Role Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="jobRole"
                placeholder="e.g. Python Developer, Data Analyst"
                value={jobRole}
                onChange={e => setJobRole(e.target.value)}
                className="border-border focus:border-primary focus:ring-primary/20 text-sm placeholder:text-muted-foreground"
                autoFocus
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobLocation" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Location
              </Label>
              <Input
                id="jobLocation"
                placeholder="e.g. Hyderabad, Bangalore, Remote"
                value={jobLocation}
                onChange={e => setJobLocation(e.target.value)}
                className="border-border focus:border-primary focus:ring-primary/20 text-sm placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="jobSalary" className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-primary" />
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
                className="border-border focus:border-primary focus:ring-primary/20 text-sm placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={!jobRole.trim() || matchMutation.isPending}
                className="flex-1 bg-primary text-primary-foreground font-semibold text-sm"
              >
                {matchMutation.isPending ? (
                  <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />Matching…</span>
                ) : (
                  <span className="flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" />Show Matches</span>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowJobPopup(false)}
                className="px-4 border-border text-muted-foreground hover:bg-muted text-sm font-medium"
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
