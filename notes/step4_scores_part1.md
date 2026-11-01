# Step 4 chokepoint scores, part 1 (13 rows)

The target is the US, scored as of 2026, using the anchors in `notes/variable_anchors.md`. All 35 final scores are in `scoring/chokepoints_final.csv`.

**How each score was set:**
- **Concentration** uses the ETO world share: 60% or more is high, 25–60% is medium.
- **Cohesion** is counted from ETO firm shares: the number of firms needed to reach 80% of the country's share (1 is high, 2–3 is medium, 4 or more is low).
- **Substitutability, time to replace and state control** are judgments.
- **Dependence on the target** is **high for every row**, because Japan, the Netherlands and South Korea all rely on the US as their main security guarantor. So this variable can't tell today's rows apart (see "Things to note" below).

| Row | Chokepoint | Conc. | Subst. | Time to replace | Cohesion | Dep. | State ctrl | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C08 | Japan · Crystal machining tools (99.7%, 2025) | high | low | medium | medium | high | medium | Disco 68.7% + Accretech 24.9% = 2 firms. Almost no non-Japanese supplier (0.3%). Precision grinding is less complex than lithography, so a new US entrant could take 2–5 years. |
| C11 | Japan · Dry stripping tools (45.9%) | medium | medium | medium | medium | high | medium | Kokusai 35.7% + Shibaura 9.2% = 2 firms. Mattson 22.6% (US-based but **Chinese-owned**), Trymax (NL) 9.1% and NAURA (CN) could cover part. A non-critical process step. |
| C14 | Japan · E-beam mask writers (53.4%) | medium | medium | high | medium | high | medium | NuFlare 39.2% + JEOL 14.2% = 2 firms. The other 46.6% is IMS (Austria), which is **majority Intel-owned as far as I know**, so the US may already control an alternative. If so, substitutability is closer to high. |
| C16 | Japan · Packaging tools (57.3%) | medium | medium | medium | medium | high | medium | TOWA 39.4% + Yamaha Robotics 17.4% = 2 firms. Besi (NL) 16% and Korean suppliers could cover part. A back-end tool with moderate complexity. |
| C18 | Japan · Photomask inspection and repair (42.8%) | medium | medium | medium | high | high | medium | Lasertec 42.0% = 1 firm. KLA (**US**) holds 45.9%, so the US already has a domestic supplier for much of this. But Lasertec is reported to be the sole maker of actinic EUV mask-blank inspection, a niche ETO doesn't separate out. |
| C20 | Japan · Resist processing tools, adv. pkg. (92.1%) | high | low | medium | high | high | medium | Tokyo Electron 92.1% = 1 firm. The nearest alternatives are SEMES (KR) 4.8% and SUSS (DE) 1.8%. No US maker. |
| C22 | Japan · SoC test tools (65.9%) | high | medium | medium | high | high | medium | Advantest 65.5% = 1 firm. Teradyne (**US**) 22% is a real domestic alternative, but scaling it to cover the gap and requalifying test programs takes years. |
| C24 | Japan · Wafer handlers (88.2%) | high | medium | medium | medium | high | medium | Daifuku 49.3% + Muratec 32.7% = 2 firms. SEMES (KR) 11.2% is the main alternative. Swapping fab automation in existing fabs is hard, but new fabs could choose differently. |
| C26 | Japan · i-line lithography (56.9%) | medium | medium | high | high | high | medium | Canon 53.7% = 1 firm (Nikon 3.3%). ASML (NL) 31.2% covers part. The US has only Veeco (5.2%). Mature technology, but no US lithography base to build from. |
| C28 | Japan · Silicon wafers (56%, **2019**) | medium | medium | medium | medium | high | medium | ETO gives no firm shares here. From general knowledge, Shin-Etsu and SUMCO are the two Japanese leaders, so 2 firms. GlobalWafers (TW, with a new Texas plant), Siltronic (DE) and SK Siltron (KR) are alternatives. **The data is 2019, so check the year.** |
| C31 | Netherlands · Atomic layer deposition tools (54.5%) | medium | medium | medium | high | high | medium | ASM International 54.5% = 1 firm. Tokyo Electron 15.5%, Lam (**US**) 10.5% and Kokusai 7.6% are alternatives, but ASM leads specific leading-edge steps. |
| C33 | Netherlands · KrF lithography (66%) | high | medium | high | high | high | medium | ASML 66% = 1 firm. Canon (JP) 31% could cover part. The US has no lithography toolmaker, so building one would take more than 5 years. |
| C39 | South Korea · HBM memory (81%, 2025 projection) | high | medium | medium | medium | high | medium | SK hynix 52.3% + Samsung 28.7% = 2 firms (TrendForce). Micron (**US**) 19% makes HBM at the needed quality but can't cover most demand. Its new US fabs are years away, which puts time to replace at 2–5 years. |

## Notes

1. **Dependence on the target is "high" for every row.** That's correct under the anchors, but it means this variable adds nothing to today's profile. It also didn't separate the past cases. Consider whether it belongs in the comparison.
2. **State control is "medium" for every row.** All three governments run export-licensing systems they've used (Japan in 2019 and 2023, the Netherlands on ASML from 2023, Korea's strategic-items rules), but the firms are private. Japan's 2019 move against Korea could argue for "high" for Japan's rows.
3. **Where the US already has a domestic supplier, the leverage is weaker than the share suggests.** This applies to C18 (KLA), C22 (Teradyne), C31 (Lam) and C39 (Micron), and arguably C14 (IMS, if Intel-owned). It shows up in substitutability, not concentration.
4. **Two ownership facts to check:** IMS Nanofabrication's majority owner, and Mattson Technology's Chinese parent. Both affect substitutability.
