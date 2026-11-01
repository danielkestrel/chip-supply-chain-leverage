'use client';

import { useState } from 'react';
import { Ask, AskId } from '@/types';
import { ShieldCheck, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Layers } from 'lucide-react';

interface SafetyPolicyProps {
  asks: Ask[];
}

export default function SafetyPolicy({ asks }: SafetyPolicyProps) {
  const [expandedAsks, setExpandedAsks] = useState<Record<string, boolean>>({
    A1: true,
    A3: true,
  });

  const toggleAsk = (id: string) => {
    setExpandedAsks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getVerdictBadge = (verdict: 'coordinate on' | 'avoid') => {
    if (verdict === 'coordinate on') {
      return {
        text: 'Coordinate On',
        class: 'bg-status-success-bg text-status-success-text border-status-success-border',
      };
    }
    return {
      text: 'Avoid',
      class: 'bg-status-danger-bg text-status-danger-text border-status-danger-border',
    };
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'condition':
        return { text: 'Condition on Supply', class: 'text-navy-secondary bg-blue-grey-light border-app-border' };
      case 'cutoff':
        return { text: 'Cutoff / Threat', class: 'text-status-danger-text bg-status-danger-bg border-status-danger-border' };
      case 'supply management':
        return { text: 'Supply Management', class: 'text-status-warning-text bg-status-warning-bg border-status-warning-border' };
      default:
        return { text: type, class: 'text-body-secondary bg-app-bg border-app-border' };
    }
  };

  const coordinateList = asks.filter((a) => a.verdict === 'coordinate on');
  const avoidList = asks.filter((a) => a.verdict === 'avoid');

  return (
    <section id="policy" className="py-10 bg-app-card border-b border-app-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-muted uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>Step 5 &amp; 6 Synthesis · AI Governance Strategy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-navy-primary tracking-tight mt-1">
              AI Safety Policy Verdicts
            </h2>
            <p className="text-xs sm:text-sm text-body-secondary mt-0.5">
              Evaluating candidate safety asks against geopolitical credibility: sorting conditions that work from threats that backfire.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-muted">
            3 Coordinate On · 4 Avoid
          </div>
        </div>

        {/* Condition vs Cutoff Core Distinction Banner */}
        <div className="p-5 rounded-card bg-blue-grey-light/50 border border-app-border space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-navy-secondary"></span>
            <h3 className="text-sm font-semibold text-navy-primary uppercase tracking-wider">
              The Strategic Mechanism: Conditions vs. Cutoffs
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-body-primary leading-relaxed font-normal">
            Middle powers hold substantial technical and tool bottlenecks, but 32 of 35 chokepoints depend on the US as a vital security guarantor. 
            <strong> Threats to cutoff supply backfire</strong> by triggering allied replacement programs, WTO challenges, and diplomatic backlash (as in 2010 China and 2019 Japan). 
            Conversely, <strong>conditions attached to continued supply</strong> that align with existing US domestic policy currents (anti-diversion, pre-deployment evaluations, verification standards) possess high geopolitical durability.
          </p>
        </div>

        {/* 3x3 Credibility vs Safety Value Matrix */}
        <div className="p-6 rounded-card bg-app-card border border-app-border shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-app-border pb-3">
            <div>
              <h3 className="text-sm font-semibold text-navy-primary uppercase tracking-wider">
                3×3 Strategic Matrix: Credibility vs. Safety Value
              </h3>
              <p className="text-xs text-body-secondary mt-0.5">
                Pre-defined rule: Asks are placed in &ldquo;Coordinate On&rdquo; if both credible and worth having; otherwise &ldquo;Avoid&rdquo;.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-muted">Rule fixed prior to scoring</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[560px] grid grid-cols-4 gap-2.5 text-xs text-center">
              {/* Corner Header */}
              <div className="p-2.5 bg-app-bg rounded-md border border-app-border flex items-center justify-center font-mono font-semibold text-slate-muted text-[11px]">
                Credibility ↓ / Safety →
              </div>
              <div className="p-2.5 bg-app-bg rounded-md border border-app-border font-semibold text-slate-muted uppercase font-mono text-[11px]">
                Low Safety Value
              </div>
              <div className="p-2.5 bg-app-bg rounded-md border border-app-border font-semibold text-slate-muted uppercase font-mono text-[11px]">
                Medium Safety Value
              </div>
              <div className="p-2.5 bg-app-bg rounded-md border border-app-border font-semibold text-slate-muted uppercase font-mono text-[11px]">
                High Safety Value
              </div>

              {/* Row 1: High Credibility */}
              <div className="p-3 bg-app-bg rounded-md border border-app-border flex items-center justify-center font-semibold font-mono text-navy-primary">
                High
              </div>
              <div className="p-3 bg-app-card rounded-md border border-dashed border-app-border flex items-center justify-center text-slate-muted italic text-[11px]">
                —
              </div>
              <div className="p-3 bg-app-card rounded-md border border-dashed border-app-border flex items-center justify-center text-slate-muted italic text-[11px]">
                —
              </div>
              <div className="p-3 bg-status-success-bg/50 rounded-md border border-status-success-border flex flex-col items-center justify-center space-y-1">
                <span className="font-bold text-status-success-text text-sm font-mono">A1</span>
                <span className="text-[11px] text-navy-primary font-medium">Shared Anti-Diversion Checks</span>
                <span className="text-[10px] text-status-success-text font-semibold uppercase">Coordinate On</span>
              </div>

              {/* Row 2: Medium Credibility */}
              <div className="p-3 bg-app-bg rounded-md border border-app-border flex items-center justify-center font-semibold font-mono text-navy-primary">
                Medium
              </div>
              <div className="p-3 bg-app-card rounded-md border border-dashed border-app-border flex items-center justify-center text-slate-muted italic text-[11px]">
                —
              </div>
              <div className="p-3 bg-status-success-bg/50 rounded-md border border-status-success-border flex flex-col items-center justify-center space-y-1.5">
                <div className="space-y-0.5">
                  <span className="font-bold text-status-success-text font-mono">A2</span>
                  <p className="text-[11px] text-navy-primary font-medium leading-tight">Frontier Model Access</p>
                </div>
                <div className="space-y-0.5 pt-1 border-t border-status-success-border/60 w-full">
                  <span className="font-bold text-status-success-text font-mono">A4</span>
                  <p className="text-[11px] text-navy-primary font-medium leading-tight">Hardware Verification</p>
                </div>
                <span className="text-[10px] text-status-success-text font-semibold uppercase">Coordinate On</span>
              </div>
              <div className="p-3 bg-app-card rounded-md border border-dashed border-app-border flex items-center justify-center text-slate-muted italic text-[11px]">
                —
              </div>

              {/* Row 3: Low Credibility */}
              <div className="p-3 bg-app-bg rounded-md border border-app-border flex items-center justify-center font-semibold font-mono text-navy-primary">
                Low
              </div>
              <div className="p-3 bg-status-danger-bg/40 rounded-md border border-status-danger-border flex flex-col items-center justify-center space-y-1.5">
                <div>
                  <span className="font-bold text-status-danger-text font-mono">A5</span>
                  <p className="text-[11px] text-body-primary font-medium">Withholding Supply</p>
                </div>
                <div className="pt-1 border-t border-status-danger-border/60 w-full">
                  <span className="font-bold text-status-danger-text font-mono">A6</span>
                  <p className="text-[11px] text-body-primary font-medium">Price Coordination</p>
                </div>
                <span className="text-[10px] text-status-danger-text font-semibold uppercase">Avoid</span>
              </div>
              <div className="p-3 bg-status-danger-bg/40 rounded-md border border-status-danger-border flex flex-col items-center justify-center space-y-1">
                <span className="font-bold text-status-danger-text font-mono">A7</span>
                <span className="text-[11px] text-body-primary font-medium">Threat to Sell to China</span>
                <span className="text-[10px] text-status-danger-text font-semibold uppercase">Avoid</span>
              </div>
              <div className="p-3 bg-status-danger-bg/40 rounded-md border border-status-danger-border flex flex-col items-center justify-center space-y-1">
                <span className="font-bold text-status-danger-text font-mono">A3</span>
                <span className="text-[11px] text-body-primary font-medium">Binding Compute Conditions</span>
                <span className="text-[10px] text-status-danger-text font-semibold uppercase">Avoid (Tension)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Final Verdict Groups (Side by Side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coordinate On Group */}
          <div className="p-5 rounded-card bg-status-success-bg/30 border border-status-success-border space-y-3">
            <div className="flex items-center gap-2 text-status-success-text font-semibold text-xs uppercase tracking-wider border-b border-status-success-border/60 pb-2">
              <CheckCircle2 size={16} />
              <span>Coordinate On (Credible and Worth Having)</span>
            </div>
            <div className="space-y-2.5">
              {coordinateList.map((a) => (
                <div key={a.id} className="p-3 rounded-lg bg-white border border-app-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-navy-primary text-xs">{a.id}</span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded bg-status-success-bg text-status-success-text border border-status-success-border">
                      {a.credibility} credibility · {a.safety_value} safety
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-navy-primary">{a.item}</h4>
                  <p className="text-[11px] text-body-secondary leading-relaxed">
                    <strong>Why it works:</strong> {a.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Avoid Group */}
          <div className="p-5 rounded-card bg-status-danger-bg/30 border border-status-danger-border space-y-3">
            <div className="flex items-center gap-2 text-status-danger-text font-semibold text-xs uppercase tracking-wider border-b border-status-danger-border/60 pb-2">
              <XCircle size={16} />
              <span>Avoid (Not Credible or Likely to Backfire)</span>
            </div>
            <div className="space-y-2.5">
              {avoidList.map((a) => (
                <div key={a.id} className="p-3 rounded-lg bg-white border border-app-border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-navy-primary text-xs">{a.id}</span>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded bg-status-danger-bg text-status-danger-text border border-status-danger-border">
                      {a.credibility} credibility · {a.safety_value} safety
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-navy-primary">{a.item}</h4>
                  <p className="text-[11px] text-body-secondary leading-relaxed">
                    <strong>Why avoid:</strong> {a.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Structured Asks Table (A1 to A7) */}
        <div className="bg-app-card rounded-card border border-app-border shadow-sm overflow-hidden space-y-3">
          <div className="p-4 border-b border-app-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-navy-primary uppercase tracking-wider">
              Complete Assessment of Candidate Asks (A1 to A7)
            </h3>
            <span className="text-xs text-slate-muted font-mono">Expand rows for detailed requirements</span>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-app-bg border-b border-app-border text-[11px] font-mono uppercase text-slate-muted">
                  <th className="py-2.5 px-3">Ask ID &amp; Item</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Needs Threat / Condition?</th>
                  <th className="py-2.5 px-3">Safety Value</th>
                  <th className="py-2.5 px-3">Credibility</th>
                  <th className="py-2.5 px-3 text-right">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border font-normal">
                {asks.map((a) => {
                  const isExpanded = expandedAsks[a.id] ?? false;
                  const vBadge = getVerdictBadge(a.verdict);
                  const tBadge = getTypeBadge(a.type);

                  return (
                    <tr
                      key={a.id}
                      onClick={() => toggleAsk(a.id)}
                      className="cursor-pointer hover:bg-app-bg/60 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-navy-primary">{a.id}</span>
                          <span className="font-semibold text-navy-primary">{a.item}</span>
                        </div>
                        {isExpanded && (
                          <div className="pt-2.5 mt-2 border-t border-app-border/80 space-y-1.5 text-[11px] text-body-secondary">
                            <div>
                              <strong className="text-navy-primary">What it requires of the US:</strong>{' '}
                              {a.requires_of_us}
                            </div>
                            <div>
                              <strong className="text-navy-primary">Risk reduced:</strong>{' '}
                              {a.risk_reduced || 'None'}
                            </div>
                            <div>
                              <strong className="text-navy-primary">Who must agree:</strong>{' '}
                              {a.who_must_agree}
                            </div>
                            <div>
                              <strong className="text-navy-primary">Directness:</strong> {a.directness}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap align-top">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-mono border ${tBadge.class}`}>
                          {tBadge.text}
                        </span>
                      </td>
                      <td className="py-3 px-3 align-top text-[11px] text-body-secondary max-w-xs">
                        {a.needs_threat_or_condition}
                      </td>
                      <td className="py-3 px-3 align-top whitespace-nowrap font-mono capitalize">
                        <span
                          className={`px-1.5 py-0.2 rounded font-semibold ${
                            a.safety_value === 'high'
                              ? 'text-status-success-text'
                              : a.safety_value === 'medium'
                              ? 'text-status-warning-text'
                              : 'text-slate-muted'
                          }`}
                        >
                          {a.safety_value}
                        </span>
                      </td>
                      <td className="py-3 px-3 align-top whitespace-nowrap font-mono capitalize">
                        <span
                          className={`px-1.5 py-0.2 rounded font-semibold ${
                            a.credibility === 'high'
                              ? 'text-status-success-text'
                              : a.credibility === 'medium'
                              ? 'text-status-warning-text'
                              : 'text-status-danger-text'
                          }`}
                        >
                          {a.credibility}
                        </span>
                      </td>
                      <td className="py-3 px-3 align-top text-right whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold border ${vBadge.class}`}>
                          {vBadge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-app-border">
            {asks.map((a) => {
              const isExpanded = expandedAsks[a.id] ?? false;
              const vBadge = getVerdictBadge(a.verdict);
              const tBadge = getTypeBadge(a.type);

              return (
                <div key={a.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-navy-primary">{a.id}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${tBadge.class}`}>
                        {tBadge.text}
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${vBadge.class}`}>
                      {vBadge.text}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-navy-primary">{a.item}</h4>

                  <div className="flex items-center gap-3 text-[11px] font-mono text-body-secondary">
                    <span>Safety: <strong className="capitalize">{a.safety_value}</strong></span>
                    <span>·</span>
                    <span>Credibility: <strong className="capitalize">{a.credibility}</strong></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleAsk(a.id)}
                    className="text-[11px] text-navy-secondary font-medium hover:underline flex items-center gap-1 pt-1"
                  >
                    <span>{isExpanded ? 'Hide requirements' : 'Show requirements'}</span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {isExpanded && (
                    <div className="pt-2 border-t border-app-border space-y-1 text-[11px] text-body-secondary leading-relaxed">
                      <div>
                        <strong className="text-navy-primary">Demands on US:</strong> {a.requires_of_us}
                      </div>
                      <div>
                        <strong className="text-navy-primary">Risk reduced:</strong> {a.risk_reduced || 'None'}
                      </div>
                      <div>
                        <strong className="text-navy-primary">Who must agree:</strong> {a.who_must_agree}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Methodological & Sensitivity Notes Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-app-bg border border-app-border space-y-1.5 text-xs text-body-secondary">
            <span className="text-navy-primary font-semibold block uppercase tracking-wider text-[11px]">
              Sensitivity Analysis: Disputed Precedent Impact
            </span>
            <p className="leading-relaxed">
              <strong>Only a single verdict flips under alternative historical readings:</strong> If Japan&rsquo;s 2019 materials restrictions on South Korea (K5) are reclassified as &ldquo;partly worked&rdquo; (because Korea implemented its own victim compensation plan in 2023), <strong>A3 (Binding Safety Conditions) flips from Avoid to Coordinate On</strong>. The other 6 verdicts remain invariant under all sensitivity tests.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-app-bg border border-app-border space-y-1.5 text-xs text-body-secondary">
            <span className="text-navy-primary font-semibold block uppercase tracking-wider text-[11px]">
              Safety-Value Methodological Rule
            </span>
            <p className="leading-relaxed">
              Safety-value scores are judgments against a strict rule fixed prior to scoring: <strong>High</strong> if the mechanism acts directly on physical compute deployment or frontier lab practices; <strong>Medium</strong> if an enabler for subsequent verification; <strong>Low</strong> if link is tenuous or induces counter-productive racing dynamics.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

