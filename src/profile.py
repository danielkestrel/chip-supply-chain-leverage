"""Step 4 profile: which past case each chokepoint row is closest to, from the final score sheets.

Distance = number of score steps between a row and a case, summed over the six variables
(low -> medium = 1, low -> high = 2). The case(s) with the smallest distance are "closest"; ties are kept.
Run from the repo root:  python src/profile.py
"""
from collections import Counter
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
VARIABLES = ["concentration", "substitutability", "time_to_replace",
             "cohesion", "dependence_on_target", "state_control"]
LEVELS = {"low": 0, "medium": 1, "high": 2}


def distances(rows, cases):
    out = []
    for _, r in rows.iterrows():
        d = {c.case_id: sum(abs(LEVELS[r[v]] - LEVELS[c[v]]) for v in VARIABLES) for _, c in cases.iterrows()}
        best = min(d.values())
        out.append({"row_id": r.row_id, "country": r.country, "input": r.input, **d,
                    "closest": " / ".join(k for k, v in d.items() if v == best)})
    return pd.DataFrame(out)


def main():
    cases = pd.read_csv(ROOT / "scoring" / "cases_final.csv")
    rows = pd.read_csv(ROOT / "scoring" / "chokepoints_final.csv")
    dist = distances(rows, cases)
    dist.to_csv(ROOT / "results" / "profile_distances.csv", index=False)
    counts = Counter(k for c in dist.closest for k in c.split(" / "))
    print("closest-case counts (ties counted for each):", dict(counts.most_common()))
    for v in VARIABLES:
        print(v, rows[v].value_counts().to_dict())


if __name__ == "__main__":
    main()
