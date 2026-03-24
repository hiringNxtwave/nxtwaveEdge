import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SlidersHorizontal } from "lucide-react";

interface FilterState {
  university: string;
  codingRating: string;
}

interface StudentFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  skills?: any[];
  resultCount?: number;
  totalCount?: number;
}

export default function StudentFilters({
  filters,
  onFiltersChange,
  resultCount = 0,
  totalCount = 0,
}: StudentFiltersProps) {

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const isFiltered = filters.university !== "all" || filters.codingRating !== "all";

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left: label + result count */}
      <div className="flex items-center gap-2 min-w-0">
        <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="text-sm font-medium text-slate-700">
          Filters
        </span>
        {isFiltered && (
          <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
            Active
          </span>
        )}
      </div>

      {/* Right: filter controls */}
      <div className="flex items-center gap-3">
        {/* University Filter */}
        <div className="flex items-center gap-2">
          <Label htmlFor="university-select" className="text-xs font-medium text-slate-500 whitespace-nowrap">
            University
          </Label>
          <Select
            value={filters.university}
            onValueChange={(value) => handleFilterChange("university", value)}
          >
            <SelectTrigger
              id="university-select"
              data-testid="select-university"
              className="h-8 text-sm w-44 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-300"
            >
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

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200" />

        {/* Rating Filter */}
        <div className="flex items-center gap-2">
          <Label htmlFor="coding-rating-select" className="text-xs font-medium text-slate-500 whitespace-nowrap">
            Min Rating
          </Label>
          <Select
            value={filters.codingRating}
            onValueChange={(value) => handleFilterChange("codingRating", value)}
          >
            <SelectTrigger
              id="coding-rating-select"
              data-testid="select-coding-rating"
              className="h-8 text-sm w-32 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-300"
            >
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="1">★ 1+</SelectItem>
              <SelectItem value="2">★★ 2+</SelectItem>
              <SelectItem value="3">★★★ 3+</SelectItem>
              <SelectItem value="4">★★★★ 4+</SelectItem>
              <SelectItem value="5">★★★★★ 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
