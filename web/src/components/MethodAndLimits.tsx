import { UnscreenableInput } from '@/types';
import { Database, ShieldAlert, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

interface MethodAndLimitsProps {
  unscreenable: UnscreenableInput[];
}

export default function MethodAndLimits({ unscreenable }: MethodAndLimitsProps) {
  return (
    <section id="method" className="py-10 bg-app-bg border-b border-app-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-muted uppercase tracking-wider">
              <Database size={14} />
              <span>Research Design &amp; Analytical Bounds</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-navy-primary tracking-tight mt-1">
              Methodology &amp; Limitations
            </h2>
            <p className="text-xs sm:text-sm text-body-secondary mt-0.5">
              Screening rules, data provenance, variable calibration, and documented empirical boundaries.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-muted">
            Institutional Research Standards
          </span>
        </div>

        {/* Screening Criteria Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-card bg-app-card border border-app-border shadow-xs space-y-1.5">
            <span className="text-[11px] font-mono text-slate-muted uppercase font-semibold block">
              1 · The 40% Rule
            </span>
            <h3 className="text-xs font-semibold text-navy-primary">
              World Supply Threshold
            </h3>
            <p className="text-xs text-body-secondary leading-relaxed">
              A middle power enters the coalition set if domestic firms hold &ge;40% of world supply for any single chip input. 40.0% exactly counts as a pass.
            </p>
          </div>

          <div className="p-4 rounded-card bg-app-card border border-app-border shadow-xs space-y-1.5">
            <span className="text-[11px] font-mono text-slate-muted uppercase font-semibold block">
              2 · Narrowest Inputs
            </span>
            <h3 className="text-xs font-semibold text-navy-primary">
              No Double-Counting
            </h3>
            <p className="text-xs text-body-secondary leading-relaxed">
              Only narrow inputs are screened (e.g. &ldquo;EUV lithography tools&rdquo;, not &ldquo;lithography tools&rdquo; or &ldquo;equipment&rdquo;), mapped per <code className="text-[11px]">eto_step_mapping.csv</code>.
            </p>
          </div>

          <div className="p-4 rounded-card bg-app-card border border-app-border shadow-xs space-y-1.5">
            <span className="text-[11px] font-mono text-slate-muted uppercase font-semibold block">
              3 · Robustness Check
            </span>
            <h3 className="text-xs font-semibold text-navy-primary">
              Invariant at 25% &amp; 60%
            </h3>
            <p className="text-xs text-body-secondary leading-relaxed">
              The screen was rerun across 25%, 40%, and 60% thresholds. Exactly the same 8 middle-power nations pass under all three benchmarks.
            </p>
          </div>

          <div className="p-4 rounded-card bg-app-card border border-app-border shadow-xs space-y-1.5">
            <span className="text-[11px] font-mono text-slate-muted uppercase font-semibold block">
              4 · Bargaining Parties
            </span>
            <h3 className="text-xs font-semibold text-navy-primary">
              US &amp; China Context
            </h3>
            <p className="text-xs text-body-secondary leading-relaxed">
              The US (27 passes) and China (1 pass) are screened for systemic context but excluded from the coalition set as the primary negotiating counterparts.
            </p>
          </div>
        </div>

        {/* Data Provenance & Attribution Basis */}
        <div className="p-5 rounded-card bg-app-card border border-app-border shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-navy-primary uppercase tracking-wider border-b border-app-border pb-2.5">
            Data Sources &amp; Attribution Framework
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <span className="font-semibold text-navy-primary block">
                Primary: ETO Supply Chain Dataset
              </span>
              <p className="text-body-secondary leading-relaxed">
                September 2026 release from the Emerging Technology Observatory. Equipment market shares are primarily 2025 (TechInsights data); materials shares are 2019 (CSET). Attribution is assigned to the country of the parent company&rsquo;s corporate headquarters.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-navy-primary block">
                Approved Secondary: HBM Memory
              </span>
              <p className="text-body-secondary leading-relaxed">
                TrendForce 2025 projection (August 2025) provides South Korea with 81% of global HBM capacity (SK hynix 52.3%, Samsung Electronics 28.7%; Micron holds remaining 19.0% in the US). Summed by firm HQ.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-semibold text-navy-primary block">
                Approved Secondary: Leading-Edge Fabs
              </span>
              <p className="text-body-secondary leading-relaxed">
                SIA &amp; BCG 2024 report (May 2024) gives Taiwan 69% and South Korea 31% of global &lt;10nm logic capacity in 2022. <strong>Crucially, this figure is attributed by physical fab site location</strong> rather than headquarters.
              </p>
            </div>
          </div>
        </div>

        {/* What the Screen Could Not Establish */}
        <div className="p-5 rounded-card bg-app-card border border-app-border shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="text-status-warning-text" />
            <h3 className="text-sm font-semibold text-navy-primary uppercase tracking-wider">
              Empirical Gaps: What the Screen Could Not Establish
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-body-secondary leading-relaxed">
            <div className="space-y-2">
              <p>
                <strong>1. Most semiconductor materials lack national shares:</strong> 11 in-scope inputs (photoresists, electronic gases, CMP materials, wet chemicals, substrates, encapsulation resins) have countries listed by ETO but no share figures. Japan&rsquo;s leverage over materials is therefore under-counted.
              </p>
              <p>
                <strong>2. Advanced packaging capacity (CoWoS-class):</strong> Crucial for AI accelerators (e.g. Nvidia H100/B200 packaging at TSMC), but no free, dated, quantitative market-share source exists. Kept qualitative.
              </p>
            </div>

            <div className="space-y-2">
              <p>
                <strong>3. Taiwan&rsquo;s inclusion rests on a second source:</strong> In ETO headquarters data, Taiwan passes zero inputs at 40%. Its presence in the coalition set relies entirely on SIA/BCG&rsquo;s 2022 fab location metrics.
              </p>
              <p>
                <strong>4. Headquarters attribution overstates some nations:</strong> IMS Nanofabrication (Austria) is majority Intel-owned, meaning the US arguably controls this alternative. Kulicke &amp; Soffa (Singapore) is US-incorporated and Nasdaq-listed.
              </p>
            </div>
          </div>

          {/* Unscreenable inputs list */}
          <div className="pt-2 border-t border-app-border space-y-2">
            <span className="text-[11px] font-mono text-slate-muted uppercase font-semibold block">
              In-Scope Inputs with No Numeric Share in ETO (Listed as Could Not Screen)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-[11px]">
              {unscreenable.map((u, i) => (
                <div key={i} className="p-2 rounded bg-app-bg border border-app-border">
                  <div className="font-semibold text-navy-primary truncate">{u.input}</div>
                  <div className="text-slate-muted text-[10px] truncate">Producers: {u.countries_listed}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Limitations of Scoring (from README) */}
        <div className="p-5 rounded-card bg-app-card border border-app-border shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-navy-primary uppercase tracking-wider">
            Documented Limitations of Scoring
          </h3>
          <ul className="text-xs text-body-secondary space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong>Retrospective case framing:</strong> Past case scores were drafted with knowledge of the eventual outcome, introducing potential confirmation tendencies despite pre-defined anchors.
            </li>
            <li>
              <strong>Judgment boundaries:</strong> Concentration and cohesion follow mechanical counts; substitutability, time to replace, and state control are analytical judgments.
            </li>
            <li>
              <strong>Thin historical sample:</strong> Only five past episodes exist in the dataset, four of which are basic raw commodities (oil, copper, tin, rare earths). Advanced semiconductors feature vastly higher capital intensity, proprietary IP, and fabrication complexity.
            </li>
            <li>
              <strong>Asynchronous data vintage:</strong> World share years range between 2019 (materials) and 2025 (equipment projections).
            </li>
            <li>
              <strong>Omitted dimensions:</strong> The framework explicitly excludes confidential intelligence sharing, classified export-control negotiations, and corporate pushback from private tech executives.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

