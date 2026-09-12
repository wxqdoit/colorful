import { StrictMode, createRef } from "react";
import { render, cleanup } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, expect, it } from "vitest";
import IconBase from "../src/lib/IconBase";
import SSRBase from "../src/lib/SSRBase";
import { IconContext } from "../src/lib/context";
import {
  ensureMotionStyles,
  motionStyleId,
  MotionStyles,
} from "../src/lib/MotionStyles";

const weights = new Map([["regular" as const, <path d="M3 3h18v18H3Z" />]]);
const sheets = () =>
  document.querySelectorAll(`style[data-href~="${motionStyleId}"]`);
afterEach(cleanup);

it("leaves static/manual icons alone, registers once across roots, and preserves SVG refs", () => {
  const ref = createRef<SVGSVGElement>();
  const first = render(<IconBase weights={weights} ref={ref} />);
  expect(sheets()).toHaveLength(0);
  first.rerender(
    <IconBase
      weights={weights}
      entrance="pop"
      motionStyles="manual"
      ref={ref}
    />,
  );
  expect(sheets()).toHaveLength(0);
  expect(ref.current?.hasAttribute("motionStyles")).toBe(false);
  first.rerender(
    <StrictMode>
      <IconBase weights={weights} entrance="pop" ref={ref} />
      <IconBase weights={weights} hoverAnimation="morph" />
    </StrictMode>,
  );
  expect(sheets()).toHaveLength(1);
  expect(sheets()[0].parentElement).toBe(document.head);
  expect(ref.current?.tagName.toLowerCase()).toBe("svg");
  const second = render(<IconBase weights={weights} mirrored />);
  first.unmount();
  expect(sheets()).toHaveLength(1);
  second.rerender(<IconBase weights={weights} mirrored={false} />);
  expect(sheets()).toHaveLength(1);
});

it("includes one stylesheet during SSR and deduplicates explicit root styles", () => {
  const html = renderToString(
    <>
      <MotionStyles />
      <SSRBase weights={weights} entrance="pop" />
      <SSRBase weights={weights} hoverAnimation="wiggle" />
    </>,
  );
  expect(html.match(/<style/g)).toHaveLength(1);
  expect(html).toContain("@keyframes colorful-pop");
  expect(html.match(/<svg/g)).toHaveLength(2);
  expect(renderToString(<SSRBase weights={weights} />)).not.toContain("<style");
});

it("lets context disable automatic styles without leaking the option onto SVG", () => {
  const html = renderToString(
    <IconContext.Provider value={{ motionStyles: "manual", entrance: "pop" }}>
      <IconBase weights={weights} />
    </IconContext.Provider>,
  );
  expect(html).not.toContain("<style");
  expect(html).not.toContain("motionStyles");
  expect(html).toContain('data-colorful-enter="pop"');
});

it("deduplicates the React 18 registration per document and reuses server output", () => {
  const doc = document.implementation.createHTMLDocument();
  ensureMotionStyles(doc);
  ensureMotionStyles(doc);
  expect(doc.head.querySelectorAll("style")).toHaveLength(1);
  const other = document.implementation.createHTMLDocument();
  other.head.innerHTML = `<style data-colorful-motion="${motionStyleId}">server style</style>`;
  ensureMotionStyles(other);
  expect(other.head.querySelectorAll("style")).toHaveLength(1);
});
