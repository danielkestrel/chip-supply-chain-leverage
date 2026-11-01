'use client';

import { useState, useMemo } from 'react';
import { ChokepointRow, HistoricalCase, VariableId, Level, CaseId } from '@/types';
import {
  calculateDistances,
  getClosestCases,
  generatePolicyReading,
  CASE_NAMES,
  CASE_OUTCOMES,
  VARIABLES,
  LEVEL_MAP,
} from '@/lib/simulator';
import { Sliders, RotateCcw, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';

interface LeverageSimulatorProps {
  chokepoints: ChokepointRow[];
  cases: HistoricalCase[];
  initialRowId?: string;
}

interface VariableOption {
  value: Level;
  label: string;
  sublabel: string;
  effect: 'helps' | 'moderate' | 'hurts';
}

const VARIABLE_OPTIONS: Record<VariableId, { name: string; question: string; options: VariableOption[] }> = {
  concentration: {
    name: 'Concentration',
    question: 'What share of the supply the target needs does the supplier hold?',
    options: [
      { value: 'low', label: '< 25% External Share', sublabel: 'Low share · Weakens leverage', effect: 'hurts' },
      { value: 'medium', label: '25% – 60% Share', sublabel: 'Moderate share · Balanced', effect: 'moderate' },
      { value: 'high', label: '> 60% Dominant Share', sublabel: 'Dominant hold · Strengthens leverage', effect: 'helps' },
    ],
  },
  substitutability: {
    name: 'Substitutability',
    question: 'Can the target switch to another supplier or redesign around it?',
    options: [
      { value: 'low', label: 'No Workable Substitute', sublabel: 'Monopoly barrier · Strengthens leverage', effect: 'helps' },
      { value: 'medium', label: 'Partial / Delay Penalty', sublabel: 'Re-qualification delay · Moderate', effect: 'moderate' },
      { value: 'high', label: 'Readily Substituted', sublabel: 'Commodity grade · Weakens leverage', effect: 'hurts' },
    ],
  },
  time_to_replace: {
    name: 'Time to Replace',
    question: 'How long would the target need to build its own supply?',
    options: [
      { value: 'low', label: '< 2 Years (Domestic Maker)', sublabel: 'Quick replacement · Weakens leverage', effect: 'hurts' },
      { value: 'medium', label: '2 – 5 Years (Scaling/Mature)', sublabel: 'Intermediate friction · Moderate', effect: 'moderate' },
      { value: 'high', label: '> 5 Years (Frontier System)', sublabel: 'Decade barrier · Strengthens leverage', effect: 'helps' },
    ],
  },
  cohesion: {
    name: 'Cohesion',
    question: 'How many separate actors must hold the line to keep 80% share?',
    options: [
      { value: 'low', label: '4+ Actors (Fragmented)', sublabel: 'Cartel leakage · Weakens leverage', effect: 'hurts' },
      { value: 'medium', label: '2 – 3 Actors (Oligopoly)', sublabel: 'Manageable group · Moderate', effect: 'moderate' },
      { value: 'high', label: '1 Actor (Monopoly)', sublabel: 'Single firm · Strengthens leverage', effect: 'helps' },
    ],
  },
  dependence_on_target: {
    name: 'Dependence on Target',
    question: 'How much does the supplier rely on the target for security or markets?',
    options: [
      { value: 'low', label: '< 10% / Autonomous', sublabel: 'Independent · Strengthens leverage', effect: 'helps' },
      { value: 'medium', label: '10% – 30% / Partner', sublabel: 'Minor trade tie · Moderate', effect: 'moderate' },
      { value: 'high', label: '> 30% / Security Guarantor', sublabel: 'Allied dependence · Weakens leverage', effect: 'hurts' },
    ],
  },
  state_control: {
    name: 'State Control',
    question: 'Can the government direct the firms that hold the supply?',
    options: [
      { value: 'low', label: 'Private / Unregulated', sublabel: 'Corporate autonomy · Weakens leverage', effect: 'hurts' },
      { value: 'medium', label: 'Export Licensing Powers', sublabel: 'Dual-use tools · Moderate', effect: 'moderate' },
      { value: 'high', label: 'State-Owned / Command', sublabel: 'Direct authority · Strengthens leverage', effect: 'helps' },
    ],
  },
};

export default function LeverageSimulator({
  chokepoints,
  cases,
  initialRowId,
}: LeverageSimulatorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>(initialRowId || 'C32'); // Default to C32 (ASML EUV)
  const [activeCaseDetail, setActiveCaseDetail] = useState<CaseId>('K5');

  // Initial scores from default row
  const defaultRow = chokepoints.find((r) => r.row_id === (initialRowId || 'C32')) || chokepoints[0];
  const [scores, setScores] = useState<Record<VariableId, Level>>({
    concentration: defaultRow.concentration,
    substitutability: defaultRow.substitutability,
    time_to_replace: defaultRow.time_to_replace,
    cohesion: defaultRow.cohesion,
    dependence_on_target: defaultRow.dependence_on_target,
    state_control: defaultRow.state_control,
  });

  const handlePresetChange = (rowId: string) => {
    setSelectedPreset(rowId);
    if (rowId === 'custom') return;
    const found = chokepoints.find((r) => r.row_id === rowId);
    if (found) {
      setScores({
        concentration: found.concentration,
        substitutability: found.substitutability,
        time_to_replace: found.time_to_replace,
        cohesion: found.cohesion,
        dependence_on_target: found.dependence_on_target,
        state_control: found.state_control,
      });
      setActiveCaseDetail(found.closestCases[0] || 'K5');
    }
  };

  const handleVariableChange = (v: VariableId, level: Level) => {
    setSelectedPreset('custom');
    setScores((prev) => ({
      ...prev,
      [v]: level,
    }));
  };

  // Live distance calculation
  const distances = useMemo(() => {
    return calculateDistances(scores, cases);
  }, [scores, cases]);

  const closestCases = useMemo(() => {
    return getClosestCases(distances);
  }, [distances]);

  const policyReading = useMemo(() => {
    return generatePolicyReading(closestCases, distances, scores);
  }, [closestCases, distances, scores]);

  const selectedCaseObj = cases.find((c) => c.case_id === activeCaseDetail) || cases[0];

  return (
    <section id="simulator" className="py-10 bg-app-card border-b border-app-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-muted uppercase tracking-wider">
              <Sliders size={14} />
              <span>Step 4 Profile Engine · Live Precedent Distance</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-navy-primary tracking-tight mt-1">
              Leverage Simulator
            </h2>
            <p className="text-xs sm:text-sm text-body-secondary mt-0.5">
              Evaluate any of the 35 chokepoint inputs or model custom geopolitical scenarios across the six variables.
            </p>
          </div>

          {/* Preset Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-body-secondary">Preset:</span>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="py-1.5 px-3 text-xs bg-app-bg border border-app-border rounded-md text-navy-primary font-medium focus:outline-none focus:ring-1 focus:ring-navy-secondary"
              aria-label="Preset chokepoint selector"
            >
              <option value="custom">Custom Configuration</option>
              <optgroup label="Key Chokepoint Presets">
                <option value="C32">C32 · ASML EUV Lithography (NL, 100%)</option>
                <option value="C42">C42 · TSMC Leading-Edge Logic Fabs (TW, 69%)</option>
                <option value="C19">C19 · Tokyo Electron Resist Processing (JP, 95.2%)</option>
                <option value="C39">C39 · SK hynix/Samsung HBM Memory (KR, 81%)</option>
                <option value="C08">C08 · Disco Crystal Machining (JP, 99.7%)</option>
                <option value="C35">C35 · Kulicke &amp; Soffa Ball Bonders (SG, 90.9%)</option>
              </optgroup>
              <optgroup label="All 35 Chokepoint Rows">
                {chokepoints.map((cp) => (
                  <option key={cp.row_id} value={cp.row_id}>
                    {cp.row_id} · {cp.country} · {cp.input} ({cp.share.toFixed(0)}%)
                  </option>
                ))}
              </optgroup>
            </select>
            {selectedPreset === 'custom' && (
              <button
                type="button"
                onClick={() => handlePresetChange('C32')}
                className="p-1.5 text-slate-muted hover:text-navy-primary hover:bg-app-bg rounded border border-app-border"
                title="Reset to default preset"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Two-Column Desktop Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Six Variables Controls */}
          <div className="lg:col-span-7 space-y-4">
            {VARIABLES.map((v) => {
              const meta = VARIABLE_OPTIONS[v];
              const currentVal = scores[v];

              return (
                <div
                  key={v}
                  className="p-4 rounded-card border border-app-border bg-white shadow-xs space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="text-sm font-semibold text-navy-primary">
                      {meta.name}
                    </span>
                    <span className="text-[11px] text-body-secondary italic">
                      {meta.question}
                    </span>
                  </div>

                  {/* Segmented Control for 3 Levels */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {meta.options.map((opt) => {
                      const isSelected = currentVal === opt.value;
                      let badgeStyle = 'bg-app-bg text-body-secondary border-app-border';

                      if (isSelected) {
                        if (opt.effect === 'helps') {
                          badgeStyle =
                            'bg-status-success-bg text-status-success-text border-status-success-border font-semibold shadow-xs';
                        } else if (opt.effect === 'hurts') {
                          badgeStyle =
                            'bg-status-danger-bg text-status-danger-text border-status-danger-border font-semibold shadow-xs';
                        } else {
                          badgeStyle =
                            'bg-blue-grey-light text-navy-primary border-slate-muted/40 font-semibold shadow-xs';
                        }
                      }

                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleVariableChange(v, opt.value)}
                          className={`p-2 rounded-md border text-left transition-all ${
                            isSelected
                              ? badgeStyle
                              : 'bg-app-bg/60 border-app-border text-body-secondary hover:bg-app-bg hover:text-body-primary'
                          }`}
                        >
                          <div className="text-xs font-medium leading-snug">
                            {opt.label}
                          </div>
                          <div className="text-[10px] text-slate-muted mt-0.5 leading-tight">
                            {opt.sublabel}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Live Precedent Results */}
          <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
            {/* Live Distance Match Card */}
            <div className="p-5 rounded-card border border-app-border bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-app-border pb-3">
                <div>
                  <span className="text-xs font-mono font-medium text-slate-muted uppercase tracking-wider block">
                    Mathematical Distance
                  </span>
                  <span className="text-base font-semibold text-navy-primary">
                    Historical Precedent Comparison
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-body-secondary font-mono">0 = exact match</span>
                </div>
              </div>

              {/* Precedents Horizontal Bar Distance Comparison */}
              <div className="space-y-2.5">
                {(['K1', 'K2', 'K3', 'K4', 'K5'] as CaseId[]).map((cid) => {
                  const dist = distances[cid];
                  const isClosest = closestCases.includes(cid);
                  const outcome = CASE_OUTCOMES[cid];
                  const maxPossibleDistance = 12;
                  const pct = Math.max(8, (dist / maxPossibleDistance) * 100);

                  let outcomeBadgeClass = 'text-status-danger-text bg-status-danger-bg border-status-danger-border';
                  if (outcome === 'partly worked') {
                    outcomeBadgeClass = 'text-status-success-text bg-status-success-bg border-status-success-border';
                  } else if (outcome === 'failed') {
                    outcomeBadgeClass = 'text-status-warning-text bg-status-warning-bg border-status-warning-border';
                  }

                  return (
                    <div
                      key={cid}
                      onClick={() => setActiveCaseDetail(cid)}
                      className={`p-2.5 rounded-md border transition-all cursor-pointer ${
                        activeCaseDetail === cid
                          ? 'border-navy-secondary bg-blue-grey-light/30 ring-1 ring-navy-secondary'
                          : isClosest
                          ? 'border-navy-secondary/60 bg-white'
                          : 'border-app-border bg-app-bg/40 hover:bg-app-bg'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-navy-primary">{cid}</span>
                          <span className="font-medium text-body-primary truncate max-w-[170px]">
                            {CASE_NAMES[cid]}
                          </span>
                          {isClosest && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-navy-secondary text-white">
                              Closest
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border capitalize ${outcomeBadgeClass}`}>
                            {outcome}
                          </span>
                          <span className="font-mono font-semibold text-navy-primary text-xs w-6 text-right">
                            {dist}
                          </span>
                        </div>
                      </div>

                      {/* Visual Distance Bar */}
                      <div className="w-full h-1.5 bg-app-border rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isClosest
                              ? outcome === 'partly worked'
                                ? 'bg-status-success-text'
                                : 'bg-navy-secondary'
                              : 'bg-slate-muted/60'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Variable-by-Variable Distance Breakdown */}
              <div className="pt-2 border-t border-app-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-navy-primary">
                    Distance Breakdown vs {selectedCaseObj.case_id} ({selectedCaseObj.case.split(',')[0]})
                  </span>
                  <span className="font-mono text-slate-muted">
                    Total: {distances[selectedCaseObj.case_id]} steps
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                  {VARIABLES.map((v) => {
                    const diff = Math.abs(LEVEL_MAP[scores[v]] - LEVEL_MAP[selectedCaseObj[v]]);
                    const currentVal = scores[v];
                    const targetVal = selectedCaseObj[v];

                    return (
                      <div
                        key={v}
                        className="p-1.5 rounded bg-app-bg border border-app-border flex items-center justify-between"
                      >
                        <span className="text-body-secondary capitalize truncate max-w-[95px]">
                          {v.replace(/_/g, ' ')}:
                        </span>
                        <div className="flex items-center gap-1 font-mono">
                          <span className="text-slate-muted capitalize text-[10px]">
                            {currentVal[0].toUpperCase()} vs {targetVal[0].toUpperCase()}
                          </span>
                          <span
                            className={`font-semibold px-1 rounded ${
                              diff === 0
                                ? 'bg-status-success-bg text-status-success-text'
                                : diff === 1
                                ? 'bg-status-warning-bg text-status-warning-text'
                                : 'bg-status-danger-bg text-status-danger-text'
                            }`}
                          >
                            +{diff}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Policy Reading Callout (Set Visually Apart) */}
            <div
              className={`p-5 rounded-card border shadow-sm space-y-2.5 ${
                policyReading.verdictType === 'success'
                  ? 'bg-status-success-bg/40 border-status-success-border'
                  : policyReading.verdictType === 'danger'
                  ? 'bg-status-danger-bg/40 border-status-danger-border'
                  : 'bg-status-warning-bg/40 border-status-warning-border'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-muted">
                  Geopolitical Reading
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                    policyReading.verdictType === 'success'
                      ? 'bg-status-success-bg text-status-success-text border-status-success-border'
                      : policyReading.verdictType === 'danger'
                      ? 'bg-status-danger-bg text-status-danger-text border-status-danger-border'
                      : 'bg-status-warning-bg text-status-warning-text border-status-warning-border'
                  }`}
                >
                  {policyReading.verdictTag}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-navy-primary">
                {policyReading.title}
              </h4>

              <p className="text-xs text-body-primary leading-relaxed font-normal">
                {policyReading.summary}
              </p>

              <div className="pt-2 border-t border-app-border/80 space-y-1.5 text-xs">
                <div>
                  <strong className="text-navy-primary font-semibold">Structural Mechanics: </strong>
                  <span className="text-body-primary leading-relaxed">
                    {policyReading.structuralReason}
                  </span>
                </div>
                <div>
                  <strong className="text-navy-primary font-semibold">Condition vs Cutoff Rule: </strong>
                  <span className="text-body-primary leading-relaxed">
                    {policyReading.strategicGuidance}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

