import { ShieldAlert, Clock, Layers, Users } from 'lucide-react';

interface OverviewProps {
  totalScored: number;
  countriesCount: number;
  replaceGt5Count: number;
  depHighCount: number;
}

export default function Overview({
  totalScored,
  countriesCount,
  replaceGt5Count,
  depHighCount,
}: OverviewProps) {
  return (
    <section className="pt-8 pb-6 border-b border-app-border bg-app-card">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8">
        {/* Project Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-app-border">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs font-mono font-medium bg-blue-grey-light text-navy-secondary border border-app-border">
              <span>Middle Powers Hackathon · Track C (Diplomacy)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-navy-primary tracking-tight">
              Conditions, Not Cutoffs
            </h1>
            <p className="text-base sm:text-lg text-slate-muted font-normal">
              Chip-Supply-Chain Leverage for AI Safety
            </p>
            <p className="text-xs text-body-secondary pt-1">
              By Andrew, Ayodele and Gideon · Research and report complete
            </p>
          </div>

          <div className="md:text-right shrink-0">
            <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-status-success-bg text-status-success-text border border-status-success-border">
              Research &amp; Report Complete
            </span>
          </div>
        </div>

        {/* Research Question & Working Hypothesis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6 border-b border-app-border">
          <div className="lg:col-span-7 space-y-2">
            <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-muted">
              Research Question
            </h2>
            <p className="text-sm sm:text-base text-body-primary leading-relaxed font-normal">
              Which AI-safety asks can the countries that hold chip-supply-chain chokepoints, other than
              the US and China, credibly attach to their leverage? What should they coordinate on, and
              what should they avoid?
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="p-4 rounded-lg bg-blue-grey-light/60 border border-app-border space-y-1.5">
              <span className="text-xs font-semibold text-navy-secondary uppercase tracking-wider block">
                Working Hypothesis
              </span>
              <p className="text-sm text-body-primary leading-relaxed italic">
                “The credible asks are conditions that can be attached to supply, more so than threats to cut it.”
              </p>
            </div>
          </div>
        </div>

        {/* Compact Metrics Row */}
        <div className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1 */}
            <div className="p-4 rounded-lg bg-app-bg border border-app-border flex items-start gap-3.5">
              <div className="p-2 rounded bg-white text-navy-secondary border border-app-border shrink-0">
                <Layers size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold font-mono text-navy-primary">
                    {totalScored}
                  </span>
                  <span className="text-xs text-body-secondary">chokepoints</span>
                </div>
                <div className="text-xs font-semibold text-body-primary">
                  Across {countriesCount} Middle-Power Countries
                </div>
                <p className="text-[11px] text-body-secondary leading-normal">
                  Identified at 40% world-supply threshold; exactly robust at 25% and 60%.
                </p>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="p-4 rounded-lg bg-app-bg border border-app-border flex items-start gap-3.5">
              <div className="p-2 rounded bg-white text-navy-secondary border border-app-border shrink-0">
                <Clock size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold font-mono text-navy-primary">
                    {replaceGt5Count}
                  </span>
                  <span className="text-xs text-body-secondary">of 35 chokepoints</span>
                </div>
                <div className="text-xs font-semibold text-body-primary">
                  Take &gt;5 Years to Replace
                </div>
                <p className="text-[11px] text-body-secondary leading-normal">
                  ASML lithography, TSMC fabs, TEL resist processing, Canon i-line, e-beam writers.
                </p>
              </div>
            </div>

            {/* Metric 3 */}
            <div className="p-4 rounded-lg bg-app-bg border border-app-border flex items-start gap-3.5">
              <div className="p-2 rounded bg-white text-navy-secondary border border-app-border shrink-0">
                <ShieldAlert size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-semibold font-mono text-navy-primary">
                    {depHighCount}
                  </span>
                  <span className="text-xs text-body-secondary">of 35 chokepoints</span>
                </div>
                <div className="text-xs font-semibold text-body-primary">
                  High Dependence on the US
                </div>
                <p className="text-[11px] text-body-secondary leading-normal">
                  Suppliers rely on the US as vital security guarantor or principal export market.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

