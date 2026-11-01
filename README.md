# Chip-supply-chain leverage for AI safety

A project by Andrew, Ayodele and Gideon for the Middle Powers hackathon (Track C, Diplomacy). 

**Question:** which AI-safety asks can the countries that hold chip-supply-chain chokepoints, other than the US and China, credibly attach to their leverage? What should they coordinate on, and what should they avoid?

**Working hypothesis:** the credible asks are conditions that can be attached to supply, more so than threats to cut it. 

**Where the work stands:** Research and report complete. Awaiting peer-review before revising the research to integrate feedback and explore additional ideas we identify in the future work section of the report.

---

## Step 1 · Which countries hold chokepoints

**Rule:** a country is in the set if its firms hold **40% or more of world supply** of a specific chip input, such as EUV lithography tools (not a whole stage such as "equipment"). The US and China are screened but left out of the set, because they're the sides a coalition would bargain with. The screen was rerun at 25% and 60% as a robustness check.

**Screening rules (fixed before results were seen):**
- **Only the narrowest inputs are screened**, such as "EUV lithography tools" rather than "lithography tools", so the same hold isn't counted twice. Which ETO inputs belong to which step is in [`notes/eto_step_mapping.csv`](notes/eto_step_mapping.csv).
- **ETO's own country shares are used as given.** Exactly 40% counts as a pass.
- **"Various countries" and "Europe" can't pass**, because they aren't countries.
- **Inputs with no share figure are listed as "could not screen"**, never guessed.

**Data:**
- **Main source:** Emerging Technology Observatory (ETO), *Semiconductor Supply Chain Dataset*, September 2026 release.
  - Equipment shares are mostly **2025** (TechInsights data).
  - Materials are **2019** (CSET).
  - ETO assigns each firm's share to the country of its **parent company's headquarters**.
- **Gaps filled with approved second sources:**
  - **HBM memory:** TrendForce's 2025 projection gives South Korea 81% (SK hynix 52.3%, Samsung 28.7%).
  - **Leading-edge (<10nm) logic capacity:** SIA/BCG 2024 gives Taiwan 69% and South Korea 31% in **2022**. These figures are by **fab location**, not headquarters.

**Result:** 8 countries pass, and the **same 8 pass at 25%, 40% and 60%**.

| Country | Inputs passed at 40% | Rows scored in Step 4 | Strongest holds |
| --- | --- | --- | --- |
| Japan | 22 | 21 | Crystal machining (Disco, 99.7%), resist processing (Tokyo Electron, 95.2%), dicing (Disco, 95%) |
| Netherlands | 6 | 6 | ASML: EUV (100%), ArF immersion (99.3%) and ArF dry (94.4%) lithography |
| Singapore | 4 | 1 | Ball bonders (Kulicke & Soffa, 90.9%) |
| Austria | 3 | 2 | Wafer bonding (EV Group, 47.9%), e-beam mask writers (IMS, 46.6%) |
| Germany | 3 | 1 | Mask aligners (SUSS MicroTec, 82.2%) |
| South Korea | 2 | 2 | HBM memory (81%, 2025 projection), burn-in test tools (61.4%) |
| Sweden | 1 | 1 | Laser mask writers (Mycronic, 70.7%) |
| Taiwan | 1 | 1 | Leading-edge logic capacity (69%, 2022) |

- **Against expectations:** the plan expected the Netherlands, Japan, South Korea, Taiwan and Germany. All five are in, plus Austria, Singapore and Sweden. ETO splits tools into narrow niches, and a few small specialist firms dominate some of them.
- **Rows scored:** 42 country–input pairs passed. The 7 with a world market under $100m were dropped from Step 4 scoring, leaving **35 rows**. The small markets still count in the country set.
- **US and China, for context:** the US passes on 27 inputs and China on 1.

**What the screen could not establish:**
- **Most materials.** Photoresists, gases, wet chemicals and 8 others have no country shares in ETO or in the CSET report. Japan's hold on materials is therefore under-counted.
- **Advanced packaging capacity (CoWoS-class).** No free, dated source, so this step is described qualitatively only.
- **Taiwan's place in the set rests on a second source.** On ETO data alone, Taiwan passes nothing.
- **Headquarters attribution may overstate some countries.** IMS (Austria) is reportedly majority-owned by Intel, and Kulicke & Soffa (Singapore) is incorporated in the US.

Details: [`results/country_set.md`](results/country_set.md), [`data/processed/shares.csv`](data/processed/shares.csv).

---

## Step 2 · The six variables

Every past case and every chokepoint row is scored low, medium or high on six variables. Exact meanings are in [`notes/variable_anchors.md`](notes/variable_anchors.md).

