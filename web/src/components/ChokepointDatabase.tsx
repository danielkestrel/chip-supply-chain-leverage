'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChokepointRow, CaseId, Level } from '@/types';
import { Search, Filter, X, ExternalLink, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import { CASE_NAMES, CASE_OUTCOMES } from '@/lib/simulator';

interface ChokepointDatabaseProps {
  rows: ChokepointRow[];
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  onOpenInSimulator?: (row: ChokepointRow) => void;
}

type SortField = 'row_id' | 'country' | 'input' | 'share' | 'time_to_replace' | 'closest';
type SortOrder = 'asc' | 'desc';

export default function ChokepointDatabase({
  rows,
  selectedCountry,
  onSelectCountry,
  onOpenInSimulator,
}: ChokepointDatabaseProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTtr, setSelectedTtr] = useState<string>('All');
  const [selectedStep, setSelectedStep] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('share');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [activeRow, setActiveRow] = useState<ChokepointRow | null>(null);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveRow(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const uniqueCountries = useMemo(() => {
    const set = new Set(rows.map((r) => r.country));
    return ['All', ...Array.from(set).sort()];
  }, [rows]);

  const uniqueSteps = useMemo(() => {
    const set = new Set(rows.map((r) => r.step));
    return ['All', ...Array.from(set).sort()];
  }, [rows]);

  // Filtering & Sorting
  const filteredRows = useMemo(() => {
    return rows
      .filter((r) => {
        // Country filter
        if (selectedCountry !== 'All' && r.country !== selectedCountry) return false;
        // Time to replace filter
        if (selectedTtr === '>5 Years' && r.time_to_replace !== 'high') return false;
        if (selectedTtr === '2–5 Years' && r.time_to_replace !== 'medium') return false;
        if (selectedTtr === '<2 Years' && r.time_to_replace !== 'low') return false;
        // Step filter
        if (selectedStep !== 'All' && r.step !== selectedStep) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchInput = r.input.toLowerCase().includes(q);
          const matchCountry = r.country.toLowerCase().includes(q);
          const matchFirm = r.firm.toLowerCase().includes(q);
          const matchStep = r.step.toLowerCase().includes(q);
          const matchId = r.row_id.toLowerCase().includes(q);
          if (!matchInput && !matchCountry && !matchFirm && !matchStep && !matchId) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA: string | number = '';
        let valB: string | number = '';

        if (sortField === 'share') {
          valA = a.share;
          valB = b.share;
        } else if (sortField === 'row_id') {
          valA = a.row_id;
          valB = b.row_id;
        } else if (sortField === 'country') {
          valA = a.country;
          valB = b.country;
        } else if (sortField === 'input') {
          valA = a.input;
          valB = b.input;
        } else if (sortField === 'time_to_replace') {
          const ttrRank = { high: 3, medium: 2, low: 1 };
          valA = ttrRank[a.time_to_replace];
          valB = ttrRank[b.time_to_replace];
        } else if (sortField === 'closest') {
          valA = a.closestString;
          valB = b.closestString;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [rows, selectedCountry, selectedTtr, selectedStep, searchQuery, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'share' ? 'desc' : 'asc');
    }
  };

  const getTtrLabel = (level: Level) => {
    switch (level) {
      case 'high':
        return { text: '> 5 Years', class: 'text-status-success-text bg-status-success-bg border-status-success-border' };
      case 'medium':
        return { text: '2 – 5 Years', class: 'text-body-primary bg-app-bg border-app-border' };
      case 'low':
        return { text: '< 2 Years', class: 'text-status-danger-text bg-status-danger-bg border-status-danger-border' };
    }
  };

  return (
    <section id="database" className="py-10 bg-app-bg border-b border-app-border">
      <div className="max-w-site mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono font-medium text-slate-muted uppercase tracking-wider">
              Step 4 Scoring Sheet · Empirical Dataset
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-navy-primary tracking-tight mt-1">
              Chokepoint Database
            </h2>
            <p className="text-xs sm:text-sm text-body-secondary mt-0.5">
              35 scored semiconductor chokepoint inputs where non-US/China middle powers hold &ge;40% of world supply.
            </p>
          </div>
          <div className="text-xs text-body-secondary font-mono">
            Showing <strong className="text-navy-primary">{filteredRows.length}</strong> of {rows.length} rows
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-app-card p-4 rounded-card border border-app-border shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by input name, firm, country, or row ID..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-app-bg border border-app-border rounded-md text-body-primary placeholder:text-body-secondary focus:outline-none focus:ring-1 focus:ring-navy-secondary focus:border-navy-secondary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-body-secondary hover:text-navy-primary"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Country Filter */}
            <div className="md:col-span-3">
              <select
                value={selectedCountry}
                onChange={(e) => onSelectCountry(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-app-bg border border-app-border rounded-md text-body-primary focus:outline-none focus:ring-1 focus:ring-navy-secondary"
                aria-label="Filter by country"
              >
                {uniqueCountries.map((c) => (
                  <option key={c} value={c}>
                    Country: {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Time to Replace Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedTtr}
                onChange={(e) => setSelectedTtr(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-app-bg border border-app-border rounded-md text-body-primary focus:outline-none focus:ring-1 focus:ring-navy-secondary"
                aria-label="Filter by replacement time"
              >
                <option value="All">Replace Time: All</option>
                <option value=">5 Years">&gt; 5 Years (8 rows)</option>
                <option value="2–5 Years">2 – 5 Years (24 rows)</option>
                <option value="<2 Years">&lt; 2 Years (3 rows)</option>
              </select>
            </div>

            {/* Step Filter */}
            <div className="md:col-span-2">
              <select
                value={selectedStep}
                onChange={(e) => setSelectedStep(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-app-bg border border-app-border rounded-md text-body-primary focus:outline-none focus:ring-1 focus:ring-navy-secondary truncate"
                aria-label="Filter by supply chain step"
              >
                <option value="All">Step: All Steps</option>
                {uniqueSteps.filter((s) => s !== 'All').map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Filter Reset */}
          {(searchQuery || selectedCountry !== 'All' || selectedTtr !== 'All' || selectedStep !== 'All') && (
            <div className="flex items-center gap-2 pt-2 border-t border-app-border text-xs text-body-secondary">
              <span>Active filters:</span>
              {selectedCountry !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-grey-light text-navy-primary font-mono text-[11px]">
                  {selectedCountry}
                  <button type="button" onClick={() => onSelectCountry('All')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedTtr !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-grey-light text-navy-primary font-mono text-[11px]">
                  {selectedTtr}
                  <button type="button" onClick={() => setSelectedTtr('All')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedStep !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-grey-light text-navy-primary font-mono text-[11px]">
                  {selectedStep}
                  <button type="button" onClick={() => setSelectedStep('All')}>
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  onSelectCountry('All');
                  setSelectedTtr('All');
                  setSelectedStep('All');
                }}
                className="text-navy-secondary hover:underline ml-auto font-medium"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* Database Table (Desktop) / Cards (Mobile) */}
        <div className="bg-app-card rounded-card border border-app-border shadow-sm overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs text-body-primary border-collapse">
              <thead>
                <tr className="bg-app-bg border-b border-app-border text-[11px] uppercase tracking-wider text-slate-muted font-semibold select-none">
                  <th
                    className="py-2.5 px-3 cursor-pointer hover:text-navy-primary"
                    onClick={() => handleSort('row_id')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Row</span>
                      {sortField === 'row_id' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-3 cursor-pointer hover:text-navy-primary"
                    onClick={() => handleSort('country')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Country</span>
                      {sortField === 'country' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-3 cursor-pointer hover:text-navy-primary"
                    onClick={() => handleSort('input')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Input & Dominant Supplier</span>
                      {sortField === 'input' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-3 cursor-pointer hover:text-navy-primary text-right"
                    onClick={() => handleSort('share')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>World Share</span>
                      {sortField === 'share' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                    </div>
                  </th>
                  <th className="py-2.5 px-3">Step</th>
                  <th
                    className="py-2.5 px-3 cursor-pointer hover:text-navy-primary"
                    onClick={() => handleSort('time_to_replace')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Time to Replace</span>
                      {sortField === 'time_to_replace' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                    </div>
                  </th>
                  <th
                    className="py-2.5 px-3 cursor-pointer hover:text-navy-primary"
                    onClick={() => handleSort('closest')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Closest Past Case</span>
                      {sortField === 'closest' && (sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border font-normal">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-muted">
                      No chokepoints match the active filters.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((r) => {
                    const ttr = getTtrLabel(r.time_to_replace);
                    const isSelected = activeRow?.row_id === r.row_id;
                    const hasCaveats = r.caveats.length > 0;

                    return (
                      <tr
                        key={r.row_id}
                        onClick={() => setActiveRow(r)}
                        className={`cursor-pointer transition-colors hover:bg-blue-grey-light/40 ${
                          isSelected ? 'bg-blue-grey-light/60 font-medium' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-muted whitespace-nowrap">
                          {r.row_id}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="font-semibold text-navy-primary">{r.country}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-medium text-navy-primary flex items-center gap-1.5">
                            <span>{r.input}</span>
                            {hasCaveats && (
                              <span
                                title="Data caveat applies to this row"
                                className="text-status-warning-text shrink-0"
                              >
                                <AlertCircle size={13} />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-body-secondary truncate max-w-sm">
                            {r.firm}
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-semibold text-navy-primary">
                          {r.share.toFixed(1)}%
                          <span className="text-[10px] text-body-secondary font-normal ml-1">
                            ({r.year})
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[11px] text-body-secondary">
                          {r.step}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono border ${ttr.class}`}
                          >
                            {ttr.text}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-body-secondary">
                          {r.closestString}
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveRow(r);
                            }}
                            className="px-2 py-1 rounded text-[11px] font-medium text-navy-secondary hover:text-navy-primary hover:bg-white border border-transparent hover:border-app-border transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-app-border">
            {filteredRows.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-muted">
                No chokepoints match the active filters.
              </div>
            ) : (
              filteredRows.map((r) => {
                const ttr = getTtrLabel(r.time_to_replace);
                return (
                  <div
                    key={r.row_id}
                    onClick={() => setActiveRow(r)}
                    className="p-3.5 space-y-2 hover:bg-app-bg cursor-pointer active:bg-blue-grey-light/50"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] text-slate-muted">{r.row_id}</span>
                        <span className="font-semibold text-navy-primary">{r.country}</span>
                      </div>
                      <span className="font-mono font-semibold text-navy-primary">
                        {r.share.toFixed(1)}% <span className="text-[10px] font-normal text-body-secondary">({r.year})</span>
                      </span>
                    </div>

                    <div className="text-xs font-medium text-navy-primary">{r.input}</div>
                    <div className="text-[11px] text-body-secondary">{r.firm}</div>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className={`inline-flex items-center px-1.5 py-0.2 rounded border font-mono ${ttr.class}`}>
                        {ttr.text}
                      </span>
                      <span className="font-mono text-body-secondary">
                        Closest: {r.closestString}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Small Market Rows Reference Note */}
        <div className="p-3 bg-app-card rounded-md border border-app-border text-xs text-body-secondary flex items-start gap-2">
          <span className="text-slate-muted shrink-0 mt-0.5">
            <AlertCircle size={14} />
          </span>
          <p className="leading-relaxed">
            <strong>Small market note:</strong> 7 passed country–input pairs with global market size under $100m were
            dropped from Step 4 scoring per research design (Austria imprint lithography C01; Germany crystal growing
            C04, manual wire bonders C05; Japan direct write C10; Singapore wedge bonders C36, integrated assembly C37,
            stud bonders C38). They remain counted in the 8-nation country set.
          </p>
        </div>
      </div>

      {/* Row Detail Drawer (Right side slide-out) */}
      {activeRow && (
        <div
          className="fixed inset-0 z-50 overflow-hidden bg-navy-primary/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-150"
          onClick={() => setActiveRow(null)}
        >
          <div
            className="w-full max-w-xl bg-app-card h-full shadow-2xl border-l border-app-border flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-app-border bg-app-bg flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-muted">
                  <span className="px-1.5 py-0.5 rounded bg-white border border-app-border font-semibold">
                    {activeRow.row_id}
                  </span>
                  <span>{activeRow.country}</span>
                  <span>·</span>
                  <span>ISO {activeRow.isoCode}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-navy-primary mt-1 tracking-tight">
                  {activeRow.input}
                </h3>
                <p className="text-xs text-body-secondary mt-0.5">{activeRow.firm}</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveRow(null)}
                className="p-1 rounded-md text-slate-muted hover:text-navy-primary hover:bg-white border border-transparent hover:border-app-border"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-5 space-y-6 flex-1 text-xs">
              {/* Primary Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 rounded bg-app-bg border border-app-border">
                  <span className="text-[10px] text-slate-muted uppercase font-mono block">World Share</span>
                  <span className="text-base font-semibold font-mono text-navy-primary">
                    {activeRow.share.toFixed(1)}%
                  </span>
                </div>
                <div className="p-2.5 rounded bg-app-bg border border-app-border">
                  <span className="text-[10px] text-slate-muted uppercase font-mono block">Data Year</span>
                  <span className="text-base font-semibold font-mono text-navy-primary">
                    {activeRow.year}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-app-bg border border-app-border">
                  <span className="text-[10px] text-slate-muted uppercase font-mono block">Step</span>
                  <span className="text-xs font-medium text-navy-primary truncate block mt-1">
                    {activeRow.step}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-app-bg border border-app-border">
                  <span className="text-[10px] text-slate-muted uppercase font-mono block">Target</span>
                  <span className="text-xs font-medium text-navy-primary truncate block mt-1">
                    {activeRow.target}
                  </span>
                </div>
              </div>

              {/* Data Caveats (if applicable to this row) */}
              {activeRow.caveats.length > 0 && (
                <div className="p-3 rounded-lg bg-status-warning-bg border border-status-warning-border space-y-1">
                  <div className="flex items-center gap-1.5 text-status-warning-text font-semibold text-[11px] uppercase tracking-wider">
                    <AlertCircle size={14} />
                    <span>Data Caveat Flagged</span>
                  </div>
                  {activeRow.caveats.map((c, idx) => (
                    <p key={idx} className="text-xs text-body-primary leading-relaxed">
                      {c}
                    </p>
                  ))}
                </div>
              )}

              {/* Six Variable Scores */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-app-border pb-1.5">
                  <span className="text-xs font-semibold text-navy-primary uppercase tracking-wider">
                    Six Variable Scores
                  </span>
                  <span className="text-[11px] text-slate-muted font-mono">Scored as of 2026</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-app-bg border border-app-border flex justify-between items-center">
                    <span className="text-body-secondary">Concentration:</span>
                    <span className="font-mono font-semibold capitalize text-navy-primary">
                      {activeRow.concentration}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-app-bg border border-app-border flex justify-between items-center">
                    <span className="text-body-secondary">Substitutability:</span>
                    <span className="font-mono font-semibold capitalize text-navy-primary">
                      {activeRow.substitutability}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-app-bg border border-app-border flex justify-between items-center">
                    <span className="text-body-secondary">Time to Replace:</span>
                    <span className="font-mono font-semibold capitalize text-navy-primary">
                      {activeRow.time_to_replace}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-app-bg border border-app-border flex justify-between items-center">
                    <span className="text-body-secondary">Cohesion:</span>
                    <span className="font-mono font-semibold capitalize text-navy-primary">
                      {activeRow.cohesion}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-app-bg border border-app-border flex justify-between items-center">
                    <span className="text-body-secondary">Dependence on US:</span>
                    <span className="font-mono font-semibold capitalize text-navy-primary">
                      {activeRow.dependence_on_target}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-app-bg border border-app-border flex justify-between items-center">
                    <span className="text-body-secondary">State Control:</span>
                    <span className="font-mono font-semibold capitalize text-navy-primary">
                      {activeRow.state_control}
                    </span>
                  </div>
                </div>
              </div>

              {/* Qualitative Evidence Narrative */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-navy-primary uppercase tracking-wider block">
                  Scoring Evidence & Context
                </span>
                <div className="p-3 rounded-lg bg-app-bg border border-app-border text-xs text-body-primary leading-relaxed whitespace-pre-line">
                  {activeRow.evidence}
                </div>
              </div>

              {/* Historical Precedent Distance Match */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-navy-primary uppercase tracking-wider block">
                  Closest Historical Precedent(s)
                </span>
                <div className="p-3 rounded-lg bg-blue-grey-light/60 border border-app-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-navy-primary">
                      {activeRow.closestString}
                    </span>
                    <span className="font-mono text-xs text-slate-muted">
                      Distance: {activeRow.distances[activeRow.closestCases[0]]} steps
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-body-secondary">
                    {activeRow.closestCases.map((cid) => (
                      <div key={cid} className="flex justify-between items-center">
                        <span>{CASE_NAMES[cid]}</span>
                        <span className="capitalize font-mono text-[10px] px-1.5 py-0.2 rounded border bg-white">
                          {CASE_OUTCOMES[cid]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Attribution and Source */}
              <div className="pt-2 border-t border-app-border space-y-1 text-[11px] text-body-secondary">
                <div>
                  <strong>Basis:</strong> {activeRow.basis}
                </div>
                <div>
                  <strong>Source:</strong> {activeRow.source}
                </div>
                {activeRow.source_url && (
                  <div className="pt-1">
                    <a
                      href={activeRow.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-navy-secondary hover:underline"
                    >
                      <span>View dataset documentation</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
                <div className="pt-1 text-[10px] text-slate-muted">
                  Scored by: {activeRow.scored_by}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-app-border bg-app-bg flex items-center justify-between">
              {onOpenInSimulator && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenInSimulator(activeRow);
                    setActiveRow(null);
                  }}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-navy-secondary text-white hover:bg-navy-primary transition-colors"
                >
                  Load in Leverage Simulator
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveRow(null)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-body-secondary hover:text-navy-primary hover:bg-app-card border border-app-border transition-colors ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
