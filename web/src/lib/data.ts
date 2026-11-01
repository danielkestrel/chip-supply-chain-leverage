import fs from 'fs';
import path from 'path';
import {
  ChokepointRow,
  HistoricalCase,
  Ask,
  CountrySummary,
  DroppedSmallMarketRow,
  UnscreenableInput,
  VariableMeta,
  CaseId,
  AskId,
  Level,
} from '@/types';

// Helper to resolve data file from local web/data or repo parent
function resolveDataFile(relPath: string): string {
  const localPath = path.join(process.cwd(), 'data', relPath);
  if (fs.existsSync(localPath)) return localPath;
  const parentPath = path.join(process.cwd(), '..', relPath);
  if (fs.existsSync(parentPath)) return parentPath;
  throw new Error(`Data file not found: ${relPath} (checked ${localPath} and ${parentPath})`);
}

function parseCSV(content: string): { header: string[]; rows: Record<string, string>[] } {
  const allRows: string[][] = [];
  let currentRecord = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      if (inQuotes && content[i + 1] === '"') {
        currentRecord += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === '\n' && !inQuotes) {
      if (currentRecord.trim()) {
        allRows.push(parseLine(currentRecord));
      }
      currentRecord = '';
    } else if (char === '\r' && !inQuotes) {
      // skip carriage return
    } else {
      currentRecord += char;
    }
  }
  if (currentRecord.trim()) {
    allRows.push(parseLine(currentRecord));
  }

  if (allRows.length === 0) return { header: [], rows: [] };
  const header = allRows[0].map((h) => h.trim());
  const rows = allRows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, idx) => {
      obj[h] = r[idx] !== undefined ? r[idx].trim() : '';
    });
    return obj;
  });

  return { header, rows };
}

function parseLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

const COUNTRY_ISO_MAP: Record<string, string> = {
  Japan: '392',
  Netherlands: '528',
  'South Korea': '410',
  Taiwan: '158',
  Germany: '276',
  Austria: '040',
  Singapore: '702',
  Sweden: '752',
};

const FIRM_MAPPING: Record<string, string> = {
  C02: 'IMS Nanofabrication (Intel-owned)',
  C03: 'EV Group',
  C06: 'SUSS MicroTec',
  C07: 'Hitachi High-Tech',
  C08: 'Disco (68.7%), Accretech (24.9%)',
  C09: 'Disco (87%), Accretech (8.1%)',
  C11: 'Kokusai (35.7%), Shibaura (9.2%)',
  C12: 'Tokyo Electron (19.9%), Accretech (17.1%)',
  C13: 'Tokyo Electron (55.9%)',
  C14: 'NuFlare (39.2%), JEOL (14.2%)',
  C15: 'Advantest (63.7%)',
  C16: 'TOWA (39.4%), Yamaha Robotics (17.4%)',
  C17: 'Muratec (83.2%), Daifuku (7.1%)',
  C18: 'Lasertec (42.0%)',
  C19: 'Tokyo Electron (92.6%)',
  C20: 'Tokyo Electron (92.1%)',
  C21: 'SCREEN (40.5%), Shibaura (26.2%)',
  C22: 'Advantest (65.5%)',
  C23: 'Tokyo Electron (50.8%), Kokusai (24.4%)',
  C24: 'Daifuku (49.3%), Muratec (32.7%)',
  C25: 'SCREEN (32.0%), Tokyo Electron (19.1%)',
  C26: 'Canon (53.7%)',
  C27: 'Dai Nippon Printing, Toppan, Hoya',
  C28: 'Shin-Etsu Chemical, SUMCO',
  C29: 'ASML (94.4%)',
  C30: 'ASML (99.3%)',
  C31: 'ASM International (54.5%)',
  C32: 'ASML (100%)',
  C33: 'ASML (66%)',
  C34: 'ASML (47.9%)',
  C35: 'Kulicke & Soffa (83.6%, US-inc.)',
  C39: 'SK hynix (52.3%), Samsung (28.7%)',
  C40: 'DI Corporation (53.9%)',
  C41: 'Mycronic (70.7%)',
  C42: 'TSMC (69.0%)',
};

