import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import Header from "@/components/header";
import AdvancedStudentsTable from "@/components/advanced-students-table";
import InterviewScheduler from "@/components/interview-scheduler";
import CodeSubmissionViewer from "@/components/code-submission-viewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Users, 
  Code, 
  Calendar, 
  Target, 
  Star,
  TrendingUp,
  Award,
  Shield,
  Zap
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function TalentDashboard() {
  useScrollToTop();
  
  const { user, isAuthenticated } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState<{id: string, name: string} | null>(null);
  const [activeModal, setActiveModal] = useState<'interview' | 'code' | null>(null);

  // Mock stats for the dashboard
  const stats = [
    {
      title: "Total Students",
      value: "12,456",
      change: "+8.2%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "DSA Toppers (90+)",
      value: "2,341",
      change: "+12.5%", 
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "ID Verified",
      value: "11,234",
      change: "+5.7%",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Available Now",
      value: "8,923",
      change: "+3.1%",
      icon: Zap,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const quickFilters = [
    { label: "DSA Champions (95+)", filter: "dsa_95", count: "892" },
    { label: "Full Stack Experts", filter: "fullstack", count: "1,234" },
    { label: "IIT/NIT Graduates", filter: "premium", count: "3,456" },
    { label: "Fresh Graduates 2024", filter: "fresh_2024", count: "4,567" }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Access Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Please log in to access the advanced talent dashboard.
              </p>
              <Button onClick={() => window.location.href = "/api/login"} className="w-full">
                Login to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="text-dashboard-title">
            Advanced Talent Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Comprehensive student analytics with DSA rankings, code verification, and seamless interview scheduling
          </p>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow h-36 flex flex-col">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <Badge variant="outline" className="text-green-600 text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="flex-grow flex flex-col justify-end">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                Quick Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickFilters.map((filter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-between h-16 p-4 flex items-center"
                    data-testid={`filter-${filter.filter}`}
                  >
                    <div className="text-left flex-grow">
                      <div className="font-medium text-sm">{filter.label}</div>
                      <div className="text-xs text-gray-500">{filter.count} students</div>
                    </div>
                    <Star className="w-4 h-4 text-yellow-500 flex-shrink-0 ml-2" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Students Table */}
        <AdvancedStudentsTable 
          limit={100}
          onInterviewSchedule={(studentId, studentName) => {
            setSelectedStudent({ id: studentId, name: studentName });
            setActiveModal('interview');
          }}
          onCodeView={(studentId, studentName) => {
            setSelectedStudent({ id: studentId, name: studentName });
            setActiveModal('code');
          }}
          onMessage={(studentId, studentName) => {
            // For now, just show a placeholder action
            console.log(`Message ${studentName} (${studentId})`);
          }}
          onSelectForFinalConsideration={(studentId, studentName) => {
            // Show success message and potentially add to shortlist
            console.log(`Selected ${studentName} for final consideration`);
            // This could trigger adding to shortlist or sending to HR team
          }}
        />

        {/* Modals */}
        {selectedStudent && activeModal === 'interview' && (
          <Dialog open={true} onOpenChange={() => {
            setActiveModal(null);
            setSelectedStudent(null);
          }}>
            <DialogContent className="max-w-lg">
              <InterviewScheduler
                studentId={selectedStudent.id}
                studentName={selectedStudent.name}
                onScheduled={() => {
                  setActiveModal(null);
                  setSelectedStudent(null);
                }}
                onClose={() => {
                  setActiveModal(null);
                  setSelectedStudent(null);
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {selectedStudent && activeModal === 'code' && (
          <Dialog open={true} onOpenChange={() => {
            setActiveModal(null);
            setSelectedStudent(null);
          }}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
              <CodeSubmissionViewer
                studentId={selectedStudent.id}
                studentName={selectedStudent.name}
                onClose={() => {
                  setActiveModal(null);
                  setSelectedStudent(null);
                }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}