# Step 4 chokepoint scores, part 3 (10 rows)

The method and the time-to-replace rule are the same as in part 2 (`notes/step4_scores_part2.md`). All 35 final scores are in `scoring/chokepoints_final.csv`.

**These rows bring in new countries, so dependence and state control vary for the first time.** Austria is militarily neutral and Singapore is a US security partner but not a treaty ally. Both score lower on dependence than the US treaty allies (Japan, the Netherlands, Germany, Sweden, South Korea and, in practice, Taiwan).

| Row | Chokepoint | Conc. | Subst. | Time to replace | Cohesion | Dep. | State ctrl | Evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| C02 | Austria · E-beam mask writers (46.6%, 2025) | medium | medium | medium | high | medium | medium | IMS Nanofabrication = 1 firm. NuFlare and JEOL (JP) hold the rest. **IMS is, as far as I know, majority Intel-owned**, so under the rule the US already controls this supply, and Austria's real leverage is doubtful. Austria is neutral (no US security tie), and the US is an important but not majority market. |
| C03 | Austria · Wafer bonding and aligning tools (47.9%) | medium | medium | medium | high | medium | medium | EV Group = 1 firm (privately owned). Tokyo Electron (JP) 25.6% and SUSS (DE) 20.9% are alternatives. No US maker, but mature enough for a new entrant. EU dual-use export licensing applies. |
| C06 | Germany · Mask aligners (82.2%) | high | medium | medium | high | high | medium | SUSS MicroTec = 1 firm. EV Group 7.4%, Toray 5.7% and Ushio 1.3% are small alternatives. A mature tool used mainly in packaging and MEMS. Germany relies on the US through NATO. |
| C07 | Japan · Critical-dimension metrology (72.1%) | high | medium | medium | high | high | medium | Hitachi 71.9% = 1 firm. Applied Materials (**US**) holds 27.5%, a domestic minority maker. |
| C13 | Japan · Insulator etching tools (55.9%) | medium | medium | medium | high | high | medium | Tokyo Electron 55.9% = 1 firm. Lam (**US**) holds 29.2%, and AMEC (CN) 12.4%. |
| C29 | Netherlands · ArF dry lithography (94.4%) | high | low | high | high | high | medium | ASML 94.4% = 1 firm. Nikon (JP) at 5.6% is the only alternative and could not cover most of the need quickly. No US lithography maker. |
| C35 | Singapore · Auto ball bonders for IC (90.9%) | high | medium | low | high | medium | low | Kulicke & Soffa 83.6% = 1 firm (ASM Pacific 7.3%). K&S is headquartered in Singapore but **incorporated in the US and listed on Nasdaq**, so the US arguably already controls this supply. Singapore's government has few practical levers over it. Wire bonding is mature. |
| C40 | South Korea · Burn-in test tools (61.4%) | high | medium | medium | high | high | medium | DI 53.9% = 1 firm (UniTest, Exicon and YEST are small). Aehr Test (**US**) 9.9%, Chroma (TW) and Chinese makers are alternatives. A mature tool ($359m market). |
| C41 | Sweden · Laser mask writers (70.7%) | high | medium | medium | high | high | medium | Mycronic 70.7% = 1 firm. Applied Materials (**US**) 27.9% is a domestic minority maker. Sweden joined NATO in 2024. |
| C42 | Taiwan · Leading-edge logic fabrication (69%, **2022, by fab location**) | high | low | high | high | high | medium | TSMC = 1 firm. Samsung (KR, 31%) can't match its volume or yields, and Intel's leading-edge process is only now ramping. TSMC's Arizona fabs and US alternatives need years to replace most of the supply. Taiwan relies on the US for security. Its government restricts how advanced the processes at TSMC's overseas fabs can be, but TSMC is a private firm. |

## Things to note

1. **Two rows where the "chokepoint" may really be US-controlled:** C02 (IMS, if Intel-owned) and C35 (Kulicke & Soffa, US-incorporated). Both come from ETO counting firms by headquarters country. They are worth flagging in the write-up as cases where the screen may overstate the country's leverage. If both were treated as US, Austria would still have C03 and Singapore would have no strong row left.
2. **Taiwan (C42) and EUV/ArF lithography (C30, C32, C29) are the strongest profiles in the whole set:** high concentration, low substitutability and high time to replace. They are the rows that look most like the oil embargo (K1).
