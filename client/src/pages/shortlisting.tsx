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

  const shortlistedStudents = students.filter(student => shortlistedIds.includes(student.id));
  const highPotentialCount = shortlistedStudents.filter(s => generatePredictiveScore(s, 'jd-match') > 85).length;
  const avgJdMatch = shortlistedStudents.length > 0 
    ? Math.round(shortlistedStudents.reduce((acc, s) => acc + generatePredictiveScore(s, 'jd-match'), 0) / shortlistedStudents.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
                <h1 className="text-2xl font-bold text-gray-900">Shortlisting & Validation</h1>
                <p className="text-sm text-gray-600">Evidence-based candidate evaluation and selection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {shortlistedIds.length} Candidates
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

      {/* Main Content - Side Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="validation">Validation Dashboard</TabsTrigger>
              <TabsTrigger value="bulk-actions">Bulk Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="validation" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                        <p className="text-2xl font-bold text-blue-600">{shortlistedStudents.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">High Potential</p>
                        <p className="text-2xl font-bold text-green-600">{highPotentialCount}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg JD Match</p>
                        <p className="text-2xl font-bold text-purple-600">{avgJdMatch}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">Ready to Interview</p>
                        <p className="text-2xl font-bold text-orange-600">
                          {shortlistedStudents.filter(s => generatePredictiveScore(s, 'offer-join') > 75).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Candidate Validation Cards */}
              <div className="space-y-4">
                {shortlistedStudents.map((student) => (
                  <Card key={student.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Student Info */}
                        <div className="lg:col-span-3">
                          <h3 className="text-lg font-semibold mb-2">{student.fullName}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <span>{student.skills?.slice(0, 2).join(', ')}</span>
                            </div>
                            <div className="flex items-center">
                              <span>Expected: ₹{student.expectedSalaryMin || '6'}-{student.expectedSalaryMax || '8'} LPA</span>
                            </div>
                          </div>
                        </div>

                        {/* Predictive Scores */}
                        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-3 gap-3">
                          <div className="text-center p-3 bg-purple-50 rounded-lg">
                            <div className="text-lg font-bold text-purple-600">
                              {generatePredictiveScore(student, 'jd-match')}%
                            </div>
                            <div className="text-xs text-purple-700">JD Match</div>
                          </div>
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <div className="text-lg font-bold text-green-600">
                              {generatePredictiveScore(student, 'offer-join')}%
                            </div>
                            <div className="text-xs text-green-700">Offer-Join</div>
                          </div>
                          <div className="text-center p-3 bg-yellow-50 rounded-lg">
                            <div className="text-lg font-bold text-yellow-600">
                              {generatePredictiveScore(student, 'hire-join')}%
                            </div>
                            <div className="text-xs text-yellow-700">Hire-Join</div>
                          </div>
                          <div className="text-center p-3 bg-blue-50 rounded-lg">
                            <div className="text-lg font-bold text-blue-600">
                              {generatePredictiveScore(student, 'lookalike')}%
                            </div>
                            <div className="text-xs text-blue-700">Look-Alike</div>
                          </div>
                          <div className="text-center p-3 bg-orange-50 rounded-lg">
                            <div className="text-lg font-bold text-orange-600">
                              {generatePredictiveScore(student, 'ramp-risk')}%
                            </div>
                            <div className="text-xs text-orange-700">Ramp Risk</div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="lg:col-span-3 space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full text-sm"
                            onClick={() => openCodeReplay(student)}
                            data-testid={`button-code-replay-${student.id}`}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            2-min Code Replay
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full text-sm"
                            onClick={() => openCommunicationSample(student)}
                            data-testid={`button-communication-sample-${student.id}`}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Communication Sample
                          </Button>
                        </div>

                        {/* Expectation Match */}
                        <div className="lg:col-span-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Salary</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              ✓ Match
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Location</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              ✓ Match
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Start Date</span>
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                              Flexible
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="bulk-actions">
              <ShortlistingDashboard 
                students={students}
                onBulkAction={handleBulkAction}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Modals */}
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