| Variable | Question | Which end helps the supplier |
| --- | --- | --- |
| Concentration | What share of the supply the target needs does the supplier hold? (under 25% / 25–60% / over 60%) | high |
| Substitutability | Can the target switch suppliers or redesign around it? | low |
| Time to replace | How long would the target need to build its own supply? (under 2 / 2–5 / over 5 years) | high |
| Cohesion | How many separate actors must hold the line? (4 or more / 2–3 / 1) | high |
| Dependence on the target | How much does the supplier rely on the target, for security or markets? | low |
| State control | Can the government direct the firms that hold the supply? | high |

- **Cohesion is counted, not judged.** It is the number of countries (for a group) or firms (for a single country) needed to reach 80% of the supplier's share. This was changed from a judgment to reduce subjectivity.
- **Past cases are scored as they stood at the start of the episode,** not from how they ended.
- **Time to replace for today's rows** follows a written rule:
  - **low:** a US or US-controlled maker already covers most of the need
  - **medium:** a minority US maker, or a mature technology a new entrant could manage in 2–5 years
  - **high:** no US maker, and a lithography-class frontier system

---

## Step 3 · What past supplier coalitions show

### The five cases

**K1 · Arab oil embargo, 1973–74.** *Outcome: partly worked.*
- **What the supplier wanted:** during the October 1973 war, Arab oil producers cut output and embargoed the US and the Netherlands, to push Israel's backers towards Israeli withdrawal from the 1967 territories.
- **How the target responded:** the US brokered the 1974 disengagement agreements, and consumer countries founded the International Energy Agency.
- **How long it lasted:** the embargo on the US ended after about five months (March 1974). It won diplomatic engagement and a lasting price rise, but not withdrawal, and it pushed buyers to organise.

**K2 · CIPEC copper exporters, from 1967.** *Outcome: failed.*
- **What the supplier wanted:** Chile, Peru, Zambia and Zaire wanted more control over copper trade and higher earnings.
- **How the target responded:** importers barely had to respond. Producers outside the group, scrap and substitutes kept supply flowing.
- **How long it lasted:** CIPEC never gained real price power. Its one export cut (1974–75) didn't lift prices, and the council faded away around 1990.

**K3 · International Tin Council, 1985.** *Outcome: backfired.*
- **What the supplier wanted:** producer and consumer governments used a buffer stock and export quotas to hold tin prices above a floor that was set too high.
- **How the target responded:** buyers used less tin, the US sold from its stockpile, and non-members such as Brazil expanded output.
- **How long it lasted:** the support held for about four years on borrowed money. In October 1985 the council defaulted on about £900m, tin trading was suspended and prices collapsed.

**K4 · China's rare-earth squeeze on Japan, 2010.** *Outcome: backfired.*
- **What the supplier wanted:** after Japan detained a Chinese trawler captain near the Senkaku/Diaoyu islands, Chinese rare-earth shipments to Japan stopped for about two months. China denied any embargo.
- **How the target responded:** Japan released the captain, then diversified (Lynas in Australia, stockpiles, recycling) and won a WTO case alongside the US and EU.
- **How long it lasted:** Japan's reliance on China fell from about 90% over the following years. Whether China deliberately targeted Japan is disputed.

**K5 · Japan's materials restrictions on Korea, 2019–2023.** *Outcome: backfired.*
- **What the supplier wanted:** Japan ended bulk export licences to Korea for three chipmaking chemicals. This was widely read as pressure over Korean forced-labour court rulings.
- **How the target responded:** Korea did not back down while the controls were in force. It filed a WTO complaint and built local hydrogen fluoride supply.
- **How long it lasted:** the controls stayed for almost four years. Japan lifted them in 2023 after Korea's new government offered its own compensation plan. That plan can be read as a late partial success for Japan.

Full summaries, scores with evidence, and sources: [`notes/step3_cases.md`](notes/step3_cases.md) and [`scoring/cases_final.csv`](scoring/cases_final.csv).

### Scores against outcomes

| Case | Conc. | Subst. | Time to replace | Cohesion | Dependence | State control | Outcome |
| --- | --- | --- | --- | --- | --- | --- | --- |
| K1 Oil embargo | medium | medium | **high** | low | high | high | partly worked |
| K2 CIPEC | medium | high | medium | medium | high | medium | failed |
| K3 Tin council | medium | high | medium | medium | medium | medium | backfired |
| K4 China–Japan | high | low | medium | low | high | high | backfired |
| K5 Japan–Korea | high | medium | medium | low | high | medium | backfired |

### Rules of thumb

1. **Leverage only held where the target needed more than 5 years to replace supply.** The only case that partly worked (K1) is the only one scored high on time to replace.
2. **Supply management fails outright when substitutes are easy.** The copper (K2) and tin (K3) cases both failed or backfired.
3. **A near-monopoly is not enough if the target can diversify within a few years.** China in 2010 and Japan in 2019 both backfired.
4. **Even a cut that works makes buyers organise.** The 1973 embargo led to the International Energy Agency, stockpiles and new supply.

