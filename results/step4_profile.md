# Leverage profile: today's chokepoints against the past cases

Built from the final scores for all 35 chokepoint rows (`scoring/chokepoints_final.csv`) and the 5 past cases (`scoring/cases_final.csv`). Run `python src/profile.py` to reproduce it. Per-row distances are in `results/profile_distances.csv`.

**How "closest case" is measured:** the number of score steps between a row and a case, added up across the six variables (low to high counts as 2 steps). The case with the smallest total is the closest. Ties are counted for each case involved.

## Where the leverage is strongest

**Eight rows** score **high on time to replace**, meaning the US would need more than 5 years to build its own supply. That is the only variable that separated the past cases:
- **Netherlands (ASML):** EUV (C32), ArF immersion (C30), ArF dry (C29) and KrF (C33) lithography
- **Taiwan:** leading-edge fabrication (C42)
- **Japan:** front-end resist processing (C19, Tokyo Electron), i-line lithography (C26, Canon) and e-beam mask writers (C14)

Five of these (C19, C29, C30, C32, C42) are also **single-firm holds with low substitutability**. They are the strongest rows in the set.

## Where it is weakest

- **Rows where a US or US-controlled maker already covers most of the need:**
  - overlay metrology (C34, where KLA holds 51.5%)
  - Singapore's ball bonders (C35, Kulicke & Soffa is US-incorporated)
  - photomasks (C27, which leading-edge fabs mostly make themselves)

  These three are the only rows with low time to replace.
- **Lower-end and mature tools with several alternatives**, such as dry stripping, packaging tools, wet cleaning, handlers and probers, and wafers. They have medium share, medium substitutability and medium time to replace.
- **Austria and Singapore:** Austria is neutral and Singapore is not a treaty ally, so their dependence on the US is medium. But both may hold supply that is in practice US-controlled: IMS (C02, reportedly Intel-owned) and Kulicke & Soffa (C35). The headquarters-based screen probably overstates their leverage.
- **Across the board:** 32 of 35 rows score high on dependence on the US, and 34 of 35 score medium on state control. So most holders rely on the US for their security and can direct their firms only through export licensing.

## Which past case it most resembles

| Closest case (ties counted for each) | Rows |
| --- | --- |
| K5 Japan–Korea 2019 (backfired) | 21 |
| K2 CIPEC (failed) | 12 |
| K4 China–Japan 2010 (backfired) | 9 |
| K3 Tin council (backfired) | 3 |
| K1 Oil embargo (partly worked) | 2 (C14, C26, both ties with CIPEC) |

- **Overall:** today's chokepoints look most like Japan–Korea 2019 and CIPEC, where the leverage backfired or failed. No row is closest to the oil embargo alone.
- **The strongest rows are a mix no past case had.** EUV, ArF, Taiwan's fabs and Tokyo Electron's resist processing look like China–Japan 2010 and Japan–Korea 2019 on concentration and substitutability (both backfired). But they score **high** on time to replace, like the oil embargo. So the five cases don't directly cover the strongest chokepoints.
- **What this suggests:** for most of today's chokepoints, a threat to cut supply resembles past cases that failed or backfired. That supports the working hypothesis that conditions attached to supply work better than threats. Only a handful of ASML, TSMC, Tokyo Electron and Canon rows have the long replacement time that held up in 1973, and even there the closest structural matches backfired.

## Caveats

- **The distances are partly driven by variables that barely vary today** (dependence and state control).
- **The past-case evidence is thin:** only 5 cases, 4 of them commodities (oil, copper, tin, rare earths).
