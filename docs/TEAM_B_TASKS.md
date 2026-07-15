# Team B — Data & Dashboard Tasks

Goal: Integrate the full provided Seoul JSON datasets, provide robust data loading utilities, and implement dashboard charts and aggregations used in the presentation.

Priority: High (dashboard is 1st-priority feature)

## Quick start
1. Clone repository and create branch `feature/dashboard-<initial>`
2. `npm ci` and `npm run dev`
3. Work on `src/utils/dataLoader.js` and `src/views/DashboardView.vue`

## Required tasks
- Data loader
  - Read all JSON files in `public/data/` (e.g. `서울_관광지.json`, `서울_문화시설.json`, ...)
  - Normalize fields: ensure `mapx`, `mapy` converted to numbers; fallback values for missing images/addresses
  - Expose helpers: `getAllItems()`, `getByCategory(cat)`, `aggregateBy(field)`

- Aggregations for dashboard
  - Category counts (tourist, culture, shopping, lodging, etc.)
  - District counts: extract district/gu from `address` field and aggregate
  - KPI values: total items, category count, user post count (from `localStorage` via `getPosts()`)

- Charts & UI
  - Use Chart.js (already included). Implement:
    - Bar chart: category counts
    - Doughnut: category ratio
    - Bar chart: district counts (top 10)
  - Ensure charts handle empty data gracefully

- Performance & limits
  - Avoid sending entire dataset to functions or chatbot; use client-side filtering and only include essential fields when sending context (title, address, category, id)
  - Provide sampling or limit results to top N (e.g. 10)

- Tests
  - Add vitest unit tests for `dataLoader` helpers (parsing, aggregate results)

## Files to modify / touch
- `src/utils/dataLoader.js` (main)
- `src/views/DashboardView.vue` (visuals)
- `public/data/` (may add small extraction scripts but do not commit large new datasets)

## PR checklist
- [ ] `npm ci` passes
- [ ] `npm run build` passes
- [ ] Charts render with full dataset
- [ ] Aggregation results documented in PR body

---
