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
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="space-y-2">
            <Label htmlFor="skills-select" className="text-sm font-medium text-foreground">Skills</Label>
            <Select 
              value={filters.skills} 
              onValueChange={(value) => handleFilterChange('skills', value)}
            >
              <SelectTrigger id="skills-select" data-testid="select-skills">
                <SelectValue placeholder="Select Skills" />
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
          
          <div className="space-y-2">
            <Label htmlFor="location-select" className="text-sm font-medium text-foreground">Location</Label>
            <Select 
              value={filters.location} 
              onValueChange={(value) => handleFilterChange('location', value)}
            >
              <SelectTrigger id="location-select" data-testid="select-location">
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
          
          <div className="space-y-2">
            <Label htmlFor="university-select" className="text-sm font-medium text-foreground">University</Label>
            <Select 
              value={filters.university} 
              onValueChange={(value) => handleFilterChange('university', value)}
            >
              <SelectTrigger id="university-select" data-testid="select-university">
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
          
          <div className="space-y-2">
            <Label htmlFor="min-cgpa-select" className="text-sm font-medium text-foreground">Min CGPA</Label>
            <Select 
              value={filters.minCgpa} 
              onValueChange={(value) => handleFilterChange('minCgpa', value)}
            >
              <SelectTrigger id="min-cgpa-select" data-testid="select-min-cgpa">
                <SelectValue placeholder="Min CGPA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="7.0">7.0+</SelectItem>
                <SelectItem value="7.5">7.5+</SelectItem>
                <SelectItem value="8.0">8.0+</SelectItem>
                <SelectItem value="8.5">8.5+</SelectItem>
                <SelectItem value="9.0">9.0+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="max-cgpa-select" className="text-sm font-medium text-foreground">Max CGPA</Label>
            <Select 
              value={filters.maxCgpa} 
              onValueChange={(value) => handleFilterChange('maxCgpa', value)}
            >
              <SelectTrigger id="max-cgpa-select" data-testid="select-max-cgpa">
                <SelectValue placeholder="Max CGPA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any</SelectItem>
                <SelectItem value="7.5">7.5</SelectItem>
                <SelectItem value="8.0">8.0</SelectItem>
                <SelectItem value="8.5">8.5</SelectItem>
                <SelectItem value="9.0">9.0</SelectItem>
                <SelectItem value="9.5">9.5</SelectItem>
                <SelectItem value="10.0">10.0</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coding-rating-select" className="text-sm font-medium text-foreground">Coding Rating</Label>
            <Select 
              value={filters.codingRating} 
              onValueChange={(value) => handleFilterChange('codingRating', value)}
            >
              <SelectTrigger id="coding-rating-select" data-testid="select-coding-rating">
                <SelectValue placeholder="⭐ Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Rating</SelectItem>
                <SelectItem value="1">⭐ (1 star)</SelectItem>
                <SelectItem value="2">⭐⭐ (2 stars)</SelectItem>
                <SelectItem value="3">⭐⭐⭐ (3 stars)</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ (4 stars)</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ (5 stars)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-muted-foreground" data-testid="text-results-count">
            Showing <span className="font-semibold">{resultCount}</span> of <span className="font-semibold">{totalCount}</span> students
          </p>
          <Button onClick={onSearch} data-testid="button-search">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
