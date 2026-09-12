# Objects independent visual cross-review

Reviewed all **227 assigned icons** across `/tmp/objects-0.png` through `/tmp/objects-3.png`. Contact sheets were generated from the current SVG assets using the `people-media-preview.mjs` arrangement: approximately 56px and 26px, white background. The observations below were checked against the relevant generator routes. No objects generator or asset was modified, and this review does not substitute for geometry/XML checks or dark-theme review.

## Actionable findings

1. **`grains-slash` — the grain ear currently reads as a forbidden leafy sprout.** In sheet 1 the three oversized, widely separated, pointed lobes look like ordinary leaves. The two lower lobes also stop short of the thin central stem, weakening the grain structure at 26px. This contradicts the intended grain/gluten-free meaning and differs markedly from the closely stacked kernels of `grains` in the nature group. Replace the three leaf lobes with three close pairs of short, plump wheat kernels attached to the same stalk; retain the existing diagonal prohibition stroke. The `grains` body provides an appropriate family reference, but this finding does not require changing that asset.

2. **`push-pin-slash` and `push-pin-simple-slash` — the disabled variants collapse into the same visual design.** In sheet 2 their pin bodies are identical and upright; the only difference is that the diagonal slash extends one unit further at each end. Conversely, `push-pin` is visibly tilted 25 degrees while `push-pin-simple` is upright. Give `push-pin-slash` the same tilted body as its enabled partner and draw the slash over that body; keep the simple pair upright. This restores the named family relationship and a meaningful distinction at 26px, instead of relying on nearly invisible slash-length differences.

## Remaining set

No additional severe semantic error, obvious broken main part, blank asset, clipping, or excessive detail density was apparent in the other icons on these four light-background sheets. Some inherently thin objects and large architectural silhouettes have lower visual weight, but they remain recognizable in the supplied 26px rendering; no speculative restyling is requested here.


修复状态（v0.3.0）：以上问题已反馈至对应绘制源并修复，重新生成后通过全量几何与组件检查。详细验证见 verification.md。