const ROW_CAVEATS: Record<string, string[]> = {
  C02: ['Headquarters attribution caveat: IMS Nanofabrication is majority Intel-owned; US already controls this alternative.'],
  C14: ['Alternative producer IMS is majority Intel-owned; substitutability borderline high.'],
  C18: ['US domestic maker KLA holds 45.9%; Lasertec holds monopoly on EUV actinic mask inspection.'],
  C22: ['US domestic maker Teradyne holds 22%; requalification takes 2–5 years.'],
  C27: ['2019 baseline (CSET); leading-edge fabs (Intel, TSMC, Samsung) make most masks in-house.'],
  C28: ['2019 baseline (CSET); ETO provides no firm breakdown.'],
  C31: ['US maker Lam Research holds 10.5%; ASM leads specific ALD steps.'],
  C34: ['US maker KLA holds 51.5% domestic majority share; time to replace is low.'],
  C35: ['Headquarters attribution caveat: Kulicke & Soffa is incorporated in the US and Nasdaq-listed.'],
  C39: ['HBM figure is a 2025 projection from TrendForce (mid-2025 forecast).'],
  C42: ['Taiwan entry rests on second source (SIA/BCG 2024) and 2022 fab location capacity (not HQ).'],
};

// Cached singleton data
let cachedChokepoints: ChokepointRow[] | null = null;
let cachedCases: HistoricalCase[] | null = null;
let cachedAsks: Ask[] | null = null;
let cachedCountrySummaries: CountrySummary[] | null = null;

export function getCases(): HistoricalCase[] {
  if (cachedCases) return cachedCases;

  const filePath = resolveDataFile('scoring/cases_final.csv');
  const content = fs.readFileSync(filePath, 'utf8');
  const { rows } = parseCSV(content);

  cachedCases = rows.map((r) => {
    let what_the_supplier_wanted = '';
    let how_the_target_responded = '';
    let how_long_it_lasted = '';
    let dispute_note: string | undefined = undefined;

    if (r.case_id === 'K1') {
      what_the_supplier_wanted =
        'During the October 1973 war, Arab oil producers cut output and embargoed the US and Netherlands to push Israel’s backers towards withdrawal from 1967 territories.';
      how_the_target_responded =
        'The US kept supplying Israel, then brokered the 1974 disengagement agreements, and led consumer countries in founding the International Energy Agency (IEA).';
      how_long_it_lasted =
        'Embargo on the US ended after ~5 months (March 1974); triggered lasting ~4x price increase and long-term buyer reorganization.';
    } else if (r.case_id === 'K2') {
      what_the_supplier_wanted =
        'Chile, Peru, Zambia and Zaire sought greater control over copper trade and higher, steadier export earnings.';
      how_the_target_responded =
        'Importers barely needed to respond. Non-CIPEC producers (US, Canada, Australia), scrap recycling, and substitutes (aluminium) kept supply flowing.';
      how_long_it_lasted =
        'CIPEC never gained real pricing power. Its one export cut (1974–75) failed to lift prices; council faded and dissolved around 1990.';
    } else if (r.case_id === 'K3') {
      what_the_supplier_wanted =
        'Producer and consumer governments used a buffer stock and export quotas to hold tin prices above an artificially high floor.';
      how_the_target_responded =
        'Buyers reduced tin usage (thinner tinplate, aluminium), the US sold from stockpiles, and non-members expanded production.';
      how_long_it_lasted =
        'Held on borrowed funds for ~4 years until October 1985, when buffer stock defaulted on ~£900m, trading collapsed, and council dissolved.';
    } else if (r.case_id === 'K4') {
      what_the_supplier_wanted =
        'Following detention of a Chinese trawler captain near Senkaku/Diaoyu islands, rare-earth shipments to Japan halted for ~2 months to force release and territorial recognition.';
      how_the_target_responded =
        'Japan released the captain quickly, then diversified (funded Lynas in Australia, stockpiles, recycling) and won a WTO case alongside the US and EU.';
      how_long_it_lasted =
        'Shipments restored within 2 months; Japan’s dependence dropped from ~90% over subsequent years.';
      dispute_note =
        'China denied any embargo. Whether China deliberately targeted Japan is disputed, as China had already cut worldwide quotas in mid-2010 (King & Armstrong 2013).';
    } else if (r.case_id === 'K5') {
      what_the_supplier_wanted =
        'Japan ended bulk export licences to Korea for 3 chip chemicals (hydrogen fluoride, photoresists, fluorinated polyimide), widely read as pressure over forced-labour court rulings.';
      how_the_target_responded =
        'Korea did not concede during controls; it filed a WTO complaint, struck Japan off its white list, and financed domestic hydrogen fluoride production.';
      how_long_it_lasted =
        'Controls remained for nearly 4 years until March 2023, when Korea’s new government offered a domestic compensation plan, leading to mutual restoration.';
      dispute_note =
        'Alternative reading (partly worked): the 2023 compensation plan roughly matched Japan’s aim, though accompanied by Korean government change and US pressure.';
    }

    return {
      case_id: r.case_id as CaseId,
      case: r.case,
      who_used_leverage: r.who_used_leverage,
      target: r.target,
      concentration: r.concentration as Level,
      substitutability: r.substitutability as Level,
      time_to_replace: r.time_to_replace as Level,
      cohesion: r.cohesion as Level,
      dependence_on_target: r.dependence_on_target as Level,
      state_control: r.state_control as Level,
      outcome: r.outcome as 'partly worked' | 'failed' | 'backfired',
      concentration_evidence: r.concentration_evidence,
      substitutability_evidence: r.substitutability_evidence,
      time_to_replace_evidence: r.time_to_replace_evidence,
      cohesion_evidence: r.cohesion_evidence,
      dependence_on_target_evidence: r.dependence_on_target_evidence,
      state_control_evidence: r.state_control_evidence,
      sources: r.sources,
      scored_by: r.scored_by,
      what_the_supplier_wanted,
      how_the_target_responded,
      how_long_it_lasted,
      dispute_note,
    };
  });

  return cachedCases;
}

