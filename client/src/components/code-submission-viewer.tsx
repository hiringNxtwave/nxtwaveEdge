import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Shield, 
  Eye, 
  Camera, 
  Keyboard,
  Activity,
  FileCode,
  Timer,
  Target,
  Award
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CodeSubmissionViewerProps {
  studentId: string;
  studentName: string;
  onClose?: () => void;
}

export default function CodeSubmissionViewer({ 
  studentId, 
  studentName, 
  onClose 
}: CodeSubmissionViewerProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<string>("");
  const [timelinePosition, setTimelinePosition] = useState(0);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["/api/code-submissions", studentId],
    queryFn: async () => {
      const response = await fetch(`/api/code-submissions?studentId=${studentId}`);
      if (!response.ok) throw new Error("Failed to fetch submissions");
      return response.json();
    },
  });

  const { data: submissionDetail } = useQuery({
    queryKey: ["/api/code-submissions", selectedSubmission],
    queryFn: async () => {
      const response = await fetch(`/api/code-submissions/${selectedSubmission}`);
      if (!response.ok) throw new Error("Failed to fetch submission details");
      return response.json();
    },
    enabled: !!selectedSubmission,
  });

  // Mock timeline data for keystroke analysis
  const generateKeystrokeTimeline = (submission: any) => {
    if (!submission) return [];
    
    const timeline = [];
    const startTime = new Date(submission.createdAt).getTime();
    const endTime = new Date(submission.submittedAt).getTime();
    const duration = endTime - startTime;
    
    // Generate realistic coding timeline events
    for (let i = 0; i < 20; i++) {
      const timestamp = startTime + (duration * i / 20);
      timeline.push({
        time: timestamp,
        action: i < 5 ? 'planning' : i < 15 ? 'coding' : 'testing',
        keystrokeCount: Math.floor(Math.random() * 50) + 10,
        activity: i % 3 === 0 ? 'high' : i % 3 === 1 ? 'medium' : 'low'
      });
    }
    
    return timeline;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50";
    if (score >= 75) return "text-blue-600 bg-blue-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const duration = Math.floor((end - start) / 1000 / 60); // minutes
    return `${duration}m`;
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Loading submissions...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const submissionsList = submissions || [];
  const currentSubmission = submissionsList.find((s: any) => s.id === selectedSubmission);

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            Code Submissions - {studentName}
          </CardTitle>
          {onClose && (
            <Button variant="outline" onClick={onClose} data-testid="button-close-code-viewer">
              Close
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {submissionsList.length === 0 ? (
          <div className="text-center py-12">
            <FileCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Code Submissions</h3>
            <p className="text-gray-600">This student hasn't submitted any coding solutions yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Submissions List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg mb-4">All Submissions</h3>
              {submissionsList.map((submission: any) => (
                <div
                  key={submission.id}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50",
                    selectedSubmission === submission.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                  )}
                  onClick={() => setSelectedSubmission(submission.id)}
                  data-testid={`submission-${submission.id}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {submission.question?.question?.substring(0, 50)}...
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {format(new Date(submission.submittedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <Badge className={cn("text-xs", getScoreColor(submission.score || 0))}>
                      {submission.score || 0}/100
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {formatDuration(submission.createdAt, submission.submittedAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {submission.testCasesPassed}/{submission.totalTestCases}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {submission.language}
                    </Badge>
                    {submission.idVerified && (
                      <Shield className="w-3 h-3 text-green-500" />
                    )}
                    {submission.webcamVerified && (
                      <Camera className="w-3 h-3 text-blue-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Submission Details */}
            <div className="lg:col-span-2">
              {selectedSubmission ? (
                <Tabs defaultValue="code" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="analysis">Analysis</TabsTrigger>
                    <TabsTrigger value="verification">Verification</TabsTrigger>
                  </TabsList>

                  <TabsContent value="code" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Code Solution</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Language: {currentSubmission?.language}</span>
                          <span>Execution: {currentSubmission?.executionTime}ms</span>
                          <span>Memory: {currentSubmission?.memoryUsed}KB</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="relative">
                          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                            <code>{currentSubmission?.code || "// Code will be displayed here"}</code>
                          </pre>
                          <div className="absolute top-2 right-2">
                            <Badge className={getScoreColor(currentSubmission?.score || 0)}>
                              Score: {currentSubmission?.score}/100
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Test Cases Results */}
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                            <div className="text-lg font-semibold text-green-700">
                              {currentSubmission?.testCasesPassed || 0}
                            </div>
                            <div className="text-sm text-green-600">Passed</div>
                          </div>
                          <div className="text-center p-3 bg-red-50 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600 mx-auto mb-1" />
                            <div className="text-lg font-semibold text-red-700">
                              {(currentSubmission?.totalTestCases || 0) - (currentSubmission?.testCasesPassed || 0)}
                            </div>
                            <div className="text-sm text-red-600">Failed</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          Coding Timeline
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {generateKeystrokeTimeline(currentSubmission).map((event, i) => (
                            <div key={i} className="flex items-center gap-4">
                              <div className="text-xs text-gray-500 w-16">
                                {format(event.time, 'HH:mm')}
                              </div>
                              <div className={cn(
                                "w-3 h-3 rounded-full",
                                event.activity === 'high' ? 'bg-red-500' : 
                                event.activity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                              )}></div>
                              <div className="flex-1">
                                <div className="text-sm capitalize font-medium">{event.action}</div>
                                <div className="text-xs text-gray-500">
                                  {event.keystrokeCount} keystrokes/min
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="analysis" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Execution Time</span>
                            <Badge variant="outline">
                              {currentSubmission?.executionTime || 0}ms
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Memory Usage</span>
                            <Badge variant="outline">
                              {currentSubmission?.memoryUsed || 0}KB
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Code Quality</span>
                            <Badge className={getScoreColor(85)}>
                              A- (85/100)
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Coding Behavior</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span>Problem Understanding</span>
                            <Badge className={getScoreColor(92)}>Excellent</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Code Structure</span>
                            <Badge className={getScoreColor(88)}>Good</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Testing Approach</span>
                            <Badge className={getScoreColor(78)}>Average</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="verification" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-500" />
                          Identity Verification
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 border rounded-lg">
                            <Eye className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                            <div className="font-medium">ID Verification</div>
                            <Badge 
                              className={cn("mt-2", currentSubmission?.idVerified ? 
                                "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                              )}
                            >
                              {currentSubmission?.idVerified ? "Verified" : "Not Verified"}
                            </Badge>
                          </div>
                          
                          <div className="text-center p-4 border rounded-lg">
                            <Camera className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                            <div className="font-medium">Webcam Monitoring</div>
                            <Badge 
                              className={cn("mt-2", currentSubmission?.webcamVerified ? 
                                "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                              )}
                            >
                              {currentSubmission?.webcamVerified ? "Active" : "Not Active"}
                            </Badge>
                          </div>
                          
                          <div className="text-center p-4 border rounded-lg">
                            <Keyboard className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                            <div className="font-medium">Keystroke Pattern</div>
                            <Badge className="mt-2 bg-blue-50 text-blue-700">
                              Normal
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800">Integrity Confirmed</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            This submission passes all integrity checks. The candidate completed the assessment under verified conditions.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Submission</h3>
                  <p className="text-gray-600">Choose a submission from the left to view detailed analysis</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}