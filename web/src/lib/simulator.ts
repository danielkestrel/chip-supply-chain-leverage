import { CaseId, Level, VariableId, HistoricalCase } from '@/types';

export const LEVEL_MAP: Record<Level, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

export const VARIABLES: VariableId[] = [
  'concentration',
  'substitutability',
  'time_to_replace',
  'cohesion',
  'dependence_on_target',
  'state_control',
];

export const CASE_NAMES: Record<CaseId, string> = {
  K1: 'Arab Oil Embargo (1973–74)',
  K2: 'CIPEC Copper Exporters (1967–90)',
  K3: 'International Tin Council (1985)',
  K4: 'China Rare-Earth Squeeze (2010)',
  K5: 'Japan Materials Restrictions (2019–23)',
};

export const CASE_OUTCOMES: Record<CaseId, 'partly worked' | 'failed' | 'backfired'> = {
  K1: 'partly worked',
  K2: 'failed',
  K3: 'backfired',
  K4: 'backfired',
  K5: 'backfired',
};

export function calculateDistances(
  scores: Record<VariableId, Level>,
  cases: HistoricalCase[]
): Record<CaseId, number> {
  const result: Partial<Record<CaseId, number>> = {};
  for (const c of cases) {
    let dist = 0;
    for (const v of VARIABLES) {
      dist += Math.abs(LEVEL_MAP[scores[v]] - LEVEL_MAP[c[v]]);
    }
    result[c.case_id] = dist;
  }
  return result as Record<CaseId, number>;
}

export function getClosestCases(distances: Record<CaseId, number>): CaseId[] {
  const minD = Math.min(...Object.values(distances));
  return (Object.keys(distances) as CaseId[]).filter((cid) => distances[cid] === minD);
}

export function getVariableDifference(
  scores: Record<VariableId, Level>,
  caseItem: HistoricalCase
): Record<VariableId, { diff: number; current: Level; target: Level }> {
  const result: Partial<Record<VariableId, { diff: number; current: Level; target: Level }>> = {};
  for (const v of VARIABLES) {
    const diff = Math.abs(LEVEL_MAP[scores[v]] - LEVEL_MAP[caseItem[v]]);
    result[v] = {
      diff,
      current: scores[v],
      target: caseItem[v],
    };
  }
  return result as Record<VariableId, { diff: number; current: Level; target: Level }>;
}

export interface PolicyReading {
  title: string;
  verdictTag: string;
  verdictType: 'success' | 'warning' | 'danger';
  summary: string;
  structuralReason: string;
  strategicGuidance: string;
}

