# Independent cross-review: nature and people-media

Read-only review of both drawing scripts and the supplied light/dark nature sheets and all four people-media sheets. Findings below are concrete visual/semantic changes to consider; no files or prior checks were rerun.

1. **`four-k`, `standard-definition` — encoding meaning is missing.** In `people-media.mjs` these resolve respectively to four rounded blocks and two rounded blocks inside the same media frame. On the rendered sheet they read as grid/layout buttons; neither communicates 4K or SD. The adjacent `high-definition` already uses recognizable hand-authored HD path geometry. Give these two similarly legible, purpose-specific encoding marks (editable paths, no text/font), or an equally explicit resolution metaphor.

2. **`person`, `person-simple-circle` — lower body has only one leg.** The shared `miniPerson` path narrows from the torso into one central rectangular stem (`H14V22H10V17`), without a gap between legs. At 26px it resembles a pedestal or pawn rather than a standing person. Split the lower body into two short rounded legs; propagate to the circle version.

3. **`user-gear`, `user-circle-gear` — gear renders as a crosshair.** `mark.gear` consists of a pale circular body, center dot and four straight radial ticks. In the sheet it reads as a targeting/sparkle symbol, losing the user-settings meaning. Replace the four ticks with a compact toothed gear silhouette around a clear center opening.

4. **`record` — hollow-ring control loses the recording convention.** It is an outer filled circle with a large inset pale circle, which makes it read as a radio button, circle outline or target. A substantially filled recording dot with a small meaningful rim treatment would retain the established media-control distinction.

5. **`football` — silhouette is too round and irregular.** In both nature sheets the nearly circular body is read mainly through its laces; the outline does not convey the elongated, pointed American football named by the asset. Redraw the body as a softer elongated oval with two tapered ends, keeping the sparse diagonal lacing and end panels.

6. **`basketball`, `tennis-ball`, `volleyball`, `soccer-ball` — common color division crosses their physical panels.** The shared `ball` shape adds the identical curved right-side color patch to every ball, while the sport-specific panel/seam lines are drawn independently over it. This is especially visible in the dark sheet: the color boundary does not follow a tennis felt panel, volleyball panel, basketball section or soccer panel. Replace that shared patch for these assets with individually filled physical panels aligned to their seam geometry. The circular ball body can remain shared.


修复状态（v0.3.0）：以上问题已反馈至对应绘制源并修复，重新生成后通过全量几何与组件检查。详细验证见 verification.md。
