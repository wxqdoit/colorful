import { createRef, type ReactElement } from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import IconBase from "../src/lib/IconBase";
import SSRBase from "../src/lib/SSRBase";
import { IconContext } from "../src/lib/context";
import type { IconWeight } from "../src/lib/types";

const weights = new Map<IconWeight, ReactElement>([
  ["regular", <path data-art="regular" d="M3 3h18v18H3Z" />],
  ["bold", <path data-art="bold" d="M4 4h16v16H4Z" />],
]);
afterEach(cleanup);
const icon = (container: HTMLElement) => container.querySelector("svg")!;

describe("public icon contract", () => {
  it("renders the documented defaults and hides decorative icons", () => {
    const svg = icon(render(<IconBase weights={weights} />).container);
    expect(svg.getAttribute("viewBox")).toBe("0 0 24 24");
    expect(svg.getAttribute("width")).toBe("26");
    expect(svg.getAttribute("height")).toBe("26");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("focusable")).toBe("false");
    expect(svg.querySelector('[data-art="regular"]')).not.toBeNull();
    expect(svg.getAttribute("stroke")).toContain("--project-art-detail");
  });

  it("inherits context SVG props and lets explicit false/size/weight win", () => {
    const { container } = render(
      <IconContext.Provider
        value={
          {
            size: 48,
            mirrored: true,
            weight: "bold",
            className: "family",
            "data-testid": "context-icon",
          } as never
        }
      >
        <IconBase
          weights={weights}
          size="2em"
          mirrored={false}
          weight="regular"
        />
        <IconBase weights={weights} />
      </IconContext.Provider>,
    );
    const [first, second] = container.querySelectorAll("svg");
    expect(first.getAttribute("width")).toBe("2em");
    expect(first.querySelector('[data-art="regular"]')).not.toBeNull();
    expect(first.getAttribute("transform")).toBeNull();
    expect(first.getAttribute("class")).toBe("family");
    expect(second.getAttribute("width")).toBe("48");
    expect(
      (second.querySelector("[data-colorful-mirror]") as SVGElement).style
        .transform,
    ).toBe("scaleX(-1)");
    expect(second.querySelector('[data-art="bold"]')).not.toBeNull();
  });

  it("uses the nearest provider and merges palette and style locally", () => {
    const svg = icon(
      render(
        <IconContext.Provider value={{ size: 60 }}>
          <IconContext.Provider
            value={{
              theme: "dark",
              palette: { back: "pink", detail: "blue" },
              style: { margin: 2, opacity: 0.8 },
            }}
          >
            <IconBase
              weights={weights}
              palette={{ surface: "ivory" }}
              color="red"
              style={{ opacity: 0.5 }}
            />
          </IconContext.Provider>
        </IconContext.Provider>,
      ).container,
    );
    expect(svg.getAttribute("width")).toBe("26");
    expect(svg.style.getPropertyValue("--project-art-surface")).toBe("ivory");
    expect(svg.style.getPropertyValue("--project-art-back")).toBe("pink");
    expect(svg.style.getPropertyValue("--project-art-detail")).toBe("red");
    expect(svg.style.opacity).toBe("0.5");
    expect(svg.style.margin).toBe("2px");
  });

  it("allows a component palette to override an inherited color", () => {
    const svg = icon(
      render(
        <IconContext.Provider value={{ color: "red" }}>
          <IconBase weights={weights} palette={{ detail: "blue" }} />
        </IconContext.Provider>,
      ).container,
    );
    expect(svg.style.getPropertyValue("--project-art-detail")).toBe("blue");
  });

  it("forwards ref, SVG attributes and events", () => {
    const ref = createRef<SVGSVGElement>();
    const onClick = vi.fn();
    const svg = icon(
      render(
        <IconBase
          ref={ref}
          weights={weights}
          onClick={onClick}
          width={80}
          data-custom="yes"
        />,
      ).container,
    );
    expect(ref.current).toBe(svg);
    expect(svg.getAttribute("width")).toBe("80");
    expect(svg.getAttribute("data-custom")).toBe("yes");
    fireEvent.click(svg);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("names meaningful icons with alt or aria attributes", () => {
    const { container, getByRole } = render(
      <>
        <IconBase weights={weights} alt="故事" />
        <IconBase weights={weights} aria-label="书本" />
      </>,
    );
    expect(getByRole("img", { name: "故事" })).toBeTruthy();
    expect(getByRole("img", { name: "书本" })).toBeTruthy();
    expect(container.querySelector("title")?.textContent).toBe("故事");
    expect(
      container.querySelector("svg")?.getAttribute("aria-hidden"),
    ).toBeNull();
  });

  it("supports inherited alt and an explicit empty alt", () => {
    const { container } = render(
      <IconContext.Provider value={{ alt: "文稿" }}>
        <IconBase weights={weights} />
        <IconBase weights={weights} alt="" />
      </IconContext.Provider>,
    );
    const [a, b] = container.querySelectorAll("svg");
    expect(a.querySelector("title")?.textContent).toBe("文稿");
    expect(b.querySelector("title")).toBeNull();
    expect(b.getAttribute("aria-hidden")).toBe("true");
  });

  it("places custom children before artwork and respects explicit accessibility", () => {
    const svg = icon(
      render(
        <IconBase weights={weights} aria-hidden={false} role="img">
          <title>自定义标题</title>
          <circle data-child="yes" cx="12" cy="12" r="4" />
        </IconBase>,
      ).container,
    );
    expect(svg.firstElementChild?.tagName).toBe("title");
    expect(svg.children[1].getAttribute("data-child")).toBe("yes");
    expect(
      svg.lastElementChild?.querySelector('[data-art="regular"]'),
    ).not.toBeNull();
    expect(svg.getAttribute("aria-hidden")).toBe("false");
  });

  it("SSR matches client rendering with explicit props and ignores context", () => {
    const props = {
      weights,
      size: 32,
      theme: "dark" as const,
      mirrored: true,
      alt: "书本",
      palette: { accent: "coral" },
    };
    expect(renderToStaticMarkup(<SSRBase {...props} />)).toBe(
      renderToStaticMarkup(<IconBase {...props} />),
    );
    expect(
      renderToStaticMarkup(
        <IconContext.Provider value={{ size: 99 }}>
          <SSRBase weights={weights} />
        </IconContext.Provider>,
      ),
    ).toContain('width="26"');
  });
});
