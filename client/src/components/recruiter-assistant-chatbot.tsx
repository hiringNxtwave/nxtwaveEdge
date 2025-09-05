import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  Target, 
  Users, 
  DollarSign, 
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface RecruiterChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommendation: (requirements: any) => void;
}

interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  options?: string[];
  data?: any;
}

interface HiringRequirement {
  role?: string;
  experience?: string;
  skills?: string[];
  teamSize?: number;
  urgency?: string;
  budget?: [number, number];
  location?: string[];
  workMode?: string;
}

export default function RecruiterAssistantChatbot({ isOpen, onClose, onRecommendation }: RecruiterChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your Recruiter Assistant. I'll help you find the perfect candidates by understanding your specific hiring needs. Let's start with a few questions.",
    },
    {
      id: '2',
      type: 'bot',
      content: "What type of role are you looking to fill?",
      options: [
        "Software Engineer",
        "Frontend Developer", 
        "Backend Developer",
        "Full Stack Developer",
        "Data Scientist",
        "DevOps Engineer",
        "Product Manager",
        "UI/UX Designer"
      ]
    }
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [requirements, setRequirements] = useState<HiringRequirement>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const chatSteps = [
    {
      question: "What type of role are you looking to fill?",
      key: "role",
      options: ["Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer", "Data Scientist", "DevOps Engineer", "Product Manager", "UI/UX Designer"]
    },
    {
      question: "How many people do you need to hire?",
      key: "teamSize",
      options: ["1-2 people", "3-5 people", "6-10 people", "10+ people"]
    },
    {
      question: "What's your hiring urgency?",
      key: "urgency",
      options: ["ASAP (within 2 weeks)", "Moderate (1 month)", "Relaxed (2-3 months)", "Planning ahead (3+ months)"]
    },
    {
      question: "What's your budget range per candidate (LPA)?",
      key: "budget",
      options: ["3-6 LPA", "6-10 LPA", "10-15 LPA", "15-25 LPA", "25+ LPA"]
    },
    {
      question: "Which locations are you considering?",
      key: "location", 
      options: ["Bangalore", "Mumbai", "Delhi/NCR", "Hyderabad", "Pune", "Chennai", "Remote", "Any location"]
    },
    {
      question: "What work mode do you prefer?",
      key: "workMode",
      options: ["Remote", "On-site", "Hybrid", "Flexible"]
    },
    {
      question: "Which skills are most important for this role?",
      key: "skills",
      isMultiSelect: true,
      options: ["React", "Node.js", "Python", "Java", "JavaScript", "TypeScript", "AWS", "Docker", "MongoDB", "PostgreSQL", "Machine Learning", "System Design"]
    }
  ];

  const smartDiscoveryMutation = useMutation({
    mutationFn: async (reqs: any) => {
      return await apiRequest("/api/students/smart-discovery", {
        method: "POST", 
        body: JSON.stringify(reqs),
      });
    },
  });

  const addMessage = (message: Omit<ChatMessage, 'id'>) => {
    const newMessage = { ...message, id: Date.now().toString() };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1000);
  };

  const handleOptionSelect = (option: string) => {
    const step = chatSteps[currentStep];
    
    // Add user message
    addMessage({
      type: 'user',
      content: option
    });

    // Update requirements
    const newRequirements = { ...requirements };
    
    if (step.key === 'teamSize') {
      newRequirements.teamSize = parseInt(option.split('-')[0]);
    } else if (step.key === 'budget') {
      const [min, max] = option.replace(' LPA', '').split('-').map(s => parseInt(s.replace('+', '')));
      newRequirements.budget = [min * 100, (max || min * 1.5) * 100]; // Convert to thousands
    } else if (step.key === 'skills') {
      if (!newRequirements.skills) newRequirements.skills = [];
      if (newRequirements.skills.includes(option)) {
        newRequirements.skills = newRequirements.skills.filter(s => s !== option);
      } else {
        newRequirements.skills = [...newRequirements.skills, option];
      }
    } else if (step.key === 'location') {
      newRequirements.location = option === 'Any location' ? [] : [option];
    } else {
      (newRequirements as any)[step.key] = option;
    }
    
    setRequirements(newRequirements);

    simulateTyping();

    setTimeout(() => {
      if (step.key === 'skills') {
        // For skills, show continue button
        addMessage({
          type: 'bot',
          content: `Selected skills: ${newRequirements.skills?.join(', ') || 'None'}. You can select more or continue.`,
          options: [...step.options.filter(opt => !newRequirements.skills?.includes(opt)), "Continue to next question"]
        });
      } else if (currentStep < chatSteps.length - 1) {
        // Move to next question
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        addMessage({
          type: 'bot',
          content: chatSteps[nextStep].question,
          options: chatSteps[nextStep].options
        });
      } else {
        // All questions completed
        finishChat(newRequirements);
      }
    }, 1000);
  };

  const handleTextInput = () => {
    if (!currentInput.trim()) return;
    
    addMessage({
      type: 'user', 
      content: currentInput
    });
    
    setCurrentInput("");
    
    simulateTyping();
    setTimeout(() => {
      addMessage({
        type: 'bot',
        content: "Thanks for that information! Let me continue with the questions to better understand your needs."
      });
    }, 1000);
  };

  const finishChat = (finalRequirements: HiringRequirement) => {
    addMessage({
      type: 'system',
      content: "Perfect! I've gathered all your requirements. Let me analyze the best candidates for you.",
      data: finalRequirements
    });

    setTimeout(() => {
      // Convert requirements to API format
      const apiRequirements = {
        role: finalRequirements.role || "Software Engineer",
        experience: "Entry Level",
        skills: finalRequirements.skills || ["JavaScript", "React"],
        minCGPA: 7.0,
        salaryRange: finalRequirements.budget || [600, 1200],
        locations: finalRequirements.location || ["Bangalore"],
        collegePreference: "Any",
        urgency: finalRequirements.urgency || "Moderate",
        teamSize: finalRequirements.teamSize || 5,
        workMode: finalRequirements.workMode || "Hybrid",
        maxResults: 50
      };

      onRecommendation(apiRequirements);
      
      addMessage({
        type: 'bot', 
        content: `🎯 Based on your requirements for ${finalRequirements.role} role(s), I'm finding the best ${finalRequirements.teamSize || 'several'} candidates with ${finalRequirements.skills?.join(', ')} skills in your ${finalRequirements.budget?.[0]}-${finalRequirements.budget?.[1]} budget range. Check the main screen for your personalized recommendations!`
      });
    }, 2000);
  };

  const handleSkillsContinue = () => {
    if (currentStep < chatSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      addMessage({
        type: 'bot',
        content: chatSteps[nextStep].question,
        options: chatSteps[nextStep].options
      });
    } else {
      finishChat(requirements);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-600" />
            Recruiter Assistant
          </DialogTitle>
        </DialogHeader>

        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg max-h-96">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white'
                  : message.type === 'system'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : 'bg-white text-gray-800 shadow-sm border'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {message.type === 'bot' && <Bot className="w-4 h-4 text-purple-600" />}
                  {message.type === 'user' && <User className="w-4 h-4" />}
                  {message.type === 'system' && <Sparkles className="w-4 h-4 text-purple-600" />}
                </div>
                
                <p className="text-sm">{message.content}</p>
                
                {message.options && (
                  <div className="mt-3 space-y-2">
                    {message.options.map((option, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className={`w-full text-left justify-start text-xs ${
                          option === "Continue to next question" 
                            ? 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100' 
                            : requirements.skills?.includes(option) 
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : ''
                        }`}
                        onClick={() => {
                          if (option === "Continue to next question") {
                            handleSkillsContinue();
                          } else {
                            handleOptionSelect(option);
                          }
                        }}
                      >
                        {requirements.skills?.includes(option) && <CheckCircle className="w-3 h-3 mr-1" />}
                        {option}
                      </Button>
                    ))}
                  </div>
                )}

                {message.data && (
                  <div className="mt-3 p-3 bg-gray-50 rounded border">
                    <h4 className="font-semibold text-xs text-gray-700 mb-2">Your Requirements:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><Target className="w-3 h-3 inline mr-1" />Role: {message.data.role}</div>
                      <div><Users className="w-3 h-3 inline mr-1" />Team: {message.data.teamSize}</div>
                      <div><Clock className="w-3 h-3 inline mr-1" />Urgency: {message.data.urgency}</div>
                      <div><MapPin className="w-3 h-3 inline mr-1" />Location: {message.data.location?.[0] || 'Any'}</div>
                      {message.data.budget && <div><DollarSign className="w-3 h-3 inline mr-1" />Budget: ₹{message.data.budget[0]}-{message.data.budget[1]}K</div>}
                    </div>
                    {message.data.skills && (
                      <div className="mt-2">
                        <span className="text-xs font-medium">Skills: </span>
                        {message.data.skills.map((skill: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs mr-1">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 shadow-sm border px-4 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-purple-600" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex gap-2 p-2 bg-white border-t">
          <Input
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            placeholder="Type a message or use the buttons above..."
            onKeyPress={(e) => e.key === 'Enter' && handleTextInput()}
            className="flex-1"
          />
          <Button onClick={handleTextInput} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 justify-end p-2 border-t bg-gray-50">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Chat
          </Button>
          <Button 
            size="sm" 
            onClick={() => finishChat(requirements)}
            className="bg-purple-600 hover:bg-purple-700"
            disabled={!requirements.role}
          >
            <ArrowRight className="w-4 h-4 mr-1" />
            Get Recommendations Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}