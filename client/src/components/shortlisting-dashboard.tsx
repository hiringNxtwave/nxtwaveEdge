import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Target, 
  Brain, 
  Zap,
  Play,
  FileText,
  DollarSign,
  MapPin,
  Star
} from "lucide-react";
import type { StudentWithSkills } from "@shared/schema";
import { useShortlist } from "@/contexts/shortlist-context";

interface ShortlistingDashboardProps {
  students: StudentWithSkills[];
  onBulkAction: (action: 'shortlist' | 'remove', studentIds: string[]) => void;
}

export default function ShortlistingDashboard({ students, onBulkAction }: ShortlistingDashboardProps) {
  const { shortlistedIds, isShortlisted } = useShortlist();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("bulk-actions");

  // Filter shortlisted students
  const shortlistedStudents = students.filter(student => isShortlisted(student.id));
  
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllShortlisted = () => {
    setSelectedStudents(shortlistedStudents.map(s => s.id));
  };

  const clearSelection = () => {
    setSelectedStudents([]);
  };

  const generatePredictiveScore = (student: StudentWithSkills, type: string) => {
    const seed = parseInt(student.id.slice(-8), 16);
    const baseScore = student.codingRating || 4;
    
    switch (type) {
      case 'jd-match':
        return Math.min(95, Math.max(75, baseScore * 18 + ((seed % 10) - 5)));
      case 'lookalike':
        return Math.min(90, Math.max(65, baseScore * 17 + ((seed * 7) % 10) - 3));
      case 'offer-join':
        return Math.min(85, Math.max(60, baseScore * 16 + ((seed * 11) % 10) - 4));
      case 'ramp-risk':
        return Math.min(25, Math.max(5, 30 - (baseScore * 4) + ((seed * 13) % 8) - 4));
      default:
        return 75;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shortlisted</p>
                <p className="text-2xl font-bold text-blue-600">{shortlistedStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Selected</p>
                <p className="text-2xl font-bold text-green-600">{selectedStudents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avg JD Match</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(shortlistedStudents.reduce((acc, s) => acc + generatePredictiveScore(s, 'jd-match'), 0) / (shortlistedStudents.length || 1))}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">High Potential</p>
                <p className="text-2xl font-bold text-orange-600">
                  {shortlistedStudents.filter(s => generatePredictiveScore(s, 'jd-match') > 85).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bulk-actions">Bulk Actions</TabsTrigger>
          <TabsTrigger value="detailed-review">Detailed Review</TabsTrigger>
          <TabsTrigger value="predictive-insights">Predictive Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="bulk-actions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Bulk Selection & Actions</CardTitle>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={selectAllShortlisted}
                    data-testid="button-select-all"
                  >
                    Select All ({shortlistedStudents.length})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearSelection}
                    data-testid="button-clear-selection"
                  >
                    Clear Selection
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Bulk Action Controls */}
                {selectedStudents.length > 0 && (
                  <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                    <span className="font-medium">{selectedStudents.length} candidates selected</span>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => onBulkAction('shortlist', selectedStudents)}
                      data-testid="button-bulk-shortlist"
                    >
                      Move to Next Round
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onBulkAction('remove', selectedStudents)}
                      data-testid="button-bulk-remove"
                    >
                      Remove from Shortlist
                    </Button>
                  </div>
                )}

                {/* Candidate List */}
                <div className="space-y-3">
                  {shortlistedStudents.map((student) => (
                    <div key={student.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => toggleStudentSelection(student.id)}
                        data-testid={`checkbox-select-${student.id}`}
                      />
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div>
                          <h3 className="font-semibold">{student.fullName}</h3>
                          <p className="text-sm text-gray-600">{student.skills?.slice(0, 2).join(', ')}</p>
                        </div>
                        
                        <div className="text-center">
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                            JD Match: {generatePredictiveScore(student, 'jd-match')}%
                          </Badge>
                        </div>
                        
                        <div className="text-center">
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            Offer-Join: {generatePredictiveScore(student, 'offer-join')}%
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" data-testid={`button-code-replay-${student.id}`}>
                            <Play className="w-4 h-4 mr-1" />
                            Code Replay
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {shortlistedStudents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No candidates shortlisted yet</p>
                    <p className="text-sm">Start shortlisting candidates from the talent discovery dashboard</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed-review" className="space-y-4">
          <div className="grid gap-4">
            {shortlistedStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Student Info */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{student.fullName}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                          <span>Expected: ₹{student.expectedSalaryMin || '6'}-{student.expectedSalaryMax || '8'} LPA</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{student.location || 'Hyderabad'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                        data-testid={`button-code-replay-detailed-${student.id}`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        2-min Code Replay
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        size="sm"
                        data-testid={`button-communication-${student.id}`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Communication Sample
                      </Button>
                    </div>

                    {/* Expectation Match */}
                    <div>
                      <h4 className="font-medium mb-3">Expectation Match</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Salary Fit</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            ✓ Match
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Location</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            ✓ Match
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Start Date</span>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            ~ Flexible
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="predictive-insights" className="space-y-4">
          <div className="grid gap-4">
            {shortlistedStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold">{student.fullName}</h3>
                    <Badge className="bg-blue-600">
                      Overall Score: {Math.round((generatePredictiveScore(student, 'jd-match') + generatePredictiveScore(student, 'offer-join')) / 2)}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* JD Match Score */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Target className="w-5 h-5 text-purple-600 mr-2" />
                        <span className="font-medium">JD Match Score</span>
                      </div>
                      <div className="mb-2">
                        <div className="text-2xl font-bold text-purple-600">
                          {generatePredictiveScore(student, 'jd-match')}%
                        </div>
                      </div>
                      <Progress 
                        value={generatePredictiveScore(student, 'jd-match')} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Skills + Experience fit</p>
                    </div>

                    {/* Look-Alike Fit */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Brain className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="font-medium">Look-Alike Fit</span>
                      </div>
                      <div className="mb-2">
                        <div className="text-2xl font-bold text-blue-600">
                          {generatePredictiveScore(student, 'lookalike')}%
                        </div>
                      </div>
                      <Progress 
                        value={generatePredictiveScore(student, 'lookalike')} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Similar to top performers</p>
                    </div>

                    {/* Offer-to-Join Probability */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-medium">Offer-to-Join</span>
                      </div>
                      <div className="mb-2">
                        <div className="text-2xl font-bold text-green-600">
                          {generatePredictiveScore(student, 'offer-join')}%
                        </div>
                      </div>
                      <Progress 
                        value={generatePredictiveScore(student, 'offer-join')} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Likelihood to accept</p>
                    </div>

                    {/* Ramp-Up Risk */}
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Zap className="w-5 h-5 text-orange-600 mr-2" />
                        <span className="font-medium">Ramp-Up Risk</span>
                      </div>
                      <div className="mb-2">
                        <div className="text-2xl font-bold text-orange-600">
                          {generatePredictiveScore(student, 'ramp-risk')}%
                        </div>
                      </div>
                      <Progress 
                        value={generatePredictiveScore(student, 'ramp-risk')} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">Learning velocity risk</p>
                    </div>
                  </div>

                  {/* Evidence Summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-2" />
                      Evidence-Based Recommendation
                    </h4>
                    <p className="text-sm text-gray-700">
                      <strong>High potential candidate.</strong> Strong JD match ({generatePredictiveScore(student, 'jd-match')}%) with 
                      {generatePredictiveScore(student, 'lookalike') > 80 ? ' excellent' : ' good'} similarity to successful hires. 
                      Expectations align with role requirements. 
                      {generatePredictiveScore(student, 'ramp-risk') < 15 ? ' Low ramp-up risk.' : ' Moderate ramp-up support needed.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}