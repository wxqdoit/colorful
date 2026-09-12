import { describe, expect, it, vi } from "vitest";
import { iconCatalog } from "@colorful-icon/react/catalog";
import {
  categoryLabel,
  iconLabel,
  initialLocale,
  localeStorageKey,
  matchesQuery,
  optionLabel,
} from "../src/lib/i18n";

describe("bilingual catalog", () => {
  it("finds Chinese labels, English names and category meanings in either interface", () => {
    const story = iconCatalog.find((icon) => icon.component === "Story")!;
    expect(matchesQuery(story, "故事")).toBe(true);
    expect(matchesQuery(story, " STORYICON ")).toBe(true);
    expect(matchesQuery(story, "reading")).toBe(true);
    expect(matchesQuery(story, "creative")).toBe(true);
    expect(matchesQuery(story, "not-an-icon")).toBe(false);
  });
  it("translates every category and formats compound English names", () => {
    for (const category of new Set(iconCatalog.map((icon) => icon.category))) {
      expect(categoryLabel(category, "en")).not.toMatch(/[\u4e00-\u9fff]/);
      expect(categoryLabel(category, "zh")).toBe(category);
    }
    expect(
      iconLabel({ component: "ArrowBendUpLeft", label: "箭头" }, "en"),
    ).toBe("Arrow Bend Up Left");
    expect(optionLabel("duotone", "zh")).toBe("双色");
    expect(optionLabel("lavender", "en")).toBe("Lavender");
  });
  it("restores a supported language and falls back safely", () => {
    const storage = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    });
    localStorage.setItem(localeStorageKey, "en");
    expect(initialLocale()).toBe("en");
    localStorage.setItem(localeStorageKey, "unsupported");
    expect(initialLocale()).toBe("zh");
    localStorage.removeItem(localeStorageKey);
    vi.unstubAllGlobals();
  });
});
