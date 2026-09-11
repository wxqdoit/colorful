import { expect, it } from "vitest";
import { inspectOriginal } from "../design/originals/validate.mjs";
const wrap = (body: string) =>
  `<svg viewBox="0 0 24 24" stroke="var(--project-art-detail, #aa8bcf)" stroke-width="1.1"><rect x="5" y="5" width="10" height="10" rx="2" fill="var(--project-art-surface, #f0e9f8)" stroke="none"/><path d="M8 18h8" fill="none"/>${body}</svg>`;
it("detects color-only duplicates by comparing transformed geometry", () => {
  const first = inspectOriginal(
    wrap(
      '<circle cx="12" cy="12" r="3" fill="var(--project-art-back, #d9c9ed)" stroke="none"/>',
    ),
  );
  const second = inspectOriginal(
    wrap(
      '<circle cx="12" cy="12" r="3" fill="var(--project-art-detail, #aa8bcf)" stroke="none"/>',
    ),
  );
  expect(first.issues).toEqual([]);
  expect(first.geometryHash).toMatch(/^[a-f0-9]{64}$/);
  expect(first.geometryHash).toBe(second.geometryHash);
});
it("checks nested transforms and the thickest stroke when detecting clipping", () => {
  const nested = inspectOriginal(
    wrap(
      '<g transform="translate(12 0)"><g transform="translate(8 0)"><path d="M2 5L5 12" fill="none"/></g></g>',
    ),
  );
  expect(nested.issues.join()).toContain("out of bounds");
  const bold = inspectOriginal(wrap('<path d="M23.3 8V16" fill="none"/>'));
  expect(bold.issues.join()).toContain("out of bounds");
});
