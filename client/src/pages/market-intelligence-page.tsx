import { useScrollToTop } from "@/hooks/useScrollToTop";
import MarketIntelligence from "@/components/market-intelligence";
import { BarChart3 } from "lucide-react";

export default function MarketIntelligencePage() {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Market Intelligence</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Salary benchmarks, competitor hiring trends, and skill demand, based on 2025 Talent Report
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <MarketIntelligence />
      </div>
    </div>
  );
}
