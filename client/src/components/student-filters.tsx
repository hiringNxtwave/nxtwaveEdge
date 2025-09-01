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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <Label htmlFor="cgpa-select" className="text-sm font-medium text-foreground">CGPA</Label>
            <Select 
              value={filters.minCgpa} 
              onValueChange={(value) => handleFilterChange('minCgpa', value)}
            >
              <SelectTrigger id="cgpa-select" data-testid="select-cgpa">
                <SelectValue placeholder="Any CGPA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any CGPA</SelectItem>
                <SelectItem value="9.0">9.0+</SelectItem>
                <SelectItem value="8.5">8.5+</SelectItem>
                <SelectItem value="8.0">8.0+</SelectItem>
                <SelectItem value="7.5">7.5+</SelectItem>
                <SelectItem value="7.0">7.0+</SelectItem>
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
