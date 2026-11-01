# Step 5: the asks

The list has **4 asks** and **3 things to test as "avoid"**, 7 items in all. The joint consultation seat in US export-control rule-making was dropped: Andrew judged it too unlikely on its face to be worth testing.

Two rules were set before scoring:
- **Threat or condition needed** means the US government or US firms would be unlikely to agree unless the coalition ties the ask to supply.
- **Safety value** is high if the ask acts directly on the chips or the frontier developers, medium if it is an enabler, and low if the link is weak or it could raise risk.

The same table is in `results/asks.csv`.

| ID | Item | What it requires of the US government or US firms | Threat or condition needed? | Safety value | Who has to agree |
| --- | --- | --- | --- | --- | --- |
| A1 | Shared anti-diversion and end-use checks | **Government:** the US export-control agency shares diversion intelligence and end-user lists, and coordinates licensing and checks with members. **Firms:** US chip designers cooperate on checks of where finished chips end up. | **No.** Stopping diversion is the aim of US export controls already. | **High.** It acts directly on chips reaching actors with no safety oversight. | Members' export agencies, the US government, and suppliers on both sides |
| A2 | Frontier model access for members' governments and evaluators | US frontier labs give members' AI safety institutes pre-deployment access to new models. The US government doesn't block it. | **Yes (uncertain).** Labs already give some access voluntarily (to the US CAISI and UK AISI). But in 2026 the White House reportedly asked labs to hold models back from UK testers until US officials had checked them. | **Medium.** Testing is an enabler: risk falls only if findings change what is deployed. | US labs, the US government, and members' institutes |
| A3 | Safety conditions on buyers above a set compute scale (evaluations, incident reporting) | US labs and cloud firms buying compute above the threshold run evaluations and report incidents. The US government accepts foreign-set conditions on US buyers. | **Yes.** It is the clearest "condition on supply". Labs and the US government would resist binding conditions set abroad. | **High.** It acts directly on frontier developers. | Members (through export licensing), coalition firms (through sales contracts), US labs and clouds, and the US government |
| A4 | Support for hardware-based verification features (e.g. location checks) | US chip designers (Nvidia, AMD) build location verification into export-controlled chips. The US government sets a requirement or standard. | **Yes, aimed at the firms.** US bills point the same way (the Chip Security Act, not enacted as of May 2026), but Nvidia publicly opposes such features. | **Medium.** It is an enabler for anti-diversion checks and for verifying future agreements. | US chip designers, the US government, and coalition firms that make or package the chips (TSMC, SK hynix) |
| A5 | *Avoid?* Withholding supply | Nothing it would agree to. It imposes costs on the US. | **Yes.** It *is* a threat to cut. | **Low.** It might slow frontier compute for a while, but past cases suggest it speeds up US replacement and burns the leverage. | All members, and their firms, which would forgo revenue |
| A6 | *Avoid?* Coordinating prices | Nothing. It raises costs for US buyers. | **Yes.** It is collective supply management. | **Low.** It earns revenue but has no safety link. It also clashes with EU, Japanese and Korean competition law. | Coalition firms and governments |
| A7 | *Avoid?* Threatening to sell to China | Nothing. It is aimed at US policy. | **Yes.** It *is* a threat. | **Medium (contested).** It could help AI safety by easing US–China race pressure, reducing China's push for a separate chip ecosystem, and keeping China inside shared safety research, evaluations and governance. It also gives Chinese labs more compute for safety work. Against that, more compute also raises China's capacity for powerful and military AI. The net effect is genuinely contested. (Andrew's judgment; the first draft said low.) | Members and firms |

## Notes

- **A3 is several steps removed from the coalition's chokepoints.** The coalition sells tools, fab capacity and memory **upstream**, to chipmakers such as TSMC and Nvidia, not to the labs that buy compute. A condition on buyers would have to be passed down through contracts (ASML to TSMC to Nvidia to cloud firms to labs). That makes it hard to enforce. This should be weighed in Step 6.
- **A2 and A4 changed from what one might expect.** Both look like things the US already wants. But the 2026 White House stance on UK testing, and Nvidia's opposition to location verification, suggest each needs some leverage behind it. Both rest on press reports and should be checked against primary sources.
- **Only A1 matches what the US already wants and needs no leverage.**

## Sources

- Tom's Hardware, "Nvidia defiant over backdoors and kill switches in GPUs as US mulls tracking requirements" (2025): https://tomshardware.com/pc-components/gpus/nvidia-defiant-over-backdoors-and-kill-switches-in-gpus-as-u-s-mulls-tracking-requirements-calls-them-permanent-flaws-that-are-a-gift-to-hackers
- Yahoo/Reuters, "Nvidia reiterates its chips have no backdoors, urges US against location verification": https://tech.yahoo.com/ai/articles/nvidia-reiterates-chips-no-backdoors-025056979.html
- Foundation for American Innovation, "The Chip Security Act: a bipartisan solution to chip smuggling": https://www.thefai.org/posts/the-chip-security-act-a-bipartisan-solution-to-chip-smuggling
- The Next Web, "UK says it will again test OpenAI and Anthropic models before release" (2026; reports the White House request): https://thenextweb.com/news/uk-ai-security-institute-pre-release-access-openai-anthropic
- Cloud Security Alliance research note, "CAISI frontier AI testing agreements" (May 2026; secondary summary): https://labs.cloudsecurityalliance.org/research/csa-research-note-caisi-frontier-ai-testing-agreements-20260/