export function generatePolicyReading(
  closest: CaseId[],
  distances: Record<CaseId, number>,
  scores: Record<VariableId, Level>
): PolicyReading {
  const hasK1 = closest.includes('K1');
  const hasK5 = closest.includes('K5');
  const hasK2 = closest.includes('K2');
  const hasK4 = closest.includes('K4');
  const hasK3 = closest.includes('K3');

  const ttr = scores.time_to_replace;
  const conc = scores.concentration;
  const subst = scores.substitutability;
  const dep = scores.dependence_on_target;

  if (hasK1 && closest.length === 1) {
    return {
      title: 'Structural Precedent: 1973 Arab Oil Embargo',
      verdictTag: 'Partly Worked (Historical Precedent)',
      verdictType: 'success',
      summary:
        'This profile exhibits the rare combination of high replacement friction (>5 years) that enabled OAPEC to extract diplomatic and price concessions in 1973.',
      structuralReason:
        'Time to replace is the only variable in the historical record that separated partial success from outright failure. Because the target cannot reconstruct domestic capacity within a single election cycle, supplier leverage has durability.',
      strategicGuidance:
        'Even in 1973, visible cutoff threats triggered immediate counter-mobilization (the IEA, strategic stockpiles, and non-allied diversification) that gradually dismantled supplier advantage. Leverage is best preserved by attaching safety conditions to continued supply rather than executing threats.',
    };
  }

  if (hasK5 && closest.length === 1) {
    return {
      title: 'Structural Precedent: Japan–Korea Materials Restrictions (2019)',
      verdictTag: 'Backfired (Historical Precedent)',
      verdictType: 'danger',
      summary:
        'High market concentration combined with intermediate replacement horizons (2–5 years) directly mirrors Japan’s 2019 export controls against South Korea.',
      structuralReason:
        'Japan held 70–90% market share in fluorinated polyimide, photoresists, and hydrogen fluoride. However, because Korean chipmakers could requalify non-Japanese sources and finance domestic capacity within 1–2 years, Japan permanently lost market share without achieving its diplomatic objectives.',
      strategicGuidance:
        'Threatening supply cuts against an allied or advanced economy with high technological capability accelerates the target’s domestic substitution program, eroding leverage before political demands can be realized.',
    };
  }

  if (hasK2 && closest.length === 1) {
    return {
      title: 'Structural Precedent: CIPEC Copper Cartel (1967–90)',
      verdictTag: 'Failed (Historical Precedent)',
      verdictType: 'warning',
      summary:
        'Moderate concentration and easy substitution mirror the CIPEC cartel, which attempted to coordinate export controls but never gained pricing power.',
      structuralReason:
        'Importers faced minimal supply friction due to non-member production, scrap recycling, and material substitutes. Without a monopoly bottleneck, collective supply management collapsed.',
      strategicGuidance:
        'Collective bargaining cannot succeed on inputs where target nations can draw upon domestic suppliers or commercial alternatives. Demands must focus on narrow, non-substitutable chokepoints.',
    };
  }

  if (hasK4 && closest.length === 1) {
    return {
      title: 'Structural Precedent: China Rare-Earth Squeeze (2010)',
      verdictTag: 'Backfired (Historical Precedent)',
      verdictType: 'danger',
      summary:
        'Monopolistic concentration with medium time to replace matches China’s 2010 informal export halt against Japan.',
      structuralReason:
        'China supplied ~90% of Japan’s rare earths. While Japan conceded short-term detention of the trawler captain, the lasting consequence was Japan investing in Lynas (Australia), building strategic stockpiles, and prevailing at the WTO, permanently slashing China’s export share.',
      strategicGuidance:
        'A near-monopoly is expended in a single coercive use if the target can build alternate supply within a few years. Credible leverage must be institutionalized as regulatory conditions rather than raw embargo threats.',
    };
  }

  if (hasK3 && closest.length === 1) {
    return {
      title: 'Structural Precedent: International Tin Council (1985)',
      verdictTag: 'Backfired (Historical Precedent)',
      verdictType: 'danger',
      summary:
        'Attempts to artificially restrict supply or manage market pricing against substantial substitutes lead to market distortion and catastrophic collapse.',
      structuralReason:
        'Setting artificially high floor prices incentivized non-member capacity expansion and alternative materials, ultimately bankrupting the buffer stock in an £900m default.',
      strategicGuidance:
        'Avoid collective price or supply-management cartels. Middle powers possess regulatory and technical leverage, not commodity cartel power.',
    };
  }

  // Tied cases
  const caseNamesStr = closest.map((c) => CASE_NAMES[c]).join(' & ');
  const isBackfireTie = closest.every((c) => CASE_OUTCOMES[c] === 'backfired' || CASE_OUTCOMES[c] === 'failed');

  return {
    title: `Equidistant Precedents: ${caseNamesStr}`,
    verdictTag: isBackfireTie ? 'Historical Match: Failed / Backfired' : 'Mixed Historical Precedents',
    verdictType: isBackfireTie ? 'danger' : 'warning',
    summary: `This profile sits equidistant (distance: ${distances[closest[0]]} steps) between multiple historical precedents (${closest.join(', ')}).`,
    structuralReason: `The configuration shares structural dimensions with multiple past episodes. ${
      ttr === 'high'
        ? 'High replacement time (>5 years) provides defensive leverage akin to 1973 oil, but allied dependence or concentration patterns mirror coercive attempts that backfired.'
        : 'Replacement horizon (under 5 years) and high dependence on the US align with cases where coercive leverage failed or accelerated target substitution.'
    }`,
    strategicGuidance:
      'The empirical lesson across all 5 precedents is unequivocal: cutoff threats consistently backfire when the target can diversify within 5 years or when suppliers depend on the target for security. Middle powers maximize safety impact by attaching verifiable conditions to legitimate supply agreements.',
  };
}

