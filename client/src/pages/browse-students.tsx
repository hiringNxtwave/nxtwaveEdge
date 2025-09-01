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
  });

  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 12;

  const { data: students, isLoading } = useQuery({
    queryKey: ["/api/students", filters, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.skills.length > 0) params.append("skills", filters.skills.join(","));
      if (filters.location) params.append("location", filters.location);
      if (filters.university) params.append("university", filters.university);
      if (filters.minCgpa) params.append("minCgpa", filters.minCgpa.toString());
      params.append("limit", studentsPerPage.toString());
      params.append("offset", ((currentPage - 1) * studentsPerPage).toString());

      const response = await fetch(`/api/students?${params}`);
      if (!response.ok) throw new Error("Failed to fetch students");
      return response.json();
    },
  });

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

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <StudentFilters
              filters={{
                skills: filters.skills.join(","),
                location: filters.location,
                university: filters.university,
                minCgpa: filters.minCgpa?.toString() || ""
              }}
              onFiltersChange={(newFilters) => {
                setFilters({
                  skills: newFilters.skills ? newFilters.skills.split(",").filter(Boolean) : [],
                  location: newFilters.location,
                  university: newFilters.university,
                  minCgpa: newFilters.minCgpa ? parseFloat(newFilters.minCgpa) : undefined
                });
              }}
              onSearch={() => setCurrentPage(1)}
              skills={(skills as any) || []}
            />
          </div>

          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : students?.length === 0 ? (
              <div className="text-center py-12" data-testid="text-no-students">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No students found matching your criteria.
                </p>
                <p className="text-gray-400 dark:text-gray-500 mt-2">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="grid-students">
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
    </div>
  );
}