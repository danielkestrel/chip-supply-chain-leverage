export type Level = 'low' | 'medium' | 'high';

export type VariableId =
  | 'concentration'
  | 'substitutability'
  | 'time_to_replace'
  | 'cohesion'
  | 'dependence_on_target'
  | 'state_control';

export type CaseId = 'K1' | 'K2' | 'K3' | 'K4' | 'K5';

export type AskId = 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7';

export interface ChokepointRow {
  row_id: string;
  country: string;
  isoCode: string;
  step: string;
  input: string;
  firm: string;
  share: number;
  year: number;
  target: string;
  concentration: Level;
  substitutability: Level;
  time_to_replace: Level;
  cohesion: Level;
  dependence_on_target: Level;
  state_control: Level;
  evidence: string;
  basis: string;
  source: string;
  source_url: string;
  scored_by: string;
  closestCases: CaseId[];
  closestString: string;
  distances: Record<CaseId, number>;
  caveats: string[];
}

export interface HistoricalCase {
  case_id: CaseId;
  case: string;
  who_used_leverage: string;
  target: string;
  concentration: Level;
  substitutability: Level;
  time_to_replace: Level;
  cohesion: Level;
  dependence_on_target: Level;
  state_control: Level;
  outcome: 'partly worked' | 'failed' | 'backfired';
  concentration_evidence: string;
  substitutability_evidence: string;
  time_to_replace_evidence: string;
  cohesion_evidence: string;
  dependence_on_target_evidence: string;
  state_control_evidence: string;
  sources: string;
  scored_by: string;
  what_the_supplier_wanted: string;
  how_the_target_responded: string;
  how_long_it_lasted: string;
  dispute_note?: string;
}

export interface Ask {
  id: AskId;
  item: string;
  kind: 'ask' | 'to avoid';
  type: 'condition' | 'cutoff' | 'supply management';
  requires_of_us: string;
  needs_threat_or_condition: string;
  safety_value: Level;
  risk_reduced: string;
  directness: string;
  who_must_agree: string;
  note: string;
  credibility: Level;
  verdict: 'coordinate on' | 'avoid';
}

export interface CountrySummary {
  name: string;
  isoCode: string;
  totalPassed40: number;
  rowsScored: number;
  replaceGt5: number;
  strongestHold: string;
  shareRange: string;
  dominantFirms: string[];
}

export interface DroppedSmallMarketRow {
  row_id: string;
  country: string;
  input: string;
  share: number;
  year: number;
  global_market_size: string;
}

export interface UnscreenableInput {
  step: string;
  subgroup: string;
  input: string;
  year: string;
  countries_listed: string;
}

export interface VariableMeta {
  id: VariableId;
  name: string;
  question: string;
  helpsSupplier: 'high' | 'low';
  description: string;
  levels: {
    low: { label: string; desc: string; helpsSupplier: boolean };
    medium: { label: string; desc: string; helpsSupplier: 'neutral' };
    high: { label: string; desc: string; helpsSupplier: boolean };
  };
}

