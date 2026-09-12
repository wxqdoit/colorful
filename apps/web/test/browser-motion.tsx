import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { StoryIcon } from "@colorful-icons/react/Story";

// Deliberately no stylesheet import: exercise the installed package boundary.
function SmokeTest() {
  const [mirror, setMirror] = useState(false);
  const [animated, setAnimated] = useState(false);
  const [many, setMany] = useState(false);
  const [transitions, setTransitions] = useState(0);
  return (
    <main>
      <button onClick={() => setMirror((x) => !x)}>Toggle mirror</button>
      <button onClick={() => setAnimated((x) => !x)}>Toggle motion</button>
      <button onClick={() => setMany((x) => !x)}>Toggle duplicates</button>
      <div data-testid="preview" data-colorful-hover-target="">
        <StoryIcon
          size={96}
          mirrored={mirror}
          entrance={animated ? "pop" : "none"}
          hoverAnimation={animated ? "morph" : "none"}
          onTransitionRun={(event) => {
            if ((event.target as Element).hasAttribute("data-colorful-mirror"))
              setTransitions((n) => n + 1);
          }}
        />
      </div>
      <output>Mirror transitions: {transitions}</output>
      {many &&
        Array.from({ length: 8 }, (_, i) => (
          <StoryIcon key={i} hoverAnimation="lift" />
        ))}
    </main>
  );
}
const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <SmokeTest />
  </StrictMode>,
);
if (import.meta.hot) import.meta.hot.dispose(() => root.unmount());
