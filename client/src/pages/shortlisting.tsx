import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ShortlistingDashboard from "@/components/shortlisting-dashboard";
import CodeReplayModal from "@/components/code-replay-modal";
import CommunicationSampleModal from "@/components/communication-sample-modal";
import ATSIntegration from "@/components/ats-integration";
import SidePanelLayout from "@/components/side-panel-layout";
import TalentBaskets from "@/components/talent-baskets";
import ZeptoCandidateCard from "@/components/zepto-candidate-card";
import AnalyticsDashboard from "@/components/analytics-dashboard";
import CandidateFullReport from "@/components/candidate-360-view";
import { useShortlist } from "@/contexts/shortlist-context";
import {
  ArrowLeft,
  Settings,
  Search,
  LayoutGrid,
  CreditCard,
  CheckSquare,
  BarChart3,
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";
import { Link } from "wouter";

export default function ShortlistingPage() {
  const { shortlistedIds, removeFromShortlist, addToShortlist } = useShortlist();
  const [selectedStudent, setSelectedStudent] = useState<StudentWithSkills | null>(null);
  const [showCodeReplay, setShowCodeReplay] = useState(false);
  const [showCommunicationSample, setShowCommunicationSample] = useState(false);
  const [showATSIntegration, setShowATSIntegration] = useState(false);
  const [selectedCandidatesForATS, setSelectedCandidatesForATS] = useState<StudentWithSkills[]>([]);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [selectedBasket, setSelectedBasket] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("baskets");

  const { data: students = [], isLoading } = useQuery<StudentWithSkills[]>({
    queryKey: ["/api/students"],
  });

  const handleBulkAction = (action: "shortlist" | "remove", studentIds: string[]) => {
    if (action === "shortlist") {
      console.log("Moving to next round:", studentIds);
      alert(`${studentIds.length} candidates moved to next round!`);
    } else {
      studentIds.forEach((id) => removeFromShortlist(id));
    }
  };

  const openCodeReplay = (student: StudentWithSkills) => {
    setSelectedStudent(student);
    setShowCodeReplay(true);
  };

  const openCommunicationSample = (student: StudentWithSkills) => {
    setSelectedStudent(student);
    setShowCommunicationSample(true);
  };

  const openSidePanel = (student: StudentWithSkills) => {
    setSelectedStudent(student);
    setShowSidePanel(true);
  };

  const closeSidePanel = () => {
    setShowSidePanel(false);
    setSelectedStudent(null);
  };

  const generatePredictiveScore = (student: StudentWithSkills, type: string) => {
    const seed = parseInt(student.id.slice(-8), 16);
    const baseScore = student.overallAssessmentScore ? Math.round(student.overallAssessmentScore / 20) : 4;

    switch (type) {
      case "jd-match":
        return Math.min(95, Math.max(75, baseScore * 18 + ((seed % 10) - 5)));
      case "lookalike":
        return Math.min(90, Math.max(65, baseScore * 17 + ((seed * 7) % 10) - 3));
      case "offer-join":
        return Math.min(85, Math.max(60, baseScore * 16 + ((seed * 11) % 10) - 4));
      case "hire-join":
        return Math.min(88, Math.max(65, baseScore * 17 + ((seed * 17) % 10) - 3));
      case "ramp-risk":
        return Math.min(25, Math.max(5, 30 - baseScore * 4 + ((seed * 13) % 8) - 4));
      default:
        return 75;
    }
  };

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading candidates...</span>
        </div>
      </div>
    );
  }

  const shortlistedStudents = students.filter((student) => shortlistedIds.has(student.id));
  const avgJdMatch =
    shortlistedStudents.length > 0
      ? Math.round(
          shortlistedStudents.reduce((acc, s) => acc + generatePredictiveScore(s, "jd-match"), 0) /
            shortlistedStudents.length
        )
      : 0;

  const tabs = [
    { id: "baskets", label: "Baskets", icon: LayoutGrid },
    { id: "candidates", label: "Candidates", icon: CreditCard },
    { id: "validation", label: "Validation", icon: CheckSquare },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="flex flex-col h-screen">
      <header className="border-b border-border bg-card flex-shrink-0">
        <div className="page-container py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/talent">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" data-testid="button-back-to-talent">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Talent Discovery
                </Button>
              </Link>
              <div className="hidden sm:block h-5 w-px bg-border" />
              <div className="hidden sm:block">
                <h1 className="text-base font-semibold tracking-tight">Shortlisting</h1>
                <p className="text-xs text-muted-foreground">
                  {shortlistedIds.size} shortlisted · {avgJdMatch}% avg match
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-2xs hidden sm:inline-flex">
                {shortlistedIds.size} Shortlisted
              </Badge>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => {
                  setSelectedCandidatesForATS(shortlistedStudents);
                  setShowATSIntegration(true);
                }}
                data-testid="button-ats-integration-header"
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ATS</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card px-4">
          <div className="page-container py-0">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {activeTab === "baskets" && (
            <div className="page-container py-4">
              <TalentBaskets
                onSelectBasket={(basket) => {
                  setSelectedBasket(basket);
                  setActiveTab("candidates");
                }}
              />
            </div>
          )}

          {activeTab === "candidates" && (
            <div className="page-container py-4">
              {selectedBasket && (
                <div className="mb-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold">{selectedBasket.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {selectedBasket.candidateCount} candidates · {selectedBasket.avgJdMatch}% avg match
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedBasket(null)}>
                      View All
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {(selectedBasket ? students.slice(0, selectedBasket.candidateCount) : students).map(
                  (student) => (
                    <ZeptoCandidateCard
                      key={student.id}
                      student={student}
                      jdMatch={generatePredictiveScore(student, "jd-match")}
                      ojrProbability={generatePredictiveScore(student, "offer-join")}
                      salaryFit={Math.min(95, Math.max(60, 80 + (parseInt(student.id.slice(-2), 16) % 30) - 15))}
                      locationFit={Math.min(98, Math.max(70, 85 + (parseInt(student.id.slice(-3, -1), 16) % 25) - 12))}
                      onViewProfile={() => {
                        setSelectedStudent(student);
                        setShowFullReport(true);
                      }}
                      onShortlist={() => {
                        if (shortlistedIds.has(student.id)) {
                          removeFromShortlist(student.id);
                        } else {
                          addToShortlist(student.id);
                        }
                      }}
                      isShortlisted={shortlistedIds.has(student.id)}
                    />
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === "validation" && (
            <div className="page-container py-4">
              <SidePanelLayout
                shortlistedStudents={shortlistedStudents}
                selectedStudent={selectedStudent}
                showSidePanel={showSidePanel}
                onSelectStudent={openSidePanel}
                onCloseSidePanel={closeSidePanel}
                onRemoveFromShortlist={removeFromShortlist}
                onOpenCodeReplay={() => setShowCodeReplay(true)}
                onOpenCommunicationSample={() => setShowCommunicationSample(true)}
                generatePredictiveScore={generatePredictiveScore}
              />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="page-container py-4">
              <AnalyticsDashboard />
            </div>
          )}
        </div>
      </div>

      {selectedStudent && (
        <CandidateFullReport
          student={selectedStudent}
          isOpen={showFullReport}
          onClose={() => {
            setShowFullReport(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {selectedStudent && showCodeReplay && (
        <CodeReplayModal
          student={selectedStudent}
          isOpen={showCodeReplay}
          onClose={() => {
            setShowCodeReplay(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {selectedStudent && showCommunicationSample && (
        <CommunicationSampleModal
          student={selectedStudent}
          isOpen={showCommunicationSample}
          onClose={() => {
            setShowCommunicationSample(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {showATSIntegration && (
        <ATSIntegration
          isOpen={showATSIntegration}
          onClose={() => setShowATSIntegration(false)}
          selectedCandidates={selectedCandidatesForATS}
        />
      )}
    </div>
  );
}
