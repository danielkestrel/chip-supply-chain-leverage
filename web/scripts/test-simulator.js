const fs = require('fs');
const path = require('path');

const casesCsv = fs.readFileSync(path.join(__dirname, '../data/cases_final.csv'), 'utf8');
const chokepointsCsv = fs.readFileSync(path.join(__dirname, '../data/chokepoints_final.csv'), 'utf8');
const distancesCsv = fs.readFileSync(path.join(__dirname, '../data/profile_distances.csv'), 'utf8');

function parseSimpleCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = parseLine(lines[0]);
  const rows = [];
  let inQuotes = false;
  let currentRecord = '';

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
        rows.push(parseLine(currentRecord));
      }
      currentRecord = '';
    } else if (char === '\r' && !inQuotes) {
      // skip
    } else {
      currentRecord += char;
    }
  }
  if (currentRecord.trim()) {
    rows.push(parseLine(currentRecord));
  }

  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const obj = {};
    header.forEach((h, idx) => {
      obj[h.trim()] = r[idx] !== undefined ? r[idx].trim() : '';
    });
    out.push(obj);
  }
  return out;
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

const cases = parseSimpleCsv(casesCsv);
const chokepoints = parseSimpleCsv(chokepointsCsv);
const expectedDistances = parseSimpleCsv(distancesCsv);

const VARIABLES = ['concentration', 'substitutability', 'time_to_replace', 'cohesion', 'dependence_on_target', 'state_control'];
const LEVELS = { low: 0, medium: 1, high: 2 };

console.log('Testing simulator calculation against results/profile_distances.csv...');

let failed = false;
const closestCounts = { K1: 0, K2: 0, K3: 0, K4: 0, K5: 0 };

for (const row of chokepoints) {
  const exp = expectedDistances.find(e => e.row_id === row.row_id);
  if (!exp) {
    console.error(`Missing expected distance row for ${row.row_id}`);
    failed = true;
    continue;
  }

  const distMap = {};
  for (const c of cases) {
    let d = 0;
    for (const v of VARIABLES) {
      d += Math.abs(LEVELS[row[v]] - LEVELS[c[v]]);
    }
    distMap[c.case_id] = d;
    if (d !== parseInt(exp[c.case_id], 10)) {
      console.error(`Distance mismatch for ${row.row_id} against ${c.case_id}: computed ${d}, expected ${exp[c.case_id]}`);
      failed = true;
    }
  }

  const minVal = Math.min(...Object.values(distMap));
  const closestCases = Object.keys(distMap).filter(cid => distMap[cid] === minVal).sort();
  const closestString = closestCases.join(' / ');

  if (closestString !== exp.closest) {
    console.error(`Closest case mismatch for ${row.row_id}: computed "${closestString}", expected "${exp.closest}"`);
    failed = true;
  }

  for (const cid of closestCases) {
    closestCounts[cid]++;
  }
}

console.log('Closest case counts computed:');
const caseNames = {
  K1: 'Oil Embargo',
  K2: 'CIPEC',
  K3: 'Tin Council',
  K4: 'China to Japan',
  K5: 'Japan to Korea'
};
const expectedCounts = {
  K5: 21,
  K2: 12,
  K4: 9,
  K3: 3,
  K1: 2
};

for (const cid of ['K5', 'K2', 'K4', 'K3', 'K1']) {
  console.log(`  ${cid} (${caseNames[cid]}): ${closestCounts[cid]} (expected: ${expectedCounts[cid]})`);
  if (closestCounts[cid] !== expectedCounts[cid]) {
    console.error(`Count mismatch for ${cid}: got ${closestCounts[cid]}, expected ${expectedCounts[cid]}`);
    failed = true;
  }
}

if (failed) {
  console.error('SIMULATOR TEST FAILED');
  process.exit(1);
} else {
  console.log('SIMULATOR TEST PASSED: All 35 chokepoint rows and closest-case counts match exactly!');
}

