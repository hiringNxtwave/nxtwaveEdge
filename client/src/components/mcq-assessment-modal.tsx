import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Award,
  BookOpen,
  Target
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";

interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  studentAnswer: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

interface MCQAssessmentModalProps {
  assessmentType: 'Aptitude' | 'Verbal Reasoning' | 'Tech Fundamentals';
  student: StudentWithSkills;
  score: number;
  onClose: () => void;
}

export default function MCQAssessmentModal({ assessmentType, student, score, onClose }: MCQAssessmentModalProps) {
  // Generate seed for consistent data
  const seed = parseInt(student.id.slice(-8), 16);
  
  // Generate MCQ questions based on assessment type and student seed
  const generateMCQData = (): MCQQuestion[] => {
    if (assessmentType === 'Aptitude') {
      return [
        {
          id: 1,
          question: "If a train travels 240 km in 3 hours, what is its average speed?",
          options: ["60 km/h", "70 km/h", "80 km/h", "90 km/h"],
          correctAnswer: 2,
          studentAnswer: seed % 4,
          explanation: "Average speed = Total distance ÷ Total time = 240 km ÷ 3 hours = 80 km/h",
          difficulty: 'Easy',
          topic: 'Speed & Time'
        },
        {
          id: 2,
          question: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
          options: ["38", "40", "42", "44"],
          correctAnswer: 2,
          studentAnswer: (seed + 1) % 4,
          explanation: "The differences are 4, 6, 8, 10, so the next difference is 12. Therefore: 30 + 12 = 42",
          difficulty: 'Medium',
          topic: 'Number Series'
        },
        {
          id: 3,
          question: "If 3x + 7 = 22, what is the value of x?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 2,
          studentAnswer: (seed + 2) % 4,
          explanation: "3x + 7 = 22 → 3x = 15 → x = 5",
          difficulty: 'Easy',
          topic: 'Algebra'
        },
        {
          id: 4,
          question: "A cube has a volume of 64 cubic units. What is the length of each side?",
          options: ["4 units", "6 units", "8 units", "10 units"],
          correctAnswer: 0,
          studentAnswer: (seed + 3) % 4,
          explanation: "Volume of cube = side³. If volume = 64, then side = ∛64 = 4 units",
          difficulty: 'Medium',
          topic: 'Geometry'
        },
        {
          id: 5,
          question: "If 20% of a number is 45, what is 60% of the same number?",
          options: ["120", "135", "150", "165"],
          correctAnswer: 1,
          studentAnswer: (seed + 4) % 4,
          explanation: "If 20% = 45, then 100% = 225. Therefore 60% = 225 × 0.6 = 135",
          difficulty: 'Hard',
          topic: 'Percentage'
        }
      ];
    } else if (assessmentType === 'Verbal Reasoning') {
      return [
        {
          id: 1,
          question: "Choose the word that is most similar in meaning to 'ABUNDANT':",
          options: ["Scarce", "Plentiful", "Moderate", "Limited"],
          correctAnswer: 1,
          studentAnswer: seed % 4,
          explanation: "Abundant means existing in large quantities; plentiful is the closest synonym.",
          difficulty: 'Easy',
          topic: 'Synonyms'
        },
        {
          id: 2,
          question: "Complete the analogy: Book is to Library as Painting is to ____",
          options: ["Canvas", "Artist", "Gallery", "Frame"],
          correctAnswer: 2,
          studentAnswer: (seed + 1) % 4,
          explanation: "Books are stored/displayed in libraries, just as paintings are stored/displayed in galleries.",
          difficulty: 'Medium',
          topic: 'Analogies'
        },
        {
          id: 3,
          question: "Identify the grammatically correct sentence:",
          options: [
            "Neither the manager nor the employees was satisfied",
            "Neither the manager nor the employees were satisfied", 
            "Neither the manager or the employees were satisfied",
            "Neither the manager and the employees was satisfied"
          ],
          correctAnswer: 1,
          studentAnswer: (seed + 2) % 4,
          explanation: "With 'neither...nor', the verb agrees with the subject closer to it. Since 'employees' is plural, we use 'were'.",
          difficulty: 'Hard',
          topic: 'Grammar'
        },
        {
          id: 4,
          question: "What is the antonym of 'EPHEMERAL'?",
          options: ["Temporary", "Permanent", "Brief", "Fleeting"],
          correctAnswer: 1,
          studentAnswer: (seed + 3) % 4,
          explanation: "Ephemeral means lasting for a very short time. Permanent is the opposite meaning.",
          difficulty: 'Medium',
          topic: 'Antonyms'
        },
        {
          id: 5,
          question: "Choose the best word to complete: 'His _____ for detail made him an excellent editor.'",
          options: ["Disregard", "Neglect", "Penchant", "Aversion"],
          correctAnswer: 2,
          studentAnswer: (seed + 4) % 4,
          explanation: "Penchant means a strong inclination or liking for something, which fits the positive context.",
          difficulty: 'Hard',
          topic: 'Vocabulary'
        }
      ];
    } else if (assessmentType === 'Tech Fundamentals') {
      return [
        {
          id: 1,
          question: "What is the time complexity of searching in a balanced binary search tree?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          correctAnswer: 1,
          studentAnswer: seed % 4,
          explanation: "In a balanced BST, the height is log n, so searching takes O(log n) time in the worst case.",
          difficulty: 'Medium',
          topic: 'Data Structures'
        },
        {
          id: 2,
          question: "Which sorting algorithm has the best average-case time complexity?",
          options: ["Bubble Sort", "Selection Sort", "Merge Sort", "Quick Sort"],
          correctAnswer: 2,
          studentAnswer: (seed + 1) % 4,
          explanation: "Merge Sort has guaranteed O(n log n) time complexity in all cases, making it optimal for average-case scenarios.",
          difficulty: 'Easy',
          topic: 'Algorithms'
        },
        {
          id: 3,
          question: "In object-oriented programming, what does 'encapsulation' refer to?",
          options: [
            "Inheriting properties from a parent class",
            "Hiding internal implementation details", 
            "Creating multiple methods with the same name",
            "Converting one data type to another"
          ],
          correctAnswer: 1,
          studentAnswer: (seed + 2) % 4,
          explanation: "Encapsulation is the bundling of data and methods that operate on that data, while hiding internal implementation details from the outside.",
          difficulty: 'Easy',
          topic: 'OOP Concepts'
        },
        {
          id: 4,
          question: "What is the primary purpose of the 'volatile' keyword in Java?",
          options: [
            "To prevent method overriding",
            "To ensure thread-safe access to variables",
            "To make variables immutable",
            "To optimize memory usage"
          ],
          correctAnswer: 1,
          studentAnswer: (seed + 3) % 4,
          explanation: "The 'volatile' keyword ensures that changes to a variable are immediately visible to all threads, preventing caching issues in multi-threaded environments.",
          difficulty: 'Hard',
          topic: 'Concurrency'
        },
        {
          id: 5,
          question: "Which of the following is NOT a characteristic of RESTful APIs?",
          options: [
            "Stateless communication",
            "Uniform interface",
            "Maintaining client session state",
            "Cacheable responses"
          ],
          correctAnswer: 2,
          studentAnswer: (seed + 4) % 4,
          explanation: "RESTful APIs are stateless, meaning they don't maintain client session state between requests. Each request must contain all necessary information.",
          difficulty: 'Medium',
          topic: 'Web Technologies'
        }
      ];
    }
    
    return []; // Default return for unknown assessment types
  };

  const questions = generateMCQData();
  const correctAnswers = questions.filter(q => q.studentAnswer === q.correctAnswer).length;
  const totalQuestions = questions.length;
  const accuracyPercentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getAnswerIcon = (isCorrect: boolean) => {
    return isCorrect ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="mcq-assessment-description">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            {assessmentType} Assessment - {student.firstName} {student.lastName}
          </DialogTitle>
          <DialogDescription id="mcq-assessment-description">
            View detailed {assessmentType.toLowerCase()} assessment results including questions, student answers, and explanations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Assessment Summary */}
          <Card className="border-l-4 border-l-blue-500 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Assessment Overview</h3>
                  <p className="text-sm text-gray-600">Performance summary and accuracy metrics</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{accuracyPercentage}%</div>
                  <div className="text-sm text-gray-500">Accuracy</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{correctAnswers}</div>
                  <div className="text-xs text-gray-500">Correct</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-red-600">{totalQuestions - correctAnswers}</div>
                  <div className="text-xs text-gray-500">Incorrect</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{totalQuestions}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-500">{correctAnswers}/{totalQuestions}</span>
                </div>
                <Progress value={accuracyPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Questions and Answers */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              Questions & Student Responses
            </h3>
            
            {questions.map((question, index) => {
              const isCorrect = question.studentAnswer === question.correctAnswer;
              
              return (
                <Card key={question.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-semibold text-gray-700">Q{index + 1}</span>
                          <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {question.topic}
                          </Badge>
                        </div>
                        <CardTitle className="text-base leading-relaxed">
                          {question.question}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {getAnswerIcon(isCorrect)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Options */}
                      <div className="grid grid-cols-2 gap-2">
                        {question.options.map((option, optionIndex) => {
                          const isCorrectAnswer = optionIndex === question.correctAnswer;
                          const isStudentAnswer = optionIndex === question.studentAnswer;
                          
                          let optionClass = "p-3 rounded-lg border text-sm ";
                          if (isCorrectAnswer && isStudentAnswer) {
                            optionClass += "bg-green-100 border-green-500 text-green-800"; // Correct answer chosen
                          } else if (isCorrectAnswer) {
                            optionClass += "bg-green-50 border-green-300 text-green-700"; // Correct answer not chosen
                          } else if (isStudentAnswer) {
                            optionClass += "bg-red-100 border-red-500 text-red-800"; // Wrong answer chosen
                          } else {
                            optionClass += "bg-gray-50 border-gray-200 text-gray-600"; // Not chosen
                          }
                          
                          return (
                            <div key={optionIndex} className={optionClass}>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{String.fromCharCode(65 + optionIndex)}.</span>
                                <span>{option}</span>
                                {isCorrectAnswer && (
                                  <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                                )}
                                {isStudentAnswer && !isCorrectAnswer && (
                                  <XCircle className="w-4 h-4 text-red-600 ml-auto" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Student Answer vs Correct Answer */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Student Answer: </span>
                            <span className={isCorrect ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                              {String.fromCharCode(65 + question.studentAnswer)}. {question.options[question.studentAnswer]}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Correct Answer: </span>
                            <span className="text-green-600 font-semibold">
                              {String.fromCharCode(65 + question.correctAnswer)}. {question.options[question.correctAnswer]}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Explanation */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-1 flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          Explanation:
                        </h5>
                        <p className="text-sm text-blue-700">{question.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-600" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-semibold text-green-700">Strengths</h5>
                  {correctAnswers >= 4 && (
                    <p className="text-sm text-green-600">• Excellent overall performance</p>
                  )}
                  {questions.filter(q => q.difficulty === 'Hard' && q.studentAnswer === q.correctAnswer).length > 0 && (
                    <p className="text-sm text-green-600">• Strong performance on difficult questions</p>
                  )}
                  {questions.filter(q => q.studentAnswer === q.correctAnswer).length >= 3 && (
                    <p className="text-sm text-green-600">• Good problem-solving consistency</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-semibold text-orange-700">Areas for Improvement</h5>
                  {questions.filter(q => q.difficulty === 'Easy' && q.studentAnswer !== q.correctAnswer).length > 0 && (
                    <p className="text-sm text-orange-600">• Focus on fundamental concepts</p>
                  )}
                  {correctAnswers < 3 && (
                    <p className="text-sm text-orange-600">• Practice more {assessmentType.toLowerCase()} problems</p>
                  )}
                  {questions.filter(q => q.studentAnswer !== q.correctAnswer).length > 2 && (
                    <p className="text-sm text-orange-600">• Review incorrect answers and explanations</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Clock className="w-4 h-4 mr-2" />
            Schedule Re-assessment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}