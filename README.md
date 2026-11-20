# Uma Grove

A local-save Umamusume parent-looping tracker. Create separate trees, select 3–4 core skills and any number of priority skills, and record branches alongside actual pedigrees.

## Run
Node.js 20 or newer. No third-party runtime dependencies.

```sh
npm run dev
npm test
npm run build
```

Open http://127.0.0.1:4173. Vercel uses `npm run build` and the `dist` directory; no environment variables are needed.

## Features
- Vertical or horizontal branches; shared veteran library, role icons, borrowed-parent availability, and documented-parent filter.
- Separate core and priority goals with editable High / Normal / Situational preferences, with core revisions and three-, six-, and seven-slot pedigree coverage.
- Planned runs, support decks, G1 win records and intended race calendars. Convert a plan into its actual result without breaking links.
- Character, skill and support reference catalog. Conditional character/support event sources are distinguished from available kit skills.
- JSON import (file or paste), merge, export and one previous-save backup. Personal data stays in browser storage. No accounts, analytics or server database.
- Imported records are validated for malformed data, dangling references and cycles. Unknown sparks are distinct from confirmed absences.

## Calculation scope
The planner targets a **Global baseline**, not every future scenario or server rule. Rates are community research estimates, not official guarantees. Incomplete ancestry gives unknowns or lower bounds. A race calendar never creates wins automatically. Only documented unique G1 wins contribute to affinity.

White generation uses the empirical base × 1.1^lineage-copies fit, conditional on purchasing the skill. It is not the probability of obtaining a hint, buying the skill, and generating its spark combined. All-core multiplication assumes independent rolls. Conditional event and support-hint probabilities are deliberately not invented. Final aptitude predictions are explicit what-if inputs.

A three-record branch milestone is not a guarantee of a stable loop. Inspect both parents and all four grandparents for six-slot core coverage, and still check every result. The seven-record view also includes the recorded veteran itself.

## Sources and data
- [LightBirb Parenting 101](https://www.youtube.com/watch?v=0fHxGjOu-T8) and [201](https://www.youtube.com/watch?v=o-zOZnk2FFo): looping workflow and priorities.
- [Hakuraku generation research](https://hakuraku.moe/notes/spark_generation): empirical generation and star-rate models.
- [Hakuraku inheritance theory](https://hakuraku.moe/notes/sparks): individual-slot affinity and inheritance models.
- [GameTora](https://gametora.com/umamusume): character, skill, support, event-source, race and relationship data. Catalog snapshot: 2026-11-20; includes JP entries, while the planner filters Global releases at that date.
- [Uma Guide](https://uma.guide/guides/sparks): starting aptitude thresholds.

GameTora images are loaded remotely, so image requests disclose ordinary browser/network metadata to GameTora. Imported saves are not uploaded. Character artwork and game data belong to their respective owners; this is an independent fan project with no endorsement. The small app icon is an original Grass Wonder-inspired drawing.

Catalog event records are references, not an exhaustive verified event-probability database. Consult linked character timelines for exact choices and prerequisites. No private screenshots or personal saves are bundled in this repository.

## Updating
Edit source, run tests, build, and push to the connected Vercel repository. Keep mechanics changes covered by boundary tests and update the source/scope notes. Catalog data must be reviewed for Global compatibility before changing the snapshot date.
