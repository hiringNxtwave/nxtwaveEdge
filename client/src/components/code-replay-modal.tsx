import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Volume2, 
  Clock, 
  Code, 
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";

interface CodeReplayModalProps {
  student: StudentWithSkills;
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeReplayModal({ student, isOpen, onClose }: CodeReplayModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const totalDuration = 120; // 2 minutes
  const codeLines = [
    "// Two Sum Problem Solution",
    "function twoSum(nums, target) {",
    "  const map = new Map();",
    "  ",
    "  for (let i = 0; i < nums.length; i++) {",
    "    const complement = target - nums[i];",
    "    ",
    "    if (map.has(complement)) {",
    "      return [map.get(complement), i];",
    "    }",
    "    ",
    "    map.set(nums[i], i);",
    "  }",
    "  ",
    "  return [];",
    "}",
    "",
    "// Test cases",
    "console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]",
    "console.log(twoSum([3, 2, 4], 6)); // [1, 2]"
  ];

  const keyMoments = [
    { time: 15, line: 2, event: "Started function definition", type: "milestone" },
    { time: 35, line: 5, event: "Began main loop logic", type: "thinking" },
    { time: 58, line: 8, event: "Added complement check", type: "solution" },
    { time: 85, line: 12, event: "Stored current number", type: "optimization" },
    { time: 105, line: 18, event: "Added test cases", type: "testing" }
  ];

  // Simulate playback
  useEffect(() => {
    if (isPlaying && currentTime < totalDuration) {
      const timer = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + (1 * playbackSpeed);
          // Update current line based on time
          const progressRatio = newTime / totalDuration;
          setCurrentLine(Math.floor(progressRatio * codeLines.length));
          return Math.min(newTime, totalDuration);
        });
      }, 1000 / playbackSpeed);

      return () => clearInterval(timer);
    }
  }, [isPlaying, currentTime, playbackSpeed, totalDuration, codeLines.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const resetPlayback = () => {
    setCurrentTime(0);
    setCurrentLine(0);
    setIsPlaying(false);
  };

  const skipToMoment = (time: number, line: number) => {
    setCurrentTime(time);
    setCurrentLine(line);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentMoment = () => {
    return keyMoments.find(moment => 
      currentTime >= moment.time && currentTime < moment.time + 10
    );
  };

  const currentMoment = getCurrentMoment();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5" />
            <span>Code Replay: {student.fullName}</span>
            <Badge variant="secondary">Two Sum Problem</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
          {/* Code Editor View */}
          <div className="col-span-2 bg-gray-900 rounded-lg p-4 overflow-auto">
            <div className="text-white font-mono text-sm">
              {codeLines.map((line, index) => (
                <div 
                  key={index}
                  className={`flex items-center py-1 ${
                    index === currentLine 
                      ? 'bg-blue-600/30 border-l-4 border-blue-400' 
                      : index < currentLine 
                        ? 'text-green-400' 
                        : 'text-gray-500'
                  }`}
                >
                  <span className="w-8 text-gray-400 text-right mr-4">{index + 1}</span>
                  <span className={index === currentLine ? 'bg-yellow-400 text-gray-900 px-1' : ''}>
                    {line || '\u00A0'}
                  </span>
                  {index === currentLine && (
                    <span className="ml-2 animate-pulse text-yellow-400">█</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Timeline & Controls */}
          <div className="space-y-4">
            {/* Current Moment */}
            {currentMoment && (
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <div className="flex items-center space-x-2 mb-1">
                  {currentMoment.type === 'milestone' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {currentMoment.type === 'thinking' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                  {currentMoment.type === 'solution' && <Code className="w-4 h-4 text-blue-600" />}
                  {currentMoment.type === 'optimization' && <FastForward className="w-4 h-4 text-purple-600" />}
                  {currentMoment.type === 'testing' && <Info className="w-4 h-4 text-gray-600" />}
                  <span className="text-xs text-gray-600">Line {currentMoment.line}</span>
                </div>
                <p className="text-sm font-medium">{currentMoment.event}</p>
              </div>
            )}

            {/* Key Moments Timeline */}
            <div>
              <h4 className="font-medium mb-3">Key Moments</h4>
              <div className="space-y-2">
                {keyMoments.map((moment, index) => (
                  <button
                    key={index}
                    onClick={() => skipToMoment(moment.time, moment.line)}
                    className={`w-full text-left p-2 rounded-lg border transition-colors ${
                      currentTime >= moment.time && currentTime < moment.time + 10
                        ? 'bg-blue-100 border-blue-300'
                        : 'hover:bg-gray-50'
                    }`}
                    data-testid={`button-skip-moment-${index}`}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-600">{formatTime(moment.time)}</span>
                      <Badge variant="outline" className="text-xs">
                        L{moment.line}
                      </Badge>
                    </div>
                    <p className="text-xs mt-1">{moment.event}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Performance Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Thinking Time:</span>
                  <span className="text-green-600">23s</span>
                </div>
                <div className="flex justify-between">
                  <span>Coding Speed:</span>
                  <span className="text-blue-600">Fast</span>
                </div>
                <div className="flex justify-between">
                  <span>Solution Quality:</span>
                  <span className="text-purple-600">Optimal</span>
                </div>
                <div className="flex justify-between">
                  <span>Test Coverage:</span>
                  <span className="text-orange-600">Good</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="border-t pt-4 space-y-3">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
            <Progress value={(currentTime / totalDuration) * 100} className="h-2" />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={resetPlayback}
              data-testid="button-reset-playback"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              onClick={togglePlayPause}
              className="px-6"
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <select 
                value={playbackSpeed} 
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="text-sm border rounded px-2 py-1"
                data-testid="select-playback-speed"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}