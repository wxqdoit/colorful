import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as Icons from "../src/index";
import * as SSR from "../src/ssr";
import { iconCatalog } from "../src/catalog";

describe("generated library", () => {
  it("exports every cataloged icon under both naming conventions", () => {
    expect(iconCatalog.length).toBeGreaterThanOrEqual(24);
    const artwork = new Set<string>();
    for (const entry of iconCatalog) {
      const Component = Icons[`${entry.component}Icon`];
      expect(Component).toBe(Icons[entry.component]);
      expect(Component.displayName).toBe(`${entry.component}Icon`);
      const markup = renderToStaticMarkup(createElement(Component));
      expect(markup).toBe(
        renderToStaticMarkup(createElement(SSR[`${entry.component}Icon`])),
      );
      artwork.add(markup);
    }
    expect(artwork.size).toBe(iconCatalog.length);
  });
  it("renders all six weights with drawable artwork", () => {
    for (const entry of iconCatalog) {
      const versions = new Set<string>();
      for (const weight of [
        "thin",
        "light",
        "regular",
        "bold",
        "fill",
        "duotone",
      ] as const) {
        const markup = renderToStaticMarkup(
          createElement(Icons[`${entry.component}Icon`], { weight }),
        );
        expect(markup, entry.name).toMatch(
          /<(?:path|circle|ellipse|rect|line|polyline|polygon)\b/,
        );
        expect(
          (markup.match(/data-colorful-layer=/g) ?? []).length,
          entry.name,
        ).toBe(
          (
            markup.match(
              /<(?:path|circle|ellipse|rect|line|polyline|polygon)\b/g,
            ) ?? []
          ).length,
        );
        versions.add(markup);
      }
      // The four line-weight groups carry their documented widths;
      // full-catalog fill geometry preservation is checked in weight-integrity.test.ts.
      expect(versions.size, entry.name).toBeGreaterThanOrEqual(4);
    }
  });
  it("preserves the original reference artwork byte for byte", () => {
    for (const name of ["story", "scene", "watercolor"]) {
      expect(
        readFileSync(`design/archive/0.2.0-regular/${name}.svg`, "utf8"),
      ).toBe(readFileSync(`docs/assets/${name}.svg`, "utf8"));
    }
  });
});
