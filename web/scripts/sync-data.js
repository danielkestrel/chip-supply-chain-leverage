const fs = require('fs');
const path = require('path');
const d3 = require('d3-geo');
const topojson = require('topojson-client');

const ROOT_REPO = path.resolve(__dirname, '../../');
const WEB_DIR = path.resolve(__dirname, '../');
const DATA_DEST = path.join(WEB_DIR, 'data');
const SRC_DATA_DEST = path.join(WEB_DIR, 'src/data');

console.log('--- SYNC & VALIDATE REPO DATA ---');
console.log('Source repository root:', ROOT_REPO);
console.log('Destination web data dir:', DATA_DEST);

fs.mkdirSync(DATA_DEST, { recursive: true });
fs.mkdirSync(SRC_DATA_DEST, { recursive: true });

function parseCSV(text) {
  const allRows = [];
  let currentRecord = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentRecord += '""';
        i++;
      } else {
        inQuotes = !inQuotes;
        currentRecord += '"';
      }
    } else if (char === '\n' && !inQuotes) {
      if (currentRecord.trim()) {
        allRows.push(parseLine(currentRecord));
      }
      currentRecord = '';
    } else if (char === '\r' && !inQuotes) {
      // skip CR
    } else {
      currentRecord += char;
    }
  }
  if (currentRecord.trim()) {
    allRows.push(parseLine(currentRecord));
  }

  function parseLine(line) {
    const values = [];
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

  const header = allRows[0];
  const rows = [];
  for (let r = 1; r < allRows.length; r++) {
    const row = allRows[r];
    const obj = {};
    header.forEach((h, idx) => {
      obj[h.trim()] = row[idx] !== undefined ? row[idx].trim() : '';
    });
    rows.push(obj);
  }
  return { header, rows };
}

// Helper to read from root repo or fallback to already-synced web/data
function readRepoOrLocal(repoRelPath, localFileName) {
  const repoPath = path.join(ROOT_REPO, repoRelPath);
  if (fs.existsSync(repoPath)) {
    return fs.readFileSync(repoPath, 'utf8');
  }
  const localPath = path.join(DATA_DEST, localFileName);
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath, 'utf8');
  }
  throw new Error(`Data file not found: checked ${repoPath} and ${localPath}`);
}

// 1. Validate chokepoints_final.csv
const chokepointsRaw = readRepoOrLocal('scoring/chokepoints_final.csv', 'chokepoints_final.csv');
const chokepoints = parseCSV(chokepointsRaw);
console.log(`Validating scoring/chokepoints_final.csv: ${chokepoints.rows.length} rows`);
if (chokepoints.rows.length !== 35) {
  throw new Error(`Expected exactly 35 chokepoints rows, got ${chokepoints.rows.length}`);
}
const expectedChokepointCols = [
  'row_id', 'country', 'step', 'input', 'share', 'year', 'target',
  'concentration', 'substitutability', 'time_to_replace', 'cohesion',
  'dependence_on_target', 'state_control', 'evidence', 'basis', 'source',
  'source_url', 'scored_by'
];
for (const col of expectedChokepointCols) {
  if (!chokepoints.header.includes(col)) {
    throw new Error(`Missing required column '${col}' in chokepoints_final.csv`);
  }
}

// 2. Validate cases_final.csv
const casesRaw = readRepoOrLocal('scoring/cases_final.csv', 'cases_final.csv');
const cases = parseCSV(casesRaw);
console.log(`Validating scoring/cases_final.csv: ${cases.rows.length} rows`);
if (cases.rows.length !== 5) {
  throw new Error(`Expected exactly 5 historical cases, got ${cases.rows.length}`);
}

// 3. Validate profile_distances.csv
const profileDistRaw = readRepoOrLocal('results/profile_distances.csv', 'profile_distances.csv');
const profileDist = parseCSV(profileDistRaw);
console.log(`Validating results/profile_distances.csv: ${profileDist.rows.length} rows`);

const LEVEL_MAP = { low: 0, medium: 1, high: 2 };
const VARS = ['concentration', 'substitutability', 'time_to_replace', 'cohesion', 'dependence_on_target', 'state_control'];
const expectedCaseIds = ['K1', 'K2', 'K3', 'K4', 'K5'];

const caseScores = {};
for (const c of cases.rows) {
  caseScores[c.case_id] = {};
  for (const v of VARS) {
    caseScores[c.case_id][v] = LEVEL_MAP[c[v]];
  }
}

