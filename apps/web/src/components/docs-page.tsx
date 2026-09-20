import { useState } from "react";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  CheckCircle2Icon,
  Code2Icon,
  CompassIcon,
  CopyIcon,
  FileTextIcon,
  LayersIcon,
  PackageIcon,
  PaletteIcon,
  RulerIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogIcon } from "@/components/catalog/catalog-icon";
import { messages, type Locale } from "@/lib/i18n";
import type { IconWeight, IconPreset } from "@colorful-icon/react/lib";

interface DocsPageProps {
  locale: Locale;
  onBrowse: () => void;
}

const copy = {
  zh: {
    eyebrow: "项目文档",
    title: "把一点色彩带进你的界面",
    intro: "Colorful 是一套面向 React 的柔和分层插画图标库。2,519 枚图标共用一份基础 artwork，weight、配色和动效都通过参数组合出来。",
    tabGuide: "使用指南",
    tabSpec: "设计规范",
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
    specTitle: "Colorful 图标系统设计规范 · 1.2",
    specIntro: "全量 2,519 枚图标遵循统一的视觉语言：1,000 枚原创小物件与 1,519 枚重绘符号共用 24×24 视口、三色语义 Token、无底板分层与全量切线圆角规则。",
    principlesTitle: "一、 核心设计哲学",
    p1Title: "色块即物件",
    p1Desc: "色块必须解释物件本身的体块、前后层或局部结构（书页、杯身、花瓣、头肩），严禁在图标后强加圆形、方形等无意义通用底框。",
    p2Title: "细线辅助结构",
    p2Desc: "线条仅表达书脊、折痕、开口、缝线等关键识别结构，不包办整体外轮廓。在 26px 基准下精炼 1～3 组核心线段，杜绝密集杂乱细节。",
    p3Title: "柔和圆润与手绘感",
    p3Desc: "消除所有生硬尖角（夹角 > 1° 强制切线连续圆角）。保留符合物理结构与生命形态的轻微不对称与层叠错落，富有呼吸感。",
    p4Title: "纯净透明背景",
    p4Desc: "画布默认完全透明，不覆盖宿主容器背景。仅用浅层与主体两级色阶构建空间深度，不依赖阴影、渐变或拟物投影。",
    canvasTitle: "二、 画布、栅格与光学校正",
    canvasRule1: "标准视口：viewBox=\"0 0 24 24\"，24×24 矢量坐标系；",
    canvasRule2: "界面基准：卡片中默认渲染 26 × 26 px，推荐阶梯 18/20/24/26/32/48/56/72px；",
    canvasRule3: "安全边距：常规主体位于 [2, 2, 22, 22]，紧凑符号位于 [3, 3, 21, 21]；",
    canvasRule4: "描边防溢出：预留 0.9px 描边裕量，保证 Bold (1.8) 粗线在各端不发生像素裁切；",
    canvasRule5: "重心光学校正：非对称物件采用显式微距平移（如坐姿猫 translate(1 0)、羊角锤 translate(0 -0.7)）。",
    tokensTitle: "三、 色彩体系与语义 Token",
    surfaceToken: "浅层主体 / 纸面",
    surfaceTokenDesc: "前置部件、纸张正面、高光承托面，默认浅色 #f0e9f8，深色 #38313f",
    backToken: "主色体块 / 后层",
    backTokenDesc: "物体体积、后方部件、阴影面，默认浅色 #d9c9ed，深色 #625576",
    detailToken: "结构细线 / 核心点",
    detailTokenDesc: "骨架描边、特征线、眼睛纽扣，默认浅色 #aa8bcf，深色 #c4acd9",
    presetHint: "点击切换实时预览预设调色板：",
    strokeTitle: "四、 描边系统与六种形态",
    strokeThin: "Thin (0.45)：极细若丝，用于高分大屏或极简质感",
    strokeLight: "Light (0.75)：轻量纤细，适合高信息密度看板",
    strokeRegular: "Regular (1.1)：标准基准设计线宽，默认推荐",
    strokeBold: "Bold (1.8)：粗体高反差，焦点与小尺寸识别极强",
    strokeFill: "Fill：饱满色块形态，边缘叠加 0.55/0.2 微描边保护",
    strokeDuotone: "Duotone：双色对比形态，突出前后层网印版画质感",
    strokeCaps: "全库强制 stroke-linecap=\"round\" 与 stroke-linejoin=\"round\"；结构线总长 <= 60 单位，独立线段 <= 8 组。",
    roundTitle: "五、 圆角与曲率标准",
    roundRule1: "夹角 > 1° 强制切线平滑圆角，杜绝任何直角与尖角；",
    roundRule2: "大色块曲率半径 0.55 ～ 1.25，保留小部件语义同时柔化大边角；",
    roundRule3: "矩形部件转角半径最大基准 1.6（不超过短边一半）；",
    roundRule4: "封闭曲线优先使用 C / Q / A 贝塞尔曲线构造并以 Z 严格闭合。",
    categoriesTitle: "六、 35 大分类设计指南",
    catLiving: "家居与生活（家居、厨房、穿搭、手作、个护）",
    catLivingDesc: "真实物品透视或正视，前后两层色块分别表达正面/内衬/把手/承托，细线表达缝线与转轴。",
    catNature: "自然生灵（动物、植物、食物、饮品、地貌、天气）",
    catNatureDesc: "饱满舒展的生命生长态势，用圆润闭合曲线勾勒有机轮廓，腹部、花瓣、截面清晰分色。",
    catPeople: "人物与交互（人物、常用、媒体、游戏、商业、办公）",
    catPeopleDesc: "匀称头肩比例，松弛体态；卡片纸面分层承托，文本以精炼胶囊线段示意。",
    catScience: "科技与交通（科技、科学、建筑、出行、运动、艺术）",
    catScienceDesc: "软化机械硬角，试管液面、车辆座舱、建筑场馆层次分明，避免密集砖缝与金属冷感。",
    catSymbols: "符号与文字（方向与布局、文字与运算、功能符号）",
    catSymbolsDesc: "以功能识别为先，开放胶囊端点，活动箭头与对齐块局部点睛，不强加无关外框底板。",
    catBrands: "品牌标识（79 个第三方品牌徽标）",
    catBrandsDesc: "严格忠于核心轮廓比例，融入柔和圆角语言，单色剪影巧妙分色为前浅后深双层柔和色块。",
    qaTitle: "七、 质量验收与自动化检测矩阵",
    qa1: "统一标准根标签：width=\"26\" height=\"26\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"",
    qa2: "语义色彩纯净性：100% 仅使用 surface、back、detail 语义变量，无硬编码非标色值",
    qa3: "全量圆角曲率合规：scripts/round-icons.mjs --check --all-weights 覆盖全库 15,114 变体 0 缺陷",
    qa4: "六权重边界安全：design/weights/check-bounds.mjs 验证六种样式描边无溢出切边",
    qa5: "几何唯一性签名：test:originals 校验 SHA-256 几何哈希，无镜像换色伪原创",
    qa6: "实际尺寸可读性：26px 浅灰与深色双环境目视复查，层次分明不糊线",
  },
  en: {
    eyebrow: "Project docs",
    title: "Bring a little color to your interface",
    intro: "Colorful is a soft, layered illustration icon library for React. Its 2,519 icons share one artwork source, while weight, palette, and motion are composed through props.",
    tabGuide: "Usage Guide",
    tabSpec: "Design Specification",
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
    specTitle: "Colorful Icon Design Specification · 1.2",
    specIntro: "All 2,519 icons follow a unified visual language: 1,000 original objects and 1,519 redesigned symbols share a 24×24 canvas, 3-token color architecture, organic layers without arbitrary backplates, and tangent-continuous fillets.",
    principlesTitle: "1. Core Design Philosophy",
    p1Title: "Objects as Color Surfaces",
    p1Desc: "Color surfaces must explain the physical parts of the object (pages, cup body, petals, head & shoulders). Never place arbitrary circular or square badge containers behind icons.",
    p2Title: "Linework as Structure",
    p2Desc: "Lines only express key structural seams (spine, folds, rim, stitches). Retain 1-3 essential structural lines at 26px and omit dense, cluttered textures.",
    p3Title: "Softness & Handcrafted Balance",
    p3Desc: "Eliminate all harsh corners (sharp joins > 1° are smoothly filleted). Natural slight asymmetry and layered offset create an organic breathing feel.",
    p4Title: "Clean & Transparent",
    p4Desc: "Canvas is transparent by default and never obscures card backgrounds. Pure flat surfaces create depth without drop shadows or fake skeuomorphic bevels.",
    canvasTitle: "2. Canvas, Grid & Optical Metrics",
    canvasRule1: "Standard viewport: viewBox=\"0 0 24 24\" with 24×24 unit coordinates;",
    canvasRule2: "Rendering target: 26 × 26 px card baseline, scaling seamlessly across 18-72px;",
    canvasRule3: "Safe area: regular objects within [2, 2, 22, 22], compact symbols within [3, 3, 21, 21];",
    canvasRule4: "Stroke bleed safety: 0.9px margin reserved so bold (1.8) never clips;",
    canvasRule5: "Optical centering: calibrated micro-translations for asymmetric objects (e.g., sitting cat, claw hammer).",
    tokensTitle: "3. Color System & Semantic Tokens",
    surfaceToken: "Surface (Foreground / Paper)",
    surfaceTokenDesc: "Front parts, paper surface, highlight areas; light #f0e9f8, dark #38313f",
    backToken: "Back (Main Body / Rear Part)",
    backTokenDesc: "Body mass, rear parts, shadow facets; light #d9c9ed, dark #625576",
    detailToken: "Detail (Linework / Accents)",
    detailTokenDesc: "Structural stroke, key points, eye pupils; light #aa8bcf, dark #c4acd9",
    presetHint: "Click to preview preset palettes in real-time:",
    strokeTitle: "4. Stroke System & Six Weights",
    strokeThin: "Thin (0.45): ultra-fine delicacy for retina screens",
    strokeLight: "Light (0.75): lightweight clarity for dense dashboards",
    strokeRegular: "Regular (1.1): standard baseline weight, default recommendation",
    strokeBold: "Bold (1.8): high contrast and emphasis for instant recognition",
    strokeFill: "Fill: solid surface treatment with 0.55/0.2 micro-strokes",
    strokeDuotone: "Duotone: two-tone contrast inspired by screen-printed artwork",
    strokeCaps: "Mandatory stroke-linecap=\"round\" and stroke-linejoin=\"round\"; lines <= 60 units, contours <= 8.",
    roundTitle: "5. Roundness & Curvature Standards",
    roundRule1: "Every join > 1° is smoothly filleted with tangent continuity;",
    roundRule2: "Fill corner radius 0.55-1.25, softening edges while keeping part identity;",
    roundRule3: "Rectangle radius max 1.6 (not exceeding half the short edge);",
    roundRule4: "Closed shapes built with C/Q/A Bezier paths and closed with Z.",
    categoriesTitle: "6. 35 Categories Design Guidelines",
    catLiving: "Living & Home (Furniture, Kitchen, Wear, Craft, Care)",
    catLivingDesc: "Real perspective/front views, two layers showing front/lining/handle, fine lines for seams and pivots.",
    catNature: "Nature & Fauna (Animals, Plants, Food, Drink, Land, Weather)",
    catNatureDesc: "Organic living contours, rounded curves for petals and silhouettes, clear two-tone biological separation.",
    catPeople: "People & Activities (Avatars, Media, Gaming, Business, Office)",
    catPeopleDesc: "Relaxed postures, balanced head & shoulders, documents with clean capsule lines.",
    catScience: "Science & Transport (Tech, Science, Architecture, Travel, Art)",
    catScienceDesc: "Softened mechanical corners, clear flask levels, vehicle cabins, readable without coldness.",
    catSymbols: "Symbols & Typography (Arrows, Layout, Math, Functional)",
    catSymbolsDesc: "Clarity first, rounded capsule terminals, meaningful color accents without arbitrary badges.",
    catBrands: "Brand Silhouettes (79 Third-party Marks)",
    catBrandsDesc: "Faithful to brand proportions while softened with Colorful's rounded language and two-tone depth.",
    qaTitle: "7. QA & Automated Verification Pipeline",
    qa1: "Standard SVG root: width=\"26\" height=\"26\" viewBox=\"0 0 24 24\" aria-hidden=\"true\" focusable=\"false\"",
    qa2: "Pure semantic tokens: 100% surface, back, and detail variables without hardcoded hex",
    qa3: "Roundness verification: scripts/round-icons.mjs --check --all-weights verifies 15,114 variants with 0 issues",
    qa4: "Safe bounds audit: check-bounds.mjs ensures no clipping across all six weights",
    qa5: "Deduplication: SHA-256 geometry hash prevents pseudo-original duplicates",
    qa6: "Visual inspection: 26px dual light/dark background review for crisp contrast",
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

const presets: readonly IconPreset[] = [
  "lavender",
  "mint",
  "peach",
  "ocean",
  "rose",
  "sand",
  "graphite",
  "tangerine",
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
  const [activeTab, setActiveTab] = useState<"guide" | "spec">("guide");
  const [demoPreset, setDemoPreset] = useState<IconPreset>("lavender");
  const t = copy[locale];

  const rows =
    locale === "zh"
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
      {/* Top Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <Button variant="ghost" size="sm" onClick={onBrowse}>
          <ArrowLeftIcon data-icon="inline-start" />
          {t.back}
        </Button>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border/70 bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "guide"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpenIcon className="size-3.5" />
              {t.tabGuide}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("spec")}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                activeTab === "spec"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <RulerIcon className="size-3.5" />
              {t.tabSpec}
            </button>
          </div>
          <span className="font-mono text-xs text-muted-foreground ml-2">v0.7.2</span>
        </div>
      </div>

      {activeTab === "guide" ? (
        <>
          {/* Guide Header */}
          <section className="mb-12 max-w-3xl" aria-labelledby="docs-title">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t.eyebrow}
            </p>
            <h1
              id="docs-title"
              className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {t.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {t.intro}
            </p>
          </section>

          {/* Guide Content */}
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="space-y-10">
              <section aria-labelledby="install-title">
                <div className="mb-4 flex items-center gap-3">
                  <PackageIcon className="size-5 text-primary" aria-hidden="true" />
                  <h2 id="install-title" className="text-2xl font-semibold tracking-tight">
                    {t.install}
                  </h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{t.installHint}</p>
                <CodeBlock>npm install @colorful-icon/react</CodeBlock>
              </section>

              <section aria-labelledby="quick-title">
                <div className="mb-4 flex items-center gap-3">
                  <Code2Icon className="size-5 text-primary" aria-hidden="true" />
                  <h2 id="quick-title" className="text-2xl font-semibold tracking-tight">
                    {t.quick}
                  </h2>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">{t.quickHint}</p>
                <CodeBlock>{`import { StoryIcon } from "@colorful-icon/react/Story";

export function EmptyState() {
  return <StoryIcon size={32} weight="regular" theme="dark" />;
}`}</CodeBlock>
              </section>

              <section aria-labelledby="imports-title">
                <h2 id="imports-title" className="text-2xl font-semibold tracking-tight">
                  {t.imports}
                </h2>
                <p className="mt-3 mb-4 text-sm leading-6 text-muted-foreground">
                  {t.importsHint}
                </p>
                <CodeBlock>{`import { StoryIcon } from "@colorful-icon/react/Story";
import { StoryIcon as StoryServerIcon } from "@colorful-icon/react/ssr/Story";`}</CodeBlock>
              </section>

              <section aria-labelledby="props-title">
                <h2 id="props-title" className="text-2xl font-semibold tracking-tight">
                  {t.props}
                </h2>
                <div className="mt-5 overflow-x-auto rounded-xl border border-border/70">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="border-b border-border/70 bg-muted/45 text-xs text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">{t.prop}</th>
                        <th className="px-4 py-3 font-medium">{t.type}</th>
                        <th className="px-4 py-3 font-medium">{t.default}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {rows.map(([name, type, value]) => (
                        <tr key={name}>
                          <td className="px-4 py-3 font-mono text-xs text-primary">{name}</td>
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{type}</td>
                          <td className="px-4 py-3 text-muted-foreground">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            <aside className="space-y-4 lg:pt-1" aria-label={t.eyebrow}>
              <article className="rounded-xl border border-border/70 bg-card/70 p-5">
                <div className="flex items-center gap-3">
                  <SparklesIcon className="size-5 text-primary" aria-hidden="true" />
                  <h2 className="font-semibold">{t.weights}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.weightsHint}</p>
                <div className="mt-5 grid grid-cols-6 gap-1">
                  {weights.map((weight) => (
                    <div key={weight} className="flex min-w-0 flex-col items-center gap-1.5">
                      <CatalogIcon
                        name="Story"
                        messages={messages[locale]}
                        weight={weight}
                        size={25}
                        aria-hidden="true"
                      />
                      <span className="w-full truncate text-center font-mono text-[0.62rem] text-muted-foreground">
                        {weight}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-xl border border-border/70 bg-card/70 p-5">
                <div className="flex items-center gap-3">
                  <PaletteIcon className="size-5 text-primary" aria-hidden="true" />
                  <h2 className="font-semibold">{t.palettes}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.palettesHint}</p>
                <div className="mt-5 flex items-center justify-between gap-2">
                  {(["lavender", "mint", "peach"] as const).map((preset) => (
                    <div key={preset} className="flex flex-col items-center gap-1.5">
                      <CatalogIcon
                        name="Watercolor"
                        messages={messages[locale]}
                        preset={preset}
                        size={34}
                        aria-hidden="true"
                      />
                      <span className="font-mono text-[0.62rem] text-muted-foreground">
                        {preset}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-xl border border-border/70 bg-card/70 p-5">
                <div className="flex items-center gap-3">
                  <Code2Icon className="size-5 text-primary" aria-hidden="true" />
                  <h2 className="font-semibold">{t.motion}</h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.motionHint}</p>
                <div className="mt-5 flex items-center justify-between px-2">
                  <CatalogIcon
                    name="Story"
                    messages={messages[locale]}
                    entrance="pop"
                    size={34}
                    aria-hidden="true"
                  />
                  <CatalogIcon
                    name="Story"
                    messages={messages[locale]}
                    hoverAnimation="lift"
                    size={34}
                    aria-hidden="true"
                  />
                  <CatalogIcon
                    name="Story"
                    messages={messages[locale]}
                    hoverAnimation="pulse"
                    size={34}
                    aria-hidden="true"
                  />
                </div>
              </article>
            </aside>
          </div>
        </>
      ) : (
        /* Design Specification Tab */
        <div className="space-y-12">
          {/* Spec Header */}
          <section className="max-w-3xl" aria-labelledby="spec-title">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <SparklesIcon className="size-3.5" />
              <span>Design System v1.2</span>
            </div>
            <h1
              id="spec-title"
              className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              {t.specTitle}
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {t.specIntro}
            </p>
          </section>

          {/* 1. Core Principles */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <CompassIcon className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">{t.principlesTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{t.p1Title}</h3>
                  <CatalogIcon name="Story" messages={messages[locale]} size={28} aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.p1Desc}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{t.p2Title}</h3>
                  <CatalogIcon name="Scene" messages={messages[locale]} size={28} aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.p2Desc}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{t.p3Title}</h3>
                  <CatalogIcon name="Watercolor" messages={messages[locale]} size={28} aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.p3Desc}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground">{t.p4Title}</h3>
                  <CatalogIcon name="Character" messages={messages[locale]} size={28} aria-hidden="true" />
                </div>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.p4Desc}</p>
              </div>
            </div>
          </section>

          {/* 2. Canvas & Grid */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <RulerIcon className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">{t.canvasTitle}</h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p className="rounded-lg border border-border/60 bg-muted/40 p-3">
                  <strong className="text-foreground">24×24 ViewBox: </strong>
                  {t.canvasRule1}
                </p>
                <p className="rounded-lg border border-border/60 bg-muted/40 p-3">
                  <strong className="text-foreground">26px Display: </strong>
                  {t.canvasRule2}
                </p>
                <p className="rounded-lg border border-border/60 bg-muted/40 p-3">
                  <strong className="text-foreground">Safe Zones: </strong>
                  {t.canvasRule3}
                </p>
                <p className="rounded-lg border border-border/60 bg-muted/40 p-3">
                  <strong className="text-foreground">Stroke Bleed: </strong>
                  {t.canvasRule4}
                </p>
                <p className="rounded-lg border border-border/60 bg-muted/40 p-3">
                  <strong className="text-foreground">Optical Offsets: </strong>
                  {t.canvasRule5}
                </p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center">
                <div className="relative flex size-36 items-center justify-center rounded-2xl border-2 border-primary/40 bg-card p-4 shadow-inner">
                  {/* Grid Lines */}
                  <div className="absolute inset-2 rounded border border-dashed border-primary/20 pointer-events-none" />
                  <div className="absolute inset-4 rounded border border-primary/30 pointer-events-none" />
                  <CatalogIcon name="Story" messages={messages[locale]} size={64} aria-hidden="true" />
                </div>
                <p className="mt-4 font-mono text-xs text-muted-foreground">
                  ViewBox 0 0 24 24 · Safe [2,2,22,22] · 26px Baseline
                </p>
              </div>
            </div>
          </section>

          {/* 3. Color Tokens */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <PaletteIcon className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">{t.tokensTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border/70 bg-card/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full border border-border/60 bg-[#f0e9f8] shadow-xs" />
                  <div className="font-mono text-xs font-semibold text-primary">--project-art-surface</div>
                </div>
                <h4 className="mt-3 text-sm font-medium">{t.surfaceToken}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{t.surfaceTokenDesc}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full border border-border/60 bg-[#d9c9ed] shadow-xs" />
                  <div className="font-mono text-xs font-semibold text-primary">--project-art-back</div>
                </div>
                <h4 className="mt-3 text-sm font-medium">{t.backToken}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{t.backTokenDesc}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="size-7 rounded-full border border-border/60 bg-[#aa8bcf] shadow-xs" />
                  <div className="font-mono text-xs font-semibold text-primary">--project-art-detail</div>
                </div>
                <h4 className="mt-3 text-sm font-medium">{t.detailToken}</h4>
                <p className="mt-1 text-xs text-muted-foreground">{t.detailTokenDesc}</p>
              </div>
            </div>

            {/* Presets Interactive Bar */}
            <div className="rounded-xl border border-border/70 bg-muted/30 p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{t.presetHint}</span>
                <span className="font-mono text-xs text-primary uppercase">{demoPreset}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDemoPreset(p)}
                    className={`rounded-lg px-3 py-1.5 font-mono text-xs transition-all ${
                      demoPreset === p
                        ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                        : "border border-border/70 bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex items-center justify-around rounded-lg border border-border/60 bg-background p-4">
                <CatalogIcon name="Story" messages={messages[locale]} preset={demoPreset} size={36} aria-hidden="true" />
                <CatalogIcon name="Scene" messages={messages[locale]} preset={demoPreset} size={36} aria-hidden="true" />
                <CatalogIcon name="Watercolor" messages={messages[locale]} preset={demoPreset} size={36} aria-hidden="true" />
                <CatalogIcon name="Character" messages={messages[locale]} preset={demoPreset} size={36} aria-hidden="true" />
                <CatalogIcon name="OriginalPineTree" messages={messages[locale]} preset={demoPreset} size={36} aria-hidden="true" />
                <CatalogIcon name="OriginalCoffeeMachine" messages={messages[locale]} preset={demoPreset} size={36} aria-hidden="true" />
              </div>
            </div>
          </section>

          {/* 4. Stroke & Weights */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <LayersIcon className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">{t.strokeTitle}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {weights.map((w) => (
                <div key={w} className="flex flex-col items-center rounded-xl border border-border/70 bg-card/70 p-4 text-center">
                  <CatalogIcon name="Story" messages={messages[locale]} weight={w} size={32} aria-hidden="true" />
                  <span className="mt-3 font-mono text-xs font-semibold text-primary">{w}</span>
                  <span className="mt-1 text-[0.7rem] text-muted-foreground">
                    {w === "thin" && "0.45 px"}
                    {w === "light" && "0.75 px"}
                    {w === "regular" && "1.1 px"}
                    {w === "bold" && "1.8 px"}
                    {w === "fill" && "Micro-stroke"}
                    {w === "duotone" && "Two-tone"}
                  </span>
                </div>
              ))}
            </div>
            <p className="rounded-lg border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
              {t.strokeCaps}
            </p>
          </section>

          {/* 5. Roundness & Curvature */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <CheckCircle2Icon className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">{t.roundTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <h4 className="font-semibold text-foreground">{t.roundRule1}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{t.roundRule2}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <h4 className="font-semibold text-foreground">{t.roundRule3}</h4>
                <p className="mt-2 text-sm text-muted-foreground">{t.roundRule4}</p>
              </div>
            </div>
          </section>

          {/* 6. Categories Guidelines */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <FileTextIcon className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">{t.categoriesTitle}</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <h4 className="font-semibold text-primary">{t.catLiving}</h4>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.catLivingDesc}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <h4 className="font-semibold text-primary">{t.catNature}</h4>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.catNatureDesc}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <h4 className="font-semibold text-primary">{t.catPeople}</h4>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.catPeopleDesc}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <h4 className="font-semibold text-primary">{t.catScience}</h4>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.catScienceDesc}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <h4 className="font-semibold text-primary">{t.catSymbols}</h4>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.catSymbolsDesc}</p>
              </div>
              <div className="rounded-xl border border-border/70 bg-card/70 p-5">
                <h4 className="font-semibold text-primary">{t.catBrands}</h4>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{t.catBrandsDesc}</p>
              </div>
            </div>
          </section>

          {/* 7. QA & Verification Matrix */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/60 pb-3">
              <ShieldCheckIcon className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight">{t.qaTitle}</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-3.5">
                <CheckCircle2Icon className="size-4 shrink-0 text-primary mt-0.5" />
                <span className="text-xs text-muted-foreground">{t.qa1}</span>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-3.5">
                <CheckCircle2Icon className="size-4 shrink-0 text-primary mt-0.5" />
                <span className="text-xs text-muted-foreground">{t.qa2}</span>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-3.5">
                <CheckCircle2Icon className="size-4 shrink-0 text-primary mt-0.5" />
                <span className="text-xs text-muted-foreground">{t.qa3}</span>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-3.5">
                <CheckCircle2Icon className="size-4 shrink-0 text-primary mt-0.5" />
                <span className="text-xs text-muted-foreground">{t.qa4}</span>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-3.5">
                <CheckCircle2Icon className="size-4 shrink-0 text-primary mt-0.5" />
                <span className="text-xs text-muted-foreground">{t.qa5}</span>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/40 p-3.5">
                <CheckCircle2Icon className="size-4 shrink-0 text-primary mt-0.5" />
                <span className="text-xs text-muted-foreground">{t.qa6}</span>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
