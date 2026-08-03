# Ripple
### Climate Doesn't Create Inequality. It Reveals It.

> An interactive data story exploring how climate change amplifies existing social and economic vulnerabilities across the Pacific.

---

## Competition

Built for the **2026 Pacific DataViz Challenge** (theme: **Climate Change**), submitted to the **Interactive** category.

Submissions close **August 31, 2026**.

---

## Core Question

> How do existing inequalities determine who suffers most from climate change?

Rather than asking *which country is worst*, Ripple asks *why do two places hit by the same hazard end up in such different places a year later?*

---

## Scope (locked)

To ship a finished, polished piece solo in ~4 weeks, this project is intentionally narrow:

- **One hazard type** (e.g. a specific cyclone event), not a general hazard catalogue.
- **Two countries/territories**, chosen because they were hit by the same hazard type but had visibly different recovery outcomes — not an open-ended country explorer.
- **One real ripple chain**, built from actual linked official data (disaster → economic loss → crop/livestock yield → tourism decline), not an illustrative diagram.
- **One comparison view** placing both countries side by side through that same chain, so the "why do outcomes differ" question is visible without extra explanatory text.

Anything beyond this (time sliders, story/exploration mode toggle, downloadable reports, full vulnerability-dimension dashboard) is a **v2 idea**, not part of this submission.

---

## Guiding Principles

- Data should tell a human story.
- Climate change is a multiplier — not the sole cause — of social issues.
- Every visualization should answer "why?" rather than simply showing "what."
- One narrow, finished story beats five shallow ones.
- Focus on empathy through evidence.

---

## Data Sources

At least one dataset is drawn from the official 2026 list on the Pacific Data Hub's .Stat Explorer. Planned datasets:

- Number of directly affected persons attributed to disasters
- Direct disaster economic loss
- Crop yield / livestock yield
- Tourist arrivals
- Power generation

All sources are exported manually as CSV from [stats.pacificdata.org](https://stats.pacificdata.org/) and listed in full in the competition submission form and in-app citation panel, per the competition rules.

---

## Technical Stack (locked — one tool per job)

**Languages**
- Python — one-time, offline data cleaning only (not run in-browser)
- JavaScript — entire frontend (no TypeScript, to avoid added overhead against the timeline)
- HTML/CSS — written through JSX + Tailwind, not hand-authored separately

**Data pipeline**
- Pandas — clean official CSV exports into 2–3 small static JSON files scoped to the two chosen countries and one event window
- *(GeoPandas skipped — no raw shapefile processing needed; a pre-made GeoJSON is used instead if a map is included)*

**Frontend**
- React (via Vite) — app shell and state
- D3.js — all charts and the ripple-chain visualization *(Plotly and Observable Plot deliberately excluded to avoid running three charting paradigms in parallel)*
- Leaflet — included only if a literal map view earns its place in the comparison; otherwise omitted
- Tailwind CSS — all styling

**Platforms/tools**
- Node.js + npm — local dev environment
- Git + GitHub — version control and source
- Netlify / Vercel / GitHub Pages — static deploy, satisfying the "must be made public" rule
- Chrome DevTools (device toolbar + Lighthouse) — only testing tool; no test framework or CI needed at this scope

---

## Build Plan

| Phase | Focus | Est. time |
|---|---|---|
| 1 | Lock the hazard + two-country story, pull real numbers | 2–3 days |
| 2 | Build the Pandas data pipeline into clean static JSON | 2–3 days |
| 3 | Scaffold React + build core D3 ripple-chain charts | 4–5 days |
| 4 | Build the two-country comparison view | 3–4 days |
| 5 | Polish: transitions, citations panel, accessibility, mobile pass | 4–5 days |
| 6 | Write framing text, test, submit with buffer before Aug 31 | 3–4 days |

---

## Rules Compliance Checklist

- [ ] Uses at least one dataset from the official 2026 list
- [ ] All additional data sources are open data and listed in the submission form
- [ ] Final dataviz is made public (deployed + link submitted)
- [ ] Submitted before August 31, 2026

---

## Current Status

Planning → Locking hazard/country pair and pulling official data.

---

## Vision

Climate hazards are natural. Disasters are shaped by society.

**Ripple** seeks to make those connections visible — not to tell people what to think, but to help them understand the systems that determine who bears the greatest burden of a changing climate.

---

## Author

**Aziel Douglas Orihao**

Information Systems | Climate Justice | Data Storytelling | Pacific Technology

*"The most important stories in data aren't the numbers themselves—they're the people whose lives those numbers represent."*