**Variables that don't separate success from failure:** dependence on the target, state control, cohesion and concentration. Only **time to replace** does.

**Factors the variables may miss:** the kind of demand (and whether the target can save face), whether the supplier gains anyway, market conditions, stockpiles and money, leakage through intermediaries, and ambiguity over intent.

Details: [`notes/step3_patterns.md`](notes/step3_patterns.md).

---

## Step 4 · Today's leverage profile (target: the US)

**Strongest:** 8 of 35 rows would take the US more than 5 years to replace:
- ASML's EUV, ArF immersion, ArF dry and KrF lithography
- Taiwan's leading-edge fabs
- Tokyo Electron's resist processing
- Canon's i-line lithography
- e-beam mask writers

Five of these (EUV, both ArF tools, Taiwan's fabs, Tokyo Electron) are also single-firm holds with no real substitute.

**Weakest:**
- **Rows where a US or US-controlled maker already covers most of the need:** overlay metrology (KLA), ball bonders (Kulicke & Soffa) and photomasks (made in-house by leading fabs).
- **Mature tools with several alternatives.**
- **Austria and Singapore,** whose key firms may in practice be US-controlled.

**Nearly all holders rely on the US:** 32 of 35 rows score high on dependence on the US for security or markets. And 34 of 35 governments can direct their firms only through export licensing.

**Closest past case (by score distance, with ties counted for each case):**

| Case | Rows |
| --- | --- |
| Japan–Korea 2019 (backfired) | 21 |
| CIPEC (failed) | 12 |
| China–Japan 2010 (backfired) | 9 |
| Tin council (backfired) | 3 |
| Oil embargo (partly worked) | 2 (both ties) |

**Reading:**
- **For most of today's chokepoints,** a threat to cut supply resembles past cases that failed or backfired. That supports the hypothesis that conditions on supply are more credible than threats.
- **The strongest rows are a mix no past case had.** EUV, ArF, Taiwan's fabs and Tokyo Electron are as concentrated as the cases that backfired, but as slow to replace as oil was in 1973. So the five past cases don't directly cover them.

Details: [`results/step4_profile.md`](results/step4_profile.md), [`scoring/chokepoints_final.csv`](scoring/chokepoints_final.csv), [`results/profile_distances.csv`](results/profile_distances.csv).

---

## Step 5 · The asks

Four asks, plus three moves to test as things to avoid. A fifth ask, a joint consultation seat in US export-control rule-making, was dropped as too unlikely on its face to be worth testing.

| ID | Item | Needs a threat or condition on supply? | Safety value |
| --- | --- | --- | --- |
| A1 | Shared anti-diversion and end-use checks | No: it is what US export controls already aim at | High: acts directly on chips reaching actors with no safety oversight |
| A2 | Frontier model access for members' governments and evaluators | Yes (uncertain): labs already share some access, but the White House reportedly asked them to delay UK testing in 2026 | Medium: testing helps only if findings change what is deployed |
| A3 | Safety conditions on buyers above a compute threshold (evaluations, incident reporting) | Yes: the clearest "condition on supply" | High: acts directly on frontier developers |
| A4 | Support for hardware verification features, e.g. location checks | Yes, aimed at chip designers: US bills point the same way, but Nvidia opposes it | Medium: an enabler for anti-diversion checks and for verifying future agreements |
| A5 | *To avoid?* Withholding supply | It is a threat to cut | Low |
| A6 | *To avoid?* Coordinating prices | It is supply management | Low |
| A7 | *To avoid?* Threatening to sell to China | It is a threat | Medium (contested): could ease US–China race pressure and keep China in shared safety efforts, but adds to China's frontier and military AI capacity |

**Notes:**
- **Only A1 matches what the US already wants.** The others need some leverage behind them.
- **A3 is the hardest to enforce.** The coalition's chokepoints sit upstream, at the tool, fab and memory makers. So conditions on the labs that buy compute would have to be passed down through several contracts.
- **The safety-value scores are judgments** made against a rule written before scoring.

Details, including what each ask requires of the US and who has to agree: [`notes/step5_asks.md`](notes/step5_asks.md), [`results/asks.csv`](results/asks.csv).

---

## Step 6 · Which asks are credible

**Credibility** asks whether the coalition could actually get the ask:
- **high:** the US would accept it because it costs little or helps the US.
- **medium:** it can be backed by a *condition* on supply, and it works with part of US policy.
- **low:** it needs a *threat* to cut supply, or it would be read in Washington as coercion.

The rule was written down before any ask was judged. The plan's sort is: "coordinate on" if credible and worth having, otherwise "avoid".

| Credibility ↓ / Safety value → | low | medium | high |
| --- | --- | --- | --- |
| **high** | | | **A1** |
| **medium** | | **A2, A4** | |
| **low** | A5, A6 | A7 | A3 |

| Coordinate on | Avoid |
| --- | --- |
| **A1** Shared anti-diversion and end-use checks | **A3** Binding safety conditions on large compute buyers |
| **A2** Model access for members' evaluators, negotiated alongside A1 | **A5** Withholding supply |
| **A4** Support for US-led hardware verification standards | **A6** Coordinating prices |
| | **A7** Threatening to sell to China |

**Why:**
- **A1 is what US export controls already aim at,** so it costs the US little.
- **A2 and A4 can be backed by conditions rather than cuts, and each lines up with part of US policy.** For A2, US labs already give the US and UK institutes pre-deployment access. For A4, Congress's Chip Security Act points the same way.
- **The threats (A5, A7) and supply management (A6) look like the past cases that failed or backfired.**
  - 27 of 35 chokepoint rows can be replaced within about 5 years.
  - Nearly every holder relies on the US for its security.
  - Even the strongest chokepoints are as concentrated as the two coercion cases that backfired.
- **A3 has the most direct safety value, but it is not credible as a binding condition.** The coalition sits several contract steps upstream of the labs, so enforcing it would mean threatening to cut supply.

**The working hypothesis holds:** the credible asks are conditions that work with US policy, and every threat lands in "avoid".

**Sensitivity:** only one verdict flips under a disputed score. If Japan–Korea 2019 is read as "partly worked" rather than "backfired" (Korea offered its own compensation plan in 2023), A3 could become credible. Changing the other disputed scores (time to replace for the strongest rows, A2's need for leverage, A7's safety value) moves no verdict.

Details: [`notes/step6_verdicts.md`](notes/step6_verdicts.md), [`results/asks.csv`](results/asks.csv).

---

## Limitations of scoring

- **Possible bias:** the past-case scores were drafted by someone who knew the outcomes, so they may lean towards fitting them.
- **Judgment calls:** substitutability, time to replace and state control are judgments. Concentration and cohesion follow mechanical rules.
- **Thin evidence:** only five past cases, four of them commodities. Chips are harder to substitute, so the lessons transfer imperfectly.
- **Data limits:**
  - Shares come from one main source, with mixed years (2019–2025).
  - Countries are assigned by headquarters, except the fab figure, which is by location.
  - The HBM figure is a projection.
- **What the project leaves out:** private negotiations, classified export-control deliberations, and how firms (as opposed to governments) would behave.


---

## Repo map

```
research_plan.md   the plan and task list
data/raw/          original downloads, untouched
data/processed/    shares.csv (one row per input and country), second-source figures
results/           screen outputs, country set, chokepoint rows, leverage profile
scoring/           cases_final.csv and chokepoints_final.csv (the final scores)
src/               screen.py (Step 1 screen), profile.py (Step 4 closest-case comparison)
notes/             decision log, variable anchors, case notes, chokepoint score notes, asks
web/               interactive research companion website (Next.js, TypeScript, Tailwind CSS)
```

## Running the research scripts

Python 3.11 or later, with pandas.

```
python src/screen.py       # Step 1 screen: shares, screens, country set, chokepoint rows
python src/profile.py      # Step 4: closest past case for each chokepoint row
```

## Running the website

The repository includes an interactive research companion website in the `web/` directory.

### Prerequisites

Node.js 18.17 or later, and npm.

### Running locally

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the companion.

### Verifying and building for production

```bash
cd web
npm test        # verifies simulator distance calculation against results/profile_distances.csv
npm run build   # syncs repo data, validates all rows, and compiles production build
npm start       # runs production server locally
```

## Credits

This project was originally conceived and researched by **Andrew**, **Ayodele**, and **Gideon** for the **Middle Powers hackathon (Track C, Diplomacy)**.

This repository continues from their original repository at [https://github.com/andrew-ayobami/chip-supply-chain-leverage](https://github.com/andrew-ayobami/chip-supply-chain-leverage).

## Data and licences

- Emerging Technology Observatory, *Semiconductor Supply Chain Dataset* (September 2026 release), https://eto.tech/dataset-docs/chipexplorer. CC BY-NC 4.0. Files are pinned to GitHub commit `9a4e1b1` of `georgetown-cset/eto-chip-explorer` (13 Oct 2026) and were downloaded on 21 Oct 2026.
- CSET, *The Semiconductor Supply Chain: Assessing National Competitiveness* (2021). CC BY-NC 4.0.
- TrendForce (HBM shares, 2025) and SIA/BCG, *Emerging Resilience in the Semiconductor Supply Chain* (2024). These are cited, but their files are not stored here, because their licences are unclear.
- Case sources are listed with each case in `notes/step3_cases.md`.
