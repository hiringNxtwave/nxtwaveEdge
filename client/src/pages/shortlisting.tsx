import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Users, 
  CheckCircle, 
  TrendingUp, 
  Target, 
  Play, 
  MessageSquare,
  Brain,
  Zap,
  ArrowLeft,
  Settings,
  Download
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

  // Fetch students data
  const { data: students = [], isLoading } = useQuery<StudentWithSkills[]>({
    queryKey: ['/api/students']
  });

  const handleBulkAction = (action: 'shortlist' | 'remove', studentIds: string[]) => {
    if (action === 'shortlist') {
      // This would typically move candidates to next round
      console.log('Moving to next round:', studentIds);
      // For demo, we'll just show a success message
      alert(`${studentIds.length} candidates moved to next round!`);
    } else {
      studentIds.forEach(id => removeFromShortlist(id));
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
    const baseScore = student.codingRating || 4;
    
    switch (type) {
      case 'jd-match':
        return Math.min(95, Math.max(75, baseScore * 18 + ((seed % 10) - 5)));
      case 'lookalike':
        return Math.min(90, Math.max(65, baseScore * 17 + ((seed * 7) % 10) - 3));
      case 'offer-join':
        return Math.min(85, Math.max(60, baseScore * 16 + ((seed * 11) % 10) - 4));
      case 'hire-join':
        return Math.min(88, Math.max(65, baseScore * 17 + ((seed * 17) % 10) - 3));
      case 'ramp-risk':
        return Math.min(25, Math.max(5, 30 - (baseScore * 4) + ((seed * 13) % 8) - 4));
      default:
        return 75;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const shortlistedStudents = students.filter(student => shortlistedIds.has(student.id));
  const highPotentialCount = shortlistedStudents.filter(s => generatePredictiveScore(s, 'jd-match') > 85).length;
  const avgJdMatch = shortlistedStudents.length > 0 
    ? Math.round(shortlistedStudents.reduce((acc, s) => acc + generatePredictiveScore(s, 'jd-match'), 0) / shortlistedStudents.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/talent">
                <Button variant="ghost" size="sm" data-testid="button-back-to-talent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Talent Discovery
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NxtWave Talent Platform</h1>
                <p className="text-sm text-gray-600">Auto-curated talent baskets and evidence-based hiring</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {shortlistedIds.size} Shortlisted
              </Badge>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                Avg Match: {avgJdMatch}%
              </Badge>
              <Button 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  setSelectedCandidatesForATS(shortlistedStudents);
                  setShowATSIntegration(true);
                }}
                data-testid="button-ats-integration-header"
              >
                <Settings className="w-4 h-4 mr-2" />
                ATS Integration
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="bg-white border-b px-6 py-3">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="baskets">Talent Baskets</TabsTrigger>
              <TabsTrigger value="candidates">Candidate Cards</TabsTrigger>
              <TabsTrigger value="validation">Validation</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-auto">
            <TabsContent value="baskets" className="p-6 h-full">
              <TalentBaskets 
                onSelectBasket={(basket) => {
                  setSelectedBasket(basket);
                  setActiveTab("candidates");
                }}
              />
            </TabsContent>

            <TabsContent value="candidates" className="p-6 h-full">
              <div className="space-y-6">
                {selectedBasket && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-blue-900">{selectedBasket.title}</h2>
                        <p className="text-blue-700">{selectedBasket.candidateCount} candidates • {selectedBasket.avgJdMatch}% avg match</p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => setSelectedBasket(null)}
                        data-testid="button-clear-basket"
                      >
                        View All Candidates
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(selectedBasket ? students.slice(0, selectedBasket.candidateCount) : students).map((student) => (
                    <ZeptoCandidateCard
                      key={student.id}
                      student={student}
                      jdMatch={generatePredictiveScore(student, 'jd-match')}
                      ojrProbability={generatePredictiveScore(student, 'offer-join')}
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
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="validation" className="space-y-6 p-6 h-full">
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
            </TabsContent>

            <TabsContent value="analytics" className="p-6 h-full">
              <AnalyticsDashboard />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Modals */}
      {selectedStudent && (
        <>
          <CandidateFullReport
            student={selectedStudent}
            isOpen={showFullReport}
            onClose={() => {
              setShowFullReport(false);
              setSelectedStudent(null);
            }}
          />
        </>
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

      {/* ATS Integration Modal */}
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