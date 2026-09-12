import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { expect, it } from "vitest";
import IconBase from "../src/lib/IconBase";
const weights = new Map([["regular" as const, <path d="M3 3h18v18H3Z" />]]);

it("ships CSS in each SSR response and hydrates without adding a second sheet", async () => {
  const tree = (
    <div>
      <IconBase weights={weights} entrance="pop" />
      <IconBase weights={weights} hoverAnimation="morph" />
    </div>
  );
  const html = renderToString(tree);
  expect(html).toContain("@keyframes colorful-pop");
  expect(renderToString(tree)).toContain("@keyframes colorful-pop");
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.append(container);
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => {
    root = hydrateRoot(container, tree, {
      onRecoverableError: (error) => errors.push(error),
    });
  });
  expect(errors).toEqual([]);
  expect(
    document.querySelectorAll('style[data-href^="colorful-motion-"]'),
  ).toHaveLength(1);
  expect(container.querySelectorAll("svg")).toHaveLength(2);
  await act(async () => root!.unmount());
  container.remove();
});
