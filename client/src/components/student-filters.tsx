import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterState {
  university: string;
  recommendation: string;
}

interface StudentFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  skills?: any[];
  resultCount?: number;
  totalCount?: number;
}

export default function StudentFilters({ filters, onFiltersChange }: StudentFiltersProps) {
  const [uniOpen, setUniOpen] = useState(false);
  const [uniSearch, setUniSearch] = useState("");

  const { data: universities = [] } = useQuery<string[]>({
    queryKey: ["/api/universities"],
    queryFn: async () => {
      const res = await fetch("/api/universities", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch universities");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const filteredUnis = universities.filter((u) =>
    u.toLowerCase().includes(uniSearch.toLowerCase())
  );

  const selectedUniLabel =
    filters.university && filters.university !== "all"
      ? universities.find((u) => u === filters.university) || filters.university
      : null;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* University — searchable combobox */}
      <div className="flex items-center gap-2">
        <Label className="text-xs font-medium text-slate-500 whitespace-nowrap">
          University
        </Label>
        <Popover open={uniOpen} onOpenChange={setUniOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={uniOpen}
              data-testid="select-university"
              className={cn(
                "h-8 text-sm w-52 justify-between border-slate-200 bg-slate-50 hover:bg-white font-normal",
                selectedUniLabel ? "text-slate-900" : "text-slate-400"
              )}
            >
              <span className="truncate">
                {selectedUniLabel || "All Universities"}
              </span>
              <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-slate-400 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-0" align="start">
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <Input
                  placeholder="Search university..."
                  value={uniSearch}
                  onChange={(e) => setUniSearch(e.target.value)}
                  className="h-8 text-sm pl-8 border-slate-200"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto p-1">
              {/* All Universities option */}
              <button
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-slate-50 text-left",
                  !filters.university || filters.university === "all"
                    ? "text-blue-700 font-semibold"
                    : "text-slate-700"
                )}
                onClick={() => {
                  onFiltersChange({ ...filters, university: "all" });
                  setUniOpen(false);
                  setUniSearch("");
                }}
              >
                <Check
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    !filters.university || filters.university === "all"
                      ? "text-blue-600 opacity-100"
                      : "opacity-0"
                  )}
                />
                All Universities
              </button>

              {filteredUnis.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-4">No matches found</p>
              ) : (
                filteredUnis.map((uni) => (
                  <button
                    key={uni}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded text-sm hover:bg-slate-50 text-left",
                      filters.university === uni
                        ? "text-blue-700 font-semibold"
                        : "text-slate-700"
                    )}
                    onClick={() => {
                      onFiltersChange({ ...filters, university: uni });
                      setUniOpen(false);
                      setUniSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "h-3.5 w-3.5 shrink-0",
                        filters.university === uni ? "text-blue-600 opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{uni}</span>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-slate-200" />

      {/* Recommendation filter */}
      <div className="flex items-center gap-2">
        <Label htmlFor="recommendation-select" className="text-xs font-medium text-slate-500 whitespace-nowrap">
          Verdict
        </Label>
        <Select
          value={filters.recommendation}
          onValueChange={(value) => onFiltersChange({ ...filters, recommendation: value })}
        >
          <SelectTrigger
            id="recommendation-select"
            data-testid="select-recommendation"
            className="h-8 text-sm w-36 border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-300"
          >
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verdicts</SelectItem>
            <SelectItem value="Strong Hire">⭐ Strong Hire</SelectItem>
            <SelectItem value="Hire">✓ Hire</SelectItem>
            <SelectItem value="Weak Hire">~ Weak Hire</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
