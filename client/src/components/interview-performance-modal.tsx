import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Target, Play, Pause, Volume2, Maximize, Shield, Award, TrendingUp, AlertTriangle, Star, Eye } from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";
import { useState } from "react";

interface InterviewPerformanceModalProps {
  student: StudentWithSkills;
  isOpen: boolean;
  onClose: () => void;
}

interface InterviewMoment {
  timestamp: string;
  type: 'highlight' | 'checkpoint' | 'concern' | 'achievement';
  title: string;
  description: string;
  score?: number;
  recommendation?: string;
}

// Generate interview performance data based on student ID for consistency
const generateInterviewData = (student: StudentWithSkills) => {
  const seed = parseInt(student.id.slice(-8), 16);
  const rand = (offset: number) => ((seed * 37 + offset) % 100) / 100;
  
  const overallPerformance = Math.round(85 + rand(1) * 12);
  const communicationScore = Math.round(80 + rand(2) * 15);
  const technicalScore = Math.round(75 + rand(3) * 20);
  const culturalFitScore = Math.round(88 + rand(5) * 10);
  
  const interviewMoments: InterviewMoment[] = [
    {
      timestamp: "02:15",
      type: 'highlight',
      title: 'Self Introduction',
      description: 'Strong presentation, clear communication',
      score: 9.2
    },
    {
      timestamp: "08:45",
      type: 'achievement',
      title: 'Problem-Solving',
      description: 'Systematic approach, good reasoning',
      score: 8.5
    },
    {
      timestamp: "15:45",
      type: 'concern',
      title: 'Advanced Algorithms',
      description: 'Hesitation on dynamic programming',
      score: 6.8
    },
    {
      timestamp: "22:10",
      type: 'highlight',
      title: 'Cultural Fit',
      description: 'Great enthusiasm, thoughtful questions',
      score: culturalFitScore / 10
    }
  ];

  return {
    overallPerformance,
    communicationScore,
    technicalScore,
    culturalFitScore,
    interviewMoments,
    interviewDuration: "28:45",
    interviewDate: "2024-01-15",
    interviewer: "Sarah Chen, Senior Engineering Manager"
  };
};

export default function InterviewPerformanceModal({ student, isOpen, onClose }: InterviewPerformanceModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("10:02");
  
  const data = generateInterviewData(student);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <Award className="w-6 h-6 text-purple-600" />
                Overall and Interview Performance - {student.firstName} {student.lastName}
              </DialogTitle>
              <DialogDescription className="text-lg mt-2">
                Complete interview footage, performance analysis, and recruiter checkpoints
              </DialogDescription>
            </div>
            {student.verified && (
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-full">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">Verified Profile</span>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Video Player */}
          <Card>
            <CardContent className="p-4">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className={`p-4 rounded-full mb-3 inline-block ${isPlaying ? 'bg-red-600/20' : 'bg-black/20'}`}>
                      {isPlaying ? <Pause className="w-12 h-12 text-white" /> : <Play className="w-12 h-12 text-white" />}
                    </div>
                    <p className="text-white text-lg">Interview Recording - {data.interviewDuration}</p>
                    <p className="text-gray-300 text-sm">{data.interviewer}</p>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-3">
                  <div className="flex items-center gap-3">
                    <button 
                      className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                      onClick={() => setIsPlaying(!isPlaying)}
                      data-testid="play-pause-button"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                    </button>
                    <div className="flex-1 bg-white/20 rounded-full h-1">
                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    <span className="text-white text-xs">{currentTime} / {data.interviewDuration}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance & Checkpoints */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold mb-3">Performance Summary</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-xl font-bold text-purple-600">{data.overallPerformance}%</div>
                    <div className="text-xs text-gray-600">Overall</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-xl font-bold text-blue-600">{data.communicationScore}%</div>
                    <div className="text-xs text-gray-600">Verbal Ability</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-xl font-bold text-green-600">{data.technicalScore}%</div>
                    <div className="text-xs text-gray-600">Technical</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded">
                    <div className="text-xl font-bold text-orange-600">{data.culturalFitScore}%</div>
                    <div className="text-xs text-gray-600">Culture Fit</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Checkpoints */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Key Checkpoints
                </h3>
                <div className="space-y-3">
                  {data.interviewMoments.map((moment, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded border-l-3 cursor-pointer hover:shadow-sm transition-shadow ${
                        moment.type === 'highlight' ? 'border-l-blue-500 bg-blue-50' 
                        : moment.type === 'achievement' ? 'border-l-green-500 bg-green-50'
                        : moment.type === 'concern' ? 'border-l-orange-500 bg-orange-50'
                        : 'border-l-purple-500 bg-purple-50'
                      }`}
                      onClick={() => setCurrentTime(moment.timestamp)}
                      data-testid={`checkpoint-${moment.timestamp}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {moment.type === 'highlight' && <Eye className="w-3 h-3 text-blue-600" />}
                          {moment.type === 'achievement' && <CheckCircle className="w-3 h-3 text-green-600" />}
                          {moment.type === 'concern' && <AlertTriangle className="w-3 h-3 text-orange-600" />}
                          <span className="font-medium text-sm">{moment.timestamp}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">{moment.score}/10</Badge>
                      </div>
                      <h4 className="font-semibold text-sm">{moment.title}</h4>
                      <p className="text-xs text-gray-600">{moment.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final Recommendation */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Final Assessment</h3>
                <p className="text-gray-600 text-sm">Strong communication, good technical skills, needs algorithm practice</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">STRONG HIRE</div>
                <p className="text-sm text-gray-600">Recommend final round</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Award className="w-4 h-4 mr-2" />
            Download Interview Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}