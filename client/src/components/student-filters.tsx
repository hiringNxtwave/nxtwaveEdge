import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

interface FilterState {
  university: string;
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
    <div className="flex items-center gap-4">
      {/* University Filter */}
      <div className="space-y-1">
        <Label htmlFor="university-select" className="text-xs font-medium text-gray-600 dark:text-gray-400">University</Label>
        <Select 
          value={filters.university} 
          onValueChange={(value) => handleFilterChange('university', value)}
        >
          <SelectTrigger id="university-select" data-testid="select-university" className="h-9 text-sm w-40">
            <SelectValue placeholder="All Universities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Universities</SelectItem>
            <SelectItem value="IIT Delhi">IIT Delhi</SelectItem>
            <SelectItem value="IIT Bombay">IIT Bombay</SelectItem>
            <SelectItem value="IIT Madras">IIT Madras</SelectItem>
            <SelectItem value="BITS Pilani">BITS Pilani</SelectItem>
            <SelectItem value="NIT Trichy">NIT Trichy</SelectItem>
            <SelectItem value="NIT Warangal">NIT Warangal</SelectItem>
            <SelectItem value="IIIT Hyderabad">IIIT Hyderabad</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Rating Filter */}
      <div className="space-y-1">
        <Label htmlFor="coding-rating-select" className="text-xs font-medium text-gray-600 dark:text-gray-400">Min Rating</Label>
        <Select 
          value={filters.codingRating} 
          onValueChange={(value) => handleFilterChange('codingRating', value)}
        >
          <SelectTrigger id="coding-rating-select" data-testid="select-coding-rating" className="h-9 text-sm w-32">
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
      <Button onClick={onSearch} data-testid="button-search" className="h-9 px-4 bg-blue-600 hover:bg-blue-700 mt-5">
        <Search className="w-4 h-4 mr-1" />
        Apply
      </Button>
    </div>
  );
}
