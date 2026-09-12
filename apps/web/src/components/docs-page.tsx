import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Code2Icon,
  CopyIcon,
  PackageIcon,
  PaletteIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogIcon } from "@/components/catalog/catalog-icon";
import { messages, type Locale } from "@/lib/i18n";
import type { IconWeight } from "@colorful-icons/react/lib";

interface DocsPageProps {
  locale: Locale;
  onBrowse: () => void;
}

const copy = {
  zh: {
    eyebrow: "项目文档",
    title: "把一点色彩带进你的界面",
    intro: "Colorful 是一套面向 React 的柔和分层插画图标库。2,519 枚图标共用一份基础 artwork，weight、配色和动效都通过参数组合出来。",
    browse: "浏览全部图标",
    install: "安装",
    installHint: "在 React 项目中安装图标库：",
    quick: "快速开始",
    quickHint: "导入单个图标，直接作为普通 React 组件使用：",
    imports: "按需导入",
    importsHint: "使用图标级入口，bundler 只会加载当前页面实际使用的图标。",
    weights: "六种 weight",
    weightsHint: "所有 weight 都从同一份 regular artwork 在渲染时派生。",
    palettes: "主题与配色",
    palettesHint: "使用 preset 快速切换，或用 palette 覆盖任意语义色。",
    motion: "动效",
    motionHint: "入场、分层悬停和镜像过渡都由 props 控制，并自动尊重系统的减少动态效果设置。",
    props: "常用 props",
    prop: "属性",
    type: "类型",
    default: "默认值",
    back: "回到图标集",
  },
  en: {
    eyebrow: "Project docs",
    title: "Bring a little color to your interface",
    intro: "Colorful is a soft, layered illustration icon library for React. Its 2,519 icons share one artwork source, while weight, palette, and motion are composed through props.",
    browse: "Browse all icons",
    install: "Install",
    installHint: "Add the icon library to your React project:",
    quick: "Quick start",
    quickHint: "Import one icon and use it like any other React component:",
    imports: "Import on demand",
    importsHint: "Use icon-level entry points so your bundler only loads icons used by the page.",
    weights: "Six weights",
    weightsHint: "Every weight is derived from the same regular artwork at render time.",
    palettes: "Themes and palettes",
    palettesHint: "Choose a preset, or override any semantic color with palette.",
    motion: "Motion",
    motionHint: "Entrance, layered hover, and mirror transitions are controlled with props and respect reduced-motion preferences.",
    props: "Common props",
    prop: "Prop",
    type: "Type",
    default: "Default",
    back: "Back to collection",
  },
} as const;

const weights: IconWeight[] = [
  "thin",
  "light",
  "regular",
  "bold",
  "fill",
  "duotone",
];

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-muted/55">
      <pre className="overflow-x-auto p-4 pr-14 text-[0.8rem] leading-6 text-foreground">
        <code>{children}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute right-2 top-2 opacity-70 transition-opacity group-hover:opacity-100"
        onClick={() => void navigator.clipboard?.writeText(children)}
        aria-label="Copy code"
        title="Copy code"
      >
        <CopyIcon />
      </Button>
    </div>
  );
}

