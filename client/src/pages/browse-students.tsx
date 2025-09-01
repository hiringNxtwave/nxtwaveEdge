import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import StudentCard from "@/components/student-card";
import StudentFilters from "@/components/student-filters";
import { Skeleton } from "@/components/ui/skeleton";

export default function BrowseStudents() {
  const [filters, setFilters] = useState({
    skills: [] as string[],
    location: "",
    university: "",
    minCgpa: undefined as number | undefined,
    maxCgpa: undefined as number | undefined,
    codingRating: undefined as number | undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 48;

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

      const response = await fetch(`/api/students?${params}`);
      if (!response.ok) throw new Error("Failed to fetch students");
      return response.json();
    },
  });

  const students = studentsData?.students || studentsData || [];
  const totalCount = studentsData?.total || students.length;

  const { data: skills } = useQuery({
    queryKey: ["/api/skills"],
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-page-title">
            Browse Students
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover talented students from India's top universities
          </p>
        </div>

        {/* Filters at the top for better visibility */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Filter Candidates</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Find the perfect candidates by using the filters below</p>
          </div>
          <StudentFilters
            filters={{
              skills: filters.skills.length > 0 ? filters.skills.join(",") : "all",
              location: filters.location || "all",
              university: filters.university || "all",
              minCgpa: filters.minCgpa?.toString() || "all",
              maxCgpa: filters.maxCgpa?.toString() || "all",
              codingRating: filters.codingRating?.toString() || "all"
            }}
            onFiltersChange={(newFilters) => {
              setFilters({
                skills: newFilters.skills && newFilters.skills !== "all" ? newFilters.skills.split(",").filter(Boolean) : [],
                location: newFilters.location === "all" ? "" : newFilters.location,
                university: newFilters.university === "all" ? "" : newFilters.university,
                minCgpa: newFilters.minCgpa && newFilters.minCgpa !== "all" ? parseFloat(newFilters.minCgpa) : undefined,
                maxCgpa: newFilters.maxCgpa && newFilters.maxCgpa !== "all" ? parseFloat(newFilters.maxCgpa) : undefined,
                codingRating: newFilters.codingRating && newFilters.codingRating !== "all" ? parseInt(newFilters.codingRating) : undefined
              });
            }}
            onSearch={() => setCurrentPage(1)}
            skills={(skills as any) || []}
            resultCount={students.length}
            totalCount={totalCount}
          />
        </div>

        {/* Student Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {isLoading ? "Loading..." : `${totalCount} Students Found`}
            </h2>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border p-6">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-6 flex-1">
                      <Skeleton className="w-16 h-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-8 flex-1">
                      <div className="grid grid-cols-4 gap-6 flex-1">
                        {Array.from({ length: 4 }).map((_, j) => (
                          <div key={j} className="text-center space-y-1">
                            <Skeleton className="h-3 w-16 mx-auto" />
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center space-y-1">
                        <Skeleton className="h-3 w-12 mx-auto" />
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : students?.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700" data-testid="text-no-students">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No students found matching your criteria.
              </p>
              <p className="text-gray-400 dark:text-gray-500 mt-2">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <div className="space-y-4" data-testid="list-students">
              {students?.map((student: any) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}

          {students && students.length > 0 && (
            <div className="mt-8 flex justify-center" data-testid="pagination-controls">
              <div className="flex gap-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    data-testid="button-prev-page"
                  >
                    Previous
                  </button>
                )}
                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400" data-testid="text-page-info">
                  Page {currentPage}
                </span>
                {students.length === studentsPerPage && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    data-testid="button-next-page"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}