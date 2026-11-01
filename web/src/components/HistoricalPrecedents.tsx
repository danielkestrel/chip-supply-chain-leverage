'use client';

import { useState } from 'react';
import { HistoricalCase } from '@/types';
import { ChevronDown, ChevronUp, BookOpen, AlertCircle, ExternalLink, Lightbulb } from 'lucide-react';

interface HistoricalPrecedentsProps {
  cases: HistoricalCase[];
}

export default function HistoricalPrecedents({ cases }: HistoricalPrecedentsProps) {
  const [expandedCases, setExpandedCases] = useState<Record<string, boolean>>({
    K1: true,
    K5: true,
  });

  const toggleCase = (caseId: string) => {
    setExpandedCases((prev) => ({
      ...prev,
      [caseId]: !prev[caseId],
    }));
  };

  const getOutcomeTag = (outcome: string) => {
    switch (outcome) {
      case 'partly worked':
        return {
          text: 'Partly Worked',
          class: 'bg-status-success-bg text-status-success-text border-status-success-border',
        };
      case 'failed':
        return {
          text: 'Failed',
          class: 'bg-status-warning-bg text-status-warning-text border-status-warning-border',
        };
      case 'backfired':
        return {
          text: 'Backfired',
          class: 'bg-status-danger-bg text-status-danger-text border-status-danger-border',
        };
      default:
        return { text: outcome, class: 'bg-app-bg text-body-secondary border-app-border' };
    }
  };

  return (
    <section id="precedents" className="py-10 bg-app-bg border-b border-app-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-muted uppercase tracking-wider">
              <BookOpen size={14} />
              <span>Step 3 Historical Case Archive · Comparative Foreign Policy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-navy-primary tracking-tight mt-1">
              Historical Precedents
            </h2>
            <p className="text-xs sm:text-sm text-body-secondary mt-0.5">
              Five historical episodes of critical supplier leverage and resource coalitions, scored as they stood at the start of each crisis.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-muted">
            1 Partly Worked · 1 Failed · 3 Backfired
          </div>
        </div>

        {/* Prominent Four Rules of Thumb Block */}
        <div className="p-6 rounded-card bg-app-card border border-app-border shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-app-border pb-3">
            <Lightbulb size={18} className="text-navy-secondary" />
            <h3 className="text-sm font-semibold text-navy-primary uppercase tracking-wider">
              The Four Rules of Thumb
            </h3>
            <span className="text-xs text-body-secondary ml-auto hidden sm:inline">
              Core empirical findings from Step 3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-lg bg-blue-grey-light/50 border border-app-border space-y-1">
              <div className="text-xs font-bold text-navy-primary font-mono flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-navy-secondary text-white text-[11px] inline-flex items-center justify-center">1</span>
                <span>Leverage only held where replacement exceeded 5 years</span>
              </div>
              <p className="text-xs text-body-primary leading-relaxed pl-6.5">
                The 1973 Arab oil embargo (K1) is the only case that partly worked, and the only case scored high on time to replace. Where targets could substitute or build alternatives within 5 years (K2–K5), coercion failed or backfired.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-blue-grey-light/50 border border-app-border space-y-1">
              <div className="text-xs font-bold text-navy-primary font-mono flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-navy-secondary text-white text-[11px] inline-flex items-center justify-center">2</span>
                <span>Supply management fails outright when substitutes are easy</span>
              </div>
              <p className="text-xs text-body-primary leading-relaxed pl-6.5">
                Both commodity cases with high substitutability (K2 CIPEC copper and K3 International Tin Council) failed or collapsed. Propping up prices drew in non-member capacity, destroying market share.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-blue-grey-light/50 border border-app-border space-y-1">
              <div className="text-xs font-bold text-navy-primary font-mono flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-navy-secondary text-white text-[11px] inline-flex items-center justify-center">3</span>
                <span>A near-monopoly is not enough if the target can diversify within years</span>
              </div>
              <p className="text-xs text-body-primary leading-relaxed pl-6.5">
                China in 2010 (90% rare earths) and Japan in 2019 (70–90% chip chemicals) both held near-total dominance and both backfired. Targets financed domestic production or opened third-party mines, expending supplier leverage permanently.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-blue-grey-light/50 border border-app-border space-y-1">
              <div className="text-xs font-bold text-navy-primary font-mono flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-navy-secondary text-white text-[11px] inline-flex items-center justify-center">4</span>
                <span>Even a cut that works makes buyers organise countermeasures</span>
              </div>
              <p className="text-xs text-body-primary leading-relaxed pl-6.5">
                The 1973 embargo directly produced the International Energy Agency (IEA), emergency sharing agreements, and aggressive North Sea/Alaska exploration, permanently wearing down OPEC’s long-term monopoly leverage.
              </p>
            </div>
          </div>
        </div>

        {/* Cross-Case Comparison Matrix */}
        <div className="p-5 rounded-card bg-app-card border border-app-border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-navy-primary uppercase tracking-wider">
              Cross-Case Comparison Matrix
            </h3>
            <span className="text-xs text-slate-muted font-mono">Scored at start of each episode</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-app-bg border-b border-app-border text-[11px] font-mono text-slate-muted uppercase">
                  <th className="py-2.5 px-3">Case</th>
                  <th className="py-2.5 px-3">Concentration</th>
                  <th className="py-2.5 px-3">Substitutability</th>
                  <th className="py-2.5 px-3 font-semibold text-navy-primary">Time to Replace</th>
                  <th className="py-2.5 px-3">Cohesion</th>
                  <th className="py-2.5 px-3">Dependence</th>
                  <th className="py-2.5 px-3">State Control</th>
                  <th className="py-2.5 px-3 text-right">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border font-medium">
                {cases.map((c) => {
                  const tag = getOutcomeTag(c.outcome);
                  return (
                    <tr key={c.case_id} className="hover:bg-app-bg/60">
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-mono font-bold text-navy-primary mr-1.5">{c.case_id}</span>
                        <span>{c.case}</span>
                      </td>
                      <td className="py-2.5 px-3 capitalize font-mono text-body-secondary">{c.concentration}</td>
                      <td className="py-2.5 px-3 capitalize font-mono text-body-secondary">{c.substitutability}</td>
                      <td className="py-2.5 px-3 capitalize font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded ${
                            c.time_to_replace === 'high'
                              ? 'bg-status-success-bg text-status-success-text font-bold'
                              : 'text-body-primary'
                          }`}
                        >
                          {c.time_to_replace}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 capitalize font-mono text-body-secondary">{c.cohesion}</td>
                      <td className="py-2.5 px-3 capitalize font-mono text-body-secondary">{c.dependence_on_target}</td>
                      <td className="py-2.5 px-3 capitalize font-mono text-body-secondary">{c.state_control}</td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-mono border ${tag.class}`}>
                          {tag.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analytical Interpretation & Missing Factors (Visually Separated) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 p-5 rounded-card bg-app-card border border-app-border shadow-sm space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-primary">
              <span className="w-2 h-2 rounded-full bg-navy-secondary"></span>
              <span>Interpretation: Non-Separating Variables</span>
            </div>
            <p className="text-xs text-body-primary leading-relaxed">
              In this empirical set, <strong>Time to Replace is the only variable that separates success from failure</strong>. The other five variables fail as isolated predictors:
            </p>
            <ul className="text-xs text-body-secondary space-y-1.5 list-disc list-inside leading-relaxed">
              <li><strong>Dependence on target:</strong> High in K1 (partly worked) and high in K2, K4, K5 (failed/backfired).</li>
              <li><strong>State control:</strong> High in K1 (partly worked) and K4 (backfired); medium across the rest.</li>
              <li><strong>Concentration:</strong> The two highest scores (China 2010 and Japan 2019) both backfired.</li>
              <li><strong>Cohesion:</strong> Counted actor count runs counter-intuitively (K1 had low cohesion among Arab states yet succeeded, whereas tin had medium cohesion and collapsed).</li>
            </ul>
          </div>

          <div className="md:col-span-6 p-5 rounded-card bg-app-card border border-app-border shadow-sm space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-primary">
              <span className="w-2 h-2 rounded-full bg-slate-muted"></span>
              <span>Factors the Six Variables May Miss</span>
            </div>
            <p className="text-xs text-body-primary leading-relaxed">
              Qualitative forces not captured in the 6 structural variables that influenced past outcomes:
            </p>
            <ul className="text-xs text-body-secondary space-y-1.5 list-disc list-inside leading-relaxed">
              <li><strong>Face-saving demand structures:</strong> Demands with diplomatic off-ramps (K1 disengagement talks) succeed where zero-sum humiliation (K4, K5) forces defiance.</li>
              <li><strong>Supplier financial cushion:</strong> Oil producers earned windfall revenues even under volume cuts; metal cartels faced immediate liquidity crises.</li>
              <li><strong>Market tightness:</strong> Tight markets (1973 oil) amplify leverage; slack markets (1975 copper, 1985 tin) render cuts futile.</li>
              <li><strong>Ambiguity of coercion:</strong> Denied embargoes (China 2010, Japan 2019 export review) complicate target response but accelerate distrust.</li>
            </ul>
          </div>
        </div>

        {/* Expandable Case Dossiers */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-navy-primary uppercase tracking-wider">
            Detailed Case Dossiers (K1 to K5)
          </h3>

          <div className="space-y-3">
            {cases.map((c) => {
              const isExpanded = expandedCases[c.case_id] ?? false;
              const tag = getOutcomeTag(c.outcome);

              return (
                <div
                  key={c.case_id}
                  className="rounded-card border border-app-border bg-app-card shadow-xs overflow-hidden transition-all"
                >
                  {/* Case Accordion Header */}
                  <div
                    onClick={() => toggleCase(c.case_id)}
                    className="p-4 cursor-pointer hover:bg-app-bg/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-blue-grey-light text-navy-primary">
                        {c.case_id}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold text-navy-primary">
                          {c.case}
                        </h4>
                        <div className="text-[11px] text-body-secondary mt-0.5">
                          Supplier: <strong>{c.who_used_leverage}</strong> · Target: <strong>{c.target}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-semibold border ${tag.class}`}>
                        {tag.text}
                      </span>
                      <button
                        type="button"
                        className="p-1 text-slate-muted hover:text-navy-primary"
                        aria-label={isExpanded ? 'Collapse case' : 'Expand case'}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Dossier Content */}
                  {isExpanded && (
                    <div className="p-5 border-t border-app-border space-y-4 bg-app-card text-xs">
                      {/* Three-line core summary */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-lg bg-app-bg border border-app-border">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-muted uppercase block font-semibold">
                            What the Supplier Wanted
                          </span>
                          <p className="text-xs text-body-primary leading-relaxed">
                            {c.what_the_supplier_wanted}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-muted uppercase block font-semibold">
                            How the Target Responded
                          </span>
                          <p className="text-xs text-body-primary leading-relaxed">
                            {c.how_the_target_responded}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-muted uppercase block font-semibold">
                            Duration &amp; Outcome
                          </span>
                          <p className="text-xs text-body-primary leading-relaxed">
                            {c.how_long_it_lasted}
                          </p>
                        </div>
                      </div>

                      {/* Dispute Notes (if present) */}
                      {c.dispute_note && (
                        <div className="p-3 rounded-md bg-status-warning-bg border border-status-warning-border text-xs text-body-primary leading-relaxed flex items-start gap-2">
                          <span className="text-status-warning-text shrink-0 mt-0.5">
                            <AlertCircle size={14} />
                          </span>
                          <div>
                            <strong className="text-status-warning-text uppercase text-[10px] tracking-wider block">
                              Historical Dispute / Alternative Reading
                            </strong>
                            <span>{c.dispute_note}</span>
                          </div>
                        </div>
                      )}

                      {/* Six Variable Scoring Evidence */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-semibold text-navy-primary uppercase tracking-wider block">
                          Variable Scores and Empirical Evidence
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          <div className="p-2.5 rounded bg-app-bg border border-app-border">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-navy-primary">Concentration</span>
                              <span className="font-mono uppercase text-[10px] font-semibold px-1.5 rounded bg-white border border-app-border">
                                {c.concentration}
                              </span>
                            </div>
                            <p className="text-[11px] text-body-secondary leading-relaxed">
                              {c.concentration_evidence}
                            </p>
                          </div>

                          <div className="p-2.5 rounded bg-app-bg border border-app-border">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-navy-primary">Substitutability</span>
                              <span className="font-mono uppercase text-[10px] font-semibold px-1.5 rounded bg-white border border-app-border">
                                {c.substitutability}
                              </span>
                            </div>
                            <p className="text-[11px] text-body-secondary leading-relaxed">
                              {c.substitutability_evidence}
                            </p>
                          </div>

                          <div className="p-2.5 rounded bg-app-bg border border-app-border">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-navy-primary">Time to Replace</span>
                              <span className="font-mono uppercase text-[10px] font-semibold px-1.5 rounded bg-white border border-app-border">
                                {c.time_to_replace}
                              </span>
                            </div>
                            <p className="text-[11px] text-body-secondary leading-relaxed">
                              {c.time_to_replace_evidence}
                            </p>
                          </div>

                          <div className="p-2.5 rounded bg-app-bg border border-app-border">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-navy-primary">Cohesion</span>
                              <span className="font-mono uppercase text-[10px] font-semibold px-1.5 rounded bg-white border border-app-border">
                                {c.cohesion}
                              </span>
                            </div>
                            <p className="text-[11px] text-body-secondary leading-relaxed">
                              {c.cohesion_evidence}
                            </p>
                          </div>

                          <div className="p-2.5 rounded bg-app-bg border border-app-border">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-navy-primary">Dependence on Target</span>
                              <span className="font-mono uppercase text-[10px] font-semibold px-1.5 rounded bg-white border border-app-border">
                                {c.dependence_on_target}
                              </span>
                            </div>
                            <p className="text-[11px] text-body-secondary leading-relaxed">
                              {c.dependence_on_target_evidence}
                            </p>
                          </div>

                          <div className="p-2.5 rounded bg-app-bg border border-app-border">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-semibold text-navy-primary">State Control</span>
                              <span className="font-mono uppercase text-[10px] font-semibold px-1.5 rounded bg-white border border-app-border">
                                {c.state_control}
                              </span>
                            </div>
                            <p className="text-[11px] text-body-secondary leading-relaxed">
                              {c.state_control_evidence}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Sources */}
                      <div className="pt-2 border-t border-app-border text-[11px] text-slate-muted">
                        <strong>Sources:</strong> {c.sources}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

