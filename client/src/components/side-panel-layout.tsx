import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  ArrowLeft, 
  CheckCircle, 
  Play, 
  MessageSquare,
  Video
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";
import { Link } from "wouter";

interface SidePanelLayoutProps {
  shortlistedStudents: StudentWithSkills[];
  selectedStudent: StudentWithSkills | null;
  showSidePanel: boolean;
  onSelectStudent: (student: StudentWithSkills) => void;
  onCloseSidePanel: () => void;
  onRemoveFromShortlist: (id: string) => void;
  onOpenCodeReplay: () => void;
  onOpenCommunicationSample: () => void;
  generatePredictiveScore: (student: StudentWithSkills, type: string) => number;
}

export default function SidePanelLayout({
  shortlistedStudents,
  selectedStudent,
  showSidePanel,
  onSelectStudent,
  onCloseSidePanel,
  onRemoveFromShortlist,
  onOpenCodeReplay,
  onOpenCommunicationSample,
  generatePredictiveScore
}: SidePanelLayoutProps) {
  const highPotentialCount = shortlistedStudents.filter(s => generatePredictiveScore(s, 'jd-match') > 85).length;
  const avgJdMatch = shortlistedStudents.length > 0 
    ? Math.round(shortlistedStudents.reduce((acc, s) => acc + generatePredictiveScore(s, 'jd-match'), 0) / shortlistedStudents.length)
    : 0;

  if (shortlistedStudents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Card className="text-center py-12 max-w-md mx-auto">
          <CardContent>
            <Users className="w-16 h-16 mx-auto mb-6 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-700 mb-4">No Candidates Shortlisted</h2>
            <p className="text-gray-600 mb-6">
              Start by shortlisting candidates from the talent discovery dashboard to begin the validation process.
            </p>
            <Link href="/talent">
              <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-go-to-talent">
                Go to Talent Discovery
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Left Panel - Candidate List */}
      <div className={`${showSidePanel ? 'w-1/2' : 'w-full'} transition-all duration-300 flex flex-col bg-white border-r`}>
        <div className="p-6 border-b">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{shortlistedStudents.length}</div>
              <div className="text-xs text-blue-700">Total Candidates</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{highPotentialCount}</div>
              <div className="text-xs text-green-700">High Potential</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{avgJdMatch}%</div>
              <div className="text-xs text-purple-700">Avg JD Match</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {shortlistedStudents.filter(s => 
                  generatePredictiveScore(s, 'jd-match') > 85 && 
                  generatePredictiveScore(s, 'offer-join') > 75
                ).length}
              </div>
              <div className="text-xs text-orange-700">Ready to Hire</div>
            </div>
          </div>
        </div>

        {/* Candidate List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {shortlistedStudents.map((student) => (
              <Card 
                key={student.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedStudent?.id === student.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectStudent(student)}
                data-testid={`card-candidate-${student.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {student.fullName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{student.fullName}</h3>
                      <p className="text-sm text-gray-600 truncate">{student.institution} • {student.course}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          JD: {generatePredictiveScore(student, 'jd-match')}%
                        </div>
                        <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Offer: {generatePredictiveScore(student, 'offer-join')}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Candidate Details */}
      {showSidePanel && selectedStudent && (
        <div className="w-1/2 bg-white flex flex-col">
          {/* Detail Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {selectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedStudent.fullName}</h2>
                  <p className="text-gray-600">{selectedStudent.institution}</p>
                  <p className="text-sm text-gray-500">{selectedStudent.course} • {selectedStudent.graduationYear}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onCloseSidePanel}
                data-testid="button-close-side-panel"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Detail Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Predictive Analytics */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Predictive Analytics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {generatePredictiveScore(selectedStudent, 'jd-match')}%
                    </div>
                    <div className="text-sm text-purple-700">JD Match Score</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {generatePredictiveScore(selectedStudent, 'offer-join')}%
                    </div>
                    <div className="text-sm text-green-700">Offer-to-Join</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {generatePredictiveScore(selectedStudent, 'hire-join')}%
                    </div>
                    <div className="text-sm text-yellow-700">Hire-to-Join</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {generatePredictiveScore(selectedStudent, 'ramp-risk')}%
                    </div>
                    <div className="text-sm text-orange-700">Ramp Risk</div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedStudent.skills?.map((skillWithData, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skillWithData.skill.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Validation Tools</h3>
                <div className="grid grid-cols-1 gap-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 font-semibold justify-start" 
                    onClick={onOpenCodeReplay}
                    data-testid={`button-code-replay-detail-${selectedStudent.id}`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    View Code Replay (2 min clips)
                  </Button>
                  <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700 font-semibold text-white justify-start" 
                    onClick={onOpenCommunicationSample}
                    data-testid={`button-communication-detail-${selectedStudent.id}`}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Communication Sample
                  </Button>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold justify-start" 
                    data-testid={`button-seek-detail-${selectedStudent.id}`}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Seek - View Exam & AI Interview Footage
                  </Button>
                </div>
              </div>

              {/* Additional Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Assessment Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Coding Rating:</span>
                    <span className="text-sm font-semibold">{selectedStudent.codingRating}/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Projects:</span>
                    <span className="text-sm font-semibold">{selectedStudent.projects?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Exam Recordings:</span>
                    <span className="text-sm font-semibold">4 available (includes AI interviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="flex space-x-3">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700" 
                data-testid={`button-shortlist-detail-${selectedStudent.id}`}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Move to Next Round
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  onRemoveFromShortlist(selectedStudent.id);
                  onCloseSidePanel();
                }}
                data-testid={`button-remove-detail-${selectedStudent.id}`}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}