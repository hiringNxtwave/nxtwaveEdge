import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Eye,
  UserCheck,
  MessageSquare,
  DollarSign,
  MapPin,
  Calendar,
  Activity,
  Zap,
  Filter
} from "lucide-react";

interface PipelineMetrics {
  stage: string;
  count: number;
  conversionRate: number;
  avgTimeInStage: number; // in days
  dropOffRate: number;
}

interface TimeToMetrics {
  metric: string;
  avgTime: number; // in days
  target: number;
  trend: 'up' | 'down' | 'stable';
  improvement: number;
}

interface OjrAnalysis {
  reason: string;
  percentage: number;
  impact: 'high' | 'medium' | 'low';
  suggestion: string;
}

interface RecruitmentTrend {
  date: string;
  viewed: number;
  shortlisted: number;
  interviewed: number;
  offered: number;
  joined: number;
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // Mock pipeline data
  const pipelineData: PipelineMetrics[] = [
    {
      stage: "Viewed",
      count: 2847,
      conversionRate: 100,
      avgTimeInStage: 0.5,
      dropOffRate: 0
    },
    {
      stage: "Shortlisted", 
      count: 456,
      conversionRate: 16.0,
      avgTimeInStage: 2.3,
      dropOffRate: 84.0
    },
    {
      stage: "Interviewed",
      count: 123,
      conversionRate: 27.0,
      avgTimeInStage: 5.2,
      dropOffRate: 73.0
    },
    {
      stage: "Offered",
      count: 67,
      conversionRate: 54.5,
      avgTimeInStage: 3.8,
      dropOffRate: 45.5
    },
    {
      stage: "Joined",
      count: 43,
      conversionRate: 64.2,
      avgTimeInStage: 12.5,
      dropOffRate: 35.8
    }
  ];

  const timeToMetrics: TimeToMetrics[] = [
    {
      metric: "Time-to-Offer",
      avgTime: 14.5,
      target: 12.0,
      trend: "down",
      improvement: -2.3
    },
    {
      metric: "Time-to-Join",
      avgTime: 28.2,
      target: 25.0,
      trend: "up",
      improvement: 3.1
    },
    {
      metric: "Interview-to-Offer",
      avgTime: 7.8,
      target: 6.0,
      trend: "stable",
      improvement: 0.2
    }
  ];

  const ojrDropOffReasons: OjrAnalysis[] = [
    {
      reason: "Salary Mismatch",
      percentage: 32,
      impact: "high",
      suggestion: "Increase salary band by 15-20% for top performers"
    },
    {
      reason: "Location Preference",
      percentage: 28,
      impact: "high", 
      suggestion: "Offer remote/hybrid options or relocation packages"
    },
    {
      reason: "Career Growth Concerns",
      percentage: 18,
      impact: "medium",
      suggestion: "Clearly outline career progression paths"
    },
    {
      reason: "Company Culture Fit",
      percentage: 12,
      impact: "medium",
      suggestion: "Improve cultural onboarding and team introductions"
    },
    {
      reason: "Better Offer Received",
      percentage: 10,
      impact: "low",
      suggestion: "Accelerate interview process to reduce competition"
    }
  ];

