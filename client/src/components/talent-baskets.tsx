import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  MapPin, 
  IndianRupee, 
  TrendingUp, 
  Filter,
  Star,
  ChevronRight,
  Target,
  Clock,
  Award
} from "lucide-react";

interface TalentBasket {
  id: string;
  title: string;
  description: string;
  candidateCount: number;
  avgJdMatch: number;
  salaryRange: string;
  location: string;
  topSkills: string[];
  avgOjr: number;
  lastUpdated: string;
  priority: 'high' | 'medium' | 'low';
  roles: string[];
}

interface TalentBasketsProps {
  onSelectBasket: (basket: TalentBasket) => void;
}

export default function TalentBaskets({ onSelectBasket }: TalentBasketsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // Mock curated baskets data
  const talentBaskets: TalentBasket[] = [
    {
      id: "basket_1",
      title: "Top 20 Backend Engineers",
      description: "High-performing backend developers with strong system design skills",
      candidateCount: 20,
      avgJdMatch: 92,
      salaryRange: "₹10–12 LPA",
      location: "Bengaluru",
      topSkills: ["Node.js", "Python", "AWS", "MongoDB"],
      avgOjr: 78,
      lastUpdated: "2 hours ago",
      priority: "high",
      roles: ["Backend Engineer", "Software Engineer"]
    },
    {
      id: "basket_2", 
      title: "15 Data Engineers with 90% JD Match",
      description: "Data pipeline experts with proven analytics experience",
      candidateCount: 15,
      avgJdMatch: 90,
      salaryRange: "₹12–15 LPA",
      location: "Hyderabad",
      topSkills: ["Spark", "Kafka", "Python", "SQL"],
      avgOjr: 82,
      lastUpdated: "4 hours ago",
      priority: "high",
      roles: ["Data Engineer", "Analytics Engineer"]
    },
    {
      id: "basket_3",
      title: "Frontend React Specialists",
      description: "Modern frontend developers with excellent UI/UX sensibilities",
      candidateCount: 18,
      avgJdMatch: 87,
      salaryRange: "₹8–10 LPA", 
      location: "Pune",
      topSkills: ["React", "TypeScript", "Next.js", "Tailwind"],
      avgOjr: 75,
      lastUpdated: "1 hour ago",
      priority: "medium",
      roles: ["Frontend Engineer", "UI Developer"]
    },
    {
      id: "basket_4",
      title: "Full-Stack MERN Developers",
      description: "End-to-end developers capable of handling complete web applications",
      candidateCount: 12,
      avgJdMatch: 85,
      salaryRange: "₹9–11 LPA",
      location: "Mumbai",
      topSkills: ["React", "Node.js", "MongoDB", "Express"],
      avgOjr: 71,
      lastUpdated: "6 hours ago", 
      priority: "medium",
      roles: ["Full Stack Developer", "Software Engineer"]
    },
    {
      id: "basket_5",
      title: "DevOps & Cloud Engineers",
      description: "Infrastructure specialists with container orchestration expertise", 
      candidateCount: 8,
      avgJdMatch: 89,
      salaryRange: "₹11–14 LPA",
      location: "Delhi NCR",
      topSkills: ["Docker", "Kubernetes", "AWS", "Terraform"],
      avgOjr: 80,
      lastUpdated: "3 hours ago",
      priority: "high",
      roles: ["DevOps Engineer", "Cloud Engineer"]
    },
    {
      id: "basket_6",
      title: "Mobile App Developers",
      description: "Cross-platform mobile developers with strong performance optimization skills",
      candidateCount: 14,
      avgJdMatch: 83,
      salaryRange: "₹7–9 LPA",
      location: "Chennai", 
      topSkills: ["React Native", "Flutter", "iOS", "Android"],
      avgOjr: 73,
      lastUpdated: "5 hours ago",
      priority: "medium",
      roles: ["Mobile Developer", "App Developer"]
    }
  ];

  const filteredBaskets = talentBaskets.filter(basket => {
    const matchesSearch = basket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         basket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || basket.location === locationFilter;
    const matchesRole = !roleFilter || basket.roles.some(role => role === roleFilter);
    
    return matchesSearch && matchesLocation && matchesRole;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'; 
      case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const uniqueLocations = Array.from(new Set(talentBaskets.map(b => b.location)));
  const uniqueRoles = Array.from(new Set(talentBaskets.flatMap(b => b.roles)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Auto-Curated Talent Baskets</h2>
          <p className="text-gray-600 mt-1">Smart groupings of top candidates matching your hiring needs</p>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          <Clock className="w-4 h-4 mr-1" />
          Updated every 6 hours
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <Input
          placeholder="Search baskets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-64"
          data-testid="input-search-baskets"
        />
        
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-48" data-testid="select-location-filter">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Locations</SelectItem>
            {uniqueLocations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48" data-testid="select-role-filter">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Roles</SelectItem>
            {uniqueRoles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Talent Baskets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBaskets.map((basket) => (
          <Card 
            key={basket.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer group relative overflow-hidden"
            onClick={() => onSelectBasket(basket)}
            data-testid={`card-basket-${basket.id}`}
          >
            {/* Priority Indicator */}
            <div className={`absolute top-0 left-0 w-full h-1 ${
              basket.priority === 'high' ? 'bg-red-500' : 
              basket.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
            }`} />
            
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {basket.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {basket.description}
                  </p>
                </div>
                <Badge className={`ml-2 text-xs font-semibold border ${getPriorityColor(basket.priority)}`}>
                  {basket.priority.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{basket.candidateCount}</div>
                  <div className="text-xs text-gray-500">Candidates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{basket.avgJdMatch}%</div>
                  <div className="text-xs text-gray-500">Avg JD Match</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{basket.avgOjr}%</div>
                  <div className="text-xs text-gray-500">Avg OJR</div>
                </div>
              </div>

              {/* Location & Salary */}
              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{basket.location}</span>
                </div>
                <div className="flex items-center">
                  <IndianRupee className="w-4 h-4 mr-1" />
                  <span>{basket.salaryRange}</span>
                </div>
              </div>

              {/* Top Skills */}
              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-2">Top Skills:</div>
                <div className="flex flex-wrap gap-1">
                  {basket.topSkills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-0.5">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-xs text-gray-500">
                  Updated {basket.lastUpdated}
                </div>
                <Button 
                  size="sm" 
                  className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  data-testid={`button-explore-${basket.id}`}
                >
                  Explore
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBaskets.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No baskets found</h3>
          <p className="text-gray-500">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}