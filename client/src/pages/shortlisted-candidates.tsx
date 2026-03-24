import { useQuery } from "@tanstack/react-query";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import StudentCard from "@/components/student-card";
import { Button } from "@/components/ui/button";
import { useShortlist } from "@/contexts/shortlist-context";
import { Heart, Trash2, BarChart3, Users, GraduationCap, Star, Building2, Search } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function ShortlistedCandidates() {
  useScrollToTop();

  const { shortlistedIds, clearShortlist, shortlistCount } = useShortlist();

  const { data: students, isLoading } = useQuery({
    queryKey: ["/api/students/bulk", Array.from(shortlistedIds)],
    queryFn: async () => {
      if (shortlistedIds.size === 0) return [];
      const idsArray = Array.from(shortlistedIds);
      const promises = idsArray.map((id) =>
        fetch(`/api/students/${id}`).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch student");
          return res.json();
        })
      );
      return Promise.all(promises);
    },
    enabled: shortlistedIds.size > 0,
  });

  if (shortlistCount === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <div className="bg-white border-b border-slate-100 px-6 py-5">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-xl font-bold text-slate-900">Shortlisted Candidates</h1>
            <p className="text-sm text-slate-500 mt-0.5">Review and manage your saved candidates</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Heart className="w-7 h-7 text-rose-300" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">No candidates shortlisted yet</h2>
          <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
            Start browsing talent and save candidates that match your requirements.
          </p>
          <Link href="/browse">
            <Button className="bg-slate-900 hover:bg-slate-800 text-white">
              <Search className="w-4 h-4 mr-2" />
              Browse Candidates
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const avgCGPA =
    students && students.length > 0
      ? (students.reduce((sum: number, s: any) => sum + (parseFloat(s.cgpa) || 7.5), 0) / students.length).toFixed(1)
      : "8.2";
  const avgRating =
    students && students.length > 0
      ? (students.reduce((sum: number, s: any) => sum + (s.codingRating || 4), 0) / students.length).toFixed(1)
      : "4.2";
  const univCount = students ? new Set(students.map((s: any) => s.university)).size : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Shortlisted Candidates</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {shortlistCount} candidate{shortlistCount !== 1 ? "s" : ""} saved for review
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-200 text-slate-600 hover:bg-slate-50 text-sm"
              onClick={clearShortlist}
              data-testid="button-clear-shortlist"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Clear All
            </Button>
            <Link href="/shortlist/compare">
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm"
                data-testid="button-compare-candidates"
              >
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                Compare & Analyze
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, color: "text-blue-600", bg: "bg-blue-50", value: shortlistCount, label: "Total Shortlisted" },
            { icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50", value: avgCGPA, label: "Avg CGPA" },
            { icon: Star, color: "text-violet-600", bg: "bg-violet-50", value: avgRating, label: "Avg Rating" },
            { icon: Building2, color: "text-amber-600", bg: "bg-amber-50", value: univCount, label: "Universities" },
          ].map((m) => (
            <div key={m.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-9 h-9 ${m.bg} rounded-xl flex items-center justify-center shrink-0`}>
                <m.icon className={`w-4 h-4 ${m.color}`} />
              </div>
              <div>
                <div className={`text-xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-slate-500">{m.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Candidate List */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">Your Candidates</h2>
          </div>
          <div className="p-5">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {students?.map((student: any) => (
                  <StudentCard key={student.id} student={student} showFullInfo={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
