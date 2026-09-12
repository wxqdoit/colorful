import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { App } from "../src/App";
import { iconCatalog } from "@colorful-icon/react/catalog";

vi.mock("@/components/catalog/catalog-icon", () => ({
  CatalogIcon: ({ name }: { name: string }) => (
    <svg data-testid="catalog-icon" data-name={name} />
  ),
}));
beforeEach(() => {
  const storage = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    clear: () => storage.clear(),
  });
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("catalog interactions", () => {
  it("opens the project docs and returns to the collection", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: "项目文档" }));
    expect(screen.getByRole("heading", { name: "把一点色彩带进你的界面" })).toBeTruthy();
    expect(screen.getByText("npm install @colorful-icon/react")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "回到图标集" }));
    expect(screen.getByRole("heading", { name: "一点色彩，刚刚好。" })).toBeTruthy();
  });

  it("exports animated JSX without a separate stylesheet import", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "查看代码" }));
    const code = screen.getByRole("tabpanel", { name: "React" }).textContent;
    expect(code).toContain('hoverAnimation="morph"');
    expect(code).not.toContain('motion.css');
  });
  it("browses one unified catalog without a series switch", () => {
    render(<App />);
    expect(screen.queryByRole("radiogroup", { name: "图标系列" })).toBeNull();
    expect(screen.getByText("2,519 枚图标")).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: "搜索图标" }), {
      target: { value: "watercolor" },
    });
    expect(
      screen.getByRole("button", { name: "水彩 WatercolorIcon" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "水彩 WatercolorIcon" }));
    expect(screen.getByRole("heading", { name: "水彩" })).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: "搜索图标" }), {
      target: { value: "club armchair" },
    });
    fireEvent.click(screen.getByRole("button", { name: "圆扶手单椅 OriginalClubArmchairIcon" }));
    expect(screen.getByRole("heading", { name: "圆扶手单椅" })).toBeTruthy();
  });

  it("switches the complete interface and persists the language", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "一点色彩，刚刚好。" }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: "English" }));
    expect(
      screen.getByRole("heading", {
        name: "A little color. A lot of character.",
      }),
    ).toBeTruthy();
    expect(document.documentElement.lang).toBe("en");
    expect(localStorage.getItem("colorful.locale")).toBe("en");
    expect(screen.getByRole("button", { name: "Copy JSX" })).toBeTruthy();
  });
  it("resets pagination when searching and recovers from no results", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "下一页" }));
    expect(
      screen.getByText(
        `2 / ${Math.ceil(iconCatalog.length / 48)}`,
      ),
    ).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: "搜索图标" }), {
      target: { value: "nonesuch-zzzz" },
    });
    expect(screen.getByText("换个关键词试试？")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "查看全部图标" }));
    expect(
      screen.getByText(`1 / ${Math.ceil(iconCatalog.length / 48)}`),
    ).toBeTruthy();
    fireEvent.change(screen.getByRole("textbox", { name: "搜索图标" }), {
      target: { value: "watercolor" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "水彩 WatercolorIcon" }),
    );
    expect(screen.getByRole("heading", { name: "水彩" })).toBeTruthy();
  });
});
