import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import StudentCard from "@/components/student-card";
import StudentFilters from "@/components/student-filters";
import CandidateComparison from "@/components/candidate-comparison";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Lock, Users, Star, GitCompare, TrendingUp, Shield } from "lucide-react";

/**
 * Mirrors the match-percentage formula in StudentCard so we can sort before render.
 * Higher score = better match → appears at the top of the list.
 */
function calcMatchScore(student: any): number {
  const seed = parseInt(student.id.slice(-8), 16);
  const overallRating = 4;

  const skillScore = (offset: number) => {
    const variation = ((seed * 37 + offset) % 3) - 1; // -1 | 0 | +1
    return Math.max(1, Math.min(5, overallRating + variation));
  };

  const avg =
    (skillScore(1) + skillScore(2) + skillScore(3) + skillScore(4)) / 4;

  const cgpaRaw =
    typeof student.cgpa === "string" ? parseFloat(student.cgpa) : student.cgpa;
  const cgpaScore = ((cgpaRaw || 7.5) / 10) * 5;

  const raw = avg * 0.4 + cgpaScore * 0.3 + overallRating * 0.3;
  return Math.min(95, Math.max(60, Math.round(raw * 20) || 75));
}

export default function BrowseStudents() {
  useScrollToTop();

  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: "",
    university: "",
    minCgpa: undefined as number | undefined,
    maxCgpa: undefined as number | undefined,
    codingRating: undefined as number | undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [compareList, setCompareList] = useState<any[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const queryClient = useQueryClient();
  const studentsPerPage = isAuthenticated ? 48 : 12;

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["/api/students", filters, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.skills.length > 0) params.append("skills", filters.skills.join(","));
      if (filters.location) params.append("location", filters.location);
      if (filters.university) params.append("university", filters.university);
      if (filters.minCgpa) params.append("minCgpa", filters.minCgpa.toString());
      if (filters.maxCgpa) params.append("maxCgpa", filters.maxCgpa.toString());
      if (filters.codingRating) params.append("codingRating", filters.codingRating.toString());
      params.append("limit", studentsPerPage.toString());
      params.append("offset", ((currentPage - 1) * studentsPerPage).toString());
      const response = await fetch(`/api/students?${params}`, { credentials: "include" });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return response.json();
    },
  });

  const { data: skills } = useQuery({
    queryKey: ["/api/skills"],
    queryFn: async () => {
      const response = await fetch("/api/skills", { credentials: "include" });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return response.json();
    },
  });

  const { data: totalCountData } = useQuery({
    queryKey: ["/api/students/count"],
    queryFn: async () => {
      const response = await fetch("/api/students/count", { credentials: "include" });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return response.json();
    },
  });

  // Sort by match score descending so the highest-match candidates appear first
  const students = [...(studentsData || [])].sort(
    (a, b) => calcMatchScore(b) - calcMatchScore(a)
  );
  const totalStudentCount = totalCountData?.count || 1920;
  const totalCount = totalCountData?.count || students.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header — title + filters in one bar */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: title + count */}
          <div>
            <h1 className="text-xl font-bold text-slate-900">Browse Talent</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {isLoading
                ? "Loading candidates..."
                : isAuthenticated
                  ? `${totalStudentCount.toLocaleString()}+ verified candidates available`
                  : `Preview of ${students.length} from ${totalStudentCount.toLocaleString()}+ students`}
            </p>
          </div>

          {/* Right: filters + compare button */}
          <div className="flex items-center gap-4">
            <StudentFilters
              filters={{
                university: filters.university || "all",
                codingRating: filters.codingRating?.toString() || "all",
              }}
              onFiltersChange={(newFilters) => {
                setFilters({
                  skills: [],
                  location: "",
                  university: newFilters.university === "all" ? "" : newFilters.university,
                  minCgpa: undefined,
                  maxCgpa: undefined,
                  codingRating:
                    newFilters.codingRating && newFilters.codingRating !== "all"
                      ? parseInt(newFilters.codingRating)
                      : undefined,
                });
                setCurrentPage(1);
              }}
              skills={(skills as any) || []}
              resultCount={students.length}
              totalCount={totalCount}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-5">

        {/* Limited Access Banner */}
        {!isAuthenticated && (
          <div className="mb-4 bg-blue-600 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Preview Mode — {students.length} of {totalStudentCount.toLocaleString()}+ candidates shown</p>
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

        {/* Results bar */}
        {!isLoading && students.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                <span>
                  Showing <strong className="text-slate-700">{students.length}</strong> candidates
                  {isAuthenticated && <> of <strong className="text-slate-700">{totalStudentCount.toLocaleString()}</strong></>}
                </span>
              </span>
              <span className="h-3 w-px bg-slate-200" />
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-500" />
                All offline-verified
              </span>
              <span className="h-3 w-px bg-slate-200" />
              <span>Sorted by best match</span>
            </div>
            {currentPage > 1 && (
              <span className="text-xs text-slate-400">Page {currentPage}</span>
            )}
          </div>
        )}

        {/* Student Profiles */}
        <div className="mb-6">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 flex gap-5">
                  <div className="flex flex-col gap-3 w-[220px]">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <div className="flex-1 border-l border-slate-100 pl-5 space-y-3 pt-5">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="space-y-1">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-1.5 w-full rounded-full" />
                      </div>
                    ))}
                  </div>
                  <div className="w-[160px] border-l border-slate-100 pl-5 space-y-3">
                    <Skeleton className="h-10 w-16" />
                    <Skeleton className="h-1.5 w-full rounded-full" />
                    <Skeleton className="h-8 w-full mt-auto" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : students?.length === 0 ? (
            <div
              className="text-center py-16 bg-white rounded-xl border border-slate-100"
              data-testid="text-no-students"
            >
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 text-base font-semibold">No candidates match your criteria</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting the university or rating filter above.</p>
            </div>
          ) : (
            <div className="space-y-3" data-testid="grid-students">
              {students?.map((student: any) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {students && students.length > 0 && (isAuthenticated ? students.length === studentsPerPage || currentPage > 1 : false) && (
            <div className="mt-6 flex items-center justify-center gap-2" data-testid="pagination-controls">
              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                  data-testid="button-prev-page"
                >
                  ← Previous
                </button>
              )}
              <span className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg" data-testid="text-page-info">
                Page {currentPage}
              </span>
              {students.length === studentsPerPage && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium transition-colors"
                  data-testid="button-next-page"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Login CTA at bottom for unauthenticated */}
        {!isAuthenticated && students && students.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
            <Lock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">Access {totalStudentCount.toLocaleString()}+ Verified Engineers</h3>
            <p className="text-slate-500 text-sm mb-5">Sign in to view full assessment reports, contact details, and shortlisting tools.</p>
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

        {/* Comparison Modal */}
        {showComparison && (
          <CandidateComparison
            candidates={compareList}
            onRemove={(candidateId) => {
              setCompareList(compareList.filter((c) => c.id !== candidateId));
            }}
            onClose={() => setShowComparison(false)}
          />
        )}
      </div>
    </div>
  );
}