export function DocsPage({ locale, onBrowse }: DocsPageProps) {
  const t = copy[locale];
  const rows = locale === "zh"
    ? [
        ["size", "number | string", "26"],
        ["weight", "thin | light | regular | bold | fill | duotone", "regular"],
        ["theme", "light | dark", "light"],
        ["preset", "lavender | mint | peach | ocean | rose | sand…", "lavender"],
        ["color", "string", "细节色"],
        ["entrance", "none | pop | rise | fade", "none"],
        ["hoverAnimation", "none | lift | wiggle | pulse | spread | morph", "none"],
        ["mirrored", "boolean", "false"],
      ]
    : [
        ["size", "number | string", "26"],
        ["weight", "thin | light | regular | bold | fill | duotone", "regular"],
        ["theme", "light | dark", "light"],
        ["preset", "lavender | mint | peach | ocean | rose | sand…", "lavender"],
        ["color", "string", "detail color"],
        ["entrance", "none | pop | rise | fade", "none"],
        ["hoverAnimation", "none | lift | wiggle | pulse | spread | morph", "none"],
        ["mirrored", "boolean", "false"],
      ];
  return (
    <div className="pb-16 pt-8 sm:pt-12">
      <div className="mb-10 flex items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={onBrowse}>
          <ArrowLeftIcon data-icon="inline-start" />
          {t.back}
        </Button>
        <span className="font-mono text-xs text-muted-foreground">v0.7.0</span>
      </div>
      <section className="max-w-3xl" aria-labelledby="docs-title">
        <p className="mb-4 text-sm font-medium text-primary">{t.eyebrow}</p>
        <h1 id="docs-title" className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{t.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{t.intro}</p>
        <Button className="mt-7" onClick={onBrowse}>{t.browse}<ArrowRightIcon data-icon="inline-end" /></Button>
      </section>
      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
        <div className="min-w-0 space-y-14">
          <section aria-labelledby="install-title">
            <div className="mb-4 flex items-center gap-3"><PackageIcon className="size-5 text-primary" aria-hidden="true" /><h2 id="install-title" className="text-2xl font-semibold tracking-tight">{t.install}</h2></div>
            <p className="mb-4 text-sm text-muted-foreground">{t.installHint}</p>
            <CodeBlock>npm install @colorful-icons/react</CodeBlock>
          </section>
          <section aria-labelledby="quick-title">
            <div className="mb-4 flex items-center gap-3"><Code2Icon className="size-5 text-primary" aria-hidden="true" /><h2 id="quick-title" className="text-2xl font-semibold tracking-tight">{t.quick}</h2></div>
            <p className="mb-4 text-sm text-muted-foreground">{t.quickHint}</p>
            <CodeBlock>{`import { StoryIcon } from "@colorful-icons/react/Story";

export function EmptyState() {
  return <StoryIcon size={32} weight="regular" theme="dark" />;
}`}</CodeBlock>
          </section>
          <section aria-labelledby="imports-title">
            <h2 id="imports-title" className="text-2xl font-semibold tracking-tight">{t.imports}</h2>
            <p className="mt-3 mb-4 text-sm leading-6 text-muted-foreground">{t.importsHint}</p>
            <CodeBlock>{`import { StoryIcon } from "@colorful-icons/react/Story";
import { StoryIcon as StoryServerIcon } from "@colorful-icons/react/ssr/Story";`}</CodeBlock>
          </section>
          <section aria-labelledby="props-title">
            <h2 id="props-title" className="text-2xl font-semibold tracking-tight">{t.props}</h2>
            <div className="mt-5 overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full min-w-[560px] text-left text-sm"><thead className="border-b border-border/70 bg-muted/45 text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-medium">{t.prop}</th><th className="px-4 py-3 font-medium">{t.type}</th><th className="px-4 py-3 font-medium">{t.default}</th></tr></thead><tbody className="divide-y divide-border/60">{rows.map(([name, type, value]) => <tr key={name}><td className="px-4 py-3 font-mono text-xs text-primary">{name}</td><td className="px-4 py-3 font-mono text-xs text-muted-foreground">{type}</td><td className="px-4 py-3 text-muted-foreground">{value}</td></tr>)}</tbody></table>
            </div>
          </section>
        </div>
        <aside className="space-y-4 lg:pt-1" aria-label={t.eyebrow}>
          <article className="rounded-xl border border-border/70 bg-card/70 p-5">
            <div className="flex items-center gap-3"><SparklesIcon className="size-5 text-primary" aria-hidden="true" /><h2 className="font-semibold">{t.weights}</h2></div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.weightsHint}</p>
            <div className="mt-5 grid grid-cols-6 gap-1">
              {weights.map((weight) => (
                <div key={weight} className="flex min-w-0 flex-col items-center gap-1.5">
                  <CatalogIcon name="Story" messages={messages[locale]} weight={weight} size={25} aria-hidden="true" />
                  <span className="w-full truncate text-center font-mono text-[0.62rem] text-muted-foreground">{weight}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-xl border border-border/70 bg-card/70 p-5">
            <div className="flex items-center gap-3"><PaletteIcon className="size-5 text-primary" aria-hidden="true" /><h2 className="font-semibold">{t.palettes}</h2></div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.palettesHint}</p>
            <div className="mt-5 flex items-center justify-between gap-2">
              {(["lavender", "mint", "peach"] as const).map((preset) => (
                <div key={preset} className="flex flex-col items-center gap-1.5">
                  <CatalogIcon name="Watercolor" messages={messages[locale]} preset={preset} size={34} aria-hidden="true" />
                  <span className="font-mono text-[0.62rem] text-muted-foreground">{preset}</span>
                </div>
              ))}
            </div>
          </article>
          <article className="rounded-xl border border-border/70 bg-card/70 p-5">
            <div className="flex items-center gap-3"><Code2Icon className="size-5 text-primary" aria-hidden="true" /><h2 className="font-semibold">{t.motion}</h2></div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.motionHint}</p>
            <div className="mt-5 flex items-center justify-between px-2">
              <CatalogIcon name="Story" messages={messages[locale]} entrance="pop" size={34} aria-hidden="true" />
              <CatalogIcon name="Story" messages={messages[locale]} hoverAnimation="lift" size={34} aria-hidden="true" />
              <CatalogIcon name="Story" messages={messages[locale]} hoverAnimation="pulse" size={34} aria-hidden="true" />
            </div>
          </article>
        </aside>
      </div>
    </div>
  );
}