export function getChokepoints(): ChokepointRow[] {
  if (cachedChokepoints) return cachedChokepoints;

  const chokepointsFile = resolveDataFile('scoring/chokepoints_final.csv');
  const distancesFile = resolveDataFile('results/profile_distances.csv');

  const cpParsed = parseCSV(fs.readFileSync(chokepointsFile, 'utf8'));
  const distParsed = parseCSV(fs.readFileSync(distancesFile, 'utf8'));

  const distMap = new Map<string, Record<string, string>>();
  for (const d of distParsed.rows) {
    distMap.set(d.row_id, d);
  }

  cachedChokepoints = cpParsed.rows.map((r) => {
    const d = distMap.get(r.row_id);
    const closestCases = (d?.closest ? d.closest.split(' / ') : []) as CaseId[];

    const distances: Record<CaseId, number> = {
      K1: parseInt(d?.K1 || '0', 10),
      K2: parseInt(d?.K2 || '0', 10),
      K3: parseInt(d?.K3 || '0', 10),
      K4: parseInt(d?.K4 || '0', 10),
      K5: parseInt(d?.K5 || '0', 10),
    };

    return {
      row_id: r.row_id,
      country: r.country,
      isoCode: COUNTRY_ISO_MAP[r.country] || '000',
      step: r.step,
      input: r.input,
      firm: FIRM_MAPPING[r.row_id] || 'Undisclosed / Multi-firm',
      share: parseFloat(r.share),
      year: parseInt(r.year, 10),
      target: r.target,
      concentration: r.concentration as Level,
      substitutability: r.substitutability as Level,
      time_to_replace: r.time_to_replace as Level,
      cohesion: r.cohesion as Level,
      dependence_on_target: r.dependence_on_target as Level,
      state_control: r.state_control as Level,
      evidence: r.evidence,
      basis: r.basis,
      source: r.source,
      source_url: r.source_url,
      scored_by: r.scored_by,
      closestCases,
      closestString: d?.closest || '',
      distances,
      caveats: ROW_CAVEATS[r.row_id] || [],
    };
  });

  return cachedChokepoints;
}

export function getAsks(): Ask[] {
  if (cachedAsks) return cachedAsks;

  const filePath = resolveDataFile('results/asks.csv');
  const { rows } = parseCSV(fs.readFileSync(filePath, 'utf8'));

  cachedAsks = rows.map((r) => {
    let type: 'condition' | 'cutoff' | 'supply management' = 'condition';
    if (r.id === 'A5') type = 'cutoff';
    else if (r.id === 'A6') type = 'supply management';
    else if (r.id === 'A7') type = 'cutoff';

    return {
      id: r.id as AskId,
      item: r.item,
      kind: r.kind as 'ask' | 'to avoid',
      type,
      requires_of_us: r.requires_of_us,
      needs_threat_or_condition: r.needs_threat_or_condition,
      safety_value: r.safety_value as Level,
      risk_reduced: r.risk_reduced,
      directness: r.directness,
      who_must_agree: r.who_must_agree,
      note: r.note,
      credibility: r.credibility as Level,
      verdict: r.verdict as 'coordinate on' | 'avoid',
    };
  });

  return cachedAsks;
}

