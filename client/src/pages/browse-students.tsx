import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import StudentCard from "@/components/student-card";
import StudentFilters from "@/components/student-filters";
import CandidateComparison from "@/components/candidate-comparison";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Lock, Users, Star, GitCompare, Shield, Briefcase, ChevronLeft, ChevronRight } from "lucide-react";

export default function BrowseStudents() {
  const { isAuthenticated, user } = useAuth();
  const displayName = user?.firstName
    ? `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim()
    : "Recruiter";

  const [filters, setFilters] = useState({
    university: "all",
    recommendation: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const studentsPerPage = isAuthenticated ? 48 : 12;

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
  });

  const students = studentsData || [];
  const totalCount = totalCountData?.count ?? students.length;
  const totalStudentCount = 327;

  const totalPages = Math.ceil(totalCount / studentsPerPage);
  const showPagination = isAuthenticated && totalPages > 1;

  return (
    <div
      className="flex flex-col bg-[#F8FAFC]"
      style={{ height: "100vh", overflow: "hidden" }}
    >
      {/* ── Sticky top: Welcome header (auth only) ── */}
      {isAuthenticated && (
        <div className="shrink-0 bg-white border-b border-slate-100 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-0.5">
                Welcome back
              </p>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight" data-testid="text-welcome">
                {displayName}
              </h1>
            </div>
            <Link href="/company-profile">
              <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <Briefcase className="w-3.5 h-3.5" />
                Post a Job
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Sticky: Filter bar ── */}
      <div className="shrink-0 bg-white border-b border-slate-100 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Left: title + count */}
          <div>
            <h2 className="text-sm font-bold text-slate-800">Talent Directory</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isLoading
                ? "Loading..."
                : `${totalCount.toLocaleString()} candidates`}
              {!filters.recommendation || filters.recommendation === "all"
                ? ""
                : ` · ${filters.recommendation}`}
            </p>
          </div>

          {/* Right: filters + compare */}
          <div className="flex items-center gap-3">
            <StudentFilters
              filters={filters}
              onFiltersChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentPage(1);
              }}
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

          {/* Results info row */}
          {!isLoading && students.length > 0 && (
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

          {/* Student Cards */}
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 p-4 flex gap-4 items-start">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-48" />
                    <div className="flex gap-2 pt-1">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-14 rounded-full" />
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <div
              className="text-center py-16 bg-white rounded-xl border border-slate-100"
              data-testid="text-no-students"
            >
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 text-base font-semibold">No candidates match your criteria</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting the university or verdict filter above.</p>
            </div>
          ) : (
            <div className="space-y-2.5" data-testid="grid-students">
              {students.map((student: any) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
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

          {/* Bottom spacer so cards don't hide behind pagination bar */}
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

              {/* Page pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 7) {
                    page = i + 1;
                  } else if (currentPage <= 4) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i;
                  } else {
                    page = currentPage - 3 + i;
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 text-xs rounded font-medium transition-colors ${
                        page === currentPage
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
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
            <span className="text-xs text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <CandidateComparison
          candidates={compareList}
          onRemove={(candidateId) => setCompareList(compareList.filter((c) => c.id !== candidateId))}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
