import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface FilterState {
  skills: string;
  location: string;
  university: string;
  minCgpa: string;
  maxCgpa: string;
  codingRating: string;
}

interface StudentFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSearch: () => void;
  skills?: any[];
  resultCount?: number;
  totalCount?: number;
}

export default function StudentFilters({ 
  filters, 
  onFiltersChange, 
  onSearch,
  skills = [],
  resultCount = 0, 
  totalCount = 0 
}: StudentFiltersProps) {
  
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card className="mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* Skills */}
          <div className="space-y-1 min-w-[140px]">
            <Label htmlFor="skills-select" className="text-xs font-medium text-gray-600 dark:text-gray-400">Skills</Label>
            <Select 
              value={filters.skills} 
              onValueChange={(value) => handleFilterChange('skills', value)}
            >
              <SelectTrigger id="skills-select" data-testid="select-skills" className="h-8 text-sm">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
                <SelectItem value="React">React</SelectItem>
                <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="AWS">AWS</SelectItem>
                <SelectItem value="Angular">Angular</SelectItem>
                <SelectItem value="Node.js">Node.js</SelectItem>
                <SelectItem value="TypeScript">TypeScript</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Location */}
          <div className="space-y-1 min-w-[120px]">
            <Label htmlFor="location-select" className="text-xs font-medium text-gray-600 dark:text-gray-400">Location</Label>
            <Select 
              value={filters.location} 
              onValueChange={(value) => handleFilterChange('location', value)}
            >
              <SelectTrigger id="location-select" data-testid="select-location" className="h-8 text-sm">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                <SelectItem value="Pune">Pune</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* University */}
          <div className="space-y-1 min-w-[140px]">
            <Label htmlFor="university-select" className="text-xs font-medium text-gray-600 dark:text-gray-400">University</Label>
            <Select 
              value={filters.university} 
              onValueChange={(value) => handleFilterChange('university', value)}
            >
              <SelectTrigger id="university-select" data-testid="select-university" className="h-8 text-sm">
                <SelectValue placeholder="All Universities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                <SelectItem value="IIT Delhi">IIT Delhi</SelectItem>
                <SelectItem value="IIT Bombay">IIT Bombay</SelectItem>
                <SelectItem value="IIT Bangalore">IIT Bangalore</SelectItem>
                <SelectItem value="BITS Pilani">BITS Pilani</SelectItem>
                <SelectItem value="NIT Trichy">NIT Trichy</SelectItem>
                <SelectItem value="NIT Warangal">NIT Warangal</SelectItem>
                <SelectItem value="IIIT Hyderabad">IIIT Hyderabad</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* CGPA Range */}
          <div className="space-y-1 min-w-[100px]">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-400">CGPA Range</Label>
            <div className="flex items-center space-x-1">
              <Select 
                value={filters.minCgpa} 
                onValueChange={(value) => handleFilterChange('minCgpa', value)}
              >
                <SelectTrigger data-testid="select-min-cgpa" className="h-8 text-xs w-16">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="7.0">7.0</SelectItem>
                  <SelectItem value="7.5">7.5</SelectItem>
                  <SelectItem value="8.0">8.0</SelectItem>
                  <SelectItem value="8.5">8.5</SelectItem>
                  <SelectItem value="9.0">9.0</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs text-gray-400">-</span>
              <Select 
                value={filters.maxCgpa} 
                onValueChange={(value) => handleFilterChange('maxCgpa', value)}
              >
                <SelectTrigger data-testid="select-max-cgpa" className="h-8 text-xs w-16">
                  <SelectValue placeholder="Max" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="8.0">8.0</SelectItem>
                  <SelectItem value="8.5">8.5</SelectItem>
                  <SelectItem value="9.0">9.0</SelectItem>
                  <SelectItem value="9.5">9.5</SelectItem>
                  <SelectItem value="10.0">10.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Rating */}
          <div className="space-y-1 min-w-[100px]">
            <Label htmlFor="coding-rating-select" className="text-xs font-medium text-gray-600 dark:text-gray-400">Min Rating</Label>
            <Select 
              value={filters.codingRating} 
              onValueChange={(value) => handleFilterChange('codingRating', value)}
            >
              <SelectTrigger id="coding-rating-select" data-testid="select-coding-rating" className="h-8 text-sm">
                <SelectValue placeholder="⭐ Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="1">⭐ 1+</SelectItem>
                <SelectItem value="2">⭐⭐ 2+</SelectItem>
                <SelectItem value="3">⭐⭐⭐ 3+</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ 4+</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Search Button */}
          <Button onClick={onSearch} data-testid="button-search" className="h-8 px-4 bg-blue-600 hover:bg-blue-700">
            <Search className="w-4 h-4 mr-1" />
            Search
          </Button>
          
          {/* Results Count */}
          <div className="ml-auto">
            <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md" data-testid="text-results-count">
              <span className="font-semibold text-blue-600 dark:text-blue-400">{resultCount}</span> of <span className="font-semibold">{totalCount}</span> students
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
