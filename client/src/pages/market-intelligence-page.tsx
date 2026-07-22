import { useScrollToTop } from "@/hooks/useScrollToTop";
import MarketIntelligence from "@/components/market-intelligence";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

export default function MarketIntelligencePage() {
  useScrollToTop();

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Market Intelligence</h1>
        <p className="page-subtitle">
          Salary benchmarks, competitor hiring trends, and skill demand based on 2025 Talent Report
        </p>
      </div>

      <div className="card-grid-3 section-gap">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <DollarSign className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <Badge variant="outline" className="text-2xs font-medium text-green-600 dark:text-green-400">
              +8.2%
            </Badge>
          </div>
          <div className="stat-value">₹8.4L</div>
          <div className="stat-label">Avg Starting Salary</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-primary" />
            </div>
            <Badge variant="outline" className="text-2xs font-medium text-green-600 dark:text-green-400">
              +15.3%
            </Badge>
          </div>
          <div className="stat-value">1,847</div>
          <div className="stat-label">Top Skills Demand</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
            </div>
            <Badge variant="outline" className="text-2xs font-medium text-green-600 dark:text-green-400">
              +12.1%
            </Badge>
          </div>
          <div className="stat-value">2,500+</div>
          <div className="stat-label">Active Hiring Partners</div>
        </div>
      </div>

      <div className="surface-card">
        <MarketIntelligence />
      </div>
    </div>
  );
}