const closestCounts = { K1: 0, K2: 0, K3: 0, K4: 0, K5: 0 };
for (const r of chokepoints.rows) {
  const exp = profileDist.rows.find(p => p.row_id === r.row_id);
  if (!exp) throw new Error(`Missing profile distance entry for ${r.row_id}`);

  const distances = {};
  for (const cid of expectedCaseIds) {
    let d = 0;
    for (const v of VARS) {
      d += Math.abs(LEVEL_MAP[r[v]] - caseScores[cid][v]);
    }
    distances[cid] = d;
    if (d !== parseInt(exp[cid], 10)) {
      throw new Error(`Distance mismatch for row ${r.row_id} and case ${cid}: calculated ${d}, expected ${exp[cid]}`);
    }
  }

  const minD = Math.min(...Object.values(distances));
  const closestCases = expectedCaseIds.filter(cid => distances[cid] === minD);
  const closestStr = closestCases.join(' / ');
  if (closestStr !== exp.closest) {
    throw new Error(`Closest mismatch for row ${r.row_id}: calculated '${closestStr}', expected '${exp.closest}'`);
  }
  for (const c of closestCases) {
    closestCounts[c]++;
  }
}

console.log('Distance verification passed perfectly!');
console.log('Closest case counts:', closestCounts);

// 4. Validate asks.csv
const asksRaw = readRepoOrLocal('results/asks.csv', 'asks.csv');
const asks = parseCSV(asksRaw);
console.log(`Validating results/asks.csv: ${asks.rows.length} rows`);
if (asks.rows.length !== 7) {
  throw new Error(`Expected exactly 7 asks, got ${asks.rows.length}`);
}

// 5. Copy raw data files to web/data (if running in full repository context)
const filesToSync = [
  { src: 'scoring/chokepoints_final.csv', dest: 'chokepoints_final.csv' },
  { src: 'scoring/cases_final.csv', dest: 'cases_final.csv' },
  { src: 'results/profile_distances.csv', dest: 'profile_distances.csv' },
  { src: 'results/asks.csv', dest: 'asks.csv' },
  { src: 'results/chokepoint_rows_dropped_small_markets.csv', dest: 'chokepoint_rows_dropped_small_markets.csv' },
  { src: 'results/could_not_screen.csv', dest: 'could_not_screen.csv' },
  { src: 'results/screen_25.csv', dest: 'screen_25.csv' },
  { src: 'results/screen_40.csv', dest: 'screen_40.csv' },
  { src: 'results/screen_60.csv', dest: 'screen_60.csv' },
  { src: 'data/processed/shares.csv', dest: 'shares.csv' },
  { src: 'data/processed/second_source_figures.csv', dest: 'second_source_figures.csv' },
  { src: 'notes/variable_anchors.md', dest: 'variable_anchors.md' },
  { src: 'notes/step3_cases.md', dest: 'step3_cases.md' },
  { src: 'notes/step3_patterns.md', dest: 'step3_patterns.md' },
  { src: 'notes/step5_asks.md', dest: 'step5_asks.md' },
  { src: 'notes/step6_verdicts.md', dest: 'step6_verdicts.md' },
  { src: 'results/country_set.md', dest: 'country_set.md' },
  { src: 'results/step4_profile.md', dest: 'step4_profile.md' },
];

for (const f of filesToSync) {
  const srcPath = path.join(ROOT_REPO, f.src);
  const destPath = path.join(DATA_DEST, f.dest);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
}

// 6. Precompute Map Data with D3 Geo Natural Earth and 50m resolution
console.log('Generating map-data.json with Natural Earth projection...');
const atlasDir = path.dirname(require.resolve('world-atlas/package.json'));
const world50m = JSON.parse(fs.readFileSync(path.join(atlasDir, 'countries-50m.json'), 'utf8'));
const countries = topojson.feature(world50m, world50m.objects.countries);

// Remove Antarctica
const nonAntarctic = countries.features.filter(f => f.id !== '010' && f.properties?.name !== 'Antarctica');

const width = 960;
const height = 500;
const projection = d3.geoNaturalEarth1().fitExtent([[15, 15], [width - 15, height - 15]], {
  type: 'FeatureCollection',
  features: nonAntarctic
});
const pathGen = d3.geoPath(projection);

function roundPath(p) {
  if (!p) return '';
  return p.replace(/(\d+\.\d{2,})/g, m => parseFloat(m).toFixed(1));
}

const landPaths = [];
for (const f of nonAntarctic) {
  const p = pathGen(f);
  if (p) landPaths.push(roundPath(p));
}
const combinedLand = landPaths.join(' ');

const bordersMesh = topojson.mesh(world50m, world50m.objects.countries, (a, b) => a !== b);
const bordersPath = roundPath(pathGen(bordersMesh) || '');

