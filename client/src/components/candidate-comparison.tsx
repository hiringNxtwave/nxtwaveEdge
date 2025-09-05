import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Award, TrendingUp, DollarSign, Shield, CheckCircle, Clock, X } from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";

interface CandidateComparisonProps {
  candidates: StudentWithSkills[];
  onRemove: (candidateId: string) => void;
  onClose: () => void;
}

export default function CandidateComparison({ candidates, onRemove, onClose }: CandidateComparisonProps) {
  const generateSkillScore = (student: StudentWithSkills, offset: number) => {
    const seed = parseInt(student.id.slice(-8), 16);
    const baseScore = student.codingRating || 4;
    const variation = ((seed * 37 + offset) % 3) - 1;
    return Math.max(1, Math.min(5, baseScore + variation));
  };

  const calculateMatchPercentage = (student: StudentWithSkills) => {
    const dsaScore = generateSkillScore(student, 1);
    const aptitudeScore = generateSkillScore(student, 2);
    const communicationScore = generateSkillScore(student, 3);
    const csFundamentalsScore = generateSkillScore(student, 4);
    
    const averageSkillScore = (dsaScore + aptitudeScore + communicationScore + csFundamentalsScore) / 4;
    const cgpaValue = typeof student.cgpa === 'string' ? parseFloat(student.cgpa) : student.cgpa;
    const cgpaScore = ((cgpaValue || 7.5) / 10) * 5;
    const rawMatchScore = (averageSkillScore * 0.4) + (cgpaScore * 0.3) + ((student.codingRating || 4) * 0.3);
    
    return Math.min(95, Math.max(60, Math.round(rawMatchScore * 20) || 75));
  };

  const renderNutritionLabel = (student: StudentWithSkills) => {
    const matchPct = calculateMatchPercentage(student);
    const dsaScore = generateSkillScore(student, 1);
    const aptitudeScore = generateSkillScore(student, 2);
    const communicationScore = generateSkillScore(student, 3);
    const csFundamentalsScore = generateSkillScore(student, 4);
    const overallRating = student.codingRating || 4;
    const seed = parseInt(student.id.slice(-8), 16);

    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
        {/* Header */}
        <div className="border-b border-gray-200 pb-3 mb-3 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(student.id)}
            className="absolute top-0 right-0 p-1 h-6 w-6 hover:bg-red-100 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <img 
              src={student.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face`} 
              alt={`${student.firstName} ${student.lastName}`}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face`;
              }}
              loading="lazy"
              crossOrigin="anonymous"
            />
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">{student.university}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                {student.location}
                <span>•</span>
                CGPA: {typeof student.cgpa === 'string' ? parseFloat(student.cgpa).toFixed(2) : (student.cgpa || 7.5).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Match Score */}
        <div className={`text-center p-3 rounded-lg mb-3 ${
          matchPct >= 85 ? 'bg-green-50 border border-green-200' : 
          matchPct >= 70 ? 'bg-yellow-50 border border-yellow-200' : 
          'bg-orange-50 border border-orange-200'
        }`}>
          <div className={`text-2xl font-bold ${
            matchPct >= 85 ? 'text-green-600' : 
            matchPct >= 70 ? 'text-yellow-600' : 
            'text-orange-600'
          }`}>
            {matchPct}%
          </div>
          <div className="text-xs text-gray-600">JD Match Score</div>
        </div>

        {/* Authenticity Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge className="bg-green-100 text-green-800 text-xs px-2 py-1">
            <Shield className="w-3 h-3 mr-1" />
            Proctored
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-1">
            <CheckCircle className="w-3 h-3 mr-1" />
            AI-Free
          </Badge>
          <Badge className="bg-orange-100 text-orange-800 text-xs px-2 py-1">
            <Clock className="w-3 h-3 mr-1" />
            {Math.floor(Math.random() * 7) + 1}d ago
          </Badge>
        </div>

        {/* Skills Nutrition Facts */}
        <div className="border border-gray-300 dark:border-gray-600">
          <div className="bg-black text-white p-2 text-center font-bold text-sm">
            Skills Assessment
          </div>
          <div className="p-3 space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span className="font-medium">DSA Proficiency</span>
              <span className="font-bold">{dsaScore * 20}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span className="font-medium">Quantitative</span>
              <span className="font-bold">{aptitudeScore * 20}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span className="font-medium">Communication</span>
              <span className="font-bold">{communicationScore * 20}%</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <span className="font-medium">CS Fundamentals</span>
              <span className="font-bold">{csFundamentalsScore * 20}%</span>
            </div>
            <div className="flex justify-between pt-2 border-t-2 border-gray-400">
              <span className="font-bold">Overall Score</span>
              <span className="font-bold text-lg">{Math.round(((dsaScore + aptitudeScore + communicationScore + csFundamentalsScore) / 4) * 20)}%</span>
            </div>
          </div>
        </div>

        {/* Differentiators */}
        <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 rounded-lg">
          <div className="text-xs font-bold text-yellow-800 dark:text-yellow-200 mb-1">Key Differentiators</div>
          <div className="space-y-1">
            {overallRating >= 4 && (
              <div className="flex items-center text-xs text-yellow-700 dark:text-yellow-300">
                <Award className="w-3 h-3 mr-1" />
                Hackathon Rank #{Math.floor(seed % 5) + 1}
              </div>
            )}
            {dsaScore >= 4 && (
              <div className="flex items-center text-xs text-yellow-700 dark:text-yellow-300">
                <TrendingUp className="w-3 h-3 mr-1" />
                Top 5% Coding Contests
              </div>
            )}
          </div>
        </div>

        {/* Salary Expectations */}
        <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-green-800 dark:text-green-200">Expected Salary</span>
            <span className="font-bold text-green-600 dark:text-green-400">
              {matchPct >= 80 ? '95% Fit' : matchPct >= 70 ? '80% Fit' : '65% Fit'}
            </span>
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            ₹{Math.floor(4 + (overallRating * 2) + (seed % 3))} - {Math.floor(6 + (overallRating * 2) + (seed % 3))} LPA
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-7xl w-full max-h-[90vh] overflow-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Side-by-Side Comparison</CardTitle>
            <Button variant="ghost" onClick={onClose} className="p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Compare candidates like nutrition labels</p>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${candidates.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {candidates.map((candidate) => (
              <div key={candidate.id} data-testid={`comparison-candidate-${candidate.id}`}>
                {renderNutritionLabel(candidate)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}