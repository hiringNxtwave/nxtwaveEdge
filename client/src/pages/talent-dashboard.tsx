import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import AdvancedStudentsTable from "@/components/advanced-students-table";
import InterviewScheduler from "@/components/interview-scheduler";
import CodeSubmissionViewer from "@/components/code-submission-viewer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Trophy,
  Shield,
  Zap,
  Search,
  Filter,
  CheckCircle,
  ArrowRight,
  X,
} from "lucide-react";
import { Link } from "wouter";
import { useShortlist } from "@/contexts/shortlist-context";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function TalentDashboard() {
  useScrollToTop();

  const { user, isAuthenticated } = useAuth();
  const { shortlistedIds } = useShortlist();
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; name: string } | null>(null);
  const [activeModal, setActiveModal] = useState<"interview" | "code" | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    salaryRange: { min: 0, max: 50 },
    locations: [] as string[],
    graduationYears: [] as number[],
    softTraits: [] as string[],
    assessmentAge: 90,
    skills: [] as string[],
    universities: [] as string[],
  });

  const stats = [
    {
      title: "Total Talent",
      value: "12,456",
      change: "+8.2%",
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Avg Score",
      value: "847",
      change: "+12.5%",
      icon: Trophy,
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "ID Verified",
      value: "11,234",
      change: "+5.7%",
      icon: Shield,
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Available Now",
      value: "8,923",
      change: "+3.1%",
      icon: Zap,
      color: "text-violet-600 dark:text-violet-400",
    },
  ];

  const quickFilters = [
    { label: "DSA Champions (95+)", filter: "dsa_95", count: "892" },
    { label: "Full Stack Experts", filter: "fullstack", count: "1,234" },
    { label: "IIT/NIT Graduates", filter: "premium", count: "3,456" },
    { label: "Fresh Graduates 2024", filter: "fresh_2024", count: "4,567" },
  ];

  if (!isAuthenticated) {
    return (
      <div className="page-container">
        <div className="max-w-md mx-auto">
          <div className="surface-card p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h2 className="page-title mb-2">Access Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to access the advanced talent dashboard.
            </p>
            <Button onClick={() => (window.location.href = "/api/login")} className="w-full">
              Login to Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title" data-testid="text-dashboard-title">
          Talent Dashboard
        </h1>
        <p className="page-subtitle">
          Comprehensive student analytics with DSA rankings, code verification, and interview scheduling
        </p>
      </div>

      <div className="card-grid-4 section-gap">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
              </div>
              <Badge variant="outline" className="text-green-600 dark:text-green-400 text-2xs font-medium">
                {stat.change}
              </Badge>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="surface-card section-gap">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="section-title">Quick Filters</h3>
            <div className="flex items-center gap-2">
              <Link href="/shortlisting">
                <Button
                  size="sm"
                  className="gap-1.5"
                  data-testid="button-go-to-shortlisting"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Shortlisting
                  {shortlistedIds.size > 0 && (
                    <Badge variant="secondary" className="ml-1 text-2xs bg-primary/10 text-primary border-0">
                      {shortlistedIds.size}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAdvancedFilters(true)}
                className="gap-1.5"
                data-testid="button-open-advanced-filters"
              >
                <Filter className="w-3.5 h-3.5" />
                Advanced
                {Object.values(filters).some((f) =>
                  Array.isArray(f) ? f.length > 0 : typeof f === "object" ? f.min > 0 || f.max < 50 : f !== 90
                ) && (
                  <Badge variant="secondary" className="ml-1 text-2xs bg-primary/10 text-primary border-0">
                    Active
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickFilters.map((filter, index) => (
              <button
                key={index}
                className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                data-testid={`filter-${filter.filter}`}
              >
                <div>
                  <div className="text-sm font-medium">{filter.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{filter.count} students</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>

          {Object.values(filters).some((f) =>
            Array.isArray(f) ? f.length > 0 : typeof f === "object" ? f.min > 0 || f.max < 50 : f !== 90
          ) && (
            <div className="flex flex-wrap items-center gap-2 mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <span className="text-xs font-medium text-primary">Active:</span>
              {filters.salaryRange.min > 0 || filters.salaryRange.max < 50 ? (
                <Badge variant="secondary" className="text-2xs bg-primary/10 text-primary border-0">
                  Salary: ₹{filters.salaryRange.min}-{filters.salaryRange.max} LPA
                </Badge>
              ) : null}
              {filters.locations.map((location) => (
                <Badge key={location} variant="secondary" className="text-2xs bg-primary/10 text-primary border-0">
                  {location}
                </Badge>
              ))}
              {filters.graduationYears.map((year) => (
                <Badge key={year} variant="secondary" className="text-2xs bg-primary/10 text-primary border-0">
                  Class of {year}
                </Badge>
              ))}
              {filters.softTraits.slice(0, 3).map((trait) => (
                <Badge key={trait} variant="secondary" className="text-2xs bg-primary/10 text-primary border-0">
                  {trait}
                </Badge>
              ))}
              {filters.softTraits.length > 3 && (
                <Badge variant="secondary" className="text-2xs bg-primary/10 text-primary border-0">
                  +{filters.softTraits.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <AdvancedStudentsTable
        limit={100}
        onInterviewSchedule={(studentId, studentName) => {
          setSelectedStudent({ id: studentId, name: studentName });
          setActiveModal("interview");
        }}
        onCodeView={(studentId, studentName) => {
          setSelectedStudent({ id: studentId, name: studentName });
          setActiveModal("code");
        }}
        onMessage={(studentId, studentName) => {
          console.log(`Message ${studentName} (${studentId})`);
        }}
        onSelectForFinalConsideration={(studentId, studentName) => {
          console.log(`Selected ${studentName} for final consideration`);
        }}
      />

      {selectedStudent && activeModal === "interview" && (
        <Dialog
          open={true}
          onOpenChange={() => {
            setActiveModal(null);
            setSelectedStudent(null);
          }}
        >
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

      {selectedStudent && activeModal === "code" && (
        <Dialog
          open={true}
          onOpenChange={() => {
            setActiveModal(null);
            setSelectedStudent(null);
          }}
        >
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

      {showAdvancedFilters && (
        <Dialog open={true} onOpenChange={() => setShowAdvancedFilters(false)}>
          <DialogContent className="max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="page-title text-lg">Advanced Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowAdvancedFilters(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-muted-foreground text-sm mb-4">
              Filters functionality will be available soon.
            </p>
            <Button size="sm" onClick={() => setShowAdvancedFilters(false)}>
              Close
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
