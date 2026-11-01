# Variable anchors

These are the meanings of low, medium and high for the six Step 2 variables. They need to work for a 1970s commodity case and for a 2026 chip input alike.

- **Target:** the side the leverage is aimed at. For today's chokepoints, that is the US.
- **Supplier:** the country, or group of countries, holding the supply.
- Score each variable as it stood **at the start of the episode** (past cases) or **as of 2026** (chokepoints).
- **Past cases: don't let how the episode ended shape the score.** The outcome (worked, partly worked or backfired) is recorded separately, and it is what the scores are meant to explain. Scoring from the outcome would make the comparison circular.
- If the evidence sits right on a boundary, pick the level that the better source supports, and say so in `evidence`.

| Variable | Question | Low | Medium | High | Which end helps the supplier? |
| --- | --- | --- | --- | --- | --- |
| **Concentration** | What share of the supply the target needs from outside does the supplier (or group) hold? | Under 25% | 25% to 60% | Over 60% | **High** |
| **Substitutability** | Can the target switch to another supplier or redesign around it? | No other supplier makes it at the needed quality, and there is no workable redesign within about a year | Other suppliers or a redesign can cover **part** of the need, or all of it with a clear cost, quality or delay penalty (for example, re-qualifying a new supplier) | Other suppliers can cover **most** of the need within months, at similar quality and price (a commodity grade) | **Low** (low substitutability helps the supplier) |
| **Time to replace** | How long would the target need to build its own supply? | Under 2 years | 2 to 5 years | Over 5 years | **High** |
| **Cohesion** (counted, not judged; see the note below) | How many separate actors must hold the line to keep the supplier's share? | 4 or more actors | 2 to 3 actors | 1 actor | **High** (fewer actors are easier to hold together) |
| **Dependence on the target** | How much does the supplier rely on the target, for security or markets? | The target takes under 10% of the supplier's exports of the good, and the supplier does not rely on the target for its security | The target takes 10% to 30% of those exports, **or** it is an important but not essential security partner | The target takes over 30% of those exports, **or** it is the supplier's main security guarantor | **Low** (high dependence hurts the supplier) |
| **State control** | Can the government direct the firms that hold the supply? | Private firms hold the supply, and the government has no ready legal tool to direct their sales, or using one would face strong legal or political resistance | The government has an export-licensing or similar tool that covers the good and has been used, but the firms are private and can push back | The state owns or directly runs the producers (for example, national oil or mining companies), or has shown it can stop exports at will | **High** |

## Notes for scoring

- **How to count actors for cohesion:**
  - **Who the actors are:** for a group of countries (OAPEC, CIPEC, the tin council), the actors are the **member countries**. For a single country (China in 2010, Japan in 2019, and every chokepoint row today), the actors are the **firms** that hold that country's share.
  - **How to count:** start with the largest actor and keep adding the next largest until together they hold **at least 80%** of the supplier's share. The number you've reached is the count. The 80% cut-off means small fringe players don't count, but anyone big enough to undercut the rest does.
  - **When:** use shares at the start of the episode for past cases, and the data year for today's rows. For today's rows, firm shares are in ETO's `provision.csv` or on the ETO Supply Chain Explorer.
  - **What doesn't count here:** whether a government can make its firms comply belongs under **state control**, not cohesion.

- **Dependence on the target:** markets and security are both in the question. Score whichever of the two is **higher**. For example, a supplier that sells the target little but relies on it for defence scores **high**.
- **Substitutability vs time to replace:** substitutability is about switching to **existing** other suppliers or designing around the input. Time to replace is about the target **building its own** supply. Keep them separate. For example, EUV tools score low on substitutability **and** high on time to replace, whereas a material with many foreign makers might score high on substitutability and still be slow to make at home.
- **Concentration for a group:** add up the members' shares. For past cases, use the share of world exports or of the target's imports, whichever the source gives, and say which in `evidence`.
- **Directions differ:** for four variables (concentration, time to replace, cohesion and state control), high helps the supplier. For substitutability and dependence on the target, **low** helps the supplier. Score what is true, not what helps. The direction only matters when the scores are read in Step 6.
