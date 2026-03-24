import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Target, Brain, Filter, Zap, Users, ChevronDown, X } from "lucide-react";

interface TalentRequirement {
  role: string;
  assessmentCriteria: {
    minDsaScore?: number;
    minCsFundamentalsScore?: number;
    minAptitudeScore?: number;
    minVerbalScore?: number;
    minOverallScore?: number;
  };
  minCGPA: number;
  locations: string[];
  collegePreference: string;
  // Simplified - removed unnecessary fields
  experience: string;
  salaryRange: [number, number];
  urgency: string;
  teamSize: number;
  workMode: string;
  // For backward compatibility
  skills?: string[];
}

interface TalentDiscoveryFiltersProps {
  onApplyFilters: (requirement: TalentRequirement) => void;
  onAutoSuggest: (requirement: TalentRequirement) => void;
  totalStudents: number;
  onClose?: () => void;
  isLoading?: boolean;
}

export function TalentDiscoveryFilters({ 
  onApplyFilters, 
  onAutoSuggest, 
  totalStudents,
  onClose,
  isLoading = false
}: TalentDiscoveryFiltersProps) {
  const [requirement, setRequirement] = useState<TalentRequirement>({
    role: "",
    assessmentCriteria: {
      minOverallScore: 70, // Default minimum overall score
    },
    minCGPA: 7.0,
    locations: [],
    collegePreference: "any",
    // Set defaults for required fields that aren't shown in UI
    experience: "0-1", // Default to fresher level
    salaryRange: [6, 15], // Reasonable default range
    urgency: "normal", // Default urgency
    teamSize: 5, // Default team size
    workMode: "hybrid", // Default work mode
    skills: [] // For backward compatibility
  });

  const handleSubmit = (action: (requirement: TalentRequirement) => void) => {
    if (!requirement.role.trim()) {
      return;
    }
    
    // Convert assessment criteria to the format expected by backend
    const processedRequirement = {
      ...requirement,
      // Keep skills as empty array for backward compatibility
      skills: [],
      // Pass assessment criteria for new filtering logic
      assessmentCriteria: requirement.assessmentCriteria
    };
    
    action(processedRequirement);
  };

  const [showAdvancedAssessment, setShowAdvancedAssessment] = useState(false);

  const assessmentCategories = [
    { key: 'DsaScore', label: 'Data Structures & Algorithms', min: 0, max: 100 },
    { key: 'CsFundamentalsScore', label: 'CS Fundamentals', min: 0, max: 100 },
    { key: 'AptitudeScore', label: 'Logical & Quantitative Aptitude', min: 0, max: 100 },
    { key: 'VerbalScore', label: 'Verbal Communication', min: 0, max: 100 },
  ];

  const indianCities = [
    "Bangalore", "Mumbai", "Delhi", "Pune", "Chennai", "Hyderabad", 
    "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Indore", "Nagpur"
  ];

  const handleAssessmentCriteriaChange = (key: string, value: number | undefined) => {
    setRequirement(prev => ({
      ...prev,
      assessmentCriteria: {
        ...prev.assessmentCriteria,
        [`min${key}`]: value
      } as any
    }));
  };

  const handleLocationToggle = (location: string) => {
    setRequirement(prev => ({
      ...prev,
      locations: prev.locations.includes(location)
        ? prev.locations.filter(loc => loc !== location)
        : [...prev.locations, location]
    }));
  };

  const calculateExpectedMatches = () => {
    let baseMatches = totalStudents;
    
    // Apply filters to estimate matches
    if (requirement.minCGPA > 7.5) baseMatches *= 0.4;
    else if (requirement.minCGPA > 8.0) baseMatches *= 0.25;
    else if (requirement.minCGPA > 8.5) baseMatches *= 0.15;
    
    if (requirement.collegePreference === "iit-nit-only") baseMatches *= 0.08;
    else if (requirement.collegePreference === "tier1-plus") baseMatches *= 0.25;
    
    // Assessment-based filtering
    if (requirement.assessmentCriteria.minOverallScore && requirement.assessmentCriteria.minOverallScore > 85) baseMatches *= 0.2;
    else if (requirement.assessmentCriteria.minOverallScore && requirement.assessmentCriteria.minOverallScore > 75) baseMatches *= 0.4;
    
    if (requirement.locations.length < 3) baseMatches *= 0.4;
    
    return Math.max(1, Math.floor(baseMatches));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
        <Card className="border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-600" />
                <CardTitle className="text-xl font-bold">Smart Talent Discovery</CardTitle>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{totalStudents.toLocaleString()} profiles available</span>
                </div>
                {onClose && (
                  <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-filters">
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Define your requirements and get auto-curated top 50 candidates instead of browsing {totalStudents.toLocaleString()}+ profiles
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Job Role */}
            <div className="space-y-2">
              <Label htmlFor="role">Job Role/Position *</Label>
              <Input
                id="role"
                placeholder="e.g., Software Engineer, Data Scientist, Full Stack Developer"
                value={requirement.role}
                onChange={(e) => setRequirement(prev => ({ ...prev, role: e.target.value }))}
                data-testid="input-role"
                className="text-base"
              />
            </div>

            {/* Assessment Criteria */}
            <div className="space-y-4">
              <Label>Assessment Requirements *</Label>
              <p className="text-sm text-gray-600">Set minimum scores for standardized assessments (0-100 scale)</p>
              
              {/* Overall Score - Always Shown */}
              <div className="space-y-3">
                <Label>Minimum Overall Assessment Score: {requirement.assessmentCriteria.minOverallScore || 70}</Label>
                <Slider
                  value={[requirement.assessmentCriteria.minOverallScore || 70]}
                  onValueChange={([value]) => handleAssessmentCriteriaChange('OverallScore', value)}
                  min={50}
                  max={100}
                  step={5}
                  className="w-full"
                  data-testid="slider-min-overall-score"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>50 (Minimum)</span>
                  <span>100 (Excellent)</span>
                </div>
              </div>

              {/* Advanced Assessment Breakdown */}
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedAssessment(!showAdvancedAssessment)}
                  className="text-sm"
                  data-testid="button-toggle-advanced-assessment"
                >
                  {showAdvancedAssessment ? 'Hide' : 'Show'} Individual Category Requirements
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showAdvancedAssessment ? 'rotate-180' : ''}`} />
                </Button>
                
                {showAdvancedAssessment && (
                  <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    {assessmentCategories.map(category => {
                      const currentValue = requirement.assessmentCriteria[`min${category.key}`] || 0;
                      return (
                        <div key={category.key} className="space-y-2">
                          <Label className="text-sm">{category.label}: {currentValue > 0 ? currentValue : 'No minimum'}</Label>
                          <Slider
                            value={[currentValue]}
                            onValueChange={([value]) => handleAssessmentCriteriaChange(category.key, value > 0 ? value : undefined)}
                            min={0}
                            max={100}
                            step={5}
                            className="w-full"
                            data-testid={`slider-${category.key.toLowerCase()}`}
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>0 (No minimum)</span>
                            <span>100 (Excellent)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Minimum CGPA */}
            <div className="space-y-3">
              <Label>Minimum CGPA: {requirement.minCGPA}</Label>
              <Slider
                value={[requirement.minCGPA]}
                onValueChange={([value]) => setRequirement(prev => ({ ...prev, minCGPA: value }))}
                min={6.0}
                max={10.0}
                step={0.1}
                className="w-full"
                data-testid="slider-min-cgpa"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>6.0 (Minimum)</span>
                <span>10.0 (Maximum)</span>
              </div>
            </div>

            {/* College Preference */}
            <div className="space-y-2">
              <Label>College Tier Preference</Label>
              <Select 
                value={requirement.collegePreference} 
                onValueChange={(value) => setRequirement(prev => ({ ...prev, collegePreference: value }))}
              >
                <SelectTrigger data-testid="select-college-preference">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any College</SelectItem>
                  <SelectItem value="tier1-plus">Tier 1+ Colleges (IITs, NITs, Top Private)</SelectItem>
                  <SelectItem value="iit-nit-only">IITs & NITs Only</SelectItem>
                  <SelectItem value="iit-only">IITs Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Location Preferences */}
            <div className="space-y-3">
              <Label>Preferred Locations (Optional)</Label>
              <div className="grid grid-cols-3 gap-2">
                {indianCities.slice(0, 9).map(city => (
                  <div key={city} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${city}`}
                      checked={requirement.locations.includes(city)}
                      onCheckedChange={() => handleLocationToggle(city)}
                      data-testid={`checkbox-location-${city.toLowerCase()}`}
                    />
                    <Label
                      htmlFor={`location-${city}`}
                      className="text-sm cursor-pointer"
                    >
                      {city}
                    </Label>
                  </div>
                ))}
              </div>
              {requirement.locations.length === 0 && (
                <p className="text-xs text-gray-500">Leave blank to include all locations</p>
              )}
            </div>


            {/* Expected Matches Preview */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-900 dark:text-blue-100">Expected Matches</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    ~{calculateExpectedMatches().toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600">candidates</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleSubmit(onApplyFilters)}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50"
                data-testid="button-apply-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              
              <Button
                onClick={() => handleSubmit(onAutoSuggest)}
                disabled={isLoading || !requirement.role.trim()}
                className="bg-violet-600 hover:bg-violet-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="button-auto-suggest"
                title={!requirement.role.trim() ? "Please enter a role first" : "Get AI-curated top 50 candidates"}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    AI Matching...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Smart Suggest Top 50
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                🧠 AI-powered matching based on standardized assessments: DSA, CS Fundamentals, Aptitude & Communication
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TalentDiscoveryFilters;