// Target countries setup
const targetMetadata = {
  '392': {
    name: 'Japan',
    rows: 21,
    replaceGt5: 3,
    strongestHold: 'Resist processing (TEL, 95.2%), crystal machining (Disco, 99.7%), dicing (Disco, 95%)',
    fillColor: '#1d3557', // 100% secondary navy
    strokeColor: '#101d35',
    radius: 17,
    leaderLine: false,
    badgeOffset: [5, -5],
    labelAnchor: 'start'
  },
  '528': {
    name: 'Netherlands',
    rows: 6,
    replaceGt5: 4,
    strongestHold: 'ASML: EUV (100%), ArF immersion (99.3%) and ArF dry (94.4%) lithography',
    fillColor: '#3a597e', // ~75% stepped
    strokeColor: '#101d35',
    radius: 13,
    leaderLine: true,
    badgePos: [460, 110], // offset northwest
    labelAnchor: 'end'
  },
  '410': {
    name: 'South Korea',
    rows: 2,
    replaceGt5: 0,
    strongestHold: 'HBM memory (81%, 2025 projection), burn-in test tools (61.4%)',
    fillColor: '#6381a3', // ~55% stepped
    strokeColor: '#101d35',
    radius: 11,
    leaderLine: true,
    badgePos: [765, 150], // offset northwest
    labelAnchor: 'end'
  },
  '040': {
    name: 'Austria',
    rows: 2,
    replaceGt5: 0,
    strongestHold: 'Wafer bonding (EV Group, 47.9%), e-beam mask writers (IMS, 46.6%)',
    fillColor: '#6381a3', // ~55% stepped
    strokeColor: '#101d35',
    radius: 11,
    leaderLine: true,
    badgePos: [545, 155], // offset southeast
    labelAnchor: 'start'
  },
  '276': {
    name: 'Germany',
    rows: 1,
    replaceGt5: 0,
    strongestHold: 'Mask aligners (SUSS MicroTec, 82.2%)',
    fillColor: '#8ea6c2', // ~40% stepped
    strokeColor: '#101d35',
    radius: 9,
    leaderLine: false,
    badgeOffset: [0, 0],
    labelAnchor: 'middle'
  },
  '702': {
    name: 'Singapore',
    rows: 1,
    replaceGt5: 0,
    strongestHold: 'Ball bonders (Kulicke & Soffa, 90.9%)',
    fillColor: '#8ea6c2', // ~40% stepped
    strokeColor: '#101d35',
    radius: 9,
    leaderLine: true,
    badgePos: [722, 292], // offset southwest
    labelAnchor: 'end'
  },
  '752': {
    name: 'Sweden',
    rows: 1,
    replaceGt5: 0,
    strongestHold: 'Laser mask writers (Mycronic, 70.7%)',
    fillColor: '#8ea6c2', // ~40% stepped
    strokeColor: '#101d35',
    radius: 9,
    leaderLine: false,
    badgeOffset: [0, 0],
    labelAnchor: 'middle'
  },
  '158': {
    name: 'Taiwan',
    rows: 1,
    replaceGt5: 1,
    strongestHold: 'Leading-edge logic fabrication (TSMC, 69%, 2022 fab location)',
    fillColor: '#8ea6c2', // ~40% stepped
    strokeColor: '#101d35',
    radius: 9,
    leaderLine: true,
    badgePos: [824, 222], // offset southeast
    labelAnchor: 'start'
  }
};

const targets = {};
for (const [id, meta] of Object.entries(targetMetadata)) {
  const feat = nonAntarctic.find(f => f.id === id || String(f.id).padStart(3, '0') === id);
  if (!feat) {
    throw new Error(`Target country ID ${id} (${meta.name}) not found in 50m atlas!`);
  }

  let centroid;
  if (id === '528') {
    // Mainland polygon (polygon 0)
    centroid = pathGen.centroid({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: feat.geometry.coordinates[0] }
    });
  } else {
    centroid = pathGen.centroid(feat);
  }

  const rawPath = pathGen(feat);
  const roundedP = roundPath(rawPath || '');
  const cX = Math.round(centroid[0] * 10) / 10;
  const cY = Math.round(centroid[1] * 10) / 10;

  const bPos = meta.leaderLine && meta.badgePos
    ? meta.badgePos
    : [cX + (meta.badgeOffset?.[0] || 0), cY + (meta.badgeOffset?.[1] || 0)];

  targets[meta.name] = {
    id,
    name: meta.name,
    path: roundedP,
    centroid: [cX, cY],
    badgePos: bPos,
    rows: meta.rows,
    replaceGt5: meta.replaceGt5,
    strongestHold: meta.strongestHold,
    fillColor: meta.fillColor,
    strokeColor: meta.strokeColor,
    radius: meta.radius,
    leaderLine: meta.leaderLine,
    labelAnchor: meta.labelAnchor
  };
}

const mapData = {
  width,
  height,
  land: combinedLand,
  borders: bordersPath,
  targets,
  presets: {
    world: { x: 0, y: 0, width: 960, height: 500 },
    europe: { x: 425, y: 45, width: 160, height: 130 },
    eastAsia: { x: 690, y: 120, width: 185, height: 195 }
  }
};

fs.writeFileSync(path.join(SRC_DATA_DEST, 'map-data.json'), JSON.stringify(mapData));
console.log('Saved src/data/map-data.json successfully!');
