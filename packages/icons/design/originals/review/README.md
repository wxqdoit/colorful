# Originals review · 2026-09-11

## Style revision 1.1

All 1,000 subjects now pass the shared semantic-layer and detail-density policy. Reviewed all 20 regenerated contact sheets at 50 / 26 px and the 12 representative comparisons in `style-light.png` and `style-dark.png`. Fifteen subjects received explicit structural edits; ten have individually recorded optical offsets. Compared with the preserved 0.7.0 sources, 988 SVG files changed through these edits and the part-size-based corner rules. The remaining twelve already satisfy the rule without altered serialization.

Current checks: 37 icon tests; 15,114 variants pass roundness and geometric bounds. `style.json` records every original's actual line length, contour count and fill layers. The written policy lives in `docs/originals-style.md` at workspace root. Previous review results below document the original delivery.

Completed 1,000 original subjects across 17 categories. `sheet-01.png` through `sheet-20.png` show the full registered collection at 50 px and 26 px. Every subject was visually inspected in drawing batches; `weights.png` records a six-style sample including the repaired cleaver, scissors and twisting tower.

Verification results:

- 1,000 unique canonical vector constructions; no duplicate geometry or invalid original markup.
- All 2,519 icons retained in the public catalog; all 15,114 weight variants pass roundness and stroke-bound checks.
- Icon package: 34 tests passed; TypeScript and generated-source consistency passed.
- Website: 11 tests passed; TypeScript and production build passed.
- Packed library: 22 ESM/CJS entry imports, six server-condition imports, declaration consumers, UMD and tree shaking passed. Original icon imports render all six weights.
- SVG archive: 6,000 parseable SVGs, 1,000 per style, using ordinary hex colors.
- Browser: fresh page loads 48 original previews without console errors; bilingual search, 80-item Animals filter, collection selection reset, palette/weight/mirror controls and original JSX export checked. At 390 px, document and details drawer remain within the viewport.

The main library build initially exceeded Node's default 4 GB heap. The ESM/CJS build completed with the configured 8 GB limit, followed by a separate UMD build; the build runner now applies this limit automatically. The website still emits Vite's advisory warning for its large catalog chunk; individual icon artwork remains lazy-loaded.
