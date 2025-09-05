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
  
  // Calculate overall performance from different assessments
  const overallPerformance = Math.round(85 + rand(1) * 12); // 85-97%
  const communicationScore = Math.round(80 + rand(2) * 15); // 80-95%
  const technicalScore = Math.round(75 + rand(3) * 20); // 75-95%
  const problemSolvingScore = Math.round(82 + rand(4) * 13); // 82-95%
  const culturalFitScore = Math.round(88 + rand(5) * 10); // 88-98%
  
  const interviewMoments: InterviewMoment[] = [
    {
      timestamp: "02:15",
      type: 'highlight',
      title: 'Excellent Self Introduction',
      description: 'Clear, confident introduction covering background, skills, and career goals. Strong eye contact and professional demeanor.',
      score: 9.2,
      recommendation: 'Shows strong communication skills and preparation'
    },
    {
      timestamp: "05:30",
      type: 'checkpoint',
      title: 'Technical Knowledge Assessment',
      description: 'Asked about React lifecycle methods and state management. Provided accurate explanations with practical examples.',
      score: technicalScore / 10,
      recommendation: 'Solid understanding of frontend technologies'
    },
    {
      timestamp: "08:45",
      type: 'achievement',
      title: 'Problem-Solving Approach',
      description: 'Walked through debugging methodology systematically. Asked clarifying questions and explained thought process clearly.',
      score: problemSolvingScore / 10,
      recommendation: 'Demonstrates analytical thinking and structure'
    },
    {
      timestamp: "12:20",
      type: 'highlight',
      title: 'Project Discussion',
      description: 'Enthusiastically explained e-commerce project. Detailed discussion of challenges faced and solutions implemented.',
      score: 8.7,
      recommendation: 'Shows passion for development and learning from experience'
    },
    {
      timestamp: "15:45",
      type: 'concern',
      title: 'Advanced Algorithm Question',
      description: 'Showed hesitation on dynamic programming concepts. Took longer than expected to arrive at solution approach.',
      score: 6.8,
      recommendation: 'Could benefit from additional algorithm practice'
    },
    {
      timestamp: "18:30",
      type: 'checkpoint',
      title: 'Behavioral Questions',
      description: 'Responded well to teamwork and conflict resolution scenarios. Used STAR method effectively.',
      score: communicationScore / 10,
      recommendation: 'Strong interpersonal skills and self-awareness'
    },
    {
      timestamp: "22:10",
      type: 'achievement',
      title: 'Cultural Fit Questions',
      description: 'Showed genuine enthusiasm for company mission. Asked thoughtful questions about team culture and growth opportunities.',
      score: culturalFitScore / 10,
      recommendation: 'Excellent alignment with company values'
    },
    {
      timestamp: "25:40",
      type: 'highlight',
      title: 'Questions for Interviewer',
      description: 'Asked intelligent questions about tech stack, team structure, and professional development opportunities.',
      score: 9.0,
      recommendation: 'Demonstrates genuine interest and forward-thinking'
    }
  ];

  return {
    overallPerformance,
    communicationScore,
    technicalScore,
    problemSolvingScore,
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Video Player Section - Takes 2 columns */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardContent className="p-0">
                {/* Video Player */}
                <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                  <div className="aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className={`p-6 rounded-full mb-4 inline-block transition-colors ${
                        isPlaying ? 'bg-red-600/20' : 'bg-black/20'
                      }`}>
                        {isPlaying ? (
                          <Pause className="w-20 h-20 text-white" />
                        ) : (
                          <Play className="w-20 h-20 text-white" />
                        )}
                      </div>
                      <p className="text-white text-xl mb-2">AI Mock Interview Recording</p>
                      <p className="text-gray-300 mb-4">Duration: {data.interviewDuration} • Date: {data.interviewDate}</p>
                      <p className="text-blue-300 text-sm">Interviewer: {data.interviewer}</p>
                    </div>
                  </div>
                  
                  {/* Video Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <div className="flex items-center gap-4 mb-3">
                      <button 
                        className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        onClick={() => setIsPlaying(!isPlaying)}
                        data-testid="play-pause-button"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white" />
                        )}
                      </button>
                      <div className="flex-1 bg-white/20 rounded-full h-2 cursor-pointer">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-white text-sm">{currentTime} / {data.interviewDuration}</span>
                      <Volume2 className="w-5 h-5 text-white cursor-pointer hover:text-blue-300" />
                      <Maximize className="w-5 h-5 text-white cursor-pointer hover:text-blue-300" />
                    </div>
                    
                    {/* Quick Navigation */}
                    <div className="flex gap-2 flex-wrap">
                      {data.interviewMoments.slice(0, 4).map((moment, index) => (
                        <button
                          key={index}
                          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs transition-colors"
                          onClick={() => setCurrentTime(moment.timestamp)}
                          data-testid={`seek-${moment.timestamp}`}
                        >
                          {moment.timestamp} - {moment.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{data.overallPerformance}%</div>
                  <div className="text-xs text-gray-600">Overall Performance</div>
                  <Badge variant="secondary" className="mt-1">
                    {data.overallPerformance >= 90 ? 'Excellent' : data.overallPerformance >= 80 ? 'Good' : 'Average'}
                  </Badge>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{data.communicationScore}%</div>
                  <div className="text-xs text-gray-600">Communication</div>
                  <div className="flex justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.round(data.communicationScore / 20) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">{data.technicalScore}%</div>
                  <div className="text-xs text-gray-600">Technical Skills</div>
                  <div className="flex justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.round(data.technicalScore / 20) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">{data.culturalFitScore}%</div>
                  <div className="text-xs text-gray-600">Cultural Fit</div>
                  <div className="flex justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= Math.round(data.culturalFitScore / 20) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Timeline & Checkpoints Section - Takes 1 column */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  Interview Timeline & Checkpoints
                </h3>
                
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  {data.interviewMoments.map((moment, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                        moment.type === 'highlight' 
                          ? 'border-l-blue-500 bg-blue-50' 
                          : moment.type === 'achievement'
                          ? 'border-l-green-500 bg-green-50'
                          : moment.type === 'concern'
                          ? 'border-l-orange-500 bg-orange-50'
                          : 'border-l-purple-500 bg-purple-50'
                      }`}
                      onClick={() => setCurrentTime(moment.timestamp)}
                      data-testid={`checkpoint-${moment.timestamp}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {moment.type === 'highlight' && <Eye className="w-4 h-4 text-blue-600" />}
                          {moment.type === 'achievement' && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {moment.type === 'concern' && <AlertTriangle className="w-4 h-4 text-orange-600" />}
                          {moment.type === 'checkpoint' && <Target className="w-4 h-4 text-purple-600" />}
                          <span className="font-medium text-sm">{moment.timestamp}</span>
                        </div>
                        {moment.score && (
                          <Badge variant="outline" className="text-xs">
                            {moment.score}/10
                          </Badge>
                        )}
                      </div>
                      
                      <h4 className="font-semibold text-sm mb-1">{moment.title}</h4>
                      <p className="text-xs text-gray-600 mb-2">{moment.description}</p>
                      
                      {moment.recommendation && (
                        <div className={`text-xs px-2 py-1 rounded ${
                          moment.type === 'concern' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          💡 {moment.recommendation}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          <Play className="w-3 h-3 mr-1" />
                          Seek to {moment.timestamp}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Overall Synopsis */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Final Synopsis & Recruiter Recommendations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Key Strengths
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Excellent communication skills and professional presentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Strong technical foundation with practical project experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Systematic problem-solving approach and clear thought process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Great cultural fit and genuine enthusiasm for the role</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Areas for Development
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Could benefit from additional practice with advanced algorithms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Continue building experience with complex system design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Opportunity for mentorship in advanced technical concepts</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">🎯 Recruiter Recommendation</h4>
              <p className="text-blue-700 text-sm">
                <strong>STRONG HIRE</strong> - {student.firstName} demonstrates excellent potential with solid technical skills, 
                outstanding communication abilities, and strong cultural alignment. The minor technical gaps can be easily 
                addressed through onboarding and mentorship. Recommend proceeding to final interview round.
              </p>
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