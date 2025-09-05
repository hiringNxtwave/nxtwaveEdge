import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Target, Brain, Filter, Zap, Users, X } from "lucide-react";

interface TalentRequirement {
  role: string;
  experience: string;
  skills: string[];
  minCGPA: number;
  salaryRange: [number, number];
  locations: string[];
  collegePreference: string;
  urgency: string;
  teamSize: number;
  workMode: string;
}

interface TalentDiscoveryFiltersProps {
  onApplyFilters: (requirement: TalentRequirement) => void;
  onAutoSuggest: (requirement: TalentRequirement) => void;
  totalStudents: number;
  onClose?: () => void;
}

export function TalentDiscoveryFilters({ 
  onApplyFilters, 
  onAutoSuggest, 
  totalStudents,
  onClose
}: TalentDiscoveryFiltersProps) {
  const [requirement, setRequirement] = useState<TalentRequirement>({
    role: "",
    experience: "0-1",
    skills: [],
    minCGPA: 7.0,
    salaryRange: [6, 15],
    locations: [],
    collegePreference: "any",
    urgency: "normal",
    teamSize: 5,
    workMode: "hybrid"
  });

  const [skillInput, setSkillInput] = useState("");

  const popularSkills = [
    "JavaScript", "Python", "Java", "React", "Node.js", "Angular", "Vue.js",
    "Django", "Spring Boot", "MySQL", "PostgreSQL", "MongoDB", "AWS", "Docker",
    "Machine Learning", "Data Structures", "Algorithms", "System Design"
  ];

  const indianCities = [
    "Bangalore", "Mumbai", "Delhi", "Pune", "Chennai", "Hyderabad", 
    "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Indore", "Nagpur"
  ];

  const handleSkillAdd = (skill: string) => {
    if (skill && !requirement.skills.includes(skill)) {
      setRequirement(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
      setSkillInput("");
    }
  };

  const handleSkillRemove = (skillToRemove: string) => {
    setRequirement(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
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
    
    if (requirement.skills.length > 5) baseMatches *= 0.3;
    else if (requirement.skills.length > 3) baseMatches *= 0.6;
    
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
            {/* Role and Experience */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role/Position</Label>
                <Input
                  id="role"
                  placeholder="e.g., Software Engineer, Data Scientist"
                  value={requirement.role}
                  onChange={(e) => setRequirement(prev => ({ ...prev, role: e.target.value }))}
                  data-testid="input-role"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select 
                  value={requirement.experience} 
                  onValueChange={(value) => setRequirement(prev => ({ ...prev, experience: value }))}
                >
                  <SelectTrigger data-testid="select-experience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Fresher (0-1 years)</SelectItem>
                    <SelectItem value="1-2">Junior (1-2 years)</SelectItem>
                    <SelectItem value="2-3">Mid-level (2-3 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Skills Selection */}
            <div className="space-y-3">
              <Label>Required Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Type skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSkillAdd(skillInput);
                    }
                  }}
                  data-testid="input-skills"
                />
                <Button 
                  onClick={() => handleSkillAdd(skillInput)}
                  variant="outline"
                  data-testid="button-add-skill"
                >
                  Add
                </Button>
              </div>
              
              {/* Popular Skills Quick Add */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Quick Add Popular Skills:</Label>
                <div className="flex flex-wrap gap-1">
                  {popularSkills.slice(0, 12).map(skill => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className={`cursor-pointer hover:bg-blue-100 text-xs ${
                        requirement.skills.includes(skill) ? 'bg-blue-100 border-blue-300' : ''
                      }`}
                      onClick={() => handleSkillAdd(skill)}
                      data-testid={`badge-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Selected Skills */}
              {requirement.skills.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600">Selected Skills:</Label>
                  <div className="flex flex-wrap gap-1">
                    {requirement.skills.map(skill => (
                      <Badge
                        key={skill}
                        className="bg-blue-600 text-white cursor-pointer hover:bg-blue-700"
                        onClick={() => handleSkillRemove(skill)}
                        data-testid={`badge-selected-skill-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {skill} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CGPA and Salary Range */}
            <div className="grid grid-cols-2 gap-6">
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
                  <span>6.0</span>
                  <span>10.0</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label>Salary Range: ₹{requirement.salaryRange[0]} - {requirement.salaryRange[1]} LPA</Label>
                <Slider
                  value={requirement.salaryRange}
                  onValueChange={(value) => setRequirement(prev => ({ ...prev, salaryRange: value as [number, number] }))}
                  min={3}
                  max={50}
                  step={1}
                  className="w-full"
                  data-testid="slider-salary-range"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹3 LPA</span>
                  <span>₹50 LPA</span>
                </div>
              </div>
            </div>

            {/* College Preference and Work Mode */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>College Preference</Label>
                <Select 
                  value={requirement.collegePreference} 
                  onValueChange={(value) => setRequirement(prev => ({ ...prev, collegePreference: value }))}
                >
                  <SelectTrigger data-testid="select-college-preference">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any College</SelectItem>
                    <SelectItem value="tier1-plus">Tier 1+ (IITs, NITs, Top Private)</SelectItem>
                    <SelectItem value="iit-nit-only">IITs & NITs Only</SelectItem>
                    <SelectItem value="iit-only">IITs Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Work Mode</Label>
                <Select 
                  value={requirement.workMode} 
                  onValueChange={(value) => setRequirement(prev => ({ ...prev, workMode: value }))}
                >
                  <SelectTrigger data-testid="select-work-mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Preferences */}
            <div className="space-y-3">
              <Label>Preferred Locations</Label>
              <div className="grid grid-cols-4 gap-2">
                {indianCities.map(city => (
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
            </div>

            {/* Urgency and Team Size */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hiring Urgency</Label>
                <Select 
                  value={requirement.urgency} 
                  onValueChange={(value) => setRequirement(prev => ({ ...prev, urgency: value }))}
                >
                  <SelectTrigger data-testid="select-urgency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (3+ months)</SelectItem>
                    <SelectItem value="normal">Normal (1-3 months)</SelectItem>
                    <SelectItem value="high">High (2-4 weeks)</SelectItem>
                    <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Team Size to Hire</Label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={requirement.teamSize}
                  onChange={(e) => setRequirement(prev => ({ ...prev, teamSize: parseInt(e.target.value) || 1 }))}
                  data-testid="input-team-size"
                />
              </div>
            </div>

            {/* Expected Matches Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200">
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
                onClick={() => onApplyFilters(requirement)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                data-testid="button-apply-filters"
              >
                <Filter className="w-4 h-4 mr-2" />
                Apply Filters
              </Button>
              
              <Button
                onClick={() => onAutoSuggest(requirement)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                data-testid="button-auto-suggest"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Smart Suggest Top 50
              </Button>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                🧠 AI-powered matching considers skills, college reputation, performance scores, and cultural fit
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TalentDiscoveryFilters;