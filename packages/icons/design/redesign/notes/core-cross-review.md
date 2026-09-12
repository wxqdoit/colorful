# Core group cross-review

Rendered and visually reviewed all 374 assets at 56px and 26px in `/tmp/core-{0,1,2,3,4,5}.png`; inspected the relevant drawing routes. No core source or assets changed.

1. **`rows-plus-top` is identical to `rows-plus-bottom`, and both show the plus below the rows.** The `columns`/`rows` route chooses x=3 only for names ending in `left`, and x=20.5 for every other plus state, then rotates the whole composition. This sends both row variants to the bottom. Select the pre-rotation left-side position for `rows-plus-top`, or place its plus explicitly above the rotated rows. This is an actual reversed/missing operation state.

2. **`layers` and `copy` are byte-identical.** Both render the same overlapping near-upright pages with identical text marks. Keep the overlapping duplicate sheets for copy; give layers a distinct exposed stack of offset planar sheets, with separation expressing layer ordering. Do not simply change one interior line.

3. **`pen` and `pencil` are byte-identical and both depict a sharpened pencil.** The angled object has a graphite triangle and faceted wooden tip; no pen nib, rollerball tip or clip distinguishes `pen`. Keep that construction for pencil and draw pen with a capped/barrel body and a small metal writing tip or clip.

4. **`highlighter-circle` and `marker-circle` are byte-identical.** Both circular variants display the same chisel-tip highlighter. If marker and highlighter remain distinct catalog entries, give marker a visibly narrower felt nib or different cap/barrel profile, retaining the same requested circle enclosure.

Other exact duplicate pairs were inspected but are not independently treated as semantic defects here: download/tray-arrow-down, upload/export/tray-arrow-up, file-archive/file-zip, presentation-chart/projector-screen-chart, and regular/simple open-envelope or broken-link variants can reasonably share the same operation or object semantics.


修复状态（v0.3.0）：以上问题已反馈至对应绘制源并修复，重新生成后通过全量几何与组件检查。详细验证见 verification.md。