export function getCountrySummaries(): CountrySummary[] {
  if (cachedCountrySummaries) return cachedCountrySummaries;

  const chokepoints = getChokepoints();
  const countries = [
    {
      name: 'Japan',
      isoCode: '392',
      totalPassed40: 22,
      rowsScored: 21,
      strongestHold: 'Crystal machining (Disco, 99.7%), resist processing (Tokyo Electron, 95.2%), dicing (Disco, 95%)',
      shareRange: '41.5% – 99.7%',
      dominantFirms: ['Tokyo Electron', 'Disco', 'Advantest', 'SCREEN', 'Canon', 'Hitachi High-Tech', 'Muratec', 'Lasertec'],
    },
    {
      name: 'Netherlands',
      isoCode: '528',
      totalPassed40: 6,
      rowsScored: 6,
      strongestHold: 'ASML: EUV (100%), ArF immersion (99.3%) and ArF dry (94.4%) lithography',
      shareRange: '47.9% – 100%',
      dominantFirms: ['ASML', 'ASM International'],
    },
    {
      name: 'South Korea',
      isoCode: '410',
      totalPassed40: 2,
      rowsScored: 2,
      strongestHold: 'HBM memory (81%, 2025 projection), burn-in test tools (61.4%)',
      shareRange: '61.4% – 81.0%',
      dominantFirms: ['SK hynix', 'Samsung Electronics', 'DI Corporation'],
    },
    {
      name: 'Austria',
      isoCode: '040',
      totalPassed40: 3,
      rowsScored: 2,
      strongestHold: 'Wafer bonding (EV Group, 47.9%), e-beam mask writers (IMS, 46.6%)',
      shareRange: '46.6% – 47.9%',
      dominantFirms: ['EV Group', 'IMS Nanofabrication (Intel-owned)'],
    },
    {
      name: 'Germany',
      isoCode: '276',
      totalPassed40: 3,
      rowsScored: 1,
      strongestHold: 'Mask aligners (SUSS MicroTec, 82.2%)',
      shareRange: '82.2%',
      dominantFirms: ['SUSS MicroTec'],
    },
    {
      name: 'Singapore',
      isoCode: '702',
      totalPassed40: 4,
      rowsScored: 1,
      strongestHold: 'Ball bonders (Kulicke & Soffa, 90.9%)',
      shareRange: '90.9%',
      dominantFirms: ['Kulicke & Soffa (US-inc.)'],
    },
    {
      name: 'Sweden',
      isoCode: '752',
      totalPassed40: 1,
      rowsScored: 1,
      strongestHold: 'Laser mask writers (Mycronic, 70.7%)',
      shareRange: '70.7%',
      dominantFirms: ['Mycronic'],
    },
    {
      name: 'Taiwan',
      isoCode: '158',
      totalPassed40: 1,
      rowsScored: 1,
      strongestHold: 'Leading-edge logic capacity (TSMC, 69%, 2022 by fab location)',
      shareRange: '69.0%',
      dominantFirms: ['TSMC'],
    },
  ];

  cachedCountrySummaries = countries.map((c) => {
    const rows = chokepoints.filter((cp) => cp.country === c.name);
    const replaceGt5 = rows.filter((cp) => cp.time_to_replace === 'high').length;
    return {
      ...c,
      replaceGt5,
    };
  });

  return cachedCountrySummaries;
}

export function getDroppedSmallMarkets(): DroppedSmallMarketRow[] {
  const filePath = resolveDataFile('results/chokepoint_rows_dropped_small_markets.csv');
  const { rows } = parseCSV(fs.readFileSync(filePath, 'utf8'));
  return rows.map((r) => ({
    row_id: r.row_id,
    country: r.country,
    input: r.input,
    share: parseFloat(r.share),
    year: parseInt(r.year, 10),
    global_market_size: r.global_market_size,
  }));
}

export function getCouldNotScreen(): UnscreenableInput[] {
  const filePath = resolveDataFile('results/could_not_screen.csv');
  const { rows } = parseCSV(fs.readFileSync(filePath, 'utf8'));
  return rows.map((r) => ({
    step: r.step,
    subgroup: r.subgroup,
    input: r.input,
    year: r.year,
    countries_listed: r.countries_listed,
  }));
}

