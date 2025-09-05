import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  MapPin, 
  GraduationCap, 
  Brain, 
  Clock, 
  X,
  Search,
  Filter,
  Zap
} from "lucide-react";

interface TalentDiscoveryFiltersProps {
  filters: {
    salaryRange: { min: number; max: number };
    locations: string[];
    graduationYears: number[];
    softTraits: string[];
    assessmentAge: number;
    skills: string[];
    universities: string[];
  };
  onFiltersChange: (filters: any) => void;
  onClose: () => void;
}

export default function TalentDiscoveryFilters({ filters, onFiltersChange, onClose }: TalentDiscoveryFiltersProps) {
  const [tempFilters, setTempFilters] = useState(filters);

  const locations = [
    "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", 
    "Kolkata", "Ahmedabad", "Jaipur", "Indore", "Remote", "Flexible"
  ];

  const graduationYears = [2024, 2023, 2022, 2021, 2020, 2019];

  const softTraits = [
    "Leadership", "Communication", "Problem Solving", "Team Player",
    "Creative Thinking", "Adaptability", "Time Management", "Analytical",
    "Initiative", "Collaboration", "Critical Thinking", "Innovation"
  ];

  const skills = [
    "Problem Solving", "Data Structures", "Algorithms", "Database Management",
    "Machine Learning", "Data Science", "Communication", "Leadership",
    "Team Management", "Project Planning", "Quality Assurance", "Testing"
  ];

  const universities = [
    "IIT Delhi", "IIT Bombay", "IIT Kanpur", "IIT Madras", "IIT Kharagpur",
    "NIT Trichy", "NIT Warangal", "BITS Pilani", "IIIT Hyderabad",
    "DTU", "NSUT", "Other Tier-1", "Other Tier-2"
  ];

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      salaryRange: { min: 0, max: 50 },
      locations: [],
      graduationYears: [],
      softTraits: [],
      assessmentAge: 90,
      skills: [],
      universities: []
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const toggleArrayFilter = (key: string, value: string | number) => {
    const currentArray = tempFilters[key as keyof typeof tempFilters] as any[];
    const newArray = currentArray.includes(value) 
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    setTempFilters({
      ...tempFilters,
      [key]: newArray
    });
  };

  const updateSalaryRange = (range: number[]) => {
    setTempFilters({
      ...tempFilters,
      salaryRange: { min: range[0], max: range[1] }
    });
  };

  const activeFiltersCount = Object.entries(tempFilters).reduce((count, [key, value]) => {
    if (key === 'salaryRange') {
      const salaryRange = value as { min: number; max: number };
      return count + (salaryRange.min > 0 || salaryRange.max < 50 ? 1 : 0);
    }
    return count + (Array.isArray(value) ? value.length : (value !== 90 ? 1 : 0));
  }, 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50">
      <div className="w-96 h-full bg-white shadow-xl overflow-y-auto">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b sticky top-0 bg-white z-10">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-blue-600" />
                Advanced Filters
              </CardTitle>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="mt-1">
                  {activeFiltersCount} active
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} data-testid="button-close-filters">
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-6 pb-20">
            {/* Salary Range */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <DollarSign className="w-4 h-4 text-green-600" />
                Salary Expectations (LPA)
              </Label>
              <div className="px-3">
                <Slider
                  value={[tempFilters.salaryRange.min, tempFilters.salaryRange.max]}
                  onValueChange={updateSalaryRange}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>₹{tempFilters.salaryRange.min} LPA</span>
                  <span>₹{tempFilters.salaryRange.max} LPA</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Locations */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <MapPin className="w-4 h-4 text-blue-600" />
                Location Preferences
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {locations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={tempFilters.locations.includes(location)}
                      onCheckedChange={() => toggleArrayFilter('locations', location)}
                      data-testid={`checkbox-location-${location.toLowerCase()}`}
                    />
                    <label 
                      htmlFor={`location-${location}`} 
                      className="text-sm cursor-pointer"
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Graduation Years */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <GraduationCap className="w-4 h-4 text-purple-600" />
                Graduation Year
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {graduationYears.map((year) => (
                  <div key={year} className="flex items-center space-x-2">
                    <Checkbox
                      id={`year-${year}`}
                      checked={tempFilters.graduationYears.includes(year)}
                      onCheckedChange={() => toggleArrayFilter('graduationYears', year)}
                      data-testid={`checkbox-year-${year}`}
                    />
                    <label 
                      htmlFor={`year-${year}`} 
                      className="text-sm cursor-pointer"
                    >
                      {year}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Soft Traits */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <Brain className="w-4 h-4 text-orange-600" />
                Soft Skills & Traits
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {softTraits.map((trait) => (
                  <div key={trait} className="flex items-center space-x-2">
                    <Checkbox
                      id={`trait-${trait}`}
                      checked={tempFilters.softTraits.includes(trait)}
                      onCheckedChange={() => toggleArrayFilter('softTraits', trait)}
                      data-testid={`checkbox-trait-${trait.toLowerCase().replace(' ', '-')}`}
                    />
                    <label 
                      htmlFor={`trait-${trait}`} 
                      className="text-sm cursor-pointer"
                    >
                      {trait}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Assessment Age */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4 text-red-600" />
                Assessment Freshness
              </Label>
              <div className="space-y-2">
                {[30, 60, 90, 180].map((days) => (
                  <div key={days} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`assessment-${days}`}
                      name="assessmentAge"
                      value={days}
                      checked={tempFilters.assessmentAge === days}
                      onChange={() => setTempFilters({...tempFilters, assessmentAge: days})}
                      className="w-4 h-4"
                      data-testid={`radio-assessment-${days}`}
                    />
                    <label 
                      htmlFor={`assessment-${days}`} 
                      className="text-sm cursor-pointer"
                    >
                      ≤ {days} days old
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Technical Skills */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <Zap className="w-4 h-4 text-yellow-600" />
                Technical Skills
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {skills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill}`}
                      checked={tempFilters.skills.includes(skill)}
                      onCheckedChange={() => toggleArrayFilter('skills', skill)}
                      data-testid={`checkbox-skill-${skill.toLowerCase().replace('.', '')}`}
                    />
                    <label 
                      htmlFor={`skill-${skill}`} 
                      className="text-sm cursor-pointer"
                    >
                      {skill}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Universities */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2 font-semibold">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                University Tier
              </Label>
              <div className="grid grid-cols-1 gap-2">
                {universities.map((university) => (
                  <div key={university} className="flex items-center space-x-2">
                    <Checkbox
                      id={`university-${university}`}
                      checked={tempFilters.universities.includes(university)}
                      onCheckedChange={() => toggleArrayFilter('universities', university)}
                      data-testid={`checkbox-university-${university.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    />
                    <label 
                      htmlFor={`university-${university}`} 
                      className="text-sm cursor-pointer"
                    >
                      {university}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>

          {/* Fixed bottom action buttons */}
          <div className="fixed bottom-0 left-auto right-0 w-96 bg-white border-t p-4 flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleClearFilters}
              className="flex-1"
              data-testid="button-clear-filters"
            >
              Clear All
            </Button>
            <Button 
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              data-testid="button-apply-filters"
            >
              Apply Filters
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}