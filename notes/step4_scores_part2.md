# Step 4 chokepoint scores, part 2 (12 rows)

The target is the US, scored as of 2026, using the anchors in `notes/variable_anchors.md`. All 35 final scores are in `scoring/chokepoints_final.csv`.

**How each score was set:** the same method as part 1 (`notes/step4_scores_part1.md`).
- **Concentration** uses the ETO world share: 60% or more is high, 25–60% is medium.
- **Cohesion** is the number of firms needed to reach 80% of the country's share, from ETO firm rows.
- **Dependence on the target** is high and **state control** medium for every row, for the same reasons as Andrew's rows.

## The rule used for time to replace

This is a judgment rule. It is written here so it can be applied the same way to every row.

| Score | When it applies |
| --- | --- |
| **low** (under 2 years) | A US-based or US-controlled maker already covers **most** of the need, or could within about 2 years. |
| **medium** (2 to 5 years) | A US maker exists with a meaningful but minority share and would need years to scale up, **or** there is no US maker but the technology is mature or narrow enough for a new entrant within 2–5 years. |
| **high** (over 5 years) | No US maker of any size **and** a frontier precision system (lithography-class) where past entrants have taken a decade or more. |

| Row | Chokepoint | Conc. | Subst. | Time to replace | Cohesion | Dep. | State ctrl | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C09 | Japan · Dicing tools (95%, 2025) | high | low | medium | high | high | medium | Disco 87% = 1 firm (Accretech 8.1%). The nearest non-Japanese maker is ASM Pacific (SG) at 2.5%. No US maker, but the precision-mechanics technology is mature. |
| C12 | Japan · Handlers and probers (41.5%) | medium | medium | medium | medium | high | medium | Tokyo Electron 19.9% + Accretech 17.1% = 2 firms. Hon Tech (TW) 13.5% and Semics (KR) 9.5% are alternatives, and the market is fragmented. |
| C15 | Japan · Memory test tools (63.7%) | high | medium | medium | high | high | medium | Advantest 63.7% = 1 firm. Teradyne (**US**) at 25.4% is a domestic alternative that would need years to scale. |
| C17 | Japan · Photomask handlers (90.3%) | high | low | medium | high | high | medium | Muratec 83.2% = 1 firm (Daifuku 7.1%). The only alternative is Gudeng (TW) at 6.1%. A niche automation product ($132m market). |
| C19 | Japan · Resist processing tools (95.2%) | high | low | high | high | high | medium | Tokyo Electron 92.6% = 1 firm. Lam (US) has 1.4%. These coater/developers are tightly paired with lithography scanners at the leading edge, so a credible new entrant is lithography-class work. |
| C21 | Japan · Single-wafer spin and spray, adv. pkg. (66.8%) | high | medium | medium | medium | high | medium | Screen 40.5% + Shibaura 26.2% = 2 firms. Lam 17.3% and Veeco 13.4% (both **US**) cover about 31%. |
| C23 | Japan · Tube diffusion and deposition furnaces (75.1%) | high | medium | medium | medium | high | medium | Tokyo Electron 50.8% + Kokusai 24.4% = 2 firms. NAURA (CN) 14.6% and ASM (NL) 7% are the alternatives, with no meaningful US maker. |
| C25 | Japan · Wet etching and cleaning tools (51.9%) | medium | medium | medium | medium | high | medium | Screen 32% + Tokyo Electron 19.1% = 2 firms. Lam 22.1% and ACM Research 9.8% are **US-headquartered**, though ACM's operations are mainly in China. |
| C27 | Japan · Photomasks (53%, **2019**) | medium | high | low | medium | high | medium | ETO gives no firm shares. From general knowledge, Dai Nippon, Toppan and Hoya are the Japanese makers (3 firms). Leading-edge fabs (Intel, TSMC, Samsung) make most of their own masks, and Photronics is **US**-based. **The data is 2019, so check the year.** |
| C30 | Netherlands · ArF immersion lithography (99.3%) | high | low | high | high | high | medium | ASML 99.3% = 1 firm. There is no other supplier at this level, and no US lithography maker. |
| C32 | Netherlands · EUV lithography (100%) | high | low | high | high | high | medium | ASML 100% = 1 firm. EUV took ASML and its partners about two decades to commercialise. This is the strongest single chokepoint in the set. |
| C34 | Netherlands · Overlay metrology (47.9%) | medium | high | low | high | high | medium | ASML 47.9% = 1 firm. KLA (**US**) already holds 51.5%. |

## Things to note

1. **Part 1 rows under the same rule.** Everything stays the same except **C14 (e-beam mask writers)**, which I scored high. If Intel does majority-own IMS (46.6%), then a US-controlled maker already exists, and the rule gives **medium**. Worth checking.
2. **The two ASML lithography rows (C30, C32) and C19** are the only rows here with high time to replace. With C26, C33 and possibly C14 from your set, they form the group that looks most like the oil embargo (K1).
3. **ACM Research and Mattson** are US-headquartered but China-linked, which makes "US maker" less clean for C25 and C11.
