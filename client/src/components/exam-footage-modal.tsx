import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Image as ImageIcon, 
  Shield, 
  Clock, 
  User, 
  Monitor,
  Camera,
  CheckCircle,
  Eye,
  Play,
  Pause,
  Volume2,
  Maximize,
  RotateCcw,
  Calendar
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";

interface ExamFootageModalProps {
  student: StudentWithSkills;
  isOpen: boolean;
  onClose: () => void;
}

export default function ExamFootageModal({ student, isOpen, onClose }: ExamFootageModalProps) {
  const [activeTab, setActiveTab] = useState("footage");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Mock exam footage data
  const examFootage = [
    {
      id: "1",
      title: "DSA Assessment - Array Problems",
      duration: "45:32",
      date: "2024-01-15",
      thumbnail: "📹",
      verified: true,
      description: "Complete footage of student solving array manipulation problems",
      keyMoments: [
        { time: 120, description: "Started problem analysis" },
        { time: 890, description: "Began coding solution" },
        { time: 1540, description: "Testing and debugging" },
        { time: 2100, description: "Final optimization" }
      ]
    },
    {
      id: "2", 
      title: "System Design Round",
      duration: "60:00",
      date: "2024-01-18",
      thumbnail: "🎥",
      verified: true,
      description: "Student designing scalable chat application architecture",
      keyMoments: [
        { time: 180, description: "Requirements gathering" },
        { time: 720, description: "High-level architecture" },
        { time: 1800, description: "Database design" },
        { time: 2400, description: "Scaling considerations" }
      ]
    }
  ];

  const verificationImages = [
    {
      id: "1",
      type: "exam-setup",
      title: "Exam Environment Setup",
      timestamp: "2024-01-15 09:00 AM",
      description: "Student at designated exam workstation with identity verification",
      icon: "🖥️",
      verified: true
    },
    {
      id: "2", 
      type: "identity-check",
      title: "Identity Verification",
      timestamp: "2024-01-15 09:02 AM", 
      description: "ID document verification and face matching",
      icon: "🆔",
      verified: true
    },
    {
      id: "3",
      type: "screen-recording",
      title: "Screen Recording Active",
      timestamp: "2024-01-15 09:05 AM",
      description: "Full screen capture during coding assessment",
      icon: "📺",
      verified: true
    },
    {
      id: "4",
      type: "webcam-footage", 
      title: "Webcam Monitoring",
      timestamp: "2024-01-15 09:05 AM",
      description: "Continuous webcam monitoring throughout exam",
      icon: "📷",
      verified: true
    },
    {
      id: "5",
      type: "completion-proof",
      title: "Exam Completion",
      timestamp: "2024-01-15 09:50 AM",
      description: "Final submission timestamp and verification",
      icon: "✅", 
      verified: true
    }
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Video className="w-5 h-5" />
            <span>Exam Footage & Verification: {student.fullName}</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="footage">Exam Footage</TabsTrigger>
              <TabsTrigger value="verification">Verification Images</TabsTrigger>
              <TabsTrigger value="timeline">Complete Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="footage" className="space-y-4 max-h-[60vh] overflow-y-auto">
              {examFootage.map((footage) => (
                <Card key={footage.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{footage.thumbnail}</span>
                        <div>
                          <CardTitle className="text-lg">{footage.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{footage.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{footage.date}</span>
                            </div>
                            {footage.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{footage.description}</p>
                    
                    {/* Mock Video Player */}
                    <div className="bg-black rounded-lg aspect-video relative mb-4 flex items-center justify-center">
                      <div className="text-white text-center">
                        <Video className="w-16 h-16 mx-auto mb-2 opacity-50" />
                        <p className="text-sm opacity-75">Exam Recording: {footage.title}</p>
                        <p className="text-xs opacity-50">Duration: {footage.duration}</p>
                      </div>
                      
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="rounded-full w-16 h-16 bg-white bg-opacity-20 hover:bg-opacity-30"
                          onClick={togglePlayPause}
                          data-testid={`button-play-footage-${footage.id}`}
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white ml-1" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Video Controls */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={togglePlayPause}
                          data-testid={`button-toggle-play-${footage.id}`}
                        >
                          {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                          {isPlaying ? 'Pause' : 'Play'}
                        </Button>
                        <Button variant="outline" size="sm" data-testid={`button-restart-${footage.id}`}>
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Restart
                        </Button>
                        <Button variant="outline" size="sm" data-testid={`button-fullscreen-${footage.id}`}>
                          <Maximize className="w-4 h-4 mr-1" />
                          Fullscreen
                        </Button>
                        <div className="flex items-center space-x-2 ml-auto">
                          <Volume2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatTime(currentTime)} / {footage.duration}
                          </span>
                        </div>
                      </div>

                      {/* Key Moments */}
                      <div>
                        <h4 className="font-medium mb-2">Key Moments:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {footage.keyMoments.map((moment, index) => (
                            <button
                              key={index}
                              className="text-left p-2 rounded border hover:bg-gray-50 transition-colors"
                              onClick={() => setCurrentTime(moment.time)}
                              data-testid={`button-seek-${footage.id}-${index}`}
                            >
                              <div className="text-sm font-medium">{formatTime(moment.time)}</div>
                              <div className="text-xs text-gray-600">{moment.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="verification" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {verificationImages.map((image) => (
                  <Card 
                    key={image.id} 
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedImage(image.id)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center space-y-3">
                        <div className="text-4xl">{image.icon}</div>
                        <div>
                          <h3 className="font-medium text-sm">{image.title}</h3>
                          <p className="text-xs text-gray-600">{image.timestamp}</p>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {image.description}
                        </p>
                        {image.verified && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          data-testid={`button-view-image-${image.id}`}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 max-h-[60vh] overflow-y-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Complete Exam Timeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Timeline events */}
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      
                      {[
                        { time: "09:00 AM", event: "Student arrives at exam center", type: "arrival", icon: "🏢" },
                        { time: "09:02 AM", event: "Identity verification completed", type: "verification", icon: "🆔" },
                        { time: "09:05 AM", event: "Exam environment setup", type: "setup", icon: "🖥️" },
                        { time: "09:05 AM", event: "Screen recording started", type: "recording", icon: "📺" },
                        { time: "09:07 AM", event: "DSA assessment begins", type: "exam", icon: "💻" },
                        { time: "09:52 AM", event: "DSA assessment completed", type: "completion", icon: "✅" },
                        { time: "10:00 AM", event: "System design round begins", type: "exam", icon: "🏗️" },
                        { time: "11:00 AM", event: "System design completed", type: "completion", icon: "✅" },
                        { time: "11:02 AM", event: "Final verification and logout", type: "verification", icon: "🔒" }
                      ].map((item, index) => (
                        <div key={index} className="relative flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center relative z-10">
                            <span className="text-sm">{item.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium">{item.event}</p>
                              <Badge variant="outline" className="text-xs">
                                {item.time}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 capitalize">{item.type} event</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-green-900">Verification Complete</h4>
                      <p className="text-sm text-green-700 mt-1">
                        All exam sessions have been fully recorded and verified. Identity confirmed through 
                        multiple checkpoints. No integrity violations detected during assessment periods.
                      </p>
                      <div className="flex items-center space-x-4 mt-3 text-sm">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Identity Verified</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Screen Recorded</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>Webcam Monitored</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {examFootage.length} exam recordings • {verificationImages.length} verification checkpoints
            </div>
            <Button onClick={onClose} data-testid="button-close-footage">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Image Detail Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Verification Image Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {verificationImages.find(img => img.id === selectedImage) && (
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {verificationImages.find(img => img.id === selectedImage)?.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    {verificationImages.find(img => img.id === selectedImage)?.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {verificationImages.find(img => img.id === selectedImage)?.description}
                  </p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified & Authenticated
                  </Badge>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Dialog>
  );
}