export function getVariableMetadata(): VariableMeta[] {
  return [
    {
      id: 'concentration',
      name: 'Concentration',
      question: 'What share of the supply the target needs does the supplier hold?',
      helpsSupplier: 'high',
      description: 'Calculated mechanically from external supply share (>60% high, 25–60% medium, <25% low).',
      levels: {
        low: { label: '< 25% Share', desc: 'Under 25% external share; supplier lacks market dominance', helpsSupplier: false },
        medium: { label: '25% – 60% Share', desc: '25% to 60% external share; substantial but non-exclusive', helpsSupplier: 'neutral' },
        high: { label: '> 60% Share', desc: 'Over 60% external share; dominant or monopoly position', helpsSupplier: true },
      },
    },
    {
      id: 'substitutability',
      name: 'Substitutability',
      question: 'Can the target switch to another supplier or redesign around it?',
      helpsSupplier: 'low',
      description: 'Evaluates switching frictions and redesign viability within 12 months. Low substitutability helps supplier leverage.',
      levels: {
        low: { label: 'No Substitute', desc: 'No other supplier at required quality; no redesign within ~1 year', helpsSupplier: true },
        medium: { label: 'Partial / Delay Penalty', desc: 'Alternatives cover part, or full cover with re-qualification penalty', helpsSupplier: 'neutral' },
        high: { label: 'Readily Substituted', desc: 'Commodity grade; other suppliers cover most need within months', helpsSupplier: false },
      },
    },
    {
      id: 'time_to_replace',
      name: 'Time to Replace',
      question: 'How long would the target need to build its own supply?',
      helpsSupplier: 'high',
      description: 'The sole variable separating past historical success from failure in the empirical dataset.',
      levels: {
        low: { label: '< 2 Years', desc: 'Domestic or allied maker already covers most need or can scale in <2 yrs', helpsSupplier: false },
        medium: { label: '2 – 5 Years', desc: 'Minority domestic maker scaling, or mature tech achievable in 2–5 yrs', helpsSupplier: 'neutral' },
        high: { label: '> 5 Years', desc: 'No domestic maker and frontier precision system (lithography-class)', helpsSupplier: true },
      },
    },
    {
      id: 'cohesion',
      name: 'Cohesion',
      question: 'How many separate actors must hold the line to maintain 80% share?',
      helpsSupplier: 'high',
      description: 'Count of firms (for single countries) or nations (for coalitions) needed to reach 80% of supplier share.',
      levels: {
        low: { label: '4+ Actors', desc: 'Fragmented cartel (4 or more actors); prone to cheating or leakage', helpsSupplier: false },
        medium: { label: '2 – 3 Actors', desc: 'Oligopoly (2 to 3 actors); requires moderate diplomatic coordination', helpsSupplier: 'neutral' },
        high: { label: '1 Actor', desc: 'Single firm or monopoly actor; minimal coordination friction', helpsSupplier: true },
      },
    },
    {
      id: 'dependence_on_target',
      name: 'Dependence on Target',
      question: 'How much does the supplier rely on the target for security or markets?',
      helpsSupplier: 'low',
      description: 'Higher of market export share or security guarantee. High dependence severely weakens supplier leverage.',
      levels: {
        low: { label: '< 10% / Autonomous', desc: 'Target takes <10% exports and supplier has independent security', helpsSupplier: true },
        medium: { label: '10% – 30% / Partner', desc: 'Target takes 10–30% exports or is non-vital security partner', helpsSupplier: 'neutral' },
        high: { label: '> 30% / Guarantor', desc: 'Target takes >30% exports or is vital security guarantor', helpsSupplier: false },
      },
    },
    {
      id: 'state_control',
      name: 'State Control',
      question: 'Can the supplier government direct the firms holding the supply?',
      helpsSupplier: 'high',
      description: 'Assesses statutory authority to compel, restrict, or direct corporate sales.',
      levels: {
        low: { label: 'Private / Unregulated', desc: 'Private firms; government lacks legal authority or faces severe backlash', helpsSupplier: false },
        medium: { label: 'Licensing Powers', desc: 'Statutory export licensing exists and used, but corporate pushback possible', helpsSupplier: 'neutral' },
        high: { label: 'State-Owned / Command', desc: 'State-owned enterprise or demonstrated stop-at-will authority', helpsSupplier: true },
      },
    },
  ];
}