  const trendData: RecruitmentTrend[] = [
    { date: "Week 1", viewed: 645, shortlisted: 98, interviewed: 23, offered: 12, joined: 8 },
    { date: "Week 2", viewed: 712, shortlisted: 115, interviewed: 31, offered: 18, joined: 11 },
    { date: "Week 3", viewed: 598, shortlisted: 87, interviewed: 19, offered: 9, joined: 6 },
    { date: "Week 4", viewed: 892, shortlisted: 156, interviewed: 50, offered: 28, joined: 18 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruitment Analytics</h1>
          <p className="text-gray-600 mt-1">Real-time insights into your hiring pipeline</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32" data-testid="select-time-range">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <Activity className="w-4 h-4 mr-1" />
            Live Data
          </Badge>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Pipeline</p>
                <p className="text-2xl font-bold text-blue-900">2,847</p>
                <p className="text-xs text-blue-700 mt-1">+12% from last month</p>
              </div>
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-green-900">1.5%</p>
                <p className="text-xs text-green-700 mt-1">-0.3% from last month</p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Avg Time to Offer</p>
                <p className="text-2xl font-bold text-yellow-900">14.5d</p>
                <p className="text-xs text-yellow-700 mt-1">2.3d slower than target</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">OJR Rate</p>
                <p className="text-2xl font-bold text-purple-900">64.2%</p>
                <p className="text-xs text-purple-700 mt-1">+5.1% from last month</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Recruitment Pipeline Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-orange-500' : 'bg-purple-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{stage.stage}</h3>
                      <p className="text-sm text-gray-600">
                        Avg time: {stage.avgTimeInStage}d
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{stage.count.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">{stage.conversionRate.toFixed(1)}% conversion</div>
                  </div>
                </div>
                <Progress value={stage.conversionRate} className="h-3 mb-2" />
                {stage.dropOffRate > 0 && (
                  <div className="text-xs text-red-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {stage.dropOffRate.toFixed(1)}% drop-off rate
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time-to-Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Time-to-Metrics Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timeToMetrics.map((metric, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{metric.metric}</h4>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Current:</span>
                      <div className="font-bold text-gray-900">{metric.avgTime}d</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Target:</span>
                      <div className="font-bold text-gray-900">{metric.target}d</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Change:</span>
                      <div className={`font-bold ${metric.improvement > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {metric.improvement > 0 ? '+' : ''}{metric.improvement}d
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={Math.min(100, (metric.target / metric.avgTime) * 100)} 
                    className="h-2 mt-2" 
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* OJR Drop-off Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              OJR Drop-off Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ojrDropOffReasons.map((reason, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{reason.reason}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs border ${getImpactColor(reason.impact)}`}>
                        {reason.impact.toUpperCase()}
                      </Badge>
                      <span className="font-bold text-gray-900">{reason.percentage}%</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-800">
                    <Zap className="w-3 h-3 inline mr-1" />
                    <strong>Action:</strong> {reason.suggestion}
                  </div>
                  <Progress value={reason.percentage} className="h-2 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Pipeline Trends (Weekly)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="viewed"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Viewed"
                />
                <Area
                  type="monotone"
                  dataKey="shortlisted"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Shortlisted"
                />
                <Area
                  type="monotone"
                  dataKey="interviewed"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.6}
                  name="Interviewed"
                />
                <Area
                  type="monotone"
                  dataKey="offered"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                  name="Offered"
                />
                <Area
                  type="monotone"
                  dataKey="joined"
                  stackId="1"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.6}
                  name="Joined"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Actionable Playbooks */}
      <Card className="border-2 border-dashed border-blue-300 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Award className="w-5 h-5" />
            Recommended Actions (AI Playbooks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <h4 className="font-semibold">Salary Band Adjustment</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                32% drop-offs due to salary mismatch. Consider increasing bands by 15-20%.
              </p>
              <Button size="sm" className="w-full" data-testid="button-salary-adjustment">
                Simulate Impact
              </Button>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <h4 className="font-semibold">Remote Work Options</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                28% prefer different locations. Offer hybrid/remote to expand pool.
              </p>
              <Button size="sm" className="w-full" data-testid="button-remote-options">
                Configure Options
              </Button>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <h4 className="font-semibold">Process Acceleration</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Time-to-offer is 2.3 days slower. Streamline interview scheduling.
              </p>
              <Button size="sm" className="w-full" data-testid="button-accelerate-process">
                Optimize Timeline
              </Button>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-purple-600" />
                <h4 className="font-semibold">Culture Alignment</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                12% cultural fit concerns. Improve team intro and onboarding preview.
              </p>
              <Button size="sm" className="w-full" data-testid="button-culture-alignment">
                Enhance Experience
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}