import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import StudentCard from "@/components/student-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useShortlist } from "@/contexts/shortlist-context";
import { Heart, Trash2, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function ShortlistedCandidates() {
  const { shortlistedIds, clearShortlist, shortlistCount } = useShortlist();

  const { data: students, isLoading } = useQuery({
    queryKey: ["/api/students/bulk", Array.from(shortlistedIds)],
    queryFn: async () => {
      if (shortlistedIds.size === 0) return [];
      
      const idsArray = Array.from(shortlistedIds);
      const promises = idsArray.map(id => 
        fetch(`/api/students/${id}`).then(res => {
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No candidates shortlisted yet
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Start browsing through our talent pool and shortlist candidates that match your requirements.
            </p>
            <Link href="/browse">
              <Button className="px-8 py-4 text-lg">
                Browse Candidates
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                Shortlisted Candidates
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {shortlistCount} candidate{shortlistCount !== 1 ? 's' : ''} ready for your review
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/shortlist/compare">
                <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-compare-candidates">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Compare & Analyze
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={clearShortlist}
                data-testid="button-clear-shortlist"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{shortlistCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Shortlisted</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {students ? Math.round(students.reduce((sum, s) => sum + (s.cgpa || 0), 0) / students.length * 10) / 10 : '0'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg CGPA</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {students ? Math.round(students.reduce((sum, s) => sum + (s.codingRating || 0), 0) / students.length * 10) / 10 : '0'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {students ? new Set(students.map(s => s.university)).size : 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Universities</div>
            </CardContent>
          </Card>
        </div>

        {/* Student Results */}
        <Card>
          <CardHeader>
            <CardTitle>Your Shortlisted Candidates</CardTitle>
            <CardDescription>
              Review and compare your selected candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">Loading shortlisted candidates...</div>
                </div>
              ) : (
                students?.map((student: any) => (
                  <StudentCard 
                    key={student.id} 
                    student={student} 
                    showFullInfo={true}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}