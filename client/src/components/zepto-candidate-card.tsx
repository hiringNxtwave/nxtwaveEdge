import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import { 
  MapPin, 
  IndianRupee, 
  Star, 
  Shield, 
  TrendingUp,
  Award,
  Clock,
  Target,
  Zap,
  CheckCircle
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";

interface ZeptoCandidateCardProps {
  student: StudentWithSkills;
  jdMatch: number;
  ojrProbability: number;
  salaryFit: number;
  locationFit: number;
  onViewProfile: () => void;
  onShortlist: () => void;
  isShortlisted: boolean;
}

export default function ZeptoCandidateCard({
  student,
  jdMatch,
  ojrProbability, 
  salaryFit,
  locationFit,
  onViewProfile,
  onShortlist,
  isShortlisted
}: ZeptoCandidateCardProps) {
  const [showSkillsRadar, setShowSkillsRadar] = useState(false);

  // Generate skills radar data
  const skillsRadarData = [
    { skill: 'Technical', value: Math.min(100, (student.codingRating || 4) * 20) },
    { skill: 'Problem Solving', value: Math.min(100, jdMatch - 10 + Math.random() * 20) },
    { skill: 'Communication', value: Math.min(100, 60 + Math.random() * 30) },
    { skill: 'Learning', value: Math.min(100, 70 + Math.random() * 25) },
    { skill: 'Teamwork', value: Math.min(100, 65 + Math.random() * 30) },
    { skill: 'Leadership', value: Math.min(100, 50 + Math.random() * 35) },
  ];

  // Audit badges based on student data
  const auditBadges = [
    { 
      type: "assessment", 
      text: "Assessment Verified 30 Days Ago", 
      icon: Shield, 
      color: "text-green-600 bg-green-50 border-green-200" 
    },
    { 
      type: "ai-free", 
      text: "AI-Free Verified", 
      icon: CheckCircle, 
      color: "text-blue-600 bg-blue-50 border-blue-200" 
    }
  ];

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border hover:border-blue-300 bg-white relative overflow-hidden">
      {/* Priority Indicator */}
      <div className={`absolute top-0 left-0 w-full h-1 ${
        jdMatch >= 90 ? 'bg-green-500' : 
        jdMatch >= 75 ? 'bg-yellow-500' : 'bg-gray-400'
      }`} />

      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {student.fullName.charAt(0)}
            </div>
            
            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {student.fullName}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {student.institution} • {student.course}
              </p>
              <p className="text-xs text-gray-500">Class of {student.graduationYear}</p>
            </div>
          </div>

          {/* JD Match - Large Font */}
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">{jdMatch}%</div>
            <div className="text-xs text-gray-500">JD Match</div>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-2 bg-white rounded-lg shadow-sm">
            <div className="text-lg font-bold text-green-600">{ojrProbability}%</div>
            <div className="text-xs text-gray-500">OJR</div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg shadow-sm">
            <div className="text-lg font-bold text-purple-600">{salaryFit}%</div>
            <div className="text-xs text-gray-500">Salary Fit</div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg shadow-sm">
            <div className="text-lg font-bold text-orange-600">{locationFit}%</div>
            <div className="text-xs text-gray-500">Location</div>
          </div>
          <div className="text-center p-2 bg-white rounded-lg shadow-sm">
            <div className="text-lg font-bold text-indigo-600">{student.codingRating}/5</div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
        </div>

        {/* Skills Radar Chart */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-700">Skills Profile</h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSkillsRadar(!showSkillsRadar)}
              className="text-xs"
              data-testid={`button-toggle-radar-${student.id}`}
            >
              {showSkillsRadar ? 'Hide' : 'Show'} Radar
            </Button>
          </div>

          {showSkillsRadar ? (
            <div className="h-48 bg-white rounded-lg p-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillsRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" fontSize={10} />
                  <PolarRadiusAxis domain={[0, 100]} tickCount={5} fontSize={8} />
                  <Radar
                    name="Skills"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1">
              {student.skills?.slice(0, 4).map((skillWithData, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                  {skillWithData.skill.name}
                </Badge>
              ))}
              {student.skills && student.skills.length > 4 && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  +{student.skills.length - 4} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Location & Salary Fit */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Bengaluru</span>
            <Badge variant="outline" className={`ml-2 text-xs ${
              locationFit >= 80 ? 'text-green-600 border-green-300' : 
              locationFit >= 60 ? 'text-yellow-600 border-yellow-300' : 'text-red-600 border-red-300'
            }`}>
              {locationFit}% fit
            </Badge>
          </div>
          <div className="flex items-center">
            <IndianRupee className="w-4 h-4 mr-1" />
            <span>₹8-12 LPA</span>
            <Badge variant="outline" className={`ml-2 text-xs ${
              salaryFit >= 80 ? 'text-green-600 border-green-300' : 
              salaryFit >= 60 ? 'text-yellow-600 border-yellow-300' : 'text-red-600 border-red-300'
            }`}>
              {salaryFit}% fit
            </Badge>
          </div>
        </div>

        {/* Audit Badges */}
        <div className="space-y-2 mb-4">
          {auditBadges.map((badge, index) => (
            <div key={index} className={`flex items-center text-xs px-3 py-2 rounded-md border ${badge.color}`}>
              <badge.icon className="w-3 h-3 mr-2" />
              <span className="font-medium">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
          <div>
            <Award className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
            <div className="font-semibold">Top 5%</div>
            <div>Performance</div>
          </div>
          <div>
            <Zap className="w-4 h-4 mx-auto mb-1 text-blue-500" />
            <div className="font-semibold">15+ Days</div>
            <div>Practice Streak</div>
          </div>
          <div>
            <Target className="w-4 h-4 mx-auto mb-1 text-green-500" />
            <div className="font-semibold">3 Projects</div>
            <div>Completed</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewProfile}
            className="group-hover:border-blue-500 group-hover:text-blue-600"
            data-testid={`button-view-profile-${student.id}`}
          >
            View Profile
          </Button>
          <Button 
            size="sm" 
            onClick={onShortlist}
            className={isShortlisted 
              ? "bg-green-600 hover:bg-green-700" 
              : "bg-blue-600 hover:bg-blue-700"
            }
            data-testid={`button-shortlist-${student.id}`}
          >
            {isShortlisted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Shortlisted
              </>
            ) : (
              'Shortlist'
            )}
          </Button>
        </div>

        {/* Engagement Signal */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Active 2 hours ago</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>Response time: 4 hours</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}